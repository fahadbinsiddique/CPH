import { Calendar, CheckCircle2, Clock, MapPin, User, Video } from 'lucide-react';

export const ALL_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
  '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00',
];

export const SESSION_TYPES = [
  {
    value: 'online',
    label: 'Online Session',
    icon: Video,
    desc: 'Secure video consultation from anywhere',
    color: 'from-blue-500 to-indigo-600',
  },
  {
    value: 'in_person',
    label: 'In-Person Visit',
    icon: MapPin,
    desc: 'Face-to-face at our clinic',
    color: 'from-emerald-500 to-teal-600',
  },
];

export const BOOKING_STEPS = [
  { id: 1, label: 'Date', icon: Calendar },
  { id: 2, label: 'Time', icon: Clock },
  { id: 3, label: 'Details', icon: User },
  { id: 4, label: 'Confirm', icon: CheckCircle2 },
];

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function convertTo12Hour(timeStr) {
  const [hour, minute] = timeStr.split(':');
  const h = parseInt(hour, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const displayHour = h % 12 || 12;
  return `${displayHour}:${minute} ${ampm}`;
}

export function formatDate(date) {
  if (!date) return '';
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
}

export function getDaysInMonth(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return { firstDay, daysInMonth };
}

export function isDateDisabled(date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}
