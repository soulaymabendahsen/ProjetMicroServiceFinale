import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ComplaintService } from '../../services/complaint.service';
import { BookService } from '../../services/book.service';
import { ComplaintCategory, ComplaintPriority, ComplaintStatus } from '../../models/complaint';
import { Book } from '../../models/Books';

@Component({
  selector: 'app-reclamation-update',
  templateUrl: './reclamation-update.component.html',
  styleUrls: ['./reclamation-update.component.css']
})
export class ReclamationUpdateComponent implements OnInit {
  complaintId: string = '';
  complaintForm!: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  success = '';

  categories = Object.values(ComplaintCategory);
  priorities = Object.values(ComplaintPriority);
  statuses = Object.values(ComplaintStatus);
  books: Book[] = [];
  loadingBooks = false;
  isAdmin = true; // À remplacer par une vérification d'authentification réelle

  constructor(
    private formBuilder: FormBuilder,
    private complaintService: ComplaintService,
    private bookService: BookService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.complaintId = this.route.snapshot.paramMap.get('id') || '';

    if (!this.complaintId) {
      this.error = 'ID de réclamation non valide';
      return;
    }

    this.initForm();
    this.loadBooks();
    this.loadComplaintDetails();
  }

  initForm(): void {
    this.complaintForm = this.formBuilder.group({
      userName: ['', [Validators.required, Validators.minLength(3)]],
      userEmail: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      category: ['', Validators.required],
      priority: ['', Validators.required],
      bookId: [''],
      bookTitle: [''],
      status: [''],
      adminResponse: [''],
      isResolved: [false]
    });

    // Désactiver les champs réservés aux administrateurs pour les utilisateurs normaux
    if (!this.isAdmin) {
      this.complaintForm.get('status')?.disable();
      this.complaintForm.get('adminResponse')?.disable();
      this.complaintForm.get('isResolved')?.disable();
    }
  }

  loadBooks(): void {
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
  }

  loadComplaintDetails(): void {
    this.loading = true;
    this.complaintService.getComplaintById(this.complaintId).subscribe({
      next: (data) => {
        // Remplir le formulaire avec les données de la réclamation
        this.complaintForm.patchValue({
          userName: data.userName,
          userEmail: data.userEmail,
          subject: data.subject,
          description: data.description,
          category: data.category,
          priority: data.priority,
          bookId: data.bookId,
          bookTitle: data.bookTitle,
          status: data.status,
          adminResponse: data.adminResponse,
          isResolved: data.isResolved
        });
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des détails de la réclamation: ' + err.message;
        this.loading = false;
      }
    });
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

    // Préparer les données à envoyer
    const formValues = this.complaintForm.value;

    // Créer un objet avec uniquement les champs autorisés par le schéma de validation
    const complaintData: any = {};

    // Ajouter les champs de base (toujours autorisés)
    if (formValues.subject) complaintData.subject = formValues.subject;
    if (formValues.description) complaintData.description = formValues.description;
    if (formValues.category) complaintData.category = formValues.category;
    if (formValues.priority) complaintData.priority = formValues.priority;

    // Ajouter les champs réservés aux admins si l'utilisateur est admin
    if (this.isAdmin) {
      if (formValues.status) complaintData.status = formValues.status;
      if (formValues.adminResponse !== undefined) complaintData.adminResponse = formValues.adminResponse;
      if (formValues.isResolved !== undefined) complaintData.isResolved = formValues.isResolved;
    }

    // Temporairement désactivé (XAMPP non démarré)
    // if (formValues.bookId) complaintData.bookId = formValues.bookId;
    // if (formValues.bookTitle) complaintData.bookTitle = formValues.bookTitle;

    console.log('Données envoyées au serveur:', complaintData);

    this.complaintService.updateComplaint(this.complaintId, complaintData).subscribe({
      next: () => {
        this.success = 'Réclamation mise à jour avec succès!';
        this.loading = false;

        // Rediriger vers les détails de la réclamation après 2 secondes
        setTimeout(() => {
          this.router.navigate(['/reclamation-details', this.complaintId]);
        }, 2000);
      },
      error: (err) => {
        console.error('Erreur complète:', err);
        let errorMessage = 'Erreur lors de la mise à jour de la réclamation';

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
