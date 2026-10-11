import React from 'react';
import { Link } from 'react-router-dom';

export const PublicFooter: React.FC = () => {
  return (
    <footer className="w-full bg-[#171717] text-white border-t border-[#262626] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8">
          {/* Brand Info */}
          <div className="col-span-2 sm:col-span-3 md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-sm bg-[#F97316] flex items-center justify-center font-bold text-white text-sm">
                S
              </div>
              <span className="font-bold text-base tracking-tight text-white">SODAARS</span>
            </div>
            <p className="text-xs text-[#A3A3A3] leading-relaxed">
              Streamline Outdoor Digital Advertising Resource System. Operating system and inventory platform built for physical outdoor media asset owners.
            </p>
            <div className="text-[11px] text-[#737373]">
              Pan-India Media Infrastructure
            </div>
          </div>

          {/* Solutions */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
              Solutions
            </h4>
            <ul className="space-y-1.5 text-xs text-[#A3A3A3]">
              <li>
                <Link to="/solutions/resource-management" className="hover:text-white transition-colors">
                  Resource Management
                </Link>
              </li>
              <li>
                <Link to="/solutions/availability-engine" className="hover:text-white transition-colors">
                  Availability Engine
                </Link>
              </li>
              <li>
                <Link to="/solutions/booking-pipeline" className="hover:text-white transition-colors">
                  Booking Pipeline
                </Link>
              </li>
              <li>
                <Link to="/solutions/customer-crm" className="hover:text-white transition-colors">
                  Customer CRM
                </Link>
              </li>
              <li>
                <Link to="/solutions/campaign-execution" className="hover:text-white transition-colors">
                  Campaign Execution
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
              Resources
            </h4>
            <ul className="space-y-1.5 text-xs text-[#A3A3A3]">
              <li>
                <Link to="/resources" className="hover:text-white transition-colors">
                  Outdoor Advertising Resources
                </Link>
              </li>
              <li>
                <Link to="/resources/guides-playbooks" className="hover:text-white transition-colors">
                  Guides &amp; Playbooks
                </Link>
              </li>
              <li>
                <Link to="/resources/faq" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/resources/help-support" className="hover:text-white transition-colors">
                  Help Center &amp; Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Marketplace */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
              Marketplace
            </h4>
            <ul className="space-y-1.5 text-xs text-[#A3A3A3]">
              <li>
                <Link to="/marketplace" className="hover:text-white transition-colors">
                  Marketplace Overview
                </Link>
              </li>
              <li>
                <Link to="/marketplace/how-it-works" className="hover:text-white transition-colors">
                  How Marketplace Works
                </Link>
              </li>
              <li>
                <Link to="/marketplace/discover" className="hover:text-white transition-colors">
                  Discover Inventory
                </Link>
              </li>
              <li>
                <Link to="/marketplace/agreement" className="hover:text-white transition-colors">
                  Participation Terms
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
              Company
            </h4>
            <ul className="space-y-1.5 text-xs text-[#A3A3A3]">
              <li>
                <Link to="/company" className="hover:text-white transition-colors">
                  About SODAARS
                </Link>
              </li>
              <li>
                <Link to="/company/partnerships" className="hover:text-white transition-colors">
                  Build With SODAARS
                </Link>
              </li>
              <li>
                <Link to="/company/contact" className="hover:text-white transition-colors">
                  Contact Team
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-white transition-colors">
                  Pricing Plans
                </Link>
              </li>
            </ul>
          </div>

          {/* Access */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
              Provider Portal
            </h4>
            <ul className="space-y-1.5 text-xs text-[#A3A3A3]">
              <li>
                <Link to="/signin" className="hover:text-white transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/get-started" className="hover:text-white transition-colors">
                  Register Organization
                </Link>
              </li>
              <li>
                <Link to="/panel/dashboard" className="text-[#F97316] hover:underline font-medium">
                  Go to Panel →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[#262626] flex flex-col sm:flex-row items-center justify-between text-xs text-[#737373] gap-4">
          <p>© {new Date().getFullYear()} SODAARS. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Static Outdoor Advertising Media OS</span>
            <span>Zero Blue Brand Design</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;
