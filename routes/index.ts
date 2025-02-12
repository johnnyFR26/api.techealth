import { FastifyInstance } from 'fastify';
import doctorRoutes from './doctor.route';

/**
 * Registers all application routes with the provided Fastify server instance.
 *
 * @param server - The Fastify server instance to register the routes with.
 * @returns {Promise<void>}
 */
export const registerRoutes = async (server: FastifyInstance) => {
  await server.register(doctorRoutes);

};
