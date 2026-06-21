from pydantic import BaseModel, Field
from google import genai
from google.genai import types
from app.core.config import settings 

client = genai.Client(api_key=settings.GEMINI_API_KEY)

class AnalisisDesercion(BaseModel):
    nivel_riesgo: float = Field(description="Decimal 0.0 a 1.0 (1.0 = Riesgo Crítico, 0.0 = Riesgo Nulo)")
    motivo_riesgo: str = Field(description="'academico', 'economico', 'vocacional', 'institucional', o 'ninguno'")
    confianza: int = Field(description="Nivel de confianza 1-100")

INSTRUCCIONES_SISTEMA = """
Eres un analista experto en retención estudiantil para ingeniería.
Analiza el comentario y calcula la probabilidad de deserción.
Asigna 'nivel_riesgo' como float (0.0 a 1.0). 1.0 es abandono crítico, 0.0 es nulo/positivo.
Categoriza el motivo principal y tu nivel de confianza en la evaluación.
"""

async def analizar_comentario(pregunta: str, comentario: str) -> AnalisisDesercion:
    prompt = f"Pregunta original: {pregunta}\nRespuesta: {comentario}"
    
    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=prompt,
        config=types.GenerateContentConfig(
            system_instruction=INSTRUCCIONES_SISTEMA,
            response_mime_type="application/json",
            response_schema=AnalisisDesercion,
            temperature=0.2,
        ),
    )
    return AnalisisDesercion.model_validate_json(response.text)