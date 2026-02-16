import { httpRouter } from "convex/server";
import { monerooWebhook } from "./webhooks/moneroo";
import { auth } from "./auth";

const http = httpRouter();

http.route({
  path: "/webhooks/moneroo",
  method: "POST",
  handler: monerooWebhook,
});

auth.addHttpRoutes(http);

export default http;
