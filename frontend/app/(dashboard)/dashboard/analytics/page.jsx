import { fetchAnalytics } from '../actions/analyticsActions';
import AnalyticsClient from './AnalyticsClient';

export default async function AnalyticsPage() {
  const data = await fetchAnalytics(30);

  return <AnalyticsClient initialData={data} initialDays={30} />;
}
