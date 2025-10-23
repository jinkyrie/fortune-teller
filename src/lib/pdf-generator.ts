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
  
  // Colors
  const primaryColor = '#D4AF37';
  const darkColor = '#0B0C10';
  const textColor = '#333333';
  const lightGray = '#666666';
  
  // Add background gradient effect (simulated with rectangles)
  pdf.setFillColor(11, 12, 16); // Dark background
  pdf.rect(0, 0, pageWidth, pageHeight, 'F');
  
  // Header
  pdf.setFillColor(212, 175, 55); // Gold color
  pdf.rect(0, 0, pageWidth, 40, 'F');
  
  // Title
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text('🔮 KahveYolu Fortune Reading', 20, 25);
  
  // Customer name
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`For: ${data.customerName}`, 20, 35);
  
  // Order info
  pdf.setTextColor(lightGray);
  pdf.setFontSize(10);
  pdf.text(`Order ID: ${data.orderId}`, pageWidth - 100, 15);
  pdf.text(`Completed: ${new Date(data.completedAt).toLocaleDateString()}`, pageWidth - 100, 25);
  
  // Content area
  let yPosition = 60;
  
  // Reading content header
  pdf.setTextColor(primaryColor);
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Your Personal Fortune Reading', 20, yPosition);
  
  yPosition += 15;
  
  // Reading content
  pdf.setTextColor(textColor);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  
  // Split text into lines that fit the page width
  const maxWidth = pageWidth - 40;
  const lineHeight = 6;
  const lines = pdf.splitTextToSize(data.readingContent, maxWidth);
  
  // Add each line
  for (let i = 0; i < lines.length; i++) {
    if (yPosition > pageHeight - 30) {
      pdf.addPage();
      yPosition = 20;
    }
    pdf.text(lines[i], 20, yPosition);
    yPosition += lineHeight;
  }
  
  // Footer
  const footerY = pageHeight - 20;
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
