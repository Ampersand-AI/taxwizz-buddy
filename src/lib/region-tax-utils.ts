
// Region-specific tax rules and helpers

// Define region-specific tax rate information
export const taxRatesByRegion: Record<string, { income: number[], rates: number[], currency: string }> = {
  "US - California": {
    income: [10000, 50000, 100000, 500000, 1000000],
    rates: [0.10, 0.12, 0.22, 0.32, 0.37],
    currency: "USD"
  },
  "US - New York": {
    income: [10000, 50000, 100000, 500000, 1000000],
    rates: [0.11, 0.13, 0.24, 0.33, 0.38],
    currency: "USD"
  },
  "US - Texas": {
    income: [10000, 50000, 100000, 500000, 1000000],
    rates: [0.08, 0.10, 0.20, 0.30, 0.35], // Texas has no state income tax, these are just federal
    currency: "USD"
  },
  "US - Federal": {
    income: [10000, 50000, 100000, 500000, 1000000],
    rates: [0.10, 0.12, 0.22, 0.32, 0.37],
    currency: "USD"
  },
  "UK - England": {
    income: [12570, 50270, 125140, 150000, 1000000],
    rates: [0.20, 0.40, 0.45, 0.45, 0.45],
    currency: "GBP"
  },
  "India - Maharashtra": {
    income: [250000, 500000, 750000, 1000000, 5000000],
    rates: [0.05, 0.10, 0.15, 0.20, 0.30],
    currency: "INR"
  },
  "Australia - Victoria": {
    income: [18200, 45000, 120000, 180000, 1000000],
    rates: [0.19, 0.325, 0.37, 0.45, 0.45],
    currency: "AUD"
  },
  "Singapore": {
    income: [20000, 50000, 80000, 120000, 320000],
    rates: [0.02, 0.035, 0.07, 0.115, 0.22],
    currency: "SGD"
  }
};

// Region-specific tax deduction categories
export const taxDeductionsByRegion: Record<string, string[]> = {
  "US - California": [
    "Mortgage Interest",
    "State and Local Taxes",
    "Charitable Contributions",
    "Medical Expenses",
    "California-specific Credits",
    "Education Expenses",
    "Retirement Contributions"
  ],
  "US - New York": [
    "Mortgage Interest",
    "State and Local Taxes",
    "Charitable Contributions",
    "NY College Tuition Credit",
    "NY Long-Term Care Insurance Credit",
    "Property Tax Relief Credit"
  ],
  "US - Texas": [
    "Mortgage Interest",
    "Charitable Contributions",
    "Medical Expenses",
    "Property Tax Deductions",
    "Retirement Contributions"
  ],
  "US - Federal": [
    "R&D Credits",
    "Employee Retention Credits",
    "Depreciation",
    "Business Interest Expense",
    "Qualified Business Income Deduction"
  ],
  "UK - England": [
    "Pension Contributions",
    "Gift Aid Donations",
    "Marriage Allowance",
    "Work-related Expenses",
    "Blind Person's Allowance",
    "Maintenance Payments"
  ],
  "India - Maharashtra": [
    "Section 80C Investments",
    "Section 80D Health Insurance",
    "Section 24 Home Loan Interest",
    "HRA Exemption",
    "LTA Exemption",
    "NPS Contributions"
  ],
  "Australia - Victoria": [
    "Work-related Expenses",
    "Charitable Donations",
    "Cost of Managing Tax Affairs",
    "Personal Super Contributions",
    "Income Protection Insurance"
  ],
  "Singapore": [
    "Earned Income Relief",
    "CPF Cash Top-up Relief",
    "Course Fees Relief",
    "NSman Relief",
    "Parenthood Tax Rebate",
    "Foreign Tax Credit"
  ]
};

// Function to get estimated tax rate based on income and region
export function getEstimatedTaxRate(income: number, region: string): number {
  const regionData = taxRatesByRegion[region];
  
  if (!regionData) return 0.2; // Default 20% if region not found
  
  // Find the appropriate tax bracket
  let rateIndex = 0;
  for (let i = 0; i < regionData.income.length; i++) {
    if (income <= regionData.income[i]) {
      rateIndex = i;
      break;
    }
    rateIndex = i;
  }
  
  return regionData.rates[rateIndex];
}

// Function to generate region-specific tax insights
export function generateTaxInsights(clientData: any): string {
  const region = clientData.region;
  const deductions = taxDeductionsByRegion[region] || [];
  
  let insights = `Based on your ${region} tax filing, consider these potential deductions:\n\n`;
  
  deductions.forEach(deduction => {
    insights += `- ${deduction}\n`;
  });
  
  insights += `\nConsult with your tax professional for a more detailed analysis based on your specific situation.`;
  
  return insights;
}

// Format currency based on region
export function formatCurrency(amount: number, region: string): string {
  const regionData = taxRatesByRegion[region];
  const currency = regionData?.currency || "USD";
  
  const formatter = new Intl.NumberFormat(getLocaleFromRegion(region), {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  
  return formatter.format(amount);
}

// Get locale from region
function getLocaleFromRegion(region: string): string {
  if (region.startsWith("US")) return "en-US";
  if (region.startsWith("UK")) return "en-GB";
  if (region.startsWith("India")) return "en-IN";
  if (region.startsWith("Australia")) return "en-AU";
  if (region === "Singapore") return "en-SG";
  return "en-US";
}
