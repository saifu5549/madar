import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-foreground text-primary-foreground mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-xl">🕌</span>
              </div>
              <div>
                <h3 className="font-display text-xl font-semibold">
                  Madarsa Directory
                </h3>
                <p className="text-xs opacity-70">India's Largest Madarsa Network</p>
              </div>
            </div>
            <p className="text-sm opacity-80 max-w-md leading-relaxed">
              Connecting madarsas across India. Our platform helps Islamic institutions
              go digital, bringing transparency and trust to Islamic education.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold mb-4">Quick Links</h4>
            <nav className="flex flex-col gap-2">
              <Link to="/" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                Home
              </Link>
              <Link to="/madarsas" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                Browse Madarsas
              </Link>
              <Link to="/auth?mode=register" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                Add Your Madarsa
              </Link>
              <Link to="/about" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                About Us
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold mb-4">Contact</h4>
            <div className="flex flex-col gap-2 text-sm opacity-80">
              <p>info@madarsadirectory.in</p>
              <p>+91 1800-XXX-XXXX</p>
              <p>New Delhi, India</p>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center">
          <p className="text-sm opacity-60">
            © {new Date().getFullYear()} Madarsa Directory. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
