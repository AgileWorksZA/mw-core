import { SignIn } from "@clerk/clerk-react";
import { Link } from "react-router";

export default function SignInPage() {
	return (
		<div className="w-full max-w-md space-y-8">
			<div className="text-center">
				<h1 className="text-4xl font-bold tracking-tight">
					MoneyWorks Connect
				</h1>
				<p className="mt-2 text-muted-foreground">
					Sign in to access your MoneyWorks data
				</p>
			</div>

			<SignIn
				appearance={{
					elements: {
						rootBox: "mx-auto",
						card: "shadow-none border rounded-lg",
					},
				}}
				redirectUrl="/dashboard"
				signUpUrl="/sign-up"
			/>

			<div className="text-center text-sm text-muted-foreground">
				Don't have an account?{" "}
				<Link
					to="/sign-up"
					className="font-medium text-primary hover:underline"
				>
					Sign up
				</Link>
			</div>
		</div>
	);
}
