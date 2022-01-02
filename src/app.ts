import { fastify } from "fastify";
import fastifyCors from "fastify-cors";
import cluster from "cluster";
import os from "os";
import dotenv from "dotenv";

// Plugin
import cache from "./cache";

// API
import activities from "./api/activities";
import todos from "./api/todos";

dotenv.config();

const start = async () => {
  const app = fastify();

  // Registering middleware OR API
  app.register(fastifyCors);
  app.register(cache);
  app.register(activities);
  app.register(todos);

  try {
    app.listen(3030, "::", (err, address) => {
      if (err) app.log.error(err);
      // eslint-disable-next-line no-console
      console.log(`Server ${process.pid} is listening on ${address}`);
    });
  } catch (err) {
    app.log.error(err);
  }
};

if (cluster.isPrimary) {
  const numCPU = os.cpus().length;

  for (let i = 0; i < numCPU; i++) {
    cluster.fork();
  }

  cluster.on("exit", () => {
    cluster.fork();
  });
} else {
  start();
}
