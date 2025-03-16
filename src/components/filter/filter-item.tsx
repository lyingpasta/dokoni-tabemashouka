import styles from "./filter-item.module.css";
import { useState } from "react";

type FilterItemInput = {
  children: React.ReactNode;
  currentValue: boolean;
  onFilterToggled: (value: boolean) => void;
};

export function FilterItem({
  children,
  currentValue,
  onFilterToggled,
}: Readonly<FilterItemInput>) {
  const [isToggled, setIsToggled] = useState(currentValue);

  const onToggle = () => {
    const newValue = !isToggled;
    setIsToggled(newValue);
    onFilterToggled(newValue);
  };

  return (
    <div
      className={
        !isToggled ? styles.button : [styles.button, styles.toggled].join(" ")
      }
      onClick={onToggle}
    >
      {children}
    </div>
  );
}
