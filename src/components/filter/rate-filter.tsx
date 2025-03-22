import { FaRegStar } from "react-icons/fa";
import styles from "./rate-filter.module.css";
type RateFilterInput = {
  gt?: number;
  isToggled: boolean;
};

export default function RateFilter({ gt, isToggled }: RateFilterInput) {
  return (
    <div className={styles.container}>
      <FaRegStar size="24px" />
      <div className={isToggled ? styles.toggled : styles.rate}>{gt}+</div>
    </div>
  );
}
