import { BookingSchema } from './booking.schema';

describe('BookingSchema', () => {
  it('should have an index on date', () => {
    const indexes = BookingSchema.indexes();
    // indexes is an array of arrays, e.g. [[{ date: 1 }, { background: true }]]
    const dateIndex = indexes.find((index) => index[0] && index[0].date === 1);
    expect(dateIndex).toBeDefined();
  });
});
