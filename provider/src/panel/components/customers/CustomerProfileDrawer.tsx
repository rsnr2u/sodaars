import React from 'react';
import {
  Users,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Edit,
} from 'lucide-react';
import Drawer from '../../../components/ui/Drawer';
import Button from '../../../components/ui/Button';
import {
  CustomerRecord,
  CUSTOMER_TYPE_CONFIG,
  CUSTOMER_STATUS_CONFIG,
} from '../../types/customer';
import { Calendar } from 'lucide-react';
import { getBookingsForCustomer } from '../../data/sampleBookings';

export interface CustomerProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  customer: CustomerRecord | null;
  onEdit?: (customer: CustomerRecord) => void;
  onViewBookings?: (customer: CustomerRecord) => void;
}

export const CustomerProfileDrawer: React.FC<CustomerProfileDrawerProps> = ({
  isOpen,
  onClose,
  customer,
  onEdit,
  onViewBookings,
}) => {
  if (!customer) return null;

  const typeMeta = CUSTOMER_TYPE_CONFIG[customer.customerType];
  const statusMeta = CUSTOMER_STATUS_CONFIG[customer.status];

  const customerBookings = getBookingsForCustomer(customer.id, customer.companyName);
  const activeBookingsCount = customerBookings.filter(
    (b) => b.status === 'ACTIVE' || b.status === 'CONFIRMED'
  ).length;
  const completedBookingsCount = customerBookings.filter((b) => b.status === 'COMPLETED').length;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Users size={17} className="text-[#EA580C]" />
          <span>Customer Profile — {customer.companyName}</span>
        </div>
      }
      width="max-w-2xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="text-xs text-[#737373]">
            Customer ID:{' '}
            <span className="font-mono font-bold text-[#171717]">{customer.id}</span>
          </div>
          <div className="flex items-center gap-2">
            {onViewBookings && (
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Calendar size={13} className="text-[#EA580C]" />}
                onClick={() => {
                  onClose();
                  onViewBookings(customer);
                }}
                className="text-xs text-[#EA580C] border-orange-200 hover:bg-orange-50 font-semibold"
              >
                Bookings ({customerBookings.length})
              </Button>
            )}
            {onEdit && (
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Edit size={14} />}
                onClick={() => onEdit(customer)}
              >
                Edit Customer
              </Button>
            )}
            <Button variant="secondary" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* ========================================================================= */}
        {/* 1. CUSTOMER OVERVIEW                                                      */}
        {/* ========================================================================= */}
        <div className="bg-[#FAFAF9] rounded-xl p-4 border border-[#E5E5E5] space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373]">
              Customer Overview
            </span>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${statusMeta.badgeBg} ${statusMeta.badgeText} ${statusMeta.badgeBorder}`}
            >
              {statusMeta.label}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3.5 text-xs">
            <div>
              <span className="text-[#737373] text-[11px] block">Company Name</span>
              <span className="font-bold text-[#171717] text-sm">{customer.companyName}</span>
            </div>
            <div>
              <span className="text-[#737373] text-[11px] block">Brand Name</span>
              <span className="font-medium text-[#171717]">
                {customer.brandName || '—'}
              </span>
            </div>
            <div>
              <span className="text-[#737373] text-[11px] block">Customer Type</span>
              <div className="mt-1">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border ${typeMeta.badgeBg} ${typeMeta.badgeText} ${typeMeta.badgeBorder}`}
                >
                  {typeMeta.label}
                </span>
              </div>
            </div>
            <div>
              <span className="text-[#737373] text-[11px] block">Account Status</span>
              <span className="font-medium text-[#171717] mt-1 block">
                {customer.status}
              </span>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-white border border-[#E5E5E5] text-[11px] text-[#525252] flex items-start gap-2">
            <span className="font-bold text-[#171717] shrink-0">Type Definition:</span>
            <span>{typeMeta.description}</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. PRIMARY CONTACT                                                        */}
        {/* ========================================================================= */}
        <div className="rounded-xl border border-[#E5E5E5] p-4 bg-white space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373]">
              Primary Contact
            </span>
            <span className="text-[10px] font-semibold text-[#737373]">
              Communication Channels
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs bg-[#FAFAF9] p-3 rounded-lg border border-[#E5E5E5]">
            <div>
              <span className="text-[#737373] text-[11px] block">Contact Person</span>
              <span className="font-semibold text-[#171717]">{customer.contactPerson}</span>
            </div>
            <div>
              <span className="text-[#737373] text-[11px] block">Email</span>
              <span className="font-medium text-[#171717] flex items-center gap-1 mt-0.5">
                <Mail size={12} className="text-[#737373]" />
                {customer.email}
              </span>
            </div>
            <div>
              <span className="text-[#737373] text-[11px] block">Phone</span>
              <span className="font-medium text-[#171717] flex items-center gap-1 mt-0.5">
                <Phone size={12} className="text-[#737373]" />
                {customer.phone}
              </span>
            </div>
            <div>
              <span className="text-[#737373] text-[11px] block">Alternate Phone</span>
              <span className="font-medium text-[#171717]">
                {customer.alternatePhone || '—'}
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. BUSINESS INFORMATION                                                   */}
        {/* ========================================================================= */}
        <div className="rounded-xl border border-[#E5E5E5] p-4 bg-white space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373]">
              Business Information
            </span>
            <span className="text-[10px] font-semibold text-[#737373]">
              Tax Credentials
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs bg-[#FAFAF9] p-3 rounded-lg border border-[#E5E5E5]">
            <div>
              <span className="text-[#737373] text-[11px] block">GSTIN</span>
              <span className="font-mono font-semibold text-[#171717]">
                {customer.gstin || '—'}
              </span>
            </div>
            <div>
              <span className="text-[#737373] text-[11px] block">PAN</span>
              <span className="font-mono font-semibold text-[#171717]">
                {customer.pan || '—'}
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. ADDRESS                                                                */}
        {/* ========================================================================= */}
        <div className="rounded-xl border border-[#E5E5E5] p-4 bg-white space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373]">
              Billing & Address
            </span>
            <MapPin size={13} className="text-[#EA580C]" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-[#FAFAF9] p-3 rounded-lg border border-[#E5E5E5]">
            <div className="col-span-2 sm:col-span-4">
              <span className="text-[#737373] text-[11px] block">Billing Address</span>
              <span className="font-medium text-[#171717]">
                {customer.billingAddress || '—'}
              </span>
            </div>
            <div>
              <span className="text-[#737373] text-[11px] block">City</span>
              <span className="font-medium text-[#171717]">{customer.city || '—'}</span>
            </div>
            <div>
              <span className="text-[#737373] text-[11px] block">State</span>
              <span className="font-medium text-[#171717]">{customer.state || '—'}</span>
            </div>
            <div>
              <span className="text-[#737373] text-[11px] block">Pincode</span>
              <span className="font-medium text-[#171717]">{customer.pincode || '—'}</span>
            </div>
            <div>
              <span className="text-[#737373] text-[11px] block">Country</span>
              <span className="font-medium text-[#171717]">{customer.country}</span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 5. BOOKING & CAMPAIGN ACTIVITY                                            */}
        {/* ========================================================================= */}
        <div className="rounded-xl border border-[#E5E5E5] p-4 bg-white space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373]">
              Operational Activity
            </span>
            <span className="text-[10px] font-semibold text-[#737373]">
              Downstream Ledgers
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 text-xs">
            <div className="bg-[#FAFAF9] p-3 rounded-lg border border-[#E5E5E5]">
              <span className="text-[#737373] text-[11px] block">Active Bookings</span>
              <span className="text-base font-bold text-emerald-800 mt-1 block">
                {activeBookingsCount}
              </span>
            </div>
            <div className="bg-[#FAFAF9] p-3 rounded-lg border border-[#E5E5E5]">
              <span className="text-[#737373] text-[11px] block">Completed Bookings</span>
              <span className="text-base font-bold text-[#171717] mt-1 block">
                {completedBookingsCount}
              </span>
            </div>
            <div className="bg-[#FAFAF9] p-3 rounded-lg border border-[#E5E5E5]">
              <span className="text-[#737373] text-[11px] block">Total Bookings</span>
              <span className="text-base font-bold text-[#EA580C] mt-1 block">
                {customerBookings.length}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <p className="text-[11px] text-[#737373] leading-relaxed">
              Customer relationships connect directly to bookings and mounting execution records in the Provider Panel.
            </p>
            {onViewBookings && (
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Calendar size={13} className="text-[#EA580C]" />}
                onClick={() => {
                  onClose();
                  onViewBookings(customer);
                }}
                className="text-xs shrink-0 ml-3 text-[#EA580C] border-orange-200 hover:bg-orange-50 font-semibold"
              >
                View Bookings
              </Button>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 6. RELATIONSHIP CONNECTION                                                */}
        {/* ========================================================================= */}
        <div className="rounded-xl border border-stone-200 bg-white p-4 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373] block mb-2">
            Relationship Pipeline
          </span>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#171717] flex-wrap">
            <span className="px-2.5 py-1 rounded bg-orange-50 border border-orange-200 text-[#EA580C]">
              Customer
            </span>
            <ArrowRight size={13} className="text-[#737373]" />
            <span className="px-2.5 py-1 rounded bg-[#FAFAF9] border border-[#E5E5E5]">
              Booking
            </span>
            <ArrowRight size={13} className="text-[#737373]" />
            <span className="px-2.5 py-1 rounded bg-[#FAFAF9] border border-[#E5E5E5]">
              Advertising Resource
            </span>
            <ArrowRight size={13} className="text-[#737373]" />
            <span className="px-2.5 py-1 rounded bg-[#FAFAF9] border border-[#E5E5E5]">
              Campaign
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 7. NOTES                                                                  */}
        {/* ========================================================================= */}
        {customer.notes && (
          <div className="rounded-xl border border-[#E5E5E5] p-4 bg-white space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373] block">
              Internal Notes
            </span>
            <p className="text-xs text-[#525252] leading-relaxed whitespace-pre-line">
              {customer.notes}
            </p>
          </div>
        )}
      </div>
    </Drawer>
  );
};

export default CustomerProfileDrawer;
