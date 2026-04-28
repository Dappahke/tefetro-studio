// src/app/api/export/revenue/route.ts

import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium-min";
import { execSync } from "child_process";
import fs from "fs";

// Remote Chromium pack for production (Vercel/serverless)
const CHROMIUM_PACK_URL = "https://github.com/Sparticuz/chromium/releases/download/v131.0.1/chromium-v131.0.1-pack.tar";

function findChrome(): string {
  const platform = process.platform;

  if (platform === "darwin") {
    const paths = [
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      "/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary",
      "/System/Volumes/Data/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    ];
    for (const p of paths) {
      if (fs.existsSync(p)) return p;
    }
    try {
      return execSync("which google-chrome || which chromium || which chromium-browser").toString().trim();
    } catch {
      throw new Error(
        "Chrome not found on macOS. Install Google Chrome or set CHROME_EXECUTABLE_PATH env var."
      );
    }
  }

  if (platform === "linux") {
    const paths = [
      "/usr/bin/google-chrome",
      "/usr/bin/chromium-browser",
      "/usr/bin/chromium",
      "/snap/bin/chromium",
    ];
    for (const p of paths) {
      if (fs.existsSync(p)) return p;
    }
    try {
      return execSync("which google-chrome || which chromium-browser || which chromium").toString().trim();
    } catch {
      throw new Error(
        "Chrome not found on Linux. Run: sudo apt-get install chromium-browser"
      );
    }
  }

  if (platform === "win32") {
    const paths = [
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    ];
    for (const p of paths) {
      if (fs.existsSync(p)) return p;
    }
    throw new Error(
      "Chrome not found on Windows. Install Google Chrome or set CHROME_EXECUTABLE_PATH env var."
    );
  }

  throw new Error(`Unsupported platform: ${platform}`);
}

export async function POST(req: NextRequest) {
  let browser = null;
  
  try {
    const body = await req.json();
    const { timeRange = "30d", chartData, stats } = body;

    const isDev = process.env.NODE_ENV === "development";

    console.log("[PDF API] Starting PDF generation...");
    console.log("[PDF API] NODE_ENV:", process.env.NODE_ENV);
    console.log("[PDF API] Platform:", process.platform);
    console.log("[PDF API] Is dev:", isDev);

    let executablePath: string;

    if (isDev) {
      const envPath = process.env.CHROME_EXECUTABLE_PATH;
      if (envPath && fs.existsSync(envPath)) {
        console.log("[PDF API] Using CHROME_EXECUTABLE_PATH:", envPath);
        executablePath = envPath;
      } else {
        executablePath = findChrome();
        console.log("[PDF API] Auto-detected Chrome:", executablePath);
      }
    } else {
      console.log("[PDF API] Downloading Chromium for serverless...");
      executablePath = await chromium.executablePath(CHROMIUM_PACK_URL);
      console.log("[PDF API] Chromium path:", executablePath);
    }

    console.log("[PDF API] Launching browser...");
    
    browser = await puppeteer.launch({
      args: isDev
        ? ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"]
        : chromium.args,
      executablePath,
      headless: isDev ? false : true,
    });
    console.log("[PDF API] Browser launched successfully");

    const page = await browser.newPage();

    const htmlContent = generateRevenueHTML({ timeRange, chartData, stats });

    console.log("[PDF API] Setting page content...");
    await page.setContent(htmlContent, {
      waitUntil: "networkidle0",
      timeout: 30000,
    });
    console.log("[PDF API] Page content set");

    console.log("[PDF API] Generating PDF...");
    const pdfBuffer = await page.pdf({
      format: "A4",
      landscape: true,
      printBackground: true,
      margin: {
        top: "20mm",
        right: "15mm",
        bottom: "20mm",
        left: "15mm",
      },
      displayHeaderFooter: true,
      headerTemplate: `
        <div style="font-size: 10px; width: 100%; padding: 0 20px; display: flex; justify-content: space-between; align-items: center;">
          <span style="font-weight: bold; color: #F28C00;">Tefetro Studios</span>
          <span style="color: #6b7280;">Revenue Report</span>
        </div>
      `,
      footerTemplate: `
        <div style="font-size: 9px; width: 100%; padding: 0 20px; display: flex; justify-content: space-between; color: #9ca3af;">
          <span>Generated on ${new Date().toLocaleDateString()}</span>
          <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
        </div>
      `,
    });
    console.log("[PDF API] PDF generated, size:", pdfBuffer.length, "bytes");

    await browser.close();
    console.log("[PDF API] Browser closed, sending response");

    // FIX: Convert Uint8Array to Buffer or use proper type
    // Option 1: Use Buffer.from
    const pdfBuffer_ = Buffer.from(pdfBuffer);
    
    // Option 2: Or use the Uint8Array directly with explicit type
    return new NextResponse(pdfBuffer_, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="tefetro-revenue-${timeRange}-${new Date().toISOString().split("T")[0]}.pdf"`,
      },
    });
  } catch (error) {
    console.error("[PDF API] PDF generation failed:", error);
    
    if (browser) {
      await browser.close().catch(console.error);
    }
    
    return NextResponse.json(
      {
        error: "PDF generation failed",
        details: (error as Error).message,
        stack: process.env.NODE_ENV === "development" ? (error as Error).stack : undefined,
        hint: "Make sure Google Chrome is installed locally, or set CHROME_EXECUTABLE_PATH env var.",
      },
      { status: 500 }
    );
  }
}

function generateRevenueHTML({
  timeRange,
  chartData,
  stats,
}: {
  timeRange: string;
  chartData: any[];
  stats: any;
}) {
  const formatKES = (amount: number) => `KES ${amount.toLocaleString("en-KE")}`;

  const totalRevenue = stats?.totalRevenue || 0;
  const totalOrders = stats?.totalOrders || 0;
  const avgOrderValue = stats?.avgOrderValue || 0;
  const periodGrowth = stats?.periodGrowth || 0;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Tefetro Revenue Report</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          color: #1E1E1E;
          background: white;
          padding: 20px;
        }
        .header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 32px;
          padding-bottom: 20px;
          border-bottom: 2px solid #F28C00;
        }
        .logo {
          width: 48px;
          height: 48px;
          background: #F28C00;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 20px;
        }
        .header-text h1 {
          font-size: 24px;
          font-weight: 700;
          color: #1E1E1E;
        }
        .header-text p {
          font-size: 14px;
          color: #6b7280;
          margin-top: 4px;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 32px;
        }
        .stat-card {
          background: #FAF9F6;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 20px;
        }
        .stat-label {
          font-size: 12px;
          font-weight: 500;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        }
        .stat-value {
          font-size: 24px;
          font-weight: 700;
          color: #1E1E1E;
        }
        .stat-sub {
          font-size: 13px;
          color: #6b7280;
          margin-top: 4px;
        }
        .growth-positive { color: #059669; }
        .growth-negative { color: #dc2626; }
        .chart-section {
          margin-top: 32px;
        }
        .chart-title {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 16px;
          color: #1E1E1E;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 16px;
        }
        th, td {
          text-align: left;
          padding: 12px;
          border-bottom: 1px solid #e5e7eb;
        }
        th {
          font-size: 12px;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
          background: #f9fafb;
        }
        td {
          font-size: 14px;
          color: #374151;
        }
        .amount { font-weight: 600; color: #1E1E1E; }
        .date { color: #6b7280; font-size: 13px; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">T</div>
        <div class="header-text">
          <h1>Revenue Analytics Report</h1>
          <p>Period: ${timeRange} | Generated: ${new Date().toLocaleDateString("en-KE", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}</p>
        </div>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">Total Revenue</div>
          <div class="stat-value">${formatKES(totalRevenue)}</div>
          <div class="stat-sub ${periodGrowth >= 0 ? "growth-positive" : "growth-negative"}">
            ${periodGrowth >= 0 ? "↑" : "↓"} ${Math.abs(periodGrowth).toFixed(1)}% vs previous period
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Total Orders</div>
          <div class="stat-value">${totalOrders.toLocaleString()}</div>
          <div class="stat-sub">Avg: ${formatKES(avgOrderValue)} per order</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Best Day</div>
          <div class="stat-value">${formatKES(stats?.maxDay?.revenue || 0)}</div>
          <div class="stat-sub">${stats?.maxDay?.date ? new Date(stats.maxDay.date).toLocaleDateString() : "N/A"}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Conversion Rate</div>
          <div class="stat-value">${stats?.conversionRate || 0}%</div>
          <div class="stat-sub">Industry avg: 2.4%</div>
        </div>
      </div>

      <div class="chart-section">
        <div class="chart-title">Daily Revenue Breakdown</div>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Revenue</th>
              <th>Orders</th>
              <th>Avg Order Value</th>
              <th>Growth</th>
            </tr>
          </thead>
          <tbody>
            ${chartData?.length > 0 ? chartData.map((day: any) => `
              <tr>
                <td class="date">${new Date(day.date).toLocaleDateString("en-KE", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}</td>
                <td class="amount">${formatKES(day.revenue)}</td>
                <td>${day.orders}</td>
                <td>${formatKES(day.avgOrderValue)}</td>
                <td class="${(day.growth || 0) >= 0 ? "growth-positive" : "growth-negative"}">
                  ${(day.growth || 0) >= 0 ? "+" : ""}${(day.growth || 0).toFixed(1)}%
                </td>
              </tr>
            `).join("") : `
              <tr>
                <td colspan="5" style="text-align: center; color: #9ca3af;">No data available</td>
              </tr>
            `}
          </tbody>
        </table>
      </div>
    </body>
    </html>
  `;
}