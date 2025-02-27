import datasets
from langchain.docstore.document import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter
from smolagents import HfApiModel, CodeAgent
import os
from dotenv import load_dotenv
from Tool.web_search_tool import WebSearchTool
from Tool.hybrid_retriever_tool import HybridRetrieverTool

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

hybrid_retriever_tool = HybridRetrieverTool(docs_processed)

hybrid_agent = CodeAgent(
    tools=[hybrid_retriever_tool],
    model=HfApiModel(
        model_id="Qwen/Qwen2.5-Coder-32B-Instruct",
        token=os.getenv("HF_API_TOKEN"),
    ),
    max_steps=4,
    verbosity_level=2,
    name="hybrid_agent",
    description="Agent that uses hybrid retriever to find answers"
)