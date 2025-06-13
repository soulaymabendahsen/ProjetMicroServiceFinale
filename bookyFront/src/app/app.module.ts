import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddBookComponent } from './components/add-book/add-book.component';
import { HttpClientModule } from '@angular/common/http';
import { DashboardComponent } from './components/dashborad/dashborad.component';
import { PageBooksComponent } from './components/page-books/page-books.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { CartComponent } from './components/cart/cart.component';
import { FooterComponent } from './components/footer/footer.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { BlankLayoutComponent } from './layouts/blank-layout/blank-layout.component';
import { DashSidebarComponent } from './components/dash-sidebar/dash-sidebar.component';
import { CartBackComponent } from './components/cart-back/cart-back.component';
import { ListBooksComponent } from './components/list-books/list-books.component';
import { LayoutUpdateAddComponent } from './layouts/layout-update-add/layout-update-add.component';
import { UpdateBookComponent } from './components/update-book/update-book.component';
import { QRCodeModule } from 'angularx-qrcode';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CustomSnackBarComponent } from './components/custom-snack-bar/custom-snack-bar.component';
import { RouterModule } from '@angular/router';
import { BookDetailsComponent } from './components/book-details/book-details.component';
import { PaymentBackComponent } from './components/payment-back/payment-back.component';
import { PaymentSuccessComponent } from './components/payment-success/payment-success.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ReclamationDetailsComponent } from './components/reclamation-details/reclamation-details.component';
import { ReclamationListComponent } from './components/reclamation-list/reclamation-list.component';
import { ReclamationAddComponent } from './components/reclamation-add/reclamation-add.component';
import { ReclamationUpdateComponent } from './components/reclamation-update/reclamation-update.component';

@NgModule({
  declarations: [
    AppComponent,
    AddBookComponent,
    DashboardComponent,
    PageBooksComponent,
    NavbarComponent,
    HomeComponent,
    CartComponent,
    FooterComponent,
    MainLayoutComponent,
    BlankLayoutComponent,
    DashSidebarComponent,
    CartBackComponent,
    ListBooksComponent,
    UpdateBookComponent,
    LayoutUpdateAddComponent,
    CustomSnackBarComponent,
    BookDetailsComponent,
    PaymentBackComponent,
    PaymentSuccessComponent,
    ReclamationDetailsComponent,
    ReclamationListComponent,
    ReclamationAddComponent,
    ReclamationUpdateComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    RouterModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    QRCodeModule,
    MatSnackBarModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule
  ],
  providers: [
    DatePipe,
    CurrencyPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
