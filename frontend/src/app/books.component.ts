import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { BookService } from './book.service';
import { Book } from './book';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <h1>Books Management</h1>

      <div class="form-container">
        <h2>{{ editingBook ? 'Edit Book' : 'Add New Book' }}</h2>

        <form (ngSubmit)="saveBook()" #bookForm="ngForm">
          <div class="form-group">
            <label for="title">Title:</label>
            <input
              type="text"
              id="title"
              [(ngModel)]="currentBook.title"
              name="title"
              required
            >
          </div>

          <div class="form-group">
            <label for="author">Author:</label>
            <input
              type="text"
              id="author"
              [(ngModel)]="currentBook.author"
              name="author"
              required
            >
          </div>

          <div class="form-group">
            <label for="year">Year:</label>
            <input
              type="number"
              id="year"
              [(ngModel)]="currentBook.year"
              name="year"
              required
            >
          </div>

          <button type="submit" [disabled]="!bookForm.form.valid">
            {{ editingBook ? 'Update' : 'Add' }} Book
          </button>

          <button type="button" *ngIf="editingBook" (click)="cancelEdit()">
            Cancel
          </button>
        </form>
      </div>

      <div class="books-list">
        <h2>Books List</h2>

        <div *ngIf="books().length === 0" class="no-books">
          No books found. Add some books above.
        </div>

        <div *ngFor="let book of books(); trackBy: trackByBookId" class="book-item">
          <div class="book-info">
            <h3>{{ book.title }}</h3>
            <p><strong>Author:</strong> {{ book.author }}</p>
            <p><strong>Year:</strong> {{ book.year }}</p>
          </div>

          <div class="book-actions">
            <button type="button" (click)="editBook(book)">Edit</button>
            <button
              type="button"
              (click)="deleteBook(book.id!)"
              class="delete-btn"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      background: #ffffff;
      border-radius: 10px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }

    h1 {
      margin: 0 0 24px 0;
      color: #222;
      font-size: 2rem;
    }

    h2 {
      margin: 0 0 16px 0;
      color: #333;
      font-size: 1.4rem;
    }

    .form-container {
      background: #f5f5f5;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 30px;
      border: 1px solid #e0e0e0;
    }

    .form-group {
      margin-bottom: 15px;
    }

    label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
      color: #333;
    }

    input {
      box-sizing: border-box;
      width: 100%;
      padding: 9px 10px;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 1rem;
      background: #fff;
    }

    input:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.15);
    }

    button {
      padding: 10px 15px;
      margin-right: 10px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      background: #007bff;
      color: white;
      font-size: 0.95rem;
    }

    button:hover {
      background: #0056b3;
    }

    button:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .delete-btn {
      background: #dc3545;
    }

    .delete-btn:hover {
      background: #c82333;
    }

    .books-list {
      margin-top: 30px;
    }

    .book-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      padding: 15px;
      border: 1px solid #ddd;
      border-radius: 8px;
      margin-bottom: 10px;
      background: white;
    }

    .book-info h3 {
      margin: 0 0 10px 0;
      color: #222;
    }

    .book-info p {
      margin: 5px 0;
      color: #444;
    }

    .book-actions {
      display: flex;
      gap: 10px;
      flex-shrink: 0;
    }

    .no-books {
      text-align: center;
      color: #666;
      font-style: italic;
      padding: 20px;
      background: #fafafa;
      border: 1px dashed #ccc;
      border-radius: 8px;
    }

    @media (max-width: 600px) {
      .container {
        padding: 14px;
      }

      .book-item {
        align-items: flex-start;
        flex-direction: column;
      }

      .book-actions {
        width: 100%;
      }
    }
  `]
})
export class BooksComponent implements OnInit {
  books = signal<Book[]>([]);

  currentBook: Book = this.getEmptyBook();
  editingBook = false;

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.bookService.getBooks().subscribe({
      next: (data) => {
        this.books.set([...data]);
      },
      error: (error) => console.error('Error loading books:', error)
    });
  }

  saveBook(): void {
    if (this.editingBook && this.currentBook.id) {
      const id = this.currentBook.id;
      const bookToUpdate: Book = { ...this.currentBook };

      this.bookService.updateBook(id, bookToUpdate).subscribe({
        next: (updatedBook) => {
          const bookFromResponse = updatedBook ?? bookToUpdate;

          this.books.update((books) =>
            books.map((book) => book.id === id ? bookFromResponse : book)
          );

          this.resetForm();
        },
        error: (error) => console.error('Error updating book:', error)
      });
    } else {
      const bookToCreate: Book = { ...this.currentBook };

      this.bookService.createBook(bookToCreate).subscribe({
        next: (createdBook) => {
          this.books.update((books) => [...books, createdBook]);
          this.resetForm();
        },
        error: (error) => console.error('Error creating book:', error)
      });
    }
  }

  editBook(book: Book): void {
    this.currentBook = { ...book };
    this.editingBook = true;
  }

  cancelEdit(): void {
    this.resetForm();
  }

  deleteBook(id: string): void {
    if (confirm('Are you sure you want to delete this book?')) {
      this.bookService.deleteBook(id).subscribe({
        next: () => {
          this.books.update((books) => books.filter((book) => book.id !== id));
        },
        error: (error) => console.error('Error deleting book:', error)
      });
    }
  }

  trackByBookId(index: number, book: Book): string | number {
    return book.id ?? index;
  }

  private resetForm(): void {
    this.currentBook = this.getEmptyBook();
    this.editingBook = false;
  }

  private getEmptyBook(): Book {
    return {
      title: '',
      author: '',
      year: 0
    };
  }
}
