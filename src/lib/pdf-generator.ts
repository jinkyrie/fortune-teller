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
  
  // Colors - Clean professional colors
  const primaryColor = '#D4AF37'; // Gold for accents
  const textColor = '#000000'; // Black text
  const lightGray = '#666666';
  const darkGray = '#333333';
  
  // White background
  pdf.setFillColor(255, 255, 255);
  pdf.rect(0, 0, pageWidth, pageHeight, 'F');
  
  // Header section - Clean professional layout
  const headerY = 20;
  
  // Logo and company name (top left) - Enhanced with coffee cup
  pdf.setTextColor(primaryColor);
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('☕', 20, headerY);
  
  pdf.setTextColor(textColor);
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.text('KahveYolu', 35, headerY);
  
  // Add a decorative coffee cup drawing
  pdf.setDrawColor(primaryColor);
  pdf.setLineWidth(1);
  // Coffee cup base
  pdf.ellipse(25, headerY - 8, 8, 4, 'S');
  // Coffee cup sides
  pdf.line(17, headerY - 8, 17, headerY - 2);
  pdf.line(33, headerY - 8, 33, headerY - 2);
  // Coffee cup handle
  pdf.ellipse(35, headerY - 6, 3, 2, 'S');
  // Coffee steam
  pdf.setLineWidth(0.5);
  pdf.line(22, headerY - 12, 24, headerY - 15);
  pdf.line(25, headerY - 12, 27, headerY - 15);
  pdf.line(28, headerY - 12, 30, headerY - 15);
  
  // Contact info (top right)
  pdf.setTextColor(lightGray);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text('noreply@kahveyolu.com', pageWidth - 20, headerY, { align: 'right' });
  pdf.text('www.kahveyolu.com', pageWidth - 20, headerY + 10, { align: 'right' });
  
  // Main title
  const titleY = headerY + 35;
  pdf.setTextColor(textColor);
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text('PERSONAL FORTUNE READING', 20, titleY);
  
  // Title underline
  pdf.setDrawColor(primaryColor);
  pdf.setLineWidth(1);
  pdf.line(20, titleY + 3, pageWidth - 20, titleY + 3);
  
  // Customer info section
  let yPosition = titleY + 20;
  
  pdf.setTextColor(darkGray);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Customer Information:', 20, yPosition);
  
  yPosition += 8;
  pdf.setTextColor(textColor);
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Name: ${data.customerName}`, 20, yPosition);
  
  yPosition += 6;
  pdf.text(`Order ID: ${data.orderId}`, 20, yPosition);
  
  yPosition += 6;
  pdf.text(`Completed: ${new Date(data.completedAt).toLocaleDateString()}`, 20, yPosition);
  
  // Reading content section
  yPosition += 20;
  
  pdf.setTextColor(darkGray);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Your Personal Fortune Reading:', 20, yPosition);
  
  yPosition += 15;
  
  // Reading content
  pdf.setTextColor(textColor);
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  
  // Split text into lines that fit the page width
  const maxWidth = pageWidth - 40;
  const lineHeight = 6;
  const lines = pdf.splitTextToSize(data.readingContent, maxWidth);
  
  // Add each line with proper spacing
  for (let i = 0; i < lines.length; i++) {
    if (yPosition > pageHeight - 50) {
      pdf.addPage();
      yPosition = 20;
    }
    pdf.text(lines[i], 20, yPosition);
    yPosition += lineHeight;
  }
  
  // Footer with logo
  const footerY = pageHeight - 30;
  
  // Footer logo (left side)
  pdf.setTextColor(primaryColor);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('☕ KahveYolu', 20, footerY);
  
  // Footer text (center and right)
  pdf.setTextColor(lightGray);
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.text('May the coffee grounds guide your path ✨', pageWidth / 2, footerY, { align: 'center' });
  pdf.text('© ' + new Date().getFullYear() + ' All rights reserved.', pageWidth - 20, footerY, { align: 'right' });
  
  return pdf;
}

export function downloadReadingPDF(data: ReadingPDFData, filename?: string): void {
  const pdf = generateReadingPDF(data);
  const defaultFilename = `fortune-reading-${data.orderId}.pdf`;
  pdf.save(filename || defaultFilename);
}
