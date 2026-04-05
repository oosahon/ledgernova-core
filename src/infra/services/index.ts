import authService from './auth.service';
import logger from '../observability/logger';
import cacheStorage from '../persistence/cache/cache-storage';

const services = {
  auth: authService(cacheStorage),
  logger,
};

export default services;
