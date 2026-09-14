import { fetchAppointments } from '../actions/appointmentActions';
import PatientsClient from './PatientsClient';

export default async function PatientsPage() {
  const appointments = await fetchAppointments();

  return <PatientsClient initialAppointments={appointments} />;
}
