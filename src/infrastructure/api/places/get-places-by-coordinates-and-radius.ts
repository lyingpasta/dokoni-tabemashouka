"use server";
import { Place } from "@/domain/entities/place";
import {
  getPlacesApiKey,
  getPlacesUrl,
  getRequestedFields,
  PlaceAPIResponsePlaceObject,
} from ".";

export const fromPlaceToDomain = async (
  place: PlaceAPIResponsePlaceObject,
): Promise<Place> => ({
  id: place.fsq_id,
  coordinates: [place.geocodes.main.latitude, place.geocodes.main.longitude],
  name: place.name,
  distance: place.distance,
  price: place.price,
  category: {
    // Get last category child -- TODO for filter purpose
    id: place.categories[place.categories.length - 1].id,
    label: place.categories[place.categories.length - 1].name,
  },
  link: place.link,
  rating: place.rating,
});

export async function getNearbyPlaces(
  coordinates: number[],
  categories: string[],
  query: string,
  radius: number = 1000,
): Promise<Place[]> {
  console.log("fetching nearby places with params", {
    coordinates,
    categories,
    query,
    radius,
  });
  try {
    const placesUrl = await getPlacesUrl();
    const placesApiKey = await getPlacesApiKey();
    const requestedFields = await getRequestedFields();

    const url = new URL(`${placesUrl}/search`);
    url.searchParams.set("ll", coordinates.join(","));
    url.searchParams.set("radius", radius.toString());
    url.searchParams.set("categories", categories.join(","));
    url.searchParams.set("fields", requestedFields.join(","));
    url.searchParams.set("limit", "50");
    if (query) {
      url.searchParams.set("query", query);
    }

    const res = await fetch(url.toString(), {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: placesApiKey,
      },
    });

    if (res.status !== 200) {
      const reason = await res.json();
      throw Error(
        `Error while fetching place ${res.status} ${res.statusText}: ${reason.message}`,
      );
    }

    const places = await res.json();

    const domainRes = await Promise.all(places.results.map(fromPlaceToDomain));

    return domainRes;
  } catch (e) {
    console.error(e);
    throw new Error("Unexpected Error");
  }
}
