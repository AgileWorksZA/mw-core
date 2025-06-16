/**
 * REST Client Tests
 *
 * Basic tests for the MoneyWorks REST client.
 */

import { describe, expect, test } from "bun:test";
import { buildAuthHeaders, buildRESTUrl, validateConfig } from "./auth";
import { MoneyWorksRESTClient } from "./client";
import type { MoneyWorksConfig } from "./types";

describe("MoneyWorks REST Client", () => {
  const testConfig: MoneyWorksConfig = {
    host: "localhost",
    port: 6710,
    dataFile: "test.moneyworks",
    username: "testuser",
    password: "testpass",
  };

  describe("Authentication", () => {
    test("builds basic auth headers", () => {
      const headers = buildAuthHeaders(testConfig);

      expect(headers.Authorization).toBe("Basic dGVzdHVzZXI6dGVzdHBhc3M=");
      expect(headers["Authorization-Folder"]).toBeUndefined();
    });

    test("builds two-level auth headers", () => {
      const configWithFolder: MoneyWorksConfig = {
        ...testConfig,
        folderName: "folder",
        folderPassword: "folderpass",
      };

      const headers = buildAuthHeaders(configWithFolder);

      expect(headers.Authorization).toBe("Basic dGVzdHVzZXI6dGVzdHBhc3M=");
      expect(headers["Authorization-Folder"]).toBe(
        "Basic Zm9sZGVyOmZvbGRlcnBhc3M=",
      );
    });
  });

  describe("URL Building", () => {
    test("builds REST URL without params", () => {
      const url = buildRESTUrl(testConfig, "/export");

      expect(url).toBe(
        "http://localhost:6710/REST/testuser:testpass@test.moneyworks/export",
      );
    });

    test("builds REST URL with params", () => {
      const params = new URLSearchParams({
        table: "Name",
        format: "xml-verbose",
      });

      const url = buildRESTUrl(testConfig, "/export", params);

      expect(url).toBe(
        "http://localhost:6710/REST/testuser:testpass@test.moneyworks/export?table=Name&format=xml-verbose",
      );
    });

    test("builds HTTPS URL when SSL enabled", () => {
      const sslConfig: MoneyWorksConfig = {
        ...testConfig,
        useSSL: true,
      };

      const url = buildRESTUrl(sslConfig, "/export");

      expect(url).toStartWith("https://");
    });
  });

  describe("Config Validation", () => {
    test("validates required fields", () => {
      expect(() => validateConfig(testConfig)).not.toThrow();
    });

    test("throws on missing required field", () => {
      const invalidConfig = { ...testConfig };
      (invalidConfig as Partial<MoneyWorksConfig>).username = undefined;

      expect(() => validateConfig(invalidConfig as MoneyWorksConfig)).toThrow(
        "Missing required configuration field: username",
      );
    });

    test("validates port range", () => {
      const invalidPort = { ...testConfig, port: 99999 };

      expect(() => validateConfig(invalidPort)).toThrow("Invalid port number");
    });

    test("validates data file extension", () => {
      const invalidFile = { ...testConfig, dataFile: "test.txt" };

      expect(() => validateConfig(invalidFile)).toThrow(
        "Invalid data file extension",
      );
    });

    test("validates folder auth completeness", () => {
      const incompleteFolder = { ...testConfig, folderName: "folder" };

      expect(() => validateConfig(incompleteFolder)).toThrow(
        "Folder name provided without folder password",
      );
    });
  });

  describe("Client Creation", () => {
    test("creates client with valid config", () => {
      expect(() => new MoneyWorksRESTClient(testConfig)).not.toThrow();
    });

    test("merges default config", () => {
      const minimalConfig: MoneyWorksConfig = {
        host: "localhost",
        port: 6710,
        dataFile: "test.moneyworks",
        username: "user",
        password: "pass",
      };

      const client = new MoneyWorksRESTClient(minimalConfig);
      // Client should have default timeout, SSL, etc.
      expect(client).toBeDefined();
    });
  });
});
