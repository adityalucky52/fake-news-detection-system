from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl, Field
from agent.fact_checker import analyze_url, analyze_text

app = FastAPI(
    title="Fake News Detection ML Service",
    description="A microservice to fact-check news using Langchain and Groq."
)

# Allow requests from the Express backend or React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://localhost:5000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class URLRequest(BaseModel):
    url: HttpUrl

class TextRequest(BaseModel):
    text: str = Field(..., min_length=50)

@app.get("/")
def read_root():
    return {"status": "success", "message": "ML Service is running!"}

@app.post("/predict")
async def predict_url(request: URLRequest):
    """
    Receives a URL, scrapes its content, and runs it through the Langchain Fact Checker.
    """
    url_str = str(request.url)
    print(f"Received request to analyze URL: {url_str}")
    
    result = await analyze_url(url_str)
    
    if result.get("label") == "ERROR":
         raise HTTPException(status_code=500, detail=result["explanation"])
         
    return result

@app.post("/predict_text")
async def predict_text(request: TextRequest):
    """
    Receives raw text and runs it through the Langchain Fact Checker.
    """
    print(f"Received request to analyze text (length: {len(request.text)})")
    
    result = await analyze_text(request.text)
    
    if result.get("label") == "ERROR":
         raise HTTPException(status_code=500, detail=result["explanation"])
         
    return result
