import { useEffect, useMemo, useState } from "react";
import styles from "./place-details.module.css";
import { ExtendedPlace } from "@/domain/entities/place";
import Rating from "../rating";
import { FaRegCheckCircle } from "react-icons/fa";
import { PlacePhotoCarousel } from "./place-photo-carousel";
import { useSelectedPlaceContext } from "@/hooks/use-selected-place-context";
import { getPlaceDetails } from "@/server/api/places";
import { Loader } from "../loader/loader";
import Error from "../error";

export default function PlaceDetails() {
  const { selectedPlace } = useSelectedPlaceContext();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [placeDetails, setPlaceDetails] = useState<ExtendedPlace | undefined>(
    undefined,
  );

  const selectedPlaceContextValue = useMemo(
    () => selectedPlace,
    [selectedPlace],
  );
  useEffect(() => {
    if (selectedPlaceContextValue) {
      setIsLoading(true)
      getPlaceDetails(selectedPlaceContextValue.id)
        .then((details) => {
          setIsLoading(false);
          setPlaceDetails(details);
        })
        .catch(() => {
          setIsLoading(false);
          setIsError(true);
        });
    }
  }, [selectedPlaceContextValue]);

  return placeDetails && (
    <div className={styles.details}>
      <div className={styles.carrousel}>
        <PlacePhotoCarousel placeId={placeDetails.id} />
      </div>
      {isLoading ? (
        <div className={styles.status}>
          <Loader />
        </div>
      ) : isError ? (
        <div className={styles.status}>
          <Error message="Sorry! We couldn't retrieve the place details" />
        </div>
      ) : (
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
      )}
    </div>
  ) ;
}
