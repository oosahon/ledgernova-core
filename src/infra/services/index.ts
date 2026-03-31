import authService from './auth.service';
import logger from '../observability/logger';
import redisCacheStorage from '../cache/redis-cache-storage';

const services = {
  auth: authService(redisCacheStorage),
  logger,
};

export default services;
