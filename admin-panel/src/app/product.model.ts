export interface Product {
    id?: number; // Optional for new products
    sku: string;
    name: string;
    price: string;
    images: string[]; // Array of image URLs
    createdAt?: string;
    updatedAt?: string;
  }
  
  export interface ProductCreatePayload {
    sku: string;
    name: string;
    price: string;
    images: File[]; // Array of image files for upload
  }
  
  export interface ProductUpdatePayload {
    sku?: string;
    name?: string;
    price?: string;
    images?: File[];
  }
  
  export interface DeleteProductResponse {
    message: string;
  }
  