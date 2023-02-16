const { v4: uuidv4 } = require('uuid')
const books = require('./books')

const addBookHandler = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload
  const id = uuidv4().split('-')[0]
  const insertedAt = new Date().toISOString()
  const updatedAt = insertedAt
  let finished
  if (pageCount === readPage) {
    finished = true
  } else {
    finished = false
  }

  const newBook = { id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt }

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku'
    })
    response.code(400)
    return response
  } else if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    })
    response.code(400)
    return response
  } else if (name) {
    books.push(newBook)
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id
      }
    })
    response.code(201)
    return response
  } else {
    const response = h.response({
      status: 'fail',
      message: 'Catatan gagal ditambahkan'
    })
    response.code(500)
    return response
  }
}

const getAllBooksHandler = (request, h) => {
  const dataBooks = books.map(book => {
    return {
      id: book.id,
      name: book.name,
      publisher: book.publisher
    }
  })
  const readingBooks = books.filter(book => book.reading === true).map(book => {
    return {
      id: book.id,
      name: book.name,
      publisher: book.publisher
    }
  })
  const unreadBooks = books.filter(book => book.reading === false).map(book => {
    return {
      id: book.id,
      name: book.name,
      publisher: book.publisher
    }
  })
  const finishedBooks = books.filter(book => book.finished === true).map(book => {
    return {
      id: book.id,
      name: book.name,
      publisher: book.publisher
    }
  })
  const unfinishedBooks = books.filter(book => book.finished === false).map(book => {
    return {
      id: book.id,
      name: book.name,
      publisher: book.publisher
    }
  })
  const booksByName = books.filter(book => String(book.name).toLowerCase().includes(String(request.query.name).toLowerCase())).map(book => {
    return {
      id: book.id,
      name: book.name,
      publisher: book.publisher
    }
  })

  if (request.query.reading === '1') {
    const response = h.response({
      status: 'success',
      data: {
        books: readingBooks
      }
    })
    response.code(200)
    return response
  } else if (request.query.reading === '0') {
    const response = h.response({
      status: 'success',
      data: {
        books: unreadBooks
      }
    })
    response.code(200)
    return response
  } else if (request.query.finished === '1') {
    const response = h.response({
      status: 'success',
      data: {
        books: finishedBooks
      }
    })
    response.code(200)
    return response
  } else if (request.query.finished === '0') {
    const response = h.response({
      status: 'success',
      data: {
        books: unfinishedBooks
      }
    })
    response.code(200)
    return response
  } else if (booksByName.length) {
    const response = h.response({
      status: 'success',
      data: {
        books: booksByName
      }
    })
    response.code(200)
    return response
  } else {
    const response = h.response({
      status: 'success',
      data: {
        books: dataBooks
      }
    })
    response.code(200)
    return response
  }
}

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params
  const book = books.filter(book => book.id === bookId)[0]

  if (book !== undefined) {
    const response = h.response({
      status: 'success',
      data: {
        book
      }
    })
    response.code(200)
    return response
  } else {
    const response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan'
    })
    response.code(404)
    return response
  }
}

const editBookByIdHendler = (request, h) => {
  const { bookId } = request.params
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload
  const updatedAt = new Date().toISOString()
  const index = books.findIndex((book) => book.id === bookId)

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku'
    })
    response.code(400)
    return response
  } else if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
    })
    response.code(400)
    return response
  } else if (index === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan'
    })
    response.code(404)
    return response
  } else if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt
    }
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui'
    })
    response.code(200)
    return response
  }
}

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params
  const index = books.findIndex(book => book.id === bookId)

  if (index !== -1) {
    books.splice(index, 1)
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus'
    })
    response.code(200)
    return response
  } else if (index === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan'
    })
    response.code(404)
    return response
  }
}

module.exports = { addBookHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHendler, deleteBookByIdHandler }
