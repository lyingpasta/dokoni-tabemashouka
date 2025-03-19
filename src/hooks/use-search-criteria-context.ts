import { categories, CategoryFilter } from "@/domain/value-objects/categories";
import { createContext, useContext } from "react";

type SearchCriteriaContextType = {
  query: string;
  setQuery: (q: string) => void;
  searchFilters: CategoryFilter[];
  setSearchFilters: (f: CategoryFilter[]) => void;
};

export const SearchCriteriaContext = createContext<SearchCriteriaContextType>({
  query: "",
  setQuery: () => {},
  searchFilters: categories.map((category) => ({
    ...category,
    isActive: false,
  })),
  setSearchFilters: () => {},
});

export const SearchCriteriaContextProvider = SearchCriteriaContext.Provider

export const useSearchCriteriaContext = () => useContext(SearchCriteriaContext)
