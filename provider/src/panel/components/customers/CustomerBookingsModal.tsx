import React from 'react';
import Modal from '../../../components/ui/Modal';
import { CustomerRecord } from '../../types/customer';
import { BookingRecord } from '../../types/booking';
import CustomerBookingsTable from './CustomerBookingsTable';

export interface CustomerBookingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: CustomerRecord | null;
  onViewBooking?: (booking: BookingRecord) => void;
}

export const CustomerBookingsModal: React.FC<CustomerBookingsModalProps> = ({
  isOpen,
  onClose,
  customer,
  onViewBooking,
}) => {
  if (!customer || !isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-6xl"
    >
      <div className="-m-5">
        <CustomerBookingsTable
          customer={customer}
          onClose={onClose}
          onViewBooking={onViewBooking}
          isModalView={true}
        />
      </div>
    </Modal>
  );
};

export default CustomerBookingsModal;
