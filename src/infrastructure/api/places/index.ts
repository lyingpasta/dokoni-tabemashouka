"use server";
import { getNearbyPlaces } from "./get-places-by-coordinates-and-radius";
import { getPlaceDetails } from "./get-place-details";
import { match } from "ts-pattern";

export async function getPlacesUrl() {
  return process.env.PLACES_URL ?? "https://api.foursquare.com/v3/places";
}

export async function getPlacesApiKey() {
  const maybeKey = process.env.PLACES_API_KEY as string;
  if (!maybeKey) {
    throw new Error("Places api key invalid or not set");
  }

  return maybeKey;
}

const requestedFields = [
  "categories",
  "distance",
  "fsq_id",
  "geocodes",
  "link",
  "name",
  "price",
  "rating",
];

const extendedRequestedFields = [
  ...requestedFields,
  "description",
  "email",
  "location",
  "price",
  "social_media",
  "tel",
  "verified",
];

export const getRequestedFields = async (extended: boolean = false) =>
  match(extended)
    .with(true, () => extendedRequestedFields)
    .otherwise(() => requestedFields);

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

export { getPlaceDetails, getNearbyPlaces };
