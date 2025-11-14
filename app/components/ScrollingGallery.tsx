"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  category: string;
}

const galleryImages: GalleryImage[] = [
  {
    id: 1,
    src: "/galleryimage/kch_d1_2.jpeg",
    alt: "Navy Training Session - Kuching",
    category: "Training",
  },
  {
    id: 2,
    src: "/galleryimage/kch_d1_3.jpeg",
    alt: "Navy Training Session - Kuching",
    category: "Training",
  },
  {
    id: 3,
    src: "/galleryimage/kch_d1_4.jpeg",
    alt: "Navy Training Session - Kuching",
    category: "Training",
  },
  {
    id: 4,
    src: "/galleryimage/kch_d1.jpeg",
    alt: "Navy Training Session - Kuching",
    category: "Training",
  },
  {
    id: 5,
    src: "/galleryimage/kch_d2.jpeg",
    alt: "Navy Training Session 2 - Kuching",
    category: "Training",
  },
  {
    id: 6,
    src: "/galleryimage/kch_d2_2.jpeg",
    alt: "Navy Training Session 2 - Kuching",
    category: "Training",
  },
  {
    id: 7,
    src: "/galleryimage/kch_d2_3.jpeg",
    alt: "Navy Training Session 2 - Kuching",
    category: "Training",
  },
  {
    id: 8,
    src: "/galleryimage/kch_d2_4.jpeg",
    alt: "Navy Training Session 2 - Kuching",
    category: "Training",
  },
  {
    id: 9,
    src: "/galleryimage/kdsg_d1.jpeg",
    alt: "Navy Training Session - KDSG",
    category: "Training",
  },
  {
    id: 10,
    src: "/galleryimage/kdsg_d1.jpeg",
    alt: "Navy Training Session - KDSG",
    category: "Training",
  },
  {
    id: 11,
    src: "/galleryimage/kdsg_d1_2.jpeg",
    alt: "Navy Training Session - KDSG",
    category: "Training",
  },
  {
    id: 12,
    src: "/galleryimage/kk_prep_day.jpeg",
    alt: "Venue Preparation - Kota Kinabalu",
    category: "Training",
  },
  {
    id: 13,
    src: "/galleryimage/kk_second.jpg",
    alt: "Navy Training Admin Session - Kota Kinabalu",
    category: "Training",
  },
  {
    id: 14,
    src: "/galleryimage/kk_second_2.jpg",
    alt: "Navy Training Admin Session - Kota Kinabalu",
    category: "Training",
  },
  {
    id: 15,
    src: "/galleryimage/kk_wrap_up.JPG",
    alt: "Navy Group Photo - Kota Kinabalu",
    category: "Training",
  },
  {
    id: 16,
    src: "/galleryimage/lumut_d1_2.jpeg",
    alt: "Navy Training Session - Lumut",
    category: "Training",
  },
  {
    id: 17,
    src: "/galleryimage/lumut_d1_3.jpeg",
    alt: "Navy Training Session - Lumut",
    category: "Training",
  },
  {
    id: 18,
    src: "/galleryimage/lumut_d1_3.jpeg",
    alt: "Navy Training Session - Lumut",
    category: "Training",
  },
  {
    id: 19,
    src: "/galleryimage/lumut_d1.jpeg",
    alt: "Navy Training Session - Lumut",
    category: "Training",
  },
  {
    id: 20,
    src: "/galleryimage/lumut_wrap_up.jpeg",
    alt: "Navy Wrap Up - Lumut",
    category: "Training",
  },
  {
    id: 21,
    src: "/galleryimage/th_postpkp_meet.jpg",
    alt: "TrackerHero Post-PKP Meetup",
    category: "TrackerHero",
  },
  {
    id: 22,
    src: "/galleryimage/th_site_visit.jpg",
    alt: "TrackerHero Site Visit",
    category: "TrackerHero",
  },
];

const splitImages = (images: GalleryImage[], columns: number) => {
  const result = Array.from({ length: columns }, () => [] as GalleryImage[]);
  images.forEach((image, index) => {
    result[index % columns].push(image);
  });
  return result;
};

const getCategoryColor = (category: string) => {
  const colors = {
    Training: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    TrackerHero: "bg-green-500/20 text-green-300 border-green-500/30",
    "Project Snapshot": "bg-purple-500/20 text-purple-300 border-purple-500/30",
    Deployment: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
    Workshop: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    Automation: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  };
  return (
    colors[category as keyof typeof colors] ||
    "bg-gray-500/20 text-gray-300 border-gray-500/30"
  );
};

