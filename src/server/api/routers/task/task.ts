import { createTRPCRouter } from "~/server/api/trpc";
import { tasks } from "~/server/db/schema";
import { createTaskInput } from "./inputs/CreateTask.input";
import { privateProcedure } from "../../procedures/privateProcedure";
import { db } from "~/server/db";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";

export const taskRouter = createTRPCRouter({
  create: privateProcedure
    .input(createTaskInput)
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.userId!;

      try {
        await db.insert(tasks).values({
          createdBy: userId,
          title: input.title,
        });

        return {
          success: true,
        };
      } catch (e) {
        console.error("[TASK] create", e);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),

  getAll: privateProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.userId!;

    try {
      const result = await db.query.tasks.findMany({
        where: eq(tasks.createdBy, userId),
      });

      return result;
    } catch (e) {
      console.error("[TASK] getAll", e);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  }),
});
