import { PDFParse } from 'pdf-parse';
import mammoth from 'mammoth';
import fs from 'fs';

export class FileParserService {
  /**
   * Extracts text from a given file path based on its extension.
   * @param filePath Path to the uploaded file.
   * @returns Promise resolving to the extracted text.
   */
  async extractText(filePath: string): Promise<string> {
    const extension = filePath.split('.').pop()?.toLowerCase();

    if (extension === 'pdf') {
      return this.parsePdf(filePath);
    } else if (extension === 'docx') {
      return this.parseDocx(filePath);
    } else {
      throw new Error('Unsupported file format. Please upload a PDF or DOCX file.');
    }
  }

  private async parsePdf(filePath: string): Promise<string> {
    const dataBuffer = fs.readFileSync(filePath);
    const parser = new PDFParse({ data: dataBuffer });
    try {
      const result = await parser.getText();
      return result.text;
    } finally {
      await parser.destroy();
    }
  }

  private async parseDocx(filePath: string): Promise<string> {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  }
}
