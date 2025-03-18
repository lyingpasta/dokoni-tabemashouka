"use server";

import { PlacePhoto } from "@/domain/entities/place";
import { getPlacesApiKey, getPlacesUrl } from ".";

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
  console.log("fetching place photos", {
    id,
  });
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

    if (res.status !== 200) {
      const reason = await res.json();
      throw Error(
        `Error while fetching place photos ${res.status} ${res.statusText}: ${reason.message}`,
      );
    }

    const photos = await res.json();
    return photos.map(fromPlacePhotoToDomain);
  } catch (e) {
    console.error(e);
    throw new Error("Unexpected Error");
  }
}
