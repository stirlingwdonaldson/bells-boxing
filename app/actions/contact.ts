"use server"

import { createClient } from "@/lib/supabase/server"
import { sendContactEmail } from "@/lib/email"

export type ContactFormData = {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}

// Check if we're in a preview environment
const isPreviewEnvironment = process.env.VERCEL_ENV === "preview" || !process.env.EMAIL_USER || !process.env.EMAIL_PASS

export async function submitContactForm(formData: FormData) {
  try {
    console.log("Contact form submission started")
    console.log("Is preview environment:", isPreviewEnvironment)

    // Safely extract form data with fallbacks
    const extractFormValue = (key: string): string => {
      try {
        const value = formData.get(key)
        return value ? String(value) : ""
      } catch (error) {
        console.error(`Error extracting ${key}:`, error)
        return ""
      }
    }

    const name = extractFormValue("name")
    const email = extractFormValue("email")
    const phone = extractFormValue("phone")
    const subject = extractFormValue("subject")
    const message = extractFormValue("message")

    console.log("Form data extracted:", { name, email, subject })

    // Validate form data
    if (!name || !email || !subject || !message) {
      console.log("Form validation failed: Missing required fields")
      return {
        success: false,
        message: "Please fill out all required fields",
      }
    }

    console.log("Form data validated, proceeding with submission")

    // Create Supabase client
    const supabase = createClient()

    // Store submission in Supabase
    console.log("Storing submission in Supabase")
    const { error: dbError } = await supabase.from("contact_submissions").insert({
      name,
      email,
      phone: phone || null,
      subject,
      message,
      status: "pending",
    })

    if (dbError) {
      console.error("Error storing contact submission:", dbError)
      return {
        success: false,
        message: "Failed to store your message. Please try again.",
      }
    }

    console.log("Submission stored in database, attempting to send email")

    // Send email notification
    try {
      const emailSent = await sendContactEmail({
        name,
        email,
        phone: phone || undefined,
        subject,
        message,
      })

      if (!emailSent && !isPreviewEnvironment) {
        console.log("Email sending failed, but submission was stored")
        return {
          success: true, // Still return success since we stored in DB
          message:
            "Your message was received but there was an issue sending the email notification. Our team will still contact you soon.",
        }
      }

      // In preview mode, we'll always get here since we simulate success
      console.log("Email handling completed")
      return {
        success: true,
        message: isPreviewEnvironment
          ? "Your message has been received! (Note: Email sending is simulated in preview mode)"
          : "Your message has been sent successfully! We'll get back to you soon.",
      }
    } catch (emailError) {
      console.error("Error in email sending process:", emailError)
      return {
        success: true, // Still return success since we stored in DB
        message:
          "Your message was received but there was an issue with the email notification. Our team will still contact you soon.",
      }
    }
  } catch (error) {
    console.error("Contact form submission error:", error)
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    }
  }
}
