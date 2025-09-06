// src/app/shared/products.ts
export type Product = {
    id: number;
    name: string;
    price: number;
    image: string;
    description: string;
  };
  
  export const PRODUCTS: Product[] = [
    { id: 1, name: 'T-shirt CamLoop', price: 19.99, image: 'https://picsum.photos/seed/shirt/400/300', description: 'T-shirt en coton bio, logo discret.' },
    { id: 2, name: 'Moom CamLoop',    price: 12.50, image: 'https://picsum.photos/seed/mug/400/300',   description: 'Mug céramique, 350ml.' },
    { id: 3, name: 'Anti-colic Bottles',  price: 24.00, image: 'https://picsum.photos/seed/cap/400/300',   description: 'Casquette réglable, tissu respirant.' },
    { id: 4, name: 'Sac à dos CalmLoop',      price: 49.00, image: 'https://picsum.photos/seed/bag/400/300',   description: 'Sac 20L multipoche, durable.' }
  ];
  