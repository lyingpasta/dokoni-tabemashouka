"use server";

import { PlacePhoto } from "@/domain/entities/place";
import { getPlacesApiKey, getPlacesUrl } from ".";
import { rateLimit } from "../rate-limit";
import {
  log,
  logApiCall,
  LogCategory,
  logError,
  logPerformance,
} from "@/utils/logger";

type PlaceAPIResponsePhotoObject = {
  id: string;
  prefix: string;
  suffix: string;
};

const fromPlacePhotoToDomain = (
  photo: PlaceAPIResponsePhotoObject,
): PlacePhoto => ({
  id: photo.id,
  url: `${photo.prefix}800x600${photo.suffix}`,
});

export async function getPlacePhotos(id: string): Promise<PlacePhoto[]> {
  log.info("Requesting place photos", { category: LogCategory.API, id });
  const startTime = Date.now();
  const rateLimitKey = `places`;

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

    const url = new URL(`${placesUrl}/${id}/photos`);

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

    const photos = await res.json();
    const domainPhotos = photos.map(fromPlacePhotoToDomain);
    logPerformance("results-count", domainPhotos.length, "places-api", {
      endpoint: "photos",
      id,
    });

    return domainPhotos;
  } catch (e) {
    const duration = Date.now() - startTime;
    logError(
      "Failed to fetch places photos",
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
