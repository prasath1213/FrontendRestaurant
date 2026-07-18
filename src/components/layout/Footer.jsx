import { Link } from "react-router-dom";
import { FiFacebook, FiInstagram, FiTwitter, FiMail } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-ink-100 bg-white pt-12 pb-6">
      <div className="page-shell grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-4">
          <p className="flex items-center gap-2 font-display text-2xl font-bold text-ink-900">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-chili-500 text-sm text-white">
              🍲
            </span>
            Saran Bhai
          </p>
          <p className="max-w-xs text-sm leading-relaxed text-ink-600">
            Bringing the finest home-style gourmet meals straight to your doorstep. Freshly prepared, securely packaged, and delivered hot.
          </p>
          <div className="mt-2 flex gap-4 text-ink-500">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-chili-600 transition"><FiFacebook size={20} /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-chili-600 transition"><FiInstagram size={20} /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-chili-600 transition"><FiTwitter size={20} /></a>
          </div>
        </div>

        <div>
          <h3 className="mb-4 font-semibold text-ink-900">Company</h3>
          <div className="flex flex-col gap-3 text-sm text-ink-600">
            <Link to="/about" className="hover:text-chili-600 transition">About Us</Link>
            <Link to="/careers" className="hover:text-chili-600 transition">Careers</Link>
            <Link to="/our-chefs" className="hover:text-chili-600 transition">Our Chefs</Link>
            <Link to="/blog" className="hover:text-chili-600 transition">Blog</Link>
          </div>
        </div>

        <div>
          <h3 className="mb-4 font-semibold text-ink-900">Support</h3>
          <div className="flex flex-col gap-3 text-sm text-ink-600">
            <Link to="/help-center" className="hover:text-chili-600 transition">Help Center</Link>
            <Link to="/delivery-areas" className="hover:text-chili-600 transition">Delivery Areas</Link>
            <Link to="/track-order" className="hover:text-chili-600 transition">Track Order</Link>
            <Link to="/contact-us" className="hover:text-chili-600 transition">Contact Us</Link>
          </div>
        </div>

        <div>
          <h3 className="mb-4 font-semibold text-ink-900">Stay Updated</h3>
          <p className="mb-4 text-sm text-ink-600">Subscribe to get exclusive offers and new menu updates.</p>
          <form className="flex" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Your email"
              className="w-full rounded-l-lg border border-ink-200 bg-ink-50 px-3 py-2 text-sm text-ink-900 outline-none focus:border-chili-500"
            />
            <button className="flex items-center justify-center rounded-r-lg bg-chili-500 px-3 text-white hover:bg-chili-600">
              <FiMail />
            </button>
          </form>
        </div>
      </div>

      <div className="page-shell mt-12 flex flex-col items-center justify-between gap-4 border-t border-ink-100 pt-6 text-xs text-ink-500 sm:flex-row">
        <p>© {new Date().getFullYear()} Saran Bhai. All rights reserved.</p>
        <div className="flex gap-4">
          <Link to="/privacy-policy" className="hover:text-ink-900">Privacy Policy</Link>
          <Link to="/terms-of-service" className="hover:text-ink-900">Terms of Service</Link>
          <Link to="/cookie-policy" className="hover:text-ink-900">Cookie Policy</Link>
        </div>
      </div>
    </footer>
  );
}