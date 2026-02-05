import { DressSchema } from './dress.schema';

describe('DressSchema', () => {
  it('should have an index on category', () => {
    const indexes = DressSchema.indexes();
    const categoryIndex = indexes.find((index) => index[0].category === 1);
    expect(categoryIndex).toBeDefined();
  });

  it('should have an index on status', () => {
    const indexes = DressSchema.indexes();
    const statusIndex = indexes.find((index) => index[0].status === 1);
    expect(statusIndex).toBeDefined();
  });
});
