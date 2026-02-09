import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, LogIn, LogOut, Building2, Menu, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useTranslation();
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-card/80 backdrop-blur-lg">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <span className="text-primary-foreground text-xl">🕌</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="font-display text-xl font-semibold text-foreground">
                {t('header.title')}
              </h1>
              <p className="text-xs text-muted-foreground -mt-0.5">
                {t('header.subtitle')}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {t('header.home')}
            </Link>
            <Link
              to="/madarsas"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {t('header.allMadarsas')}
            </Link>
            <Link
              to="/about"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {t('header.about')}
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcher />

            {user ? (
              <>
                <Link to="/my-madarsa">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Building2 className="w-4 h-4" />
                    My Madarsa
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2"
                  onClick={() => logout()}
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <LogIn className="w-4 h-4" />
                    {t('header.login')}
                  </Button>
                </Link>
                <Link to="/add-madarsa">
                  <Button variant="hero" size="sm" className="gap-2">
                    <Plus className="w-4 h-4" />
                    {t('header.addMadarsa')}
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Language Switcher */}
          <div className="md:hidden">
            <LanguageSwitcher />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <nav className="flex flex-col gap-2">
              <Link
                to="/"
                className="px-4 py-2 text-sm font-medium text-foreground hover:bg-accent rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('header.home')}
              </Link>
              <Link
                to="/madarsas"
                className="px-4 py-2 text-sm font-medium text-foreground hover:bg-accent rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('header.allMadarsas')}
              </Link>
              <Link
                to="/about"
                className="px-4 py-2 text-sm font-medium text-foreground hover:bg-accent rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('header.about')}
              </Link>
              <div className="border-t border-border my-2" />

              {user ? (
                <>
                  <Link to="/my-madarsa" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full gap-2">
                      <Building2 className="w-4 h-4" />
                      My Madarsa
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    className="w-full gap-2 mt-2"
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full gap-2">
                      <LogIn className="w-4 h-4" />
                      {t('header.login')}
                    </Button>
                  </Link>
                  <Link to="/add-madarsa" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="hero" className="w-full gap-2 mt-2">
                      <Plus className="w-4 h-4" />
                      {t('header.addMadarsa')}
                    </Button>
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
