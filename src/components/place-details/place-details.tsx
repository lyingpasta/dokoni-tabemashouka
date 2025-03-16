import { useContext, useEffect, useMemo, useState } from "react";
import styles from "./place-details.module.css";
import { SelectedPlaceContext } from "@/infrastructure/context/selected-place-context.provider";
import { Place } from "@/domain/entities/place";
import Rating from "../rating";

export default function PlaceDetails() {
  const { selectedPlace } = useContext(SelectedPlaceContext)
  const [placeDetails, setPlaceDetails] = useState<Place | undefined>(undefined)

  const selectedPlaceContextValue = useMemo(() => selectedPlace, [selectedPlace])
  useEffect(() => {
    console.log("fetch place details")
    setPlaceDetails(selectedPlaceContextValue)
  }, [selectedPlaceContextValue])

  return (
    <div className={placeDetails ? styles.details : styles.hidden}>
      {placeDetails ? (
        <>
          <div className={styles.carrousel}>
          </div>
          <div className={styles.info}>
            <div className={styles.header}>
              <div className={styles.name}>{placeDetails.name}</div>
              <Rating rate={placeDetails.rating} />
            </div>
            <div className={styles.category}>{placeDetails.category.label}</div>
            <div className={styles.address}>{placeDetails.address}</div>
          </div>
        </>
      ) : (<></>)}

    </div>)
}
