import type { CategoryInterface } from "./CategoryInterface";


export interface ProductInterface {
  id: number;
  title: string;
  slug: string;
  price: number;
  description: string;
  category: CategoryInterface;
  images: string[];
  createdAt: string;
  updatedAt: string;
}
