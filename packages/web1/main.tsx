import React from "react";
import ReactDOM from "react-dom/client";

function App() {
	const [apiStatus, setApiStatus] = React.useState("checking...");
	const [taxRates, setTaxRates] = React.useState<any[]>([]);

	React.useEffect(() => {
		// Check API
		fetch("http://localhost:3000/api/v1/health")
			.then((res) => res.json())
			.then(() => {
				setApiStatus("✅ Connected");
				// Load tax rates
				return fetch("http://localhost:3000/api/v1/tables/TaxRate");
			})
			.then((res) => res.json())
			.then((data) => {
				setTaxRates(data.data || []);
			})
			.catch(() => setApiStatus("❌ Failed"));
	}, []);

	return (
		<div style={{ padding: "20px", fontFamily: "system-ui" }}>
			<h1>MoneyWorks Web1</h1>
			<p>API Status: {apiStatus}</p>

			<h2>Tax Rates</h2>
			<table style={{ borderCollapse: "collapse", width: "100%" }}>
				<thead>
					<tr>
						<th style={{ border: "1px solid #ddd", padding: "8px" }}>Code</th>
						<th style={{ border: "1px solid #ddd", padding: "8px" }}>
							Description
						</th>
						<th style={{ border: "1px solid #ddd", padding: "8px" }}>Rate</th>
					</tr>
				</thead>
				<tbody>
					{taxRates.map((rate) => (
						<tr key={rate.TaxCode}>
							<td style={{ border: "1px solid #ddd", padding: "8px" }}>
								{rate.TaxCode}
							</td>
							<td style={{ border: "1px solid #ddd", padding: "8px" }}>
								{rate.Ratename}
							</td>
							<td style={{ border: "1px solid #ddd", padding: "8px" }}>
								{rate.Rate1}%
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
