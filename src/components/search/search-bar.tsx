import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import styles from "./search-bar.module.css"

export function SearchBar() {
  return (
    <form className={styles.container}>
      <input className={styles.input} type="text" />
      <button className={styles.button}><MagnifyingGlassIcon className={styles.icon}></MagnifyingGlassIcon></button>
    </form>
  )
}
