import { Place } from "@/domain/entities/place";
import styles from "./list-item.module.css";
import { useContext, useEffect, useMemo, useState } from "react";
import { SelectedPlaceContext } from "@/infrastructure/context/selected-place-context.provider";
import Rating from "../rating";

interface ListItemProps {
  place: Place;
}

export default function ListItem({ place }: ListItemProps) {
  const placeId = place.id;
  const [isSelected, setIsSelected] = useState(false);
  const { selectedPlace, setSelectedPlace } = useContext(SelectedPlaceContext);

  const selectedPlaceContextValue = useMemo(
    () => selectedPlace,
    [selectedPlace],
  );
  useEffect(() => {
    if (selectedPlaceContextValue?.id !== placeId) {
      setIsSelected(false);
    } else {
      setIsSelected(true);
    }
  }, [selectedPlaceContextValue, placeId]);

  const handleSelection = () => {
    setSelectedPlace(place);
  };

  return (
    <div
      className={
        isSelected
          ? [styles.container, styles.selected].join(" ")
          : styles.container
      }
      onClick={handleSelection}
    >
      <div className={styles.header}>
        <div className={styles.name}>{place.name}</div>
        <Rating rate={place.rating}></Rating>
      </div>
      <div className={styles.price}>
        {place.price > 0 ? "¥".repeat(place.price) : "-"}
      </div>
      <div className={styles.category}>
        {place.category.label}
        <div className={styles.distance}>at {place.distance}m</div>
      </div>
    </div>
  );
}
