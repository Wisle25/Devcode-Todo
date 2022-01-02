/* eslint-disable no-console */
import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import ClientError from "../exceptions/ClientError";
import InvariantError from "../exceptions/InvariantError";
import TodosRepository, { ITodoPayload } from "../repository/TodosRepository";

interface ITodosQuery {
  activity_group_id?: string
}

interface ITodosParams {
  id: string
}

interface ITodosPatchPayload {
  title?: string,
  is_active?: boolean
}

interface ITodosPatchRequest {
  Params: ITodosParams,
  Body: ITodosPatchPayload
}

const todosRoute: FastifyPluginAsync = async (app) => {
  const todosRepository = new TodosRepository();

  app.post<{ Body: ITodoPayload }>("/todo-items", async (req, reply) => {
    try {
      const { title, activity_group_id: activityId } = req.body;
      if (!title) throw new InvariantError("title cannot be null");
      if (!activityId) throw new InvariantError("activity_group_id cannot be null");

      const addedActivity = await todosRepository.addTodoItem(req.body);

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
        message: "Mohon maaf! Terdapat kesalahan pada server kami",
      });
    }
  });

  app.get<{ Querystring: ITodosQuery }>("/todo-items", async (req, reply) => {
    try {
      const { activity_group_id: activityId } = req.query;
      const todos = await todosRepository.getTodoItems(activityId);

      return reply.send({
        status: "Success",
        message: "Success",
        data: todos,
      });
    } catch (err) {
      console.error(err);
      return reply.status(500).send({
        status: "Error",
        message: "Mohon maaf! Terdapat kesalahan pada server kami",
      });
    }
  });

  app.get<{ Params: ITodosParams }>("/todo-items/:id", async (req, reply) => {
    try {
      const { id } = req.params;
      const todo = await todosRepository.getTodoItemById(id);

      return reply.send({
        status: "Success",
        message: "Success",
        data: todo,
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
        message: "Mohon maaf! Terdapat kesalahan pada server kami",
      });
    }
  });

  app.delete<{ Params: ITodosParams }>("/todo-items/:id", async (req, reply) => {
    try {
      const { id } = req.params;
      await todosRepository.delTodoItemById(id);

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
        message: "Mohon maaf! Terdapat kesalahan pada server kami",
      });
    }
  });

  app.patch<ITodosPatchRequest>("/todo-items/:id", async (req, reply) => {
    try {
      const { id } = req.params;
      const patchedTodo = await todosRepository.patchTodoItemById(id, req.body);

      return reply.send({
        status: "Success",
        message: "Success",
        data: patchedTodo,
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
        message: "Mohon maaf! Terdapat kesahalan pada server kami.",
      });
    }
  });
};

export default fp(todosRoute);
