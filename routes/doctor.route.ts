import { FastifyInstance } from 'fastify';
import { DoctorController } from '../controllers/doctor.controller';

const controller = new DoctorController();


/**
 * Registers doctor routes with the given server.
 *
 * @param server - The server to register the routes with.
 * @memberof module:routes
 * 
 */
export default async function doctorRoutes(server: FastifyInstance) {
  server.get('/doctors', controller.getAllDoctors);
  server.get('/doctors/:id', controller.getDoctorById);
  server.post('/doctors', controller.createDoctor);
  server.put('/doctors/:id', controller.updateDoctor);
  server.delete('/doctors/:id', controller.deleteDoctor);
}
