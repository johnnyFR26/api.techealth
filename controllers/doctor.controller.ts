import { FastifyRequest, FastifyReply } from 'fastify';
import { Readable } from 'stream';
import { db } from '../lib/db';
import { z } from 'zod';

  const doctorParamsSchema = z.object({
    id: z.string().regex(/^\d+$/, "ID deve ser um número válido"),
  });

  const createDoctorSchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters long'),
    crm: z.string().startsWith('CRM-'),
    specialty: z.string().min(3, 'Specialty must be at least 3 characters long'),
    phone: z.string().optional(),
    email: z.string().email(),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    hireDate: z.string().nullable()
  })

  const updateDoctorSchema = createDoctorSchema.partial()

  /**
   * Controller for managing doctors.
   * 
   * @class
   * @memberof module:controllers
   * @name DoctorController
   * @property {function} getAllDoctors - Fetches all doctors.
   * @property {function} getDoctorById - Fetches a doctor by ID.
   * @property {function} createDoctor - Creates a new doctor.
   * @property {function} updateDoctor - Updates a doctor by ID.
   */
export class DoctorController {

  /**
   * Fetches all doctors.
   *
   * @function
   * @memberof module:controllers.DoctorController
   * @param {FastifyRequest} request - The request with the doctor data to create.
   * @param {FastifyReply} reply - The response to send back to the client.
   *
   * @example
   * curl -X GET 'http://localhost:3000/doctors'
   *
   * @throws {Error} - If the request body is invalid.
   * @throws {Error} - If the doctor cannot be created.
   */
    async getAllDoctors(request: FastifyRequest, reply: FastifyReply) {
    try {
      const doctors = await db.doctor.findMany();
      reply.type('application/json').send(doctors);
    } catch (error) {
      reply.status(500).send({ error: 'Error fetching doctors' });
    }
  }

  

  /**
   * Fetches a doctor by ID.
   *
   * @function
   * @memberof module:controllers.DoctorController
   * @param {FastifyRequest} request - The request with the doctor ID to fetch.
   * @param {FastifyReply} reply - The response to send back to the client.
   *
   * @example
   * curl -X GET 'http://localhost:3000/doctors/1'
   *
   * @throws {Error} - If the request body is invalid.
   * @throws {Error} - If the doctor cannot be found.
   */
  async getDoctorById(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const validation = doctorParamsSchema.safeParse(request.params)

    if(!validation.success) {
      reply.status(400).send({ error: validation.error.format() })
    }
    const id = validation.data;

    try {
      const doctor = await db.doctor.findUnique({ where: { id: Number(id) } });

      if (!doctor) {
        reply.status(404).send({ error: 'Doctor not found' });
        return;
      }

      reply.type('application/json').send(doctor)
    } catch (error) {
      reply.status(500).send({ error: 'Error fetching doctor' });
    }
  }



  /**
   * Creates a new doctor.
   *
   * @param request - The request with the doctor data to create.
   * @param reply - The response to send back to the client.
   *
   * @example
   * curl -X POST 'http://localhost:3000/doctors' \
   *   -H 'Content-Type: application/json' \
   *   -d '{"name": "John Doe", "crm": "CRM-123", "specialty": "Cardiologist", "phone": "+55 12 3456 7890", "email": "john.doe@example.com", "password": "123456", "hireDate": "2022-01-01"}'
   *
   * @throws {Error} - If the request body is invalid.
   * @throws {Error} - If the doctor cannot be created.
   */
  async createDoctor(request: FastifyRequest<{ Body: { name: string; crm: string; specialty: string; phone?: string; email?: string; password?: string; hireDate?: Date } }>, reply: FastifyReply) {
    const validation = createDoctorSchema.safeParse(request.body)

    if(!validation.success) {
      reply.status(400).send({ error: validation.error.format() })
    }

    const data = validation.data

    try {
      const doctor = await db.doctor.create({
        //@ts-expect-error
        data
      });

      const stream = Readable.from(JSON.stringify(doctor));
      reply.status(201).type('application/json').send(data);
    } catch (error) {
      reply.status(500).send({ error: 'Error creating doctor', details: error });
    }
  }



  /**
   * Updates a doctor by ID.
   *
   * @param request - The request containing the doctor ID to update and the new data.
   * @param reply - The response to send back to the client.
   *
   * @example
   * curl -X PUT 'http://localhost:3000/doctors/1' \
   *   -H 'Content-Type: application/json' \
   *   -d '{"name": "Jane Doe", "specialty": "Dermatologist"}'
   *
   * @throws {Error} - If the request body or parameters are invalid.
   * @throws {Error} - If the doctor cannot be updated.
   */

  async updateDoctor(request: FastifyRequest<{ Params: { id: string }; Body: { name?: string; crm?: string; specialty?: string; phone?: string; email?: string } }>, reply: FastifyReply) {
    const validation = updateDoctorSchema.safeParse(request.body) && doctorParamsSchema.safeParse(request.params)

    if(!validation.success) {
      reply.status(400).send({ error: validation.error.format() })
    }
    
    const { id } = request.params;
    const data = request.body;

    try {
      const doctor = await db.doctor.update({
        where: { id: Number(id) },
        data,
      });

      const stream = Readable.from(JSON.stringify(doctor));
      reply.type('application/json').send(stream);
    } catch (error) {
      reply.status(500).send({ error: 'Error updating doctor' });
    }
  }



  /**
   * Deletes a doctor by ID.
   *
   * @param request - The request with the doctor ID to delete.
   * @param reply - The response to send back to the client.
   *
   * @example
   * curl -X DELETE 'http://localhost:3000/doctors/1'
   *
   * @throws {Error} - If the request body is invalid.
   * @throws {Error} - If the doctor cannot be deleted.
   */
  async deleteDoctor(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const validation = doctorParamsSchema.safeParse(request.params)

    if(!validation.success) {
      reply.status(400).send({ error: validation.error.format() })
    }
    const id = validation.data

    try {
      await db.doctor.delete({ where: { id: Number(id) } });
      reply.status(204).send();
    } catch (error) {
      reply.status(500).send({ error: 'Error deleting doctor' });
    }
  }
}
