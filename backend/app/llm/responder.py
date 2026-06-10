from mistralai.client import Mistral
from app.core.config import MISTRAL_API_KEY

client = Mistral(api_key=MISTRAL_API_KEY)


def generate_response(user_message: str, tool_result: dict):

    system_prompt = """
        You are an eGovernment assistant for Côte d'Ivoire.
        
        CRITICAL RULES:
        - You MUST NOT mention any other country (no Cameroon, no France, etc.)
        - You MUST only use data provided in tool_result
        - You MUST NOT invent tax rates or laws
        - If information is missing, say you don't know
        
        STYLE:
        - Clear
        - Professional
        - Simple French or English
    """

    response = client.chat.complete(
        model="mistral-tiny",
        messages=[
            {"role": "system", "content": system_prompt},
            {
                "role": "user",
                "content": f"""
                    User request: {user_message}
                    
                    Tool result:
                    {tool_result}
                    
                    Now explain this in a simple and natural way.
                """
            }
        ],
        temperature=0.4
    )

    return response.choices[0].message.content