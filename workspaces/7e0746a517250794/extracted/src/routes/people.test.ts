import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { Express } from 'express';
import request from 'supertest';
import { getConfig } from '../config';
import { applyMigrations } from '../database/migrate';
import { getPool } from '../database/pool';
import { Queries, makeQueries } from '../database/queries';
import { makeApp } from '../app';
import { makeMiddleware } from '../middleware';
import pino from 'pino';

const logger = pino({ level: 'silent' });

describe('people router', () => {
  const config = getConfig('TEST_');
  let app: Express;
  let queries: Queries;

  // migrate up and create app before all tests
  beforeAll(async () => {
    await applyMigrations(config.databaseUrl, 'up');
    const middleware = makeMiddleware(logger);
    queries = makeQueries(config.databaseUrl);
    app = makeApp({ queries, middleware });
  });

  // empty database before each test
  beforeEach(async () => {
    const pool = getPool(config.databaseUrl);
    await pool.query('DELETE FROM people');
  });

  // migrate down and close database connection after all tests
  afterAll(async () => {
    await applyMigrations(config.databaseUrl, 'down');
    await getPool(config.databaseUrl).end();
  });

  describe('GET /people', () => {
    it('responds with correct data', async () => {
      // make sure database is empty
      const people = await queries.getAllPeople();
      expect(people).toHaveLength(0);

      const response1 = await request(app).get('/people');
      expect(response1.statusCode).toBe(200);
      expect(response1.headers['content-type']).toContain('application/json');
      expect(response1.body).toHaveLength(0);

      // add people
      await queries.addPerson({ name: 'John', age: 20 });
      await queries.addPerson({ name: 'Joe', age: 21 });

      const response2 = await request(app).get('/people');
      expect(response2.statusCode).toBe(200);
      expect(response2.headers['content-type']).toContain('application/json');
      expect(response2.body).toHaveLength(2);
      expect(response2.body).toEqual([
        { name: 'John', age: 20 },
        { name: 'Joe', age: 21 },
      ]);
    });
  });

  describe('POST /people', () => {
    it('adds to database', async () => {
      // make sure database is empty
      const people1 = await queries.getAllPeople();
      expect(people1).toHaveLength(0);

      const response = await request(app).post('/people').send({ name: 'Joe', age: 21 });
      expect(response.statusCode).toBe(200);
      expect(response.headers['content-type']).toContain('application/json');
      expect(response.body).toEqual({ name: 'Joe', age: 21 });

      // make sure it was added to database
      const people2 = await queries.getAllPeople();
      expect(people2).toHaveLength(1);
    });

    it('responds with status 400 with invalid body', async () => {
      const bodyData = [
        { name: 'Joe' },
        { name: '   ', age: 20 },
        { age: 20 },
        {},
        { name: 123, age: 20 },
        { name: 'Joe', age: '123' },
        { name: 'Joe', age: 200 },
        { name: 'Joe', age: -10 },
      ];

      for (const body of bodyData) {
        const response = await request(app).post('/people').send(body);
        expect(response.statusCode).toBe(400);
        expect(response.headers['content-type']).toContain('application/json');
        expect(response.body).toEqual({
          status: 400,
          message: expect.any(String),
          name: expect.any(String),
        });
      }

      // make sure nothing was added to database
      const people = await queries.getAllPeople();
      expect(people).toHaveLength(0);
    });
  });

  describe('undefined route', () => {
    it('responds with 404 and json', async () => {
      const response = await request(app).get('/route/not/defined');
      expect(response.statusCode).toBe(404);
      expect(response.headers['content-type']).toContain('application/json');
      expect(response.body).toEqual({
        status: 404,
        message: expect.any(String),
        name: expect.any(String),
      });
    });
  });
});
