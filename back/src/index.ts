import { Router } from 'express';
import airtableRouter from './routes/airtable';
import aidRouter from './routes/aid';
import resetRouter from './routes/update_password';
import donationRouter from './routes/donations';

const routes = Router();

routes.use('/api/airtable', airtableRouter);
routes.use('/api/aid', aidRouter);
routes.use('/api/reset', resetRouter);
routes.use('/api/donations', donationRouter);

export default routes;
