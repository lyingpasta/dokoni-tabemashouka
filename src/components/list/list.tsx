import { Place } from "@/domain/entities/place";
import styles from "./list.module.css";
import ListItem from "./list-item";

type ListInput = {
  places: Place[];
};

export default function List({ places }: ListInput) {
  return (
    <div className={styles.container}>
      {places.length === 0 ? (
        <div className={styles.empty}>
          <p>No places found</p>
        </div>
      ) : (
        <ul>
          {places.map((d, idx) => (
            <li key={idx}>
              <ListItem place={d}></ListItem>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
