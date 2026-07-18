import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import InputField from "../../components/common/InputField";
import { isValidEmail, isNonEmpty } from "../../utils/validators";
import { DASHBOARD_PATH } from "../../utils/constants";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!isValidEmail(form.email)) nextErrors.email = "Enter a valid email address.";
    if (!isNonEmpty(form.password)) nextErrors.password = "Password is required.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    const result = await login(form);
    setSubmitting(false);

    if (result.success) {
      toast.success(`Welcome back, ${result.user.name}!`);
      const redirectTo = location.state?.from?.pathname || DASHBOARD_PATH[result.user.role] || "/";
      navigate(redirectTo, { replace: true });
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="card w-full max-w-md p-8">
        <h1 className="section-title">Welcome back</h1>
        <p className="mt-1 text-sm text-ink-600">Log in to order your favorite meals.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
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
            label="Password"
            type="password"
            name="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
            autoComplete="current-password"
          />

          <button type="submit" className="btn-primary w-full" disabled={submitting}>
            {submitting ? "Logging in…" : "Log in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-600">
          New here?{" "}
          <Link to="/register" className="font-semibold text-chili-600 hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
