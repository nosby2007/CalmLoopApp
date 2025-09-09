// src/app/shared/product.ts
export type Category = 'soins' | 'allaitement' | 'puericulture' | 'textile';

export const CATEGORIES: { id: Category; label: string }[] = [
  { id: 'soins',        label: 'Soins Bébé' },
  { id: 'allaitement',  label: 'Allaitement' },
  { id: 'puericulture', label: 'Puériculture' },
  { id: 'textile',      label: 'Textile tout doux' }
];

export type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  category: Category; // ✅ nouvelle propriété
};

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Liniment douceur',
    price: 9.90,
    image: 'https://res.cloudinary.com/dtdpx59sc/image/upload/v1731465599/website%20assets/remedy_clinical_Crea_Mosturizer_gie4ws.jpg',
    description: 'Nettoie et protège délicatement la peau de bébé.',
    category: 'soins'
  },
  {
    id: 2,
    name: 'Crème hydratante',
    price: 12.50,
    image: 'https://res.cloudinary.com/dtdpx59sc/image/upload/v1731465596/website%20assets/remedy_moisturized_related_cream_jca5ot.jpg',
    description: 'Formule hypoallergénique, sans parfum.',
    category: 'soins'
  },
  {
    id: 3,
    name: 'Tire-lait confort',
    price: 59.00,
    image: 'https://res.cloudinary.com/dtdpx59sc/image/upload/v1757347060/IMG_2970_btccav.jpg',
    description: 'Silencieux et ergonomique pour l’allaitement.',
    category: 'allaitement'
  },
  {
    id: 4,
    name: 'Gigoteuse coton bio',
    price: 29.90,
    image: 'https://res.cloudinary.com/dtdpx59sc/image/upload/v1757380613/Screenshot_2025-09-08_211631_tq7utd.png',
    description: 'Textile tout doux pour des nuits sereines.',
    category: 'textile'
  },
  {
    id: 5,
    name: 'Thermomètre douceur',
    price: 18.00,
    image: 'https://res.cloudinary.com/dtdpx59sc/image/upload/v1757347214/c2577111-eda2-40f8-8ea3-8eed79455e86_fr33f1.jpg',
    description: 'Lecture rapide, embout souple.',
    category: 'puericulture'
  },
  {
    id: 6,
    name: 'CarSeet',
    price: 12.00,
    image: 'https://res.cloudinary.com/dtdpx59sc/image/upload/v1757380710/Screenshot_2025-09-08_211815_elpare.png',
    description: 'Un boost de tendresse au petit-déj.',
    category: 'puericulture'
  },
  {
    id: 7,
    name: 'Coussin d’allaitement',
    price: 55.00,
    image: 'https://res.cloudinary.com/dtdpx59sc/image/upload/v1757380613/Screenshot_2025-09-08_211631_tq7utd.png',
    description: 'Maintien optimal, housse lavable.',
    category: 'allaitement'
  },
  {
    id: 9,
    name: 'Nettoyeu blid',
    price: 15.00,
    image: 'https://res.cloudinary.com/dtdpx59sc/image/upload/v1757381100/Screenshot_2025-09-08_212443_ljtl1d.png',
    description: 'Maintien optimal, housse lavable.',
    category: 'allaitement'
  },
  {
    id: 8,
    name: 'Lingettes ultra-douces',
    price: 7.90,
    image: 'https://res.cloudinary.com/dtdpx59sc/image/upload/v1757381099/Screenshot_2025-09-08_212420_ubfhv7.png',
    description: 'Respecte les peaux sensibles.',
    category: 'soins'
  },
  {
    id: 10,
    name: 'Couverture d\'hiver',
    price: 25.00,
    image: 'https://res.cloudinary.com/dtdpx59sc/image/upload/v1757381099/Screenshot_2025-09-08_212420_ubfhv7.png',
    description: 'Maintien optimal, lavable lavable, doux et soilleux.',
    category: 'allaitement'
  },
  {
    id: 11,
    name: 'Trottinette de ballade',
    price: 55.00,
    image: 'https://res.cloudinary.com/dtdpx59sc/image/upload/v1757381099/Screenshot_2025-09-08_212356_ryixlj.png',
    description: 'quand le work-out devient une realite.',
    category: 'allaitement'
  },
];