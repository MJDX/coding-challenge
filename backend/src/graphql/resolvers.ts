import { PrismaClient, QuestionPage } from '@prisma/client';

const prisma = new PrismaClient();

const resolvers = {
  Query: {
    questionnaire: async (_parent: any, { id }: { id: number }) => {
      return prisma.questionnaire.findUnique({
        where: { id },
        include: {
          questionPages: {
            include: {
              answer: true
            }
          }
        }
      });
    },
    questionnaireByQuestionnaireName: async (_parent: any, { questionnaireName }: { questionnaireName: string }) => {
      return prisma.questionnaire.findUnique({
        where: { questionnaireName },
        include: {
          questionPages: {
            include: {
              answer: true
            }
          }
        }
      });
    },
    questionPagesByQuestionnaireId: async (_parent: any, { questionnaireId }: { questionnaireId: number }) => {
      return prisma.questionPage.findMany({
        where: { questionnaireId },
        include: { questionnaire: true, answer: true },
      });
    },
    questionPageById: async (_parent: any, { id }: { id: number }) => {
      return prisma.questionPage.findUnique({
        where: { id },
        include: { questionnaire: true, answer: true },
      });
    },
    questionPageByPageName: async (_parent: any, { pageName }: { pageName: string }) => {
      return prisma.questionPage.findUnique({
        where: { pageName },
        include: { questionnaire: true, answer: true },
      });
    },
    answerByQuestionPageId: async (_parent: any, { questionPageId }: { questionPageId: number }) => {
      return prisma.answer.findUnique({
        where: { questionPageId },
        include: { questionPage: true },
      });
    },
    answerById: async (_parent: any, { id }: { id: number }) => {
      return prisma.answer.findUnique({
        where: { id },
        include: { questionPage: true },
      });
    },
  },
  Mutation: {
    addQuestionnaire: async (_parent: any, { title, questionnaireName, questionPages, resultPage }: { title: string; questionnaireName: string; questionPages: any[]; resultPage: any }) => {
      return prisma.questionnaire.create({
        data: {
          title: title,
          questionnaireName: questionnaireName,
          questionPages: {
            create: questionPages,
          },
          resultPage: resultPage,
        },
        include: { questionPages: true },
      });
    },
    addAnswer: async (_parent: any, { addAnswerInput }: { addAnswerInput: any }) => {
      const { value, questionPageId } = addAnswerInput;
      return prisma.answer.create({
        data: {
          value,
          questionPage: {
            connect: { id: questionPageId },
          },
        },
        include: { questionPage: true },
      });
    },
    editAnswer: async (_parent: any, { id, editAnswerInput }: { id: number; editAnswerInput: any }) => {
      const { value, questionPageId } = editAnswerInput;
      return prisma.answer.update({
        where: { id },
        data: {
          value,
          questionPage: {
            connect: { id: questionPageId },
          },
        },
        include: { questionPage: true },
      });
    },
    deleteAnswer: async (_parent: any, { id }: { id: number }) => {
      return prisma.answer.delete({
        where: { id },
      });
    },
    deleteAnswersByQuestionnaireId: async (_parent: any, { questionnaireId  }: { questionnaireId : number }) => {
      const questionPages = await prisma.questionPage.findMany({
        where: { questionnaireId },
      });

      const questionPageIds = questionPages.map((page) => page.id);

      const deleteResult = await prisma.answer.deleteMany({
        where: { questionPageId: { in: questionPageIds } },
      });

      return deleteResult.count;
    },
  },
};

export default resolvers;
