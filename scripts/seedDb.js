import { exit } from 'process';
import { seedPoints } from '../src/utils/seedUtils.js';

(async () => {
  await seedPoints();
  console.log('Data was seeded to the points collection, happy developing 🥳');
  // quit the terminal process
  exit();
})();
