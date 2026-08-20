import { HttpError } from '../errors';
import { getPool } from './pool';
import { Person } from './types';

export interface Queries {
  checkConnection(): Promise<boolean>;
  getAllPeople(): Promise<Person[]>;
  addPerson(person: Person): Promise<Person>;
}

export const makeQueries = (databaseUrl: string): Queries => {
  const pool = getPool(databaseUrl);

  return {
    checkConnection: async () => {
      try {
        const { rows } = await pool.query<{ conn_test: number }>('SELECT 1 as conn_test');
        return rows[0].conn_test === 1;
      } catch {
        return false;
      }
    },
    getAllPeople: async () => {
      const { rows } = await pool.query<Person>(
        `
        SELECT name, age
        FROM people
        `,
      );
      return rows;
    },
    addPerson: async ({ name, age }) => {
      const { rows, rowCount } = await pool.query<Person, [string, number]>(
        `
        INSERT INTO people (name, age)
        VALUES ($1, $2)
        RETURNING name, age
        `,
        [name, age],
      );
      if (rowCount !== 1) {
        throw new HttpError(500, 'Something went wrong');
      }
      return rows[0];
    },
  };
};
