import { IconType } from "react-icons";
import { Category } from "@/domain/entities/place";

type BaseFilterValue = {
  isActive: boolean;
};

export type CategoryFilterValue = BaseFilterValue & {
  type: "category";
  category: Category;
  IconComponent: IconType;
};

export type RateFilterValue = BaseFilterValue & {
  type: "rate";
  gt: number;
};

export type PlacesAPIFilters = { categories: string[]; rate?: number };

export type FilterValue = CategoryFilterValue | RateFilterValue;
