import { useAuth } from "~/hooks/use-auth";
import { Navigate } from "react-router";

export default function Index() {
  const { isLoaded, isSignedIn } = useAuth();
  
  if (!isLoaded) {
    return null;
  }
  
  return <Navigate to={isSignedIn ? "/dashboard" : "/sign-in"} replace />;
}