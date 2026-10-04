const readline = require('node:readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function ask(question) {
    return new Promise((resolve) => rl.question(question, resolve));
}

function calculatePhilHealth(grossMonthlySalary) {
    // PhilHealth Premium Rate: 5% total (2.5% employee share), capped between P10,000 and P100,000
    if (grossMonthlySalary <= 10000) return 250;
    if (grossMonthlySalary >= 100000) return 2500;
    return grossMonthlySalary * 0.025;
}

function calculateGSIS(grossMonthlySalary) {
    // Standard GSIS Personal Share: 9%
    return grossMonthlySalary * 0.09;
}

function calculatePagIBIG(grossMonthlySalary) {
    // Pag-IBIG regular contribution cap: P200 monthly
    const contribution = grossMonthlySalary * 0.02;
    return contribution > 200 ? 200 : contribution;
}

function calculateMonthlyWithholdingTax(taxableIncome) {
    // TRAIN Law Monthly Tax Table
    if (taxableIncome <= 20833) {
        return 0;
    } else if (taxableIncome <= 33332) {
        return (taxableIncome - 20833) * 0.15;
    } else if (taxableIncome <= 66666) {
        return 1875 + (taxableIncome - 33333) * 0.20;
    } else if (taxableIncome <= 166666) {
        return 8541.80 + (taxableIncome - 66667) * 0.25;
    } else if (taxableIncome <= 666666) {
        return 33541.80 + (taxableIncome - 166667) * 0.30;
    } else {
        return 183541.80 + (taxableIncome - 666667) * 0.35;
    }
}

async function main() {
    console.log("=== BIR Government Employee Tax Calculator ===");

    const name = (await ask('Enter Employee Name: ')).trim();
    if (!name) {
        console.log('Name cannot be empty.');
        rl.close();
        process.exit(1);
    }

    const salaryInput = (await ask('Enter Monthly Gross Salary (PHP): ')).trim();
    const grossSalary = parseFloat(salaryInput);

    if (isNaN(grossSalary) || grossSalary <= 0) {
        console.log('Invalid salary input.');
        rl.close();
        process.exit(1);
    }

    // Deductions
    const philHealth = calculatePhilHealth(grossSalary);
    const gsis = calculateGSIS(grossSalary);
    const pagIbig = calculatePagIBIG(grossSalary);
    const totalDeductions = philHealth + gsis + pagIbig;

    // Tax Computation
    const taxableIncome = grossSalary - totalDeductions;
    const withholdingTax = calculateMonthlyWithholdingTax(taxableIncome);
    const netTakeHomePay = grossSalary - totalDeductions - withholdingTax;

    console.log("\n-------------------------------------------");
    console.log(`Tax Computation Summary for: ${name}`);
    console.log("-------------------------------------------");
    console.log(`Gross Salary:           PHP ${grossSalary.toFixed(2)}`);
    console.log(`PhilHealth Contribution: PHP ${philHealth.toFixed(2)}`);
    console.log(`GSIS Contribution:       PHP ${gsis.toFixed(2)}`);
    console.log(`Pag-IBIG Contribution:   PHP ${pagIbig.toFixed(2)}`);
    console.log(`Total Deductions:        PHP ${totalDeductions.toFixed(2)}`);
    console.log(`Taxable Income:          PHP ${taxableIncome.toFixed(2)}`);
    console.log(`BIR Withholding Tax:     PHP ${withholdingTax.toFixed(2)}`);
    console.log("-------------------------------------------");
    console.log(`Net Take-Home Pay:       PHP ${netTakeHomePay.toFixed(2)}`);
    console.log("-------------------------------------------");

    rl.close();
}

main();