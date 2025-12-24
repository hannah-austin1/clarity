import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { desc, eq } from "@acme/db";
import { Question, QuestionResponse } from "@acme/db/schema";

import { protectedProcedure, publicProcedure } from "../trpc";

export const questionRouter = {
  // Get all questions
  all: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.Question.findMany({
      orderBy: (fields, { asc }) => [asc(fields.order)],
    });
  }),

  // Get question by ID
  byId: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.Question.findFirst({
        where: eq(Question.id, input.id),
      });
    }),

  // Get questions by category
  byCategory: publicProcedure
    .input(z.object({ category: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.Question.findMany({
        where: eq(Question.category, input.category),
        orderBy: [desc(Question.order)],
      });
    }),

  // Create a new question (admin/protected)
  create: protectedProcedure
    .input(
      z.object({
        text: z.string().min(1),
        options: z.array(z.string()).min(2),
        order: z.number().int().min(0),
        category: z.string().optional(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.insert(Question).values(input).returning();
    }),

  // Update a question
  update: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        text: z.string().min(1).optional(),
        options: z.array(z.string()).min(2).optional(),
        order: z.number().int().min(0).optional(),
        category: z.string().optional(),
      }),
    )
    .mutation(({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.db
        .update(Question)
        .set(data)
        .where(eq(Question.id, id))
        .returning();
    }),

  // Delete a question
  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.delete(Question).where(eq(Question.id, input.id));
    }),

  // Submit a response to a question
  submitResponse: protectedProcedure
    .input(
      z.object({
        questionId: z.string().uuid(),
        response: z.string().min(1),
        responseLabel: z.string().optional(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.insert(QuestionResponse).values({
        ...input,
        userId: ctx.session.user.id,
      });
    }),

  // Get user's responses
  myResponses: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.QuestionResponse.findMany({
      where: eq(QuestionResponse.userId, ctx.session.user.id),
      orderBy: [desc(QuestionResponse.createdAt)],
    });
  }),

  // Get user's responses with question details
  myResponsesWithQuestions: protectedProcedure.query(async ({ ctx }) => {
    const responses = await ctx.db.query.QuestionResponse.findMany({
      where: eq(QuestionResponse.userId, ctx.session.user.id),
      orderBy: [desc(QuestionResponse.createdAt)],
    });

    const questionsMap = new Map();

    // Fetch all related questions
    for (const response of responses) {
      if (!questionsMap.has(response.questionId)) {
        const question = await ctx.db.query.Question.findFirst({
          where: eq(Question.id, response.questionId),
        });
        if (question) {
          questionsMap.set(response.questionId, question);
        }
      }
    }

    return responses.map((response) => ({
      ...response,
      question: questionsMap.get(response.questionId),
    }));
  }),
} satisfies TRPCRouterRecord;
