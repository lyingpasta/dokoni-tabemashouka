import { TbSkull } from "react-icons/tb";
import styles from "./error.module.css";

type ErrorInput = {
  message: string;
};

export function Error({ message }: ErrorInput) {
  return (
    <div className={styles.container}>
      <div>
        <TbSkull size={24} />
      </div>
      <p>{message}</p>
    </div>
  );
}
