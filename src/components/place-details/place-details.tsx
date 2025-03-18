import { useContext, useEffect, useMemo, useState } from "react";
import styles from "./place-details.module.css";
import { SelectedPlaceContext } from "@/infrastructure/context/selected-place-context.provider";
import { ExtendedPlace } from "@/domain/entities/place";
import Rating from "../rating";
import { getPlaceDetails } from "@/infrastructure/api/places";
import { FaRegCheckCircle } from "react-icons/fa";
import { PlacePhotoCarousel } from "./place-photo-carousel";

export default function PlaceDetails() {
  const { selectedPlace } = useContext(SelectedPlaceContext);
  const [placeDetails, setPlaceDetails] = useState<ExtendedPlace | undefined>(
    undefined,
  );

  const selectedPlaceContextValue = useMemo(
    () => selectedPlace,
    [selectedPlace],
  );
  useEffect(() => {
    if (selectedPlaceContextValue) {
      getPlaceDetails(selectedPlaceContextValue.id).then((details) =>
        setPlaceDetails(details),
      );
    }
  }, [selectedPlaceContextValue]);

  return placeDetails ? (
    <div className={styles.details}>
      <div className={styles.carrousel}>
        <PlacePhotoCarousel placeId={placeDetails.id} />
      </div>
      <div className={styles.info}>
        <div className={styles.header}>
          <div className={styles.name}>{placeDetails.name}</div>
          <div className={styles.icons}>
            <div
              className={
                placeDetails.isVerified
                  ? [styles.verified, styles.checkmark].join(" ")
                  : [styles.unverified, styles.checkmark].join(" ")
              }
            >
              <FaRegCheckCircle />
            </div>
            <Rating rate={placeDetails.rating} />
          </div>
        </div>
        <div className={styles.category}>{placeDetails.category.label}</div>
        <div className={styles.address}>{placeDetails.address}</div>
        <div className={styles.description}>
          <p>{placeDetails.description ?? "No description provided"}</p>
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
}
