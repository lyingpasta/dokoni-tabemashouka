import { Place } from "@/domain/entities/place";
import styles from "./list-item.module.css";
import { match, P } from "ts-pattern";

interface ListItemProps {
  place: Place;
}

export default function ListItem({ place }: ListItemProps) {
  const getRatingColor = (rate: number) =>
    match(rate)
      .with(P.nullish, () => styles.rating)
      .with(P.number.lte(4), () => [styles.rating, styles.low].join(" "))
      .with(P.number.lte(7), () => [styles.rating, styles.medium].join(" "))
      .with(P.number.gt(7), () => [styles.rating, styles.high].join(" "))
      .otherwise(() => [styles.rating, styles.low].join(" "));

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.name}>{place.name}</div>
        <div className={getRatingColor(place.rating)}>
          {place.rating ?? "-"}
        </div>
      </div>
      <div className={styles.category}>{place.category.label}</div>
      <div className={styles.address}>{place.address}</div>
    </div>
  );
}
