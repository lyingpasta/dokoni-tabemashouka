export type Place = {
  id: string;
  coordinates: number[];
  name: string;
  address: string;
  category: Category;
  link: string;
  rating: number;
};

export type Category = {
  id: string;
  label: string;
};

export type ExtendedPlace = Place & {
  description?: string;
  email?: string;
  tel?: string;
  hours?: string;
  isOpenNow?: boolean;
  isVerified?: boolean;
  facebookUrl?: string;
  instagramUrl?: string;
  twitterUrl?: string;
  price?: number;
};
