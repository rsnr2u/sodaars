import React, { useState, useEffect } from 'react';
import Drawer from '../ui/Drawer';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';
import type {
  Enquiry,
  EnquiryPayload,
  EnquiryItemPayload,
  EnquiryPriority,
  EnquirySource,
} from '../../types/enquiry';
import type { Customer } from '../../types/customer';
import type { AdvertisingResource } from '../../types/resource';
import enquiryService from '../../services/enquiryService';
import customerService from '../../services/customerService';
import resourceService from '../../services/resourceService';
import { getApiErrorMessage, getApiFieldErrors } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import {
  Building2,
  Layers,
  Plus,
  Trash2,
  Tv,
  Image as ImageIcon,
} from 'lucide-react';

export interface EnquiryFormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  enquiry?: Enquiry | null;
  onSuccess: (savedEnquiry: Enquiry) => void;
}

export const EnquiryFormDrawer: React.FC<EnquiryFormDrawerProps> = ({
  isOpen,
  onClose,
  enquiry,
  onSuccess,
}) => {
  const isEditing = Boolean(enquiry);
  const { success, error: showError } = useToast();

  // Dropdown dependency data
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [resources, setResources] = useState<AdvertisingResource[]>([]);
  const [isLoadingDependencies, setIsLoadingDependencies] = useState(false);

  // Form State
  const [formData, setFormData] = useState<EnquiryPayload>({
    customer_uuid: '',
    campaign_title: '',
    priority: 'MEDIUM',
    source: 'DIRECT_VISIT',
    start_date: '',
    end_date: '',
    estimated_budget: undefined,
    currency: 'INR',
    requirements: '',
    internal_notes: '',
    items: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  // Load active customers and active resources for pickers
  useEffect(() => {
    if (!isOpen) return;

    const loadData = async () => {
      try {
        setIsLoadingDependencies(true);
        const [custRes, resRes] = await Promise.all([
          customerService.getCustomers({ per_page: 100, status: 'ACTIVE' }),
          resourceService.getResources({ per_page: 100, status: 'ACTIVE' }),
        ]);
        setCustomers(custRes.items || []);
        setResources(resRes.items || []);
      } catch {
        // Fallback silently if non-critical
      } finally {
        setIsLoadingDependencies(false);
      }
    };

    loadData();
  }, [isOpen]);

  // Sync initial state
  useEffect(() => {
    if (enquiry) {
      setFormData({
        customer_uuid: enquiry.customer?.uuid || '',
        campaign_title: enquiry.campaign_title,
        priority: enquiry.priority,
        source: enquiry.source,
        start_date: enquiry.start_date || '',
        end_date: enquiry.end_date || '',
        estimated_budget: enquiry.estimated_budget ?? undefined,
        currency: enquiry.currency || 'INR',
        requirements: enquiry.requirements || '',
        internal_notes: enquiry.internal_notes || '',
        items: (enquiry.items || []).map((it) => ({
          resource_uuid: it.advertising_resource?.uuid || undefined,
          start_date: it.start_date || '',
          end_date: it.end_date || '',
          slots_count: it.slots_count || 1,
          proposed_rate: it.proposed_rate ?? undefined,
          notes: it.notes || '',
        })),
      });
    } else {
      setFormData({
        customer_uuid: '',
        campaign_title: '',
        priority: 'MEDIUM',
        source: 'DIRECT_VISIT',
        start_date: '',
        end_date: '',
        estimated_budget: undefined,
        currency: 'INR',
        requirements: '',
        internal_notes: '',
        items: [],
      });
    }
    setFieldErrors({});
  }, [enquiry, isOpen]);

  const handleChange = (field: keyof EnquiryPayload, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  // Add Item to Line Item List
  const handleAddItem = () => {
    const firstResource = resources[0];
    const newItem: EnquiryItemPayload = {
      resource_uuid: firstResource?.uuid || '',
      start_date: formData.start_date || '',
      end_date: formData.end_date || '',
      slots_count: 1,
      proposed_rate: firstResource?.base_price_monthly ?? undefined,
      notes: '',
    };
    setFormData((prev) => ({
      ...prev,
      items: [...(prev.items || []), newItem],
    }));
  };

  // Update Item in List
  const handleUpdateItem = (index: number, field: keyof EnquiryItemPayload, val: any) => {
    setFormData((prev) => {
      const items = [...(prev.items || [])];
      items[index] = { ...items[index], [field]: val };

      // When resource is changed, auto-populate base price if proposed rate is empty
      if (field === 'resource_uuid') {
        const found = resources.find((r) => r.uuid === val);
        if (found && !items[index].proposed_rate) {
          items[index].proposed_rate = found.base_price_monthly ?? undefined;
        }
      }
      return { ...prev, items };
    });
  };

  // Remove Item from List
  const handleRemoveItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      items: (prev.items || []).filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFieldErrors({});

    try {
      const payload: EnquiryPayload = {
        ...formData,
        estimated_budget: formData.estimated_budget ? Number(formData.estimated_budget) : undefined,
        items: (formData.items || []).map((it) => ({
          ...it,
          slots_count: Number(it.slots_count) || 1,
          proposed_rate: it.proposed_rate ? Number(it.proposed_rate) : undefined,
        })),
      };

      let result: Enquiry;
      if (isEditing && enquiry) {
        result = await enquiryService.updateEnquiry(enquiry.uuid, payload);
        success(`Enquiry ${result.enquiry_number} updated.`);
      } else {
        result = await enquiryService.createEnquiry(payload);
        success(`Enquiry ${result.enquiry_number} created.`);
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
      maxWidth="680px"
      title={
        <div>
          <div style={{ fontSize: '1.15rem', fontWeight: 600, color: '#0f172a' }}>
            {isEditing ? `Edit Proposal: ${enquiry?.enquiry_number}` : 'New Campaign Enquiry'}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.15rem' }}>
            Multi-item inventory proposal and commercial requirements
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Section 1: Client & Campaign Basics */}
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
            <span>Client & Campaign Details</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '0.85rem' }}>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 500, color: '#1e293b', display: 'block', marginBottom: '0.35rem' }}>
                Select Commercial Client <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <select
                value={formData.customer_uuid}
                onChange={(e) => handleChange('customer_uuid', e.target.value)}
                disabled={isLoadingDependencies}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem',
                  fontSize: '0.875rem',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: '#ffffff',
                  outline: 'none',
                }}
                required
              >
                <option value="">Choose client / advertiser...</option>
                {customers.map((c) => (
                  <option key={c.uuid} value={c.uuid}>
                    [{c.code}] {c.company_name || c.contact_person} ({c.customer_type})
                  </option>
                ))}
              </select>
              {fieldErrors.customer_id && (
                <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
                  {fieldErrors.customer_id[0]}
                </span>
              )}
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 500, color: '#1e293b', display: 'block', marginBottom: '0.35rem' }}>
                Campaign Title <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <Input
                value={formData.campaign_title}
                onChange={(e) => handleChange('campaign_title', e.target.value)}
                placeholder="e.g. Diwali Festive Mega Hoardings Campaign"
                error={fieldErrors.campaign_title?.[0]}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 500, color: '#1e293b', display: 'block', marginBottom: '0.35rem' }}>
                Priority Level
              </label>
              <select
                value={formData.priority}
                onChange={(e) => handleChange('priority', e.target.value as EnquiryPriority)}
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
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 500, color: '#1e293b', display: 'block', marginBottom: '0.35rem' }}>
                Lead Source
              </label>
              <select
                value={formData.source}
                onChange={(e) => handleChange('source', e.target.value as EnquirySource)}
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
                <option value="DIRECT_VISIT">Direct Visit</option>
                <option value="PHONE">Phone Inquiry</option>
                <option value="EMAIL">Email Inquiry</option>
                <option value="WEBSITE">Website</option>
                <option value="AGENCY_RFQ">Agency RFQ</option>
                <option value="REFERRAL">Referral</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 500, color: '#1e293b', display: 'block', marginBottom: '0.35rem' }}>
                Campaign Start Date
              </label>
              <Input
                type="date"
                value={formData.start_date || ''}
                onChange={(e) => handleChange('start_date', e.target.value)}
                error={fieldErrors.start_date?.[0]}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 500, color: '#1e293b', display: 'block', marginBottom: '0.35rem' }}>
                Campaign End Date
              </label>
              <Input
                type="date"
                value={formData.end_date || ''}
                onChange={(e) => handleChange('end_date', e.target.value)}
                error={fieldErrors.end_date?.[0]}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 500, color: '#1e293b', display: 'block', marginBottom: '0.35rem' }}>
                Estimated Budget
              </label>
              <Input
                type="number"
                min={0}
                value={formData.estimated_budget ?? ''}
                onChange={(e) => handleChange('estimated_budget', e.target.value ? Number(e.target.value) : undefined)}
                placeholder="e.g. 150000"
                error={fieldErrors.estimated_budget?.[0]}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 500, color: '#1e293b', display: 'block', marginBottom: '0.35rem' }}>
                Currency Code
              </label>
              <Input
                value={formData.currency || 'INR'}
                onChange={(e) => handleChange('currency', e.target.value.toUpperCase())}
                placeholder="INR"
                style={{ textTransform: 'uppercase' }}
                maxLength={3}
              />
            </div>
          </div>
        </div>

        {/* Section 2: Multi-Item Requested Inventory Units */}
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
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '0.85rem',
            }}
          >
            <div
              style={{
                fontSize: '0.85rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                color: '#64748b',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <Layers size={15} style={{ color: '#0f766e' }} />
              <span>Requested Inventory Units ({(formData.items || []).length})</span>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddItem}
              disabled={resources.length === 0}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.8rem',
              }}
            >
              <Plus size={14} /> Add Face
            </Button>
          </div>

          {(formData.items || []).length === 0 ? (
            <div
              style={{
                backgroundColor: '#f8fafc',
                border: '1px dashed #cbd5e1',
                borderRadius: '6px',
                padding: '1.5rem',
                textAlign: 'center',
                color: '#64748b',
                fontSize: '0.85rem',
              }}
            >
              No specific advertising units added to this enquiry proposal yet. Click "+ Add Face" to attach units for availability evaluation.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {(formData.items || []).map((item, idx) => {
                const selectedRes = resources.find((r) => r.uuid === item.resource_uuid);
                const isDigital = selectedRes?.category === 'DIGITAL';

                return (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      padding: '0.85rem',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '0.65rem',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#334155' }}>
                          Unit #{idx + 1}
                        </span>
                        {selectedRes && (
                          <span
                            style={{
                              fontSize: '0.72rem',
                              backgroundColor: isDigital ? '#eff6ff' : '#f1f5f9',
                              color: isDigital ? '#1d4ed8' : '#475569',
                              padding: '0.1rem 0.35rem',
                              borderRadius: '4px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                            }}
                          >
                            {isDigital ? <Tv size={11} /> : <ImageIcon size={11} />}
                            {selectedRes.category}
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#ef4444',
                          cursor: 'pointer',
                          padding: '0.2rem',
                        }}
                        title="Remove unit"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '0.65rem' }}>
                      <div style={{ gridColumn: 'span 3' }}>
                        <label style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: '0.2rem' }}>
                          Target Advertising Resource <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        <select
                          value={item.resource_uuid}
                          onChange={(e) => handleUpdateItem(idx, 'resource_uuid', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '0.45rem 0.65rem',
                            fontSize: '0.82rem',
                            borderRadius: '5px',
                            border: '1px solid var(--border-color)',
                            backgroundColor: '#ffffff',
                            outline: 'none',
                          }}
                          required
                        >
                          {resources.map((r) => (
                            <option key={r.uuid} value={r.uuid}>
                              [{r.code}] {r.name} ({r.resource_type})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: '0.2rem' }}>
                          Start Date
                        </label>
                        <Input
                          type="date"
                          value={item.start_date || ''}
                          onChange={(e) => handleUpdateItem(idx, 'start_date', e.target.value)}
                          style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem' }}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: '0.2rem' }}>
                          End Date
                        </label>
                        <Input
                          type="date"
                          value={item.end_date || ''}
                          onChange={(e) => handleUpdateItem(idx, 'end_date', e.target.value)}
                          style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem' }}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: '0.2rem' }}>
                          Slots {isDigital ? '(Loop slots)' : '(Face)'}
                        </label>
                        <Input
                          type="number"
                          min={1}
                          max={isDigital ? 20 : 1}
                          value={item.slots_count || 1}
                          onChange={(e) => handleUpdateItem(idx, 'slots_count', parseInt(e.target.value, 10) || 1)}
                          style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem' }}
                        />
                      </div>

                      <div style={{ gridColumn: 'span 2' }}>
                        <label style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: '0.2rem' }}>
                          Proposed Monthly Rate
                        </label>
                        <Input
                          type="number"
                          min={0}
                          value={item.proposed_rate ?? ''}
                          onChange={(e) => handleUpdateItem(idx, 'proposed_rate', e.target.value ? Number(e.target.value) : undefined)}
                          placeholder="e.g. 75000"
                          style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem' }}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: '0.2rem' }}>
                          Item Notes
                        </label>
                        <Input
                          value={item.notes || ''}
                          onChange={(e) => handleUpdateItem(idx, 'notes', e.target.value)}
                          placeholder="Special creative size or rotation"
                          style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem' }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Section 3: Requirements & Notes */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '1.1rem',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 500, color: '#1e293b', display: 'block', marginBottom: '0.35rem' }}>
                Advertiser Requirements
              </label>
              <textarea
                value={formData.requirements || ''}
                onChange={(e) => handleChange('requirements', e.target.value)}
                rows={2}
                placeholder="Specific audience target, lighting expectations, creative delivery deadlines..."
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

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 500, color: '#1e293b', display: 'block', marginBottom: '0.35rem' }}>
                Internal Sales Notes
              </label>
              <textarea
                value={formData.internal_notes || ''}
                onChange={(e) => handleChange('internal_notes', e.target.value)}
                rows={2}
                placeholder="Competitive offers, discount thresholds, agency commission agreements..."
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
          </div>
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
              'Update Proposal'
            ) : (
              'Create Proposal'
            )}
          </Button>
        </div>
      </form>
    </Drawer>
  );
};

export default EnquiryFormDrawer;
