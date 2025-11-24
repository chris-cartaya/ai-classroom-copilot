"""
Data Retrieval System for AI Classroom Co-Pilot
Updated for LangChain 1.0+
"""

from langchain_chroma import Chroma
from langchain_ollama import OllamaEmbeddings
from langchain_core.documents import Document
from typing import List, Tuple, Dict, Any
import logging

logger = logging.getLogger(__name__)

class SlideRetriever:
    def __init__(self, persist_directory: str = "./chroma_db"):
        """Initialize the retrieval system with embedding model and ChromaDB"""
        logger.info("Initializing SlideRetriever...")

        # Initialize embedding model - this converts text to vectors
        self.embedding_model = OllamaEmbeddings(
            model="nomic-embed-text",
            base_url="http://localhost:11434"
        )

        # Connect to Chroma vector database
        self.vector_store = Chroma(
            persist_directory=persist_directory,
            embedding_function=self.embedding_model
        )

        logger.info("SlideRetriever initialized successfully")

    def embed_query(self, query: str) -> List[float]:
        """
        Convert a text query into an embedding vector
        This enables semantic search by representing meaning as numbers
        """
        logger.debug(f"Embedding query: '{query}'")
        embedding = self.embedding_model.embed_query(query)
        logger.debug(f"Generated embedding vector of length: {len(embedding)}")
        return embedding

    def similarity_search(self, query: str, k: int = 5) -> List[Tuple[Document, float]]:
        """
        Find the most similar slide content to the query
        Returns documents with similarity scores (0-1, where 1 is perfect match)
        """
        logger.info(f"Searching for similar content to: '{query}'")

        # This is the core similarity search - Chroma compares vectors
        results = self.vector_store.similarity_search_with_score(
            query,
            k=k  # Return top k most similar documents
        )

        logger.info(f"Found {len(results)} relevant documents")

        # Log the similarity scores for debugging
        for i, (doc, score) in enumerate(results):
            logger.debug(f"Result {i+1}: score={score:.3f}, source={doc.metadata.get('source', 'Unknown')}")

        return results

    def format_context_for_llm(self, documents: List[Tuple[Document, float]]) -> str:
        """
        Format retrieved documents into context that the LLM can understand
        This is crucial for generating accurate, cited responses
        """
        if not documents:
            return "No relevant course materials found."

        context_parts = ["RELEVANT COURSE MATERIALS:"]

        for i, (document, similarity_score) in enumerate(documents):
            content = document.page_content
            metadata = document.metadata
            logger.info(f"Processing document with metadata: {metadata}")

            # Build citation information
            citation_parts = []
            if 'source' in metadata:
                source_name = metadata['source']
                citation_parts.append(f"File: {source_name}")
                if 'module' in metadata:
                    module_name = str(metadata['module'])
                    # Add module only if it's not a "Week" module OR if the filename doesn't contain a "Module" identifier
                    if not (module_name.lower().startswith("week ") and "module " in source_name.lower()):
                        citation_parts.append(f"Module: {module_name}")
            elif 'module' in metadata:
                # Fallback if source isn't there
                citation_parts.append(f"Module: {metadata['module']}")

            if 'slide' in metadata:
                citation_parts.append(f"Slide: {metadata['slide']}")

            citation = " | ".join(citation_parts)
            confidence = f"(Relevance: {similarity_score:.2f})"

            context_parts.append(
                f"\n--- REFERENCE {i+1} {confidence} ---\n"
                f"Content: {content}\n"
                f"Citation: {citation}\n"
            )

        return "\n".join(context_parts)

    def retrieve_relevant_content(self, query: str) -> Dict[str, Any]:
        """
        Complete retrieval pipeline: from query to formatted context
        This is your main function that ties everything together
        """
        logger.info(f"Starting retrieval pipeline for query: '{query}'")

        # Step 1: Convert query to embedding
        query_embedding = self.embed_query(query)

        # Step 2: Find similar content in database
        similar_documents = self.similarity_search(query, k=3)

        # Step 3: Format for LLM consumption
        context = self.format_context_for_llm(similar_documents)

        # Prepare results
        result = {
            "query": query,
            "context": context,
            "documents_found": len(similar_documents),
            "documents": similar_documents,
            "query_embedding_length": len(query_embedding)
        }

        logger.info(f"Retrieval complete. Found {len(similar_documents)} documents.")
        return result


# Simple usage example
if __name__ == "__main__":
    # Test the retrieval system
    retriever = SlideRetriever()

    test_query = "What is machine learning?"
    result = retriever.retrieve_relevant_content(test_query)

    print(f"Query: {result['query']}")
    print(f"Found {result['documents_found']} documents")
    print("\nFormatted Context:")
    print(result['context'][:500] + "..." if len(result['context']) > 500 else result['context'])