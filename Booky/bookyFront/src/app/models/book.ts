export interface Book {
    id?: number;
    title: string;
    author: string;
    resume?: string;
    price: number;
    originalPrice?: number;
    onSale?: boolean;
    promotionPercent?: number;
    available: boolean;
    quantite: number;
    genre: string;
    language: string;
    publicationDate: Date;
    imageUrl?: string;
} 