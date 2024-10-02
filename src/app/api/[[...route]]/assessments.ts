import { Hono } from "hono";
import { prisma } from "@/lib/db";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { auth } from "@/lib/auth";

// Define schema for Question
const questionSchema = z.object({
  questionText: z.string(),
  questionType: z.enum(["MULTIPLE_CHOICE", "TEXT"]),
  options: z.array(z.string()).optional(),
});

// Define schema for Assessment creation
const assessmentSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  questions: z.array(questionSchema).optional(),
});

// Initialize the app
const app = new Hono()

  // Get all assessments for authorized users
  .get("/", async (c) => {
    const user = await auth();
    const isManager = user?.user.role === "MANAGER";

    if (!isManager) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const data = await prisma.assessment.findMany({
      include: {
        user: true,
        questions: true,
        answers: true,
      },
    });

    return c.json({ data });
  })

  // Get only published assessments
  .get("/published", async (c) => {
    const data = await prisma.assessment.findMany({
      where: {
        status: "PUBLISHED",
      },
      include: {
        user: true,
        questions: true,
      },
    });

    return c.json({ data });
  })

  // Create a new assessment with questions
  .post("/", zValidator("json", assessmentSchema), async (c) => {
    try {
      const user = await auth();
      const isManager = user?.user.role === "MANAGER";

      if (!isManager) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const values = await c.req.json();

      const { title, description, questions } = values;
      if (!title || !description || !questions) {
        return c.json({ error: "Please provide all the data" }, 400);
      }

      const newAssessment = await prisma.assessment.create({
        data: {
          title,
          description,
          userId: user.user.id,
          questions: {
            create:
              questions?.map((q: any) => ({
                questionText: q.questionText,
                questionType: q.questionType,
                options: q.options ?? [],
              })) || [],
          },
        },
        include: {
          questions: true,
        },
      });

      return c.json({ newAssessment });
    } catch (error) {
      console.error("Create Assessment Error:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  })

  // Archive an assessment instead of deletion
  .post(
    "/archive/:id",
    zValidator("param", z.object({ id: z.string() })),
    async (c) => {
      const user = await auth();
      const { id } = c.req.valid("param");
      const isAdmin = user?.user.role === "ADMIN";

      if (!id) {
        return c.json({ error: "Missing id" }, 400);
      }

      if (!isAdmin) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const assessment = await prisma.assessment.update({
        where: {
          id,
        },
        data: {
          status: "ARCHIVED", // Mark the assessment as archived
        },
      });

      return c.json({ assessment });
    }
  )

  // Bulk archive assessments
  .post(
    "/bulk-archive",
    zValidator(
      "json",
      z.object({
        ids: z.array(z.string()),
      })
    ),
    async (c) => {
      const user = await auth();
      const isAdmin = user?.user.role === "ADMIN";
      const { ids } = await c.req.json();

      if (!isAdmin) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      if (!Array.isArray(ids) || ids.length === 0) {
        return c.json({ error: "Invalid data" }, 400);
      }

      const data = await prisma.assessment.updateMany({
        where: {
          id: {
            in: ids,
          },
        },
        data: {
          status: "ARCHIVED",
        },
      });

      return c.json({ data });
    }
  );

export default app;
