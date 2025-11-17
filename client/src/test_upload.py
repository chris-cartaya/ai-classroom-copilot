import pytest
from fastapi.testclient import TestClient
import io
import os
from unittest.mock import patch
from langchain_core.documents import Document

# Ensure the app can be imported
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from main import app, UPLOADS_DIR, CHROMA_DIR


# Clean up any created files in the uploads dir to keep tests idempotent
@pytest.fixture(autouse=True)
def cleanup_uploads():
    """Clean up dummy files created during tests."""
    # Before the test, do nothing
    yield
    # After the test, clean up files
    for filename in os.listdir(UPLOADS_DIR):
        if "test_" in filename:
            try:
                os.remove(os.path.join(UPLOADS_DIR, filename))
            except OSError as e:
                print(f"Error cleaning up test file: {e}")


client = TestClient(app)

def test_upload_file_too_large():
    """
    Test that uploading a file larger than 25MB returns an error.
    """
    # Create a dummy file in memory that is > 25MB
    large_file_content = b"a" * (26 * 1024 * 1024)  # 26 MB
    large_file = ("test_large_file.pptx", io.BytesIO(large_file_content), "application/vnd.openxmlformats-officedocument.presentationml.presentation")

    response = client.post(
        "/upload",
        files={"file": large_file},
        data={"week_title": "Test Week"}
    )

    assert response.status_code == 200  # App returns 200 for controlled errors
    json_response = response.json()
    assert "error" in json_response
    assert json_response["error"] == "File exceeds 25MB limit."


@patch("main.ingest_pptx_to_chroma")
def test_upload_valid_file(mock_ingest):
    """
    Test that uploading a valid file (small .pptx) succeeds and returns the material ID.
    """
    mock_ingest.return_value = 5  # Mocked to return 5 slides indexed

    # Create a small dummy file in memory
    small_file_content = b"dummy pptx content"
    small_file_name = "test_small_file.pptx"
    small_file = (small_file_name, io.BytesIO(small_file_content), "application/vnd.openxmlformats-officedocument.presentationml.presentation")

    response = client.post(
        "/upload",
        files={"file": small_file},
        data={"week_title": "Test Week"}
    )

    assert response.status_code == 200, f"Expected status 200, got {response.status_code}. Body: {response.text}"
    json_response = response.json()

    assert "error" not in json_response, f"Received an unexpected error: {json_response.get('error')}"
    assert "id" in json_response
    assert json_response["status"] == "processed"
    assert json_response["filename"] == small_file_name
    assert json_response["size_bytes"] == len(small_file_content)
    assert json_response["slides_indexed"] == 5

    # Check if the file was actually saved
    saved_path = os.path.join(UPLOADS_DIR, small_file_name)
    assert os.path.exists(saved_path)

    # Check that ingest was called correctly
    expected_chroma_dir = os.path.join(os.path.dirname(__file__), "chroma_db")
    mock_ingest.assert_called_once_with(saved_path, week_title="Test Week", persist_directory=expected_chroma_dir)


@patch("main.ingest_pptx_to_chroma")
@patch("main.pptx_to_documents")
def test_view_material_content(mock_pptx_to_docs, mock_ingest):
    """
    Test that the view endpoint returns extracted content for a valid material.
    """
    # --- Setup Mocks ---
    mock_ingest.return_value = 2
    mock_doc_content = [
        Document(page_content="Slide 1 content", metadata={"source": "test_view_file.pptx", "module": "Test View Week", "slide": 1}),
        Document(page_content="Slide 2 content", metadata={"source": "test_view_file.pptx", "module": "Test View Week", "slide": 2}),
    ]
    mock_pptx_to_docs.return_value = mock_doc_content

    # --- 1. Upload a file to create a material ---
    small_file_content = b"dummy pptx content"
    small_file_name = "test_view_file.pptx"
    small_file = (small_file_name, io.BytesIO(small_file_content), "application/vnd.openxmlformats-officedocument.presentationml.presentation")

    upload_response = client.post(
        "/upload",
        files={"file": small_file},
        data={"week_title": "Test View Week"}
    )
    
    assert upload_response.status_code == 200
    upload_json = upload_response.json()
    assert "id" in upload_json
    material_id = upload_json["id"]

    # --- 2. Call the view endpoint ---
    view_response = client.get(f"/materials/{material_id}/view")

    # --- 3. Assert the response ---
    assert view_response.status_code == 200
    view_json = view_response.json()

    assert view_json["filename"] == small_file_name
    assert view_json["week_title"] == "Test View Week"
    assert len(view_json["content"]) == 2
    assert view_json["content"][0]["slide"] == 1
    assert view_json["content"][0]["content"] == "Slide 1 content"
    assert view_json["content"][1]["slide"] == 2
    assert view_json["content"][1]["content"] == "Slide 2 content"

    # --- 4. Verify mocks were called ---
    saved_path = os.path.join(UPLOADS_DIR, small_file_name)
    mock_pptx_to_docs.assert_called_once_with(saved_path, week_title="Test View Week")