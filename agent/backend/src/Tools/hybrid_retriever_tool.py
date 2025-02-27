import datasets
from langchain.docstore.document import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.retrievers import BM25Retriever
from smolagents import Tool
from smolagents import HfApiModel, CodeAgent
from sentence_transformers import SentenceTransformer
import numpy as np
from typing import Any
import os
from dotenv import load_dotenv

load_dotenv()

knowledge_base = datasets.load_dataset("yusufbaykaloglu/University_Mevzuat_QA_v2", split="train")
knowledge_base = knowledge_base.filter(lambda row: row["answers"])

source_docs = [
    Document(page_content=doc["questions"], metadata={"answers": doc["answers"]})
    for doc in knowledge_base
]

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=50,
    add_start_index=True,
    strip_whitespace=True,
    separators=["\n\n", "\n", ".", " ", ""],
)
docs_processed = text_splitter.split_documents(source_docs)

class HybridRetrieverTool(Tool):
    name = "hybrid_retriever"
    description = "It finds the most relevant documents using both BM25 and semantic search."
    inputs = {
        "query": {
            "type": "string",
            "description": "Question or topic to search for.",
        }
    }
    output_type = "string"

    def __init__(self, docs, **kwargs):
        super().__init__(**kwargs)
        self.docs = docs
        self.bm25_retriever = BM25Retriever.from_documents(docs, k=10)
        self.encoder = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2', token=os.getenv('HF_API_TOKEN'),
                                               tokenizer_kwargs={'clean_up_tokenization_spaces': True}
)
        self.doc_embeddings = self.encoder.encode([doc.page_content for doc in docs])

    def hybrid_search(self, query: str, alpha: float = 0.5):
        try:
            bm25_docs = self.bm25_retriever.invoke(query)
            bm25_scores = np.zeros(len(self.docs))
            
            for i, doc in enumerate(bm25_docs):
                doc_index = self.docs.index(doc)
                bm25_scores[doc_index] = 1.0 / (i + 1)
            
            query_embedding = self.encoder.encode(query)
            semantic_scores = np.dot(self.doc_embeddings, query_embedding)
            
            bm25_normalized = bm25_scores / np.max(bm25_scores) if np.max(bm25_scores) > 0 else bm25_scores
            semantic_normalized = semantic_scores / np.max(semantic_scores) if np.max(semantic_scores) > 0 else semantic_scores
            
            final_scores = alpha * bm25_normalized + (1 - alpha) * semantic_normalized
            top_indices = np.argsort(final_scores)[-3:][::-1]
            
            return [self.docs[i] for i in top_indices]
        except Exception as e:
            print(f"Hybrid search error: {str(e)}")
            return []

    def forward(self, query: str) -> str:
        try:
            best_docs = self.hybrid_search(query)
            
            if not best_docs:
                return "No relevant information on this issue was found."
            
            results = []
            for i, doc in enumerate(best_docs, 1):
                results.append(f"\n=== Document {i} ===")
                results.append(f"Question: {doc.page_content}")
                results.append(f"Answer: {doc.metadata['answers']}")
                results.append("="*40)
            
            return "\n".join(results)
        except Exception as e:
            return f"An error occurred during the search: {str(e)}"
