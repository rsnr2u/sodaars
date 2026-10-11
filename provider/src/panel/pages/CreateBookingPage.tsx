import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Button from '../../components/ui/Button';
import BookingStepper from '../components/booking-builder/BookingStepper';
import BookingCustomerStep from '../components/booking-builder/BookingCustomerStep';
import BookingDatesStep from '../components/booking-builder/BookingDatesStep';
import BookingInventoryStep from '../components/booking-builder/BookingInventoryStep';
import BookingReviewStep from '../components/booking-builder/BookingReviewStep';
import BookingCreatedSuccess from '../components/booking-builder/BookingCreatedSuccess';
import { CustomerRecord } from '../types/customer';
import { AdvertisingResource } from '../types/resource';
import { BookingRecord } from '../types/booking';
import { SAMPLE_CUSTOMERS } from '../data/sampleCustomers';
import { SAMPLE_RESOURCES } from '../data/sampleInventory';

export const CreateBookingPage: React.FC = () => {
  const navigate = useNavigate();

  // 4-step state
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1: Customer state
  const [customers, setCustomers] = useState<CustomerRecord[]>(SAMPLE_CUSTOMERS);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerRecord | null>(
    SAMPLE_CUSTOMERS[0] || null // Pre-select ABC Advertising per prompt or allow changing
  );

  // Step 2: Booking Dates state (Default: 01 Oct 2026 -> 30 Oct 2026 per prompt)
  const [startDate, setStartDate] = useState<string>('2026-10-01');
  const [endDate, setEndDate] = useState<string>('2026-10-30');

  // Step 3: Available & Selected Inventory state
  // Only active inventory is eligible for booking selection
  const [availableResources] = useState<AdvertisingResource[]>(
    SAMPLE_RESOURCES.filter((r) => r.status === 'Active')
  );
  const [selectedResources, setSelectedResources] = useState<AdvertisingResource[]>([
    SAMPLE_RESOURCES[0], // Pre-populate sample items per user prompt or empty
  ]);

  // Step 4 & Post-creation state
  const [isCreatedSuccess, setIsCreatedSuccess] = useState<boolean>(false);
  const [createdBookingRecord, setCreatedBookingRecord] = useState<BookingRecord | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Handler: Add new customer
  const handleAddNewCustomer = (newCust: CustomerRecord) => {
    setCustomers((prev) => [newCust, ...prev]);
    setSelectedCustomer(newCust);
  };

  // Handler: Toggle inventory selection
  const handleToggleResource = (resource: AdvertisingResource) => {
    setSelectedResources((prev) => {
      const exists = prev.some((r) => r.id === resource.id);
      if (exists) {
        return prev.filter((r) => r.id !== resource.id);
      } else {
        return [...prev, resource];
      }
    });
  };

  // Handler: Remove resource from cart
  const handleRemoveResource = (resourceId: string) => {
    setSelectedResources((prev) => prev.filter((r) => r.id !== resourceId));
  };

  // Handler: Create Booking
  const handleCreateBooking = () => {
    if (!selectedCustomer || selectedResources.length === 0) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const bookingId = `BKG-2026-${randomSuffix}`;

      const totalVal = selectedResources.reduce((acc, r) => acc + (r.customerPrice || 0), 0);

      const newBooking: BookingRecord = {
        id: bookingId,
        customerName: selectedCustomer.contactPerson,
        companyName: selectedCustomer.companyName,
        contactEmail: selectedCustomer.email,
        contactPhone: selectedCustomer.phone,
        resourceId: selectedResources.map((r) => r.id).join(', '),
        resourceName: selectedResources.map((r) => r.name).join('; '),
        resourceType:
          selectedResources.length === 1
            ? selectedResources[0].type
            : `${selectedResources[0].type} + ${selectedResources.length - 1} more`,
        location:
          selectedResources.length === 1
            ? `${selectedResources[0].location.city} (${selectedResources[0].location.area})`
            : `${selectedResources[0].location.city} & ${selectedResources.length - 1} other sites`,
        startDate,
        endDate,
        source: 'Provider', // Exact approved source concept
        status: 'UNDER REVIEW', // Approved booking lifecycle status
        pricing: {
          regularCustomerPrice: String(totalVal),
          finalInvoicedAmount: String(totalVal),
        },
        createdAt: new Date().toISOString().split('T')[0],
      };

      // Store in localStorage for persistence across panel sessions
      try {
        const stored = localStorage.getItem('sodaars_provider_bookings');
        const existing = stored ? JSON.parse(stored) : [];
        localStorage.setItem(
          'sodaars_provider_bookings',
          JSON.stringify([newBooking, ...existing])
        );
      } catch (e) {
        console.error('Storage error:', e);
      }

      setCreatedBookingRecord(newBooking);
      setIsSubmitting(false);
      setIsCreatedSuccess(true);
    }, 400);
  };

  const handleResetForAnother = () => {
    setIsCreatedSuccess(false);
    setCreatedBookingRecord(null);
    setCurrentStep(1);
    setSelectedResources([]);
  };

  return (
    <div className="flex-1 flex flex-col w-full pb-12">
      {/* Page Header */}
      <PageHeader
        eyebrow="BOOKING BUILDER"
        title="Create Booking"
        description="Configure commercial terms, client account, flight duration, and physical advertising inventory through the 4-step booking workflow."
        actions={
          <Button
            variant="outline"
            size="sm"
            leftIcon={<ArrowLeft size={14} />}
            onClick={() => navigate('/panel/bookings')}
            className="border-[#E5E5E5] text-[#171717] hover:bg-[#FAFAF9]"
          >
            Back to Bookings
          </Button>
        }
      />

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Stepper (Only visible while building, hidden upon completion) */}
        {!isCreatedSuccess && (
          <BookingStepper
            currentStep={currentStep}
            onStepClick={(step) => {
              if (step < currentStep) setCurrentStep(step);
            }}
          />
        )}

        {/* Step Views */}
        {isCreatedSuccess && createdBookingRecord && selectedCustomer ? (
          <BookingCreatedSuccess
            bookingId={createdBookingRecord.id}
            customer={selectedCustomer}
            startDate={startDate}
            endDate={endDate}
            selectedResources={selectedResources}
            status={createdBookingRecord.status}
            source={createdBookingRecord.source}
            onGoToBookings={() => navigate('/panel/bookings')}
            onCreateAnother={handleResetForAnother}
          />
        ) : (
          <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5 sm:p-7 shadow-xs">
            {currentStep === 1 && (
              <BookingCustomerStep
                customers={customers}
                selectedCustomer={selectedCustomer}
                onSelectCustomer={setSelectedCustomer}
                onAddNewCustomer={handleAddNewCustomer}
                onCancel={() => navigate('/panel/bookings')}
                onContinue={() => setCurrentStep(2)}
              />
            )}

            {currentStep === 2 && (
              <BookingDatesStep
                customer={selectedCustomer}
                startDate={startDate}
                endDate={endDate}
                onDatesChange={(s, e) => {
                  setStartDate(s);
                  setEndDate(e);
                }}
                onBack={() => setCurrentStep(1)}
                onContinue={() => setCurrentStep(3)}
              />
            )}

            {currentStep === 3 && (
              <BookingInventoryStep
                customer={selectedCustomer}
                startDate={startDate}
                endDate={endDate}
                availableResources={availableResources}
                selectedResources={selectedResources}
                onToggleResource={handleToggleResource}
                onRemoveResource={handleRemoveResource}
                onBack={() => setCurrentStep(2)}
                onContinue={() => setCurrentStep(4)}
              />
            )}

            {currentStep === 4 && selectedCustomer && (
              <BookingReviewStep
                customer={selectedCustomer}
                startDate={startDate}
                endDate={endDate}
                selectedResources={selectedResources}
                onEditSection={(step) => setCurrentStep(step)}
                onBack={() => setCurrentStep(3)}
                onCreateBooking={handleCreateBooking}
                isSubmitting={isSubmitting}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateBookingPage;
