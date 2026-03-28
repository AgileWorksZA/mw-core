/**
 * Authentication Routes
 *
 * Exchange MoneyWorks credentials for API tokens
 */

import {
	CompanyInformationRepository,
	createSmartClient,
} from "@moneyworks/data";
import type { MoneyWorksConfig } from "@moneyworks/data";
import { Elysia, t } from "elysia";
import { connectionService } from "../services/connection-service";

// Token schema
const TokenRequestSchema = t.Object({
	host: t.String(),
	port: t.Number({ default: 6710 }),
	dataFile: t.String(),
	username: t.String(),
	password: t.String(),
	folderName: t.Optional(t.String()),
	folderPassword: t.Optional(t.String()),
	description: t.Optional(t.String()),
});

const RefreshTokenSchema = t.Object({
	refreshToken: t.String(),
});

export function createAuthRoutes() {
	return new Elysia({ prefix: "/auth" })
		.post(
			"/token",
			async ({ body, set }) => {
				try {
					// Test the connection first
					const proxyBaseUrl = process.env["MW_PROXY_BASE_URL"];
					const config: MoneyWorksConfig = {
						host: body.host,
						port: body.port,
						dataFile: body.dataFile,
						username: body.username,
						password: body.password,
						...(proxyBaseUrl ? { proxyBaseUrl } : {}),
					};

					if (body.folderName && body.folderPassword) {
						config.folderAuth = {
							folderName: body.folderName,
							folderPassword: body.folderPassword,
						};
					}

					// Test connection
					const client = createSmartClient(config);
					const isConnected = await client.testConnection();

					if (!isConnected) {
						set.status = 401;
						return {
							error: "Invalid MoneyWorks credentials",
							code: "INVALID_CREDENTIALS",
						};
					}

					// Get company info for the connection
					const companyRepo = new CompanyInformationRepository(client);
					const companyInfo = await companyRepo.getCompanyInformation(["Name"]);

					// Store connection and get tokens
					const { accessToken, refreshToken, connectionId } =
						await connectionService.createConnection({
							...config,
							description:
								body.description ||
								`${companyInfo.Name || body.dataFile} - ${body.dataFile}`,
						});

					return {
						accessToken,
						refreshToken,
						connectionId,
						company: {
							name: companyInfo.Name || body.dataFile,
							dataFile: body.dataFile,
						},
					};
				} catch (error) {
					console.error("Token exchange error:", error);
					set.status = 500;
					return {
						error: "Failed to create connection",
						code: "CONNECTION_ERROR",
					};
				}
			},
			{
				body: TokenRequestSchema,
			},
		)
		.post(
			"/refresh",
			async ({ body, set }) => {
				try {
					const result = await connectionService.refreshToken(
						body.refreshToken,
					);

					if (!result) {
						set.status = 401;
						return {
							error: "Invalid refresh token",
							code: "INVALID_REFRESH_TOKEN",
						};
					}

					return result;
				} catch (error) {
					console.error("Token refresh error:", error);
					set.status = 500;
					return {
						error: "Failed to refresh token",
						code: "REFRESH_ERROR",
					};
				}
			},
			{
				body: RefreshTokenSchema,
			},
		)
		.delete("/token/:connectionId", async ({ params, headers, set }) => {
			try {
				// Extract token from header
				const authHeader = headers.authorization;
				if (!authHeader?.startsWith("Bearer ")) {
					set.status = 401;
					return { error: "Missing authorization header" };
				}

				const token = authHeader.substring(7);
				const success = await connectionService.deleteConnection(
					params.connectionId,
					token,
				);

				if (!success) {
					set.status = 404;
					return { error: "Connection not found" };
				}

				return { success: true };
			} catch (error) {
				console.error("Delete connection error:", error);
				set.status = 500;
				return { error: "Failed to delete connection" };
			}
		});
}
