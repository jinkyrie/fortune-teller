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
  
  // Wide margins (2.5cm = ~70 points)
  const margin = 70;
  const contentWidth = pageWidth - (margin * 2);
  
  let yPosition = margin;
  
  // 1. HEADER / COVER PAGE
  // Logo & Brand Name
  pdf.setTextColor(gold);
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text('☕ KahveYolu', margin, yPosition);
  
  yPosition += 40;
  
  // Main Title
  pdf.setTextColor(softBlack);
  pdf.setFontSize(28);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Your Personalized Coffee Reading', margin, yPosition);
  
  yPosition += 20;
  
  // Subtitle
  pdf.setTextColor(lightGray);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'italic');
  pdf.text('Prepared with care and intuition by our master fortune teller', margin, yPosition);
  
  yPosition += 15;
  
  // Date
  pdf.setTextColor(warmGray);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Date of Reading: ${new Date(data.completedAt).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })}`, margin, yPosition);
  
  yPosition += 30;
  
  // Tagline
  pdf.setTextColor(gold);
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'italic');
  pdf.text('"Every cup whispers a story — this is yours."', margin, yPosition);
  
  yPosition += 50;
  
  // 2. CLIENT DETAILS
  pdf.setTextColor(softBlack);
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Client Information', margin, yPosition);
  
  yPosition += 20;
  
  // Client details
  pdf.setTextColor(softBlack);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Full Name: ${data.customerName}`, margin, yPosition);
  yPosition += 15;
  pdf.text(`Order ID: ${data.orderId}`, margin, yPosition);
  yPosition += 15;
  pdf.text(`Date of Submission: ${new Date(data.completedAt).toLocaleDateString()}`, margin, yPosition);
  
  yPosition += 40;
  
  // 3. INTRODUCTION
  pdf.setTextColor(softBlack);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Introduction', margin, yPosition);
  
  yPosition += 20;
  
  const introduction = `Merhaba ${data.customerName.split(' ')[0]},\n\nThank you for trusting me to interpret your coffee cup. As I studied your photos, I focused on the symbols, shapes, and energy patterns revealed in the grounds. What follows is a reflection of your current emotional state, the energies surrounding you, and the potential paths opening ahead.\n\nRemember — coffee readings don't dictate fate; they illuminate possibilities.`;
  
  pdf.setTextColor(softBlack);
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  const introLines = pdf.splitTextToSize(introduction, contentWidth);
  
  for (let i = 0; i < introLines.length; i++) {
    if (yPosition > pageHeight - 50) {
      pdf.addPage();
      pdf.setFillColor(250, 248, 245);
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');
      yPosition = margin;
    }
    pdf.text(introLines[i], margin, yPosition);
    yPosition += 6;
  }
  
  yPosition += 30;
  
  // 4. READING CONTENT SECTIONS
  pdf.setTextColor(softBlack);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Your Personal Fortune Reading', margin, yPosition);
  
  yPosition += 20;
  
  // Add gold divider line
  pdf.setDrawColor(gold);
  pdf.setLineWidth(1);
  pdf.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 15;
  
  // Reading content with proper formatting
  pdf.setTextColor(softBlack);
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  
  const readingLines = pdf.splitTextToSize(data.readingContent, contentWidth);
  
  for (let i = 0; i < readingLines.length; i++) {
    if (yPosition > pageHeight - 50) {
      pdf.addPage();
      pdf.setFillColor(250, 248, 245);
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');
      yPosition = margin;
    }
    pdf.text(readingLines[i], margin, yPosition);
    yPosition += 6;
  }
  
  yPosition += 30;
  
  // 5. CLOSING MESSAGE
  pdf.setTextColor(softBlack);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Closing Message', margin, yPosition);
  
  yPosition += 20;
  
  const closingMessage = `I appreciate the opportunity to read your cup. If my interpretation resonates, take it as guidance — not instruction.\n\nEnergy refresh recommended after 40 days.`;
  
  pdf.setTextColor(softBlack);
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  const closingLines = pdf.splitTextToSize(closingMessage, contentWidth);
  
  for (let i = 0; i < closingLines.length; i++) {
    if (yPosition > pageHeight - 50) {
      pdf.addPage();
      pdf.setFillColor(250, 248, 245);
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');
      yPosition = margin;
    }
    pdf.text(closingLines[i], margin, yPosition);
    yPosition += 6;
  }
  
  // 6. FOOTER
  const footerY = pageHeight - 30;
  
  // Footer with logo
  pdf.setTextColor(gold);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('☕ KahveYolu', margin, footerY);
  
  // Copyright
  pdf.setTextColor(lightGray);
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`© ${new Date().getFullYear()} KahveYolu. All rights reserved.`, pageWidth - margin, footerY, { align: 'right' });
  
  return pdf;
}

export function downloadReadingPDF(data: ReadingPDFData, filename?: string): void {
  const pdf = generateReadingPDF(data);
  const defaultFilename = `fortune-reading-${data.orderId}.pdf`;
  pdf.save(filename || defaultFilename);
}
