import { Prisma, PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import typeDefs from './typedefs';

const prisma = new PrismaClient();

interface Context {
  user?: { userId: number };
}

interface RegisterUserArgs {
  username: string;
  email: string;
  password: string;
}

interface ConnectUserArgs {
  username: string;
  password: string;
}

interface CreateSessionArgs {
  userId: number;
  title: string;
  questionnaireId: number;
}

interface AddOrUpdateAnswerArgs {
  id?: number;
  questionnaireUserSessionId: number;
  questionPageId: number;
  value: string;
}

interface SetSessionSharableArgs {
  questionnaireUserSessionId: number;
  sharable: boolean;
}

interface RefreshTokenArgs {
  refreshToken: string;
}

const resolvers = {
  Query: {
    questionnaires: async () => {
      return await prisma.questionnaire.findMany();
    },
    questionnaireUserSessionsByUser: async (
      _: any,
      { questionnaireId, userId }: { questionnaireId: number; userId: number },
    ) => {
      const where = {
        questionnaireId,
        userId,
      };
      return await prisma.questionnaireUserSession.findMany({
        where,
        include: {
          questionnaire: true,
          user: true,
        }
      });
    },
    sharableQuestionnaireUserSessions: async (
      _: any,
      { questionnaireId }: { questionnaireId: number },
    ) => {
      const where = {
        questionnaireId,
        sharable: true,
      };
      return await prisma.questionnaireUserSession.findMany({ where });
    },
    sharableQuestionnaireUserSessionsWithoutUserOwnedOnes: async (
      _: any,
      { questionnaireId, userId }: { questionnaireId: number, userId: number },
    ) => {
      const sharableSessions = await prisma.questionnaireUserSession.findMany({
        where: {
          questionnaireId,
          userId: { not: userId },
          sharable: true
        },
        include: {
          questionnaire: true,
          user: true,
        }
      });
      return sharableSessions;
    },
    getFullQuestionnaireUserSession: async (
      _: any,
      { questionnaireUserSessionId }: { questionnaireUserSessionId: number },
    ) => {
      return await prisma.questionnaireUserSession.findUnique({
        where: { id: questionnaireUserSessionId },
        include: {
          user: true,
          questionnaire: {
            include: {
              questionPages: true
            }
          },
          questionnaireUserSessionAnswers: {
            include: {
              questionPage: true
            }
          },
        },
      });
    },
  },
  Mutation: {
    refreshToken: async (_: any, args: RefreshTokenArgs) => {
      try {

        const accessSecretKey = process.env.ACCESS_SECRET_KEY;
        const refreshSecretKey = process.env.REFRESH_SECRET_KEY;

        if (!accessSecretKey) {
          throw new Error('Missing ACCESS_SECRET_KEY in environment variables');
        }

        if (!refreshSecretKey) {
          throw new Error('Missing REFRESH_SECRET_KEY in environment variables');
        }

        const decoded = jwt.verify(args.refreshToken, refreshSecretKey) as JwtPayload;
        const userId = decoded.userId;
        const user = await prisma.user.findUnique({ where: { id: userId } });

        if (!user) {
          throw new Error('User not found');
        }

        const accessToken = jwt.sign({ userId: user.id, userEmail: user.email }, accessSecretKey, {
          expiresIn: '1d'
        });

        return { accessToken };
      } catch (error) {
        throw new Error('Invalid refresh token');
      }
    },
    registerUser: async (_: any, args: RegisterUserArgs) => {

      const accessSecretKey = process.env.ACCESS_SECRET_KEY;
      const refreshSecretKey = process.env.REFRESH_SECRET_KEY;

      if (!accessSecretKey) {
        throw new Error('Missing ACCESS_SECRET_KEY in environment variables');
      }

      if (!refreshSecretKey) {
        throw new Error('Missing REFRESH_SECRET_KEY in environment variables');
      }

      const hashedPassword = await bcrypt.hash(args.password, 10);
      const user = await prisma.user.create({
        data: {
          username: args.username,
          email: args.email,
          password: hashedPassword,
        },
      });

      // Generate access token
      const accessToken = jwt.sign({ userId: user.id, userEmail: user.email }, accessSecretKey, {
        expiresIn: '1d'
      });

      // Generate refresh token
      const refreshToken = jwt.sign({ userId: user.id, userEmail: user.email }, refreshSecretKey, {
        expiresIn: '7d'
      });

      return {
        id: user.id,
        username: user.username,
        email: user.email,
        accessToken: accessToken,
        refreshToken: refreshToken
      };
    },
    connectUser: async (_: any, args: ConnectUserArgs) => {

      const accessSecretKey = process.env.ACCESS_SECRET_KEY;
      const refreshSecretKey = process.env.REFRESH_SECRET_KEY;

      if (!accessSecretKey) {
        throw new Error('Missing ACCESS_SECRET_KEY in environment variables');
      }

      if (!refreshSecretKey) {
        throw new Error('Missing REFRESH_SECRET_KEY in environment variables');
      }

      const user = await prisma.user.findUnique({
        where: { username: args.username },
      });

      if (!user) {
        throw new Error('User not found');
      }

      const passwordMatches = await bcrypt.compare(args.password, user.password);
      if (!passwordMatches) {
        throw new Error('Invalid password');
      }

      // Generate access token
      const accessToken = jwt.sign({ userId: user.id, userEmail: user.email }, accessSecretKey, {
        expiresIn: '1d'
      });

      // Generate refresh token
      const refreshToken = jwt.sign({ userId: user.id, userEmail: user.email }, refreshSecretKey, {
        expiresIn: '7d'
      });

      return {
        id: user.id,
        username: user.username,
        email: user.email,
        accessToken: accessToken,
        refreshToken: refreshToken
      };
    },
    createQuestionnaireUserSession: async (_: any, args: CreateSessionArgs, { user }: Context) => {
      if (!user) {
        throw new Error('User not authenticated');
      }

      const session = await prisma.questionnaireUserSession.create({
        data: {
          title: args.title,
          userId: args.userId,
          sharable: false,
          questionnaireId: args.questionnaireId
        },
      });

      return session;
    },
    addOrUpdateAnswer: async (_: any, args: AddOrUpdateAnswerArgs, { user }: Context) => {
      if (!user) {
        throw new Error('User not authenticated');
      }

      let sessionAnswer;

      if (args.id === undefined || args.id === null) {
        // No ID provided, create a new answer
        const createData = {
          questionnaireUserSessionId: args.questionnaireUserSessionId,
          questionPageId: args.questionPageId,
          value: args.value,
        };

        sessionAnswer = await prisma.questionnaireUserSessionAnswer.create({
          data: createData,
          include: {
            questionPage: true
          }
        });
      } else {
        // ID provided, update existing answer
        const updateData = {
          value: args.value,
        };

        sessionAnswer = await prisma.questionnaireUserSessionAnswer.update({
          where: { id: args.id },
          data: updateData,
          include: {
            questionPage: true
          }
        });
      }

      return sessionAnswer;
    },

    setSessionSharable: async (_: any, args: SetSessionSharableArgs, { user }: Context) => {
      if (!user) {
        throw new Error('User not authenticated');
      }

      const updatedSession = await prisma.questionnaireUserSession.update({
        where: { id: args.questionnaireUserSessionId },
        data: { sharable: args.sharable },
      });

      return updatedSession;
    },
    removeQuestionnaireUserSessionAnswer: async (_: any, { id }: { id: number }) => {
      try {
        const removedAnswer = await prisma.questionnaireUserSessionAnswer.delete({
          where: { id },
        });
        return removedAnswer;
      } catch (error) {
        throw new Error(`Error removing answer with ID ${id}: ${error}`);
      }
    },

    removeQuestionnaireUserSessionAnswersBySessionId: async (_: any, { questionnaireUserSessionId }: { questionnaireUserSessionId: number }) => {
      try {
        const response = await prisma.questionnaireUserSessionAnswer.deleteMany({
          where: { questionnaireUserSessionId: questionnaireUserSessionId },
        });
        return response.count;
      } catch (error) {
        throw new Error(`Error removing answers for session ID ${questionnaireUserSessionId}: ${error}`);
      }
    },
  },
};

export default resolvers;