const GalleryCard = ({ image }: { image: GalleryImage }) => (
  <div className="group relative bg-gradient-to-br from-gray-800/60 to-gray-900/80 border border-gray-700/30 rounded-xl overflow-hidden mb-6 hover:scale-[1.02] transition-all duration-500 shadow-lg hover:shadow-2xl hover:shadow-blue-500/10">
    <div className="relative aspect-square bg-gradient-to-br from-gray-700 to-gray-900 overflow-hidden">
      <Image
        src={image.src}
        alt={image.alt}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-110"
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        onError={(e) => {
          const target = e.currentTarget;
          const parent = target.parentElement;
          if (parent) {
            parent.innerHTML = `
              <div class="w-full h-full bg-gray-700/50 flex items-center justify-center">
                <div class="text-center text-gray-400">
                  <div class="text-2xl mb-2">📷</div>
                  <div class="text-xs">Image not available</div>
                </div>
              </div>
            `;
          }
        }}
        priority={false}
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
        <div
          className={`px-2 py-1 rounded-full text-xs font-medium border backdrop-blur-sm ${getCategoryColor(
            image.category
          )}`}
        >
          {image.category}
        </div>
      </div>
    </div>

    <div className="p-4 bg-gradient-to-r from-gray-800/50 to-gray-800/30 backdrop-blur-sm">
      <div className="text-white text-sm font-semibold leading-tight mb-2 group-hover:text-blue-100 transition-colors duration-300">
        {image.alt}
      </div>
      <div className="flex items-center justify-between">
        <div
          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(
            image.category
          )}`}
        >
          {image.category}
        </div>
        <div className="w-2 h-2 rounded-full bg-blue-400 opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </div>

    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
  </div>
);

const ScrollingColumn = ({
  images,
  direction = "up",
  speed = 50,
  enableScroll = true,
}: {
  images: GalleryImage[];
  direction?: "up" | "down";
  speed?: number;
  enableScroll?: boolean;
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isHovered = useRef(false);

  useEffect(() => {
    if (!enableScroll) return;
    const scrollElement = scrollRef.current;
    if (!scrollElement) return;

    let animationId: number;
    let scrollPosition =
      direction === "up" ? 0 : scrollElement.scrollHeight / 2;

    const scroll = () => {
      if (!isHovered.current) {
        if (direction === "up") {
          scrollPosition += speed / 60;
          if (scrollPosition >= scrollElement.scrollHeight / 2) {
            scrollPosition = 0;
          }
        } else {
          scrollPosition -= speed / 60;
          if (scrollPosition <= 0) {
            scrollPosition = scrollElement.scrollHeight / 2;
          }
        }

        scrollElement.scrollTop = scrollPosition;
      }

      animationId = requestAnimationFrame(scroll);
    };

    const timeoutId = setTimeout(() => {
      animationId = requestAnimationFrame(scroll);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      cancelAnimationFrame(animationId);
    };
  }, [direction, speed, enableScroll]);

  const handleMouseEnter = () => {
    isHovered.current = true;
  };

  const handleMouseLeave = () => {
    isHovered.current = false;
  };

  const duplicatedImages = enableScroll ? [...images, ...images] : images;

  return (
    <div
      ref={scrollRef}
      className={
        enableScroll
          ? "h-full overflow-hidden cursor-pointer"
          : "h-auto overflow-visible"
      }
      style={
        enableScroll
          ? {
              maskImage:
                "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
            }
          : undefined
      }
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="space-y-0">
        {duplicatedImages.map((image, index) => (
          <GalleryCard key={`${image.id}-${index}`} image={image} />
        ))}
      </div>
    </div>
  );
};

export default function ScrollingGallery() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);

  const categories = [
    "All",
    ...Array.from(new Set(galleryImages.map((img) => img.category))),
  ];

  const filteredImages =
    selectedCategory === "All"
      ? galleryImages
      : galleryImages.filter((img) => img.category === selectedCategory);

  const numColumns = Math.min(3, Math.max(1, filteredImages.length));
  const imageColumns = splitImages(filteredImages, numColumns);
  const enableScroll = filteredImages.length > numColumns * 2;

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="py-20 px-6 bg-black">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-6 gradient-text leading-tight tracking-tight">
            Activities Gallery
          </h2>
          <p className="text-center text-white/80 mb-4 max-w-3xl mx-auto text-xl leading-relaxed font-light">
            Capturing highlights from Navy training sessions, TrackerHero
            meetups, and project snapshots.
          </p>
          <div className="w-24 h-1 mt-15 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full" />
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedCategory === category
                  ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30"
                  : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white border border-gray-600/50"
              }`}
            >
              {category}
              <span className="ml-2 text-xs opacity-70">
                (
                {category === "All"
                  ? galleryImages.length
                  : galleryImages.filter((img) => img.category === category)
                      .length}
                )
              </span>
            </button>
          ))}
        </div>

        <div className="mb-16">
          <div className="text-center text-white/70 mb-8">
            <div className="flex justify-center items-center gap-4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent to-blue-500/30" />
              <div className="w-2 h-2 bg-blue-400 rounded-full" />
              <div className="flex-1 h-px bg-gradient-to-l from-transparent to-purple-500/30" />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-[600px]">
            {[...Array(3)].map((_, columnIndex) => (
              <div key={columnIndex} className="space-y-6">
                {[...Array(4)].map((_, cardIndex) => (
                  <div
                    key={cardIndex}
                    className="bg-gray-800/30 border border-gray-700/30 rounded-xl overflow-hidden animate-pulse"
                  >
                    <div className="aspect-square bg-gray-700/50" />
                    <div className="p-4">
                      <div className="h-4 bg-gray-700/50 rounded mb-2" />
                      <div className="h-3 bg-gray-700/30 rounded w-20" />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div
            className={`grid gap-6 transition-opacity duration-500 ${
              numColumns === 1
                ? "grid-cols-1"
                : numColumns === 2
                ? "grid-cols-1 md:grid-cols-2"
                : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            } ${enableScroll ? "h-[600px]" : ""}`}
            style={
              enableScroll
                ? {
                    maskImage:
                      "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
                  }
                : undefined
            }
          >
            {imageColumns.map((col, idx) => (
              <ScrollingColumn
                key={`col-${idx}`}
                images={col}
                direction={idx % 2 === 0 ? "up" : "down"}
                speed={30}
                enableScroll={enableScroll}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
