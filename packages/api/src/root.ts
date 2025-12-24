import { authRouter } from "./router/auth";
import { postRouter } from "./router/post";
import { questionRouter } from "./router/question";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  post: postRouter,
  question: questionRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
