import { z } from "zod";

export const getTasksInput = z.object({
  startDate: z.date(),
  endDate: z.date(),
});
