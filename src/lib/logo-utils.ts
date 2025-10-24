// Logo utilities for PDF generation
import fs from 'fs';
import path from 'path';

// Base64 encoded KahveYolu logo (you'll need to convert the PNG to base64)
// This is a placeholder - in production, you'd convert the actual PNG file
const KAHVEYOLU_LOGO_BASE64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

export function getKahveYoluLogo(): string {
  try {
    // Try to read the actual logo file and convert to base64
    const logoPath = path.join(process.cwd(), 'public', 'KahveYolu.png');
    if (fs.existsSync(logoPath)) {
      const logoBuffer = fs.readFileSync(logoPath);
      return `data:image/png;base64,${logoBuffer.toString('base64')}`;
    }
  } catch (error) {
    console.error('Error reading logo file:', error);
  }
  
  // Fallback to placeholder
  return KAHVEYOLU_LOGO_BASE64;
}

export function addLogoToPDF(pdf: any, x: number, y: number, width: number, height: number): boolean {
  try {
    const logoData = getKahveYoluLogo();
    pdf.addImage(logoData, 'PNG', x, y, width, height);
    return true;
  } catch (error) {
    console.error('Error adding logo to PDF:', error);
    return false;
  }
}
