import { Component, OnInit } from '@angular/core';
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

      <!-- Add/Edit Form -->
      <div class="form-container">
        <h2>{{ editingBook ? 'Edit Book' : 'Add New Book' }}</h2>
        <form (ngSubmit)="saveBook()" #bookForm="ngForm">
          <div class="form-group">
            <label for="title">Title:</label>
            <input type="text" id="title" [(ngModel)]="currentBook.title" name="title" required>
          </div>
          <div class="form-group">
            <label for="author">Author:</label>
            <input type="text" id="author" [(ngModel)]="currentBook.author" name="author" required>
          </div>
          <div class="form-group">
            <label for="year">Year:</label>
            <input type="number" id="year" [(ngModel)]="currentBook.year" name="year" required>
          </div>
          <button type="submit" [disabled]="!bookForm.form.valid">
            {{ editingBook ? 'Update' : 'Add' }} Book
          </button>
          <button type="button" *ngIf="editingBook" (click)="cancelEdit()">Cancel</button>
        </form>
      </div>

      <!-- Books List -->
      <div class="books-list">
        <h2>Books List</h2>
        <div *ngIf="books.length === 0" class="no-books">
          No books found. Add some books above.
        </div>
        <div *ngFor="let book of books" class="book-item">
          <div class="book-info">
            <h3>{{ book.title }}</h3>
            <p><strong>Author:</strong> {{ book.author }}</p>
            <p><strong>Year:</strong> {{ book.year }}</p>
          </div>
          <div class="book-actions">
            <button (click)="editBook(book)">Edit</button>
            <button (click)="deleteBook(book.id!)" class="delete-btn">Delete</button>
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
    }
    .form-container {
      background: #f5f5f5;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 30px;
    }
    .form-group {
      margin-bottom: 15px;
    }
    label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
    }
    input {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    button {
      padding: 10px 15px;
      margin-right: 10px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      background: #007bff;
      color: white;
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
      padding: 15px;
      border: 1px solid #ddd;
      border-radius: 8px;
      margin-bottom: 10px;
      background: white;
    }
    .book-info h3 {
      margin: 0 0 10px 0;
    }
    .book-info p {
      margin: 5px 0;
    }
    .book-actions {
      display: flex;
      gap: 10px;
    }
    .no-books {
      text-align: center;
      color: #666;
      font-style: italic;
      padding: 20px;
    }
  `]
})
export class BooksComponent implements OnInit {
  books: Book[] = [];
  currentBook: Book = { title: '', author: '', year: 0 };
  editingBook: boolean = false;

  constructor(private bookService: BookService) { }

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.bookService.getBooks().subscribe({
      next: (data) => this.books = data,
      error: (error) => console.error('Error loading books:', error)
    });
  }

  saveBook(): void {
    if (this.editingBook && this.currentBook.id) {
      this.bookService.updateBook(this.currentBook.id, this.currentBook).subscribe({
        next: () => {
          this.loadBooks();
          this.resetForm();
        },
        error: (error) => console.error('Error updating book:', error)
      });
    } else {
      this.bookService.createBook(this.currentBook).subscribe({
        next: () => {
          this.loadBooks();
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
        next: () => this.loadBooks(),
        error: (error) => console.error('Error deleting book:', error)
      });
    }
  }

  private resetForm(): void {
    this.currentBook = { title: '', author: '', year: 0 };
    this.editingBook = false;
  }
}