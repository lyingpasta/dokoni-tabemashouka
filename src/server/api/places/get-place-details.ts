"use server";
import { ExtendedPlace } from "@/domain/entities/place";
import {
  ExtendedPlaceAPIResponsePlaceObject,
  getPlacesApiKey,
  getPlacesUrl,
  getRequestedFields,
} from ".";
import { fromPlaceToDomain as simplifiedFromPlaceToDomain } from "./get-places-by-coordinates-and-radius";
import {
  log,
  logApiCall,
  LogCategory,
  logError,
  logPerformance,
} from "@/utils/logger";
import { rateLimit } from "../rate-limit";

const fromPlaceToDomain = async (
  place: ExtendedPlaceAPIResponsePlaceObject,
): Promise<ExtendedPlace> => {
  const simplified = await simplifiedFromPlaceToDomain(place);
  return {
    ...simplified,
    address: place.location.formatted_address,
    description: place.description,
    email: place.email,
    tel: place.tel,
    hours: place.hours?.display ?? "",
    isOpenNow: place.hours?.open_now,
    isVerified: place.verified,
    facebookUrl: `facebook.com/${place.social_media?.facebook_id}`,
    instagramUrl: place.social_media?.instagram,
    twitterUrl: place.social_media?.twitter,
    price: place?.price,
  };
};

export async function getPlaceDetails(id: string): Promise<ExtendedPlace> {
  log.info("Requesting place details", { category: LogCategory.API, id });
  const startTime = Date.now();
  const rateLimitKey = `places:details:${id}`;

  try {
    if (!rateLimit(rateLimitKey)) {
      logError(
        "Rate limit exceeded",
        new Error("Rate limit exceeded"),
        "places-api",
        { rateLimitKey },
      );
      throw new Error("Rate limit exceeded. Please try again later.");
    }

    const placesUrl = await getPlacesUrl();
    const placesApiKey = await getPlacesApiKey();
    const requestedFields = await getRequestedFields(true);

    const url = new URL(`${placesUrl}/${id}`);
    url.searchParams.set("fields", requestedFields.join(","));

    const res = await fetch(url.toString(), {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: placesApiKey,
      },
    });

    const duration = Date.now() - startTime;
    logPerformance("api-latency", duration, "places-api", {
      endpoint: "photos",
      id,
    });

    if (res.status !== 200) {
      const reason = await res.json();
      const error = new Error(
        `Error while fetching place photos ${res.status} ${res.statusText}: ${reason.message}`,
      );
      logApiCall(url.toString(), "GET", res.status, duration, error);
      throw error;
    }
    logApiCall(url.toString(), "GET", res.status, duration);

    const place = await res.json();
    return await fromPlaceToDomain(place);
  } catch (e) {
    const duration = Date.now() - startTime;
    logError(
      "Failed to fetch places details",
      e instanceof Error ? e : new Error(String(e)),
      "places-api",
      {
        id,
        duration,
      },
    );
    throw new Error("Unexpected Error");
  }
}
