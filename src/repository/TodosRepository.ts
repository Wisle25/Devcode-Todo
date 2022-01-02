/* eslint-disable camelcase */
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { nanoid } from "nanoid";
import pool from "../db/connection";
import NotFoundError from "../exceptions/NotFoundError";

export interface ITodoPayload {
  title: string,
  activity_group_id: string
}

export interface IAddedTodo {
  created_at: string,
  updated_at: string,
  id: string,
  title: string,
  activity_group_id: string,
  is_active: number | boolean,
  priority: string,
}

export interface ITodoItem extends RowDataPacket {
  id: string,
  activity_group_id: string,
  title: string,
  is_active: number | boolean,
  priority: string,
  created_at: string,
  updated_at: string,
  deleted_at: string
}

class TodosRepository {
  private _pool = pool;
  private _nanoid = nanoid;

  public async addTodoItem(payload: ITodoPayload): Promise<IAddedTodo> {
    const { title, activity_group_id } = payload;
    const id = this._nanoid(24);
    const createdAt = new Date().toISOString();

    await this._pool.query(
      "INSERT INTO todos (id, activity_group_id, title) VALUES(?, ?, ?)",
      [id, activity_group_id, title],
    );

    return {
      created_at: createdAt,
      updated_at: createdAt,
      id,
      title: title || "",
      activity_group_id,
      is_active: true,
      priority: "very-high",
    };
  }

  public async getTodoItems(query?: string): Promise<ITodoItem[]> {
    if (query) {
      const [result] = await this._pool.query<ITodoItem[]>(
        `SELECT id, activity_group_id, title, is_active, priority, created_at, 
        updated_at, deleted_at FROM todos WHERE activity_group_id = ? LIMIT 10`,
        [query],
      );

      return result;
    }

    const [result] = await this._pool.query<ITodoItem[]>(
      `SELECT id, activity_group_id, title, is_active, priority, created_at, 
      updated_at, deleted_at FROM todos LIMIT 10`,
    );

    return result;
  }

  public async getTodoItemById(id: string): Promise<ITodoItem|NotFoundError> {
    const [result] = await this._pool.query<ITodoItem[]>(
      `SELECT id, activity_group_id, title, is_active, priority, created_at, 
      updated_at, deleted_at FROM todos WHERE id = ?`,
      [id],
    );
    if (!result.length) {
      throw new NotFoundError(`Todo with ID ${id} Not Found`);
    }

    return result[0];
  }

  public async delTodoItemById(id: string): Promise<void> {
    const [result] = await this._pool.query<ResultSetHeader>(
      "DELETE FROM todos WHERE id = ?",
      [id],
    );
    if (!result.affectedRows) {
      throw new NotFoundError(`Todo with ID ${id} Not Found`);
    }
  }

  public async patchTodoItemById(id: string, payload: {
    title?: string; is_active?: boolean;
  }): Promise<ITodoItem> {
    const { keys, values } = Object;
    await this.verifyTodoItemIsExist(id);

    if (keys(payload)[0] === "title") {
      const [result] = await this._pool.query<ResultSetHeader>(
        "UPDATE todos SET title = ? WHERE id = ?",
        [...values(payload), id],
      );
      if (!result.affectedRows) {
        throw new NotFoundError(`Todo with ID ${id} Not Found`);
      }
    } else if (keys(payload)[0] === "is_active") {
      const [result] = await this._pool.query<ResultSetHeader>(
        "UPDATE todos SET is_active = ? WHERE id = ?",
        [...values(payload), id],
      );
      if (!result.affectedRows) {
        throw new NotFoundError(`Todo with ID ${id} Not Found`);
      }
    }

    const [result] = await this._pool.query<ITodoItem[]>(
      `SELECT id, activity_group_id, title, is_active, priority, created_at, 
      updated_at, deleted_at FROM todos WHERE id = ?`,
      [id],
    );

    return result[0];
  }

  public async verifyTodoItemIsExist(id: string): Promise<void | NotFoundError> {
    const [result] = await this._pool.query<ITodoItem[]>(
      "SELECT id FROM todos WHERE id = ?",
      [id],
    );
    if (!result.length) {
      throw new NotFoundError(`Todo with ID ${id} Not Found`);
    }
  }
}

export default TodosRepository;
