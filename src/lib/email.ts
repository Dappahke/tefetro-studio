import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

// 📧 USER RECEIPT
export async function sendReceiptEmail(email: string, downloadUrl: string) {
  await resend.emails.send({
    from: "Tefetro Studios <noreply@tefetra.studio>",
    to: email,
    subject: "Your Purchase Receipt",
    html: `
      <h2>Thank you for your purchase</h2>
      <p>Your download is ready:</p>
      <a href="${downloadUrl}" target="_blank">Download Files</a>
      <p>This link expires in 24 hours.</p>
    `,
  });
}

// 🔥 ADMIN NOTIFICATION
export async function notifyAdminOfProject(
  clientEmail: string,
  services: string
) {
  await resend.emails.send({
    from: "Tefetro Studios <noreply@tefetra.studio>",
    to: "noelsyambi@gmail.com",
    subject: "🚨 New Service Request",
    html: `
      <h2>New Client Request</h2>
      <p><strong>Client Email:</strong> ${clientEmail}</p>
      <p><strong>Requested Services:</strong> ${services}</p>
      <p>Action required: Follow up with this client.</p>
    `,
  });
}

// 📧 PROJECT STATUS UPDATE (NEW)
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
    completed: "Your project has been completed.",
  };

  const statusDisplay = newStatus.replace(/_/g, " ").toUpperCase();

  await resend.emails.send({
    from: "Tefetro Studios <noreply@tefetra.studio>",
    to: email,
    subject: `Project Update: ${statusDisplay}`,
    html: `
      <h2>Project Status Update</h2>
      <p>Your <strong>${serviceType}</strong> project has been updated.</p>
      <p><strong>Status:</strong> ${statusDisplay}</p>
      <p>${statusMessages[newStatus] || ""}</p>
      <p>Project ID: ${projectId}</p>
      <hr />
      <p>View your dashboard: <a href="https://tefetra.studio/dashboard">Dashboard</a></p>
    `,
  });
}