// Logo utilities for PDF generation - Client-side compatible

// KahveYolu logo path (PNG format)
const KAHVEYOLU_LOGO_PATH = '/KahveYolu.png';

export function getKahveYoluLogo(): string {
  // Returns the path to the KahveYolu logo PNG file
  return KAHVEYOLU_LOGO_PATH;
}

export function addLogoToPDF(pdf: any, x: number, y: number, width: number, height: number): boolean {
  try {
    const logoPath = getKahveYoluLogo();
    pdf.addImage(logoPath, 'PNG', x, y, width, height);
    return true;
  } catch (error) {
    console.error('Error adding logo to PDF:', error);
    return false;
  }
}
