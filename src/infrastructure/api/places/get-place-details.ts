"use server";
import { ExtendedPlace } from "@/domain/entities/place";
import {
  ExtendedPlaceAPIResponsePlaceObject,
  getPlacesApiKey,
  getPlacesUrl,
  getRequestedFields,
} from ".";
import { fromPlaceToDomain as simplifiedFromPlaceToDomain } from "./get-places-by-coordinates-and-radius";

const fromPlaceToDomain = async (
  place: ExtendedPlaceAPIResponsePlaceObject,
): Promise<ExtendedPlace> => {
  const simplified = await simplifiedFromPlaceToDomain(place);
  return {
    ...simplified,
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
  console.log("fetching place details", {
    id,
  });
  try {
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

    if (res.status !== 200) {
      const reason = await res.json();
      throw Error(
        `Error while fetching place ${res.status} ${res.statusText}: ${reason.message}`,
      );
    }

    const place = await res.json();
    return await fromPlaceToDomain(place);
  } catch (e) {
    console.error(e);
    throw new Error("Unexpected Error");
  }
}
