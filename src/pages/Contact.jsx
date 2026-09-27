import React, { useState } from 'react'
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react'

const Contact = () => {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Demo submission simulation
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({ name: '', email: '', subject: '', message: '' })
    }, 4000)
  }

  return (
    <section id="contact" className="py-16 bg-gradient-to-b from-amber-50/50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-amber-500 font-bold tracking-wider uppercase text-sm bg-amber-100/60 px-4 py-1.5 rounded-full border border-amber-200">
            Get In Touch
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-4 tracking-tight">
            We'd Love To Hear From You
          </h2>
          <p className="text-gray-600 mt-3 text-base sm:text-lg">
            Have a question about our menu, delivery options, or special party orders? Drop us a line!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Contact Details Cards */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Location */}
            <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="p-3 bg-amber-500 text-white rounded-xl shadow-sm shadow-amber-500/30">
                <MapPin size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Location</h3>
                <p className="text-gray-600 text-sm mt-1">Bagh Sardaran, Rawalpindi, Pakistan</p>
              </div>
            </div>

            {/* Phone & WhatsApp */}
            <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="p-3 bg-amber-500 text-white rounded-xl shadow-sm shadow-amber-500/30">
                <Phone size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Call / WhatsApp</h3>
                <p className="text-gray-600 text-sm mt-1">0336 555 88 34</p>
                <p className="text-xs text-amber-600 font-medium mt-0.5">Free Home Delivery</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="p-3 bg-amber-500 text-white rounded-xl shadow-sm shadow-amber-500/30">
                <Mail size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Email Us</h3>
                <p className="text-gray-600 text-sm mt-1">info@pizzac.com</p>
              </div>
            </div>

            {/* Timings */}
            <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="p-3 bg-amber-500 text-white rounded-xl shadow-sm shadow-amber-500/30">
                <Clock size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Operating Hours</h3>
                <p className="text-gray-600 text-sm mt-1">Delivery: 4:00 PM – 2:00 AM</p>
                <p className="text-gray-600 text-sm">Dine-in: 2:00 PM – 1:00 AM</p>
              </div>
            </div>

          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-lg shadow-gray-100/50 relative">
            
            {submitted && (
              <div className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-3xl z-10 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
                <CheckCircle2 className="text-amber-500 w-16 h-16 mb-4 animate-bounce" />
                <h3 className="text-2xl font-bold text-gray-900">Message Sent!</h3>
                <p className="text-gray-600 mt-2 max-w-md">
                  Thank you for reaching out to Pizzac. This is a demo submission.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Your Name</label>
                  <input
                    type="text"
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-sm bg-gray-50/50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    required
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-sm bg-gray-50/50 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Subject</label>
                <input
                  type="text"
                  required
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Order Inquiry / Catering"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-sm bg-gray-50/50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Your Message</label>
                <textarea
                  rows={4}
                  required
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us what you need..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-sm bg-gray-50/50 focus:bg-white resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-md shadow-amber-500/20 hover:shadow-lg hover:shadow-amber-500/30 transition-all cursor-pointer flex items-center justify-center gap-2 group text-sm sm:text-base"
              >
                <span>Send Message</span>
                <Send size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  )
}

export default Contact