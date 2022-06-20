export const createBook = `
    mutation createBook($input: BookInput!) {
        createBook(newBook: $input) {
        author
        description
        bookId
        createdAt
        price
        title
        }
    }
`