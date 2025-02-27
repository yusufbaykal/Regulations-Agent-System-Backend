import os
from typing import Dict, List, Any, Optional
from smolagents import Tool
from langchain_community.utilities import DuckDuckGoSearchAPIWrapper

class WebSearchTool(Tool):
    name = "web_search"
    description = "Finds up-to-date information by searching the web."
    inputs = {
        "query": {
            "type": "string",
            "description": "Question or topic to search for.",
        }
    }
    output_type = "string"

    def __init__(self, **kwargs):
        """
        Initialize the WebSearchTool using DuckDuckGo search.
        """
        super().__init__(**kwargs)
        self.search = DuckDuckGoSearchAPIWrapper(max_results=5)

    def forward(self, query: str) -> str:
        try:
            search_results = self.search.run(f"{query}")
            
            if not search_results or search_results.strip() == "":
                return "No results found in web search."
                
            return f"Web Search Results:\n{search_results}"
        except Exception as e:
            return f"An error occurred during web search: {str(e)}"
