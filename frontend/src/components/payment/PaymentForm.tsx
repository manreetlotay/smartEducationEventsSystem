// PaymentForm.tsx
import React, { useState } from "react";

interface PaymentFormProps {
  paymentMethod: string;
  eventPrice: number;
  onSubmit: (formData: any) => void;
  onCancel: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  paymentMethod,
  eventPrice,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    // Credit card specific fields
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    // Bank transfer specific fields
    accountName: "",
    accountNumber: "",
    routingNumber: "",
    // Points redemption
    serialNumber: "",
    // Common fields
    billingAddress: "",
    city: "",
    zipCode: "",
    country: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Determine which fields need to be shown based on payment method
  const showCommonFields = paymentMethod !== "points";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Points redemption fields */}
      {paymentMethod === "points" && (
        <div className="space-y-4">
          <div className="bg-indigo-50 p-4 rounded-md mb-4">
            <h4 className="text-sm font-medium text-indigo-800 mb-2">
              Pay with Points
            </h4>
            <p className="text-sm text-indigo-700">
              Use your points to pay for this event. Enter the access code found
              on your Golden Access Pass in "My Tickets".
            </p>
          </div>

          <div>
            <label
              htmlFor="serialNumber"
              className="block text-sm font-medium text-gray-700"
            >
              Golden Access Pass Code
            </label>
            <input
              type="text"
              id="serialNumber"
              name="serialNumber"
              required
              value={formData.serialNumber}
              onChange={handleChange}
              placeholder="Enter access code (e.g., XYZ-123456-ABC)"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
      )}

      {/* Common Fields for other payment methods */}
      {showCommonFields && (
        <>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </>
      )}

      {/* Credit Card Fields */}
      {paymentMethod === "credit-card" && (
        <>
          <div>
            <label
              htmlFor="cardNumber"
              className="block text-sm font-medium text-gray-700"
            >
              Card Number
            </label>
            <input
              type="text"
              id="cardNumber"
              name="cardNumber"
              required
              value={formData.cardNumber}
              onChange={handleChange}
              placeholder="1234 5678 9012 3456"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="expiryDate"
                className="block text-sm font-medium text-gray-700"
              >
                Expiry Date
              </label>
              <input
                type="text"
                id="expiryDate"
                name="expiryDate"
                required
                placeholder="MM/YY"
                value={formData.expiryDate}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label
                htmlFor="cvv"
                className="block text-sm font-medium text-gray-700"
              >
                CVV
              </label>
              <input
                type="text"
                id="cvv"
                name="cvv"
                required
                placeholder="123"
                value={formData.cvv}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        </>
      )}

      {/* Bank Transfer Fields */}
      {paymentMethod === "bank-transfer" && (
        <>
          <div>
            <label
              htmlFor="accountName"
              className="block text-sm font-medium text-gray-700"
            >
              Account Name
            </label>
            <input
              type="text"
              id="accountName"
              name="accountName"
              required
              value={formData.accountName}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label
              htmlFor="accountNumber"
              className="block text-sm font-medium text-gray-700"
            >
              Account Number
            </label>
            <input
              type="text"
              id="accountNumber"
              name="accountNumber"
              required
              value={formData.accountNumber}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label
              htmlFor="routingNumber"
              className="block text-sm font-medium text-gray-700"
            >
              Routing Number
            </label>
            <input
              type="text"
              id="routingNumber"
              name="routingNumber"
              required
              value={formData.routingNumber}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </>
      )}

      {/* PayPal - only asks for common information */}
      {paymentMethod === "paypal" && (
        <div className="bg-blue-50 text-blue-700 p-4 rounded-md">
          <p className="text-sm">
            You'll be redirected to PayPal to complete your payment of $
            {eventPrice.toFixed(2)}.
          </p>
        </div>
      )}

      {/* Common Address Fields - only if not using points */}
      {showCommonFields && (
        <div className="pt-4 border-t border-gray-200 mt-4">
          <div>
            <label
              htmlFor="billingAddress"
              className="block text-sm font-medium text-gray-700"
            >
              Street Address
            </label>
            <input
              type="text"
              id="billingAddress"
              name="billingAddress"
              required
              value={formData.billingAddress}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label
                htmlFor="city"
                className="block text-sm font-medium text-gray-700"
              >
                City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                required
                value={formData.city}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label
                htmlFor="zipCode"
                className="block text-sm font-medium text-gray-700"
              >
                ZIP / Postal Code
              </label>
              <input
                type="text"
                id="zipCode"
                name="zipCode"
                required
                value={formData.zipCode}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="mt-4">
            <label
              htmlFor="country"
              className="block text-sm font-medium text-gray-700"
            >
              Country
            </label>
            <input
              type="text"
              id="country"
              name="country"
              required
              value={formData.country}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
      )}

      <div className="pt-6 border-t border-gray-200 flex justify-between">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#655967] hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {paymentMethod === "points"
            ? "Redeem Points"
            : `Pay $${eventPrice.toFixed(2)}`}
        </button>
      </div>
    </form>
  );
};

export default PaymentForm;
