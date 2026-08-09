import JoinTherapistModal from '@/components/consultant/JoinTherapistModal'

/**
 * Intercepted route: navigating to `/join-as-therapist` with client-side
 * navigation renders this full-screen modal over the current page instead of
 * performing a full page navigation.
 */
export default function JoinAsTherapistModalPage() {
  return <JoinTherapistModal />
}