import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Item {
  id: number;
  name: string;
  image: string;
  description: string;
  price: number;
  category: string; // "product" o "service"
}

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})

export class ProductDetailComponent implements OnInit {
  item: Item | null = null;
  loading = true;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.http.get<{ products: Item[], services: Item[] }>('/assets/products.json').subscribe({
        next: (data) => {
          // Busca el producto o servicio por ID
          const foundProduct = data.products.find(item => item.id === parseInt(id));
          const foundService = data.services.find(item => item.id === parseInt(id));
          // Asigna el producto o servicio encontrado a la variable `item`
          this.item = foundProduct || foundService || null;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error al cargar los detalles:', error);
          this.loading = false;
        }
      });
    } else {
      console.error('ID no encontrado');
      this.loading = false;
    }
  }
}
