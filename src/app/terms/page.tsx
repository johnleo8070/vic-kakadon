import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span>/</span>
        <span className="text-dark font-medium">Terms & Conditions</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-sm p-6 md:p-12">
        <h1 className="text-3xl font-bold font-serif text-dark mb-8">Terms & Conditions</h1>

        <div className="space-y-8 text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-dark mb-4">1. General Terms</h2>
            <p>Welcome to K D K collections wears. By accessing and using our website, you agree to be bound by these terms and conditions. If you do not agree with any part of these terms, please do not use our services.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-dark mb-4">2. Products & Pricing</h2>
            <p>All product prices displayed on our website are in Nigerian Naira (₦). Prices are subject to change without prior notice. We reserve the right to modify or discontinue any product at any time. Product images are for illustrative purposes and may vary slightly from the actual product.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-dark mb-4">3. Orders & Payment</h2>
            <p>Orders are confirmed upon receipt of payment verification. We accept bank transfers as our primary payment method. Customers must upload proof of payment (screenshot) for order processing. Orders are subject to availability and confirmation.</p>
            <p className="mt-2"><strong>Important:</strong> Delivery fees are not included in the product price. Our delivery team will contact you via email, WhatsApp, or phone to discuss delivery costs based on your location.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-dark mb-4">4. Shipping & Delivery</h2>
            <p>Shipping times vary based on your location. After payment verification, orders are typically processed within 1-2 business days. Delivery costs are calculated based on the destination and will be communicated to you before dispatch.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-dark mb-4">5. Returns & Refunds</h2>
            <p>We offer a 30-day return policy for unused items in their original packaging. Items must be returned in the same condition as received. Return shipping costs are the responsibility of the customer unless the item is defective.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-dark mb-4">6. Intellectual Property</h2>
            <p>All content on this website, including text, images, logos, and designs, is the property of K D K collections wears and is protected by intellectual property laws. Unauthorized use is prohibited.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-dark mb-4">7. Privacy</h2>
            <p>We respect your privacy and protect your personal information. Please refer to our Privacy Policy for details on how we collect, use, and store your data.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-dark mb-4">8. Contact Us</h2>
            <p>If you have any questions about these terms, please contact us at:</p>
            <p className="mt-2">
              Email: kakadonkakadon@yahoo.com<br />
              Phone: 0810 661 7255<br />
              Address: 19/21, Breadfruit By Sulubolaji, Mandilas Lagos Island, Shop Number 2F 09, Lagos, Nigeria, 101223
            </p>
          </section>

          <div className="pt-4 border-t">
            <p className="text-sm text-gray-500">Last updated: June 2026</p>
          </div>
        </div>
      </div>
    </div>
  );
}
