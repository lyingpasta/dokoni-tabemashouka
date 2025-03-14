import { PlacesContext } from "@/app/page"
import { Place } from "@/domain/entities/place"
import { useContext } from "react"
import styles from "./list.module.css"
import ListItem from "./list-item"

export default function List() {
  const data: Place[] = useContext(PlacesContext)

  return (
    <div className={styles.container}>
      <ul>
        {data.map((d, idx) => (<li key={idx}>
          <ListItem place={d}></ListItem>
        </li>))}
      </ul>
    </div>
  )
}
