import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ComplaintService } from '../../services/complaint.service';
// import { BookService } from '../../services/book.service'; // Temporairement désactivé
import { ComplaintCategory, ComplaintPriority } from '../../models/complaint';
import { Book } from '../../models/Books';

@Component({
  selector: 'app-reclamation-add',
  templateUrl: './reclamation-add.component.html',
  styleUrls: ['./reclamation-add.component.css']
})
export class ReclamationAddComponent implements OnInit {
  complaintForm!: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  success = '';

  categories = Object.values(ComplaintCategory);
  priorities = Object.values(ComplaintPriority);
  books: Book[] = [];
  loadingBooks = false;

  constructor(
    private formBuilder: FormBuilder,
    private complaintService: ComplaintService,
    // private bookService: BookService, // Temporairement désactivé
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadBooks();
  }

  initForm(): void {
    this.complaintForm = this.formBuilder.group({
      userName: ['', [Validators.required, Validators.minLength(3)]],
      userEmail: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      category: [ComplaintCategory.OTHER, Validators.required],
      priority: [ComplaintPriority.MEDIUM, Validators.required],
      bookId: [''],
      bookTitle: ['']
    });
  }

  loadBooks(): void {
    // Temporairement désactivé car XAMPP n'est pas démarré
    this.loadingBooks = false;
    this.books = []; // Liste vide
    console.log('Chargement des livres désactivé (XAMPP non démarré)');

    // Code original commenté
    /*
    this.loadingBooks = true;
    this.bookService.getBooks().subscribe({
      next: (books) => {
        this.books = books;
        this.loadingBooks = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des livres:', err);
        this.loadingBooks = false;
      }
    });
    */
  }

  onBookSelect(event: any): void {
    const bookId = event.target.value;
    if (bookId) {
      const selectedBook = this.books.find(book => book.id === +bookId);
      if (selectedBook) {
        this.complaintForm.patchValue({
          bookTitle: selectedBook.title
        });
      }
    } else {
      this.complaintForm.patchValue({
        bookTitle: ''
      });
    }
  }

  onSubmit(): void {
    this.submitted = true;

    // Stop if form is invalid
    if (this.complaintForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    // Préparation des données à envoyer
    const formValues = this.complaintForm.value;

    // Création d'un objet conforme au format attendu par le backend
    const complaintData: any = {
      userName: formValues.userName,
      userEmail: formValues.userEmail,
      subject: formValues.subject,
      description: formValues.description,
      category: formValues.category,
      priority: formValues.priority || 'MEDIUM'
      // Ne pas inclure status et isResolved car ils ne sont pas acceptés par le validateur
      // status: 'PENDING',
      // isResolved: false
    };

    // Champs liés aux livres temporairement désactivés (XAMPP non démarré)
    /*
    if (formValues.bookId) {
      complaintData.bookId = formValues.bookId;
    }

    if (formValues.bookTitle) {
      complaintData.bookTitle = formValues.bookTitle;
    }
    */

    console.log('Données envoyées au serveur:', complaintData);

    this.complaintService.createComplaint(complaintData).subscribe({
      next: () => {
        this.success = 'Réclamation envoyée avec succès!';
        this.loading = false;

        // Rediriger vers la page d'accueil après 2 secondes
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 2000);
      },
      error: (err) => {
        console.error('Erreur complète:', err);
        let errorMessage = 'Erreur lors de l\'envoi de la réclamation';

        if (err.error && err.error.details) {
          // Afficher les détails de validation du backend
          errorMessage += ': ' + err.error.details.join(', ');
        } else if (err.error && err.error.message) {
          // Afficher le message d'erreur du backend
          errorMessage += ': ' + err.error.message;
        } else if (err.message) {
          // Afficher le message d'erreur général
          errorMessage += ': ' + err.message;
        }

        this.error = errorMessage;
        this.loading = false;
      }
    });
  }

  // Getter pour accéder facilement aux contrôles du formulaire
  get f() { return this.complaintForm.controls; }
}
