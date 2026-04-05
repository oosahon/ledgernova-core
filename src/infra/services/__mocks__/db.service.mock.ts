import IDbService from '../../../app/contracts/infra/db.contract';

const mockDbService: jest.Mocked<IDbService> = {
  runInTransaction: jest.fn(),
};

export default mockDbService;
