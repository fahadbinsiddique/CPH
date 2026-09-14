import { fetchAvailability } from '../actions/availabilityActions';
import AvailabilityClient from './AvailabilityClient';

export default async function AvailabilityPage() {
  const availability = await fetchAvailability();

  return <AvailabilityClient initialAvailability={availability} />;
}
