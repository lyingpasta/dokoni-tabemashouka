import { useEffect, useState } from "react";
import styles from "./place-photo-carousel.module.css";
import { PlacePhoto } from "@/domain/entities/place";
import { PlacePhoto as PlacePhotoComponent } from "./place-photo";
import Error from "../error";
import { getPlacePhotos } from "@/server/api/places/get-place-photos";

type PlacePhotoCarouselInputType = {
  placeId: string;
};

export function PlacePhotoCarousel({
  placeId,
}: Readonly<PlacePhotoCarouselInputType>) {
  const [photos, setPhotos] = useState<PlacePhoto[]>([]);
  const [error, setError] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0)

  useEffect(() => {
    getPlacePhotos(placeId)
      .then(setPhotos)
      .catch(() => setError(true));
  }, [placeId]);

  const handlePrevious = () => {
    if (activePhotoIndex === 0) {
      setActivePhotoIndex(photos.length - 1)
    } else {
      setActivePhotoIndex(activePhotoIndex - 1)
    }
  }

  const handleNext = () => {
    if (activePhotoIndex === photos.length - 1) {
      setActivePhotoIndex(0)
    } else {
      setActivePhotoIndex(activePhotoIndex + 1)
    }
  }

  return (
    <div className={styles.container}>
      {error ? (
        <Error message="Sorry! We couldn't retrieve the photos of this establishment..."></Error>
      ) : (
        photos.length > 0 &&
        <div className={styles.viewport}>
          <div className={styles.previous} onClick={handlePrevious}><div className={styles.chevron}>&#8249;</div></div>
          <PlacePhotoComponent url={photos[activePhotoIndex].url} />
          <div className={styles.next} onClick={handleNext}><div className={styles.chevron}>&#8250;</div></div>
        </div>
      )}
    </div>
  );
}
