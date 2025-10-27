"""
Answer Generation System for AI Classroom Co-Pilot
Responsible for taking retrieved context and generating answers with citations
"""

import ollama
from typing import List, Dict, Any
import logging
from retrieval import SlideRetriever

logger = logging.getLogger(__name__)


class AnswerGenerator:
    def __init__(self, model: str = "llama3"):
        """Initialize the answer generator with local LLM"""
        self.model = model
        self.client = ollama.Client(host='http://localhost:11434')
        logger.info(f"AnswerGenerator initialized with model: {model}")

    def generate_answer(self, question: str, context: str) -> Dict[str, Any]:
        """
        Generate an answer using retrieved context and local LLM
        Ensures answers are based on course materials with proper citations
        """
        logger.info(f"Generating answer for question: '{question}'")

        # Build prompt that emphasizes citation and accuracy
        prompt = f"""You are an AI teaching assistant. Use the following course materials to answer the student's question.

{context}

STUDENT QUESTION: {question}

INSTRUCTIONS:
1. Answer clearly and concisely using ONLY the provided course materials
2. If the materials don't contain relevant information, say "I cannot answer based on the course materials"
3. Reference specific modules and slides in your answer (e.g., "As mentioned in Module 3, Slide 5...")
4. Keep your answer focused and educational

ANSWER:"""

        try:
            # Generate answer using local LLM
            response = self.client.generate(
                model=self.model,
                prompt=prompt,
                options={
                    'temperature': 0.1,  # Low temperature for consistent, factual answers
                    'top_p': 0.9,
                }
            )

            answer = response['response']
            logger.info("Answer generated successfully")

            return {
                "answer": answer,
                "context_used": context,
                "model_used": self.model
            }

        except Exception as e:
            logger.error(f"Error generating answer: {e}")
            return {
                "answer": "I'm sorry, I encountered an error while generating an answer.",
                "error": str(e)
            }


class RetrievalAugmentedGeneration:
    """
    Complete RAG pipeline combining retrieval and generation
    This is the main class that orchestrates the entire process
    """

    def __init__(self):
        self.retriever = SlideRetriever()
        self.generator = AnswerGenerator()
        logger.info("RAG pipeline initialized")

    def ask_question(self, question: str) -> Dict[str, Any]:
        """
        Complete RAG pipeline: retrieve relevant content and generate answer
        """
        logger.info(f"Processing question: '{question}'")

        # Step 1: Retrieve relevant content
        retrieval_result = self.retriever.retrieve_relevant_content(question)

        # Step 2: Generate answer using retrieved context
        generation_result = self.generator.generate_answer(
            question,
            retrieval_result['context']
        )

        # Combine results
        final_result = {
            "question": question,
            "answer": generation_result['answer'],
            "documents_retrieved": retrieval_result['documents_found'],
            "retrieval_context": retrieval_result['context'],
            "model_used": generation_result.get('model_used', 'gpt-oss')
        }

        logger.info(f"RAG pipeline completed. Retrieved {retrieval_result['documents_found']} documents.")
        return final_result


# Test the complete system
if __name__ == "__main__":
    rag_system = RetrievalAugmentedGeneration()

    test_question = "What are the main types of machine learning?"
    result = rag_system.ask_question(test_question)

    print(f"Question: {result['question']}")
    print(f"Documents Retrieved: {result['documents_retrieved']}")
    print(f"\nAnswer:\n{result['answer']}")
    print(f"\nModel Used: {result['model_used']}")