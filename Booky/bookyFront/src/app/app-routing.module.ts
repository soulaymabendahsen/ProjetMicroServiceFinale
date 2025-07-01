import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddBookComponent } from './components/add-book/add-book.component';
import { PageBooksComponent } from './components/page-books/page-books.component';
import { CartComponent } from './components/cart/cart.component';
import { HomeComponent } from './components/home/home.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { BlankLayoutComponent } from './layouts/blank-layout/blank-layout.component';
import { CartBackComponent } from './components/cart-back/cart-back.component';
import { ListBooksComponent } from './components/list-books/list-books.component';
import { LayoutUpdateAddComponent } from './layouts/layout-update-add/layout-update-add.component';
import { UpdateBookComponent } from './components/update-book/update-book.component';
import { DashboardComponent } from './components/dashborad/dashborad.component';
import { BookDetailsComponent } from './components/book-details/book-details.component';
import { PaymentSuccessComponent } from './components/payment-success/payment-success.component';
import { PaymentBackComponent } from './components/payment-back/payment-back.component';
import { ReclamationListComponent } from './components/reclamation-list/reclamation-list.component';
import { ReclamationDetailsComponent } from './components/reclamation-details/reclamation-details.component';
import { ReclamationAddComponent } from './components/reclamation-add/reclamation-add.component';
import { ReclamationUpdateComponent } from './components/reclamation-update/reclamation-update.component';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent, // Contains navbar and footer
    children: [
      { path: 'books', component: PageBooksComponent },
      { path: 'cart', component: CartComponent },
      { path: 'home', component: HomeComponent },
      { path: '', redirectTo: '/home', pathMatch: 'full' },
      {
        path: 'payment-success',
        component: PaymentSuccessComponent,
        data: { showSuccess: true } // Optionnel pour gérer l'affichage
      }
    ]
  },
  {
    path: '',
    component: BlankLayoutComponent, // No navbar or footer
    children: [

      { path: 'dashboard', component: DashboardComponent},
      { path: 'bookList', component: ListBooksComponent },
      { path: 'carts', component: CartBackComponent },
      { path: 'books/:id', component: PageBooksComponent }, // Route pour les détails d'un livre
      { path: 'payments', component: PaymentBackComponent },
      { path: 'reclamations', component: ReclamationListComponent },
      { path: 'reclamation-details/:id', component: ReclamationDetailsComponent },

    ]
  },
  {
    path: '',
    component: LayoutUpdateAddComponent, // No navbar or footer
    children: [

      { path: 'add-book', component: AddBookComponent },
      {
        path: 'update-book/:id', // Route avec paramètre ID
        component: UpdateBookComponent
      },
      { path: 'add-reclamation', component: ReclamationAddComponent },
      {
        path: 'update-reclamation/:id', // Route avec paramètre ID
        component: ReclamationUpdateComponent
      },

    ]
  },
  { path: 'book-details/:id', component: BookDetailsComponent },

];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }