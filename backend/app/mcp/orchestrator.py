from app.mcp.tools.vat import calculate_vat
from app.mcp.tools.social import calculate_social_contributions
from app.mcp.tools.tax import get_tax_deadlines
from app.mcp.tools.economics import get_economic_indicators
from app.mcp.tools.country import get_country_profile


def execute_tool(tool_name: str, params: dict):

    if tool_name == "calculate_vat":
        return calculate_vat(params)

    if tool_name == "calculate_social_contributions":
        return calculate_social_contributions(params)

    if tool_name == "get_tax_deadlines":
        return get_tax_deadlines(params)

    if tool_name == "get_economic_indicators":
        return get_economic_indicators(params)

    if tool_name == "get_country_profile":
        return get_country_profile(params)

    return {
        "error": "Tool not found",
        "tool": tool_name
    }