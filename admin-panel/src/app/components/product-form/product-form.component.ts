import { Component, ViewChild, ElementRef } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-form',
  standalone: false,
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>; 
  
  product = {
    sku: '',
    name: '',
    price: 0
  };

  constructor(private productService: ProductService, private router: Router) {}

  
  onSubmit(): void {
    if (!this.fileInput || !this.fileInput.nativeElement.files?.length) {
      alert('Please select at least one image');
      return;
    }

    const formData = new FormData();
    formData.append('sku', this.product.sku);
    formData.append('name', this.product.name);
    formData.append('price', this.product.price.toString());

    
    for (let i = 0; i < this.fileInput.nativeElement.files.length; i++) {
      formData.append('images', this.fileInput.nativeElement.files[i]);
    }

    this.productService.createProduct(formData).subscribe(() => {
      this.router.navigate(['/']);
    });
  }
}
