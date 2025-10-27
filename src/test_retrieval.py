"""
Tests for the Data Retrieval and Generation System
Demonstrates that your code works correctly
"""

import pytest
import sys
import os

# Add current directory to path so we can import our modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from retrieval import SlideRetriever
from generation import AnswerGenerator, RetrievalAugmentedGeneration


def test_embedding_creation():
    """Test that queries can be converted to embedding vectors"""
    print("Testing embedding creation...")
    retriever = SlideRetriever()

    query = "test query about artificial intelligence"
    embedding = retriever.embed_query(query)

    # Check that we get a valid embedding vector
    assert isinstance(embedding, list), "Embedding should be a list"
    assert len(embedding) > 100, "Embedding vector should have reasonable length"
    print("✅ Embedding creation test passed!")


def test_similarity_search():
    """Test that similarity search returns documents with scores"""
    print("Testing similarity search...")
    retriever = SlideRetriever()

    query = "machine learning"
    results = retriever.similarity_search(query, k=2)

    # Check that we get results in expected format
    assert isinstance(results, list), "Results should be a list"
    if results:  # If we have documents in the database
        doc, score = results[0]
        assert hasattr(doc, 'page_content'), "Document should have content"
        assert hasattr(doc, 'metadata'), "Document should have metadata"
        assert isinstance(score, float), "Score should be a float"
        assert 0 <= score <= 1, "Score should be between 0 and 1"

    print("✅ Similarity search test passed!")


def test_context_formatting():
    """Test that documents are properly formatted for LLM"""
    print("Testing context formatting...")
    retriever = SlideRetriever()

    # Create mock documents for testing
    from langchain.schema import Document
    mock_documents = [
        (
            Document(
                page_content="Supervised learning uses labeled data for training.",
                metadata={"source": "module1.pdf", "slide": "5", "module": "1"}
            ),
            0.85  # similarity score
        )
    ]

    context = retriever.format_context_for_llm(mock_documents)

    # Check that context contains key information
    assert "Supervised learning" in context
    assert "Slide 5" in context
    assert "Module 1" in context
    assert "REFERENCE" in context
    print("✅ Context formatting test passed!")


def test_complete_rag_pipeline():
    """Test the complete retrieval and generation pipeline"""
    print("Testing complete RAG pipeline...")

    rag_system = RetrievalAugmentedGeneration()

    # Test with a simple question
    question = "What is artificial intelligence?"
    result = rag_system.ask_question(question)

    # Check that we get a complete result
    assert "question" in result
    assert "answer" in result
    assert "documents_retrieved" in result
    assert result["question"] == question
    assert isinstance(result["answer"], str)

    print("✅ Complete RAG pipeline test passed!")
    print(f"   Question: {result['question']}")
    print(f"   Answer length: {len(result['answer'])} characters")
    print(f"   Documents found: {result['documents_retrieved']}")


if __name__ == "__main__":
    print("Running Data Retrieval and Generation Tests...")
    print("=" * 50)

    test_embedding_creation()
    test_similarity_search()
    test_context_formatting()
    test_complete_rag_pipeline()

    print("=" * 50)
    print("🎉 ALL TESTS PASSED! Your retrieval system is working correctly!")