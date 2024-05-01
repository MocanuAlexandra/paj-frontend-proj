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
  listOfBooks: Book[]=[];
  successStatusCode = 200;

  constructor(
    private bookService: BookService,
    private router: Router,
    private authenticationService: AuthenticationService
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
    this.authenticationService.logout().then((statusCode: number) => {
      // If the user has logged out successfully, redirect to the login page
      if (statusCode === this.successStatusCode) {
        this.router.navigate(['/auth/login']);
      }
    });
  }
}
