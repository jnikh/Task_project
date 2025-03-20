import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-edit-product',
  standalone: false,
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css'],
})
export class EditProductComponent implements OnInit {
  editForm!: FormGroup;
  productId!: number;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.productId = Number(this.route.snapshot.paramMap.get('id'));
    console.log('Fetching product with ID:', this.productId);

    this.productService.getProductById(this.productId).subscribe((product) => {
      if (product) {
        console.log(`product data` , product)
        this.editForm = this.fb.group({
          name: [product.name || '' ],
          price: [product.price || ''],
          sku: [product.sku || ''],  
          image: [product.images ? product.images[0] : null]  
        });

     
        if (product.images && product.images.length > 0) {
          this.imagePreview = product.images[0];
        }
      }
    });
  }

  onFileSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result; 
        this.editForm.patchValue({ image: file }); 
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('name', this.editForm.get('name')?.value || '');
    formData.append('price', this.editForm.value.price);
    formData.append('sku', this.editForm.value.sku);

   
    if (this.editForm.value.image instanceof File) {
      formData.append('images', this.editForm.value.image);
    }

    this.productService.updateProduct(this.productId, formData).subscribe({
      next: (updatedProduct) => {
        this.editForm.patchValue({
          name: updatedProduct.name,
          price: updatedProduct.price,
          sku: updatedProduct.sku,
          image: updatedProduct.images ? updatedProduct.images[0] : null
        });
       
        if (updatedProduct.images && updatedProduct.images.length > 0) {
          this.imagePreview = updatedProduct.images[0];
        }
        this.router.navigate(['/']); 
      },
      error: (err) => {
        console.error('Update failed:', err);
      },
    });
  }
}