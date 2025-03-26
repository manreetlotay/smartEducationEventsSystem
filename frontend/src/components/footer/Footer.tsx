import React from "react";

export default function Footer() {
  return (
    <footer className="w-full bg-[#0b060b] text-white font-semibold">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-bold mb-4">About Us</h3>
            <p className="text-sm">
              We are committed to helping spread education and innovation. Stay connected to learn more about our services and upcoming events.
            </p>
          </div>
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul>
              <li className="mb-2">
                <a href="/" className="hover:underline">Home</a>
              </li>
              <li className="mb-2">
                <a href="/about" className="hover:underline">About</a>
              </li>
              <li className="mb-2">
                <a href="/services" className="hover:underline">Services</a>
              </li>
              <li className="mb-2">
                <a href="/contact" className="hover:underline">Contact</a>
              </li>
            </ul>
          </div>
          {/* Social Media */}
          <div>
            <h3 className="text-lg font-bold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="https://facebook.com" className="hover:underline">Facebook</a>
              <a href="https://twitter.com" className="hover:underline">Twitter</a>
              <a href="https://instagram.com" className="hover:underline">Instagram</a>
              <a href="https://linkedin.com" className="hover:underline">LinkedIn</a>
            </div>
          </div>
        </div>
      </div>
      {/* Bottom Bar with Copyright and Legal Links */}
      <div className="bg-[#0a050a] py-4">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-xs">
          <span>© 2025 SOEN 343. All rights reserved.</span>
          <div className="flex space-x-4 mt-2 md:mt-0">
            <a href="/privacy" className="hover:underline">Privacy Policy</a>
            <a href="/terms" className="hover:underline">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
