import { useState } from "react";

const BlogForm = ({ createNewBlog }) => {
  const [newblogs, setNewblogs] = useState({
    title: "",
    author: "",
    url: "",
    users: "",
  });

  const addBlog = (event) => {
    event.preventDefault();
    console.log("NEWBLOGGGG", newblogs);
    createNewBlog(newblogs);
  };
  return (
    <form onSubmit={addBlog}>
      <div>
        title:
        <input
          type="text"
          value={newblogs.title}
          name="title"
          onChange={({ target }) =>
            setNewblogs({ ...newblogs, title: target.value })
          }
          id="title"
        />
      </div>
      <div>
        author:
        <input
          type="text"
          value={newblogs.author}
          name="author"
          onChange={({ target }) =>
            setNewblogs({ ...newblogs, author: target.value })
          }
          id="author"
        />
      </div>
      <div>
        url
        <input
          type="text"
          value={newblogs.url}
          name="url"
          onChange={({ target }) =>
            setNewblogs({ ...newblogs, url: target.value })
          }
          id="url"
        />
      </div>
      <button type="submit">create</button>
    </form>
  );
};

export default BlogForm;
