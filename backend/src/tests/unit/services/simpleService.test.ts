// Simple service class for testing
class SimpleService {
  getData() {
    return { data: 'test data' };
  }

  async getAsyncData() {
    return Promise.resolve({ data: 'async test data' });
  }
}

const simpleService = new SimpleService();

describe('Simple Service Test', () => {
  it('should return data', () => {
    const result = simpleService.getData();
    expect(result).toEqual({ data: 'test data' });
  });

  it('should return async data', async () => {
    const result = await simpleService.getAsyncData();
    expect(result).toEqual({ data: 'async test data' });
  });
});
