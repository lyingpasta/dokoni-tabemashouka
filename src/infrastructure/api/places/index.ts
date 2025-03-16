"use server";

import { Place } from "@/domain/entities/place";

const placesUrl = "https://api.foursquare.com/v3/places/search";

const placesApiKey = process.env.PLACES_API_KEY as string;
if (!placesApiKey) {
  throw new Error("PLACES_API_KEY environment variable is not set.");
}

type PlaceAPIResponsePlaceObject = {
  fsq_id: string;
  geocodes: {
    main: {
      latitude: number;
      longitude: number;
    };
  };
  name: string;
  location: {
    formatted_address: string;
  };
  categories: {
    id: string;
    name: string;
  }[];
  link: string;
  rating: number;
};

const requestedFields = [
  "fsq_id",
  "geocodes",
  "name",
  "location",
  "categories",
  "link",
  "rating",
];

const fromPlaceToDomain = (place: PlaceAPIResponsePlaceObject): Place => ({
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
    const url = new URL(placesUrl);
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
    return places.results.length > 0
      ? places.results.map(fromPlaceToDomain)
      : [];
  } catch (e) {
    console.error(e);
    throw new Error("Unexpected Error");
  }
}
