import { z } from "zod";

export const createTaskInput = z.object({
  title: z.string().min(1),
  status: z.string(),
  date: z.date().default(new Date()),
});
