
import json

from mistralai.client import Mistral

from app.core.config import MISTRAL_API_KEY

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
        
        You must choose the correct tool from this list:
        {TOOLS_SCHEMA}
        
        Return ONLY valid JSON in this format:
        
        {{
          "tool": "...",
          "params": {{}}
        }}
        
        Rules:
        - Do NOT answer the question
        - ONLY select the tool
        - Extract parameters from the user message
    """

    response = client.chat.complete(
        model = "mistral-tiny",
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": message}
        ],
        temperature=0
    )

    result = response.choices[0].message.content

    try:
        return json.loads(result)
    except:
        return {
            "tool": None,
            "params": {},
            "error": "Invalid LLM output",
            "raw": result
        }