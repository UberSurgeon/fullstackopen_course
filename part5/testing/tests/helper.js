const login = async (page, username, password) => {
    await page.locator('#username').fill(username)
    await page.locator('#password').fill(password)
    await page.getByRole('button', { name: 'login'}).click()
} 

const createBlogs = async (page, title, author, url) => {
    await page.getByRole('button', { name: 'Create Blog'}).click()
    await page.locator('#title').fill(title)
    await page.locator('#author').fill(author)
    await page.locator('#url').fill(url)
    await page.getByRole('button', { name: 'create'}).click()
} 

export default {login, createBlogs}
