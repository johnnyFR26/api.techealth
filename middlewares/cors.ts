import { FastifyPluginAsync } from 'fastify';
import fastifyCors from '@fastify/cors';

const corsMiddleware: FastifyPluginAsync = async (server) => {
  server.register(fastifyCors, {
    origin: '*',
  });
};

export default corsMiddleware;
