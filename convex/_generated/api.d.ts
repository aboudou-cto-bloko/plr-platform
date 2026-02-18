/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as admin from "../admin.js";
import type * as affiliates from "../affiliates.js";
import type * as auth from "../auth.js";
import type * as constants from "../constants.js";
import type * as crons from "../crons.js";
import type * as downloads from "../downloads.js";
import type * as http from "../http.js";
import type * as onboarding from "../onboarding.js";
import type * as payments from "../payments.js";
import type * as products from "../products.js";
import type * as renewal from "../renewal.js";
import type * as renewalCron from "../renewalCron.js";
import type * as security from "../security.js";
import type * as seed from "../seed.js";
import type * as subscriptions from "../subscriptions.js";
import type * as users from "../users.js";
import type * as webhooks_moneroo from "../webhooks/moneroo.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  admin: typeof admin;
  affiliates: typeof affiliates;
  auth: typeof auth;
  constants: typeof constants;
  crons: typeof crons;
  downloads: typeof downloads;
  http: typeof http;
  onboarding: typeof onboarding;
  payments: typeof payments;
  products: typeof products;
  renewal: typeof renewal;
  renewalCron: typeof renewalCron;
  security: typeof security;
  seed: typeof seed;
  subscriptions: typeof subscriptions;
  users: typeof users;
  "webhooks/moneroo": typeof webhooks_moneroo;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
