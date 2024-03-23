import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

import booksDataJson from './books.json';
import { Book } from '../interfaces/book';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  //TODO: Replace with the actual API URL
  private baseURL = 'http://localhost:80/api/resource';

  //private listOfBooksData: Book[] = booksDataJson;
  private listOfBooksData!: Book[];
  listOfBooksSubject = new Subject<Book[]>();

  private edited: Book = this.emptyBook();
  editedBookSubject = new Subject<Book>();

  constructor(private authService: AuthenticationService) {}

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

  //empty book
  emptyBook(): any {
    return {
      userId: '1',
      bookId: uuidv4(),
      title: '',
      author: '',
      personalNotes: '',
      rating: 0,
      currentPage: 0,
      totalPages: 0,
      dateStarted: Intl.DateTimeFormat('en-GB').format(Date.now()),
      genre: '',
    };
  }

  // request all books for the current user
  async requestBooks() {
    const response = await fetch(`${this.baseURL}/getAllForUser`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${this.authService.user?.JWT}`,
      },
    });

    this.listOfBooks = (await response.json()).map((book: any) => {
      return {
        userId: book.userId,
        bookId: book.bookId,
        title: book.title,
        author: book.author,
        personalNotes: '',
        rating: book.rating,
        currentPage: 0,
        totalPages: 0,
        dateStarted: book.dateStarted,
        genre: book.genre,
      };
    });
  }

  // request all books for the guest
  //TODO: replace with actual API call
  async requestBooksForGuest() {
    this.listOfBooks = booksDataJson;
  }


  //delete book
  async deleteBook(bookId: string) {
    const response = await fetch(`${this.baseURL}/delete`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.authService.user?.JWT}`,
      },
      body: JSON.stringify({
        bookId: bookId,
      }),
    });

    if (response.status === 200) {
      console.log('Book deleted successfully');

      this.listOfBooks.splice(
        this.listOfBooks.findIndex((item) => item.bookId === bookId),
        1
      );
      this.listOfBooksSubject.next(this.listOfBooks);
    }
  }

  // add new book into db
  async addNewBook(newBook: Book) {
    const response = await fetch(`${this.baseURL}/create`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.authService.user?.JWT}`,
      },
      body: JSON.stringify({
        userId: this.authService.user?.id,
        title: newBook.title,
        author: newBook.author,
        personalNotes: newBook.personalNotes,
        rating: newBook.rating,
        currentPage: newBook.currentPage,
        totalPages: newBook.totalPages,
        dateStarted: newBook.dateStarted,
        genre: newBook.genre,
      }),
    });

    if (response.status === 200) {
      console.log('Book added successfully');

      //get the added book from backend in order to add it in list of trips
      const book = await response.json();

      const newAddedTrip = {
        bookId: book.bookId,
        userId: book.userId,
        title: book.title,
        author: book.author,
        personalNotes: book.personalNotes,
        rating: book.rating,
        currentPage: book.currentPage,
        totalPages: book.totalPages,
        dateStarted: book.dateStarted,
        genre: book.genre,
      };

      this.listOfBooks.push(newAddedTrip);
      this.listOfBooksSubject.next(this.listOfBooks);
    }
  }

  // update book in db
  async updateBook(editedBook: Book) {
    const response = await fetch(`${this.baseURL}/update`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.authService.user?.JWT}`,
      },
      body: JSON.stringify({
        bookId: editedBook.bookId,
        userId: this.authService.user?.id,
        title: editedBook.title,
        author: editedBook.author,
        personalNotes: editedBook.personalNotes,
        rating: editedBook.rating,
        currentPage: editedBook.currentPage,
        totalPages: editedBook.totalPages,
        dateStarted: editedBook.dateStarted,
        genre: editedBook.genre,
      }),
    });

    if (response.status === 200) {
      console.log('Book updated successfully');

      this.listOfBooks.splice(
        this.listOfBooks.findIndex((item) => item.bookId === editedBook.bookId),
        1,
        editedBook
      );

      this.listOfBooksSubject.next(this.listOfBooks);
    }
  }

  //get details for given bookId
  async getBookById(bookId: string): Promise<Book | null> {
    const response = await fetch(`${this.baseURL}/getById/?bookId=${bookId}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${this.authService.user?.JWT}`,
      },
    });

    if (response.status === 200) {
      const book = await response.json();

      return {
        userId: book.userId,
        bookId: book.bookId,
        title: book.title,
        author: book.author,
        personalNotes: book.personalNotes,
        rating: book.rating,
        currentPage: book.currentPage,
        totalPages: book.totalPages,
        dateStarted: book.dateStarted,
        genre: book.genre,
      };
    }
    return null;
  }

  // main function used for adding/editing a book
  async updateOrCreateBook(bookToBeUpdated: Book) {
    // if book doesn't exist, we add it into database
    if ((await this.getBookById(bookToBeUpdated.bookId)) == null) {
      this.addNewBook(bookToBeUpdated);
    } else {
      // else, we update it
      this.updateBook(bookToBeUpdated);
    }
  }
}
