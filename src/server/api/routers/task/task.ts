import { createTRPCRouter } from "~/server/api/trpc";
import { tasks } from "~/server/db/schema";
import { createTaskInput } from "./inputs/CreateTask.input";
import { privateProcedure } from "../../procedures/privateProcedure";
import { db } from "~/server/db";
import { TRPCError } from "@trpc/server";
import { and, eq, gte, lt } from "drizzle-orm";
import { changeStatusInput } from "./inputs/ChangeStatus.input";
import { getTasksInput } from "./inputs/GetTasks.input";

export const taskRouter = createTRPCRouter({
  create: privateProcedure
    .input(createTaskInput)
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.userId!;

      try {
        await db.insert(tasks).values({
          createdBy: userId,
          title: input.title,
          status: input.status,
          date: input.date,
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

  getAll: privateProcedure
    .input(getTasksInput)
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.userId!;

      try {
        const result = await db.query.tasks.findMany({
          where: and(
            eq(tasks.createdBy, userId),
            gte(tasks.date, input.startDate),
            lt(tasks.date, input.endDate),
          ),
        });

        return result;
      } catch (e) {
        console.error("[TASK] getAll", e);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),

  changeStatus: privateProcedure
    .input(changeStatusInput)
    .mutation(async ({ ctx, input }) => {
      const task = await db.query.tasks.findFirst({
        where: eq(tasks.id, input.id),
      });

      if (task?.createdBy !== ctx.session.userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You can only change your own tasks.",
        });
      }

      try {
        await db
          .update(tasks)
          .set({ isDone: input.isDone })
          .where(eq(tasks.id, input.id));
        return {
          success: true,
        };
      } catch (e) {
        console.error("[TASK] changeStatus", e);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
});
