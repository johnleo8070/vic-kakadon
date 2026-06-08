"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { showToast } from "@/components/Toast";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    address: ["19/21, Breadfruit By Sulubolaji", "Mandilas Lagos Island, Shop Number 2F 09", "Lagos, Nigeria, 101223"],
    phone: "0810 661 7255",
    email: "kakadonkakadon@yahoo.com",
    whatsapp: "https://wa.me/2348106617255",
    services: [
      "Online classes",
      "Online booking",
      "In-store pickup",
      "In-person classes",
      "Delivery",
      "In-store shopping"
    ],
    areasServed: ["Lagos State", "Onicha, Nigeria", "Aba, Nigeria"]
  });

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setContactInfo((prev) => {
            const addressVal = data.data.store_address;
            const phoneVal = data.data.store_phone;
            const emailVal = data.data.store_email;
            const servicesVal = data.data.store_services;
            const areasVal = data.data.store_areas_served;

            const next = { ...prev };
            if (addressVal) {
              next.address = addressVal.split(",").map((s: string) => s.trim()).filter(Boolean);
            }
            if (phoneVal) {
              next.phone = phoneVal;
              const digits = phoneVal.replace(/\D/g, "");
              next.whatsapp = `https://wa.me/${digits.startsWith("0") ? "234" + digits.slice(1) : digits}`;
            }
            if (emailVal) {
              next.email = emailVal;
            }
            if (servicesVal) {
              next.services = servicesVal.split(",").map((s: string) => s.trim()).filter(Boolean);
            }
            if (areasVal) {
              next.areasServed = areasVal.split(",").map((s: string) => s.trim()).filter(Boolean);
            }
            return next;
          });
        }
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate sending
    await new Promise((r) => setTimeout(r, 1000));
    showToast("success", "Message sent! We'll get back to you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span>/</span>
        <span className="text-dark font-medium">Contact Us</span>
      </nav>

      <div className="text-center mb-12">
        <div className="gold-divider" />
        <h1 className="text-3xl md:text-4xl font-bold font-serif text-dark mb-4">Get in Touch</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">Have a question or need help? We'd love to hear from you!</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Contact Info */}
        <div className="space-y-6">
          {/* Address Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 flex items-start gap-4 border border-gray-100">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary flex-shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-dark mb-1">Visit Us</h3>
              {contactInfo.address.map((line, idx) => (
                <p key={idx} className="text-gray-500 text-sm leading-relaxed">{line}</p>
              ))}
            </div>
          </div>

          {/* Call & WhatsApp Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 flex items-start gap-4 border border-gray-100">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary flex-shrink-0">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-dark mb-1">Call & WhatsApp</h3>
              <p className="text-gray-500 text-sm mb-2">{contactInfo.phone}</p>
              <a 
                href={contactInfo.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-md text-xs font-semibold shadow-sm transition-colors"
              >
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Email Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 flex items-start gap-4 border border-gray-100">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary flex-shrink-0">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-dark mb-1">Email Us</h3>
              <p className="text-gray-500 text-sm">
                <a href={`mailto:${contactInfo.email}`} className="hover:text-primary underline">
                  {contactInfo.email}
                </a>
              </p>
            </div>
          </div>

          {/* Specialties / Services Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 flex items-start gap-4 border border-gray-100">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary flex-shrink-0 font-serif font-bold text-lg text-primary">
              ★
            </div>
            <div>
              <h3 className="font-semibold text-dark mb-2">Our Services & Specialties</h3>
              <div className="flex flex-wrap gap-1.5">
                {contactInfo.services.map((service, idx) => (
                  <span key={idx} className="bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-full border border-gray-200">
                    {service}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Areas Served Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 flex items-start gap-4 border border-gray-100">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary flex-shrink-0 font-serif font-bold text-lg text-primary">
              📍
            </div>
            <div>
              <h3 className="font-semibold text-dark mb-2">Areas Served</h3>
              <div className="flex flex-wrap gap-1.5">
                {contactInfo.areasServed.map((area, idx) => (
                  <span key={idx} className="bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-full border border-blue-100">
                    {area}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Business Hours Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 flex items-start gap-4 border border-gray-100">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary flex-shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-dark mb-1">Business Hours</h3>
              <p className="text-gray-500 text-sm">Mon - Fri: 9AM - 6PM</p>
              <p className="text-gray-500 text-sm">Sat: 10AM - 4PM</p>
              <p className="text-gray-500 text-sm font-medium text-red-500">Sun: Closed</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-100">
            <h2 className="text-xl font-bold font-serif mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name <span className="text-red-500">*</span></label>
                  <input
                    value={formData.name}
                    onChange={(e) => setFormData((d) => ({ ...d, name: e.target.value }))}
                    className="input-field"
                    required
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData((d) => ({ ...d, email: e.target.value }))}
                    className="input-field"
                    required
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  value={formData.subject}
                  onChange={(e) => setFormData((d) => ({ ...d, subject: e.target.value }))}
                  className="input-field"
                  placeholder="What's this about?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message <span className="text-red-500">*</span></label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData((d) => ({ ...d, message: e.target.value }))}
                  className="input-field"
                  rows={5}
                  required
                  placeholder="Your message..."
                />
              </div>
              <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2 disabled:opacity-50">
                <Send className="w-4 h-4" />
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
