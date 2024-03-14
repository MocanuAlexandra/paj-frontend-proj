import { Component, Input } from '@angular/core';
import { Book } from '../../../interfaces/book';
import { BookService } from 'src/app/services/book.service';

@Component({
  selector: 'app-books-dashboard',
  templateUrl: './books-dashboard.component.html',
  styleUrls: ['./books-dashboard.component.scss'],
})
export class BooksDashboardComponent {
  @Input()
  listOfBooks!: Book[];

  currentPageBooks!: Book[];
  currentPageStartIndex: number = 0;
  pageLength: number = 6;
  visible = true;

  isAddEditBookModalOpen: boolean = false;
  isEditingEnabled: boolean = false;

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.currentPageBooks = this.listOfBooks.slice(
      this.currentPageStartIndex,
      this.pageLength
    );
  }

  ngOnChanges(): void {
    this.currentPageBooks = this.listOfBooks.slice(
      this.currentPageStartIndex,
      this.pageLength
    );
  }

  //******************************* Pagination methods **********************************
  //////////////////////////////////////////////////////////////////////////////////////
  previous() {
    if (this.currentPageStartIndex - this.pageLength < 0) {
      return;
    }

    const lastBookIndexOfCurrentPage = this.currentPageStartIndex;
    this.currentPageStartIndex -= this.pageLength;

    this.currentPageBooks = this.listOfBooks.slice(
      this.currentPageStartIndex,
      lastBookIndexOfCurrentPage
    );
  }

  next() {
    if (this.currentPageStartIndex + this.pageLength >= this.listOfBooks.length)
      return;

    this.currentPageStartIndex += this.pageLength;
    let lastCityIndexOfCurrentPage;

    if (this.currentPageStartIndex + this.pageLength < this.listOfBooks.length)
      lastCityIndexOfCurrentPage = this.currentPageStartIndex + this.pageLength;
    else lastCityIndexOfCurrentPage = this.listOfBooks.length;

    this.currentPageBooks = this.listOfBooks.slice(
      this.currentPageStartIndex,
      lastCityIndexOfCurrentPage
    );
  }
  //////////////////////////////////////////////////////////////////////////////////////

  //******************************* Sorting methods ************************************
  //////////////////////////////////////////////////////////////////////////////////////
  sortByTitleAscending() {
    this.listOfBooks.sort((a, b) => a.title.localeCompare(b.title));
    this.currentPageBooks = this.listOfBooks.slice(
      this.currentPageStartIndex,
      this.pageLength
    );
    this.visible = false;
  }

  sortByTitleDescending() {
    this.listOfBooks.sort((a, b) => b.title.localeCompare(a.title));
    this.currentPageBooks = this.listOfBooks.slice(
      this.currentPageStartIndex,
      this.pageLength
    );
    this.visible = false;
  }

  sortByGenreAscending() {
    this.listOfBooks.sort((a, b) => a.genre.localeCompare(b.genre));
    this.currentPageBooks = this.listOfBooks.slice(
      this.currentPageStartIndex,
      this.pageLength
    );
    this.visible = false;
  }

  sortByGenreDescending() {
    this.listOfBooks.sort((a, b) => b.genre.localeCompare(a.genre));
    this.currentPageBooks = this.listOfBooks.slice(
      this.currentPageStartIndex,
      this.pageLength
    );
    this.visible = false;
  }

  sortByStartDateAscending() {
    this.listOfBooks.sort((a, b) => {
      const dateA = a.dateStarted.split('/').reverse().join('-'); // rearrange to yyyy-mm-dd format
      const dateB = b.dateStarted.split('/').reverse().join('-'); // rearrange to yyyy-mm-dd format
      return Date.parse(dateA) - Date.parse(dateB);
    });
    this.currentPageBooks = this.listOfBooks.slice(
      this.currentPageStartIndex,
      this.pageLength
    );
    this.visible = false;
  }

  sortByStartDateDescending() {
    this.listOfBooks.sort((a, b) => {
      const dateA = a.dateStarted.split('/').reverse().join('-');
      const dateB = b.dateStarted.split('/').reverse().join('-');
      return Date.parse(dateB) - Date.parse(dateA);
    });
    this.currentPageBooks = this.listOfBooks.slice(
      this.currentPageStartIndex,
      this.pageLength
    );
    this.visible = false;
  }

  sortByRatingAscending() {
    this.listOfBooks.sort((a, b) => a.rating - b.rating);
    this.currentPageBooks = this.listOfBooks.slice(
      this.currentPageStartIndex,
      this.pageLength
    );
    this.visible = false;
  }

  sortByRatingDescending() {
    this.listOfBooks.sort((a, b) => b.rating - a.rating);
    this.currentPageBooks = this.listOfBooks.slice(
      this.currentPageStartIndex,
      this.pageLength
    );
    this.visible = false;
  }

  sortByTotalPagesAscending() {
    this.listOfBooks.sort((a, b) => a.totalPages - b.totalPages);
    this.currentPageBooks = this.listOfBooks.slice(
      this.currentPageStartIndex,
      this.pageLength
    );
    this.visible = false;
  }

  sortByTotalPagesDescending() {
    this.listOfBooks.sort((a, b) => b.totalPages - a.totalPages);
    this.currentPageBooks = this.listOfBooks.slice(
      this.currentPageStartIndex,
      this.pageLength
    );
    this.visible = false;
  }
  //////////////////////////////////////////////////////////////////////////////////////

  //************************** Book manipulation methods *******************************
  //this method is called when user deletes a book in order to delete it from UI
  deleteBook(id: string) {
    this.listOfBooks.splice(
      this.listOfBooks.findIndex((item) => item.bookId === id),
      1
    );
    this.currentPageBooks = this.listOfBooks.slice(
      this.currentPageStartIndex,
      this.currentPageStartIndex + this.pageLength
    );

    // If the last book on this page was just deleted, go to the previous page
    if (this.currentPageBooks.length === 0) this.previous();
  }
  //////////////////////////////////////////////////////////////////////////////////////

  onOpenViewDetailsModal() {
    this.isAddEditBookModalOpen = true;
    this.isEditingEnabled = false;
  }

  onAddBookClick() {
    this.isAddEditBookModalOpen = true;
    this.isEditingEnabled = true;

    this.bookService.editedBook = this.bookService.emptyBook();
  }
}
