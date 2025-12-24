import { appRouter, createTRPCContext } from "@acme/api";

import { auth } from "~/auth/server";
import { HomePageClient } from "./_components/home-page-client";

export default async function HomePage() {
  // Create tRPC caller on the server
  const ctx = await createTRPCContext({
    headers: new Headers(),
    auth,
  });
  const caller = appRouter.createCaller(ctx);

  // Fetch questions on the server
  const questions = await caller.question.all();

  return <HomePageClient questions={questions} />;
}
