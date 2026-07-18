import { ORDER_STATUS, ORDER_STATUS_LABEL } from "../../utils/constants";

const STYLE_MAP = {
  [ORDER_STATUS.PENDING]: "bg-ink-100 text-ink-600",
  [ORDER_STATUS.CONFIRMED]: "bg-turmeric-100 text-turmeric-600",
  [ORDER_STATUS.PREPARING]: "bg-turmeric-100 text-turmeric-600",
  [ORDER_STATUS.READY]: "bg-basil-100 text-basil-600",
  [ORDER_STATUS.OUT_FOR_DELIVERY]: "bg-chili-100 text-chili-600",
  [ORDER_STATUS.DELIVERED]: "bg-basil-100 text-basil-600",
  [ORDER_STATUS.CANCELLED]: "bg-chili-100 text-chili-700",
};

export default function StatusBadge({ status }) {
  const style = STYLE_MAP[status] || "bg-ink-100 text-ink-600";
  const label = ORDER_STATUS_LABEL[status] || status;
  return <span className={`badge ${style}`}>{label}</span>;
}
