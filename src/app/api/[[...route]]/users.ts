import { Hono } from "hono";
import { prisma } from "@/lib/db";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { auth } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { User } from "@prisma/client";
import { UsersRound } from "lucide-react";

const userSchema = z.object({
  name: z.string(),
  householdNumber: z.string(),
});

const usersSchema = z.array(userSchema);

const app = new Hono()
  .get("/", async (c) => {
    const user = await auth();
    const isAdmin = user?.user.role === "ADMIN";

    if (!isAdmin) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const data = await prisma.user.findMany({
      where: {
        role: "USER",
        NOT: {
          isArchived: true,
        },
      },
    });

    return c.json({ data });
  })
  .get("/archived", async (c) => {
    const user = await auth();
    const isAdmin = user?.user.role === "ADMIN";

    if (!isAdmin) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const data = await prisma.user.findMany({
      where: {
        role: "USER",
        isArchived: true,
      },
    });

    return c.json({ data });
  })
  .post("/", zValidator("json", usersSchema), async (c) => {
    try {
      const admin = await auth();
      const isAdmin = admin?.user.role === "ADMIN";

      if (!isAdmin) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const values = await c.req.json();

      // Validate that values is an array
      if (!Array.isArray(values) || values.length === 0) {
        return c.json({ error: "Invalid data" }, 400); // Respond with bad request
      }

      const hashedPassword = await bcrypt.hash("!def@ult", 12);

      // Extract householdNumbers from the incoming data
      const householdNumbers = values.map((user: User) => user.householdNumber);

      // Query existing users with the same householdNumbers
      const existingUsers = await prisma.user.findMany({
        where: {
          householdNumber: {
            in: householdNumbers,
          },
        },
        select: {
          householdNumber: true,
        },
      });

      const existingHouseholdNumbers = new Set(
        existingUsers.map((user) => user.householdNumber)
      );

      // Filter out users that already exist in the database
      const newUsers = values.filter(
        (user: User) => !existingHouseholdNumbers.has(user.householdNumber)
      );

      // Prepare users for creation with hashed passwords
      const usersWithHashedPassword = newUsers.map((user: User) => ({
        ...user,
        password: hashedPassword,
      }));

      // Create new users in the database
      const response = await prisma.user.createMany({
        data: usersWithHashedPassword,
      });

      return c.json({ response });
    } catch (error) {
      console.error("Bulk Create Error:", error); // Log error for debugging
      return c.json({ error: "Internal server error" }, 500);
    }
  })
  .post(
    "/bulk-delete",
    zValidator(
      "json",
      z.object({
        ids: z.array(z.string()),
      })
    ),
    async (c) => {
      const admin = await auth();
      const isAdmin = admin?.user.role === "ADMIN";
      const { ids } = await c.req.json();

      if (!admin || !isAdmin) {
        return c.json({ error: "Unathorized" }, 401);
      }

      // Validate that values is an array and contains valid IDs
      if (!Array.isArray(ids) || ids.length === 0) {
        return c.json({ error: "Invalid data" }, 400); // Respond with bad request
      }

      console.log(ids);

      const data = await prisma.user.deleteMany({
        where: {
          id: {
            in: ids,
          },
        },
      });

      return c.json({ data });
    }
  )
  .post(
    "/:id",
    zValidator("param", z.object({ id: z.string().optional() })),
    async (c) => {
      const user = await auth();
      const { id } = c.req.valid("param");
      const isAdmin = user?.user.role === "ADMIN";

      if (!id) {
        return c.json({ error: "Missing id" }, 400);
      }

      if (!isAdmin || !user) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const data = await prisma.user.update({
        where: {
          id,
        },
        data: {
          isArchived: true,
        },
      });

      if (!data) {
        return c.json({ error: "Not found" }, 404);
      }

      return c.json({ data });
    }
  )
  .post(
    "/unarchive/:id",
    zValidator("param", z.object({ id: z.string().optional() })),
    async (c) => {
      const user = await auth();
      const { id } = c.req.valid("param");
      const isAdmin = user?.user.role === "ADMIN";

      if (!id) {
        return c.json({ error: "Missing id" }, 400);
      }

      if (!isAdmin || !user) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const data = await prisma.user.update({
        where: {
          id,
        },
        data: {
          isArchived: false,
        },
      });

      if (!data) {
        return c.json({ error: "Not found" }, 404);
      }

      return c.json({ data });
    }
  );

export default app;
