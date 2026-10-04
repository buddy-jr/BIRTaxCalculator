# tax_calculator.py
# Run with: python tax_calculator.py

import sys

def calculate_philhealth(gross_monthly_salary):
    if gross_monthly_salary <= 10000:
        return 250.0
    elif gross_monthly_salary >= 100000:
        return 2500.0
    return gross_monthly_salary * 0.025

def calculate_gsis(gross_monthly_salary):
    return gross_monthly_salary * 0.09

def calculate_pagibig(gross_monthly_salary):
    contribution = gross_monthly_salary * 0.02
    return 200.0 if contribution > 200 else contribution

def calculate_monthly_withholding_tax(taxable_income):
    if taxable_income <= 20833:
        return 0.0
    elif taxable_income <= 33332:
        return (taxable_income - 20833) * 0.15
    elif taxable_income <= 66666:
        return 1875.0 + (taxable_income - 33333) * 0.20
    elif taxable_income <= 166666:
        return 8541.80 + (taxable_income - 66667) * 0.25
    elif taxable_income <= 666666:
        return 33541.80 + (taxable_income - 166667) * 0.30
    else:
        return 183541.80 + (taxable_income - 666667) * 0.35

def main():
    print("=== BIR Government Employee Tax Calculator ===")
    
    name = input("Enter Employee Name: ").strip()
    if not name:
        print("Name cannot be empty.")
        sys.exit(1)
        
    salary_input = input("Enter Monthly Gross Salary (PHP): ").strip()
    try:
        gross_salary = float(salary_input)
        if gross_salary <= 0:
            raise ValueError
    except ValueError:
        print("Invalid salary input.")
        sys.exit(1)

    philhealth = calculate_philhealth(gross_salary)
    gsis = calculate_gsis(gross_salary)
    pagibig = calculate_pagibig(gross_salary)
    total_deductions = philhealth + gsis + pagibig

    taxable_income = gross_salary - total_deductions
    withholding_tax = calculate_monthly_withholding_tax(taxable_income)
    net_take_home_pay = gross_salary - total_deductions - withholding_tax

    print("\n-------------------------------------------")
    print(f"Tax Computation Summary for: {name}")
    print("-------------------------------------------")
    print(f"Gross Salary:           PHP {gross_salary:,.2f}")
    print(f"PhilHealth Contribution: PHP {philhealth:,.2f}")
    print(f"GSIS Contribution:       PHP {gsis:,.2f}")
    print(f"Pag-IBIG Contribution:   PHP {pagibig:,.2f}")
    print(f"Total Deductions:        PHP {total_deductions:,.2f}")
    print(f"Taxable Income:          PHP {taxable_income:,.2f}")
    print(f"BIR Withholding Tax:     PHP {withholding_tax:,.2f}")
    print("-------------------------------------------")
    print(f"Net Take-Home Pay:       PHP {net_take_home_pay:,.2f}")
    print("-------------------------------------------")

if __name__ == "__main__":
    main()