import { Router } from 'express';
import { makePeopleController } from '../controllers/people';
import { AppContext } from '../app';

export const makePeopleRoutes = (ctx: AppContext): Router => {
  const router = Router();
  const controller = makePeopleController(ctx);

  router.get('/', controller.getAllPeople);
  router.post('/', controller.addPerson);

  return router;
};
