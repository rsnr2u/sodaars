import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, ExternalLink, Plus } from 'lucide-react';
import Drawer from '../../../components/ui/Drawer';
import Button from '../../../components/ui/Button';
import { CustomerRecord, CUSTOMER_TYPE_CONFIG, CUSTOMER_STATUS_CONFIG } from '../../types/customer';
import { BookingRecord } from '../../types/booking';
import CustomerBookingsTable from './CustomerBookingsTable';

export interface CustomerBookingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  customer: CustomerRecord | null;
  onViewBooking?: (booking: BookingRecord) => void;
}

export const CustomerBookingsDrawer: React.FC<CustomerBookingsDrawerProps> = ({
  isOpen,
  onClose,
  customer,
  onViewBooking,
}) => {
  const navigate = useNavigate();

  if (!customer) return null;

  const typeMeta = CUSTOMER_TYPE_CONFIG[customer.customerType];
  const statusMeta = CUSTOMER_STATUS_CONFIG[customer.status];

  const handleOpenSeparatePage = () => {
    onClose();
    navigate(`/panel/customers/${customer.id}/bookings`);
  };

  const handleCreateBooking = () => {
    onClose();
    navigate('/panel/bookings/create');
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      width="w-full max-w-5xl xl:max-w-6xl"
      title={
        <div className="flex items-center justify-between w-full pr-3">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="w-7 h-7 rounded-lg bg-orange-50 border border-orange-200 text-[#EA580C] flex items-center justify-center font-bold text-xs shadow-2xs">
              <Calendar size={15} />
            </span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-[#171717] text-sm sm:text-base">
                  {customer.companyName}
                </span>
                <span
                  className={`inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-bold uppercase border ${typeMeta.badgeBg} ${typeMeta.badgeText} ${typeMeta.badgeBorder}`}
                >
                  {typeMeta.label}
                </span>
                <span
                  className={`inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-bold uppercase border ${statusMeta.badgeBg} ${statusMeta.badgeText} ${statusMeta.badgeBorder}`}
                >
                  {statusMeta.label}
                </span>
              </div>
              <span className="text-[11px] text-[#737373] block mt-0.5">
                Customer Bookings Sliding Window • ID:{' '}
                <strong className="font-mono text-[#171717]">{customer.id}</strong>
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleOpenSeparatePage}
            leftIcon={<ExternalLink size={12} />}
            className="text-xs font-semibold text-[#EA580C] border-orange-200 hover:bg-orange-50 shrink-0"
            title="Open in Dedicated Separate Page"
          >
            Separate Page
          </Button>
        </div>
      }
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="text-xs text-[#737373]">
            Viewing active bookings for{' '}
            <strong className="text-[#171717]">{customer.companyName}</strong>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleOpenSeparatePage}
              leftIcon={<ExternalLink size={12} />}
              className="text-xs text-[#EA580C] border-orange-200 hover:bg-orange-50 font-semibold"
            >
              Open Full Page
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleCreateBooking}
              leftIcon={<Plus size={13} />}
              className="text-xs font-semibold"
            >
              New Booking
            </Button>
            <Button variant="secondary" size="sm" onClick={onClose} className="text-xs">
              Close Window
            </Button>
          </div>
        </div>
      }
    >
      <div className="-m-6">
        <CustomerBookingsTable
          customer={customer}
          onClose={onClose}
          onViewBooking={onViewBooking}
          isModalView={true}
          onToggleExpand={handleOpenSeparatePage}
        />
      </div>
    </Drawer>
  );
};

export default CustomerBookingsDrawer;
