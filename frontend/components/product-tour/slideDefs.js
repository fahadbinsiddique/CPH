import {
  Sparkles,
  Eye,
  AlertTriangle,
  Layers,
  HeartHandshake,
  ShieldCheck,
  Search,
  UserRound,
  CalendarPlus,
  Clock,
  CalendarCheck2,
  ClipboardList,
  FileCheck2,
  UserCog,
  LayoutDashboard,
  KeyRound,
  UserCheck,
  UserPlus,
  BookOpen,
  PenLine,
  Bell,
  Smartphone,
  WifiOff,
  MonitorSmartphone,
  Code2,
  Network,
  Lock,
  FlaskConical,
  BarChart3,
  Route,
  Gem,
  Rocket,
  Heart,
} from 'lucide-react';

import Cover from './slides/cover';
import Vision from './slides/vision';
import Problem from './slides/problem';
import Overview from './slides/overview';
import ClientExperience from './slides/client-experience';
import Auth from './slides/auth';
import Discovery from './slides/discovery';
import Profile from './slides/profile';
import Booking from './slides/booking';
import Availability from './slides/availability';
import Appointments from './slides/appointments';
import Assessments from './slides/assessments';
import Results from './slides/results';
import ConsultantDashboard from './slides/consultant-dashboard';
import AdminDashboard from './slides/admin-dashboard';
import Roles from './slides/roles';
import ConsultantManagement from './slides/consultant-management';
import Join from './slides/join';
import Blog from './slides/blog';
import Editor from './slides/editor';
import Notifications from './slides/notifications';
import Pwa from './slides/pwa';
import Offline from './slides/offline';
import Responsive from './slides/responsive';
import Tech from './slides/tech';
import Architecture from './slides/architecture';
import Security from './slides/security';
import Testing from './slides/testing';
import Analytics from './slides/analytics';
import Journey from './slides/journey';
import Value from './slides/value';
import Future from './slides/future';
import Closing from './slides/closing';

export const ACCENTS = {
  teal: {
    grad: 'from-teal-500 to-emerald-500',
    chip: 'bg-teal-50 text-teal-700 ring-teal-200/70',
    blob: 'bg-teal-200/50',
    soft: 'bg-teal-100/60',
  },
  indigo: {
    grad: 'from-indigo-500 to-blue-500',
    chip: 'bg-indigo-50 text-indigo-700 ring-indigo-200/70',
    blob: 'bg-indigo-200/50',
    soft: 'bg-indigo-100/60',
  },
  amber: {
    grad: 'from-amber-500 to-orange-400',
    chip: 'bg-amber-50 text-amber-700 ring-amber-200/70',
    blob: 'bg-amber-200/50',
    soft: 'bg-amber-100/60',
  },
  rose: {
    grad: 'from-rose-500 to-pink-500',
    chip: 'bg-rose-50 text-rose-700 ring-rose-200/70',
    blob: 'bg-rose-200/50',
    soft: 'bg-rose-100/60',
  },
  sky: {
    grad: 'from-sky-500 to-indigo-500',
    chip: 'bg-sky-50 text-sky-700 ring-sky-200/70',
    blob: 'bg-sky-200/50',
    soft: 'bg-sky-100/60',
  },
  violet: {
    grad: 'from-violet-500 to-purple-500',
    chip: 'bg-violet-50 text-violet-700 ring-violet-200/70',
    blob: 'bg-violet-200/50',
    soft: 'bg-violet-100/60',
  },
  emerald: {
    grad: 'from-emerald-500 to-green-500',
    chip: 'bg-emerald-50 text-emerald-700 ring-emerald-200/70',
    blob: 'bg-emerald-200/50',
    soft: 'bg-emerald-100/60',
  },
  purple: {
    grad: 'from-fuchsia-500 to-purple-500',
    chip: 'bg-purple-50 text-purple-700 ring-purple-200/70',
    blob: 'bg-purple-200/50',
    soft: 'bg-purple-100/60',
  },
};

