import fastify from "fastify";
import cors from "@fastify/cors";

const server = fastify();

server.register(cors, {
  origin: "*",
});

server.listen({ port: 3000 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
})

server.get("/", async (request, reply) => {
  reply.type("text/html");
  const html = "teste";
  reply.send(html);
});

export default async (req: any, res: any) => {
  await server.ready();
  server.server.emit("request", req, res);
};
