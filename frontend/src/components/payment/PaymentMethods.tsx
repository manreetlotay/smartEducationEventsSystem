// PaymentMethods.tsx
import React from "react";
import { CreditCard, Wallet, Building } from "lucide-react";

interface PaymentMethodsProps {
  selectedMethod: string;
  onMethodChange: (method: string) => void;
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({
  selectedMethod,
  onMethodChange,
}) => {
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
  ];

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
    </div>
  );
};

export default PaymentMethods;
