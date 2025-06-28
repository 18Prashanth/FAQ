# FAQ Application

# 🧠 AI-Powered FAQ Chatbot

An interactive AI-powered chatbot built using **FastAPI**, **LangChain**, **Gemini (Google Generative AI)**, and **FAISS**. It loads FAQ content from a CSV file and provides intelligent, contextual answers to user questions through a frontend interface.

## 🚀 Features

- 📁 Load FAQs from CSV
- 🤖 Answer questions using Gemini (via LangChain)
- 📚 Vector search with FAISS
- 🖥️ Beautiful chat UI with typing animation
- 🌐 Full-stack with FastAPI + Bootstrap frontend
- 📦 Modular and extensible codebase

---

## 🛠️ Tech Stack

| Layer      | Technology                            |
| ---------- | ------------------------------------- |
| Frontend   | HTML, CSS (Bootstrap), JavaScript     |
| Backend    | FastAPI, LangChain                    |
| Embeddings | GoogleGenerativeAIEmbeddings (Gemini) |
| LLM        | Gemini 1.5 Flash                      |
| Vector DB  | FAISS                                 |
| File I/O   | CSVLoader from LangChain              |
| Hosting    | Localhost (Uvicorn)                   |

---

## 📁 Folder Structure

```
FAQ/
├── app/
│ ├── main.py             # FastAPI entry point
│ ├── routers/
│ │ └── faq_chain.py      # LLM chain logic with LangChain + Gemini
│ ├── schemas/
│ │ └── models.py         # Pydantic models
├── static/
│ ├── app.js              # Frontend logic
│ ├── style.css           # UI styling
├── template/
│ └── index.html          # Chat UI
├── data/
│ └── faqs.csv            # FAQ dataset
├── .env                  # Gemini API Key
├── requirements.txt      # All dependencies
```

## 📦 Installation

### 1. Clone the repository

```
git clone https://github.com/18Prashanth/FAQ.git
cd FAQ

```

### 2. Create a virtual environment

```
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate
```

### 3. Install dependencies

```
pip install -r requirements.txt
```

### 4. Set your Google Gemini API key

Create a .env file in the root directory:

```
GOOGLE_API_KEY=your-gemini-api-key-here
```

🧪 Run the App

```
uvicorn app.main:app --reload
```

## Visit the app in your browser:

```
👉 http://localhost:8000
```

## 📄 API Endpoint

| Method | Endpoint        | Description                       |
| ------ | --------------- | --------------------------------- |
| POST   | `/faq_question` | Ask a question and get a response |
| GET    | `/`             | Loads the frontend (chat UI)      |

## 📷 UI Preview

## ![App Screenshot](/img1.png)

## ![App Screenshot](/img2.png)

## 💡 Author

Prashanth Gowda A S

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Profile-blue?logo=linkedin)](https://www.linkedin.com/in/prashanthgowdaas/)
