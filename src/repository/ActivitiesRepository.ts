import { ResultSetHeader, RowDataPacket } from "mysql2";
import { nanoid } from "nanoid";
import pool from "../db/connection";
import NotFoundError from "../exceptions/NotFoundError";

export interface userPayload {
  title: string,
  email: string,
}

export interface respondPayload {
  created_at: string,
  updated_at: string,
  id: string,
  title: string,
  email: string,
}

export interface Activities extends RowDataPacket {
  id: string,
  title: string,
  email: string,
  createdAt: string,
  updatedAt: string,
  deletedAt: string,
}

class ActivitiesRepository {
  private _pool = pool;
  private _nanoid = nanoid;

  public async addActivities(payload: userPayload): Promise<respondPayload> {
    const { title, email } = payload;
    const id = this._nanoid(24);
    const createdAt = new Date().toISOString();

    await this._pool.query(
      "INSERT INTO activities (id, email, title) VALUES(?, ?, ?)",
      [id, email, title],
    );

    return {
      created_at: createdAt,
      updated_at: createdAt,
      id,
      title,
      email,
    };
  }

  public async getActivities(): Promise<Activities[]> {
    const [result] = await this._pool.query<Activities[]>(
      "SELECT id, email, title, created_at, updated_at, deleted_at FROM activities LIMIT 10",
    );

    return result;
  }

  public async getActivityById(id: string): Promise<Activities | NotFoundError> {
    const [result] = await this._pool.query<Activities[]>(
      "SELECT id, email, title, created_at, updated_at, deleted_at FROM activities WHERE id = ?",
      [id],
    );
    if (!result.length) {
      throw new NotFoundError(`Activity with ID ${id} Not Found`);
    }

    return result[0];
  }

  public async delActivitiesById(id: string): Promise<void|NotFoundError> {
    // eslint-disable-next-line no-unused-vars
    const [result] = await this._pool.query<ResultSetHeader>(
      "DELETE FROM activities WHERE id = ?",
      [id],
    );
    if (!result.affectedRows) {
      throw new NotFoundError(`Activity with ID ${id} Not Found`);
    }
  }

  public async patchActivityById(id: string, payload: {
    title?: string
  }): Promise<Activities | NotFoundError> {
    const [rows] = await this._pool.query<ResultSetHeader>(
      "UPDATE activities SET title = ? WHERE id = ?",
      [payload.title, id],
    );
    if (!rows.affectedRows) {
      throw new NotFoundError(`Activity with ID ${id} Not Found`);
    }

    const [result] = await this._pool.query<Activities[]>(
      "SELECT id, email, title, created_at, updated_at, deleted_at FROM activities WHERE id = ?",
      [id],
    );

    return result[0];
  }
}

export default ActivitiesRepository;
