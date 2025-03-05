import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
import uvicorn

from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from app.Agent.multi_agent import manager_agent
from app.Agent.web_agent import web_agent
from app.Agent.db_agent import hybrid_agent
import time
from fastapi.responses import JSONResponse

app = FastAPI(
    title="University Legislation QA System",
    description="An API that answers questions related to university legislation",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


rate_limit = 5  
rate_limit_window = 60  
ip_request_count = {}  
ip_last_reset = {}  

class Query(BaseModel):
    question: str
    agent_type: str = "multi"

def process_query(query: str, agent_type: str) -> str:
    """
    Processes the query according to the selected agent type with specific instructions.
    
    Args:
        query: The user's question
        agent_type: Agent type ("multi", "web", or "db")
        
    Returns:
        String: The processed and synthesized answer
    """
    if agent_type == "web":
        return web_agent.run(f""" User asked: "{query}"

1. Search the web for the most up-to-date information related to this query.
2. Focus on university legislation during your search.
3. Generate an answer using the most relevant and reliable sources.
4. Ensure the answer is clear, understandable, and comprehensive.
5. Specify the source of the information and highlight uncertainties when necessary.
6. Return the answer in an academic tone and professional format.
7. Provide the final answer in Turkish.
""")
    elif agent_type == "db":
        return hybrid_agent.run(f""" User asked: "{query}"

1. Locate the most relevant documents in the legislation database related to this query.
2. Focus the search on university regulations and legislation.
3. Select the most accurate and comprehensive information.
4. Simplify the legislative language to produce a clear answer.
5. Specify the sources and regulation numbers used.
6. Return the answer in a clear, formal, and structured format.
7. Provide the final answer in Turkish.
""")
    else:
        return manager_agent.run(f""" User asked: "{query}"

1. Send this query to both web_agent and hybrid_agent.
2. Combine the results from both sources to create a comprehensive answer.
3. Use both database information and current web information in the answer.
4. If there is conflicting information, indicate this and, if possible, explain which source may be more reliable.
5. Give your answer in a clear, understandable and professional style.
6. Give the final answer in Turkish.
""")
 
@app.get("/")
async def root():
    return {"message": "Welcome to the University Legislation QA System"}

@app.middleware("http")
async def rate_limit_middleware(request: Request, call_next):
    client_ip = request.client.host
    current_time = time.time()
    
    if request.url.path == "/ask":
        if client_ip not in ip_last_reset or current_time - ip_last_reset[client_ip] > rate_limit_window:
            ip_request_count[client_ip] = 1
            ip_last_reset[client_ip] = current_time
        else:
            ip_request_count[client_ip] = ip_request_count.get(client_ip, 0) + 1
        
        if ip_request_count[client_ip] > rate_limit:
            return JSONResponse(
                status_code=429,
                content={"detail": "Rate limit exceeded. Please try again later."}
            )
    
    response = await call_next(request)
    return response

@app.post("/ask")
async def ask_question(query: Query):
    try:
        response = process_query(query.question, query.agent_type)
        return {"answer": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=False)