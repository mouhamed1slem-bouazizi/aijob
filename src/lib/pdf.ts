import * as pdfParse from "pdf-parse";

export async function extractTextFromPDF(buffer: ArrayBuffer) {
  const res = await (pdfParse as unknown as (b: Buffer) => Promise<{ text: string }>)(Buffer.from(buffer));
  return res.text;
}