import { fetchConsultants, fetchSpecializations } from '../actions/consultantActions';
import ConsultantsClient from './ConsultantsClient';

export default async function AdminConsultantsPage() {
  const consultants = await fetchConsultants();
  const specializations = await fetchSpecializations();

  return <ConsultantsClient initialConsultants={consultants} initialSpecializations={specializations} />;
}