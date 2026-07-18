import { useState, useCallback } from "react";
import { toast } from "react-toastify";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import { useFetch } from "../../hooks/useFetch";
import { foodService } from "../../services/foodService";
import api from "../../services/api";
import DataTable from "../../components/admin/DataTable";
import FormModal from "../../components/admin/FormModal";
import ConfirmModal from "../../components/common/ConfirmModal";
import InputField from "../../components/common/InputField";
import Spinner from "../../components/common/Spinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import { formatCurrency, getErrorMessage } from "../../utils/formatters";
import { isNonEmpty } from "../../utils/validators";

const CATEGORIES = {
  Veg: [
    "Starters", "Main Course", "Breads", "Rice",
    "Desserts", "Beverages", "Salads", "Soups", "Veg Biryani"
  ],
  "Non Veg": [
    "Chicken Biryani", "Mutton Biryani", "Fish", "Fish Biryani", "Sea Food",
    "Biryani", "BBQ", "Grill", "Kebab",
  ],
};

const EMPTY_FORM = {
  name: "",
  category: "",
  price: "",
  description: "",
  imageUrl: "",
  foodType: "Non Veg",
  isAvailable: true,
};

export default function FoodManagement() {
  const fetchFoods = useCallback(() => foodService.getAll({ limit: 100 }), []);
  const { data, loading, error, refetch } = useFetch(fetchFoods);
  // useFetch now auto-unwraps the backend's { data: { foods } } envelope,
  // so `data` here is already { foods: [...] }.
  const foods = data?.foods || [];

  const [modalOpen, setModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const openCreateModal = () => {
    setEditingFood(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setImageFile(null);
    setModalOpen(true);
  };

  const openEditModal = (food) => {
    setEditingFood(food);
    setForm({
      name: food.name || "",
      category: food.category || "",
      price: food.price ?? "",
      description: food.description || "",
      imageUrl: food.imageUrl || "",
      foodType: food.foodType || "Non Veg",
      isAvailable: food.isAvailable !== false,
    });
    setErrors({});
    setImageFile(null);
    setModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "foodType") {
      setForm((prev) => ({ ...prev, foodType: value, category: "" }));
      return;
    }
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const validate = () => {
    const next = {};
    if (!isNonEmpty(form.name)) next.name = "Name is required.";
    if (!isNonEmpty(form.category)) next.category = "Category is required.";
    if (!form.price || Number(form.price) <= 0) next.price = "Enter a valid price.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    let uploadedImageUrl = form.imageUrl;

    try {
      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);
        const uploadRes = await api.post("/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";
        const serverURL = baseURL.replace('/api', '');
        uploadedImageUrl = `${serverURL}${uploadRes.data.imageUrl}`;
      }

      const payload = {
        name: form.name,
        category: form.category,
        price: Number(form.price),
        description: form.description,
        imageUrl: uploadedImageUrl,
        foodType: form.foodType,
        isAvailable: form.isAvailable,
      };

      if (editingFood) {
        await foodService.update(editingFood._id, payload);
        toast.success("Dish updated.");
      } else {
        await foodService.create(payload);
        toast.success("Dish added to the menu.");
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
      await foodService.remove(deleteTarget._id);
      toast.success("Dish removed.");
      setDeleteTarget(null);
      refetch();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    { key: "name", header: "Dish", render: (row) => <span className="font-medium text-ink-900">{row.name}</span> },
    { key: "category", header: "Category", render: (row) => <span className="capitalize">{row.category}</span> },
    {
      key: "foodType", header: "Type", render: (row) => (
        <span className={`badge ${row.foodType === "Veg" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
          {row.foodType === "Veg" ? "🥦 Veg" : "🍖 Non Veg"}
        </span>
      )
    },
    { key: "price", header: "Price", render: (row) => formatCurrency(row.price) },
    {
      key: "isAvailable", header: "Status", render: (row) => (
        <span className={`badge ${row.isAvailable !== false ? "bg-basil-100 text-basil-600" : "bg-ink-100 text-ink-500"}`}>
          {row.isAvailable !== false ? "Available" : "Sold out"}
        </span>
      ),
    },
    {
      key: "actions", header: "", render: (row) => (
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
        <h2 className="font-display text-xl font-semibold text-ink-900">Food management</h2>
        <button onClick={openCreateModal} className="btn-primary gap-2">
          <FiPlus size={16} /> Add dish
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : error ? (
        <ErrorMessage message={error} onRetry={refetch} />
      ) : (
        <DataTable columns={columns} rows={foods} emptyMessage="No dishes added yet." />
      )}

      <FormModal open={modalOpen} title={editingFood ? "Edit dish" : "Add new dish"} onClose={() => setModalOpen(false)}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField label="Dish name" name="name" value={form.name} onChange={handleChange} error={errors.name} />

          {/* Food Type — select pannina pinbu category update aagum */}
          <div>
            <label className="label-text">Food Type *</label>
            <select name="foodType" value={form.foodType} onChange={handleChange} className="input-field">
              <option value="Non Veg">🍖 Non Veg</option>
              <option value="Veg">🥦 Veg</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Category — foodType based-ஆ filter ஆகும் */}
            <div>
              <label className="label-text">Category *</label>
              <select name="category" value={form.category} onChange={handleChange} className="input-field">
                <option value="">-- Select --</option>
                {(CATEGORIES[form.foodType] || []).map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category}</p>}
            </div>

            <InputField label="Price (₹)" type="number" name="price" value={form.price} onChange={handleChange} error={errors.price} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-text">Dish Image</label>
              <input type="file" accept="image/*" onChange={handleFileChange} className="input-field p-1.5" />
              {form.imageUrl && !imageFile && (
                <p className="mt-1 text-xs text-ink-500">Current: {form.imageUrl.split('/').pop()}</p>
              )}
            </div>
          </div>

          <div>
            <label className="label-text">Description</label>
            <textarea name="description" rows={3} value={form.description} onChange={handleChange} className="input-field" />
          </div>

          <label className="flex items-center gap-2 text-sm text-ink-700">
            <input type="checkbox" name="isAvailable" checked={form.isAvailable} onChange={handleChange} className="accent-chili-600" />
            Available
          </label>

          <button type="submit" disabled={saving} className="btn-primary w-full">
            {saving ? "Saving…" : editingFood ? "Save changes" : "Add dish"}
          </button>
        </form>
      </FormModal>

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Remove this dish?"
        description={`"${deleteTarget?.name}" will be removed from the menu. This cannot be undone.`}
        confirmLabel="Remove"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
}