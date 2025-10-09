// utils/pdfGenerator.js
export const generateSimplePDF = async (currentBook, pages, user) => {
  try {
    // Create a simple text-based PDF content
    let pdfContent = `%PDF-1.4\n`;
    pdfContent += `1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n`;
    pdfContent += `2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n`;
    pdfContent += `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >>\nendobj\n`;
    
    // Create page content
    let pageText = `BT\n/F1 12 Tf\n50 750 Td\n(${currentBook?.title || 'Digital Journal'}) Tj\n`;
    pageText += `0 -20 Td\n(Generated on: ${new Date().toLocaleDateString()}) Tj\n`;
    pageText += `0 -40 Td\n(Created by: ${user?.name || 'User'}) Tj\n`;
    pageText += `0 -60 Td\n(Total Pages: ${pages.length}) Tj\n`;
    
    // Add content from pages
    let yPosition = 650;
    pages.forEach((page, index) => {
      if (index === 0) return; // Skip cover
      
      if (yPosition < 50) {
        // Would need to add new page logic for longer content
        yPosition = 750;
      }
      
      const content = page.content || 'No content';
      const lines = content.split('\n');
      lines.forEach(line => {
        if (line.trim()) {
          pageText += `0 -20 Td\n(${line.substring(0, 80)}) Tj\n`; // Limit line length
          yPosition -= 20;
        }
      });
      pageText += `0 -10 Td\n(--- Page ${index} ---) Tj\n`;
      yPosition -= 30;
    });
    
    pageText += `ET\n`;
    
    pdfContent += `4 0 obj\n<< /Length ${pageText.length} >>\nstream\n${pageText}endstream\nendobj\n`;
    pdfContent += `xref\n0 5\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n0000000234 00000 n \n`;
    pdfContent += `trailer\n<< /Size 5 /Root 1 0 R >>\n`;
    pdfContent += `startxref\n${pdfContent.length}\n%%EOF`;
    
    // Create and download the PDF file
    const blob = new Blob([pdfContent], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentBook?.title || 'journal'}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

export const downloadAsHTML = async (currentBook, pages, user) => {
  if (!currentBook || !pages.length) return;

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${currentBook.title || 'Digital Journal'}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@300;400;500&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 40px 20px;
            line-height: 1.6;
        }
        
        .journal-container {
            max-width: 1000px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        
        .journal-cover {
            background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
            color: white;
            padding: 80px 40px;
            text-align: center;
        }
        
        .journal-title {
            font-family: 'Playfair Display', serif;
            font-size: 3.5em;
            margin-bottom: 20px;
            font-weight: 700;
        }
        
        .journal-description {
            font-size: 1.3em;
            opacity: 0.9;
            margin-bottom: 30px;
        }
        
        .journal-meta {
            font-size: 0.9em;
            opacity: 0.7;
        }
        
        .page {
            padding: 60px 40px;
            border-bottom: 1px solid #e2e8f0;
            min-height: 400px;
        }
        
        .page:last-child {
            border-bottom: none;
        }
        
        .page-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 2px solid #e2e8f0;
        }
        
        .page-number {
            font-family: 'Playfair Display', serif;
            font-size: 1.2em;
            color: #4a5568;
            font-weight: 700;
        }
        
        .page-title {
            font-family: 'Playfair Display', serif;
            font-size: 1.5em;
            color: #2d3748;
        }
        
        .page-content {
            line-height: 1.8;
            font-size: 1.1em;
            color: #4a5568;
            white-space: pre-wrap;
        }
        
        .page-content h1, .page-content h2, .page-content h3 {
            font-family: 'Playfair Display', serif;
            color: #2d3748;
            margin: 30px 0 15px 0;
        }
        
        .page-content h1 { 
            font-size: 2em; 
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 10px;
        }
        
        .page-content h2 { 
            font-size: 1.6em; 
            color: #4a5568;
        }
        
        .page-content h3 { 
            font-size: 1.3em; 
            color: #718096;
        }
        
        .page-content p {
            margin-bottom: 20px;
        }
        
        .page-content ul, .page-content ol {
            margin: 20px 0;
            padding-left: 30px;
        }
        
        .page-content li {
            margin-bottom: 8px;
        }
        
        .footer {
            text-align: center;
            padding: 40px;
            background: #f7fafc;
            color: #718096;
            font-size: 0.9em;
        }
        
        @media (max-width: 768px) {
            body { 
                padding: 20px 10px; 
            }
            .journal-title { 
                font-size: 2.5em; 
            }
            .page { 
                padding: 40px 20px; 
            }
            .page-header {
                flex-direction: column;
                gap: 10px;
                text-align: center;
            }
        }
        
        /* Print styles */
        @media print {
            body {
                background: white !important;
                padding: 0 !important;
            }
            .journal-container {
                box-shadow: none !important;
                border-radius: 0 !important;
                margin: 0 !important;
                max-width: none !important;
            }
            .journal-cover {
                page-break-after: always;
            }
            .page {
                page-break-inside: avoid;
            }
        }
    </style>
</head>
<body>
    <div class="journal-container">
        <div class="journal-cover">
            <h1 class="journal-title">${currentBook.title || 'Digital Journal'}</h1>
            <p class="journal-description">${currentBook.description || 'Personal Journal'}</p>
            <div class="journal-meta">
                <p>Created by ${user?.name || 'User'}</p>
                <p>Generated on ${new Date().toLocaleDateString()}</p>
                <p>Total pages: ${pages.length - 1}</p>
            </div>
        </div>
        
        ${pages.map((page, index) => index > 0 ? `
        <div class="page">
            <div class="page-header">
                <span class="page-number">Page ${index}</span>
                <span class="page-title">${currentBook.title || 'Digital Journal'}</span>
            </div>
            <div class="page-content">
                ${page.content ? page.content.replace(/\n/g, '\n') : 'No content yet...'}
            </div>
        </div>
        ` : '').join('')}
        
        <div class="footer">
            <p>✨ Created with Digital Journal App ✨</p>
            <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
        </div>
    </div>
</body>
</html>`;

  // Create and download HTML file
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${currentBook.title || 'journal'}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};