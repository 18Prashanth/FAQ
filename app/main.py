from fastapi import FastAPI
from .routers import faq_chain
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.templating import Jinja2Templates
from pathlib import Path
from fastapi import Request

app = FastAPI()

BASE_DIR = Path(__file__).resolve().parent

TEMPLATES_DIR = BASE_DIR.parent / "template"
STATIC_DIR = BASE_DIR.parent / "static"
print(STATIC_DIR)

app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

templates = Jinja2Templates(directory=TEMPLATES_DIR)


app.include_router(faq_chain.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8000"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", response_class=HTMLResponse)
async def get_homepage(request: Request):
    """Serve the main HTML page"""
    return templates.TemplateResponse("index.html", {"request": request})


