/**
 * Lightweight multipart/form-data parser for Vercel serverless functions.
 * Parses the raw request body and extracts fields and the first file.
 */
export async function parseMultipart(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('error', reject);
    req.on('end', () => {
      try {
        const buffer = Buffer.concat(chunks);
        const contentType = req.headers['content-type'] || '';
        const boundaryMatch = contentType.match(/boundary=(?:"([^"]+)"|([^\s;]+))/);
        if (!boundaryMatch) {
          return reject(new Error('No boundary found in content-type'));
        }
        const boundary = boundaryMatch[1] || boundaryMatch[2];
        const boundaryBuffer = Buffer.from(`--${boundary}`);

        const fields = {};
        let file = null;

        // Split buffer by boundary
        const parts = splitBuffer(buffer, boundaryBuffer);

        for (const part of parts) {
          const partStr = part.toString('utf-8', 0, Math.min(part.length, 2048));

          // Skip empty or closing parts
          if (partStr.trim() === '' || partStr.trim() === '--') continue;

          // Find the header/body separator (double CRLF)
          const headerEndIndex = part.indexOf('\r\n\r\n');
          if (headerEndIndex === -1) continue;

          const headerStr = part.toString('utf-8', 0, headerEndIndex);
          const bodyStart = headerEndIndex + 4;
          // Remove trailing \r\n
          let bodyEnd = part.length;
          if (part[bodyEnd - 2] === 0x0d && part[bodyEnd - 1] === 0x0a) {
            bodyEnd -= 2;
          }
          const body = part.slice(bodyStart, bodyEnd);

          // Parse Content-Disposition
          const nameMatch = headerStr.match(/name="([^"]+)"/);
          const filenameMatch = headerStr.match(/filename="([^"]+)"/);

          if (!nameMatch) continue;
          const fieldName = nameMatch[1];

          if (filenameMatch) {
            // This is a file field
            file = {
              fieldName,
              filename: filenameMatch[1],
              buffer: body,
            };
          } else {
            // This is a text field
            fields[fieldName] = body.toString('utf-8').trim();
          }
        }

        resolve({ fields, file });
      } catch (err) {
        reject(err);
      }
    });
  });
}

function splitBuffer(buffer, delimiter) {
  const parts = [];
  let start = 0;

  while (start < buffer.length) {
    const idx = buffer.indexOf(delimiter, start);
    if (idx === -1) {
      parts.push(buffer.slice(start));
      break;
    }
    if (idx > start) {
      parts.push(buffer.slice(start, idx));
    }
    start = idx + delimiter.length;
    // Skip optional \r\n after boundary
    if (buffer[start] === 0x0d && buffer[start + 1] === 0x0a) {
      start += 2;
    }
  }

  return parts;
}
