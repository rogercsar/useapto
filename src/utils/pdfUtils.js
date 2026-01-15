import * as pdfjsLib from 'pdfjs-dist';
// Vite-specific: Import the worker as a URL
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// Configure worker locally
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

/**
 * Extracts text content from a PDF file.
 * @param {File} file - The PDF file object.
 * @returns {Promise<string>} - The extracted text.
 */
export const extractTextFromPDF = async (file) => {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument(arrayBuffer);
        const pdf = await loadingTask.promise;
        let fullText = '';

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(' ');
            fullText += pageText + '\n';
        }

        return fullText;
    } catch (error) {
        console.error("Error parsing PDF:", error);
        throw new Error("Failed to extract text from PDF");
    }
};
