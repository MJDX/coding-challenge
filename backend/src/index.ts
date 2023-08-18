import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import dotenv from 'dotenv';
import typeDefs from './graphql/typedefs';
import resolvers from './graphql/resolvers';
import jwt, { JwtPayload } from 'jsonwebtoken';

dotenv.config();

async function main() {
  const app = express();
  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  await server.start();

  app.use(cors());
  app.use(helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        imgSrc: [`'self'`, 'data:', 'apollo-server-landing-page.cdn.apollographql.com'],
        scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
        manifestSrc: [`'self'`, 'apollo-server-landing-page.cdn.apollographql.com'],
        frameSrc: [`'self'`, 'sandbox.embed.apollographql.com'],
      },
    },
  }));

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200, // Limit each IP to 200 requests per windowMs
  });
  app.use(limiter);

  app.use(bodyParser.json());

  app.use(
    expressMiddleware(server, {
      context: async ({ req }) => {

        const isRefreshTokenRequest = req.body.operationName === 'RefreshToken';
        if (isRefreshTokenRequest) {
          return {}; 
        }

        const accessToken = req.headers.authorization?.replace("Bearer ", "") || '';
        const accessSecretKey = process.env.ACCESS_SECRET_KEY;
        if (!accessSecretKey) {
          return {};
        }
        try {
          const decodedToken = jwt.verify(accessToken, accessSecretKey) as JwtPayload;
          const userId = decodedToken.userId;
          return { user: { userId } };
        } catch (error) {
          // console.error(error)
          if (error instanceof jwt.TokenExpiredError) {
            // throw new Error('Token has expired');
            // res.status(401).json({ code: 'TOKEN_EXPIRED',message: 'Token has expired' });
            throw new Error('TOKEN_EXPIRED');
          }
          return {};
        }
      },
    }),
  );
  await new Promise((resolve) =>
    httpServer.listen({ port: process.env.PORT || 4000 }, () => {
      resolve(undefined);
    }),
  );
  console.log(`🚀 Server ready at http://localhost:${process.env.PORT || 4000}`);
}

main();
