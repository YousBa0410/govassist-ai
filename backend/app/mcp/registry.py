TOOLS_REGISTRY = {
    "calculate_vat": {
        "description": "Calculate VAT and total amount",
        "input": {
            "amount": "float",
            "rate": "float (optional, default 0.18)"
        }
    },

    "get_tax_deadlines": {
        "description": "Get fiscal deadlines for a country",
        "input": {
            "country": "string"
        }
    },

    "calculate_social_contributions": {
        "description": "Calculate social security contributions",
        "input": {
            "salary": "float",
            "employees": "int"
        }
    },

    "get_economic_indicators": {
        "description": "Get GDP and economic indicators from World Bank API",
        "input": {
            "country": "string"
        }
    },

    "get_country_profile": {
        "description": "Get country information (capital, population, currency)",
        "input": {
            "country": "string"
        }
    }
}