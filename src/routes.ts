import { Router } from 'express';

const routes = Router();

import CovidControllers from './controllers/CovidControllers';

routes.get('/covid/jardim', CovidControllers.index);

export default routes;