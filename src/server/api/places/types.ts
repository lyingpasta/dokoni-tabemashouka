export type PlaceAPIResponsePlaceObject = {
  fsq_id: string;
  geocodes: {
    main: {
      latitude: number;
      longitude: number;
    };
  };
  name: string;
  distance: number;
  price: number;
  categories: {
    id: string;
    name: string;
  }[];
  link: string;
  rating: number;
};

export type ExtendedPlaceAPIResponsePlaceObject =
  PlaceAPIResponsePlaceObject & {
    location: {
      formatted_address: string;
    };
    description: string;
    email: string;
    tel: string;
    hours: {
      display: string;
      open_now: boolean;
    };
    verified: boolean;
    social_media: { facebook_id: string; instagram: string; twitter: string };
    price: number;
  };
