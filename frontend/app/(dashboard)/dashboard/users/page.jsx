import { fetchUsers } from '../actions/userActions';
import UsersClient from './UsersClient';

export default async function UsersPage() {
  const users = await fetchUsers();

  return <UsersClient initialUsers={users} />;
}
