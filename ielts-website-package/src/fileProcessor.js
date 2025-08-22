import * as mammoth from 'mammoth/mammoth.browser';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';

// Required setup for pdf.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

/**
 * Parses raw text to extract answers based on a regex pattern.
 * Handles formats like "1. Answer", "Q2: Answer", "3) Answer", and multi-answers like "4. A, B".
 * @param {string} text - The raw text from the file.
 * @returns {object} - An object mapping question numbers to answers.
 */
export function parseTextToAnswers(text) {
    const answers = {};
    const lines = text.split(/[\r\n]+/).filter(line => line.trim() !== '');
    const answerRegex = /^(?:Question\s*)?(\d+)\s*[:.)-]?\s*(.+)$/i;

    lines.forEach(line => {
        const match = line.trim().match(answerRegex);
        if (match) {
            const qNum = match[1];
            let qAns = match[2].trim();

            // Handle multiple choice with multiple answers (e.g., "A, B" or "C and D")
            if (qAns.includes(',') || /and/i.test(qAns)) {
                const multiAnswers = qAns.split(/[\s,]+|and/i).filter(Boolean).map(a => a.trim().toUpperCase());
                if (multiAnswers.length > 1) {
                    answers[qNum] = multiAnswers;
                } else {
                    answers[qNum] = multiAnswers[0];
                }
            } else {
                // Clean up single answers
                answers[qNum] = qAns.replace(/[.,]$/, '').trim();
            }
        }
    });
    return answers;
}

/**
 * Asynchronously parses an uploaded file (JSON, PDF, DOCX, TXT) and returns an answer key object.
 * @param {File} file - The file object from the input.
 * @returns {Promise<object>} - A promise that resolves with the answer key object.
 */
export async function parseAnswerKeyFromFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        let extractedAnswers = {};
        const fileContent = event.target.result;

        if (file.type === 'application/json') {
          extractedAnswers = JSON.parse(fileContent);
        } else if (file.type === 'application/pdf') {
          const pdf = await pdfjsLib.getDocument({ data: fileContent }).promise;
          let fullText = '';
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            fullText += textContent.items.map(item => item.str).join(' ') + '\n';
          }
          extractedAnswers = parseTextToAnswers(fullText);
        } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.name.endsWith('.docx')) {
          const result = await mammoth.extractRawText({ arrayBuffer: fileContent });
          extractedAnswers = parseTextToAnswers(result.value);
        } else {
           // Fallback for .txt, .doc, and other text-based files
           const result = await new Response(fileContent).text();
           extractedAnswers = parseTextToAnswers(result);
        }
        resolve(extractedAnswers);
      } catch (error) {
        console.error("Error parsing file:", error);
        reject(new Error("Could not parse answer key. Please check file format and content."));
      }
    };

    reader.onerror = (error) => {
      console.error("FileReader error:", error);
      reject(new Error("Failed to read the file."));
    };
    
    // Read file as ArrayBuffer for binary formats, otherwise as text
    if (file.type === 'application/pdf' || file.name.endsWith('.docx')) {
      reader.readAsArrayBuffer(file);
    } else {
      reader.readAsText(file);
    }
  });
}

