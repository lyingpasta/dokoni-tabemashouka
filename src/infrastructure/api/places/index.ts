"use server";

import { Place } from "@/domain/entities/place";

const placesUrl = "https://api.foursquare.com/v3/places/search";

const placesApiKey = process.env.PLACES_API_KEY as string;
if (!placesApiKey) {
  throw new Error("PLACES_API_KEY environment variable is not set.");
}

const fromPlaceToDomain = (place: any): Place => ({
  id: place.fsq_id,
  coordinates: [place.geocodes.main.latitude, place.geocodes.main.longitude],
  name: place.name,
  address: place.location.formatted_address,
  category: {
    // Get last category child -- TODO for filter purpose
    id: place.categories[place.categories.length - 1].id,
    label: place.categories[place.categories.length - 1].name,
  },
  link: place.link,
});

export async function getNearbyPlaces(
  coordinates: number[],
  categories: string[],
  query: string,
  radius: number = 1000,
) {
  console.log("fetching nearby places with params", {
    coordinates,
    categories,
    query,
    radius,
  });
  try {
    const url = new URL(placesUrl);
    url.searchParams.set("ll", coordinates.join(","));
    url.searchParams.set("radius", radius.toString());
    url.searchParams.set("categories", categories.join(","));
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

    const places = await res.json();
    return places.results.length > 0
      ? places.results.map(fromPlaceToDomain)
      : [];
  } catch (e) {
    console.error(e);
  }
}
