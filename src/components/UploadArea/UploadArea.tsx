"use client";
import { ChangeEvent, useRef, useState } from "react";
import { m, LazyMotion } from "framer-motion";
import styles from "./UploadArea.module.css";

const loadFeatures = () => import("../../features").then((res) => res.default);

function UploadArea() {
  const [file, setFile] = useState<File | null>(null);
  const [anonymizedFile, setAnonymizedFile] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    console.log(files);
    if (files && files[0]) {
      setFile(files[0]);
      setAnonymizedFile(null);
      await handleAnonymize();
    }
  };

  const handleAnonymize = async () => {
    if (!file) return;

    setIsProcessing(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api", {
        method: "POST",
        body: formData,
      });
      console.log("Fetching");

      if (!response.ok) throw new Error("Anonymization failed");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setAnonymizedFile(url);
    } catch (error) {
      console.error("Error:", error);
      alert("File anonymization failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <LazyMotion features={loadFeatures}>
      <m.section
        className={styles.wrapper}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.3 } }}
      >
        <m.div
          className={styles.backgroundGradient}
          initial={{ x: -150, opacity: 0 }}
          animate={{ x: 200, opacity: [0, 1, 0] }}
          transition={{ duration: 1, ease: "easeInOut", delay: 0.3 }}
        ></m.div>
        <input type='file' ref={fileInputRef} onChange={handleFile} />
        <button onClick={handleButtonClick} aria-label='Choose file'>
          Choose file
        </button>
      </m.section>
    </LazyMotion>
  );
}

export default UploadArea;
