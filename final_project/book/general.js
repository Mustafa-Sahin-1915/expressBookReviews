const axios = require("axios");

const BASE_URL = "http://localhost:5000";

/* Get all books using async/await */
async function getAllBooks() {
    try {
        const response = await axios.get(`${BASE_URL}/`);
        console.log("All Books:");
        console.log(response.data);
    } catch (error) {
        console.error(error);
    }
}

/* Get book by ISBN using Promises */
function getBookByISBN(isbn) {
    axios.get(`${BASE_URL}/isbn/${isbn}`)
    .then(response => {
        console.log("Book by ISBN:");
        console.log(response.data);
    })
    .catch(error => {
        console.error(error);
    });
}

/* Get books by author using async/await */
async function getBooksByAuthor(author) {
    try {
        const response = await axios.get(`${BASE_URL}/author/${author}`);
        console.log("Books by Author:");
        console.log(response.data);
    } catch (error) {
        console.error(error);
    }
}

/* Get books by title using Promises */
function getBooksByTitle(title) {
    axios.get(`${BASE_URL}/title/${title}`)
    .then(response => {
        console.log("Books by Title:");
        console.log(response.data);
    })
    .catch(error => {
        console.error(error);
    });
}

/* Run all functions */
getAllBooks();
getBookByISBN("9781593275846");
getBooksByAuthor("Richard Silverman");
getBooksByTitle("Learn Python The Hard Way");