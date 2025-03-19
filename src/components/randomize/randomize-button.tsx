import { usePlacesContext } from "@/hooks/use-place-context";
import styles from "./randomize-button.module.css";
import { useSelectedPlaceContext } from "@/hooks/use-selected-place-context";

export function RandomizeButton() {
  const places = usePlacesContext();
  const { setSelectedPlace } = useSelectedPlaceContext();

  const handleRandomize = () => {
    if (places.length > 0) {
      const randomIndex = Math.floor(Math.random() * places.length);
      setSelectedPlace(places[randomIndex]);
    }
  };

  return (
    <div className={styles.button} onClick={handleRandomize}>
      Choose for me !
    </div>
  );
}
