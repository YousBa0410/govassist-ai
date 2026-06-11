import json
import re

from mistralai.client import Mistral

from app.core.config import MISTRAL_API_KEY
from app.llm.conversation_store import get_history, add_message
from app.llm.responder import generate_response
from app.mcp.orchestrator import execute_tool


client = Mistral(api_key=MISTRAL_API_KEY)


TOOLS_SCHEMA = [
    "none",
    "calculate_vat",
    "calculate_social_contributions",
    "get_tax_deadlines",
    "get_economic_indicators",
    "get_country_profile"
]


def route_user_message(session_id: str, message: str):
    history = get_history(session_id)

    system_prompt = f"""
        You are an AI router for an eGovernment MCP system.
        
        Available tools:
        {TOOLS_SCHEMA}
        
        Return ONLY raw JSON.
        
        Examples:
        
        {{
            "tool":"calculate_vat",
            "params": {{
                "amount": 250000
            }}
        }}
        
        {{
            "tool":"none",
            "params": {{}}
        }}
        
        RULES:
        
        - Return ONLY JSON
        - No markdown
        - No explanation
        - No extra text
        
        If the user is:
        - greeting
        - thanking
        - chatting
        - asking who you are
        
        return:
        
        {{
            "tool":"none",
            "params": {{}}
        }}
    """

    messages = [
        {"role": "system", "content": system_prompt},
        *history,
        {"role": "user", "content": message}
    ]

    response = client.chat.complete(
        model="mistral-tiny",
        messages=messages,
        temperature=0
    )

    result = response.choices[0].message.content

    match = re.search(r"\{[\s\S]*\}", result)

    if not match:
        return {
            "tool": None,
            "params": {},
            "error": "No JSON found",
            "raw": result
        }

    try:
        return json.loads(match.group())

    except Exception as e:
        return {
            "tool": None,
            "params": {},
            "error": str(e),
            "raw": result
        }


def chat(session_id: str, message: str):

    route = route_user_message(
        session_id,
        message
    )

    add_message(
        session_id,
        "user",
        message
    )

    tool_name = route.get("tool")
    params = route.get("params", {})

    if tool_name == "none":

        answer = generate_response(
            session_id=session_id,
            user_message=message,
            tool_result={}
        )

        add_message(
            session_id,
            "assistant",
            answer
        )

        return {
            "tool_used": None,
            "data": None,
            "answer": answer
        }

    if not tool_name:
        return {
            "tool_used": None,
            "data": None,
            "answer": "Je n'ai pas compris votre demande.",
            "error": route.get("error")
        }

    tool_name = tool_name.strip().lower().replace(" ", "_")

    try:
        tool_result = execute_tool(
            tool_name,
            params
        )

    except Exception as e:

        return {
            "tool_used": tool_name,
            "data": None,
            "answer": "Erreur lors de l'exécution du service.",
            "error": str(e)
        }

    answer = generate_response(
        session_id=session_id,
        user_message=message,
        tool_result=tool_result
    )

    add_message(
        session_id,
        "assistant",
        answer
    )

    return {
        "tool_used": tool_name,
        "data": tool_result,
        "answer": answer,
        "error": None
    }