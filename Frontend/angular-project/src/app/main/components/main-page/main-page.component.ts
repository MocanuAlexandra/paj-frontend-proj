import { Component } from '@angular/core';
import { Book } from '../../../interfaces/book';
import { BooksDashboardComponent } from "../books-dashboard/books-dashboard.component";
import { BookService } from 'src/app/services/book.service';

@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent {
  listOfBooks!: Book[];

  constructor(
    private bookService:BookService,
  ) {
    // Listen for any changes in the books list
    this.bookService.listOfBooksSubject.subscribe((res) => {
      this.listOfBooks = [...res];
    });
  }

  ngOnInit(): void {
    this.listOfBooks = this.bookService.listOfBooks;
  }
}
