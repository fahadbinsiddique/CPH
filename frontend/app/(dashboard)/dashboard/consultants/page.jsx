import { fetchConsultants, fetchSpecializations } from '../actions/consultantActions';
import ConsultantsClient from './ConsultantsClient';

export default async function AdminConsultantsPage() {
  // Independent fetches — awaiting them serially doubled the server-side
  // waterfall (1669ms + 623ms), since each round trip to the remote database
  // costs ~315ms per query.
  const [consultants, specializations] = await Promise.all([
    fetchConsultants(),
    fetchSpecializations(),
  ]);

  return <ConsultantsClient initialConsultants={consultants} initialSpecializations={specializations} />;
}