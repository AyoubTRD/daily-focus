import { z } from "zod";

export const createTaskInput = z.object({
  title: z.string().min(1),
})

export type CreateTaskInput = z.infer<typeof createTaskInput>;

