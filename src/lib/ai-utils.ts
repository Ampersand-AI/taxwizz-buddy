import { API_KEYS } from "@/config/api-keys";
import { getEstimatedTaxRate, taxDeductionsByRegion, formatCurrency } from "./region-tax-utils";

export async function generateTaxSuggestions(taxData: any) {
  try {
    // Enhanced tax analysis with more detailed tax estimation
    let estimatedTaxRate = 0.2;
    let estimatedTaxAmount = 0;
    let formattedCurrency = "";
    
    if (taxData.region && taxData.annualIncome) {
      const income = parseFloat(taxData.annualIncome);
      if (!isNaN(income)) {
        estimatedTaxRate = getEstimatedTaxRate(income, taxData.region);
        estimatedTaxAmount = income * estimatedTaxRate;
        formattedCurrency = formatCurrency(estimatedTaxAmount, taxData.region);
      }
    }

    // Get region-specific deductions and rules
    const deductions = taxDeductionsByRegion[taxData.region] || [];
    
    // Enhanced AI prompt for better tax analysis
    const detailedPrompt = `
      Generate a comprehensive tax analysis report for a ${taxData.taxType} taxpayer in ${taxData.region}.
      
      Client Profile:
      - Name: ${taxData.clientName}
      - Tax Type: ${taxData.taxType}
      - Region: ${taxData.region}
      - Annual Income: ${taxData.annualIncome || 'Not provided'}
      - Available Documents: ${taxData.documents?.join(', ') || 'None'}

      Based on the provided information, generate:
      1. Tax Liability Analysis:
         - Estimated tax liability: ${formattedCurrency} (based on ${(estimatedTaxRate * 100).toFixed(1)}% rate)
         - Breakdown by tax brackets
         - Local tax considerations for ${taxData.region}

      2. Deductions and Credits:
         - Available deductions in ${taxData.region}
         - Potential tax credits
         - Optimization recommendations

      3. Risk Assessment:
         - Missing documentation analysis
         - Compliance review for ${taxData.region}
         - Audit risk factors

      4. Tax Planning Recommendations:
         - Short-term tax savings opportunities
         - Long-term tax planning strategies
         - Region-specific considerations

      Format the response with clear sections and bullet points.
    `;

    // Enhanced OpenAI model call
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEYS.OPENAI_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are a specialized tax advisor with expertise in ${taxData.region} tax regulations. Provide detailed, accurate, and region-specific tax analysis.`
          },
          {
            role: "user",
            content: detailedPrompt
          }
        ],
        temperature: 0.2,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const result = await response.json();
    return result.choices[0].message.content;
  } catch (error) {
    console.error("Error generating tax suggestions:", error);
    return "Unable to generate tax suggestions at this time. Please try again later.";
  }
}

// Enhanced tax report summary generation
export function generateTaxReportSummary(client: any, suggestions: string) {
  const reportDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  if (client.taxType === "Individual") {
    return `Tax Analysis Report - ${reportDate}
    
Individual Tax Filing Assessment for ${client.name}
Region: ${client.region}

Key Findings:
${suggestions.substring(0, 500)}

This analysis includes region-specific tax considerations for ${client.region}, available deductions, and optimization recommendations. For detailed insights and recommendations, please review the full report.`;
  } else {
    return `Tax Analysis Report - ${reportDate}
    
Business Tax Filing Assessment for ${client.name}
Region: ${client.region}

Key Findings:
${suggestions.substring(0, 500)}

This analysis includes business-specific tax considerations for ${client.region}, available credits, and strategic tax planning recommendations. For detailed insights, please review the full report.`;
  }
}
