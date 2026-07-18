import { useState, useEffect, useCallback } from "react";
import { getErrorMessage } from "../utils/formatters";

/**
 * Generic async data-fetching hook.
 *
 * Pass a memoized `fetcher` (e.g. wrapped in `useCallback`) so the hook only
 * re-runs when the actual query inputs change. The hook re-fetches whenever
 * `fetcher`'s identity changes.
 *
 * Backend responses (via sendResponse) are shaped as:
 *   { success, message, data: { foods: [...] } | { staff: [...] } | ..., meta }
 * We unwrap the inner `data` payload here so components can consume it
 * directly (e.g. `data.foods`, `data.staff`) without an extra `.data` hop.
 */
export function useFetch(fetcher, options = {}) {
  const { skip = false, initialData = null } = options;
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(!skip);
  const [error, setError] = useState("");

  const refetch = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetcher();
      // response.data is the full API body { success, message, data, meta }
      // response.data.data is the actual payload the pages care about
      setData(response.data?.data ?? response.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [fetcher]);

  useEffect(() => {
    if (skip) return;
    refetch();
  }, [skip, refetch]);

  return { data, loading, error, refetch, setData };
}