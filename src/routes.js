const { addBookHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHendler, deleteBookByIdHandler } = require('./handler')

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: addBookHandler
  },
  {
    method: 'GET',
    path: '/books',
    handler: getAllBooksHandler
  },
  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: getBookByIdHandler
  },
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: editBookByIdHendler
  },
  {
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: deleteBookByIdHandler
  }
]

module.exports = routes
