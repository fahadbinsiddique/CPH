import { fetchAppointments } from '../actions/appointmentActions';
import BookingsClient from './BookingsClient';

export default async function BookingsPage() {
  const appointments = await fetchAppointments();

  return <BookingsClient initialAppointments={appointments} />;
}
