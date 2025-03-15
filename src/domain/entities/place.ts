export type Place = {
  id: string;
  coordinates: number[];
  name: string;
  address: string;
  category: Category;
  link: string;
  rating: number
};

export type Category = {
  id: string;
  label: string;
};
