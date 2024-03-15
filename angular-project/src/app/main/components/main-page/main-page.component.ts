import { Component } from '@angular/core';
import { Book } from '../../../interfaces/book';
import { BookService } from 'src/app/services/book.service';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent {
  listOfBooks!: Book[];

  constructor(
    private bookService:BookService,
    private router: Router,
    private authenticationService: AuthenticationService,
  ) {
    // Listen for any changes in the books list
    this.bookService.listOfBooksSubject.subscribe((res: any) => {
      this.listOfBooks = [...res];
    });
  }

  ngOnInit(): void {
    // Request the books from the server
    this.bookService.requestBooks();
  }

  logout() {
    // Log the user out
    this.authenticationService.logout();

    // Take the user back to the login page
    this.router.navigate(['/auth/login']);
  }
}
