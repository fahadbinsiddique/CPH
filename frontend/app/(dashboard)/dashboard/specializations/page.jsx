import { fetchSpecializations } from '../actions/specializationActions';
import SpecializationsClient from './SpecializationsClient';

export default async function SpecializationsPage() {
  const specializations = await fetchSpecializations();

  return <SpecializationsClient initialSpecializations={specializations} />;
}
