def get_tax_deadlines(params: dict):
    country = params.get("country", "CI")

    return {
        "country": country,
        "deadlines": [
            {"type": "VAT", "date": "15th monthly"},
            {"type": "Income Tax", "date": "30th monthly"}
        ]
    }