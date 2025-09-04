'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  category: string;
}

const galleryImages: GalleryImage[] = [
  {
    id: 1,
    src: "/galleryimage/WhatsApp Image 2025-07-01 at 15.06.34.jpeg",
    alt: "Training Session 1",
    category: "Training"
  },
  {
    id: 2,
    src: "/galleryimage/WhatsApp Image 2025-07-01 at 14.57.17.jpeg",
    alt: "CSR Activity 1",
    category: "CSR"
  },
  {
    id: 3,
    src: "/galleryimage/WhatsApp Image 2025-07-01 at 15.06.34 copy.jpeg",
    alt: "Training Session 2",
    category: "Training"
  },
  {
    id: 4,
    src: "/galleryimage/WhatsApp Image 2025-07-28 at 09.51.10.jpeg",
    alt: "Community Event 1",
    category: "Community"
  },
  {
    id: 5,
    src: "/galleryimage/WhatsApp Image 2025-07-28 at 09.51.11.jpeg",
    alt: "Community Event 2",
    category: "Community"
  },
  {
    id: 6,
    src: "/galleryimage/WhatsApp Image 2025-07-28 at 16.15.38 (1).jpeg",
    alt: "Workshop 1",
    category: "Workshop"
  },
  {
    id: 7,
    src: "/galleryimage/WhatsApp Image 2025-07-28 at 16.15.38.jpeg",
    alt: "Workshop 2",
    category: "Workshop"
  },
  {
    id: 8,
    src: "/galleryimage/WhatsApp Image 2025-07-29 at 12.32.30.jpeg",
    alt: "Team Activity 1",
    category: "Team"
  },
  {
    id: 9,
    src: "/galleryimage/WhatsApp Image 2025-08-03 at 11.00.23.jpeg",
    alt: "CSR Activity 2",
    category: "CSR"
  },
  {
    id: 10,
    src: "/galleryimage/WhatsApp Image 2025-08-13 at 09.29.16 (1).jpeg",
    alt: "Training Session 3",
    category: "Training"
  },
  {
    id: 11,
    src: "/galleryimage/WhatsApp Image 2025-08-13 at 09.29.16.jpeg",
    alt: "Training Session 4",
    category: "Training"
  },
  {
    id: 12,
    src: "/galleryimage/WhatsApp Image 2025-08-13 at 09.29.17.jpeg",
    alt: "Training Session 5",
    category: "Training"
  },
  {
    id: 13,
    src: "/galleryimage/WhatsApp Image 2025-08-13 at 14.57.12 (1).jpeg",
    alt: "Team Building 1",
    category: "Team"
  },
  {
    id: 14,
    src: "/galleryimage/WhatsApp Image 2025-08-13 at 14.57.12.jpeg",
    alt: "Team Building 2",
    category: "Team"
  },
  {
    id: 15,
    src: "/galleryimage/WhatsApp Image 2025-08-13 at 14.57.13 (1).jpeg",
    alt: "Team Building 3",
    category: "Team"
  },
  {
    id: 16,
    src: "/galleryimage/WhatsApp Image 2025-08-13 at 14.57.13.jpeg",
    alt: "Team Building 4",
    category: "Team"
  },
  {
    id: 17,
    src: "/galleryimage/WhatsApp Image 2025-08-14 at 09.21.06.jpeg",
    alt: "Conference 1",
    category: "Conference"
  },
  {
    id: 18,
    src: "/galleryimage/WhatsApp Image 2025-08-14 at 09.21.09.jpeg",
    alt: "Conference 2",
    category: "Conference"
  },
  {
    id: 19,
    src: "/galleryimage/WhatsApp Image 2025-08-14 at 09.21.10.jpeg",
    alt: "Conference 3",
    category: "Conference"
  },
  {
    id: 20,
    src: "/galleryimage/WhatsApp Image 2025-08-14 at 09.21.12.jpeg",
    alt: "Networking Event 1",
    category: "Networking"
  },
  {
    id: 21,
    src: "/galleryimage/WhatsApp Image 2025-08-14 at 09.21.13.jpeg",
    alt: "Networking Event 2",
    category: "Networking"
  },
  {
    id: 22,
    src: "/galleryimage/WhatsApp Image 2025-08-14 at 09.21.14.jpeg",
    alt: "Networking Event 3",
    category: "Networking"
  }
];

// Split images into 3 columns for better distribution
const splitImages = (images: GalleryImage[], columns: number) => {
  const result = Array.from({ length: columns }, () => [] as GalleryImage[]);
  images.forEach((image, index) => {
    result[index % columns].push(image);
  });
  return result;
};

