import { TRPCError } from "@trpc/server";
import { t } from "../trpc";


/**
 * Middleware for checking if a user is logged in.
 */
export const loggedInMiddleware = t.middleware(async ({ next, ctx }) => {
  if (!ctx.session.userId) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You have to be logged in to use this action."
    })
  }

  return next()
})
