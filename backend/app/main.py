from fastapi import FastAPI

app = FastAPI(title="GovAssist AI")

@app.get("/")
def home():
    return {"message": "GovAssist AI is running"}