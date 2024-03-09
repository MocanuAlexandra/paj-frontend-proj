import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AddEditValidators } from '../../helpers/add-edit-book-validators';
import { BookService } from 'src/app/services/book.service';

@Component({
  selector: 'app-add-edit-book-modal',
  templateUrl: './add-edit-book-modal.component.html',
  styleUrls: ['./add-edit-book-modal.component.scss'],
})
export class AddEditBookModalComponent {
  @Input() isVisible: boolean = false;
  @Input() isEditingEnabled: boolean = false;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();

  bookEditForm!: FormGroup;

  constructor(private bookService: BookService) {
    bookService.editedBookSubject.subscribe(() => {
      this.initializeForm();
    });
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    const editedBook = this.bookService.editedBook;

    this.bookEditForm = new FormGroup({
      title: new FormControl(editedBook.title, [Validators.required]),
      author: new FormControl(editedBook.author, [Validators.required]),
      description: new FormControl(editedBook.description, [
        Validators.required,
      ]),
      personalNotes: new FormControl(editedBook.personalNotes),
      rating: new FormControl(editedBook.rating, [
        Validators.required,
        AddEditValidators.ratingValidator,
      ]),
      currentPage: new FormControl(editedBook.currentPage, [
        Validators.required,
        Validators.min(0),
        this.isEditingEnabled
          ? Validators.max(editedBook.totalPages)
          : Validators.nullValidator,
      ]),
      totalPages: new FormControl(editedBook.totalPages, [
        Validators.required,
        Validators.min(1),
        AddEditValidators.pagesValidator,
      ]),
      dateStarted: new FormControl(editedBook.dateStarted, [
        Validators.required,
        AddEditValidators.dateValidator,
      ]),
      genre: new FormControl(editedBook.genre, [Validators.required]),
    });

    // Subscribe to changes in totalPages to update the max validator for currentPage
    this.bookEditForm
      .get('totalPages')!
      .valueChanges.subscribe((totalPages) => {
        this.bookEditForm
          .get('currentPage')!
          .setValidators([
            Validators.required,
            Validators.min(0),
            Validators.max(totalPages),
          ]);
        this.bookEditForm.get('currentPage')!.updateValueAndValidity();
      });
  }

  //click methods
  onOk(): void {
    this.closeModal.emit(true);
  }

  onCancel(): void {
    this.closeModal.emit(true);
  }

  onSubmitForm(): void {
    const editedBook = this.bookService.editedBook;

    editedBook.title = this.bookEditForm.value.title;
    editedBook.author = this.bookEditForm.value.author;
    editedBook.description = this.bookEditForm.value.description;
    editedBook.personalNotes = this.bookEditForm.value.personalNotes;
    editedBook.rating = this.bookEditForm.value.rating;
    editedBook.currentPage = this.bookEditForm.value.currentPage;
    editedBook.totalPages = this.bookEditForm.value.totalPages;
    editedBook.dateStarted = this.bookEditForm.value.dateStarted;
    editedBook.genre = this.bookEditForm.value.genre;

    this.bookService.updateOrCreateBook(editedBook);

    this.closeModal.emit(true);
  }

  // getters
  get title(): FormControl {
    return this.bookEditForm.get('title') as FormControl;
  }
  get author(): FormControl {
    return this.bookEditForm.get('author') as FormControl;
  }
  get description(): FormControl {
    return this.bookEditForm.get('description') as FormControl;
  }
  get personalNotes(): FormControl {
    return this.bookEditForm.get('personalNotes') as FormControl;
  }
  get rating(): FormControl {
    return this.bookEditForm.get('rating') as FormControl;
  }
  get currentPage(): FormControl {
    return this.bookEditForm.get('currentPage') as FormControl;
  }
  get totalPages(): FormControl {
    return this.bookEditForm.get('totalPages') as FormControl;
  }
  get dateStarted(): FormControl {
    return this.bookEditForm.get('dateStarted') as FormControl;
  }
  get genre(): FormControl {
    return this.bookEditForm.get('genre') as FormControl;
  }

  // Function to calculate the progress percentage
  calculateProgress(): number {
    const currentPage = this.bookEditForm!.get('currentPage')!.value;
    const totalPages = this.bookEditForm!.get('totalPages')!.value;

    if (totalPages > 0) {
      return (currentPage / totalPages) * 100;
    } else {
      return 0;
    }
  }

  // Format function for the progress bar (optional)
  formatProgress(percent: number): string {
    return `${percent.toFixed(2)}%`;
  }
}
