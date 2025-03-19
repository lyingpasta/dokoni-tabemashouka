import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import styles from "./search-bar.module.css";
import { useState } from "react";
import { useSearchCriteriaContext } from "@/hooks/use-search-criteria-context";

export function SearchBar() {
  const { query, setQuery } = useSearchCriteriaContext();

  const [value, setValue] = useState(query);

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setQuery(value);
  };

  return (
    <form className={styles.container} onSubmit={onSubmit}>
      <input
        className={styles.input}
        type="text"
        value={value}
        onChange={(value) => setValue(value.target.value.toString())}
      />
      <button className={styles.button} type="submit">
        <MagnifyingGlassIcon className={styles.icon}></MagnifyingGlassIcon>
      </button>
    </form>
  );
}
