from smolagents import Tool
from smolagents import HfApiModel, CodeAgent
import os
from dotenv import load_dotenv
from Tools.web_search_tool import WebSearchTool

load_dotenv()


web_search_tool = WebSearchTool()

web_agent = CodeAgent(
    tools=[web_search_tool],
    model=HfApiModel(
        model_id="Qwen/Qwen2.5-Coder-32B-Instruct",
        token=os.getenv("HF_API_TOKEN"),
    ),
    max_steps=4,
    verbosity_level=2,
    name="web_agent",
    description="Agent that uses web search to find answers"
)