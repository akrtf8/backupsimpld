import React, { useState, useEffect, useCallback } from "react";

export function useSelection(keys = []) {
  const [selected, setSelected] = useState(new Set());

  // Reset selection when keys change
  useEffect(() => {
    setSelected(new Set());
  }, [keys]);

  const deselectAll = useCallback(() => {
    setSelected(new Set());
  }, []);

  const deselectOne = useCallback((key) => {
    setSelected((prev) => {
      const copy = new Set(prev);
      copy.delete(key);
      return copy;
    });
  }, []);

  const selectAll = useCallback(() => {
    setSelected(new Set(keys));
  }, [keys]);

  const selectOne = useCallback((key) => {
    setSelected((prev) => {
      const copy = new Set(prev);
      copy.add(key);
      return copy;
    });
  }, []);

  const selectedAny = selected.size > 0;
  const selectedAll = selected.size === keys.length;

  return {
    deselectAll,
    deselectOne,
    selectAll,
    selectOne,
    selected,
    selectedAny,
    selectedAll,
  };
}
