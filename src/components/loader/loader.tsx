import { useEffect, useState } from "react";
import styles from "./loader.module.css";

export function Loader() {
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowMessage(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.spinner} />
      {showMessage && (
        <div className={styles.message}>
          It seems that it is taking some time, please hang on with us a little
          while
        </div>
      )}
    </div>
  );
}
