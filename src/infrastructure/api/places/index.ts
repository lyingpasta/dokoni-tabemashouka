'use server';

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
    id: place.categories[0].id,
    name: place.categories[0].name,
  },
  link: place.link
})

export async function getNearbyPlaces(
  coordinates: number[],
  radius: number = 1000,
) {
  try {
    const res = await fetch(`${placesUrl}?ll=${coordinates.join(",")}&radius=${radius}`, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: placesApiKey,
      },
    });
    const places = await res.json()
    return places.results.map(fromPlaceToDomain)
  } catch (e) {
    console.error(e);
  }
}
