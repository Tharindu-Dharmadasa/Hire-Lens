import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";
import { ApiError } from "@/types/index.js";

type UploadedFile = {
  originalname: string;
  mimetype: string;
  buffer: Buffer;
};

export async function extractTextFromCVFile(
  file: UploadedFile,
): Promise<string> {
  const originalName = file.originalname.toLowerCase();

  if (originalName.endsWith(".pdf")) {
    const parser = new PDFParse({ data: file.buffer });
    const result = await parser.getText();
    const text = result.text?.trim();

    if (!text) {
      throw new ApiError(400, "Could not extract text from the PDF file");
    }

    return text;
  }

  if (originalName.endsWith(".docx")) {
    const result = await mammoth.extractRawText({ buffer: file.buffer });
    const text = result.value?.trim();

    if (!text) {
      throw new ApiError(400, "Could not extract text from the Word file");
    }

    return text;
  }

  throw new ApiError(400, "Only PDF and DOCX files are supported");
}
