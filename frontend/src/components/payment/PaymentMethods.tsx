// PaymentMethods.tsx
import React, { useEffect } from "react";
import { CreditCard, Wallet, Building, Gift } from "lucide-react";
import { useAuth } from "../../lib/hooks/useAuth";

interface PaymentMethodsProps {
  selectedMethod: string;
  onMethodChange: (method: string) => void;
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({
  selectedMethod,
  onMethodChange,
}) => {
  const { user } = useAuth();

  // Check if user has enough points
  const hasEnoughPoints = user && user.points >= 500;

  const methods = [
    {
      id: "credit-card",
      name: "Credit Card",
      icon: <CreditCard className="h-5 w-5" />,
    },
    {
      id: "paypal",
      name: "PayPal",
      icon: <Wallet className="h-5 w-5" />,
    },
    {
      id: "bank-transfer",
      name: "Bank Transfer",
      icon: <Building className="h-5 w-5" />,
    },
    ...(hasEnoughPoints
      ? [
          {
            id: "points",
            name: "Pay with Points",
            icon: <Gift className="h-5 w-5" />,
          },
        ]
      : []),
  ];

  useEffect(() => {
    if (selectedMethod === "points" && !hasEnoughPoints) {
      onMethodChange("credit-card");
    }
  }, [hasEnoughPoints, selectedMethod, onMethodChange]);

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Payment Method
      </label>
      <div className="grid grid-cols-3 gap-3">
        {methods.map((method) => (
          <button
            key={method.id}
            type="button"
            className={`relative border rounded-md p-3 flex flex-col items-center hover:border-indigo-500 transition-colors ${
              selectedMethod === method.id
                ? "border-indigo-600 bg-indigo-50"
                : "border-gray-300"
            }`}
            onClick={() => onMethodChange(method.id)}
          >
            <span
              className={`${
                selectedMethod === method.id
                  ? "text-indigo-600"
                  : "text-gray-600"
              }`}
            >
              {method.icon}
            </span>
            <span
              className={`mt-2 text-sm ${
                selectedMethod === method.id
                  ? "text-indigo-600 font-medium"
                  : "text-gray-700"
              }`}
            >
              {method.name}
            </span>
          </button>
        ))}
      </div>
      {/* Optional: Add a helpful message if points are insufficient */}
      {!hasEnoughPoints && (
        <p className="text-sm text-gray-500 mt-2">
          You need at least 500 points to use the "Pay with Points" option.
        </p>
      )}
    </div>
  );
};

export default PaymentMethods;
