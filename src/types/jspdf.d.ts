declare module 'jspdf' {
  export default class jsPDF {
    [x: string]: any;
    constructor(orientation?: string, unit?: string, format?: string)
    addPage(): void
    setPage(pageNumber: number): void
    save(filename: string): void
    text(text: string, x: number, y: number, options?: any): void
    rect(x: number, y: number, w: number, h: number, style?: string): void
    roundedRect(x: number, y: number, w: number, h: number, rx: number, ry: number, style?: string): void
    line(x1: number, y1: number, x2: number, y2: number): void
    setFillColor(r: number, g: number, b: number): void
    setDrawColor(r: number, g: number, b: number): void
    setTextColor(r: number, g: number, b: number): void
    setFontSize(size: number): void
    setFont(fontName: string, fontStyle?: string): void
    setLineWidth(width: number): void
    getNumberOfPages(): number
  }
}