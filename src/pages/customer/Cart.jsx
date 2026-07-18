import { Link, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiShoppingBag } from "react-icons/fi";
import { useCart } from "../../context/CartContext";
import CartItemRow from "../../components/customer/CartItemRow";
import OrderSummaryCard from "../../components/customer/OrderSummaryCard";
import EmptyState from "../../components/common/EmptyState";

export default function Cart() {
  const { items, updateQuantity, removeItem, subtotal, deliveryFee, total, itemCount } = useCart();
  const navigate = useNavigate();

  const increment = (id) => {
    const item = items.find((i) => i._id === id);
    if (item) updateQuantity(id, item.quantity + 1);
  };

  const decrement = (id) => {
    const item = items.find((i) => i._id === id);
    if (item) updateQuantity(id, item.quantity - 1);
  };

  if (items.length === 0) {
    return (
      <div className="page-shell py-16">
        <EmptyState
          icon={<FiShoppingBag />}
          title="Your cart is empty"
          description="Add some delicious dishes from the menu to get started."
          action={
            <Link to="/menu" className="btn-primary">
              Browse menu
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="page-shell py-8">
      <button onClick={() => navigate(-1)} className="btn-ghost mb-4 gap-2 px-0">
        <FiArrowLeft size={16} /> Back
      </button>
      <h1 className="section-title">Your cart</h1>

      <div className="mt-6 grid gap-8 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-2 max-h-[65vh] overflow-y-auto custom-scrollbar">
          {items.map((item) => (
            <CartItemRow
              key={item._id}
              item={item}
              onIncrement={increment}
              onDecrement={decrement}
              onRemove={removeItem}
            />
          ))}
        </div>

        <div className="lg:sticky lg:top-24 h-fit">
          <OrderSummaryCard
            subtotal={subtotal}
            deliveryFee={deliveryFee}
            total={total}
            itemCount={itemCount}
          >
            <button onClick={() => navigate("/checkout")} className="btn-primary mt-5 w-full">
              Proceed to checkout
            </button>
          </OrderSummaryCard>
        </div>
      </div>
    </div>
  );
}
