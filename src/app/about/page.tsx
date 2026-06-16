import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Globe, Briefcase, Award, CheckCircle, ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-16 animate-fade-in">
      {/* Hero Section */}
      <section className="relative bg-dark text-white py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <Image 
            src="/images/about-img/store-img-1.jpeg" 
            alt="VIC-KAKADON INTERNATIONAL LIMITED Background" 
            fill 
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/80 to-transparent" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="max-w-2xl">
              <div className="mb-8 inline-block bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/10">
                <Image 
                  src="/images/logo.png" 
                  alt="VIC-KAKADON Logo" 
                  width={200} 
                  height={80} 
                  className="object-contain drop-shadow-2xl"
                />
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold font-serif mb-6 leading-tight text-gold">
                About VIC-KAKADON <br/>INTERNATIONAL LIMITED
              </h1>
              <p className="text-lg text-gray-300 leading-relaxed mb-8">
                Welcome to VIC-KAKADON INTERNATIONAL LIMITED, a premier, fully incorporated corporate entity dedicated to driving value across local and international markets. Established with a vision to deliver excellence, reliability, and seamless execution, we operate as a dynamic force in commerce, trade, and corporate services.
              </p>
            </div>
            
            <div className="hidden lg:block flex-1 relative h-[400px] w-full rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10">
              <video 
                src="/images/about-img/store-vid-1.mp4" 
                autoPlay 
                loop 
                muted 
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Who We Are Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold mb-6">
                <ShieldCheck className="w-4 h-4" />
                Trusted Corporate Entity
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold font-serif text-dark mb-6">Who We Are</h2>
              <p className="text-gray-600 leading-relaxed mb-6 text-lg">
                Incorporated on September 25, 2023, under the Federal Republic of Nigeria’s Companies and Allied Matters Act 2020 (RC Number: 7153434), <strong>VIC-KAKADON INTERNATIONAL LIMITED</strong> is structured as a private company limited by shares.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6 text-lg">
                From our headquarters in Abia State, Nigeria, we have built a robust infrastructure designed to handle large-scale business operations with absolute transparency and statutory compliance.
              </p>
              <div className="flex items-center gap-4 mt-8 bg-gray-50 p-6 rounded-xl border border-gray-100">
                <div className="flex-shrink-0 w-14 h-14 bg-primary rounded-full flex items-center justify-center text-white shadow-lg">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="font-bold text-dark text-lg">Fully Incorporated & Registered</h4>
                  <p className="text-gray-500">Official RC Number: 7153434</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative h-64 rounded-2xl overflow-hidden shadow-lg mt-8">
                <Image src="/images/about-img/store-img-2.jpeg" alt="Our Store" fill className="object-cover" />
              </div>
              <div className="relative h-64 rounded-2xl overflow-hidden shadow-lg">
                <Image src="/images/about-img/store-img-3.jpeg" alt="Our Collection" fill className="object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Business Activities */}
      <section className="py-24 bg-gray-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold font-serif text-dark mb-4">Core Business Activities</h2>
            <p className="text-lg text-gray-600">
              We specialize in bridging markets and delivering top-tier solutions across multiple sectors with uncompromised quality.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Activity 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100 hover:border-primary/20">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                <Award className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-dark mb-4 group-hover:text-primary transition-colors">General Merchandise</h3>
              <p className="text-gray-600 leading-relaxed">
                Sourcing, distributing, and supplying high-quality goods across diverse consumer and industrial markets.
              </p>
            </div>

            {/* Activity 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100 hover:border-primary/20">
              <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                <Globe className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-dark mb-4 group-hover:text-primary transition-colors">Imports & Exports</h3>
              <p className="text-gray-600 leading-relaxed">
                Managing complex international supply chains to ensure the seamless flow of general goods across global borders.
              </p>
            </div>

            {/* Activity 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100 hover:border-primary/20">
              <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                <Briefcase className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-dark mb-4 group-hover:text-primary transition-colors">General Contracts</h3>
              <p className="text-gray-600 leading-relaxed">
                Executing strategic public and private sector projects with a strict commitment to deadlines, premium standards, and regulatory excellence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Corporate Values & Trust */}
      <section className="py-24 bg-dark text-white relative">
        <div className="absolute inset-0 opacity-10">
          <Image src="/images/about-img/store-img-4.jpeg" alt="Background Texture" fill className="object-cover" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 relative h-[500px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 group">
              <Image 
                src="/images/about-img/store-img-5.jpeg" 
                alt="Corporate Values" 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-8">
                <div className="text-gold font-bold text-2xl font-serif">Integrity in every transaction.</div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl lg:text-4xl font-bold font-serif text-gold mb-6">Our Corporate Values & Trust</h2>
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                At VIC-KAKADON INTERNATIONAL LIMITED, transparency isn't just a corporate buzzword—it is the foundation of our entire operation. We believe that building a sustainable business requires legal accountability and verifiable integrity.
              </p>
              <div className="bg-white/10 p-8 rounded-2xl border border-white/20 mt-8 backdrop-blur-md shadow-2xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Verifiable & Fully Compliant</h3>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  We take pride in being a legitimate, active corporate citizen. To give our global clients, suppliers, and partners complete peace of mind, our official Corporate Affairs Commission (CAC) registration status and certification details are openly displayed below.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Corporate Credentials & Registration */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold font-serif text-dark mb-4">Corporate Credentials & Registration</h2>
            <p className="text-lg text-gray-600">
              Complete transparency into our official incorporation and statutory compliance.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Credentials Info */}
            <div className="bg-gray-50 p-8 sm:p-10 rounded-3xl shadow-lg border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <ShieldCheck className="w-32 h-32" />
              </div>
              <h3 className="text-2xl font-bold text-dark mb-8 border-b-2 border-primary/20 pb-4 relative z-10">Company Details</h3>
              <ul className="space-y-6 relative z-10">
                <li className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-gray-200 pb-4">
                  <span className="text-gray-500 font-medium mb-1 sm:mb-0">Company Name</span>
                  <span className="font-bold text-dark sm:text-right text-lg text-primary">VIC-KAKADON INTERNATIONAL LIMITED</span>
                </li>
                <li className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-gray-200 pb-4">
                  <span className="text-gray-500 font-medium mb-1 sm:mb-0">RC Number</span>
                  <span className="font-bold text-dark text-lg">7153434</span>
                </li>
                <li className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-gray-200 pb-4">
                  <span className="text-gray-500 font-medium mb-1 sm:mb-0">Date of Registration</span>
                  <span className="font-bold text-dark sm:text-right">September 25, 2023</span>
                </li>
                <li className="flex flex-col sm:flex-row sm:justify-between sm:items-start border-b border-gray-200 pb-4">
                  <span className="text-gray-500 font-medium mb-1 sm:mb-0 sm:w-1/3">Registered Office</span>
                  <span className="font-bold text-dark sm:text-right sm:w-2/3 leading-snug">No. 51, Okereke Street by Power Line, Aba, Abia State, Nigeria</span>
                </li>
                <li className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-gray-200 pb-4">
                  <span className="text-gray-500 font-medium mb-1 sm:mb-0">Company Status</span>
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-green-100 text-green-700 rounded-full font-bold text-sm shadow-sm">
                    <CheckCircle className="w-4 h-4" /> Active
                  </span>
                </li>
                <li className="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-2">
                  <span className="text-gray-500 font-medium mb-1 sm:mb-0">Official Correspondence</span>
                  <a href="mailto:kakadonkakadon@yahoo.com" className="font-bold text-primary hover:text-primary-dark hover:underline transition-colors">kakadonkakadon@yahoo.com</a>
                </li>
              </ul>
            </div>

            {/* CAC Images Gallery */}
            <div className="flex flex-col gap-8">
              <div className="bg-white p-4 rounded-3xl shadow-lg border border-gray-100">
                <div className="flex items-center gap-3 mb-4 px-2">
                  <div className="w-8 h-8 bg-gold/20 rounded-full flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 text-gold" />
                  </div>
                  <h4 className="font-bold text-dark text-lg">Corporate Incorporation Certificate</h4>
                </div>
                <div className="relative h-72 sm:h-96 w-full rounded-2xl overflow-hidden bg-gray-100 group">
                  <Image 
                    src="/images/about-img/CAC-2.jpeg" 
                    alt="Corporate Incorporation Certificate" 
                    fill 
                    className="object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-3xl shadow-lg border border-gray-100">
                <div className="flex items-center gap-3 mb-4 px-2">
                  <div className="w-8 h-8 bg-gold/20 rounded-full flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 text-gold" />
                  </div>
                  <h4 className="font-bold text-dark text-lg">Official CAC Status Report</h4>
                </div>
                <div className="relative h-72 sm:h-96 w-full rounded-2xl overflow-hidden bg-gray-100 group">
                  <Image 
                    src="/images/about-img/CAC-1.jpeg" 
                    alt="Official CAC Status Report" 
                    fill 
                    className="object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary via-primary-dark to-dark text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('/images/about-img/store-img-7.jpeg')] bg-cover bg-center mix-blend-overlay" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-4xl lg:text-5xl font-bold font-serif mb-8 text-gold drop-shadow-lg">Let’s Build Together</h2>
          <p className="text-xl text-white/90 mb-12 leading-relaxed max-w-3xl mx-auto drop-shadow">
            Whether you are looking to partner on large-scale international trade, source general goods, or execute high-level commercial contracts, VIC-KAKADON INTERNATIONAL LIMITED is your trusted partner for growth.
          </p>
          <Link 
            href="/contact" 
            className="inline-flex items-center gap-2 bg-white text-primary font-bold text-lg px-10 py-5 rounded-full shadow-2xl hover:shadow-primary/50 hover:bg-gray-50 hover:-translate-y-1 transition-all duration-300"
          >
            Contact Our Team Today <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

    </div>
  );
}
