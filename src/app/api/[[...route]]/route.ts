import { Hono } from "hono";
import { handle } from "hono/vercel";
import users from "./users";
import assessments from "./assessments";

export const runtime = "nodejs";

const app = new Hono().basePath("/api");

const routes = app.route("/users", users).route("/assessments", assessments);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;
