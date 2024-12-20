import fastify from "fastify"
import corsMiddleware from "./middlewares/cors"
import { registerRoutes } from "./routes"
import cors from '@fastify/cors'
import { mainScreen } from "./lib/mainScreen"

const server = fastify()

registerRoutes(server)

server.register(cors, {
  origin: "*",
})

server.get("/", async (request, reply) => {
  reply.type("text/html");
  const html = await mainScreen()
  reply.send(html);
});

server.listen({ port: 3000 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
})

export default async (req: any, res: any) => {
  await server.ready();
  server.server.emit("request", req, res);
}
