"use client";

import { useRef, useState } from "react";
import Webcam from "react-webcam";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { validateUse } from "@/services/validation";

const videoConstraints: MediaTrackConstraints = {
  // width: 1280,
  // height: 720,
  // aspectRatio: { ideal: 1 },
  facingMode: "user",
};

export default function Validator() {
  const webcamRef = useRef<Webcam>(null);
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCapture = async () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc) return;
    setImage(imageSrc);
  };

  const onSubmit = async () => {
    if (!image) return;
    setLoading(true);
    try {
      await validateUse({ face: image.split(",")[1] });
      alert("🍻 Beer dispensed! 🍻");
      setImage(null);
    } catch (error) {
      alert("Unauthorized.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <h1 className="text-3xl font-bold">Get your beer!</h1>
      <div>
        <p>Take a picture of your face and hit validate!</p>
        <p>If everything goes well, you beer shoud be dispensed </p>
      </div>
      {image ? (
        <div className="flex flex-col items-center space-y-4">
          <p>Is your face centralized and clear?</p>
          <img src={image} alt="captured" />
          <div className="space-x-4">
            <Button variant="outline" onClick={() => setImage(null)} disabled={loading} className={cn(loading && "animate-pulse")}>
              New photo
            </Button>
            <Button onClick={onSubmit} disabled={loading} className={cn("mx-auto", loading && "animate-pulse")}>
              BEER! 🍻
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-4">
          <div className="w-fit h-fit">
            <Webcam
              audio={false}
              placeholder="Loading..."
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
            />
          </div>
          <Button onClick={handleCapture} disabled={loading} className={cn("mx-auto", loading && "animate-pulse")}>
            Capture photo
          </Button>
        </div>
      )}
    </div>
  );
}
