import { jest } from '@jest/globals';
import sum from './example.js';

//read more at: https://jestjs.io/docs/getting-started
//you don't have to install or add anything to package.json
//so skip those steps
test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});
