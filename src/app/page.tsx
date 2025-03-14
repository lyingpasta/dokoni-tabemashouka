"use client";

import { getNearbyPlaces } from "@/infrastructure/api/places";
import styles from "./page.module.css";
import dynamic from "next/dynamic";
import { createContext, useEffect, useState } from "react";
import List from "@/components/list";

const MapComponent = dynamic(() => import("../components/map"), { ssr: false });
export const PlacesContext = createContext([]);

export default function Home() {
  const [nearbyPlaces, setNearbyPlaces] = useState([])

  useEffect(() => {
    getNearbyPlaces([35.6646782, 139.7378198]).then(p => setNearbyPlaces(p))
  }, [])

  return (
    <PlacesContext.Provider value={nearbyPlaces}>
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.topBar}>This is top</div>
          <div className={styles.content}>
            <div className={styles.mapContainer}>
              <MapComponent></MapComponent>
            </div>
            <div className={styles.listContainer}><List /></div>
          </div>
        </div>
      </div>
    </PlacesContext.Provider>
  );
}
