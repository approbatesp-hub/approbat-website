import { createContext, useContext, useRef, useEffect } from "react";
import { useLocation } from "react-router"; // ✅ correct import

const LocationContext = createContext(null);

export function LocationProvider({ children }) {
  const location = useLocation();
  const prevLocationRef = useRef(null);

  useEffect(() => {
    prevLocationRef.current = location;
  }, [location]);

  return (
    <LocationContext.Provider value={prevLocationRef.current}>
      {children}
    </LocationContext.Provider>
  );
}

export function usePreviousLocation() {
  return useContext(LocationContext);
}
