import { useEffect, useState } from "react";

// Hook to skip rendering a component during server-side rendering
export function useSkipSSR() {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  return isMounted;
}