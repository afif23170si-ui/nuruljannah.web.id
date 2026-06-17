"use client";

import { useState } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/plugins/captions.css";

interface GalleryViewerProps {
  images: {
    id: string;
    imageUrl: string;
    title: string | null;
  }[];
}

export default function GalleryViewer({ images }: GalleryViewerProps) {
  const [index, setIndex] = useState(-1);

  const slides = images.map((img, i) => ({
    src: img.imageUrl,
    alt: img.title || `Foto ${i + 1}`,
    title: img.title || undefined,
    description: img.title || "",
  }));

  return (
    <div className="w-full">
      {/* CSS Columns Masonry Grid */}
      <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {images.map((img, i) => (
          <div
            key={img.id}
            className="break-inside-avoid group relative overflow-hidden rounded-lg cursor-pointer bg-gray-100 dark:bg-gray-800 shadow-sm hover:shadow-xl transition-all duration-500"
            onClick={() => setIndex(i)}
          >
            {/* Using native img for reliable masonry sizing */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.imageUrl}
              alt={img.title || `Foto ${i + 1}`}
              className="w-full h-auto block object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />

            {/* Darkening overlay on hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 z-10 pointer-events-none" />

            {/* View icon on hover */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-out z-20">
              <div className="bg-white/20 backdrop-blur-md text-white rounded-full p-3 border border-white/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  <line x1="11" y1="8" x2="11" y2="14" />
                  <line x1="8" y1="11" x2="14" y2="11" />
                </svg>
              </div>
            </div>

            {/* Title overlay at bottom */}
            {img.title && (
              <>
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 p-4 z-20 pointer-events-none">
                  <p className="text-white text-sm font-semibold line-clamp-2 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400 delay-75">
                    {img.title}
                  </p>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <Lightbox
        slides={slides}
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        plugins={[Fullscreen, Slideshow, Thumbnails, Zoom, Captions]}
        captions={{ showToggle: true, descriptionTextAlign: "center" }}
      />
    </div>
  );
}
