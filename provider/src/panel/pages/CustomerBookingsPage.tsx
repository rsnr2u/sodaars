import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Building,
  Mail,
  Phone,
  Plus,
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Button from '../../components/ui/Button';
import { CustomerRecord, CUSTOMER_TYPE_CONFIG, CUSTOMER_STATUS_CONFIG } from '../types/customer';
import { BookingRecord } from '../types/booking';
import CustomerBookingsTable from '../components/customers/CustomerBookingsTable';
import BookingDetailDrawer from '../components/bookings/BookingDetailDrawer';
import { SAMPLE_CUSTOMERS } from '../data/sampleCustomers';
import { getAllProviderBookings, getBookingsForCustomer } from '../data/sampleBookings';

export const CustomerBookingsPage: React.FC = () => {
  const { customerId } = useParams<{ customerId: string }>();
  const navigate = useNavigate();

  // Selected booking for inspector drawer
  const [selectedBookingForDetail, setSelectedBookingForDetail] = useState<BookingRecord | null>(
    null
  );
  const [isBookingDetailOpen, setIsBookingDetailOpen] = useState(false);

  // Retrieve customer record
  const customer = useMemo(() => {
    try {
      const stored = localStorage.getItem('sodaars_provider_customers');
      if (stored) {
        const parsed: CustomerRecord[] = JSON.parse(stored);
        const match = parsed.find((c) => c.id === customerId);
        if (match) return match;
      }
    } catch (e) {
      console.error('Storage error:', e);
    }
    return SAMPLE_CUSTOMERS.find((c) => c.id === customerId) || null;
  }, [customerId]);

  const allBookings = useMemo(() => getAllProviderBookings(), []);
  const customerBookings = useMemo(() => {
    if (!customer) return [];
    return getBookingsForCustomer(customer.id, customer.companyName, allBookings);
  }, [customer, allBookings]);

  if (!customer) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-orange-50 border border-orange-200 text-[#EA580C] flex items-center justify-center mb-4">
          <Building size={28} />
        </div>
        <h2 className="text-lg font-bold text-[#171717] mb-2">Customer Not Found</h2>
        <p className="text-xs text-[#737373] max-w-sm mb-6">
          The requested customer account ID could not be located in your organization roster.
        </p>
        <Button
          variant="primary"
          size="sm"
          leftIcon={<ArrowLeft size={14} />}
          onClick={() => navigate('/panel/customers')}
        >
          Back to Customer CRM
        </Button>
      </div>
    );
  }

  const typeMeta = CUSTOMER_TYPE_CONFIG[customer.customerType];
  const statusMeta = CUSTOMER_STATUS_CONFIG[customer.status];

  return (
    <div className="flex-1 flex flex-col w-full pb-12">
      {/* Top Navigation & Breadcrumb */}
      <div className="border-b border-[#E5E5E5] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            <Link
              to="/panel/customers"
              className="text-[#737373] hover:text-[#171717] font-medium flex items-center gap-1 transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Customer CRM</span>
            </Link>
            <span className="text-[#737373]">•</span>
            <span className="text-[#737373] font-medium">{customer.companyName}</span>
            <span className="text-[#737373]">•</span>
            <span className="text-[#EA580C] font-semibold">Bookings</span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            leftIcon={<ArrowLeft size={13} />}
            onClick={() => navigate('/panel/customers')}
            className="text-xs text-[#737373] hover:text-[#171717]"
          >
            Back to Customers
          </Button>
        </div>
      </div>

      {/* Page Header */}
      <PageHeader
        eyebrow="CUSTOMER BOOKINGS PIPELINE"
        title={`Bookings — ${customer.companyName}`}
        description={`Manage all outdoor media bookings, contracted assets, flighting schedules, and financial ledgers for ${customer.companyName}.`}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<ArrowLeft size={13} />}
              onClick={() => navigate('/panel/customers')}
              className="text-xs font-semibold"
            >
              Back to Customers
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus size={14} />}
              onClick={() => navigate('/panel/bookings/create')}
              className="text-xs font-semibold shadow-xs"
            >
              New Booking
            </Button>
          </div>
        }
      />

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Customer Identity Card */}
        <div className="bg-white rounded-xl border border-[#E5E5E5] p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="w-7 h-7 rounded-lg bg-orange-50 border border-orange-200 text-[#EA580C] flex items-center justify-center font-bold text-xs">
                <Building size={15} />
              </span>
              <h2 className="text-lg font-bold text-[#171717]">{customer.companyName}</h2>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${typeMeta.badgeBg} ${typeMeta.badgeText} ${typeMeta.badgeBorder}`}
              >
                {typeMeta.label}
              </span>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${statusMeta.badgeBg} ${statusMeta.badgeText} ${statusMeta.badgeBorder}`}
              >
                {statusMeta.label}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-[#525252] pt-1">
              <div>
                <span className="text-[10px] text-[#737373] uppercase font-bold block">
                  Customer ID
                </span>
                <span className="font-mono font-bold text-[#171717]">{customer.id}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#737373] uppercase font-bold block">
                  Contact Person
                </span>
                <span className="font-semibold text-[#171717]">{customer.contactPerson}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#737373] uppercase font-bold block">Email</span>
                <span className="text-[#171717] flex items-center gap-1">
                  <Mail size={11} className="text-[#737373]" />
                  {customer.email}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#737373] uppercase font-bold block">Phone</span>
                <span className="text-[#171717] flex items-center gap-1">
                  <Phone size={11} className="text-[#737373]" />
                  {customer.phone}
                </span>
              </div>
            </div>
          </div>

          <div className="flex md:flex-col items-end justify-between border-t md:border-t-0 md:border-l border-[#E5E5E5] pt-3 md:pt-0 md:pl-5 gap-2 shrink-0">
            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373] block">
                Total Bookings
              </span>
              <span className="text-2xl font-extrabold text-[#EA580C]">
                {customerBookings.length}
              </span>
            </div>
            <span className="text-[11px] text-[#737373]">Outdoor Campaign Records</span>
          </div>
        </div>

        {/* Full Data Table of Provider -> Customer Bookings */}
        <CustomerBookingsTable
          customer={customer}
          onViewBooking={(booking) => {
            setSelectedBookingForDetail(booking);
            setIsBookingDetailOpen(true);
          }}
        />
      </div>

      {/* Booking Detail Drawer (Inspector) */}
      <BookingDetailDrawer
        isOpen={isBookingDetailOpen}
        onClose={() => {
          setIsBookingDetailOpen(false);
          setSelectedBookingForDetail(null);
        }}
        booking={selectedBookingForDetail}
      />
    </div>
  );
};

export default CustomerBookingsPage;
