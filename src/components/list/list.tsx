import { Place } from "@/domain/entities/place";
import { useContext } from "react";
import styles from "./list.module.css";
import ListItem from "./list-item";
import { PlacesContext } from "@/infrastructure/context/places-context.provider";

export default function List() {
  const data: Place[] = useContext(PlacesContext);

  return (
    <div className={styles.container}>
      {data === undefined || data.length < 1 ? (
        <div className={styles.empty}>
          <p>No places found for these search criteria</p>
        </div>
      ) : (
        <ul>
          {data.map((d, idx) => (
            <li key={idx}>
              <ListItem place={d}></ListItem>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
