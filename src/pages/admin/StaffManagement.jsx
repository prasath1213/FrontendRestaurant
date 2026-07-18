import { useState, useCallback } from "react";
import { toast } from "react-toastify";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import { useFetch } from "../../hooks/useFetch";
import { userService } from "../../services/userService";
import DataTable from "../../components/admin/DataTable";
import FormModal from "../../components/admin/FormModal";
import ConfirmModal from "../../components/common/ConfirmModal";
import InputField from "../../components/common/InputField";
import Spinner from "../../components/common/Spinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import { getErrorMessage } from "../../utils/formatters";
import { isNonEmpty, isValidEmail, isValidPhone, isValidPassword } from "../../utils/validators";

const EMPTY_FORM = { name: "", email: "", phone: "", password: "" };

export default function StaffManagement() {
  const fetchStaff = useCallback(() => userService.getStaff({ limit: 100 }), []);
  const { data, loading, error, refetch } = useFetch(fetchStaff);
  const staffList = data?.staff || data || [];

  const [modalOpen, setModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const openCreateModal = () => {
    setEditingStaff(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setModalOpen(true);
  };

  const openEditModal = (staff) => {
    setEditingStaff(staff);
    setForm({ name: staff.name || "", email: staff.email || "", phone: staff.phone || "", password: "" });
    setErrors({});
    setModalOpen(true);
  };

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const validate = () => {
    const next = {};
    if (!isNonEmpty(form.name)) next.name = "Name is required.";
    if (!isValidEmail(form.email)) next.email = "Enter a valid email.";
    if (!isValidPhone(form.phone)) next.phone = "Enter a valid 10-digit number.";
    if (!editingStaff && !isValidPassword(form.password)) next.password = "At least 6 characters.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      if (editingStaff) {
        const payload = { name: form.name, email: form.email, phone: form.phone };
        await userService.updateStaff(editingStaff._id, payload);
        toast.success("Staff member updated.");
      } else {
        await userService.createStaff(form);
        toast.success("Staff member added.");
      }
      setModalOpen(false);
      refetch();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await userService.removeStaff(deleteTarget._id);
      toast.success("Staff member removed.");
      setDeleteTarget(null);
      refetch();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    { key: "name", header: "Name", render: (row) => <span className="font-medium text-ink-900">{row.name}</span> },
    { key: "email", header: "Email" },
    { key: "phone", header: "Phone" },
    {
      key: "actions",
      header: "",
      render: (row) => (
        <div className="flex justify-end gap-2">
          <button onClick={() => openEditModal(row)} className="btn-ghost px-2 py-1" aria-label="Edit">
            <FiEdit2 size={16} />
          </button>
          <button onClick={() => setDeleteTarget(row)} className="btn-ghost px-2 py-1 text-chili-600" aria-label="Delete">
            <FiTrash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold text-ink-900">Staff management</h2>
        <button onClick={openCreateModal} className="btn-primary gap-2">
          <FiPlus size={16} /> Add staff
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : error ? (
        <ErrorMessage message={error} onRetry={refetch} />
      ) : (
        <DataTable columns={columns} rows={staffList} emptyMessage="No staff members added yet." />
      )}

      <FormModal
        open={modalOpen}
        title={editingStaff ? "Edit staff member" : "Add staff member"}
        onClose={() => setModalOpen(false)}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField label="Full name" name="name" value={form.name} onChange={handleChange} error={errors.name} />
          <InputField label="Email" type="email" name="email" value={form.email} onChange={handleChange} error={errors.email} />
          <InputField label="Phone number" name="phone" value={form.phone} onChange={handleChange} error={errors.phone} />
          {!editingStaff && (
            <InputField
              label="Temporary password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              error={errors.password}
            />
          )}
          <button type="submit" disabled={saving} className="btn-primary w-full">
            {saving ? "Saving…" : editingStaff ? "Save changes" : "Add staff"}
          </button>
        </form>
      </FormModal>

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Remove this staff member?"
        description={`"${deleteTarget?.name}" will lose access immediately.`}
        confirmLabel="Remove"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
}
