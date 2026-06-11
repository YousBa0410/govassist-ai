from mistralai.client import Mistral

from app.core.config import MISTRAL_API_KEY
from app.llm.conversation_store import get_history, add_message

client = Mistral(api_key=MISTRAL_API_KEY)


def generate_response(session_id: str, user_message: str, tool_result: dict):

    history = get_history(session_id)

    system_prompt = """
        You are an eGovernment assistant for Côte d'Ivoire.
        
        RULES:
        
        - Detect the language of the user automatically.
        - Respond in the SAME language as the user message.
        - If the user writes in English, respond in English.
        - If the user writes in French, respond in French.
        
        - Use ONLY information present in tool_result.
        - Never invent data (tax, laws, deadlines, GDP, etc).
        - If information is missing, say it clearly.
        
        STYLE:
        
        - Professional
        - Clear
        - Helpful
        - Natural tone
    """

    messages = [
        {
            "role": "system",
            "content": system_prompt
        },

        *history,

        {
            "role": "assistant",
            "content": f"Tool result: {tool_result}"
        },

        {
            "role": "user",
            "content": user_message
        }
    ]

    response = client.chat.complete(
        model="mistral-small",
        messages=messages,
        temperature=0.1
    )

    answer = response.choices[0].message.content

    return answer