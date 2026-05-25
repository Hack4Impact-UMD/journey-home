"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { CloseIcon } from "@/components/icons/CloseIcon";
import { PlusIcon } from "lucide-react";

interface PhotoDropzoneProps {
  photos: File[];
  onChange: (photos: File[]) => void;
  error?: string;
}

export default function PhotoDropzone({ photos, onChange, error }: PhotoDropzoneProps) {
  const urlMapRef = useRef<Map<File, string>>(new Map());

  const photoUrls = useMemo(() => {
    const currentSet = new Set(photos);
    for (const [file, url] of [...urlMapRef.current.entries()]) {
      if (!currentSet.has(file)) {
        URL.revokeObjectURL(url);
        urlMapRef.current.delete(file);
      }
    }
    for (const file of photos) {
      if (!urlMapRef.current.has(file)) {
        urlMapRef.current.set(file, URL.createObjectURL(file));
      }
    }
    return photos.map((f) => urlMapRef.current.get(f)!);
  }, [photos]);

  useEffect(() => {
    const urlMap = urlMapRef.current;
    return () => {
      urlMap.forEach((url) => URL.revokeObjectURL(url));
      urlMap.clear();
    };
  }, []);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const merged = [...photos, ...acceptedFiles];
      if (merged.length > 4) {
        toast.error("You can only upload up to 4 photos.");
      }
      onChange(merged.slice(0, 4));
    },
    [photos, onChange]
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/gif": [".gif"],
      "image/webp": [".webp"],
      "image/avif": [".avif"],
    },
    multiple: true,
    disabled: photos.length >= 4,
    noClick: photos.length > 0,
  });

  return (
    <div>
      <label className="text-sm text-gray-700 mb-2 block">
        <span className="text-red-500">* </span>Photos (1 required, 4 maximum)
      </label>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded p-4 md:p-8 text-center transition-colors ${
          isDragActive ? "border-primary bg-primary/5" : "border-gray-300"
        } ${photos.length >= 4 ? "cursor-default" : "cursor-pointer"}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center gap-4">
          {photos.length === 0 ? (
            <>
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <div>
                <p className="text-gray-700 mb-1">
                  {isDragActive ? "Drop files here" : "Click or drag file to this area to upload"}
                </p>
                <p className="text-sm text-gray-500">JPG, PNG, GIF, WebP, or AVIF. Up to 4 photos.</p>
              </div>
            </>
          ) : (
            <div className="w-full flex flex-wrap items-center justify-center gap-6">
              {photos.map((photo, index) => (
                <div className="relative" key={index + " " + photo.name}>
                  <img
                    src={photoUrls[index]}
                    alt="Item Photo"
                    className="max-h-20 max-w-20 md:max-h-32 md:max-w-32 rounded-sm object-contain"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onChange(photos.filter((p) => p !== photo));
                    }}
                    className="absolute top-[-.5em] right-[-.5em] bg-white rounded-full text-white text-lg"
                  >
                    <CloseIcon />
                  </button>
                </div>
              ))}
              {photos.length < 4 && (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    open();
                  }}
                  className="bg-[#E7E7E7] rounded-sm h-20 w-20 md:h-32 md:w-32 flex flex-col items-center justify-center cursor-pointer"
                >
                  <span className="text-sm">Add Photo</span>
                  <PlusIcon className="h-8" />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {error && <p className="form-error text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
