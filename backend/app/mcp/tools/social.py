def calculate_social_contributions(params: dict):
    salary = params.get("salary", 0)
    employees = params.get("employees", 1)

    total_salary = salary * employees
    contribution = total_salary * 0.045

    return {
        "total_salary": total_salary,
        "contribution": contribution
    }