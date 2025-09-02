"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock, Mail, MapPin, Phone, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import GrungeBackground from "@/components/grunge-background"
import PageHeader from "@/components/page-header"
import { submitContactForm } from "@/app/actions/contact"

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [isPending, setIsPending] = useState(false)
  const [formResult, setFormResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value) => {
    setFormState((prev) => ({ ...prev, subject: value }))
  }

  // Reset form after successful submission
  const resetForm = () => {
    setFormState({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    })
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsPending(true)

    try {
      // Create a new FormData object from the form element
      const formData = new FormData(e.target)

      // Log the form data to verify it's being created correctly
      console.log("Form data entries:", [...formData.entries()])

      // Call the server action directly
      const result = await submitContactForm(formData)

      setFormResult(result)

      if (result.success) {
        resetForm()
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      setFormResult({
        success: false,
        message: "An error occurred while submitting the form. Please try again.",
      })
    } finally {
      setIsPending(false)
    }
  }

  return (
    <main className="min-h-screen bg-zinc-900 text-zinc-100">
      <PageHeader
        title="CONTACT US"
        subtitle="Get in touch with our team for any questions or to schedule your first class"
      />

      <section className="relative py-16">
        <GrungeBackground className="opacity-10" />
        <div className="container mx-auto px-4">
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <h2 className="relative mb-6 inline-block font-display text-3xl font-bold uppercase tracking-tight text-white md:text-4xl">
                GET IN <span className="text-red-500">TOUCH</span>
                <div className="absolute -bottom-2 left-0 h-1 w-full bg-red-500"></div>
              </h2>
              <p className="mb-8 text-lg text-zinc-300">
                Have questions about our classes, memberships, or facilities? Fill out the form and our team will get
                back to you within 24 hours.
              </p>

              {formResult?.success ? (
                <div className="rounded-lg border border-green-500 bg-green-500/10 p-6">
                  <div className="mb-4 flex items-center">
                    <CheckCircle className="mr-2 h-6 w-6 text-green-500" />
                    <h3 className="text-xl font-bold text-white">Message Sent!</h3>
                  </div>
                  <p className="mb-4 text-zinc-200">{formResult.message}</p>
                  <Button
                    onClick={() => {
                      setFormResult(null)
                    }}
                    className="bg-green-600 text-white hover:bg-green-700"
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {formResult?.success === false && (
                    <div className="rounded-lg border border-red-500 bg-red-500/10 p-4">
                      <div className="flex items-center">
                        <AlertCircle className="mr-2 h-5 w-5 text-red-500" />
                        <p className="text-red-400">{formResult.message || "An error occurred. Please try again."}</p>
                      </div>
                    </div>
                  )}

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium text-zinc-300">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={formState.name}
                        onChange={handleChange}
                        required
                        className="border-zinc-700 bg-zinc-800/50 text-white placeholder:text-zinc-500 focus:border-red-500"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-zinc-300">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formState.email}
                        onChange={handleChange}
                        required
                        className="border-zinc-700 bg-zinc-800/50 text-white placeholder:text-zinc-500 focus:border-red-500"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-sm font-medium text-zinc-300">
                        Phone Number (Optional)
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formState.phone}
                        onChange={handleChange}
                        className="border-zinc-700 bg-zinc-800/50 text-white placeholder:text-zinc-500 focus:border-red-500"
                        placeholder="(123) 456-7890"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-sm font-medium text-zinc-300">
                        Subject <span className="text-red-500">*</span>
                      </label>
                      <input type="hidden" name="subject" value={formState.subject} />
                      <Select value={formState.subject} onValueChange={handleSelectChange} required>
                        <SelectTrigger className="border-zinc-700 bg-zinc-800/50 text-white focus:border-red-500">
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="membership">Membership Inquiry</SelectItem>
                          <SelectItem value="classes">Class Information</SelectItem>
                          <SelectItem value="training">Personal Training</SelectItem>
                          <SelectItem value="facilities">Facility Questions</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium text-zinc-300">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formState.message}
                      onChange={handleChange}
                      required
                      className="min-h-[150px] border-zinc-700 bg-zinc-800/50 text-white placeholder:text-zinc-500 focus:border-red-500"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>

                  <Button type="submit" disabled={isPending} className="w-full bg-red-600 text-white hover:bg-red-700">
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send Message"
                    )}
                  </Button>
                </form>
              )}
            </div>

            <div className="space-y-8">
              <div className="rounded-lg bg-zinc-800/30 p-6 backdrop-blur-sm">
                <h3 className="mb-4 text-xl font-bold">Contact Information</h3>
                <div className="space-y-4">
                  {/* Address */}
                  <div className="flex items-start">
                    <MapPin className="mr-3 h-5 w-5 shrink-0 text-red-500" />
                    <div>
                      <p className="font-medium">Address</p>
                      <p className="text-zinc-400">116 Fyans St</p>
                      <p className="text-zinc-400">South Geelong VIC 3220</p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start">
                    <Phone className="mr-3 h-5 w-5 shrink-0 text-red-500" />
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-zinc-400">0 407 581 872</p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start">
                    <Mail className="mr-3 h-5 w-5 shrink-0 text-red-500" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-zinc-400">greg@bellsboxing.com</p>
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="flex items-start">
                    <Clock className="mr-3 h-5 w-5 shrink-0 text-red-500" />
                    <div>
                      <p className="font-medium">Hours</p>
                      <p className="text-zinc-400">All Days: 5:00 AM – 9:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative bg-zinc-950 py-16">
        <GrungeBackground className="opacity-20" />
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="relative mb-6 inline-block font-display text-3xl font-bold uppercase tracking-tight text-white md:text-4xl">
              FREQUENTLY <span className="text-red-500">ASKED QUESTIONS</span>
              <div className="absolute -bottom-2 left-0 h-1 w-full bg-red-500"></div>
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-zinc-300">
              Find quick answers to common questions about Bells Boxing.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg bg-zinc-800/30 p-6 backdrop-blur-sm">
              <h3 className="mb-3 text-xl font-bold">Do I need to have boxing experience?</h3>
              <p className="text-zinc-300">
                No experience is necessary. We have classes for all skill levels, including complete beginners. Our
                coaches will teach you everything you need to know from the ground up.
              </p>
            </div>

            <div className="rounded-lg bg-zinc-800/30 p-6 backdrop-blur-sm">
              <h3 className="mb-3 text-xl font-bold">What should I bring to my first class?</h3>
              <p className="text-zinc-300">
                Just bring comfortable workout clothes, a water bottle, and a positive attitude. We provide gloves for
                beginners, but you'll want to purchase hand wraps for hygiene.
              </p>
            </div>

            <div className="rounded-lg bg-zinc-800/30 p-6 backdrop-blur-sm">
              <h3 className="mb-3 text-xl font-bold">Is boxing safe?</h3>
              <p className="text-zinc-300">
                Safety is our top priority. Our beginner classes focus on technique and fitness with no sparring.
                Sparring is optional and only for those who are ready and properly equipped with protective gear.
              </p>
            </div>

            <div className="rounded-lg bg-zinc-800/30 p-6 backdrop-blur-sm">
              <h3 className="mb-3 text-xl font-bold">How often should I train?</h3>
              <p className="text-zinc-300">
                For beginners, we recommend 2-3 sessions per week to build skills and conditioning without overtraining.
                As you advance, you may increase to 3-5 sessions per week depending on your goals.
              </p>
            </div>

            <div className="rounded-lg bg-zinc-800/30 p-6 backdrop-blur-sm">
              <h3 className="mb-3 text-xl font-bold">Do you offer private training?</h3>
              <p className="text-zinc-300">
                Yes, we offer one-on-one training with our expert coaches. Private sessions are perfect for accelerated
                learning, competition preparation, or focused skill development.
              </p>
            </div>

            <div className="rounded-lg bg-zinc-800/30 p-6 backdrop-blur-sm">
              <h3 className="mb-3 text-xl font-bold">Can I try before I join?</h3>
              <p className="text-zinc-300">
                Your first class is free. This gives you a chance to experience our training style and facility before
                making any commitment.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative bg-red-600 py-12">
        <GrungeBackground className="opacity-30" />
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 font-display text-3xl font-bold uppercase tracking-tight text-white">
            READY TO GET STARTED?
          </h2>
          <p className="mx-auto mb-6 max-w-2xl text-lg text-white/90">
            Book your free introductory class today and take the first step toward transformation.
          </p>
          <Button size="lg" className="bg-black text-white hover:bg-zinc-800">
            BOOK FREE CLASS
          </Button>
        </div>
      </section>
    </main>
  )
}
