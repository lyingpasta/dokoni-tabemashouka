import { GiItalia, GiSushis } from "react-icons/gi";
import { IconType } from "react-icons";
import { MdRamenDining } from "react-icons/md";
import { BiBowlRice } from "react-icons/bi";
import { Category } from "../entities/place";

export type CategoryFilter = Category & {
  IconComponent: IconType;
  isActive: boolean;
};

export const categories: CategoryFilter[] = [
  { id: "13276", label: "Sushis", IconComponent: GiSushis, isActive: false },
  {
    id: "13272",
    label: "Ramen",
    IconComponent: MdRamenDining,
    isActive: false,
  },
  { id: "13236", label: "Italian", IconComponent: GiItalia, isActive: false },
  { id: "13264", label: "Donburi", IconComponent: BiBowlRice, isActive: false },
];

export const DINING_AND_DRINKING_CATEGORY_ID = "13065";
