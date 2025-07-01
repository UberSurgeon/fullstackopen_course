import { test, expect, beforeEach, describe } from '@playwright/test'
import helper from './helper'

describe('Blog app', () => {
    beforeEach(async ({page, request}) => {
        await request.post('/api/testing')
        await request.post('/api/users', {
            data:{
                "username": "tuye",
                "name": "tuye",
                "password": "ilaa"
            }
        })
        await request.post('/api/users', {
            data:{
                "username": "tuye2",
                "name": "tuye",
                "password": "ilaa"
            }
        })
        
        await page.goto('/')
        
    })

    test('Login form is shown', async ({ page }) => {
        const locator = await page.getByText('log in to application')
        await expect(locator).toBeVisible()
    })

    test('fail', async({ page }) => {
        await helper.login(page, "tuyae", "ilaa")

        await expect(page.getByText('wrong username or password')).toBeVisible()
    })

    test('succeeds', async({ page }) => {
        await helper.login(page, "tuye", "ilaa")

        await expect(page.getByText('tuye logged in')).toBeVisible()
    })

    test('createBlogs', async({ page }) => {
        await helper.login(page, "tuyae", "ilaa")
        await expect(page.getByText('wrong username or password')).toBeVisible()
        await helper.login(page, "tuye", "ilaa")
        await helper.createBlogs(page, "sibuxiangxsibuxiang", "silva", "lovesibuxiang.com")


        await expect(page.getByText('sibuxiangxsibuxiang silva').nth(0)).toBeVisible()
    })

    test('likeblog', async({ page }) => {
        await helper.login(page, "tuyae", "ilaa")
        await expect(page.getByText('wrong username or password')).toBeVisible()
        await helper.login(page, "tuye", "ilaa")
        await helper.createBlogs(page, "sibuxiangxsibuxiang", "silva", "lovesibuxiang.com")
        await page.getByRole('button', { name: 'view'}).click()
        await page.getByRole('button', { name: 'Like'}).click()


        await expect(page.getByText('likes 1').nth(0)).toBeVisible()
    })

    test('seeblog', async({ page }) => {
        await helper.login(page, "tuye", "ilaa")
        await helper.createBlogs(page, "sibuxiangxsibuxiang", "silva", "lovesibuxiang.com")
        await page.getByRole('button', { name: 'logout'}).click()
        await helper.login(page, "tuye2", "ilaa")


        await expect(page.getByText('sibuxiangxsibuxiang silva')).not.toBeVisible()
    })


    test('deleteBlogs', async({ page }) => {
        await helper.login(page, "tuyae", "ilaa")
        await expect(page.getByText('wrong username or password')).toBeVisible()
        await helper.login(page, "tuye", "ilaa")
        await helper.createBlogs(page, "sibuxiangxsibuxiang", "silva", "lovesibuxiang.com")
        await page.getByRole('button', { name: 'view'}).click()
        await page.getByRole('button', { name: 'remove'}).click()

        page.on('dialog', async (dialog) => {
            await dialog.accept()
        })


        await expect(page.getByText('sibuxiangxsibuxiang silva')).not.toBeVisible()
    })

    test('orderBlogs', async({ page }) => {
        await helper.login(page, "tuye", "ilaa")
        await helper.createBlogs(page, "sibuxiangxsibuxiang", "silva", "lovesibuxiang.com")
        await page.getByText("sibuxiangxsibuxiang").waitFor()
        await expect(page.getByText('sibuxiangxsibuxiang silva').nth(0)).toBeVisible()

        await page.getByRole('button', { name: 'Cancel'}).click()
        
        await helper.createBlogs(page, "sdasda", "asdwdas", "eqwerqwe.com")
        await page.reload()
        await page.getByText("sdasda").waitFor()
        const locator = await page.getByText('sibuxiangxsibuxiang silva').nth(0)
        
        await locator.getByRole('button', { name: 'view'}).click()
        await locator.getByRole('button', { name: 'Like'}).click()
        await locator.getByText('likes 1').waitFor()

        const blogsOrder = await page.locator('.blogs').allTextContents()
        console.log(blogsOrder[0])

        await expect(blogsOrder[0]).toContain('sibuxiangxsibuxiang')

    })
})
