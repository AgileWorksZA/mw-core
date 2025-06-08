"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMockEnvironment = createMockEnvironment;
exports.createMockIDEConfig = createMockIDEConfig;
exports.createVariableContext = createVariableContext;
exports.waitForCondition = waitForCondition;
exports.mockFetch = mockFetch;
/**
 * Test utilities for IDE testing
 */
function createMockEnvironment(overrides) {
    return __assign({ id: "test-env", name: "Test Environment", variables: {}, secrets: {}, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, overrides);
}
function createMockIDEConfig(overrides) {
    return __assign({ activeEnvironment: undefined, globals: {
            variables: {},
            secrets: {}
        }, environments: {}, metadata: {
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            version: "1.0.0"
        } }, overrides);
}
function createVariableContext(globals, envVars, secrets) {
    if (globals === void 0) { globals = {}; }
    if (envVars === void 0) { envVars = {}; }
    if (secrets === void 0) { secrets = {}; }
    return {
        global: {
            variables: globals,
            secrets: {},
        },
        environment: {
            variables: envVars,
            secrets: secrets,
        },
    };
}
function waitForCondition(condition_1) {
    return __awaiter(this, arguments, void 0, function (condition, timeout, interval) {
        var startTime;
        if (timeout === void 0) { timeout = 5000; }
        if (interval === void 0) { interval = 100; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    startTime = Date.now();
                    _a.label = 1;
                case 1:
                    if (!(Date.now() - startTime < timeout)) return [3 /*break*/, 4];
                    return [4 /*yield*/, condition()];
                case 2:
                    if (_a.sent()) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, interval); })];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 1];
                case 4: throw new Error("Condition not met within ".concat(timeout, "ms"));
            }
        });
    });
}
function mockFetch(responses) {
    var _this = this;
    var originalFetch = global.fetch;
    global.fetch = function (url, init) { return __awaiter(_this, void 0, void 0, function () {
        var urlString, response;
        return __generator(this, function (_a) {
            urlString = url.toString();
            response = responses[urlString];
            if (!response) {
                throw new Error("No mock response for ".concat(urlString));
            }
            return [2 /*return*/, new Response(JSON.stringify(response), {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                })];
        });
    }); };
    return function () {
        global.fetch = originalFetch;
    };
}
