process.env.NODE_ENV = 'test';

const request = require('supertest');

const app = require('./app');
const { DB_URI } = require('./config');
const db = require('./db');
const Book = require('./models/book');


let test_book_one = {
    "isbn": "0691161518",
    "amazon_url": "http://a.co/eobPtX2",
    "author": "Matthew Lane",
    "language": "english",
    "pages": 264,
    "publisher": "Princeton University Press",
    "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
    "year": 2017
  }

let test_book_two = {
    "isbn": "5478945211",
    "amazon_url": "http://a.co/eobPtX2",
    "author": "Matthew Lane",
    "language": "french",
    "pages": 264,
    "publisher": "Princeton University Press",
    "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
    "year": 2017
  }






describe('Test Book Class' , function() {
    beforeEach(async function() {
        await db.query(`DELETE FROM books`);
        let b = await Book.create({
            "isbn": "0691161518",
        "amazon_url": "http://a.co/eobPtX2",
        "author": "Matthew Lane",
        "language": "english",
        "pages": 264,
        "publisher": "Princeton University Press",
        "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
        "year": 2017
        })
        let b_2 = await Book.create({ "isbn": "5478945211",
        "amazon_url": "http://a.co/eobPtX2",
        "author": "Matthew Lane",
        "language": "french",
        "pages": 264,
        "publisher": "Princeton University Press",
        "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
        "year": 2017})
    })

    test('can find all books in db' , async function() {
        const resp = await request(app).get('/books/');
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({books : [test_book_one , test_book_two]})
    })

    test('can find by isbn' , async function() {
        const resp = await request(app).get('/books/0691161518');
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({book: test_book_one});
    })

    test('can delete a book' , async function() {
        const resp = await request(app).delete('/books/0691161518');
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({message: "Book deleted"})
    })

    test('can update a book' , async function() {
        const resp =await request(app).put('/books/0691161518').send({
        "isbn": "0691161518",
        "amazon_url": "http://a.co/eobPtX2",
        "author": "Matthew Lane",
        "language": "english",
        "pages": 264,
        "publisher": "Princeton University Press",
        "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
        "year": 2018
        })
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({book: { "isbn": "0691161518",
        "amazon_url": "http://a.co/eobPtX2",
        "author": "Matthew Lane",
        "language": "english",
        "pages": 264,
        "publisher": "Princeton University Press",
        "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
        "year": 2018}})
    })
    test('Error returns when book schema is not correct for new book' , async function() {
        const resp = await request(app).post('/books/').send({ "isbn": "0691161518",
        "amazon_url": "http://a.co/eobPtX2",
        "author": "Matthew Lane",
        "language": "english",
        "pages": 264,
        "publisher": "Princeton University Press",
        "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
        "year": "2018"})
        expect(resp.statusCode).toBe(400);
        expect.any('string')
    })
})







afterAll(async function() {
    await db.end();
})