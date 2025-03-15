export type Place = {
  id: string;
  coordinates: number[];
  name: string;
  address: string;
  category: Category;
  link: string;
};

type Category = {
  id: string;
  name: string;
};
