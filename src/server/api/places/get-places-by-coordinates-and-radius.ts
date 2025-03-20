"use server";
import { Place } from "@/domain/entities/place";
import {
  getPlacesApiKey,
  getPlacesUrl,
  getRequestedFields,
  PlaceAPIResponsePlaceObject,
} from ".";
import { rateLimit } from "../rate-limit";
import {
  log,
  logApiCall,
  LogCategory,
  logError,
  logPerformance,
} from "@/utils/logger";

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
  log.info("Requesting places by criteria", {
    category: LogCategory.API,
    coordinates,
    categories,
    query,
    radius,
  });
  const startTime = Date.now();
  const rateLimitKey = `places:${coordinates.join(",")}:${categories.join(",")}:${query}`;

  if (!rateLimit(rateLimitKey)) {
    logError(
      "Rate limit exceeded",
      new Error("Rate limit exceeded"),
      "places-api",
      { rateLimitKey },
    );
    throw new Error("Rate limit exceeded. Please try again later.");
  }

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

    const duration = Date.now() - startTime;
    logPerformance("api-latency", duration, "places-api", {
      endpoint: "search",
      coordinates,
      categories,
      query,
    });

    if (res.status !== 200) {
      const reason = await res.json();
      const error = new Error(
        `Error while fetching place ${res.status} ${res.statusText}: ${reason.message}`,
      );
      logApiCall(url.toString(), "GET", res.status, duration, error);
      throw error;
    }
    logApiCall(url.toString(), "GET", res.status, duration);

    const places = await res.json();
    const domainRes = await Promise.all(places.results.map(fromPlaceToDomain));

    logPerformance("results-count", domainRes.length, "places-api", {
      endpoint: "search",
      coordinates,
      categories,
      query,
    });

    return domainRes;
  } catch (e) {
    const duration = Date.now() - startTime;
    logError(
      "Failed to fetch nearby places",
      e instanceof Error ? e : new Error(String(e)),
      "places-api",
      {
        coordinates,
        categories,
        query,
        duration,
      },
    );
    throw new Error("Unexpected Error");
  }
}
