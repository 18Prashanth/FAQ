import os
from dotenv import load_dotenv
from pathlib import Path
from langchain_google_genai.chat_models import ChatGoogleGenerativeAI
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_community.document_loaders.csv_loader import CSVLoader
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate
from ..schemas import models
from fastapi import APIRouter

router = APIRouter()


load_dotenv()


api_key = os.environ["GOOGLE_API_KEY"]
if api_key is None:
    raise ValueError("GEMINI_API_KEY is not set in environment or .env file")


llm = ChatGoogleGenerativeAI(model="models/gemini-2.5-flash-preview-05-20", temperature = 0.7)


BASE_DIR = Path(__file__).resolve().parent.parent

INDEX_PATH = os.path.join(BASE_DIR, "faiss_index")
csv_path = os.path.join(BASE_DIR, "data/faqs.csv")


def load_faq_chain(csv_path):
    #Load CSV file
    loader = CSVLoader(file_path=csv_path, source_column='prompt')
    data = loader.load()

    #Initialize instructor embeddings using the GoogleGenerative AI
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")

    #create FAISS instance for vector database
    db = FAISS.from_documents(data, embeddings)
    db.save_local(INDEX_PATH)


    prompt_template = """Given the following context and a question, generate an answer based on this context only.
In the answer try to provide as much text as possible from "response" section in the source document context without making much changes.
If the answer is not found in the context, kindly state "I don't know, Ask me related to python" Don't try to make up an answer.


CONTEXT: {context}

QUESTION: {question}"""


    PROMPT = PromptTemplate(
    template=prompt_template, input_variables=["context", "question"]
    )
    chain_type_kwargs = {"prompt": PROMPT}



    #create retrieval-based QA chain
    qa_chain = RetrievalQA.from_chain_type(
        llm=llm,
        retriever=db.as_retriever(),
        chain_type="stuff",
        input_key="query",
        return_source_documents=True,
        chain_type_kwargs=chain_type_kwargs
        )

    return qa_chain



csv_path = os.path.join(BASE_DIR, "data/faqs.csv")

qa_chain = load_faq_chain(csv_path)

@router.post('/faq_question', response_model=models.FAQResponse)
def FAQ(request: models.FAQuestion):
    question = request.question
    if not question:
        return {"error": "Question not provided"}
    
    response = qa_chain.invoke({"query": question})
    answer = response["result"]

    return {"question": question, "answer": answer}