export const SLIDES = [
  { id: 'cover', index: 1, section: 'Welcome', title: 'Center for Psychology Health', subtitle: 'Digital Mental Health & Psychology Practice Platform', icon: Sparkles, accent: 'teal', type: 'hero', Content: Cover },
  { id: 'vision', index: 2, section: 'The Platform', title: 'One Connected Platform', subtitle: 'CPH brings a psychology practice online — for the people seeking care, the consultants providing it, and the team operating it.', icon: Eye, accent: 'sky', type: 'standard', Content: Vision },
  { id: 'problem', index: 3, section: 'The Platform', title: 'The Problem We Solve', subtitle: 'Traditional bookings rely on back-and-forth phone calls, paper records and manual coordination. CPH replaces friction with a guided digital flow.', icon: AlertTriangle, accent: 'amber', type: 'standard', Content: Problem },
  { id: 'overview', index: 4, section: 'The Platform', title: 'Platform Overview', subtitle: 'Three connected worlds on a single platform — clients, consultants and administrators.', icon: Layers, accent: 'teal', type: 'standard', Content: Overview },
  { id: 'client-experience', index: 5, section: 'Client Experience', title: 'The Client Experience', subtitle: 'Everything a client needs — from first discovery to ongoing support — in one calm, guided experience.', icon: HeartHandshake, accent: 'emerald', type: 'standard', Content: ClientExperience },
  { id: 'auth', index: 6, section: 'Foundation', title: 'Secure Authentication', subtitle: 'A safe, simple sign-in protects user accounts and keeps every area of the platform private and personal.', icon: ShieldCheck, accent: 'indigo', type: 'standard', Content: Auth },
  { id: 'discovery', index: 7, section: 'Client Experience', title: 'Consultant Discovery', subtitle: 'Clients explore qualified professionals, filter by specialisation and instantly see who is accepting bookings.', icon: Search, accent: 'teal', type: 'standard', Content: Discovery },
  { id: 'profile', index: 8, section: 'Client Experience', title: 'Consultant Profiles', subtitle: 'Each consultant has a complete profile with their specialisations, experience, fee and availability.', icon: UserRound, accent: 'violet', type: 'standard', Content: Profile },
  { id: 'booking', index: 9, section: 'Client Experience', title: 'Appointment Booking', subtitle: 'A guided four-step booking flow that turns intent into a confirmed appointment in under a minute.', icon: CalendarPlus, accent: 'teal', type: 'standard', Content: Booking },
  { id: 'availability', index: 10, section: 'Client Experience', title: 'Smart Availability', subtitle: 'Consultants control their own schedules, and clients only ever see times that are genuinely open.', icon: Clock, accent: 'amber', type: 'standard', Content: Availability },
  { id: 'appointments', index: 11, section: 'Client Experience', title: 'Appointment Management', subtitle: 'Every session has a clear status — pending, confirmed, completed or cancelled — visible to the right people.', icon: CalendarCheck2, accent: 'indigo', type: 'standard', Content: Appointments },
  { id: 'assessments', index: 12, section: 'Client Experience', title: 'Mental Health Assessments', subtitle: 'A structured self-assessment experience that helps clients understand themselves before and between sessions.', icon: ClipboardList, accent: 'sky', type: 'standard', Content: Assessments },
  { id: 'results', index: 13, section: 'Client Experience', title: 'Results & History', subtitle: 'Assessment results are stored in the client dashboard, so growth can be reviewed across time.', icon: FileCheck2, accent: 'emerald', type: 'standard', Content: Results },
  { id: 'consultant-dashboard', index: 14, section: 'Workspaces', title: 'The Consultant Workspace', subtitle: 'Consultants manage their practice from a dedicated workspace designed around their day-to-day needs.', icon: UserCog, accent: 'indigo', type: 'standard', Content: ConsultantDashboard },
  { id: 'admin-dashboard', index: 15, section: 'Workspaces', title: 'The Admin Dashboard', subtitle: 'A central command centre for managing users, consultants, appointments, content and insights.', icon: LayoutDashboard, accent: 'purple', type: 'standard', Content: AdminDashboard },
  { id: 'roles', index: 16, section: 'Workspaces', title: 'Role-Based Access', subtitle: 'One platform, three tailored experiences — everyone sees exactly what they need and nothing they should not.', icon: KeyRound, accent: 'violet', type: 'standard', Content: Roles },
  { id: 'consultant-management', index: 17, section: 'Administration', title: 'Consultant Management', subtitle: 'Administrators review applications, verify professionals and curate the consultant team from one place.', icon: UserCheck, accent: 'purple', type: 'standard', Content: ConsultantManagement },
  { id: 'join', index: 18, section: 'Administration', title: 'Join as a Therapist', subtitle: 'A structured onboarding path that lets qualified professionals apply to join the platform.', icon: UserPlus, accent: 'emerald', type: 'standard', Content: Join },
  { id: 'blog', index: 19, section: 'Administration', title: 'Blog & Content Center', subtitle: 'A full content management system for publishing wellbeing articles that inform and support clients.', icon: BookOpen, accent: 'rose', type: 'standard', Content: Blog },
  { id: 'editor', index: 20, section: 'Administration', title: 'The Rich Content Editor', subtitle: 'A professional writing studio with structured formatting, images, tags and publishing controls.', icon: PenLine, accent: 'amber', type: 'standard', Content: Editor },
  { id: 'notifications', index: 21, section: 'Engagement', title: 'Notifications & Alerts', subtitle: 'The platform keeps clients and consultants informed about the moments that matter.', icon: Bell, accent: 'rose', type: 'standard', Content: Notifications },
  { id: 'pwa', index: 22, section: 'Engagement', title: 'App-Like, Installable Experience', subtitle: 'CPH can be installed on any device like a native app — with its own icon, home-screen shortcuts and background updates.', icon: Smartphone, accent: 'emerald', type: 'standard', Content: Pwa },
  { id: 'offline', index: 23, section: 'Engagement', title: 'Resilient Offline Experience', subtitle: 'When connectivity drops, the platform does not stop — important actions are saved locally and synced when you reconnect.', icon: WifiOff, accent: 'amber', type: 'standard', Content: Offline },
  { id: 'responsive', index: 24, section: 'Engagement', title: 'One Platform, Every Screen', subtitle: 'From office desktop to phone on the go, the experience adapts smoothly across every device.', icon: MonitorSmartphone, accent: 'sky', type: 'standard', Content: Responsive },
  { id: 'tech', index: 25, section: 'Behind The Scenes', title: 'The Technology Stack', subtitle: 'A modern, maintainable stack — proven tools chosen for performance, security and developer productivity.', icon: Code2, accent: 'indigo', type: 'standard', Content: Tech },
  { id: 'architecture', index: 26, section: 'Behind The Scenes', title: 'System Architecture', subtitle: 'A clean separation between the presentation layer, the API and the data layer keeps the platform fast and scalable.', icon: Network, accent: 'teal', type: 'standard', Content: Architecture },
  { id: 'security', index: 27, section: 'Behind The Scenes', title: 'Security & Access Control', subtitle: 'Private by design — user data is protected by modern authentication, permissions and careful input handling.', icon: Lock, accent: 'purple', type: 'standard', Content: Security },
  { id: 'testing', index: 28, section: 'Behind The Scenes', title: 'Quality & Reliability', subtitle: 'Automated tests protect critical flows and a rigorous build pipeline keeps the platform dependable.', icon: FlaskConical, accent: 'emerald', type: 'standard', Content: Testing },
  { id: 'analytics', index: 29, section: 'Behind The Scenes', title: 'Analytics & Insights', subtitle: 'Administrators can see engagement trends, session mix and outcomes to make informed decisions.', icon: BarChart3, accent: 'teal', type: 'standard', Content: Analytics },
  { id: 'journey', index: 30, section: 'The Journey', title: 'The Complete User Journey', subtitle: 'Follow a client from first discovery to a managed appointment — every step supported by the platform.', icon: Route, accent: 'emerald', type: 'standard', Content: Journey },
  { id: 'value', index: 31, section: 'The Journey', title: 'Value for Every Role', subtitle: 'Why each part of the platform exists — and what it delivers for the people who use it.', icon: Gem, accent: 'amber', type: 'standard', Content: Value },
  { id: 'future', index: 32, section: 'The Journey', title: 'Potential Future Expansion', subtitle: 'Ideas for where the platform can grow next.', icon: Rocket, accent: 'violet', type: 'standard', Content: Future },
  { id: 'closing', index: 33, section: 'Thank You', title: 'CPH brings the psychology practice into one connected digital experience.', subtitle: '', icon: Heart, accent: 'teal', type: 'hero', Content: Closing },
];