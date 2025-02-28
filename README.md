 # Regulations Agent System Backend

A backend system for handling university regulation queries using multiple specialized AI agents.

## Overview

This project implements a multi-agent system designed to answer questions about university regulations by leveraging:
- Knowledge base retrieval using hybrid search techniques
- Web search capabilities to find up-to-date information
- Manager agent architecture to coordinate specialized agents

## System Architecture

```
                           ┌───────────────┐
                           │  User Query   │
                           └──────┬────────┘
                                  │
           ┌──────────────────────┼──────────────────────┐
           │                      │                      │
           ▼                      ▼                      ▼
┌─────────────────┐    ┌─────────────────────────┐   ┌─────────────────┐
│Independent Web  │    │      Manager Agent      │   │Independent DB   │
│   Agent Path    │    │         Path            │   │   Agent Path    │
│ (Online Search, │    │ (Coordinates & Merges,  │   │ (Local Search,  │
│ up-to-date info)│    │  Comprehensive Answer)  │   │ Fast Retrieval) │
└──────┬──────────┘    └─────────────┬───────────┘   └──────┬──────────┘
       │                             │                      │
       ▼                             ▼                      ▼
┌─────────────┐            ┌─────────────┐         ┌─────────────┐
│  Web Agent  │            │  Web Agent  │         │   DB Agent  │
│  (Search)   │            │  (Search)   │         │ (Retrieval) │
└──────┬──────┘            └──────┬──────┘         └──────┬──────┘
       │                          │                       │
       ▼                          ▼                       ▼
┌─────────────┐            ┌─────────────┐         ┌─────────────┐
│Web Search   │            │ Hybrid      │         │ Hybrid      │
│   Tool      │            │ Retriever   │         │ Retriever   │
└─────────────┘            └─────────────┘         └─────────────┘
             \                   / \                   /
              \                 /   \                 /
               \               /     \               /
                \             /       \             /
                 └───────────▼─────────▼───────────┘
                           ┌─────────────┐
                           │   Response  │
                           └─────────────┘
```

## Features

- Multi-agent cooperation for comprehensive answers
- Hybrid search over regulation knowledge base
- Web search capability for up-to-date information
- FastAPI backend for easy integration

## Tech Stack

- Python 3.12+
- smolagents for agent implementation
- Hugging Face models (Qwen/Qwen2.5-Coder-32B-Instruct)
- FastAPI for the backend API
- Langchain for document handling and retrieval

## Agent Usage
The system offers flexibility in how you can use the agents:

- Web Agent: Specialized for retrieving information from the web
- DB Agent: Specialized for knowledge base retrieval using hybrid search
- Manager Agent: Coordinates both agents for comprehensive responses
All agents can be used independently or together through the manager agent.

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   cd agent/backend
   pip install poetry
   poetry install
   ```
3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Add your Hugging Face API token

4. Run the backend:

   ```
   uvicorn main:app --reload
   ```
## Frontend

The UI is maintained in a separate repository and integrates with the backend API to deliver an interactive experience. For details and source code, please visit the [Regulations Agent System Frontend](https://github.com/yusufbaykal/Regulations-Agent-System-Frontend) repository.