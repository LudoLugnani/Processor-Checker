import { GoogleGenAI, Schema, Type } from "@google/genai";
import { ComplianceReport } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are a senior UK Data Protection Lawyer specializing in GDPR. 
Your task is to analyze a contract (Data Processing Agreement or clauses) uploaded by a user.
You must check for compliance specifically with Article 28(3) of the UK GDPR in a Controller-to-Processor relationship.

You must identify if the following required elements are present:
1. Subject-matter, duration, nature/purpose, data types, data subjects.
2. Documented instructions (process only on instructions, including transfers).
3. Confidentiality (personnel committed to confidentiality).
4. Security (Art 32 measures).
5. Sub-processors (prior auth + flow down obligations).
6. Rights of Data Subjects (assist controller).
7. Assistance with security, breaches, and DPIAs (Art 32-36).
8. End of contract (delete or return data).
9. Audits and Inspections (make info available + allow audits).

For each point, determine:
- Status: "Compliant" (clearly covers requirements), "Partially Compliant" (vague/missing details), "Not Found / Non-Compliant".
- Risk Level: Low, Medium, High.
- Improvement: specific legal drafting suggestions if not compliant.

Do not hallucinate clauses. If it's not there, say "Not Found".
Be professional, concise, and purely objective based on UK law.
`;

const schema: Schema = {
  type: Type.OBJECT,
  properties: {
    overall_assessment: {
      type: Type.OBJECT,
      properties: {
        rating: { type: Type.STRING, enum: ["Likely Compliant", "Partially Compliant", "Likely Non-Compliant"] },
        summary: { type: Type.STRING },
        key_risks: { type: Type.ARRAY, items: { type: Type.STRING } },
        key_strengths: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ["rating", "summary", "key_risks", "key_strengths"]
    },
    requirements: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          article_reference: { type: Type.STRING },
          status: { type: Type.STRING, enum: ["Compliant", "Partially Compliant", "Not Found / Non-Compliant"] },
          clause_reference: { type: Type.STRING },
          excerpt: { type: Type.STRING },
          analysis: { type: Type.STRING },
          suggested_improvement: { type: Type.STRING },
          risk_level: { type: Type.STRING, enum: ["Low", "Medium", "High"] }
        },
        required: ["name", "article_reference", "status", "analysis", "risk_level"]
      }
    }
  },
  required: ["overall_assessment", "requirements"]
};

export const analyzeContract = async (text: string, docType: string): Promise<ComplianceReport> => {
  const prompt = `
    Analyze the following text which represents a "${docType}".
    
    TEXT TO ANALYZE:
    ${text.substring(0, 30000)} // Truncate to avoid token limits if extremely large, though flash handles 1M context.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.1, // Low temperature for consistent legal analysis
      }
    });

    const jsonText = response.text || "{}";
    return JSON.parse(jsonText) as ComplianceReport;
  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    throw new Error("Failed to analyze the contract. Ensure the API Key is valid and the text is readable.");
  }
};