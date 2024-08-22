import z from "zod";

export const changeDateInput = z.object({
  taskId: z.number(),
  newDate: z.date(),
});
