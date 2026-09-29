import React, { useState, useEffect } from 'react';
import Drawer from '../ui/Drawer';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';
import type { Customer, CustomerPayload, CustomerType, CustomerStatus } from '../../types/customer';
import customerService from '../../services/customerService';
import { getApiErrorMessage, getApiFieldErrors } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Building2, User, CreditCard } from 'lucide-react';

export interface CustomerFormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  customer?: Customer | null;
  onSuccess: (savedCustomer: Customer) => void;
}

const CUSTOMER_TYPE_OPTIONS: { label: string; value: CustomerType }[] = [
  { label: 'Direct Advertiser', value: 'DIRECT_ADVERTISER' },
  { label: 'Advertising Agency', value: 'AGENCY' },
  { label: 'Corporate Brand', value: 'BRAND' },
  { label: 'Individual / Local', value: 'INDIVIDUAL' },
  { label: 'Government / Civic', value: 'GOVERNMENT' },
];

export const CustomerFormDrawer: React.FC<CustomerFormDrawerProps> = ({
  isOpen,
  onClose,
  customer,
  onSuccess,
}) => {
  const isEditing = Boolean(customer);
  const { success, error: showError } = useToast();

  const [formData, setFormData] = useState<CustomerPayload>({
    customer_type: 'DIRECT_ADVERTISER',
    company_name: '',
    brand_name: '',
    contact_person: '',
    email: '',
    phone: '',
    alternate_phone: '',
    website: '',
    billing_address: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    gstin: '',
    pan_number: '',
    credit_period_days: 0,
    status: 'ACTIVE',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  useEffect(() => {
    if (customer) {
      setFormData({
        code: customer.code,
        customer_type: customer.customer_type,
        company_name: customer.company_name || '',
        brand_name: customer.brand_name || '',
        contact_person: customer.contact_person || '',
        email: customer.email || '',
        phone: customer.phone || '',
        alternate_phone: customer.alternate_phone || '',
        website: customer.website || '',
        billing_address: customer.billing_address || '',
        city: customer.city || '',
        state: customer.state || '',
        pincode: customer.pincode || '',
        country: customer.country || 'India',
        gstin: customer.gstin || '',
        pan_number: customer.pan_number || '',
        credit_period_days: customer.credit_period_days || 0,
        status: customer.status || 'ACTIVE',
        notes: customer.notes || '',
      });
    } else {
      setFormData({
        customer_type: 'DIRECT_ADVERTISER',
        company_name: '',
        brand_name: '',
        contact_person: '',
        email: '',
        phone: '',
        alternate_phone: '',
        website: '',
        billing_address: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India',
        gstin: '',
        pan_number: '',
        credit_period_days: 0,
        status: 'ACTIVE',
        notes: '',
      });
    }
    setFieldErrors({});
  }, [customer, isOpen]);

  const handleChange = (field: keyof CustomerPayload, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFieldErrors({});

    try {
      const payload: CustomerPayload = {
        ...formData,
        credit_period_days: Number(formData.credit_period_days) || 0,
      };

      let result: Customer;
      if (isEditing && customer) {
        result = await customerService.updateCustomer(customer.uuid, payload);
        success(`Client ${result.company_name || result.contact_person} updated.`);
      } else {
        result = await customerService.createCustomer(payload);
        success(`Client ${result.company_name || result.contact_person} created.`);
      }
      onSuccess(result);
      onClose();
    } catch (err: any) {
      const errors = getApiFieldErrors(err);
      if (errors) {
        setFieldErrors(errors);
      }
      showError(getApiErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="600px"
      title={
        <div>
          <div style={{ fontSize: '1.15rem', fontWeight: 600, color: '#0f172a' }}>
            {isEditing ? 'Edit Client Record' : 'Register New Client'}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.15rem' }}>
            {isEditing ? `Code: ${customer?.code}` : 'Commercial profile and contact credentials'}
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Section 1: Classification & Core Identity */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '1.1rem',
          }}
        >
          <div
            style={{
              fontSize: '0.85rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              color: '#64748b',
              marginBottom: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <Building2 size={15} style={{ color: '#2563eb' }} />
            <span>Identity & Entity Type</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 500, color: '#1e293b', display: 'block', marginBottom: '0.35rem' }}>
                Client Classification <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <select
                value={formData.customer_type}
                onChange={(e) => handleChange('customer_type', e.target.value as CustomerType)}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem',
                  fontSize: '0.875rem',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: '#ffffff',
                  outline: 'none',
                }}
              >
                {CUSTOMER_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 500, color: '#1e293b', display: 'block', marginBottom: '0.35rem' }}>
                Account Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value as CustomerStatus)}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem',
                  fontSize: '0.875rem',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: '#ffffff',
                  outline: 'none',
                }}
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="BLOCKED">Blocked</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 500, color: '#1e293b', display: 'block', marginBottom: '0.35rem' }}>
                Company / Agency Legal Name
              </label>
              <Input
                value={formData.company_name || ''}
                onChange={(e) => handleChange('company_name', e.target.value)}
                placeholder="e.g. Zenith Media India Pvt Ltd"
                error={fieldErrors.company_name?.[0]}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 500, color: '#1e293b', display: 'block', marginBottom: '0.35rem' }}>
                Brand / Trading Name
              </label>
              <Input
                value={formData.brand_name || ''}
                onChange={(e) => handleChange('brand_name', e.target.value)}
                placeholder="e.g. Zenith Outdoor"
                error={fieldErrors.brand_name?.[0]}
              />
            </div>
          </div>
        </div>

        {/* Section 2: Contact Person & Communication */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '1.1rem',
          }}
        >
          <div
            style={{
              fontSize: '0.85rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              color: '#64748b',
              marginBottom: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <User size={15} style={{ color: '#0f766e' }} />
            <span>Key Contact Person</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 500, color: '#1e293b', display: 'block', marginBottom: '0.35rem' }}>
                Contact Person Name <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <Input
                value={formData.contact_person}
                onChange={(e) => handleChange('contact_person', e.target.value)}
                placeholder="e.g. Rajesh Sharma"
                error={fieldErrors.contact_person?.[0]}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 500, color: '#1e293b', display: 'block', marginBottom: '0.35rem' }}>
                Official Email
              </label>
              <Input
                type="email"
                value={formData.email || ''}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="rajesh@zenithmedia.com"
                error={fieldErrors.email?.[0]}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 500, color: '#1e293b', display: 'block', marginBottom: '0.35rem' }}>
                Primary Phone <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <Input
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="+91 98765 43210"
                error={fieldErrors.phone?.[0]}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 500, color: '#1e293b', display: 'block', marginBottom: '0.35rem' }}>
                Alternate Phone / Landline
              </label>
              <Input
                value={formData.alternate_phone || ''}
                onChange={(e) => handleChange('alternate_phone', e.target.value)}
                placeholder="+91 22 2450 1100"
                error={fieldErrors.alternate_phone?.[0]}
              />
            </div>
          </div>
        </div>

        {/* Section 3: Commercial Tax & Billing */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '1.1rem',
          }}
        >
          <div
            style={{
              fontSize: '0.85rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              color: '#64748b',
              marginBottom: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <CreditCard size={15} style={{ color: '#f97316' }} />
            <span>Commercial & Tax Details</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '0.85rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 500, color: '#1e293b', display: 'block', marginBottom: '0.35rem' }}>
                GSTIN
              </label>
              <Input
                value={formData.gstin || ''}
                onChange={(e) => handleChange('gstin', e.target.value.toUpperCase())}
                placeholder="27ABCDE1234F1Z5"
                error={fieldErrors.gstin?.[0]}
                style={{ textTransform: 'uppercase', fontFamily: 'monospace' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 500, color: '#1e293b', display: 'block', marginBottom: '0.35rem' }}>
                PAN Number
              </label>
              <Input
                value={formData.pan_number || ''}
                onChange={(e) => handleChange('pan_number', e.target.value.toUpperCase())}
                placeholder="ABCDE1234F"
                error={fieldErrors.pan_number?.[0]}
                style={{ textTransform: 'uppercase', fontFamily: 'monospace' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 500, color: '#1e293b', display: 'block', marginBottom: '0.35rem' }}>
                Credit Period (Days)
              </label>
              <Input
                type="number"
                min={0}
                max={365}
                value={formData.credit_period_days ?? 0}
                onChange={(e) => handleChange('credit_period_days', parseInt(e.target.value, 10) || 0)}
                placeholder="30"
                error={fieldErrors.credit_period_days?.[0]}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 500, color: '#1e293b', display: 'block', marginBottom: '0.35rem' }}>
                Website
              </label>
              <Input
                value={formData.website || ''}
                onChange={(e) => handleChange('website', e.target.value)}
                placeholder="https://clientwebsite.com"
                error={fieldErrors.website?.[0]}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '0.85rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 500, color: '#1e293b', display: 'block', marginBottom: '0.35rem' }}>
                Billing Address
              </label>
              <Input
                value={formData.billing_address || ''}
                onChange={(e) => handleChange('billing_address', e.target.value)}
                placeholder="Suite 401, Commerce Tower"
                error={fieldErrors.billing_address?.[0]}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 500, color: '#1e293b', display: 'block', marginBottom: '0.35rem' }}>
                City
              </label>
              <Input
                value={formData.city || ''}
                onChange={(e) => handleChange('city', e.target.value)}
                placeholder="Mumbai"
                error={fieldErrors.city?.[0]}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 500, color: '#1e293b', display: 'block', marginBottom: '0.35rem' }}>
                State
              </label>
              <Input
                value={formData.state || ''}
                onChange={(e) => handleChange('state', e.target.value)}
                placeholder="Maharashtra"
                error={fieldErrors.state?.[0]}
              />
            </div>
          </div>
        </div>

        {/* Section 4: Operational Notes */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '1.1rem',
          }}
        >
          <label style={{ fontSize: '0.8rem', fontWeight: 500, color: '#1e293b', display: 'block', marginBottom: '0.35rem' }}>
            Internal Relationship Notes
          </label>
          <textarea
            value={formData.notes || ''}
            onChange={(e) => handleChange('notes', e.target.value)}
            rows={3}
            placeholder="Special commercial terms, payment reliability, key decision maker preferences..."
            style={{
              width: '100%',
              padding: '0.55rem 0.75rem',
              fontSize: '0.85rem',
              borderRadius: '6px',
              border: '1px solid var(--border-color)',
              color: '#0f172a',
              resize: 'vertical',
              outline: 'none',
              fontFamily: 'inherit',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
          <Button variant="ghost" size="md" type="button" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="primary" size="md" type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                <Spinner size={16} /> Saving...
              </div>
            ) : isEditing ? (
              'Update Client'
            ) : (
              'Create Client'
            )}
          </Button>
        </div>
      </form>
    </Drawer>
  );
};

export default CustomerFormDrawer;
