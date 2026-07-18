import { FiCheck } from "react-icons/fi";
import { ORDER_STATUS, ORDER_STATUS_FLOW, ORDER_STATUS_LABEL } from "../../utils/constants";

export default function OrderTimeline({ status }) {
  const isCancelled = status === ORDER_STATUS.CANCELLED;
  const currentIndex = ORDER_STATUS_FLOW.indexOf(status);

  if (isCancelled) {
    return (
      <div className="rounded-xl border border-chili-100 bg-chili-50 p-4 text-sm font-medium text-chili-700">
        This order was cancelled.
      </div>
    );
  }

  return (
    <ol className="space-y-0">
      {ORDER_STATUS_FLOW.map((step, index) => {
        const isComplete = index <= currentIndex;
        const isLast = index === ORDER_STATUS_FLOW.length - 1;
        return (
          <li key={step} className="relative flex gap-4 pb-8 last:pb-0">
            {!isLast && (
              <span
                className={`absolute left-[15px] top-8 h-full w-0.5 ${
                  isComplete ? "bg-basil-500" : "bg-ink-200"
                }`}
              />
            )}
            <span
              className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                isComplete ? "bg-basil-500 text-white" : "bg-ink-100 text-ink-400"
              }`}
            >
              {isComplete ? <FiCheck size={16} /> : <span className="h-2 w-2 rounded-full bg-ink-300" />}
            </span>
            <div>
              <p className={`font-medium ${isComplete ? "text-ink-900" : "text-ink-400"}`}>
                {ORDER_STATUS_LABEL[step]}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
