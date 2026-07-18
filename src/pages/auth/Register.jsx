import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import InputField from "../../components/common/InputField";
import { isValidEmail, isValidPassword, isValidPhone, isNonEmpty } from "../../utils/validators";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!isNonEmpty(form.name)) nextErrors.name = "Name is required.";
    if (!isValidEmail(form.email)) nextErrors.email = "Enter a valid email address.";
    if (!isValidPhone(form.phone)) nextErrors.phone = "Enter a valid 10-digit phone number.";
    if (!isValidPassword(form.password)) nextErrors.password = "Password must be at least 6 characters.";
    if (form.confirmPassword !== form.password) nextErrors.confirmPassword = "Passwords do not match.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    // eslint-disable-next-line no-unused-vars
    const { confirmPassword, ...payload } = form;
    const result = await register({ ...payload, role: "customer" });
    setSubmitting(false);

    if (result.success) {
      toast.success("Account created! Welcome to TiffinBox.");
      navigate("/", { replace: true });
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="card w-full max-w-md p-8">
        <h1 className="section-title">Create your account</h1>
        <p className="mt-1 text-sm text-ink-600">Sign up to start ordering.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
          <InputField
            label="Full name"
            name="name"
            placeholder="Jane Doe"
            value={form.name}
            onChange={handleChange}
            error={errors.name}
            autoComplete="name"
          />
          <InputField
            label="Email address"
            type="email"
            name="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
            autoComplete="email"
          />
          <InputField
            label="Phone number"
            name="phone"
            placeholder="9876543210"
            value={form.phone}
            onChange={handleChange}
            error={errors.phone}
            autoComplete="tel"
          />
          <InputField
            label="Password"
            type="password"
            name="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
            autoComplete="new-password"
          />
          <InputField
            label="Confirm password"
            type="password"
            name="confirmPassword"
            placeholder="••••••••"
            value={form.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            autoComplete="new-password"
          />

          <button type="submit" className="btn-primary w-full" disabled={submitting}>
            {submitting ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-600">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-chili-600 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
