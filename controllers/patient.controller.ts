import { FastifyReply, FastifyRequest } from "fastify";
import { db } from "../lib/db";

export class PatientController {

    async getAllPatients(request: FastifyRequest, reply: FastifyReply) {
        try {
            const patients = await db.patient.findMany();
            reply.type('application/json').send(patients);
        } catch (error) {
            reply.status(500).send({ error: 'Error fetching patients' });
        }
    }
}