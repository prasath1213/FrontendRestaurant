export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || "");
}

export function isValidPhone(phone) {
  return /^[6-9]\d{9}$/.test(phone || "");
}

export function isValidPassword(password) {
  return (password || "").length >= 6;
}

export function isNonEmpty(value) {
  return Boolean(String(value || "").trim());
}

export function isValidPincode(pincode) {
  return /^\d{6}$/.test(pincode || "");
}
