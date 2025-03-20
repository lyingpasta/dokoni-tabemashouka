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
