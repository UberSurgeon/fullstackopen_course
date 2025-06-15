import _ from 'lodash'

const lelist = [
        {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'ddawda W. Dijkstra',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
        likes: 10,
        __v: 0
    },
    {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
        likes: 5,
        __v: 0
    },
    {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'ddawda W. Dijkstra',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
        likes: 15,
        __v: 0
    },
        {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
        likes: 5,
        __v: 0
    },
    {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
        likes: 5,
        __v: 0
    }
]

const result = _.map(
  _.groupBy(lelist, 'author'),
  (like, author) => ({ author, like })
)



    const reducer =  (maxIdx, current, idx, arr) => {
        return current.likes > arr[maxIdx].likes ? idx : maxIdx
    }

const formatted = result.map(re => {
    let sum = 0
    re.like.map( likes => {
        // console.log(likes.likes)
        sum += likes.likes
    })
    return {author: re.author, likes: sum}
})


const idx = formatted.reduce(reducer, 0)


console.log({author: formatted[idx].author, likes: formatted[idx].likes})



