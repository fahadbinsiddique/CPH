import { fetchAppointments } from '../actions/appointmentActions';
import AppointmentsClient from './AppointmentsClient';

export default async function AppointmentsPage() {
  const appointments = await fetchAppointments();

  return <AppointmentsClient initialAppointments={appointments} />;
}