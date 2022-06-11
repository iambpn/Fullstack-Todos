import seedUser from './UserSeed';
import seedTodo from './TodoSeed';

export default async function SeedInit() {
  await seedUser();
  await seedTodo();
}
