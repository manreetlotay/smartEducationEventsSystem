// PaymentPage.tsx
import React, { useState } from "react";
import PaymentForm from "./PaymentForm";
import PaymentSuccess from "./PaymentSuccess";
import PaymentMethods from "./PaymentMethods";
import { useNavigate } from "react-router-dom";

interface PaymentPageProps {
  eventName: string;
  eventPrice: number;
  onCancel: () => void;
}

const PaymentPage: React.FC<PaymentPageProps> = ({
  eventName,
  eventPrice,
  onCancel,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<string>("credit-card");
  const [isPaymentComplete, setIsPaymentComplete] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

  const handlePaymentMethodChange = (method: string) => {
    setPaymentMethod(method);
  };

  const navigate = useNavigate();

  const handleClose = () => {
    setShowSuccessModal(false);
    navigate("/events");
  };

  const handlePaymentSubmit = (formData: any) => {
    // In a real app, you would process the payment here
    console.log("Processing payment with:", paymentMethod, formData);

    // Simulate payment processing
    setTimeout(() => {
      setIsPaymentComplete(true);
      setShowSuccessModal(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 mt-25 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {!isPaymentComplete ? (
          <>
            <div className="px-6 py-8 bg-[#655967]">
              <h2 className="text-xl font-bold text-white text-center">
                Complete Payment
              </h2>
            </div>

            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">
                  {eventName}
                </h3>
              </div>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-gray-600">Registration Fee</span>
                <span className="text-xl font-semibold">
                  ${eventPrice.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="px-6 py-4">
              <PaymentMethods
                selectedMethod={paymentMethod}
                onMethodChange={handlePaymentMethodChange}
              />

              <PaymentForm
                paymentMethod={paymentMethod}
                eventPrice={eventPrice}
                onSubmit={handlePaymentSubmit}
                onCancel={onCancel}
              />
            </div>
          </>
        ) : (
          <PaymentSuccess
            eventName={eventName}
            onClose={() => handleClose}
            isVisible={showSuccessModal}
          />
        )}
      </div>
    </div>
  );
};

export default PaymentPage;
