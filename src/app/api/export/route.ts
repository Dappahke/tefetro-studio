// src/app/api/export/revenue/route.ts
import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium-min";

export async function POST(req: NextRequest) {
  let browser = null;
  
  try {
    const { timeRange } = await req.json();
    
    const isDev = process.env.NODE_ENV === "development";
    
    browser = await puppeteer.launch({
      args: isDev 
        ? ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"]
        : chromium.args,
      executablePath: isDev 
        ? process.env.CHROME_EXECUTABLE_PATH || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
        : await chromium.executablePath(),
      headless: true,
    });
    
    const page = await browser.newPage();
    
    // Render your analytics component to HTML
    // Or navigate to a dedicated print-friendly page
    await page.goto(`${process.env.NEXT_PUBLIC_URL}/admin/revenue/print?range=${timeRange}`, {
      waitUntil: "networkidle0",
      timeout: 30000,
    });
    
    const pdf = await page.pdf({
      format: "A4",
      landscape: true,
      printBackground: true,
    });
    
    await browser.close();
    
    // FIX: Convert Uint8Array to Buffer
    const pdfBuffer = Buffer.from(pdf);
    
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="revenue-${timeRange}.pdf"`,
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    
    if (browser) {
      await browser.close().catch(console.error);
    }
    
    return NextResponse.json(
      { 
        error: "Failed to generate PDF", 
        details: (error as Error).message,
        hint: "Make sure Chrome is installed or CHROME_EXECUTABLE_PATH is set"
      },
      { status: 500 }
    );
  }
}