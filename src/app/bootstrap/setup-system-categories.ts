import ICategoryRepo from '../../domain/category/repos/category.repo';
import ILogger from '../contracts/infra-services/logger.contract';
import { SYSTEM_CATEGORIES_INDIVIDUAL } from './data/individual-categories';
import generateUUID from '../../shared/utils/uuid-generator';

export async function setupIndividualDomainCategories(
  categoryRepo: ICategoryRepo,
  logger: ILogger
) {
  try {
    const correlationId = `setup-individual-domain-categories-${generateUUID()}`;
    logger.info(
      `Setting up individual domain categories with correlation id ${correlationId}`
    );

    for (const category of SYSTEM_CATEGORIES_INDIVIDUAL) {
      const isExisting = await categoryRepo.findByTaxKey(category.taxKey, {
        correlationId,
      });

      if (isExisting) {
        logger.info(`Category ${category.name} already exists`);
        continue;
      }

      await categoryRepo.save(category, {
        correlationId,
      });

      logger.info(`Category ${category.name} set up successfully`);
    }

    logger.info('Individual domain categories set up successfully');
  } catch (error) {
    logger.error('Failed to set up individual domain categories', error);
  }
}
