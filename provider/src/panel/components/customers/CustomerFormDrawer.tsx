import React, { useState, useEffect } from 'react';
import { Users, CheckCircle2 } from 'lucide-react';
import Drawer from '../../../components/ui/Drawer';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import {
  CustomerRecord,
  CustomerType,
  CustomerStatus,
  APPROVED_CUSTOMER_TYPES,
  APPROVED_CUSTOMER_STATUSES,
} from '../../types/customer';

export interface CustomerFormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  customer?: CustomerRecord | null;
  onSave: (customer: CustomerRecord) => void;
}

export const CustomerFormDrawer: React.FC<CustomerFormDrawerProps> = ({
  isOpen,
  onClose,
  customer,
  onSave,
}) => {
  // Form fields
  const [customerType, setCustomerType] = useState<CustomerType>('Advertising Agency');
  const [companyName, setCompanyName] = useState('');
  const [brandName, setBrandName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [alternatePhone, setAlternatePhone] = useState('');

  // Business / Tax info
  const [gstin, setGstin] = useState('');
  const [pan, setPan] = useState('');

  // Billing / Address
  const [billingAddress, setBillingAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [country, setCountry] = useState('India');

  // Status & Notes
  const [status, setStatus] = useState<CustomerStatus>('Active');
  const [notes, setNotes] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (customer) {
      setCustomerType(customer.customerType);
      setCompanyName(customer.companyName);
      setBrandName(customer.brandName || '');
      setContactPerson(customer.contactPerson);
      setEmail(customer.email);
      setPhone(customer.phone);
      setAlternatePhone(customer.alternatePhone || '');
      setGstin(customer.gstin || '');
      setPan(customer.pan || '');
      setBillingAddress(customer.billingAddress || '');
      setCity(customer.city || '');
      setState(customer.state || '');
      setPincode(customer.pincode || '');
      setCountry(customer.country || 'India');
      setStatus(customer.status);
      setNotes(customer.notes || '');
      setErrors({});
    } else {
      handleReset();
    }
  }, [customer, isOpen]);

  const handleReset = () => {
    setCustomerType('Advertising Agency');
    setCompanyName('');
    setBrandName('');
    setContactPerson('');
    setEmail('');
    setPhone('');
    setAlternatePhone('');
    setGstin('');
    setPan('');
    setBillingAddress('');
    setCity('');
    setState('');
    setPincode('');
    setCountry('India');
    setStatus('Active');
    setNotes('');
    setErrors({});
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!companyName.trim()) errs.companyName = 'Company name is required.';
    if (!contactPerson.trim()) errs.contactPerson = 'Contact person is required.';
    if (!email.trim()) errs.email = 'Email address is required.';
    if (!phone.trim()) errs.phone = 'Phone number is required.';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const customerId =
      customer?.id || `CUST-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const savedRecord: CustomerRecord = {
      id: customerId,
      customerType,
      companyName: companyName.trim(),
      brandName: brandName.trim() || undefined,
      contactPerson: contactPerson.trim(),
      email: email.trim(),
      phone: phone.trim(),
      alternatePhone: alternatePhone.trim() || undefined,
      gstin: gstin.trim().toUpperCase() || undefined,
      pan: pan.trim().toUpperCase() || undefined,
      billingAddress: billingAddress.trim() || undefined,
      city: city.trim() || undefined,
      state: state.trim() || undefined,
      pincode: pincode.trim() || undefined,
      country: country.trim() || 'India',
      status,
      notes: notes.trim() || undefined,
      createdAt: customer?.createdAt || new Date().toISOString().split('T')[0],
    };

    onSave(savedRecord);
    handleReset();
    onClose();
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Users size={18} className="text-[#EA580C]" />
          <span>{customer ? `Edit Customer — ${customer.companyName}` : 'Add Customer Profile'}</span>
        </div>
      }
      width="max-w-2xl"
      footer={
        <div className="flex items-center justify-end gap-2.5 w-full">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<CheckCircle2 size={14} />}
            onClick={handleSubmit}
          >
            {customer ? 'Update Customer' : 'Save Customer'}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SECTION 1 — CUSTOMER INFORMATION */}
        <div className="space-y-3.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373] block border-b border-[#E5E5E5] pb-1">
            Section 1 — Customer Information
          </span>

          <div>
            <label className="block text-xs font-semibold text-[#171717] mb-1">
              Customer Type <span className="text-rose-500">*</span>
            </label>
            <select
              value={customerType}
              onChange={(e) => setCustomerType(e.target.value as CustomerType)}
              className="w-full h-9 rounded-md border border-[#E5E5E5] bg-white px-3 text-xs text-[#171717] focus:outline-none focus:border-[#EA580C]"
            >
              {APPROVED_CUSTOMER_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Company Name"
              placeholder="e.g. Zenith Media India"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              error={errors.companyName}
              required
            />
            <Input
              label="Brand Name"
              placeholder="e.g. Zenith / Client Brand"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
            />
            <Input
              label="Contact Person"
              placeholder="e.g. Priya Sundaram"
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
              error={errors.contactPerson}
              required
            />
            <Input
              label="Email"
              type="email"
              placeholder="e.g. contact@zenithmedia.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              required
            />
            <Input
              label="Phone"
              placeholder="e.g. +91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              error={errors.phone}
              required
            />
            <Input
              label="Alternate Phone"
              placeholder="e.g. +91 98765 00000"
              value={alternatePhone}
              onChange={(e) => setAlternatePhone(e.target.value)}
            />
          </div>
        </div>

        {/* SECTION 2 — BUSINESS / TAX INFORMATION */}
        <div className="space-y-3.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373] block border-b border-[#E5E5E5] pb-1">
            Section 2 — Business / Tax Information
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="GSTIN"
              placeholder="e.g. 29ABCDE1234F1Z5"
              value={gstin}
              onChange={(e) => setGstin(e.target.value)}
            />
            <Input
              label="PAN"
              placeholder="e.g. ABCDE1234F"
              value={pan}
              onChange={(e) => setPan(e.target.value)}
            />
          </div>
          <p className="text-[11px] text-[#737373]">
            Optional customer profile credentials for commercial invoicing records.
          </p>
        </div>

        {/* SECTION 3 — BILLING / ADDRESS */}
        <div className="space-y-3.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373] block border-b border-[#E5E5E5] pb-1">
            Section 3 — Billing / Address
          </span>
          <div>
            <Input
              label="Billing Address"
              placeholder="e.g. Suite 402, Embassy Heights, Magrath Road"
              value={billingAddress}
              onChange={(e) => setBillingAddress(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="col-span-2 sm:col-span-1">
              <Input
                label="City"
                placeholder="e.g. Bengaluru"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <Input
                label="State"
                placeholder="e.g. Karnataka"
                value={state}
                onChange={(e) => setState(e.target.value)}
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <Input
                label="Pincode"
                placeholder="e.g. 560025"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <Input
                label="Country"
                placeholder="India"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* SECTION 4 — CUSTOMER STATUS */}
        <div className="space-y-3.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373] block border-b border-[#E5E5E5] pb-1">
            Section 4 — Customer Status
          </span>
          <div>
            <label className="block text-xs font-semibold text-[#171717] mb-2">
              Account Standing
            </label>
            <div className="flex items-center gap-4">
              {APPROVED_CUSTOMER_STATUSES.map((st) => (
                <label key={st} className="flex items-center gap-1.5 text-xs text-[#171717] cursor-pointer">
                  <input
                    type="radio"
                    name="customerStatus"
                    value={st}
                    checked={status === st}
                    onChange={() => setStatus(st)}
                    className="accent-[#EA580C]"
                  />
                  <span>{st}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 5 — NOTES */}
        <div className="space-y-3.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373] block border-b border-[#E5E5E5] pb-1">
            Section 5 — Notes
          </span>
          <div>
            <label className="block text-xs font-semibold text-[#171717] mb-1">
              Internal Notes
            </label>
            <textarea
              rows={3}
              placeholder="Internal account notes, client preferences, or operational references..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-md border border-[#E5E5E5] p-2.5 text-xs text-[#171717] outline-none focus:border-[#EA580C]"
            />
          </div>
        </div>
      </form>
    </Drawer>
  );
};

export default CustomerFormDrawer;
