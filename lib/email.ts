import nodemailer from "nodemailer"
import type { ContactFormData } from "@/app/actions/contact"

// Check if we're in a preview environment
const isPreviewEnvironment = process.env.VERCEL_ENV === "preview" || !process.env.EMAIL_USER || !process.env.EMAIL_PASS

export async function sendContactEmail(data: ContactFormData) {
  const { name, email, phone, subject, message } = data

  console.log("Setting up email transport with credentials")
  console.log("Email user:", process.env.EMAIL_USER ? "Set" : "Not set")
  console.log("Is preview environment:", isPreviewEnvironment)

  // If we're in a preview environment, simulate email sending
  if (isPreviewEnvironment) {
    console.log("Preview environment detected - simulating email send")
    console.log("Email would have been sent with:", { name, email, subject })
    // Return true to simulate successful email sending
    return true
  }

  try {
    // Create a transporter using SMTP
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false, // Helps with some connection issues
      },
      debug: true, // Enable debug output
    })

    const mailOptions = {
      from: `"Bells Boxing Website" <${process.env.EMAIL_USER}>`,
      to: "stirlingwdonaldson@gmail.com",
      replyTo: email, // Allow direct reply to the sender
      subject: `Bells Boxing Contact: ${subject}`,
      html: `
        <h1>New Contact Form Submission</h1>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ""}
        <p><strong>Subject:</strong> ${subject}</p>
        <h2>Message:</h2>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
      text: `
        New Contact Form Submission
        
        Name: ${name}
        Email: ${email}
        ${phone ? `Phone: ${phone}` : ""}
        Subject: ${subject}
        
        Message:
        ${message}
      `, // Plain text version for email clients that don't support HTML
    }

    console.log("Attempting to send email to:", mailOptions.to)
    const info = await transporter.sendMail(mailOptions)
    console.log("Email sent successfully:", info.response)
    return true
  } catch (error) {
    console.error("Error sending contact email:", error)
    console.error("Error details:", error.message)
    return false
  }
}
