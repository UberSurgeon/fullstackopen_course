import Togglable from "./Togglable";

const Blog = ({ blog, handleLike, handleRemove }) => (
  <div className="blogs">
    {blog.title} {blog.author}
    <Togglable buttonLabel="view" buttonLabelEnd="Hide">
      <p>{blog.url}</p>
      <span>likes {blog.likes}</span>
      <button
        onClick={() => {
          handleLike(blog.id, blog);
        }}
      >
        Like
      </button>
      <p>{blog.author}</p>
      <button
        onClick={() => {
          handleRemove(blog.id, blog);
        }}
      >
        remove
      </button>
      <br />
    </Togglable>
  </div>
);

export default Blog;
