def calculate_vat(params: dict):
    amount = params.get("amount", 0)
    rate = params.get("rate", 0.18)

    vat = amount * rate
    total = amount + vat

    return {
        "amount": amount,
        "vat": vat,
        "total": total
    }