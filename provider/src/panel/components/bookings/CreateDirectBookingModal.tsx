import React, { useState } from 'react';
import { Plus, AlertCircle } from 'lucide-react';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { BookingRecord } from '../../types/booking';

export interface CreateDirectBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (booking: BookingRecord) => void;
}

export const CreateDirectBookingModal: React.FC<CreateDirectBookingModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  // Form fields
  const [customerName, setCustomerName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  const [resourceName, setResourceName] = useState('');
  const [resourceType, setResourceType] = useState('Billboard / Hoarding');
  const [location, setLocation] = useState('');

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Neutral pricing breakdown fields (No automatic formulas)
  const [regularCustomerPrice, setRegularCustomerPrice] = useState('');
  const [sodaarsPrice, setSodaarsPrice] = useState('');
  const [agreedMarkupAmount, setAgreedMarkupAmount] = useState('');
  const [customerAdjustmentAmount, setCustomerAdjustmentAmount] = useState('');
  const [finalInvoicedAmount, setFinalInvoicedAmount] = useState('');

  const [notes, setNotes] = useState('');
  const [initialStatus, setInitialStatus] = useState<'UNDER REVIEW' | 'CONFIRMED'>('UNDER REVIEW');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!customerName.trim()) errs.customerName = 'Customer name is required.';
    if (!companyName.trim()) errs.companyName = 'Company name is required.';
    if (!resourceName.trim()) errs.resourceName = 'Resource is required.';
    if (!location.trim()) errs.location = 'Location is required.';
    if (!startDate) errs.startDate = 'Start date is required.';
    if (!endDate) errs.endDate = 'End date is required.';
    if (startDate && endDate && startDate > endDate) {
      errs.endDate = 'End date cannot be prior to start date.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Generate compliant booking ID
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const bookingId = `BKG-${new Date().getFullYear()}-${randomSuffix}`;

    const newBooking: BookingRecord = {
      id: bookingId,
      customerName: customerName.trim(),
      companyName: companyName.trim(),
      contactEmail: contactEmail.trim() || undefined,
      contactPhone: contactPhone.trim() || undefined,
      resourceId: `RES-${randomSuffix}`,
      resourceName: resourceName.trim(),
      resourceType,
      location: location.trim(),
      startDate,
      endDate,
      source: 'Provider', // Exact approved source concept
      status: initialStatus,
      pricing: {
        regularCustomerPrice: regularCustomerPrice.trim() || undefined,
        sodaarsPrice: sodaarsPrice.trim() || undefined,
        agreedMarkupAmount: agreedMarkupAmount.trim() || undefined,
        customerAdjustmentAmount: customerAdjustmentAmount.trim() || undefined,
        finalInvoicedAmount: finalInvoicedAmount.trim() || undefined,
      },
      notes: notes.trim() || undefined,
      createdAt: new Date().toISOString().split('T')[0],
    };

    onCreate(newBooking);
    handleReset();
    onClose();
  };

  const handleReset = () => {
    setCustomerName('');
    setCompanyName('');
    setContactEmail('');
    setContactPhone('');
    setResourceName('');
    setResourceType('Billboard / Hoarding');
    setLocation('');
    setStartDate('');
    setEndDate('');
    setRegularCustomerPrice('');
    setSodaarsPrice('');
    setAgreedMarkupAmount('');
    setCustomerAdjustmentAmount('');
    setFinalInvoicedAmount('');
    setNotes('');
    setInitialStatus('UNDER REVIEW');
    setErrors({});
  };

  const handleModalClose = () => {
    handleReset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleModalClose}
      title={
        <div className="flex items-center justify-between w-full pr-4">
          <div className="flex items-center gap-2">
            <Plus size={18} className="text-[#EA580C]" />
            <span>Create Direct Booking</span>
          </div>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-orange-50 text-[#EA580C] border border-orange-200">
            Source: Provider
          </span>
        </div>
      }
      maxWidth="max-w-2xl"
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={handleModalClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus size={14} />}
            onClick={handleSubmit}
          >
            Create Direct Booking
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="p-3 rounded-lg bg-orange-50/60 border border-orange-200 text-xs text-orange-950 flex items-start gap-2">
          <AlertCircle size={15} className="text-[#EA580C] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Bookings created here originate from the <strong>Provider</strong>. Availability is scheduled for the selected resource and interval.
          </p>
        </div>

        {/* 1. Customer & Company */}
        <div className="space-y-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373] block border-b border-[#E5E5E5] pb-1">
            Customer Information
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Customer Name"
              placeholder="e.g. Ramesh Sharma"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              error={errors.customerName}
              required
            />
            <Input
              label="Company Name"
              placeholder="e.g. Nexus Media Enterprises"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              error={errors.companyName}
              required
            />
            <Input
              label="Contact Email"
              type="email"
              placeholder="e.g. client@company.com"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
            />
            <Input
              label="Contact Phone"
              placeholder="e.g. +91 98765 43210"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
            />
          </div>
        </div>

        {/* 2. Resource & Interval */}
        <div className="space-y-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373] block border-b border-[#E5E5E5] pb-1">
            Resource & Schedule
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Resource Name"
              placeholder="e.g. Prime Junction Unipole"
              value={resourceName}
              onChange={(e) => setResourceName(e.target.value)}
              error={errors.resourceName}
              required
            />
            <div>
              <label className="block text-xs font-medium text-[#171717] mb-1">
                Resource Type
              </label>
              <select
                value={resourceType}
                onChange={(e) => setResourceType(e.target.value)}
                className="w-full h-9 rounded-md border border-[#E5E5E5] bg-white px-3 text-xs text-[#171717] focus:outline-none focus:border-[#EA580C]"
              >
                <option value="Billboard / Hoarding">Billboard / Hoarding</option>
                <option value="Unipole">Unipole</option>
                <option value="Gantry">Gantry</option>
                <option value="Foot Overbridge (FOB)">Foot Overbridge (FOB)</option>
                <option value="Bus Shelter / BQS">Bus Shelter / BQS</option>
                <option value="Pole Kiosk">Pole Kiosk</option>
                <option value="Transit Media">Transit Media</option>
                <option value="Wall Wrap / Facade">Wall Wrap / Facade</option>
                <option value="Digital OOH (DOOH)">Digital OOH (DOOH)</option>
                <option value="Other Static OOH">Other Static OOH</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <Input
                label="Location"
                placeholder="e.g. MG Road Junction, Bengaluru"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                error={errors.location}
                required
              />
            </div>
            <Input
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              error={errors.startDate}
              required
            />
            <Input
              label="End Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              error={errors.endDate}
              required
            />
          </div>
        </div>

        {/* 3. Pricing Breakdown (Neutral entries) */}
        <div className="space-y-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373] block border-b border-[#E5E5E5] pb-1">
            Pricing Breakdown (Optional Commercial Ledger)
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Regular Customer Price"
              placeholder="e.g. ₹75,000"
              value={regularCustomerPrice}
              onChange={(e) => setRegularCustomerPrice(e.target.value)}
            />
            <Input
              label="SODAARS Price / Provider Net"
              placeholder="e.g. ₹60,000"
              value={sodaarsPrice}
              onChange={(e) => setSodaarsPrice(e.target.value)}
            />
            <Input
              label="Agreed Markup Amount"
              placeholder="e.g. ₹10,000"
              value={agreedMarkupAmount}
              onChange={(e) => setAgreedMarkupAmount(e.target.value)}
            />
            <Input
              label="Customer Adjustment Amount"
              placeholder="e.g. ₹5,000"
              value={customerAdjustmentAmount}
              onChange={(e) => setCustomerAdjustmentAmount(e.target.value)}
            />
            <div className="sm:col-span-2">
              <Input
                label="Final Invoiced Amount"
                placeholder="e.g. ₹70,000"
                value={finalInvoicedAmount}
                onChange={(e) => setFinalInvoicedAmount(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* 4. Initial Status & Notes */}
        <div className="space-y-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373] block border-b border-[#E5E5E5] pb-1">
            Status & Notes
          </span>
          <div>
            <label className="block text-xs font-medium text-[#171717] mb-1">
              Initial Workflow Status
            </label>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1.5 text-xs text-[#171717] cursor-pointer">
                <input
                  type="radio"
                  name="initialStatus"
                  value="UNDER REVIEW"
                  checked={initialStatus === 'UNDER REVIEW'}
                  onChange={() => setInitialStatus('UNDER REVIEW')}
                  className="accent-[#EA580C]"
                />
                <span>Under Review</span>
              </label>
              <label className="flex items-center gap-1.5 text-xs text-[#171717] cursor-pointer">
                <input
                  type="radio"
                  name="initialStatus"
                  value="CONFIRMED"
                  checked={initialStatus === 'CONFIRMED'}
                  onChange={() => setInitialStatus('CONFIRMED')}
                  className="accent-[#EA580C]"
                />
                <span>Confirmed</span>
              </label>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#171717] mb-1">
              Notes
            </label>
            <textarea
              rows={2}
              placeholder="Additional operational or contract reference notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-md border border-[#E5E5E5] p-2.5 text-xs text-[#171717] outline-none focus:border-[#EA580C]"
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default CreateDirectBookingModal;
