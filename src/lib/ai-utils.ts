
import { API_KEYS } from "@/config/api-keys";

export async function generateTaxSuggestions(taxData: any) {
  try {
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
            content: "You are a tax optimization expert. Provide clear, actionable tax suggestions based on the provided data."
          },
          {
            role: "user",
            content: `Generate tax optimization suggestions based on this data: ${JSON.stringify(taxData)}`
          }
        ],
        max_tokens: 1000,
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
