import { FilterItem } from "./filter-item";
import styles from "./filters-set.module.css";
import { useSearchCriteriaContext } from "@/hooks/use-search-criteria-context";
import { FilterValue } from "./types";
import { match } from "ts-pattern";
import RateFilter from "./rate-filter";

export function FiltersSet() {
  const { searchFilters, setSearchFilters } = useSearchCriteriaContext();

  const onFilterToggled = (index: number) => (value: boolean) =>
    setSearchFilters(
      searchFilters.map((filter, idx) =>
        idx === index
          ? {
              ...filter,
              isActive: value,
            }
          : filter,
      ),
    );

  return (
    <div className={styles.set}>
      <ul>
        {searchFilters.map((filter, idx) => (
          <li key={idx}>
            <FilterItem
              onFilterToggled={onFilterToggled(idx)}
              currentValue={filter.isActive}
            >
              {buildFilterIcon(filter)}
            </FilterItem>
          </li>
        ))}
      </ul>
    </div>
  );
}

const buildFilterIcon = (filter: FilterValue) =>
  match(filter)
    .with({ type: "category" }, (f) => (
      <f.IconComponent size="1.4rem"></f.IconComponent>
    ))
    .with({ type: "rate" }, (f) => (
      <RateFilter isToggled={f.isActive} gt={f.gt}></RateFilter>
    ))
    .exhaustive();
