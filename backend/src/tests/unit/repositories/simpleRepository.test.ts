// Simple repository class for testing
class SimpleRepository {
  private items: any[] = [
    { id: '1', name: 'Item 1' },
    { id: '2', name: 'Item 2' }
  ];

  findAll() {
    return this.items;
  }

  findById(id: string) {
    return this.items.find(item => item.id === id);
  }

  create(data: any) {
    const newItem = { id: String(this.items.length + 1), ...data };
    this.items.push(newItem);
    return newItem;
  }
}

const simpleRepository = new SimpleRepository();

describe('Simple Repository Test', () => {
  it('should find all items', () => {
    const result = simpleRepository.findAll();
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({ id: '1', name: 'Item 1' });
  });

  it('should find item by id', () => {
    const result = simpleRepository.findById('2');
    expect(result).toEqual({ id: '2', name: 'Item 2' });
  });

  it('should create a new item', () => {
    const result = simpleRepository.create({ name: 'Item 3' });
    expect(result).toEqual({ id: '3', name: 'Item 3' });
    expect(simpleRepository.findAll()).toHaveLength(3);
  });
});
