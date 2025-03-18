import { Place } from "@/domain/entities/place";
import styles from "./popup-content.module.css";

type PopupContentInput = {
  place: Place;
};

export function PopupContent({ place }: PopupContentInput) {
  return (
    <div className={styles.container}>
      <div className={styles.name}>{place.name}</div>
      <div className={styles.distance}>at {place.distance}m</div>
      <div className={styles.category}>
        {place.category.label}
        <div className={styles.price}>
          {place.price > 0 ? "¥".repeat(place.price) : "-"}
        </div>
      </div>
    </div>
  );
}
