from pydantic import BaseModel


class FAQuestion(BaseModel):
    question: str

class FAQResponse(BaseModel):
    question: str
    answer: str