import pytest
from fastapi.testclient import TestClient
import os

# Ensure the app can be imported
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from main import app

client = TestClient(app)

# Fixture to reset profile data after each test to ensure test isolation
@pytest.fixture(autouse=True)
def reset_profile_after_test():
    """Fixture to reset the profile to its default state after each test."""
    # Default state (can be extracted from profile.py or defined here)
    default_profile = {
        "name": "Alex Doe",
        "email": "alex.doe@example.com",
        "role": "student",
        "preferences": {
            "theme": "dark",
            "fontSize": "medium",
            "notifications": {
                "newMaterial": True,
                "newReply": True,
            }
        }
    }
    yield
    # Teardown: reset the profile by sending a PUT request with the full default object
    client.put("/profile", json=default_profile)


def test_get_profile():
    """Test retrieving the default user profile."""
    response = client.get("/profile")
    assert response.status_code == 200
    profile = response.json()
    assert profile["name"] == "Alex Doe"
    assert profile["role"] == "student"
    assert profile["preferences"]["theme"] == "dark"

def test_update_profile_role():
    """Test updating just the role."""
    update_response = client.put(
        "/profile",
        json={"role": "instructor"}
    )
    assert update_response.status_code == 200
    updated_profile = update_response.json()
    assert updated_profile["role"] == "instructor"
    # Check that other fields are untouched
    assert updated_profile["name"] == "Alex Doe"

    # Verify the change is persisted for the mock "session"
    get_response = client.get("/profile")
    assert get_response.json()["role"] == "instructor"

def test_update_profile_nested_preference():
    """Test updating a single nested field in the profile preferences."""
    update_response = client.put(
        "/profile",
        json={
            "preferences": {
                "theme": "light"
            }
        }
    )
    assert update_response.status_code == 200
    updated_profile = update_response.json()
    assert updated_profile["preferences"]["theme"] == "light"
    # Check that other preferences are untouched
    assert updated_profile["preferences"]["fontSize"] == "medium"

    # Verify persistence
    get_response = client.get("/profile")
    assert get_response.json()["preferences"]["theme"] == "light"

def test_update_full_profile():
    """Test updating multiple fields at once."""
    full_update = {
        "name": "Jane Smith",
        "email": "jane.smith@example.com",
        "role": "instructor",
        "preferences": {
            "theme": "light",
            "fontSize": "large",
            "notifications": {
                "newMaterial": False,
                "newReply": False
            }
        }
    }
    response = client.put("/profile", json=full_update)
    assert response.status_code == 200
    updated_profile = response.json()
    assert updated_profile["name"] == "Jane Smith"
    assert updated_profile["role"] == "instructor"
    assert updated_profile["preferences"]["fontSize"] == "large"
    assert updated_profile["preferences"]["notifications"]["newMaterial"] == False
