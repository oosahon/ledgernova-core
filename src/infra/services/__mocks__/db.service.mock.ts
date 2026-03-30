import IDbService from '../../../app/contracts/infra-services/db.contract';

const mockDbService: jest.Mocked<IDbService> = {
  runInTransaction: jest.fn(),
};

export default mockDbService;
