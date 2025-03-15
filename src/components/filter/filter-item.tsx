import styles from "./filter-item.module.css";
import { useState } from "react";

export function FilterItem({
  children,
  onFilterToggled,
  currentValue,
}: Readonly<{
  children: React.ReactNode;
  onFilterToggled: (value: boolean) => void;
  currentValue: boolean;
}>) {
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
