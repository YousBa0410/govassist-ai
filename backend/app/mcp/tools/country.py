import httpx

def get_country_profile(params: dict):
    country = params.get("country", "cote d ivoire")

    url = f"https://restcountries.com/v3.1/name/{country}"

    try:
        response = httpx.get(url, timeout=10)
        response.raise_for_status()

        data = response.json()

        if not isinstance(data, list) or len(data) == 0:
            return {
                "error": "Country not found",
                "raw": data
            }

        country_data = data[0]

        return {
            "name": country_data.get("name", {}).get("common"),
            "capital": country_data.get("capital", ["N/A"])[0],
            "population": country_data.get("population", None),
            "currency": list(country_data.get("currencies", {}).keys())[0]
            if country_data.get("currencies") else None
        }

    except httpx.HTTPError as e:
        return {
            "error": "HTTP error calling API",
            "details": str(e)
        }

    except Exception as e:
        return {
            "error": "Unexpected backend error",
            "details": str(e)
        }