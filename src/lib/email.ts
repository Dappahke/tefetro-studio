import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

interface ReceiptEmailData {
  orderId: string;
  productTitle: string;
  total: number;
  downloadUrl: string;
  expiresAt: string;
  isRegeneration?: boolean;
  regenerationNumber?: number;
}

// 📧 USER RECEIPT - Improved with brand colors
export async function sendReceiptEmail(email: string, data: ReceiptEmailData) {
  const { orderId, productTitle, total, downloadUrl, expiresAt, isRegeneration, regenerationNumber } = data;
  
  const expiryDate = new Date(expiresAt).toLocaleString('en-KE', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  const subject = isRegeneration 
    ? `Your New Download Link - Tefetro Studios`
    : `Your Purchase Receipt - Tefetro Studios`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #FAF9F6;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FAF9F6; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(15, 76, 92, 0.08);">
              <!-- Header -->
              <tr>
                <td style="background-color: #0F4C5C; padding: 32px; text-align: center;">
                  <img src="https://tefetra.studio/images/tefetro-logo.png" alt="Tefetro Studios" width="140" style="display: block; margin: 0 auto;" />
                  <h1 style="color: #FAF9F6; font-size: 24px; margin: 16px 0 0 0; font-weight: 600;">
                    ${isRegeneration ? 'New Download Link' : 'Thank You for Your Purchase!'}
                  </h1>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 32px;">
                  ${isRegeneration ? `
                    <div style="background-color: #6faa99/10; border-left: 4px solid #6faa99; padding: 12px; margin-bottom: 24px; border-radius: 4px;">
                      <p style="color: #6faa99; margin: 0; font-size: 14px;">
                        <strong>Link Regenerated</strong> (Regeneration #${regenerationNumber})
                      </p>
                    </div>
                  ` : ''}
                  
                  <p style="color: #1E1E1E; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
                    Hi there,
                  </p>
                  
                  <p style="color: #1E1E1E; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
                    ${isRegeneration 
                      ? 'Your download link has been regenerated as requested.' 
                      : 'Your order has been confirmed and is ready for download.'}
                  </p>
                  
                  <!-- Order Details -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FAF9F6; border-radius: 12px; margin-bottom: 24px;">
                    <tr>
                      <td style="padding: 24px;">
                        <table width="100%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="padding-bottom: 12px;">
                              <span style="color: #1E1E1E/60; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Order ID</span>
                              <p style="color: #1F4E79; font-family: monospace; font-size: 14px; margin: 4px 0 0 0; font-weight: 600;">${orderId.slice(-8).toUpperCase()}</p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding-bottom: 12px;">
                              <span style="color: #1E1E1E/60; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Product</span>
                              <p style="color: #0F4C5C; font-size: 16px; margin: 4px 0 0 0; font-weight: 600;">${productTitle}</p>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <span style="color: #1E1E1E/60; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Total Paid</span>
                              <p style="color: #F28C00; font-size: 20px; margin: 4px 0 0 0; font-weight: 700;">KES ${total.toLocaleString()}</p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Download Button -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                    <tr>
                      <td align="center">
                        <a href="${downloadUrl}" 
                           style="display: inline-block; background-color: #F28C00; color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(242, 140, 0, 0.3);">
                          Download Your Files
                        </a>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Expiry Warning -->
                  <div style="background-color: #F28C00/10; border: 1px solid #F28C00/20; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
                    <p style="color: #F28C00; margin: 0; font-size: 14px; text-align: center;">
                      <strong>⏰ Link expires:</strong> ${expiryDate}
                    </p>
                  </div>
                  
                  <p style="color: #1E1E1E/70; font-size: 14px; line-height: 1.6; margin-bottom: 24px; text-align: center;">
                    If the button doesn&apos;t work, copy and paste this link into your browser:<br>
                    <a href="${downloadUrl}" style="color: #0F4C5C; word-break: break-all;">${downloadUrl}</a>
                  </p>
                  
                  <hr style="border: none; border-top: 1px solid #0F4C5C/10; margin: 32px 0;">
                  
                  <p style="color: #1E1E1E/60; font-size: 14px; line-height: 1.6; text-align: center;">
                    Need help? Contact us at <a href="mailto:support@tefetra.studio" style="color: #0F4C5C;">support@tefetra.studio</a>
                  </p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #0F4C5C; padding: 24px; text-align: center;">
                  <p style="color: #FAF9F6/60; font-size: 12px; margin: 0;">
                    © ${new Date().getFullYear()} Tefetro Studios. All rights reserved.<br>
                    Nairobi, Kenya
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  await resend.emails.send({
    from: "Tefetro Studios <noreply@tefetra.studio>",
    to: email,
    subject,
    html,
  });
}

// 🔥 ADMIN NOTIFICATION - Improved
export async function notifyAdminOfProject(
  clientEmail: string,
  services: string
) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Service Request - Tefetro Studios</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #FAF9F6;">
      <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(15, 76, 92, 0.08);">
              <tr>
                <td style="background-color: #F28C00; padding: 32px; text-align: center;">
                  <h1 style="color: #ffffff; font-size: 24px; margin: 0; font-weight: 600;">🚨 New Service Request</h1>
                </td>
              </tr>
              <tr>
                <td style="padding: 32px;">
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FAF9F6; border-radius: 12px;">
                    <tr>
                      <td style="padding: 24px;">
                        <p style="color: #1E1E1E/60; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 8px 0;">Client Email</p>
                        <p style="color: #0F4C5C; font-size: 18px; margin: 0 0 24px 0; font-weight: 600;">
                          <a href="mailto:${clientEmail}" style="color: #0F4C5C;">${clientEmail}</a>
                        </p>
                        
                        <p style="color: #1E1E1E/60; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 8px 0;">Requested Services</p>
                        <p style="color: #F28C00; font-size: 20px; margin: 0; font-weight: 700;">${services}</p>
                      </td>
                    </tr>
                  </table>
                  
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 24px;">
                    <tr>
                      <td align="center">
                        <a href="https://tefetra.studio/admin/projects" 
                           style="display: inline-block; background-color: #6faa99; color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: 600; font-size: 16px;">
                          View in Admin Dashboard
                        </a>
                      </td>
                    </tr>
                  </table>
                  
                  <p style="color: #1E1E1E/60; font-size: 14px; margin-top: 24px; text-align: center;">
                    Action required: Follow up with this client within 24 hours.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  await resend.emails.send({
    from: "Tefetro Studios <noreply@tefetra.studio>",
    to: "noelsyambi@gmail.com",
    subject: "🚨 New Service Request",
    html,
  });
}

