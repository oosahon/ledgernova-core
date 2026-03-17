import logger from '../observability/logger';
import storageService from './storage.service';

const services = {
  storage: storageService(logger),
};

export default services;
