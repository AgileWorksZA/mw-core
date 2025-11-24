import { SignUp } from "@clerk/clerk-react";
import { Link } from "react-router";

export default function SignUpPage() {
	return (
		<div className="w-full max-w-md space-y-8">
			<div className="text-center">
				<h1 className="text-4xl font-bold tracking-tight">Create an Account</h1>
				<p className="mt-2 text-muted-foreground">
					Get started with MoneyWorks Connect
				</p>
			</div>

			<SignUp
				appearance={{
					elements: {
						rootBox: "mx-auto",
						card: "shadow-none border rounded-lg",
					},
				}}
				redirectUrl="/onboarding"
				signInUrl="/sign-in"
			/>

			<div className="text-center text-sm text-muted-foreground">
				Already have an account?{" "}
				<Link
					to="/sign-in"
					className="font-medium text-primary hover:underline"
				>
					Sign in
				</Link>
			</div>
		</div>
	);
}
