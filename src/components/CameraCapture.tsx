import React, { useEffect, useRef, useState } from "react";
import { useSnapshots } from "../hooks/useSnapshot";

export const CameraCapture = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activeCamera, setActiveCamera] = useState<"front" | "top" | null>(
    null
  );

  useEffect(() => {
    const setupCamera = async () => {
      if (activeCamera && videoRef.current) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
          });
          videoRef.current.srcObject = stream;
        } catch (error) {
          console.error("Error accessing camera:", error);
          alert(
            "Failed to access camera. Please make sure camera permissions are granted."
          );
          setActiveCamera(null);
        }
      }
    };

    setupCamera();

    // Cleanup function to stop camera when component unmounts or camera changes
    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [activeCamera]);

  const [frontPhoto, setFrontPhoto] = useState<File | null>(null);
  const [topPhoto, setTopPhoto] = useState<File | null>(null);
  const [previewUrls, setPreviewUrls] = useState<{
    front?: string;
    top?: string;
  }>({});

  const { createSnapshot, isCreating } = useSnapshots();

  const startCamera = async (mode: "front" | "top") => {
    try {
      setActiveCamera(mode); // This triggers rendering of video element
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert(
        "Failed to access camera. Please make sure camera permissions are granted."
      );
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setActiveCamera(null);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !activeCamera) return;

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const context = canvas.getContext("2d");

    if (context) {
      context.drawImage(videoRef.current, 0, 0);

      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `${activeCamera}-photo.jpg`, {
            type: "image/jpeg",
          });
          const url = URL.createObjectURL(blob);

          if (activeCamera === "front") {
            setFrontPhoto(file);
            setPreviewUrls((prev) => ({ ...prev, front: url }));
          } else {
            setTopPhoto(file);
            setPreviewUrls((prev) => ({ ...prev, top: url }));
          }
        }
      }, "image/jpeg");

      stopCamera();
    }
  };

  const retakePhoto = (mode: "front" | "top") => {
    if (mode === "front") {
      setFrontPhoto(null);
      URL.revokeObjectURL(previewUrls.front || "");
      setPreviewUrls((prev) => ({ ...prev, front: undefined }));
    } else {
      setTopPhoto(null);
      URL.revokeObjectURL(previewUrls.top || "");
      setPreviewUrls((prev) => ({ ...prev, top: undefined }));
    }
  };

  useEffect(() => {
    // Cleanup function for URL objects
    return () => {
      if (previewUrls.front) URL.revokeObjectURL(previewUrls.front);
      if (previewUrls.top) URL.revokeObjectURL(previewUrls.top);
    };
  }, []); // Empty dependency array as we only want this on unmount

  const handleSubmit = async () => {
    if (!frontPhoto || !topPhoto) {
      alert("Please capture both photos");
      return;
    }

    try {
      await createSnapshot({
        frontPhoto,
        topPhoto,
      });
      // Clear photos after successful upload
      setFrontPhoto(null);
      setTopPhoto(null);
      setPreviewUrls({});
      alert("Photos uploaded successfully!");
    } catch (error) {
      console.error("Failed to create snapshot:", error);
      alert("Failed to upload photos");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Take Photos</h2>
      {/* Camera UI - Now with explicit dimensions and debug info */}
      {activeCamera && (
        <div className="relative w-full h-[400px] bg-black rounded-lg mb-4">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="absolute inset-0 w-full h-full object-contain"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-between p-4">
            {/* Camera overlay UI */}
            <div className="w-full flex justify-between items-center">
              <span className="text-white bg-black bg-opacity-50 px-3 py-1 rounded">
                {activeCamera === "front" ? "Front View" : "Top View"}
              </span>
            </div>

            {/* Camera controls */}
            <div className="flex space-x-4">
              <button
                onClick={stopCamera}
                className="bg-red-500 text-white px-6 py-2 rounded-full
                         hover:bg-red-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={capturePhoto}
                className="bg-blue-500 text-white px-6 py-2 rounded-full
                         hover:bg-blue-600 transition-colors"
              >
                Capture
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Photo selection buttons */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <h3 className="font-medium">Front Photo</h3>
          {previewUrls.front ? (
            <div className="relative">
              <img
                src={previewUrls.front}
                alt="Front preview"
                className="w-full h-48 object-cover rounded-lg border"
              />
              <button
                onClick={() => retakePhoto("front")} // Changed from inline logic to use retakePhoto
                className="absolute bottom-2 right-2 bg-white bg-opacity-75 
           hover:bg-opacity-100 text-gray-800 px-3 py-1 rounded-full
           text-sm transition-colors"
              >
                Retake
              </button>
            </div>
          ) : (
            <button
              onClick={() => startCamera("front")}
              disabled={!!activeCamera}
              className="w-full h-48 border-2 border-dashed border-gray-300 
                       rounded-lg flex items-center justify-center
                       hover:border-blue-500 hover:text-blue-500
                       transition-colors disabled:opacity-50
                       disabled:cursor-not-allowed"
            >
              Take Front Photo
            </button>
          )}
        </div>

        {/* Top photo section - similar structure */}
        <div className="space-y-2">
          <h3 className="font-medium">Top Photo</h3>
          {previewUrls.top ? (
            <div className="relative">
              <img
                src={previewUrls.top}
                alt="Top preview"
                className="w-full h-48 object-cover rounded-lg border"
              />
              <button
                onClick={() => retakePhoto("top")} // Changed from inline logic to use retakePhoto
                className="absolute bottom-2 right-2 bg-white bg-opacity-75 
           hover:bg-opacity-100 text-gray-800 px-3 py-1 rounded-full
           text-sm transition-colors"
              >
                Retake
              </button>
            </div>
          ) : (
            <button
              onClick={() => startCamera("top")}
              disabled={!!activeCamera}
              className="w-full h-48 border-2 border-dashed border-gray-300 
                       rounded-lg flex items-center justify-center
                       hover:border-blue-500 hover:text-blue-500
                       transition-colors disabled:opacity-50
                       disabled:cursor-not-allowed"
            >
              Take Top Photo
            </button>
          )}
        </div>
      </div>

      {/* Submit button */}
      <button
        onClick={handleSubmit}
        disabled={!frontPhoto || !topPhoto || isCreating}
        className="w-full mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg
                 hover:bg-blue-600 transition-colors
                 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {isCreating ? "Uploading..." : "Submit Photos"}
      </button>
    </div>
  );
};
