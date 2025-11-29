import * as mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';

// Note: For a production app, you would configure the worker via a local file or CDN
// pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export const extractTextFromFile = async (file: File): Promise<string> => {
  const fileType = file.type;

  try {
    if (fileType === 'text/plain') {
      return await file.text();
    } 
    else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      return result.value;
    }
    else if (fileType === 'application/pdf') {
       // Setup worker dynamically if possible, or fallback to simple error if specific setup not present
       try {
          // Setting the worker source is critical for PDF.js
          pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
          
          const arrayBuffer = await file.arrayBuffer();
          const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
          const pdf = await loadingTask.promise;
          
          let fullText = '';
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map((item: any) => item.str).join(' ');
            fullText += pageText + '\n\n';
          }
          return fullText;
       } catch (e) {
          console.error("PDF Parse Error", e);
          throw new Error("Could not parse PDF. Please copy and paste the text instead.");
       }
    }
    else {
      throw new Error("Unsupported file type. Please use TXT, DOCX, or PDF.");
    }
  } catch (error) {
    console.error("File extraction failed", error);
    throw new Error(error instanceof Error ? error.message : "Failed to extract text from file.");
  }
};