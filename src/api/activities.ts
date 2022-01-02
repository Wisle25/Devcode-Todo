/* eslint-disable no-console */
import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import ClientError from "../exceptions/ClientError";
import InvariantError from "../exceptions/InvariantError";
import ActivitiesRepository, { userPayload } from "../repository/ActivitiesRepository";

interface ActivitiesParams {
  id: string
}

// eslint-disable-next-line no-unused-vars
const activitesRoute: FastifyPluginAsync = async (app, opts) => {
  const activitesRepository = new ActivitiesRepository();

  app.post<{ Body: userPayload }>("/activity-groups", async (req, reply) => {
    try {
      const { title } = req.body;
      if (!title) {
        throw new InvariantError("title cannot be null");
      }

      const addedActivity = await activitesRepository.addActivities(req.body);

      return reply.status(201).send({
        status: "Success",
        message: "Success",
        data: addedActivity,
      });
    } catch (err) {
      if (err instanceof ClientError) {
        return reply.status(err.statusCode).send({
          status: "Bad Request",
          message: err.message,
          data: {},
        });
      }

      console.error(err);
      return reply.status(500).send({
        status: "Error",
        message: "Mohon maaf! Terdapat kesalahan pada server kami.",
      });
    }
  });

  app.get("/activity-groups", async (req, reply) => {
    try {
      const actitivies = await activitesRepository.getActivities();

      return reply.send({
        status: "Success",
        message: "Success",
        data: actitivies,
      });
    } catch (err) {
      console.error(err);
      return reply.status(500).send({
        status: "Error",
        message: "Mohon maaf! Terdapat kesalahan pada server kami.",
      });
    }
  });

  app.get<{ Params: { id: string }}>("/activity-groups/:id", async (req, reply) => {
    try {
      const { id } = req.params;
      const activity = await activitesRepository.getActivityById(id);

      return reply.send({
        status: "Success",
        message: "Success",
        data: activity,
      });
    } catch (err) {
      if (err instanceof ClientError) {
        return reply.status(err.statusCode).send({
          status: "Not Found",
          message: err.message,
          data: {},
        });
      }

      console.error(err);
      return reply.status(500).send({
        status: "Error",
        message: "Mohon maaf! Terdapat kesalahan pada server kami.",
      });
    }
  });

  app.delete<{ Params: { id: string }}>("/activity-groups/:id", async (req, reply) => {
    try {
      const { id } = req.params;
      await activitesRepository.delActivitiesById(id);

      return reply.send({
        status: "Success",
        message: "Success",
        data: {},
      });
    } catch (err) {
      if (err instanceof ClientError) {
        return reply.status(err.statusCode).send({
          status: "Not Found",
          message: err.message,
          data: {},
        });
      }

      console.error(err);
      return reply.status(500).send({
        status: "Error",
        message: "Mohon maaf! Terdapat kesalahan pada server kami.",
      });
    }
  });

  app.patch<{
    Params: ActivitiesParams,
    Body: { title: string }
  }>("/activity-groups/:id", async (req, reply) => {
    try {
      const { id } = req.params;
      const { title } = req.body;
      if (!title) {
        throw new InvariantError("title cannot be null");
      }

      const patchedActivity = await activitesRepository.patchActivityById(id, req.body);

      return reply.send({
        status: "Success",
        message: "Success",
        data: patchedActivity,
      });
    } catch (err) {
      if (err instanceof ClientError) {
        return reply.status(err.statusCode).send({
          status: err.name === "InvariantError" ? "Bad Request" : "Not Found",
          message: err.message,
          data: {},
        });
      }

      return reply.status(500).send({
        status: "Error",
        message: "Mohon maaf! Terdapat kesalahan pada server kami.",
      });
    }
  });
};

export default fp(activitesRoute);
