import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FiArrowLeft } from "react-icons/fi";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import InputField from "../../components/common/InputField";
import OrderSummaryCard from "../../components/customer/OrderSummaryCard";
import { isNonEmpty, isValidPhone, isValidPincode } from "../../utils/validators";

export default function Checkout() {
  const { items, subtotal, deliveryFee, total, itemCount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: user?.name || "",
    phone: user?.phone || "",
    addressLine: "",
    city: "",
    pincode: "",
    notes: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (items.length === 0) {
      navigate("/cart", { replace: true });
    }
  }, [items, navigate]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!isNonEmpty(form.fullName)) nextErrors.fullName = "Name is required.";
    if (!isValidPhone(form.phone)) nextErrors.phone = "Enter a valid 10-digit phone number.";
    if (!isNonEmpty(form.addressLine)) nextErrors.addressLine = "Address is required.";
    if (!isNonEmpty(form.city)) nextErrors.city = "City is required.";
    if (!isValidPincode(form.pincode)) nextErrors.pincode = "Enter a valid 6-digit pincode.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleContinue = () => {
    if (!validate()) {
      toast.error("Please fix the highlighted fields.");
      return;
    }
    sessionStorage.setItem("rfo_checkout_address", JSON.stringify(form));
    navigate("/payment");
  };

  return (
    <div className="page-shell py-8">
      <button onClick={() => navigate(-1)} className="btn-ghost mb-4 gap-2 px-0">
        <FiArrowLeft size={16} /> Back
      </button>
      <h1 className="section-title">Checkout</h1>

      <div className="mt-6 grid gap-8 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-2">
          <h2 className="font-display text-lg font-semibold text-ink-900">Delivery details</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <InputField
              label="Full name"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              error={errors.fullName}
            />
            <InputField
              label="Phone number"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              error={errors.phone}
            />
            <InputField
              label="Address"
              name="addressLine"
              value={form.addressLine}
              onChange={handleChange}
              error={errors.addressLine}
              className="sm:col-span-2"
            />
            <InputField
              label="City"
              name="city"
              value={form.city}
              onChange={handleChange}
              error={errors.city}
            />
            <InputField
              label="Pincode"
              name="pincode"
              value={form.pincode}
              onChange={handleChange}
              error={errors.pincode}
            />
            <div className="sm:col-span-2">
              <label className="label-text">Delivery notes (optional)</label>
              <textarea
                name="notes"
                rows={3}
                value={form.notes}
                onChange={handleChange}
                className="input-field"
                placeholder="E.g. ring the doorbell, leave at gate…"
              />
            </div>
          </div>
        </div>

        <div className="lg:sticky lg:top-24 h-fit">
          <OrderSummaryCard
            subtotal={subtotal}
            deliveryFee={deliveryFee}
            total={total}
            itemCount={itemCount}
          >
            <button onClick={handleContinue} className="btn-primary mt-5 w-full">
              Continue to payment
            </button>
          </OrderSummaryCard>
        </div>
      </div>
    </div>
  );
}
