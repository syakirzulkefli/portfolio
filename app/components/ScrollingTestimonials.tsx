'use client';

import { useEffect, useRef } from 'react';

interface Testimonial {
  id: number;
  quote: string;
  author: string;
  role: string;
  company: string;
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    quote: "Syakir delivered exceptional results on our platform redesign. His technical expertise and attention to detail helped us achieve a 40% increase in conversion rates.",
    author: "John Smith",
    role: "CTO",
    company: "TechCorp",
    avatar: "JS"
  },
  {
    id: 2,
    quote: "Working with Syakir was a game-changer. He transformed our MVP into a production-ready platform that helped secure our Series A funding.",
    author: "Maria Johnson",
    role: "Product Manager",
    company: "StartupXYZ",
    avatar: "MJ"
  },
  {
    id: 3,
    quote: "Syakir is an exceptional mentor and team lead. His code reviews and architectural decisions have significantly improved our development process.",
    author: "David Lee",
    role: "Senior Developer",
    company: "DevCorp",
    avatar: "DL"
  },
  {
    id: 4,
    quote: "Thanks to Syakir, we can seamlessly scale our applications without concerns about data layer performance. His solutions are both elegant and robust.",
    author: "Sarah Chen",
    role: "CTO",
    company: "ScaleUp Inc",
    avatar: "SC"
  },
  {
    id: 5,
    quote: "Syakir helped us migrate our legacy system to modern architecture with zero downtime. His planning and execution were flawless.",
    author: "Michael Rodriguez",
    role: "Engineering Director",
    company: "InnovateCo",
    avatar: "MR"
  },
  {
    id: 6,
    quote: "His TypeScript expertise and attention to type safety has transformed our development workflow. Code quality improved dramatically.",
    author: "Emily Zhang",
    role: "Lead Frontend Developer",
    company: "BuildFast",
    avatar: "EZ"
  },
  {
    id: 7,
    quote: "Syakir's architectural decisions have been instrumental in our platform's success. His solutions are scalable and maintainable.",
    author: "James Wilson",
    role: "VP Engineering",
    company: "DataFlow",
    avatar: "JW"
  },
  {
    id: 8,
    quote: "Working with Syakir on our React optimization was amazing. Performance improved by 60% and user experience is now fantastic.",
    author: "Lisa Park",
    role: "Product Lead",
    company: "UserFirst",
    avatar: "LP"
  },
  {
    id: 9,
    quote: "His expertise in Node.js and PostgreSQL helped us handle 1M+ daily active users without any performance issues.",
    author: "Robert Kim",
    role: "Senior Backend Engineer",
    company: "HighScale",
    avatar: "RK"
  },
  {
    id: 10,
    quote: "Syakir's mentorship has been invaluable. He taught our team modern React patterns and best practices.",
    author: "Amanda Foster",
    role: "Junior Developer",
    company: "LearnTech",
    avatar: "AF"
  },
  {
    id: 11,
    quote: "The deployment pipeline he built for us reduced our release time from hours to minutes. Game-changing efficiency.",
    author: "Kevin Thompson",
    role: "DevOps Lead",
    company: "CloudFirst",
    avatar: "KT"
  },
  {
    id: 12,
    quote: "His full-stack expertise allowed us to ship features faster while maintaining high code quality standards.",
    author: "Rachel Green",
    role: "Engineering Manager",
    company: "RapidDev",
    avatar: "RG"
  }
];

// Split testimonials into 3 columns for better distribution
const splitTestimonials = (testimonials: Testimonial[], columns: number) => {
  const result = Array.from({ length: columns }, () => [] as Testimonial[]);
  testimonials.forEach((testimonial, index) => {
    result[index % columns].push(testimonial);
  });
  return result;
};

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => (
  <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6 mb-6 hover:bg-gray-800/70 transition-colors">
    <div className="mb-4">
      <p className="text-white/90 leading-relaxed">
        <strong>{testimonial.quote.split(' ').slice(0, 3).join(' ')}</strong>{' '}
        {testimonial.quote.split(' ').slice(3).join(' ')}
      </p>
    </div>
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
        {testimonial.avatar}
      </div>
      <div>
        <div className="text-white font-medium">{testimonial.author}</div>
        <div className="text-white/60 text-sm">
          {testimonial.role} <span className="text-blue-400">@{testimonial.company}</span>
        </div>
      </div>
    </div>
  </div>
);

const ScrollingColumn = ({ 
  testimonials, 
  direction = 'up',
  speed = 50 
}: { 
  testimonials: Testimonial[];
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

  // Duplicate testimonials for seamless loop
  const duplicatedTestimonials = [...testimonials, ...testimonials];

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
        {duplicatedTestimonials.map((testimonial, index) => (
          <TestimonialCard 
            key={`${testimonial.id}-${index}`} 
            testimonial={testimonial} 
          />
        ))}
      </div>
    </div>
  );
};

export default function ScrollingTestimonials() {
  const testimonialColumns = splitTestimonials(testimonials, 3);

  return (
    <section className="py-20 px-6 bg-black">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold text-center mb-4 gradient-text leading-tight tracking-tight">
            Client Testimonials
          </h2>
          <p className="text-center text-white/70 mb-8 max-w-2xl mx-auto text-lg leading-relaxed">
            What colleagues and clients say about working with me
          </p>
        </div>

        <div className="mb-12">
          <div className="text-center text-white/60 mb-8">
            <h3 className="text-sm font-semibold tracking-wide uppercase mb-2">
              TRUSTED BY MORE THAN <span className="text-blue-400 font-bold">500k</span> MONTHLY ACTIVE DEVELOPERS GLOBALLY
            </h3>
          </div>
        </div>

        <div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-[600px]"
          style={{
            maskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)'
          }}
        >
          <ScrollingColumn 
            testimonials={testimonialColumns[0]} 
            direction="up" 
            speed={30}
          />
          <ScrollingColumn 
            testimonials={testimonialColumns[1]} 
            direction="down" 
            speed={25}
          />
          <ScrollingColumn 
            testimonials={testimonialColumns[2]} 
            direction="up" 
            speed={35}
          />
        </div>
      </div>
    </section>
  );
}