import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Book } from 'src/app/interfaces/book';
import { BookService } from 'src/app/services/book.service';

@Component({
  selector: 'app-main-page-guest',
  templateUrl: './main-page-guest.component.html',
  styleUrl: './main-page-guest.component.scss'
})
export class MainPageGuestComponent {
  listOfBooks!: Book[];

  constructor(
    private bookService:BookService,
    private router: Router,
  ) {
    // Listen for any changes in the books list
    this.bookService.listOfBooksSubject.subscribe((res: any) => {
      this.listOfBooks = [...res];
    });
  }

  ngOnInit(): void {
    // Request the books for guest from the server
    this.bookService.requestBooksForGuest();
  }

  navigateToRegisterPage() {
    // Take the user to register page
    this.router.navigate(['/auth/register']);
  }
}
