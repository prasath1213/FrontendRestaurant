import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { FiArrowRight, FiClock, FiShield, FiTruck } from "react-icons/fi";
import { foodService } from "../../services/foodService";
import FoodCard from "../../components/customer/FoodCard";
import Spinner from "../../components/common/Spinner";
import { useCart } from "../../context/CartContext";
import { toast } from "react-toastify";

const PERKS = [
  { icon: FiClock, title: "30-minute delivery", text: "Hot meals, delivered fast from kitchen to door.", link: "/menu" },
  { icon: FiShield, title: "Quality checked", text: "Every order is reviewed by our kitchen staff before dispatch.", link: "/menu" },
  { icon: FiTruck, title: "Live tracking", text: "Watch your order move from prep to your doorstep.", link: "/my-orders" },
];

export default function Home() {
  const { addItem } = useCart();
  const [popularFoods, setPopularFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    foodService
      .getAll({ limit: 8, sort: "popular" })
      .then((res) => {
        const payload = res?.data;

        // Handle multiple possible API response shapes safely
        const foods = Array.isArray(payload?.foods)
          ? payload.foods
          : Array.isArray(payload?.data?.foods)
            ? payload.data.foods
            : Array.isArray(payload)
              ? payload
              : [];

        if (active) setPopularFoods(foods);
      })
      .catch((err) => {
        console.error("Failed to load popular foods:", err);
        if (active) setPopularFoods([]);
      })
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, []);

  const handleAdd = (food) => {
    addItem(food, 1);
    toast.success(`${food.name} added to cart`);
  };

  return (
    <div>
      <section
        className="relative bg-ink-900 text-ink-50 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "linear-gradient(to right, rgba(28, 23, 18, 0.95), rgba(28, 23, 18, 0.5)), url('/hero-bg.png')" }}
      >
        <div className="page-shell relative z-10 flex flex-col items-start gap-6 py-20 sm:py-32">
          <span className="badge bg-chili-500/20 text-chili-300 backdrop-blur-md border border-chili-500/30">Now delivering in your area</span>
          <h1 className="font-display text-4xl font-bold leading-tight sm:text-6xl">
            Home-style meals, <br /> on your schedule.
          </h1>
          <p className="max-w-lg text-ink-200">
            Order freshly prepared food from our kitchen and track it in real time, from confirmation
            to your doorstep.
          </p>
          <Link to="/menu" className="btn-primary gap-2 text-base">
            Browse the menu <FiArrowRight size={18} />
          </Link>
        </div>
      </section>

      <section className="page-shell grid gap-6 py-10 sm:grid-cols-3">
        {PERKS.map((perk) => (
          <Link
            key={perk.title}
            to={perk.link}
            className="card flex items-start gap-4 p-5 transition-shadow hover:shadow-lg cursor-pointer"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-chili-50 text-chili-600">
              <perk.icon size={20} />
            </span>
            <div>
              <p className="font-semibold text-ink-900">{perk.title}</p>
              <p className="text-sm text-ink-600">{perk.text}</p>
            </div>
          </Link>
        ))}
      </section>

      <section className="page-shell py-10">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="section-title">Popular right now</h2>
          <Link to="/menu" className="text-sm font-semibold text-chili-600 hover:underline">
            View full menu
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <Spinner size="lg" />
          </div>
        ) : popularFoods.length === 0 ? (
          <p className="text-ink-600">No items to show right now. Check back soon.</p>
        ) : (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {popularFoods.map((food) => (
              <FoodCard key={food._id} food={food} onAdd={handleAdd} />
            ))}
          </div>
        )}
      </section>

      {/* About Us Section */}
      <section className="bg-white py-16 mt-8 border-t border-ink-100">
        <div className="page-shell grid gap-12 lg:grid-cols-2 items-center">
          <div className="order-2 lg:order-1 flex flex-col justify-center">
            <span className="mb-2 text-sm font-bold uppercase tracking-wider text-chili-600">Our Story</span>
            <h2 className="font-display text-3xl font-bold text-ink-900 sm:text-4xl">
              About Henry Cavil
            </h2>
            <p className="mt-4 text-ink-600 leading-relaxed text-lg">
              Founded with a passion for bringing gourmet, restaurant-quality food to the comfort of your home, Henry Cavil is dedicated to culinary excellence. Our chefs source only the finest, freshest ingredients from local farms to craft dishes that are both deeply comforting and sophisticated. We believe that everyone deserves a great meal, prepared with love and delivered with care.
            </p>
            <div className="mt-8">
              <Link to="#" className="btn-outline">Read more about us</Link>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <img src="/about-us.png" alt="Our Chef" className="rounded-2xl shadow-lg w-full h-[400px] object-cover" />
          </div>
        </div>
      </section>

      {/* Careers Section */}
      <section className="bg-ink-50 py-16">
        <div className="page-shell grid gap-12 lg:grid-cols-2 items-center">
          <div className="order-1 lg:order-1">
            <img src="/careers.png" alt="Our Team" className="rounded-2xl shadow-lg w-full h-[400px] object-cover" />
          </div>
          <div className="order-2 lg:order-2 flex flex-col justify-center">
            <span className="mb-2 text-sm font-bold uppercase tracking-wider text-basil-600">Join the Team</span>
            <h2 className="font-display text-3xl font-bold text-ink-900 sm:text-4xl">
              Build your career with us
            </h2>
            <p className="mt-4 text-ink-600 leading-relaxed text-lg">
              Are you passionate about food, hospitality, or technology? We are always looking for talented individuals to join our growing family. From master chefs to delivery experts, your journey to an exciting culinary career starts here.
            </p>
            <div className="mt-8 flex gap-4">
              <Link to="#" className="btn-primary bg-basil-600 hover:bg-basil-700 border-none">View open roles</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}