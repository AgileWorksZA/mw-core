import { useEffect, useState } from "react";
import { Navigate } from "react-router";
import { useAuth } from "~/hooks/use-auth";

export default function Index() {
	const { isLoaded, isSignedIn } = useAuth();
	const [shouldNavigate, setShouldNavigate] = useState(false);
	const [checkedAuth, setCheckedAuth] = useState(false);

	useEffect(() => {
		if (isLoaded && !checkedAuth) {
			// Add a small delay to ensure Clerk has fully initialized
			setTimeout(() => {
				setCheckedAuth(true);
				setShouldNavigate(true);
			}, 100);
		}
	}, [isLoaded, checkedAuth]);

	// Show loading state while Clerk is initializing
	if (!isLoaded || !shouldNavigate) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-semibold">Loading MoneyWorks...</h1>
				</div>
			</div>
		);
	}

	// ALWAYS redirect unauthenticated users to welcome/sign-in
	if (!isSignedIn) {
		// Use welcome page as the landing page for all unauthenticated users
		return <Navigate to="/welcome" replace />;
	}

	// Only redirect authenticated users to dashboard
	return <Navigate to="/dashboard" replace />;
}
