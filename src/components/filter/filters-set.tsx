import { FilterItem } from "./filter-item";
import styles from "./filters-set.module.css";
import { useContext } from "react";
import { SearchCriteriaContext } from "@/app/page";

export function FiltersSet() {
  const { searchFilters, setSearchFilters } = useContext(SearchCriteriaContext);

  const onFilterToggled = (categoryId: string) => (value: boolean) =>
    setSearchFilters(
      searchFilters.map((filter) => ({
        ...filter,
        isActive: filter.id === categoryId ? value : filter.isActive,
      })),
    );

  return (
    <div className={styles.set}>
      <ul>
        {searchFilters.map((filter) => (
          <li key={filter.id}>
            <FilterItem
              onFilterToggled={onFilterToggled(filter.id)}
              currentValue={filter.isActive}
            >
              {<filter.Icon size="1.4rem"></filter.Icon>}
            </FilterItem>
          </li>
        ))}
      </ul>
    </div>
  );
}
