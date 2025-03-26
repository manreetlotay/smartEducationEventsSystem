// PaymentSuccess.tsx
import React, { useEffect } from "react";
import { CheckCircle } from "lucide-react";

interface PaymentSuccessProps {
  eventName: string;
  onClose: () => void;
  isVisible: boolean;
}

const PaymentSuccess: React.FC<PaymentSuccessProps> = ({
  eventName,
  onClose,
  isVisible,
}) => {
  useEffect(() => {
    // Generate a unique confirmation number
    const confirmationNumber = Math.random()
      .toString(36)
      .substring(2, 10)
      .toUpperCase();

    // Store in the component state or use directly
    return () => {
      // Cleanup if needed
    };
  }, []);

  useEffect(() => {
    if (isVisible) {
      // Disable background scrolling when the modal is visible
      document.body.style.overflow = "hidden";
    } else {
      // Re-enable scrolling when the modal is not visible
      document.body.style.overflow = "auto";
    }
    // Cleanup: make sure scrolling is enabled if the component unmounts
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      ></div> */}

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden">
          <div className="p-6 bg-green-50 flex items-center justify-center">
            <CheckCircle size={64} className="text-green-500" />
          </div>

          <div className="p-6 text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Payment Successful!
            </h3>

            <p className="text-gray-600 mb-4">
              Your registration for{" "}
              <span className="font-medium">{eventName}</span>
              has been confirmed.
            </p>

            <div className="bg-gray-50 p-4 rounded-md mb-4">
              <p className="text-sm text-gray-500">Confirmation Number</p>
              <p className="text-lg font-mono font-medium">
                {Math.random().toString(36).substring(2, 10).toUpperCase()}
              </p>
            </div>

            <p className="text-sm text-gray-500 mb-6">
              A confirmation email has been sent to your registered email
              address.
            </p>

            <a
              href="/events" // or whatever your target URL is
              className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-violet-500 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-center"
            >
              Return to Events
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentSuccess;
