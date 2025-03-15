import { Place } from "@/domain/entities/place";
import styles from "./list-item.module.css";

interface ListItemProps {
  place: Place;
}

export default function ListItem({ place }: ListItemProps) {
  return (
    <div className={styles.container}>
      <div className={styles.name}>{place.name}</div>
      <div className={styles.category}>{place.category.label}</div>
      <div className={styles.address}>{place.address}</div>
    </div>
  );
}
