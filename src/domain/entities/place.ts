export type Place = {
  category: Category;
  coordinates: number[];
  distance: number;
  id: string;
  link: string;
  name: string;
  price: number;
  rating: number;
};

export type Category = {
  id: string;
  label: string;
};

export type ExtendedPlace = Place & {
  address: string;
  description?: string;
  email?: string;
  facebookUrl?: string;
  hours?: string;
  instagramUrl?: string;
  isOpenNow?: boolean;
  isVerified?: boolean;
  price?: number;
  tel?: string;
  twitterUrl?: string;
};

export type PlacePhoto = {
  id: string;
  url: string;
};
