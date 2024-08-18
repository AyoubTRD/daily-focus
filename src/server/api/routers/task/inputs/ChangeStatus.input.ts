import { z } from "zod";

export const changeStatusInput = z.object({
  id: z.number(),
  isDone: z.boolean(),
});
