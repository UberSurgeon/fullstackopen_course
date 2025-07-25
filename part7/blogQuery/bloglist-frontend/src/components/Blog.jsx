import { useState } from "react";
import Togglable from "./Togglable";

const Blog = ({ blog, handleLike, handleRemove, handleComment }) => {

  const [comment, setNewComment] = useState('')

  const handleTest = (event) => {
    event.preventDefault()
    console.log(comment)
    handleComment(blog.id, comment)
    setNewComment('')
  }

  return (
    <div className="blogs">
      <h2>{blog.title} {blog.author}</h2>
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
      <div>
        <h3>comments</h3>
        <ul>
          {blog.comment.map((com,i) => <li key={i}>{com}</li>)}
        </ul>

        <form onSubmit={handleTest}>
          <input
            type="text"
            value={comment}
            name="comment"
            onChange={({ target }) =>
              setNewComment(target.value)
            }
            id="comment"
          />
          <button type="submit"> add comment </button>
        </form>
      </div>
      <button
        onClick={() => {
          handleRemove(blog.id, blog);
        }}
      >
        remove
      </button>
      <br />
    </div>
  );}

export default Blog;
