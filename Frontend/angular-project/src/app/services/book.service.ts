import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

import booksDataJson from './books.json';
import { Book } from '../interfaces/book';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private listOfBooksData: Book[] = booksDataJson;
  listOfBooksSubject = new Subject<Book[]>();

  private edited: Book = this.emptyBook();
  editedBookSubject = new Subject<Book>();

  constructor() {}

  //getter
  get editedBook() {
    return this.edited;
  }
  get listOfBooks(): Book[] {
    return this.listOfBooksData;
  }

  //setter
  set editedBook(book: Book) {
    this.edited = book;
    this.editedBookSubject.next(book);
  }
  set listOfBooks(newListOfBooks: any) {
    this.listOfBooksData = newListOfBooks;
    this.listOfBooksSubject.next(newListOfBooks);
  }

  //get details for given bookId
  getDetailsForBookId(bookId: string) {
    return this.listOfBooksData.find((book) => book.id === bookId);
  }

  //delete book
  deleteBook(bookId: string) {
    console.log('Book with id ' + bookId + ' has been deleted');
  }

  //empty book
  emptyBook(): any {
    return {
      id: uuidv4(),
      title: '',
      author: '',
      description: '',
      personalNotes: '',
      rating: 0,
      currentPage: 0,
      totalPages: 0,
      dateStarted: Intl.DateTimeFormat('en-GB').format(Date.now()),
      genre: '',
    };
  }

  addNewBook(newBook: Book) {
    this.listOfBooksData.push(newBook);
    this.listOfBooksSubject.next(this.listOfBooksData);
  }

  //main function used for adding/editing a book
  updateOrCreateBook(bookToBeUpdated: Book) {
    const existingBook = this.listOfBooksData.find(
      (book) => book.id === book.id
    );
    if (existingBook !== undefined) {
     existingBook.title = bookToBeUpdated.title;
     existingBook.author = bookToBeUpdated.author;
      existingBook.description = bookToBeUpdated.description;
      existingBook.personalNotes = bookToBeUpdated.personalNotes;
      existingBook.rating = bookToBeUpdated.rating;
      existingBook.currentPage = bookToBeUpdated.currentPage;
      existingBook.totalPages = bookToBeUpdated.totalPages;
      existingBook.dateStarted = bookToBeUpdated.dateStarted;
      existingBook.genre = bookToBeUpdated.genre;
    } else this.addNewBook(bookToBeUpdated);

    this.listOfBooksSubject.next(this.listOfBooks);
  }
}
