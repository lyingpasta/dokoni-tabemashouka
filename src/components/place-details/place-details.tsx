import { useEffect, useMemo, useState } from "react";
import styles from "./place-details.module.css";
import { ExtendedPlace } from "@/domain/entities/place";
import Rating from "../rating";
import { FaRegCheckCircle } from "react-icons/fa";
import { PlacePhotoCarousel } from "./place-photo-carousel";
import { useSelectedPlaceContext } from "@/hooks/use-selected-place-context";
import { getPlaceDetails } from "@/server/api/places";
import { Loader } from "../loader/loader";
import Error from "../error";
import Price from "../price";
import { PiPhone } from "react-icons/pi";
import { LuEarth } from "react-icons/lu";
import { MdMenuBook } from "react-icons/md";

export default function PlaceDetails() {
  const { selectedPlace } = useSelectedPlaceContext();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [placeDetails, setPlaceDetails] = useState<ExtendedPlace | undefined>(
    undefined,
  );

  const selectedPlaceContextValue = useMemo(
    () => selectedPlace,
    [selectedPlace],
  );
  useEffect(() => {
    if (selectedPlaceContextValue) {
      setIsLoading(true);
      getPlaceDetails(selectedPlaceContextValue.id)
        .then((details) => {
          setIsLoading(false);
          setPlaceDetails(details);
        })
        .catch(() => {
          setIsLoading(false);
          setIsError(true);
        });
    }
  }, [selectedPlaceContextValue]);

  return (
    placeDetails &&
    (isLoading ? (
      <div className={styles.status}>
        <Loader />
      </div>
    ) : isError ? (
      <div className={styles.status}>
        <Error message="Sorry! We couldn't retrieve the place details" />
      </div>
    ) : (
      <div className={styles.details}>
        <div className={styles.carrousel}>
          <PlacePhotoCarousel placeId={placeDetails.id} />
        </div>
        <div className={styles.info}>
          <div className={styles.header}>
            <div className={styles.name}>{placeDetails.name}</div>
            <div className={styles.icons}>
              <div
                className={
                  placeDetails.isVerified
                    ? [styles.verified, styles.checkmark].join(" ")
                    : [styles.unverified, styles.checkmark].join(" ")
                }
              >
                <FaRegCheckCircle />
              </div>
              <Rating rate={placeDetails.rating} />
            </div>
          </div>
          <div className={styles.category}>
            {placeDetails.category.label}
            <Price value={placeDetails.price} />
          </div>
          <div className={styles.address}>{placeDetails.address}</div>
          <div className={styles.infos}>
            <InfoCard info={placeDetails.tel} type="tel">
              <PiPhone size="20px" />
            </InfoCard>
            <InfoCard info={placeDetails.website} type="web">
              <LuEarth size="20px" />
            </InfoCard>
            <InfoCard info={placeDetails.menu} type="web">
              <MdMenuBook size="20px" />
            </InfoCard>
          </div>
          <div className={styles.description}>
            <p>{placeDetails.description ?? "No description provided"}</p>
          </div>
        </div>
      </div>
    ))
  );
}

const InfoCard = ({
  children,
  info,
  type = "web"
}: {
  children: React.ReactNode;
  type: "tel" | "web";
  info?: string;
}) =>
  info && (
    <div className={styles.card}>
      <div className={styles.icon}>{children}</div>
      <div className={styles.value}><a href={type === "tel" ? `tel:+81${info}` : info}>{info}</a></div>
    </div>
  );
