import { match, P } from "ts-pattern";
import styles from "./rating.module.css"

type RatingInput = {
  rate: number
}

export default function Rating({ rate }: RatingInput) {
  return (<div className={getRatingColor(rate)}>
    {rate ?? "-"}
  </div>)
}

const getRatingColor = (rate: number) =>
  match(rate)
    .with(P.nullish, () => styles.rating)
    .with(P.number.lte(4), () => [styles.rating, styles.low].join(" "))
    .with(P.number.lte(7), () => [styles.rating, styles.medium].join(" "))
    .with(P.number.gt(7), () => [styles.rating, styles.high].join(" "))
    .otherwise(() => [styles.rating, styles.low].join(" "));
