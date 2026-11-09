'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  ChevronDown, 
  Menu, 
  X, 
  User, 
  KeyRound, 
  LogOut, 
  HelpCircle, 
  Compass, 
  BookOpen, 
  ShieldCheck, 
  Scale, 
  RotateCcw,
  ShoppingBag
} from 'lucide-react';
import { useCart } from '@/context/CartContext';

export const MarketplaceNavbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { totalCount, setIsDrawerOpen } = useCart();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [mobileMoreExpanded, setMobileMoreExpanded] = useState(false);

  // Authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('Rahul Sharma');

  const moreRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);

  // Sync auth state from localStorage
  useEffect(() => {
    const checkAuth = () => {
      const auth = localStorage.getItem('sodaars_auth');
      const user = localStorage.getItem('sodaars_user');
      setIsLoggedIn(auth === 'true');
      if (user) {
        try {
          const parsed = JSON.parse(user);
          if (parsed?.name) setUserName(parsed.name);
        } catch {
          // fallback
        }
      }
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);
    window.addEventListener('sodaars_auth_change', checkAuth);
    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('sodaars_auth_change', checkAuth);
    };
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreDropdownOpen(false);
      }
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setMoreDropdownOpen(false);
    setAccountDropdownOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('sodaars_auth');
    localStorage.removeItem('sodaars_user');
    setIsLoggedIn(false);
    setAccountDropdownOpen(false);
    window.dispatchEvent(new Event('sodaars_auth_change'));
    router.push('/');
  };

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Explore Hoardings', href: '/explore' },
    { label: 'Map View', href: '/map' },
    { label: 'About Us', href: '/about' },
    { label: 'Contact Us', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200/80 shadow-xs transition-all font-sans">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-3">
        
        {/* Left: Brand Logo */}
        <div className="flex items-center shrink-0">
          <Link href="/" className="flex items-center group py-1">
            <img
              src="/logo.png"
              alt="Book Hoardings - Find. Book. Advertise."
              className="h-10 sm:h-11 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]"
              width={167}
              height={44}
            />
          </Link>
        </div>

        {/* Center: Main Navigation Menu (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-medium text-zinc-700">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-2 rounded-full transition-colors cursor-pointer ${
                  isActive
                    ? 'text-[#B00020] bg-rose-50/70 font-semibold'
                    : 'text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100/80'
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          {/* More Dropdown */}
          <div className="relative" ref={moreRef}>
            <button
              type="button"
              onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full transition-colors cursor-pointer ${
                moreDropdownOpen
                  ? 'text-[#B00020] bg-rose-50/70 font-semibold'
                  : 'text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100/80'
              }`}
            >
              <span>More</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${moreDropdownOpen ? 'rotate-180 text-[#B00020]' : 'text-zinc-400'}`} />
            </button>

            {moreDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl shadow-zinc-900/10 border border-zinc-200/90 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                {/* Resources & Help Section */}
                <div className="px-3 py-1.5 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                  Resources & Help
                </div>
                <div className="space-y-0.5 mb-2">
                  <Link
                    href="/faq"
                    onClick={() => setMoreDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-zinc-700 hover:text-[#B00020] hover:bg-rose-50/50 transition-colors"
                  >
                    <HelpCircle className="w-4 h-4 text-zinc-400" />
                    <span>FAQ</span>
                  </Link>
                  <Link
                    href="/how-it-works"
                    onClick={() => setMoreDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-zinc-700 hover:text-[#B00020] hover:bg-rose-50/50 transition-colors"
                  >
                    <Compass className="w-4 h-4 text-zinc-400" />
                    <span>How It Works</span>
                  </Link>
                  <Link
                    href="/blog"
                    onClick={() => setMoreDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-zinc-700 hover:text-[#B00020] hover:bg-rose-50/50 transition-colors"
                  >
                    <BookOpen className="w-4 h-4 text-zinc-400" />
                    <span>Blog</span>
                  </Link>
                </div>

                <div className="border-t border-zinc-100 my-1" />

                {/* Legal Section */}
                <div className="px-3 py-1.5 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                  Legal
                </div>
                <div className="space-y-0.5">
                  <Link
                    href="/privacy-policy"
                    onClick={() => setMoreDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-zinc-700 hover:text-[#B00020] hover:bg-rose-50/50 transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4 text-zinc-400" />
                    <span>Privacy Policy</span>
                  </Link>
                  <Link
                    href="/terms"
                    onClick={() => setMoreDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-zinc-700 hover:text-[#B00020] hover:bg-rose-50/50 transition-colors"
                  >
                    <Scale className="w-4 h-4 text-zinc-400" />
                    <span>Terms and Conditions</span>
                  </Link>
                  <Link
                    href="/refund-policy"
                    onClick={() => setMoreDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-zinc-700 hover:text-[#B00020] hover:bg-rose-50/50 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4 text-zinc-400" />
                    <span>Refund Policy</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Right Section: Media Plan Cart Button + Auth State */}
        <div className="hidden lg:flex items-center gap-3">
          
          {/* CAMPAIGN MEDIA PLAN CART BUTTON */}
          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full border border-zinc-200/90 hover:border-zinc-300 bg-white hover:bg-zinc-50 transition-all text-xs font-semibold text-zinc-800 shadow-2xs cursor-pointer group"
            title="Open Media Cart"
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4 text-[#B00020] group-hover:scale-105 transition-transform" />
              {totalCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-[#B00020] text-white text-[10px] font-semibold w-4 h-4 rounded-full flex items-center justify-center leading-none ring-2 ring-white">
                  {totalCount > 99 ? '99+' : totalCount}
                </span>
              )}
            </div>
            <span>Media Cart</span>
            {totalCount > 0 && (
              <span className="text-[11px] font-semibold text-[#B00020] bg-rose-50 px-1.5 py-0.2 rounded-full">
                {totalCount}
              </span>
            )}
          </button>

          <span className="text-zinc-200 font-light select-none">|</span>

          {/* Auth State Controls (Before Login vs After Login) */}
          {!isLoggedIn ? (
            /* BEFORE LOGIN: Sign In | Register */
            <div className="flex items-center gap-2 text-sm font-medium">
              <Link
                href="/login"
                className="px-3 py-2 text-zinc-700 hover:text-[#B00020] transition-colors cursor-pointer text-xs font-medium"
              >
                Sign In
              </Link>

              <span className="text-zinc-300 font-light select-none">|</span>

              <Link
                href="/register"
                className="px-4 py-2 rounded-full bg-[#B00020] hover:bg-[#8f0019] text-white text-xs font-semibold shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer"
              >
                Register
              </Link>
            </div>
          ) : (
            /* AFTER LOGIN: My Account (Dropdown) */
            <div className="relative" ref={accountRef}>
              <button
                type="button"
                onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-zinc-200/90 hover:border-zinc-300 bg-white hover:bg-zinc-50 transition-all cursor-pointer shadow-2xs"
              >
                <div className="w-7 h-7 rounded-full bg-rose-50 text-[#B00020] flex items-center justify-center font-semibold text-xs border border-rose-100">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-semibold text-zinc-900 leading-tight">My Account</span>
                  <span className="text-[10px] text-zinc-500 font-normal leading-none truncate max-w-[100px]">{userName}</span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 ${accountDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {accountDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl shadow-zinc-900/10 border border-zinc-200/90 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-2 border-b border-zinc-100">
                    <p className="text-xs font-semibold text-zinc-900">{userName}</p>
                    <p className="text-[11px] text-zinc-500 truncate">Advertiser Portal</p>
                  </div>
                  <div className="pt-1 space-y-0.5">
                    <Link
                      href="/account"
                      onClick={() => setAccountDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-zinc-700 hover:text-[#B00020] hover:bg-rose-50/50 transition-colors"
                    >
                      <User className="w-4 h-4 text-zinc-400" />
                      <span>My Profile</span>
                    </Link>
                    <Link
                      href="/account?tab=security"
                      onClick={() => setAccountDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-zinc-700 hover:text-[#B00020] hover:bg-rose-50/50 transition-colors"
                    >
                      <KeyRound className="w-4 h-4 text-zinc-400" />
                      <span>Change Password</span>
                    </Link>
                    <div className="border-t border-zinc-100 my-1" />
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer text-left"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Action Controls */}
        <div className="lg:hidden flex items-center gap-2">
          
          {/* Mobile Cart Trigger */}
          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            className="p-2 rounded-xl border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 relative cursor-pointer"
            aria-label="View Media Cart"
          >
            <ShoppingBag className="w-5 h-5 text-[#B00020]" />
            {totalCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#B00020] text-white text-[9px] font-semibold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                {totalCount}
              </span>
            )}
          </button>

          {!isLoggedIn ? (
            <Link
              href="/register"
              className="px-3 py-1.5 rounded-full bg-[#B00020] text-white text-xs font-semibold"
            >
              Register
            </Link>
          ) : (
            <Link
              href="/account"
              className="w-8 h-8 rounded-full bg-rose-50 text-[#B00020] flex items-center justify-center font-semibold text-xs border border-rose-100"
            >
              {userName.charAt(0).toUpperCase()}
            </Link>
          )}

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl hover:bg-zinc-100 text-zinc-700 transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-zinc-200/90 bg-white px-4 pt-3 pb-6 space-y-4 max-h-[85vh] overflow-y-auto animate-in slide-in-from-top-4 duration-200">
          
          {/* Cart Quick Access Pill in Mobile Menu */}
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              setIsDrawerOpen(true);
            }}
            className="w-full flex items-center justify-between p-3 rounded-2xl bg-rose-50/70 border border-rose-200/70 text-[#B00020] cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-4 h-4 text-[#B00020]" />
              <span className="text-xs font-semibold">Media Cart</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-[#B00020] text-white text-xs font-semibold">
              {totalCount} Assets
            </span>
          </button>

          {/* Main Links */}
          <div className="space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-[#B00020] bg-rose-50/80 font-semibold'
                      : 'text-zinc-800 hover:bg-zinc-50'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* More Collapsible Section */}
          <div className="border-t border-zinc-100 pt-3">
            <button
              type="button"
              onClick={() => setMobileMoreExpanded(!mobileMoreExpanded)}
              className="w-full flex items-center justify-between px-4 py-2 text-sm font-semibold text-zinc-900 cursor-pointer"
            >
              <span>More</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileMoreExpanded ? 'rotate-180 text-[#B00020]' : 'text-zinc-400'}`} />
            </button>

            {mobileMoreExpanded && (
              <div className="pl-4 pr-2 pt-2 space-y-3">
                {/* Resources & Help */}
                <div className="space-y-1">
                  <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider px-2">
                    Resources & Help
                  </div>
                  <Link
                    href="/faq"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-zinc-700 hover:bg-zinc-50"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-zinc-400" />
                    <span>FAQ</span>
                  </Link>
                  <Link
                    href="/how-it-works"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-zinc-700 hover:bg-zinc-50"
                  >
                    <Compass className="w-3.5 h-3.5 text-zinc-400" />
                    <span>How It Works</span>
                  </Link>
                  <Link
                    href="/blog"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-zinc-700 hover:bg-zinc-50"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Blog</span>
                  </Link>
                </div>

                {/* Legal */}
                <div className="space-y-1 pt-1">
                  <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider px-2">
                    Legal
                  </div>
                  <Link
                    href="/privacy-policy"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-zinc-700 hover:bg-zinc-50"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Privacy Policy</span>
                  </Link>
                  <Link
                    href="/terms"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-zinc-700 hover:bg-zinc-50"
                  >
                    <Scale className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Terms and Conditions</span>
                  </Link>
                  <Link
                    href="/refund-policy"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-zinc-700 hover:bg-zinc-50"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Refund Policy</span>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Auth Actions */}
          <div className="border-t border-zinc-200/80 pt-4">
            {!isLoggedIn ? (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 px-4 rounded-xl border border-zinc-200 text-center text-xs font-semibold text-zinc-800 hover:bg-zinc-50 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#B00020] text-center text-xs font-semibold text-white shadow-xs hover:bg-[#8f0019] transition-colors"
                >
                  Register
                </Link>
              </div>
            ) : (
              <div className="space-y-1.5 bg-zinc-50 p-3 rounded-2xl">
                <div className="px-2 py-1 text-xs font-semibold text-zinc-900">
                  {userName} (My Account)
                </div>
                <Link
                  href="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-zinc-700 hover:bg-white"
                >
                  <User className="w-4 h-4 text-zinc-400" />
                  <span>My Profile</span>
                </Link>
                <Link
                  href="/account?tab=security"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-zinc-700 hover:bg-white"
                >
                  <KeyRound className="w-4 h-4 text-zinc-400" />
                  <span>Change Password</span>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>

        </div>
      )}
    </header>
  );
};
