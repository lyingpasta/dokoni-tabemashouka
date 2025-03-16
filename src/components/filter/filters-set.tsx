import { SearchCriteriaContext } from "@/infrastructure/context/seach-criteria-context.provider";
import { FilterItem } from "./filter-item";
import styles from "./filters-set.module.css";
import { useContext } from "react";

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
              {<filter.IconComponent size="1.4rem"></filter.IconComponent>}
            </FilterItem>
          </li>
        ))}
      </ul>
    </div>
  );
}
