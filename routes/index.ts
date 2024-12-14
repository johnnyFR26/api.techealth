import { FastifyInstance } from 'fastify';
import doctorRoutes from './doctor.route';

export const registerRoutes = async (server: FastifyInstance) => {
  await server.register(doctorRoutes);

};
