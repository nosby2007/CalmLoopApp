// src/app/shared/product.ts
export type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
};

export const PRODUCTS: Product[] = [
  { id: 1, name: 'Liniment douceur',      price: 9.90,  image: 'https://res.cloudinary.com/dtdpx59sc/image/upload/v1731465599/website%20assets/remedy_clinical_Crea_Mosturizer_gie4ws.jpg', description: 'Nettoie et protège délicatement la peau de bébé.' },
  { id: 2, name: 'Crème hydratante',      price: 12.50, image: 'https://res.cloudinary.com/dtdpx59sc/image/upload/v1731465596/website%20assets/remedy_moisturized_related_cream_jca5ot.jpg', description: 'Formule hypoallergénique, sans parfum.' },
  { id: 3, name: 'Tire-lait confort',     price: 59.00, image: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?q=80&w=1000&auto=format&fit=crop', description: 'Silencieux et ergonomique pour l’allaitement.' },
  { id: 4, name: 'Gigoteuse coton bio',   price: 29.90, image: 'https://res.cloudinary.com/dtdpx59sc/image/upload/v1731650627/website%20assets/cleanse_2_nxjh9m.jpg', description: 'Textile tout doux pour des nuits sereines.' },
  { id: 5, name: 'Thermomètre douceur',   price: 18.00, image: 'https://picsum.photos/seed/thermo/1000/700', description: 'Lecture rapide, embout souple.' },
  { id: 6, name: 'Mug maman courage',     price: 12.00, image: 'https://res.cloudinary.com/dtdpx59sc/image/upload/v1757128268/IMG_2679_skxglo.jpg',    description: 'Un boost de tendresse au petit-déj.' },
  { id: 7, name: 'Coussin d’allaitement', price: 35.00, image: 'https://picsum.photos/seed/pillow/1000/700', description: 'Maintien optimal, housse lavable.' },
  { id: 8, name: 'Lingettes ultra-douces',price: 4.90,  image: 'https://picsum.photos/seed/wipes/1000/700',  description: 'Respecte les peaux sensibles.' }
];
