import { MoneyWorksRESTClient } from "@moneyworks/data";
import {
	type ActionFunctionArgs,
	type LoaderFunctionArgs,
	data as json,
} from "react-router";

export async function loader({ request }: LoaderFunctionArgs) {
	return json({ message: "Use POST method to test MoneyWorks API" });
}

export async function action({ request }: ActionFunctionArgs) {
	const formData = await request.formData();
	const operation = formData.get("operation") as string;
	const table = formData.get("table") as string;
	const options = formData.get("options")
		? JSON.parse(formData.get("options") as string)
		: {};

	console.log("[API MoneyWorks Test] Request:", {
		operation,
		table,
		options,
	});

	try {
		// Use hardcoded connection details for testing
		const client = new MoneyWorksRESTClient({
			host: "localhost",
			port: 6710,
			dataFile: "acme.moneyworks",
			username: "Admin",
			password: "",
			debug: true,
		});

		// Perform the requested operation
		let result;
		switch (operation) {
			case "export":
				console.log("[API MoneyWorks Test] Calling export with:", {
					table,
					options,
				});
				result = await client.export(table, options);
				console.log("[API MoneyWorks Test] Export result:", {
					type: typeof result,
					isArray: Array.isArray(result),
					length: Array.isArray(result) ? result.length : undefined,
					sample:
						Array.isArray(result) && result.length > 0
							? result[0]
							: typeof result === "string"
								? result.substring(0, 200)
								: result,
				});
				break;
			default:
				return json({ error: "Invalid operation" }, { status: 400 });
		}

		return json({ success: true, data: result });
	} catch (error) {
		console.error("MoneyWorks API test error:", error);
		return json(
			{
				error: error instanceof Error ? error.message : "Operation failed",
				details: error,
			},
			{ status: 500 },
		);
	}
}
