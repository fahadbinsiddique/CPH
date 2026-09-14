import { fetchBlogById } from '../../../actions/blogActions';
import BlogEditClient from './BlogEditClient';

export default async function EditBlogPage({ params }) {
  const { id } = await params;
  const blog = await fetchBlogById(id);

  return <BlogEditClient initialBlog={blog} notFound={!blog} />;
}
