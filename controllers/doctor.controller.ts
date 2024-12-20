import { FastifyRequest, FastifyReply } from 'fastify';
import { Readable } from 'stream';
import { db } from '../lib/db';

export class DoctorController {

    async getAllDoctors(request: FastifyRequest, reply: FastifyReply) {
    try {
      const doctors = await db.doctor.findMany();
      reply.type('application/json').send(doctors);
    } catch (error) {
      reply.status(500).send({ error: 'Error fetching doctors' });
    }
  }

  async getDoctorById(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const { id } = request.params;

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

  async createDoctor(request: FastifyRequest<{ Body: { name: string; crm: string; specialty: string; phone?: string; email?: string; password?: string; hireDate?: Date } }>, reply: FastifyReply) {
    const { name, crm, specialty, phone, email, password, hireDate } = request.body;

    try {
      const doctor = await db.doctor.create({
        //@ts-expect-error
        data: { name, crm, specialty, phone, email, password, hireDate },
      });

      const stream = Readable.from(JSON.stringify(doctor));
      reply.status(201).type('application/json').send(stream);
    } catch (error) {
      reply.status(500).send({ error: 'Error creating doctor', details: error });
    }
  }

  // Atualizar médico por ID
  async updateDoctor(request: FastifyRequest<{ Params: { id: string }; Body: { name?: string; crm?: string; specialty?: string; phone?: string; email?: string } }>, reply: FastifyReply) {
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

  async deleteDoctor(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const { id } = request.params;

    try {
      await db.doctor.delete({ where: { id: Number(id) } });
      reply.status(204).send();
    } catch (error) {
      reply.status(500).send({ error: 'Error deleting doctor' });
    }
  }
}
