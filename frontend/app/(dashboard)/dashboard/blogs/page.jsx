import { fetchBlogs } from '../actions/blogActions';
import BlogsClient from './BlogsClient';

export default async function BlogsPage() {
  const blogs = await fetchBlogs();

  return <BlogsClient initialBlogs={blogs} />;
}
