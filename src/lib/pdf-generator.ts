import jsPDF from 'jspdf';

export interface ReadingPDFData {
  customerName: string;
  readingContent: string;
  orderId: string;
  completedAt: string;
}

export function generateReadingPDF(data: ReadingPDFData): jsPDF {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  
  // Mystical Reading Report Color Palette
  const warmOffWhite = '#FAF8F5';
  const softBlack = '#1E1E1E';
  const gold = '#CBA35C';
  const warmGray = '#D8C7A1';
  const lightGray = '#8B8B8B';
  
  // Warm off-white background
  pdf.setFillColor(250, 248, 245);
  pdf.rect(0, 0, pageWidth, pageHeight, 'F');
  
  // Proper margins (1.5cm = ~42 points)
  const margin = 42;
  const contentWidth = pageWidth - (margin * 2);
  
  let yPosition = margin;
  
  // 1. HEADER / COVER PAGE
  // Logo & Brand Name - Centered
  pdf.setTextColor(gold);
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('☕ KahveYolu', pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 30;
  
  // Main Title - Centered
  pdf.setTextColor(softBlack);
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Your Personalized Coffee Reading', pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 20;
  
  // Subtitle - Centered
  pdf.setTextColor(lightGray);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'italic');
  pdf.text('Prepared with care and intuition by our master fortune teller', pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 15;
  
  // Date - Centered
  pdf.setTextColor(warmGray);
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Date of Reading: ${new Date(data.completedAt).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })}`, pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 25;
  
  // Tagline - Centered
  pdf.setTextColor(gold);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'italic');
  pdf.text('"Every cup whispers a story — this is yours."', pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 40;
  
  // 2. CLIENT DETAILS
  pdf.setTextColor(softBlack);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Client Information', margin, yPosition);
  
  yPosition += 15;
  
  // Client details
  pdf.setTextColor(softBlack);
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Full Name: ${data.customerName}`, margin, yPosition);
  yPosition += 12;
  pdf.text(`Order ID: ${data.orderId}`, margin, yPosition);
  yPosition += 12;
  pdf.text(`Date of Submission: ${new Date(data.completedAt).toLocaleDateString()}`, margin, yPosition);
  
  yPosition += 30;
  
  // 3. READING CONTENT - Single paragraph
  pdf.setTextColor(softBlack);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  
  const readingLines = pdf.splitTextToSize(data.readingContent, contentWidth);
  
  for (let i = 0; i < readingLines.length; i++) {
    if (yPosition > pageHeight - 60) {
      pdf.addPage();
      pdf.setFillColor(250, 248, 245);
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');
      yPosition = margin;
    }
    pdf.text(readingLines[i], margin, yPosition);
    yPosition += 5;
  }
  
  // 6. FOOTER
  const footerY = pageHeight - 25;
  
  // Footer with logo
  pdf.setTextColor(gold);
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'bold');
  pdf.text('☕ KahveYolu', margin, footerY);
  
  // Copyright
  pdf.setTextColor(lightGray);
  pdf.setFontSize(7);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`© ${new Date().getFullYear()} KahveYolu. All rights reserved.`, pageWidth - margin, footerY, { align: 'right' });
  
  return pdf;
}

export function downloadReadingPDF(data: ReadingPDFData, filename?: string): void {
  const pdf = generateReadingPDF(data);
  const defaultFilename = `fortune-reading-${data.orderId}.pdf`;
  pdf.save(filename || defaultFilename);
}
