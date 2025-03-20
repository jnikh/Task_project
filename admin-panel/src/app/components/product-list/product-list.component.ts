import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../../product.model';
import { ProductService } from '../../services/product.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-product-list',
  standalone:false,
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  apps: any[] = []; 
  modalRef: NgbModalRef | null = null; 
  selectedProduct: any = null; 
  selectedAppId: number | null = null; 
  data: any = null; 

  @ViewChild('viewModal') viewModal!: TemplateRef<any>; 

  constructor(
    private productService: ProductService,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.loadApps(); 
  }

  
  loadApps() {
    this.productService.getAllProducts().subscribe({
      next: (response: any) => {
        console.log("Raw API Response:", response);
        this.apps = response.map((product: any) => ({
          ...product,
          price: parseFloat(product.price) || 0, 
        }));
        console.log("Processed Products:", this.apps);
      },
      error: (err) => console.error("Error fetching products:", err),
    });
  }

  openViewModal(app: any) {
    this.selectedAppId = app.id; 
    this.viewProduct(app.id); 
  }

 
  viewProduct(id: number) {
    console.log("Fetching product for ID:", id);

    if (!id) {
      console.error("Invalid Product ID:", id);
      return;
    }

    this.productService.getProductById(id).subscribe({
      next: (response) => {
        this.data = response; 
        console.log("Product Details:", this.data);
        this.modalRef = this.modalService.open(this.viewModal, { centered: true }); 
      },
      error: (err) => {
        console.error("Error fetching product details:", err);
      }
    });
  }

 
  deleteProduct(id: number) {
    if (id) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.apps = this.apps.filter(app => app.id !== id);
          console.log(`Product with ID ${id} deleted successfully`);
        },
        error: (err) => {
          console.error("Error deleting product:", err);
        }
      });
    }
  }

  
  goToAddProduct() {
    this.router.navigate(['/add-product']);
  }
}