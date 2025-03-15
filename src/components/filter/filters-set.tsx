import { FilterItem } from "./filter-item"
import styles from "./filters-set.module.css"

export function FiltersSet() {
  return (<div className={styles.set}>
    <ul>
      <li>
        <FilterItem></FilterItem>
      </li>
      <li>
        <FilterItem></FilterItem>
      </li>
    </ul>
  </div>)
}
