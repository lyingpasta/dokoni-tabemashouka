import { filterValues } from "@/components/filter";
import { FilterValue } from "@/components/filter/types";
import { createContext, useContext } from "react";

type SearchCriteriaContextType = {
  query: string;
  setQuery: (q: string) => void;
  searchFilters: FilterValue[];
  setSearchFilters: (f: FilterValue[]) => void;
};

export const SearchCriteriaContext = createContext<SearchCriteriaContextType>({
  query: "",
  setQuery: () => {},
  searchFilters: filterValues.map((filter) => ({
    ...filter,
    isActive: false,
  })),
  setSearchFilters: () => {},
});

export const SearchCriteriaContextProvider = SearchCriteriaContext.Provider;

export const useSearchCriteriaContext = () => useContext(SearchCriteriaContext);
