export declare class FileParserService {
    /**
     * Extracts text from a given file path based on its extension.
     * @param filePath Path to the uploaded file.
     * @returns Promise resolving to the extracted text.
     */
    extractText(filePath: string): Promise<string>;
    private parsePdf;
    private parseDocx;
}
//# sourceMappingURL=FileParserService.d.ts.map