import httpx

def get_country_profile(params: dict):
    country = params.get("country", "cote d ivoire")

    url = f"https://restcountries.com/v3.1/name/{country}"
    response = httpx.get(url)

    data = response.json()[0]

    return {
        "name": data["name"]["common"],
        "capital": data["capital"][0],
        "population": data["population"],
        "currency": list(data["currencies"].keys())[0]
    }