import json
import re
from mistralai.client import Mistral
from app.core.config import MISTRAL_API_KEY
from app.llm.responder import generate_response
from app.mcp.orchestrator import execute_tool

client = Mistral(api_key=MISTRAL_API_KEY)


TOOLS_SCHEMA = [
    "calculate_vat",
    "calculate_social_contributions",
    "get_tax_deadlines",
    "get_economic_indicators",
    "get_country_profile"
]


def route_user_message(message: str):

    system_prompt = f"""
        You are an AI router for an eGovernment MCP system.
        
        Available tools:
        {TOOLS_SCHEMA}
        
        Return ONLY raw JSON.
        
        Example:
        {{
          "tool": "calculate_vat",
          "params": {{
            "amount": 250000
          }}
        }}
        
        RULES:
        - Return ONLY JSON
        - No markdown
        - No ```json
        - No explanations
        - No extra text
    """

    response = client.chat.complete(
        model="mistral-tiny",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": message}
        ],
        temperature=0
    )

    result = response.choices[0].message.content

    print("RAW ROUTER =", result)

    match = re.search(r"\{[\s\S]*\}", result)

    if not match:
        return {"tool": None, "params": {}, "error": "No JSON found", "raw": result}

    try:
        return json.loads(match.group())
    except Exception as e:
        return {"tool": None, "params": {}, "error": str(e), "raw": result}


def chat(message: str):

    # ROUTING
    route = route_user_message(message)

    print("ROUTE =", route)

    tool_name = route.get("tool")
    params = route.get("params", {})

    if not tool_name:
        return {
            "tool_used": None,
            "data": None,
            "answer": "Je n'ai pas pu identifier le service à utiliser.",
            "error": route.get("error"),
            "raw": route.get("raw")
        }

    # NORMALISATION TOOL
    tool_name = tool_name.strip().lower().replace(" ", "_")

    # EXECUTION TOOL MCP
    try:
        tool_result = execute_tool(tool_name, params)
    except Exception as e:
        return {
            "tool_used": tool_name,
            "data": None,
            "answer": "Erreur lors de l'exécution du service.",
            "error": str(e)
        }

    # HUMAN RESPONSE
    answer = generate_response(message, tool_result)

    # FINAL OUTPUT
    return {
        "tool_used": tool_name,
        "data": tool_result,
        "answer": answer
    }