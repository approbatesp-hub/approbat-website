// src/hooks/usePreviousLocation.js
import { useContext } from "react";

// Custom hook (only exports a function ✅)
export function usePreviousLocation() {
  return useContext(NavigationHistoryContext);
}
