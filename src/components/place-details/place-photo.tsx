import { useState } from "react";
import styles from "./place-photo.module.css";
import { Loader } from "../loader/loader";
import Image from "next/image";
import Error from "../error";

type PlacePhotoInput = {
  url: string;
};

export function PlacePhoto({ url }: PlacePhotoInput) {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const handleError = () => {
    setIsLoading(false);
    setIsError(true)
  }

  return (
    <div className={styles.container}>
      {isLoading ? <Loader /> : <></>}
      {isError ? (
        <Error message={"Sorry! we couldn't load this image..."} />
      ) : (
        <></>
      )}
      <Image
        src={url}
        alt={""}
        fill={true}
        sizes="100vw"
        onLoad={() => setIsLoading(false)}
        onError={handleError}
        className={isLoading ? styles.hidden : styles.image}
      />
    </div>
  );
}
