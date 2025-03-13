'use client';

import styles from "./page.module.css";
import dynamic from "next/dynamic";

const MapComponent = dynamic(() => import('../components/map'), { ssr: false })

export default function Home() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.topBar}>This is top</div>
        <div className={styles.content}>
          <div className={styles.mapContainer}>
            <MapComponent></MapComponent>
          </div>
          <div className={styles.listContainer}>This is the list</div>
        </div>
      </div>
    </div>
  );
}
