import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Chart, registerables } from 'chart.js';
import { Book } from 'src/app/models/Books';
import { BookService } from 'src/app/services/book.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashborad.component.html',
  styleUrls: ['./dashborad.component.css']
})
export class DashboardComponent implements OnInit {
  pieChart: any;
  barChart: any;
  bookStats: {bookTitle: string, totalQuantity: number}[] = [];
  books: Book[] = [];
  readonly LOW_STOCK_THRESHOLD = 5;
  readonly CRITICAL_STOCK_THRESHOLD = 2;

  constructor(private cartService: CartService, private bookService: BookService) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.loadCartData();
    this.loadBooks();
  }

  loadCartData(): void {
    this.cartService.getCartItems().subscribe({
      next: (carts) => {
        this.processCartData(carts);
        this.createPieChart();
      },
      error: (err) => {
        console.error('Error loading cart data:', err);
      }
    });
  }

  processCartData(carts: any[]): void {
    const bookQuantityMap = new Map<string, number>();
    
    carts.forEach(cart => {
      if (cart.bookTitle) {
        const currentQuantity = bookQuantityMap.get(cart.bookTitle) || 0;
        bookQuantityMap.set(cart.bookTitle, currentQuantity + (cart.quantity || 1));
      }
    });

    this.bookStats = Array.from(bookQuantityMap.entries())
      .map(([bookTitle, totalQuantity]) => ({ bookTitle, totalQuantity }))
      .sort((a, b) => b.totalQuantity - a.totalQuantity);
  }

  createPieChart(): void {
    const ctx = document.getElementById('pieChart') as HTMLCanvasElement;
    
    if (this.pieChart) {
      this.pieChart.destroy();
    }

    const backgroundColors = this.generateDistinctColors(this.bookStats.length);

    this.pieChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: this.bookStats.map(item => item.bookTitle),
        datasets: [{
          data: this.bookStats.map(item => item.totalQuantity),
          backgroundColor: backgroundColors,
          borderColor: 'white',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              font: {
                size: 12
              }
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.raw || 0;
                const total = context.dataset.data.reduce((acc: number, data: any) => acc + data, 0);
                const percentage = Math.round((Number(value) / Number(total)) * 100);
                return `${label}: ${value} unités (${percentage}%)`;
              }
            }
          }
        }
      }
    });
  }

  loadBooks(): void {
    this.bookService.getBooks().subscribe({
      next: (data: Book[]) => {
        this.books = data;
        this.createBarChart();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des livres:', error);
      }
    });
  }

  createBarChart(): void {
    const ctx = document.getElementById('barChart') as HTMLCanvasElement;
    if (!ctx) return;

    if (this.barChart) {
      this.barChart.destroy();
    }

    const bookData = this.books
      .sort((a, b) => (b.soldQuantity || 0) - (a.soldQuantity || 0))
      .slice(0, 5);

    this.barChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: bookData.map(book => book.title),
        datasets: [{
          label: 'Quantité vendue',
          data: bookData.map(book => book.soldQuantity || 0),
          backgroundColor: '#4361ee',
          borderColor: '#3a56d4',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Nombre d\'exemplaires vendus'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Titres des livres'
            }
          }
        }
      }
    });
  }

  getLowStockBooks(): Book[] {
    return this.books
      .filter(book => book.quantite < this.LOW_STOCK_THRESHOLD)
      .sort((a, b) => a.quantite - b.quantite);
  }

  generateDistinctColors(count: number): string[] {
    const colorPalette = [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
      '#FF9F40', '#8AC24A', '#EA5F89', '#00BCD4', '#F06292',
      '#673AB7', '#009688', '#E91E63', '#3F51B5', '#CDDC39',
      '#FF5722', '#607D8B', '#795548', '#9C27B0', '#2196F3'
    ];
    
    const colors = [];
    for (let i = 0; i < count; i++) {
      colors.push(colorPalette[i % colorPalette.length]);
    }
    
    return colors;
  }
}