// 📧 PROJECT STATUS UPDATE - Improved
export async function sendProjectUpdateEmail(
  email: string,
  projectId: string,
  newStatus: string,
  serviceType: string
) {
  const statusMessages: Record<string, string> = {
    pending: "Your request has been received and is pending review.",
    contacted: "Our team has reviewed your request and will contact you shortly.",
    in_progress: "Work has begun on your project.",
    completed: "Your project has been completed. Deliverables are ready.",
  };

  const statusColors: Record<string, string> = {
    pending: "#F28C00",
    contacted: "#0F4C5C",
    in_progress: "#1F4E79",
    completed: "#6faa99",
  };

  const statusDisplay = newStatus.replace(/_/g, " ").toUpperCase();
  const statusColor = statusColors[newStatus] || "#0F4C5C";

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Project Update - Tefetro Studios</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #FAF9F6;">
      <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(15, 76, 92, 0.08);">
              <tr>
                <td style="background-color: ${statusColor}; padding: 32px; text-align: center;">
                  <h1 style="color: #ffffff; font-size: 24px; margin: 0; font-weight: 600;">Project Status Update</h1>
                </td>
              </tr>
              <tr>
                <td style="padding: 32px;">
                  <p style="color: #1E1E1E; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
                    Hi there,
                  </p>
                  
                  <p style="color: #1E1E1E; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
                    Your <strong>${serviceType}</strong> project has been updated.
                  </p>
                  
                  <div style="background-color: ${statusColor}10; border: 2px solid ${statusColor}; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
                    <p style="color: ${statusColor}; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 8px 0; font-weight: 600;">Current Status</p>
                    <p style="color: ${statusColor}; font-size: 28px; margin: 0; font-weight: 700;">${statusDisplay}</p>
                  </div>
                  
                  <p style="color: #1E1E1E; font-size: 16px; line-height: 1.6; margin-bottom: 24px; text-align: center;">
                    ${statusMessages[newStatus] || ""}
                  </p>
                  
                  <p style="color: #1E1E1E/60; font-size: 14px; text-align: center; margin-bottom: 24px;">
                    Project ID: <span style="font-family: monospace; color: #1F4E79;">${projectId}</span>
                  </p>
                  
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center">
                        <a href="https://tefetra.studio/dashboard" 
                           style="display: inline-block; background-color: #F28C00; color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(242, 140, 0, 0.3);">
                          View Dashboard
                        </a>
                      </td>
                    </tr>
                  </table>
                  
                  <hr style="border: none; border-top: 1px solid #0F4C5C/10; margin: 32px 0;">
                  
                  <p style="color: #1E1E1E/60; font-size: 14px; text-align: center;">
                    Questions? Reply to this email or contact <a href="mailto:support@tefetra.studio" style="color: #0F4C5C;">support@tefetra.studio</a>
                  </p>
                </td>
              </tr>
              <tr>
                <td style="background-color: #0F4C5C; padding: 24px; text-align: center;">
                  <p style="color: #FAF9F6/60; font-size: 12px; margin: 0;">
                    © ${new Date().getFullYear()} Tefetro Studios. All rights reserved.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  await resend.emails.send({
    from: "Tefetro Studios <noreply@tefetra.studio>",
    to: email,
    subject: `Project Update: ${statusDisplay}`,
    html,
  });
}

// 📧 ADMIN ALERT - New utility for critical alerts
export async function sendAdminAlert({ subject, body }: { subject: string; body: string }) {
  const html = `
    <!DOCTYPE html>
    <html>
    <body style="margin: 0; padding: 20px; font-family: monospace; background-color: #FAF9F6;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-left: 4px solid #F28C00; padding: 24px; border-radius: 8px;">
        <h2 style="color: #F28C00; margin-top: 0;">${subject}</h2>
        <pre style="background-color: #FAF9F6; padding: 16px; border-radius: 4px; overflow-x: auto; color: #1E1E1E; font-size: 14px; line-height: 1.5; white-space: pre-wrap;">${body}</pre>
        <p style="color: #1E1E1E/60; font-size: 12px; margin-top: 24px;">
          Timestamp: ${new Date().toISOString()}
        </p>
      </div>
    </body>
    </html>
  `;

  await resend.emails.send({
    from: "Tefetro Studios <noreply@tefetra.studio>",
    to: "noelsyambi@gmail.com",
    subject: `🔔 ${subject}`,
    html,
  });
}