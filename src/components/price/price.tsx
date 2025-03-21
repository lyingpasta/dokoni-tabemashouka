import styles from "./price.module.css";

type PriceInput = {
  value: number;
};

export function Price({ value }: PriceInput) {
  return (
    <div className={styles.price}>{value > 0 ? "¥".repeat(value) : "-"}</div>
  );
}
