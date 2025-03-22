import { GiItalia, GiSushis } from "react-icons/gi";
import { FiltersSet } from "./filters-set";
import { MdRamenDining } from "react-icons/md";
import { BiBowlRice } from "react-icons/bi";
import { FilterValue } from "./types";
import { match } from "ts-pattern";
import { DINING_AND_DRINKING_CATEGORY_ID } from "@/domain/value-objects/categories";

export const filterValues: FilterValue[] = [
  // categories
  {
    type: "category",
    IconComponent: GiSushis,
    isActive: false,
    category: { id: "13276", label: "Sushis" },
  },
  {
    type: "category",
    IconComponent: MdRamenDining,
    isActive: false,
    category: {
      id: "13272",
      label: "Ramen",
    },
  },
  {
    type: "category",
    IconComponent: GiItalia,
    isActive: false,
    category: { id: "13236", label: "Italian" },
  },
  {
    type: "category",
    IconComponent: BiBowlRice,
    isActive: false,
    category: { id: "13264", label: "Donburi" },
  },

  // rates
  { type: "rate", isActive: false, gt: 8 },
];

export const getActiveFilters = (
  filters: FilterValue[],
): { categories: string[]; rate?: number } => {
  const activeCategoriesId: string[] = [];
  let maybeRate = undefined;

  filters.map((filter) =>
    match(filter)
      .with({ type: "category", isActive: true }, (f) =>
        activeCategoriesId.push(f.category.id),
      )
      .with({ type: "rate", isActive: true }, (f) => (maybeRate = f.gt)),
  );

  return {
    categories:
      activeCategoriesId.length > 0
        ? activeCategoriesId
        : [DINING_AND_DRINKING_CATEGORY_ID], // default parent restaurant category
    rate: maybeRate,
  };
};

export default FiltersSet;
