import { cookies } from 'next/headers';
import Navbar from './Navbar';

export default async function NavbarSession() {
  const cookieStore = await cookies();
  const hasAccessToken = cookieStore.get('access_token')?.value != null;
  return <Navbar hasAccessToken={hasAccessToken} />;
}
