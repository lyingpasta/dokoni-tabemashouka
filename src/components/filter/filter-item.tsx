import { GiSushis } from "react-icons/gi";
import styles from "./filter-item.module.css";
import { useState } from "react";

export function FilterItem() {
  const [isToggled, setIsToggled] = useState(false)

  const onToggle = () => setIsToggled(!isToggled)

  return (
    <div className={!isToggled ? styles.button : [styles.button, styles.toggled].join(" ")} onClick={onToggle}>
      <GiSushis size="1.4rem"></GiSushis>
    </div>
  );
}
