import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FiArrowLeft, FiLock } from "react-icons/fi";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { orderService } from "../../services/orderService";
import { paymentService, loadRazorpayScript } from "../../services/paymentService";
import OrderSummaryCard from "../../components/customer/OrderSummaryCard";
import { getErrorMessage } from "../../utils/formatters";

const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;

export default function Payment() {
  const { items, subtotal, deliveryFee, total, itemCount, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [address, setAddress] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Razorpay");

  useEffect(() => {
    const stored = sessionStorage.getItem("rfo_checkout_address");
    if (!stored || items.length === 0) {
      navigate("/checkout", { replace: true });
      return;
    }
    setAddress(JSON.parse(stored));
  }, [items, navigate]);

  const buildOrderPayload = () => ({
    items: items.map((item) => ({
      food: item._id,
      quantity: item.quantity,
      price: item.price,
    })),
    deliveryAddress: {
      line1: address.addressLine,
      city: address.city,
      state: address.state || "Tamil Nadu",
      pincode: address.pincode,
    },
    customerNote: address.notes,
  });

  const handleCashOnDelivery = async () => {
    setProcessing(true);
    try {
      const { data } = await orderService.create({
        ...buildOrderPayload(),
        paymentMethod: "COD",
      });
      clearCart();
      sessionStorage.removeItem("rfo_checkout_address");
      toast.success("Order placed successfully!");
      const orderId = data.data?.order?._id || data.order?._id || data._id;
      navigate(`/orders/${orderId}/track`, { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setProcessing(false);
    }
  };

  const handleRazorpayPayment = async () => {
    setProcessing(true);
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error("Unable to load payment gateway. Check your connection.");
        setProcessing(false);
        return;
      }

      const { data: orderData } = await orderService.create({
        ...buildOrderPayload(),
        paymentMethod: "Razorpay",
      });
      const orderId = orderData.data?.order?._id || orderData.order?._id || orderData._id;

      const { data: rpOrderResponse } = await paymentService.createRazorpayOrder({ orderId });
      const rpData = rpOrderResponse.data || rpOrderResponse;

      const options = {
        key: RAZORPAY_KEY_ID,
        amount: rpData.amount,
        currency: rpData.currency || "INR",
        name: "TiffinBox",
        description: "Order payment",
        order_id: rpData.razorpayOrderId || rpData.id,
        prefill: {
          name: address?.fullName || user?.name,
          contact: address?.phone || user?.phone,
          email: user?.email,
        },
        theme: { color: "#d6432f" },
        handler: async (response) => {
          try {
            await paymentService.verifyPayment({
              orderId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            clearCart();
            sessionStorage.removeItem("rfo_checkout_address");
            toast.success("Payment successful! Order confirmed.");
            navigate(`/orders/${orderId}/track`, { replace: true });
          } catch (err) {
            toast.error(getErrorMessage(err) || "Payment verification failed.");
          } finally {
            setProcessing(false);
          }
        },
        modal: {
          ondismiss: () => {
            setProcessing(false);
            toast.info("Payment cancelled.");
          },
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (err) {
      toast.error(getErrorMessage(err));
      setProcessing(false);
    }
  };

  const handlePay = () => {
    if (paymentMethod === "Razorpay") {
      handleRazorpayPayment();
    } else {
      handleCashOnDelivery();
    }
  };

  if (!address) return null;

  return (
    <div className="page-shell py-8">
      <button onClick={() => navigate(-1)} className="btn-ghost mb-4 gap-2 px-0">
        <FiArrowLeft size={16} /> Back
      </button>
      <h1 className="section-title">Payment</h1>

      <div className="mt-6 grid gap-8 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-2">
          <h2 className="font-display text-lg font-semibold text-ink-900">Choose payment method</h2>

          <div className="mt-4 space-y-3">
            <label
              className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 ${paymentMethod === "Razorpay" ? "border-chili-500 bg-chili-50" : "border-ink-200"
                }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="Razorpay"
                checked={paymentMethod === "Razorpay"}
                onChange={() => setPaymentMethod("Razorpay")}
                className="h-4 w-4 accent-chili-600"
              />
              <div>
                <p className="font-medium text-ink-900">Pay online</p>
                <p className="text-sm text-ink-600">UPI, cards, netbanking via Razorpay</p>
              </div>
            </label>

            <label
              className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 ${paymentMethod === "COD" ? "border-chili-500 bg-chili-50" : "border-ink-200"
                }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="COD"
                checked={paymentMethod === "COD"}
                onChange={() => setPaymentMethod("COD")}
                className="h-4 w-4 accent-chili-600"
              />
              <div>
                <p className="font-medium text-ink-900">Cash on delivery</p>
                <p className="text-sm text-ink-600">Pay with cash when your order arrives</p>
              </div>
            </label>
          </div>

          <p className="mt-6 flex items-center gap-2 text-xs text-ink-500">
            <FiLock size={14} /> Payments are securely processed. We never store your card details.
          </p>
        </div>

        <div>
          <OrderSummaryCard
            subtotal={subtotal}
            deliveryFee={deliveryFee}
            total={total}
            itemCount={itemCount}
          >
            <button onClick={handlePay} disabled={processing} className="btn-primary mt-5 w-full">
              {processing ? "Processing…" : "Pay now"}
            </button>
          </OrderSummaryCard>
        </div>
      </div>
    </div>
  );
}