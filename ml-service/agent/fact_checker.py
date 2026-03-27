import os
from langchain_groq import ChatGroq
from langchain_community.tools.tavily_search import TavilySearchResults
from langgraph.prebuilt import create_react_agent
from langchain_core.messages import HumanMessage
from dotenv import load_dotenv
import json

# Load environment variables (like GROQ_API_KEY and TAVILY_API_KEY)
load_dotenv()

# 1. Initialize the FREE Groq Model (Llama 3.3 70B)
llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    api_key=os.getenv("GROQ_API_KEY"),
    temperature=0.2 # low temp for more factual consistency
)

# 2. Initialize the Tavily Search Tool
search = TavilySearchResults(max_results=3)
tools = [search]

# 3. Create Fact-Checking Agent
agent_executor = create_react_agent(llm, tools)

async def analyze_url(url: str) -> dict:
    """
    Passes the URL to the agent to research and fact-check.
    """
    try:
        prompt_text = f"A user wants to check this URL: {url}. Please research the claims on that page or news regarding that URL."
        return await _run_analysis(prompt_text)
    except Exception as e:
        print(f"Error checking fact from URL: {str(e)}")
        return {
            "label": "ERROR",
            "trust_score": 0,
            "explanation": f"Failed to analyze the URL. Error: {str(e)}"
        }

async def analyze_text(text: str) -> dict:
    """
    Fact-checks raw text directly using RAG.
    """
    try:
        return await _run_analysis(text)
    except Exception as e:
        print(f"Error checking fact from text: {str(e)}")
        return {
            "label": "ERROR",
            "trust_score": 0,
            "explanation": f"Failed to analyze the text. Error: {str(e)}"
        }

async def _run_analysis(input_query: str) -> dict:
    if len(input_query.strip()) < 10:
             return {
                "label": "UNKNOWN",
                "trust_score": 0,
                "explanation": "Could not extract enough meaningful text to verify."
            }

    # Step 4: Define the Agent Prompt
    prompt = f"""
    You are an expert, unbiased fact-checking journalist. 
    A user has submitted the following query, text, or URL:
    "{input_query}"
    
    1. First, MUST use your TavilySearch tool to search the internet and verify if reputable news sources are corroborating or debunking this claim.
    2. Then, based on the search results, decide if the overall claim is REAL, FAKE, or MISLEADING.
    
    You MUST respond in your final answer strictly in the following JSON format without formatting code blocks like ```json:
    {{
        "label": "REAL" | "FAKE" | "MISLEADING",
        "trust_score": <number between 0 and 100>,
        "explanation": "<your 2-3 sentence explanation citing the search results>"
    }}
    """
    
    print("Sending to LangGraph Agent for active RAG research...")
    
    # Use HumanMessage for LangGraph
    result = await agent_executor.ainvoke({"messages": [HumanMessage(content=prompt)]})
    
    try:
        output_txt = result['messages'][-1].content.strip()
        if output_txt.startswith("```json"):
            output_txt = output_txt.replace("```json", "").replace("```", "").strip()
        
        parsed_json = json.loads(output_txt)
        return parsed_json
    except Exception as e:
        raw = result['messages'][-1].content if result.get('messages') else "No output"
        print(f"Failed to parse agent JSON output: {e}. Raw output: {raw}")
        return {
            "label": "ERROR",
            "trust_score": 0,
            "explanation": "Agent found results but failed to format them correctly."
        }