const getCategoryColor = (category: string) => {
  const colors = {
    'Training': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    'CSR': 'bg-green-500/20 text-green-300 border-green-500/30',
    'Community': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    'Workshop': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    'Team': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    'Conference': 'bg-red-500/20 text-red-300 border-red-500/30',
    'Networking': 'bg-pink-500/20 text-pink-300 border-pink-500/30'
  };
  return colors[category as keyof typeof colors] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
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
      
      {/* Category badge overlay */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
        <div className={`px-2 py-1 rounded-full text-xs font-medium border backdrop-blur-sm ${getCategoryColor(image.category)}`}>
          {image.category}
        </div>
      </div>
    </div>
    
    {/* Enhanced text section */}
    <div className="p-4 bg-gradient-to-r from-gray-800/50 to-gray-800/30 backdrop-blur-sm">
      <div className="text-white text-sm font-semibold leading-tight mb-2 group-hover:text-blue-100 transition-colors duration-300">
        {image.alt}
      </div>
      <div className="flex items-center justify-between">
        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(image.category)}`}>
          {image.category}
        </div>
        <div className="w-2 h-2 rounded-full bg-blue-400 opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </div>
    
    {/* Subtle glow effect */}
    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
  </div>
);

const ScrollingColumn = ({ 
  images, 
  direction = 'up',
  speed = 50 
}: { 
  images: GalleryImage[];
  direction?: 'up' | 'down';
  speed?: number;
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isHovered = useRef(false);

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) return;

    let animationId: number;
    let scrollPosition = direction === 'up' ? 0 : scrollElement.scrollHeight / 2;

    const scroll = () => {
      // Only scroll if not hovered
      if (!isHovered.current) {
        if (direction === 'up') {
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

    // Start after a brief delay to ensure proper rendering
    const timeoutId = setTimeout(() => {
      animationId = requestAnimationFrame(scroll);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      cancelAnimationFrame(animationId);
    };
  }, [direction, speed]);

  const handleMouseEnter = () => {
    isHovered.current = true;
  };

  const handleMouseLeave = () => {
    isHovered.current = false;
  };

  // Duplicate images for seamless loop
  const duplicatedImages = [...images, ...images];

  return (
    <div 
      ref={scrollRef}
      className="h-full overflow-hidden cursor-pointer"
      style={{
        maskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)'
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="space-y-0">
        {duplicatedImages.map((image, index) => (
          <GalleryCard 
            key={`${image.id}-${index}`} 
            image={image} 
          />
        ))}
      </div>
    </div>
  );
};

export default function ScrollingGallery() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  
  const categories = ['All', ...Array.from(new Set(galleryImages.map(img => img.category)))];
  
  const filteredImages = selectedCategory === 'All' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === selectedCategory);
  
  const imageColumns = splitImages(filteredImages, 3);

  useEffect(() => {
    // Simulate loading delay for better UX
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="py-20 px-6 bg-black">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-6 gradient-text leading-tight tracking-tight">
            My Activities & Contributions
          </h2>
          <p className="text-center text-white/80 mb-4 max-w-3xl mx-auto text-xl leading-relaxed font-light">
            Capturing moments from training sessions, CSR activities, community events, and professional engagements
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full" />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white border border-gray-600/50'
              }`}
            >
              {category}
              <span className="ml-2 text-xs opacity-70">
                ({category === 'All' ? galleryImages.length : galleryImages.filter(img => img.category === category).length})
              </span>
            </button>
          ))}
        </div>

        <div className="mb-16">
          <div className="text-center text-white/70 mb-8">
            <h3 className="text-lg font-medium tracking-wide uppercase mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              ACTIVELY ENGAGED IN <span className="text-blue-400 font-bold">COMMUNITY BUILDING</span> AND PROFESSIONAL DEVELOPMENT
            </h3>
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
                  <div key={cardIndex} className="bg-gray-800/30 border border-gray-700/30 rounded-xl overflow-hidden animate-pulse">
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
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-[600px] transition-opacity duration-500"
            style={{
              maskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)'
            }}
          >
            <ScrollingColumn 
              images={imageColumns[0]} 
              direction="up" 
              speed={25}
            />
            <ScrollingColumn 
              images={imageColumns[1]} 
              direction="down" 
              speed={20}
            />
            <ScrollingColumn 
              images={imageColumns[2]} 
              direction="up" 
              speed={30}
            />
          </div>
        )}
      </div>
    </section>
  );
}