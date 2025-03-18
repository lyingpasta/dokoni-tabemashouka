import { useEffect, useState } from "react";
import styles from "./place-photo-carousel.module.css";
import { PlacePhoto } from "@/domain/entities/place";
import { getPlacePhotos } from "@/infrastructure/api/places/get-place-photos";
import { PlacePhoto as PlacePhotoComponent } from "./place-photo";
import Error from "../error";

type PlacePhotoCarouselInputType = {
  placeId: string;
};

export function PlacePhotoCarousel({
  placeId,
}: Readonly<PlacePhotoCarouselInputType>) {
  const [photos, setPhotos] = useState<PlacePhoto[]>([]);
  const [error, setError] = useState(false)

  useEffect(() => {
    getPlacePhotos(placeId).then(setPhotos).catch(() => setError(true));
  }, [placeId]);

  return (
    <div className={styles.container}>
      {error ? (<Error message="Sorry! We couldn't retrieve the photos of this establishment..."></Error>) :
        (<ul>
          {photos.map((p) => (
            <li key={p.id}>
              <PlacePhotoComponent url={p.url} />
            </li>
          ))}
        </ul>)}
    </div>
  );
}
