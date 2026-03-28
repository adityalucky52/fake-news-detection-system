FROM python:3.10-bullseye

# Create a non-root user with ID 1000 (Required by Hugging Face Spaces)
RUN useradd -m -u 1000 user
USER user
ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH

WORKDIR $HOME/app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

COPY --chown=user pyproject.toml ./
RUN pip install --no-cache-dir \
    "fastapi>=0.135.1" \
    "langchain>=1.2.12" \
    "langchain-community>=0.4.1" \
    "langchain-google-genai>=4.2.1" \
    "langchain-groq>=1.1.2" \
    "pydantic>=2.12.5" \
    "python-dotenv>=1.2.2" \
    "tavily-python>=0.7.23" \
    "uvicorn>=0.42.0"

COPY --chown=user . .

EXPOSE 7860
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]
