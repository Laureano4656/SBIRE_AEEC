from typing import Literal
import datetime 

from pydantic import BaseModel

class QuestionAnswersResponse(BaseModel):
    pregunta: str
    respuesta: str
    