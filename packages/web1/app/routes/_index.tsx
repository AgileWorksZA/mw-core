import { useAuth } from "~/hooks/use-auth";
import { Navigate } from "react-router";
import { useEffect, useState } from "react";

export default function Index() {
  const { isLoaded, isSignedIn } = useAuth();
  const [shouldNavigate, setShouldNavigate] = useState(false);
  
  useEffect(() => {
    if (isLoaded) {
      setShouldNavigate(true);
    }
  }, [isLoaded]);
  
  if (!isLoaded || !shouldNavigate) {
    return null;
  }
  
  return <Navigate to={isSignedIn ? "/dashboard" : "/sign-in"} replace />;
}