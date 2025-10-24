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
  
  // Colors - White background, black text
  const primaryColor = '#D4AF37'; // Gold for accents
  const textColor = '#000000'; // Black text
  const lightGray = '#666666';
  const darkGray = '#333333';
  
  // White background
  pdf.setFillColor(255, 255, 255);
  pdf.rect(0, 0, pageWidth, pageHeight, 'F');
  
  // Header with gold accent
  pdf.setFillColor(212, 175, 55); // Gold color
  pdf.rect(0, 0, pageWidth, 50, 'F');
  
  // KahveYolu Logo and Title
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(28);
  pdf.setFont('helvetica', 'bold');
  pdf.text('☕ KahveYolu', 20, 20);
  
  // Subtitle
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Mystical Coffee Cup Reading', 20, 32);
  
  // Customer name
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`For: ${data.customerName}`, 20, 42);
  
  // Order info (right aligned)
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Order ID: ${data.orderId}`, pageWidth - 100, 15);
  pdf.text(`Completed: ${new Date(data.completedAt).toLocaleDateString()}`, pageWidth - 100, 25);
  
  // Content area
  let yPosition = 70;
  
  // Reading content header
  pdf.setTextColor(primaryColor);
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Your Personal Fortune Reading', 20, yPosition);
  
  yPosition += 20;
  
  // Add a decorative line
  pdf.setDrawColor(212, 175, 55);
  pdf.setLineWidth(2);
  pdf.line(20, yPosition, pageWidth - 20, yPosition);
  yPosition += 15;
  
  // Reading content
  pdf.setTextColor(textColor);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  
  // Split text into lines that fit the page width
  const maxWidth = pageWidth - 40;
  const lineHeight = 7;
  const lines = pdf.splitTextToSize(data.readingContent, maxWidth);
  
  // Add each line
  for (let i = 0; i < lines.length; i++) {
    if (yPosition > pageHeight - 40) {
      pdf.addPage();
      yPosition = 20;
    }
    pdf.text(lines[i], 20, yPosition);
    yPosition += lineHeight;
  }
  
  // Footer with logo
  const footerY = pageHeight - 30;
  pdf.setTextColor(primaryColor);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('☕ KahveYolu', 20, footerY);
  
  pdf.setTextColor(lightGray);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'italic');
  pdf.text('✨ May the coffee grounds guide your path ✨', pageWidth / 2, footerY, { align: 'center' });
  
  return pdf;
}

export function downloadReadingPDF(data: ReadingPDFData, filename?: string): void {
  const pdf = generateReadingPDF(data);
  const defaultFilename = `fortune-reading-${data.orderId}.pdf`;
  pdf.save(filename || defaultFilename);
}
