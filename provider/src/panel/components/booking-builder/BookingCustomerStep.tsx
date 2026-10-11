import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  CheckCircle2,
  Building,
  User,
  Phone,
  Mail,
  ArrowRight,
  Check,
} from 'lucide-react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { CustomerRecord, CUSTOMER_TYPE_CONFIG } from '../../types/customer';
import CustomerFormDrawer from '../customers/CustomerFormDrawer';

export interface BookingCustomerStepProps {
  customers: CustomerRecord[];
  selectedCustomer: CustomerRecord | null;
  onSelectCustomer: (customer: CustomerRecord | null) => void;
  onAddNewCustomer: (customer: CustomerRecord) => void;
  onCancel: () => void;
  onContinue: () => void;
}

export const BookingCustomerStep: React.FC<BookingCustomerStepProps> = ({
  customers,
  selectedCustomer,
  onSelectCustomer,
  onAddNewCustomer,
  onCancel,
  onContinue,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewCustomerDrawerOpen, setIsNewCustomerDrawerOpen] = useState(false);

  // Filtered customer list
  const filteredCustomers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return customers;
    return customers.filter(
      (c) =>
        c.companyName.toLowerCase().includes(q) ||
        c.contactPerson.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        (c.brandName && c.brandName.toLowerCase().includes(q)) ||
        (c.city && c.city.toLowerCase().includes(q))
    );
  }, [customers, searchQuery]);

  const handleCreateCustomer = (newCustomer: CustomerRecord) => {
    onAddNewCustomer(newCustomer);
    onSelectCustomer(newCustomer); // Auto-select newly created customer
    setIsNewCustomerDrawerOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div className="border-b border-[#E5E5E5] pb-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#EA580C]">
              Step 01
            </span>
            <h2 className="text-lg font-bold text-[#171717] mt-0.5">
              Select or Add Customer
            </h2>
            <p className="text-xs text-[#737373] mt-0.5">
              Choose an existing client account or create a new client record for this booking.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            leftIcon={<Plus size={14} className="text-[#EA580C]" />}
            onClick={() => setIsNewCustomerDrawerOpen(true)}
            className="border-[#E5E5E5] text-[#171717] hover:bg-white"
          >
            Add New Customer
          </Button>
        </div>
      </div>

      {/* Selected Customer Confirmation Banner (if already selected) */}
      {selectedCustomer ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 sm:p-5 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200">
                <CheckCircle2 size={20} />
              </div>
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                  <span>✓</span> Customer Selected
                </span>
                <h3 className="text-base font-bold text-[#171717] leading-tight">
                  {selectedCustomer.companyName}
                </h3>
                <div className="flex flex-wrap items-center gap-2 pt-0.5 text-xs text-[#525252]">
                  <span className="font-medium px-2 py-0.5 rounded bg-white border border-emerald-200 text-emerald-900 text-[11px]">
                    {selectedCustomer.customerType}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <User size={12} className="text-[#737373]" />
                    {selectedCustomer.contactPerson}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Phone size={12} className="text-[#737373]" />
                    {selectedCustomer.phone}
                  </span>
                  {selectedCustomer.city && (
                    <>
                      <span>•</span>
                      <span>{selectedCustomer.city}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onSelectCustomer(null)}
              className="bg-white border-emerald-200 text-emerald-900 hover:bg-emerald-50 text-xs py-1"
            >
              Change Customer
            </Button>
          </div>
        </div>
      ) : (
        /* Customer Selection Panel */
        <div className="space-y-4">
          {/* Search bar */}
          <div className="relative max-w-xl">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#737373]"
            />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search customer by name, company, phone, city..."
              className="w-full pl-9 pr-3 text-xs h-9.5"
            />
          </div>

          {/* Customer Cards Grid / List */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs text-[#737373] px-1">
              <span className="font-semibold text-[#171717]">
                Existing Customers ({filteredCustomers.length})
              </span>
              <span>Select one to proceed</span>
            </div>

            {filteredCustomers.length === 0 ? (
              <div className="rounded-xl border border-dashed border-[#E5E5E5] bg-[#FAFAF9] p-8 text-center space-y-3">
                <Building size={28} className="mx-auto text-[#737373]" />
                <div className="space-y-1">
                  <p className="text-xs font-bold text-[#171717]">
                    No matching customers found
                  </p>
                  <p className="text-[11px] text-[#737373]">
                    Try adjusting your search query or create a new customer record.
                  </p>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<Plus size={14} />}
                  onClick={() => setIsNewCustomerDrawerOpen(true)}
                  className="mt-1"
                >
                  Add New Customer
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredCustomers.map((cust) => {
                  const typeConfig = CUSTOMER_TYPE_CONFIG[cust.customerType];
                  const isSelected = false;

                  return (
                    <div
                      key={cust.id}
                      onClick={() => onSelectCustomer(cust)}
                      className={`rounded-xl border p-4 transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                        isSelected
                          ? 'border-[#EA580C] bg-orange-50/40 ring-1 ring-[#EA580C]'
                          : 'border-[#E5E5E5] bg-white hover:border-orange-300 hover:shadow-xs'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-bold text-[#171717] leading-snug">
                            {cust.companyName}
                          </h4>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold border shrink-0 ${
                              typeConfig?.badgeBg || 'bg-stone-100'
                            } ${typeConfig?.badgeText || 'text-stone-800'} ${
                              typeConfig?.badgeBorder || 'border-stone-200'
                            }`}
                          >
                            {cust.customerType}
                          </span>
                        </div>

                        <div className="space-y-1 text-xs text-[#525252]">
                          <div className="flex items-center gap-1.5">
                            <User size={12} className="text-[#737373] shrink-0" />
                            <span>
                              Contact: <strong className="text-[#171717]">{cust.contactPerson}</strong>
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 font-mono text-[11px]">
                            <Phone size={12} className="text-[#737373] shrink-0" />
                            <span>{cust.phone}</span>
                          </div>
                          {cust.email && (
                            <div className="flex items-center gap-1.5 text-[11px] truncate">
                              <Mail size={12} className="text-[#737373] shrink-0" />
                              <span className="truncate">{cust.email}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#F5F5F4] flex items-center justify-between">
                        <span className="text-[10px] font-mono text-[#737373]">
                          {cust.id}
                        </span>
                        <Button
                          variant={isSelected ? 'primary' : 'outline'}
                          size="sm"
                          className={
                            isSelected
                              ? ''
                              : 'border-[#E5E5E5] text-[#171717] hover:bg-[#FAFAF9]'
                          }
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectCustomer(cust);
                          }}
                        >
                          {isSelected ? (
                            <span className="flex items-center gap-1">
                              <Check size={13} /> Selected
                            </span>
                          ) : (
                            'Select'
                          )}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bottom Action Footer */}
      <div className="pt-4 border-t border-[#E5E5E5] flex items-center justify-between">
        <Button variant="secondary" size="md" onClick={onCancel}>
          Cancel
        </Button>

        <Button
          variant="primary"
          size="md"
          rightIcon={<ArrowRight size={15} />}
          disabled={!selectedCustomer}
          onClick={onContinue}
        >
          Continue
        </Button>
      </div>

      {/* Add New Customer Drawer */}
      <CustomerFormDrawer
        isOpen={isNewCustomerDrawerOpen}
        onClose={() => setIsNewCustomerDrawerOpen(false)}
        onSave={handleCreateCustomer}
      />
    </div>
  );
};

export default BookingCustomerStep;
