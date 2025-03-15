import { GiItalia, GiSushis } from "react-icons/gi";
import { IconType } from "react-icons";
import { MdRamenDining } from "react-icons/md";
import { BiBowlRice } from "react-icons/bi";
import { Category } from "../entities/place";

export const categories: (Category & { IconComponent: IconType })[] = [
  { id: "13276", label: "Sushis", IconComponent: GiSushis },
  { id: "13272", label: "Ramen", IconComponent: MdRamenDining },
  { id: "13236", label: "Italian", IconComponent: GiItalia },
  { id: "13264", label: "Donburi", IconComponent: BiBowlRice },
];

export const DINING_AND_DRINKING_CATEGORY_ID = "13065";
