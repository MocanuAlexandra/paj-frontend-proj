import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Book } from 'src/app/interfaces/book';
import { BookService } from 'src/app/services/book.service';

@Component({
  selector: 'app-book-card',
  templateUrl: './book-card.component.html',
  styleUrls: ['./book-card.component.scss'],
})
export class BookCardComponent {
  @Input()
  bookListing!: Book;

  //contains all data
  book?: Book | null;

  @Output()
  emitDeleteTripId: EventEmitter<string> = new EventEmitter();

  @Output() openViewDetailsModal: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  constructor(private bookService: BookService) {}

  //click functions
  onDeleteBookClick(bookId: string) {
    //call the service to delete book from backend
    this.bookService.deleteBook(bookId);

    //emit the id of the trip to the parent component
    this.emitDeleteTripId.emit(bookId);
  }

  async onViewDetailsClick(bookId: string) {
    //get the book with all data from server
    this.book = await this.bookService.getBookById(bookId);

    if (this.book != null) {
      //assign this value to editedBook from service
      this.bookService.editedBook = this.book;

      //emit event for open details modal
      this.openViewDetailsModal.emit();
    }
  }
}
