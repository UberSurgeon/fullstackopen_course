import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import Blog from "./Blog"
import Togglable from "./Togglable"
import BlogForm from "./BlogForm"


test('renders content', async() => {
    const blog = {
        title: 'sibuxiangxtuye',
        author: 'Nathan',
        url: 'sodjapdoka',
        likes: 2000
    }
    

    const {container} = render(<Blog blog={blog}/>)
    const div = container.querySelector('.blogs')
    expect(div).toHaveTextContent('sibuxiangxtuye')
    expect(div).toHaveTextContent('Nathan')
    const div2 = container.querySelector('.togglableContent')
    expect(div2).toHaveStyle("display: none")

})

test('renders content rendered', async() => {
    const blog = {
        title: 'sibuxiangxtuye',
        author: 'Nathan',
        url: 'sodjapdoka',
        likes: 2000
    }

    const { container } = render(<Blog blog={blog}/>)

    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)
    screen.debug(container)

    const div2 = container.querySelector('.togglableContent')
    expect(div2).not.toHaveStyle('display: none')
    expect(div2).toHaveTextContent('sodjapdoka')
    expect(div2).toHaveTextContent('2000')
})

test('click like', async() => {
    const blog = {
        title: 'sibuxiangxtuye',
        author: 'Nathan',
        url: 'sodjapdoka',
        likes: 2000
    }
    const mockHandler = vi.fn()

    const { container } = render(<Blog blog={blog} handleLike={mockHandler}/>)

    const user = userEvent.setup()
    const button = screen.getByText('view')
    const buttonlike = screen.getByText('Like')
    await user.click(button)
    await user.click(buttonlike)
    await user.click(buttonlike)


    expect(mockHandler.mock.calls).toHaveLength(2)
})

test('blog form', async() => {
    const blog = {
        title: 'sibuxiangxtuye',
        author: 'Nathan',
        url: 'sodjapdoka',
        likes: 2000
    }
    const mockHandler = vi.fn()

    const { container } = render(<BlogForm createNewBlog={mockHandler} />)

    const user = userEvent.setup()
    const button = screen.getByText('create')
    const title = container.querySelector('#title')
    const author = container.querySelector('#author')
    const url = container.querySelector('#url')
    await user.type(title, blog.title)
    await user.type(author, blog.author)
    await user.type(url, blog.url)
    await user.click(button)

    console.log(mockHandler.mock.calls)
})

