import _ from 'lodash'

const dummy = (blogs) => {
    return 1
}

const totalLike = (blogs) => {
    const reducer = (sum, item) => {
        return sum + item.likes
    }
    return blogs.length === 0 ? 0 : blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
    const reducer =  (maxIdx, current, idx, arr) => {
        return current.likes > arr[maxIdx].likes ? idx : maxIdx
    }

    return blogs.length === 0 ? 0 : blogs.reduce(reducer, 0)
}

const mostBlogs = (blogs) => {
    const format = _.map(_.groupBy(blogs, 'author'),
    (blogs, author) => ({ author, blogs })    
    )
    const reducer =  (maxIdx, current, idx, arr) => {
        return current.blogs.length > arr[maxIdx].blogs.length ? idx : maxIdx
    }

    const idx = format.reduce(reducer, 0)
    return { author: format[idx].author, blogs: format[idx].blogs.length}
}

const mostLike= (blogs) => {
    const format = _.map(_.groupBy(blogs, 'author'),
    (like, author) => ({ author, like })    
    )

    const reducer =  (maxIdx, current, idx, arr) => {
        return current.likes > arr[maxIdx].likes ? idx : maxIdx
    }

    const formatted = format.map(re => {
        let sum = 0
        re.like.map( likes => {
            sum += likes.likes
        })
        return {author: re.author, likes: sum}
    })
    const idx = formatted.reduce(reducer, 0)
    return { author: formatted[idx].author, likes: formatted[idx].likes}
}

export default {dummy, totalLike, favoriteBlog, mostBlogs, mostLike}
