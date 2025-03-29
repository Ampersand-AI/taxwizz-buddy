
import { API_KEYS } from "@/config/api-keys";
import { getEstimatedTaxRate, taxDeductionsByRegion, formatCurrency } from "./region-tax-utils";

export async function generateTaxSuggestions(taxData: any) {
  try {
    // Estimate tax rate based on region if income is provided
    let estimatedTaxRate = 0.2; // Default rate
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
    
    // Get region-specific deductions
    const deductions = taxDeductionsByRegion[taxData.region] || [];
    
    // Create a more detailed prompt based on the region and tax data
    const detailedPrompt = `
      Generate comprehensive tax optimization suggestions for a ${taxData.taxType} taxpayer in ${taxData.region}.
      
      Client Details:
      - Name: ${taxData.clientName}
      - Tax Type: ${taxData.taxType}
      - Region: ${taxData.region}
      ${taxData.annualIncome ? `- Annual Income: ${taxData.annualIncome}` : ''}
      
      Documents available: ${taxData.documents?.join(', ') || 'None'}
      
      Based on the provided information:
      1. Provide an estimated tax liability (${formattedCurrency} based on ${(estimatedTaxRate * 100).toFixed(1)}% estimated rate)
      2. List specific deductions and credits available in ${taxData.region}
      3. Suggest tax optimization strategies relevant to this region
      4. Mention region-specific filing requirements and deadlines
      5. Provide advice on documentation required for local tax authority
      
      Format the response with clear sections and bullet points for readability.
    `;

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
            content: "You are a specialized tax advisor with expertise in international tax law and regional tax regulations. Provide detailed, accurate, and region-specific tax advice. Include concrete numbers, deadlines, and recommendations where possible."
          },
          {
            role: "user",
            content: detailedPrompt
          }
        ],
        max_tokens: 1500,
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

// Function to generate a PDF-like summary for tax reports
export function generateTaxReportSummary(client: any, suggestions: string) {
  let summary = '';
  
  if (client.taxType === "Individual") {
    summary = `Individual Tax Filing Assessment for ${client.name} (${client.region})
    
    Based on the provided documents and information, we've analyzed your tax situation and generated the following insights:
    
    ${suggestions.substring(0, 300)}...
    
    Key recommendations include optimizing deductions specific to ${client.region} and ensuring compliance with local regulations.`;
  } else {
    summary = `Business Tax Filing Assessment for ${client.name} (${client.region})
    
    Based on the financial documents provided, we've analyzed your business tax situation and generated the following insights:
    
    ${suggestions.substring(0, 300)}...
    
    Key recommendations include utilizing available business tax credits in ${client.region} and optimizing your tax structure.`;
  }
  
  return summary;
}
