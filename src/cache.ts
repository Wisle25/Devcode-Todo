import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import NodeCache from "node-cache";

// eslint-disable-next-line no-unused-vars
const caches: FastifyPluginAsync = async (app, opts) => {
  const cache = new NodeCache();

  app.addHook("onRequest", async (req, reply) => {
    if (req.method === "GET") {
      const response = cache.get(req.url);
      if (response !== undefined) {
        reply
          .header("Content-Type", "application/json; charset=utf-8")
          .send(response);
      }
    }
  });

  app.addHook("onSend", (req, reply, payload, done) => {
    if (req.method === "GET") {
      const response = cache.get(req.url);
      if (!response) {
        cache.set(req.url, payload, 15);
      }
    }
    done();
  });
};

export default fp(caches);
