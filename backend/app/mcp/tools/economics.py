import httpx


COUNTRY_MAP = {
    "côte d'ivoire": "CI",
    "cote d ivoire": "CI",
    "ivory coast": "CI",
    "ci": "CI"
}


def get_economic_indicators(params: dict):

    raw_country = params.get("country", "CI")

    country = COUNTRY_MAP.get(
        raw_country.lower().strip(),
        raw_country.upper()
    )

    url = f"https://api.worldbank.org/v2/country/{country}/indicator/NY.GDP.MKTP.CD?format=json"

    try:
        response = httpx.get(url, timeout=10)
        response.raise_for_status()

        data = response.json()

        if not isinstance(data, list) or len(data) < 2:
            return {
                "error": "Invalid API response",
                "debug": data
            }

        indicators = data[1]

        latest = next(
            (item for item in indicators if item.get("value") is not None),
            None
        )

        if not latest:
            return {
                "error": "No valid GDP data found"
            }

        return {
            "country": "Côte d'Ivoire",
            "country_code": country,
            "gdp": latest["value"],
            "year": latest["date"],
            "source": "World Bank"
        }

    except httpx.HTTPError as e:
        return {
            "error": "HTTP error calling World Bank API",
            "details": str(e)
        }

    except Exception as e:
        return {
            "error": "Unexpected error",
            "details": str(e)
        }