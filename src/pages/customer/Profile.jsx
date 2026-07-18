import { useState } from "react";
import { toast } from "react-toastify";
import { FiUser, FiLock } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../services/authService";
import InputField from "../../components/common/InputField";
import { getInitials, getErrorMessage } from "../../utils/formatters";
import { isValidEmail, isValidPhone, isNonEmpty, isValidPassword } from "../../utils/validators";

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });
  const [profileErrors, setProfileErrors] = useState({});
  const [savingProfile, setSavingProfile] = useState(false);

  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "" });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [savingPassword, setSavingPassword] = useState(false);

  const handleProfileChange = (e) => {
    setProfileForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePasswordChange = (e) => {
    setPasswordForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateProfile = () => {
    const errors = {};
    if (!isNonEmpty(profileForm.name)) errors.name = "Name is required.";
    if (!isValidEmail(profileForm.email)) errors.email = "Enter a valid email.";
    if (!isValidPhone(profileForm.phone)) errors.phone = "Enter a valid 10-digit number.";
    setProfileErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePassword = () => {
    const errors = {};
    if (!isNonEmpty(passwordForm.currentPassword)) errors.currentPassword = "Required.";
    if (!isValidPassword(passwordForm.newPassword)) errors.newPassword = "Must be at least 6 characters.";
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!validateProfile()) return;
    setSavingProfile(true);
    try {
      const { data } = await authService.updateProfile(profileForm);
      updateUser(data.user || data);
      toast.success("Profile updated.");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!validatePassword()) return;
    setSavingPassword(true);
    try {
      await authService.changePassword(passwordForm);
      toast.success("Password changed successfully.");
      setPasswordForm({ currentPassword: "", newPassword: "" });
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="page-shell py-8">
      <h1 className="section-title">My profile</h1>

      <div className="mt-6 flex items-center gap-4">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-ink-900 text-xl font-bold text-white">
          {getInitials(user?.name)}
        </span>
        <div>
          <p className="font-display text-lg font-semibold text-ink-900">{user?.name}</p>
          <p className="text-sm capitalize text-ink-600">{user?.role}</p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <form onSubmit={handleProfileSubmit} className="card space-y-4 p-6">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-ink-900">
            <FiUser size={18} /> Personal details
          </h2>
          <InputField
            label="Full name"
            name="name"
            value={profileForm.name}
            onChange={handleProfileChange}
            error={profileErrors.name}
          />
          <InputField
            label="Email address"
            type="email"
            name="email"
            value={profileForm.email}
            onChange={handleProfileChange}
            error={profileErrors.email}
          />
          <InputField
            label="Phone number"
            name="phone"
            value={profileForm.phone}
            onChange={handleProfileChange}
            error={profileErrors.phone}
          />
          <button type="submit" className="btn-primary w-full" disabled={savingProfile}>
            {savingProfile ? "Saving…" : "Save changes"}
          </button>
        </form>

        <form onSubmit={handlePasswordSubmit} className="card space-y-4 p-6">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-ink-900">
            <FiLock size={18} /> Change password
          </h2>
          <InputField
            label="Current password"
            type="password"
            name="currentPassword"
            value={passwordForm.currentPassword}
            onChange={handlePasswordChange}
            error={passwordErrors.currentPassword}
          />
          <InputField
            label="New password"
            type="password"
            name="newPassword"
            value={passwordForm.newPassword}
            onChange={handlePasswordChange}
            error={passwordErrors.newPassword}
          />
          <button type="submit" className="btn-secondary w-full" disabled={savingPassword}>
            {savingPassword ? "Updating…" : "Update password"}
          </button>
        </form>
      </div>
    </div>
  );
}
