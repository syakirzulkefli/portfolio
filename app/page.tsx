import Image from "next/image";
import Navigation from "./components/Navigation";
import FloatingParticles from "./components/FloatingParticles";
import TechStackAnimation from "./components/TechStackAnimation";
import TimelineAnimation from "../components/TimelineAnimation";
import ScrollingGallery from "./components/ScrollingGallery";
import ErrorBoundary from "./components/ErrorBoundary";
import ScrollReset from "./components/ScrollReset";
import BackToTop from "./components/BackToTop";

export default function Home() {
  return (
    <div className="min-h-screen relative">
      <ScrollReset />
      <FloatingParticles />
      <a
        href="#work"
        className="sr-only focus:not-sr-only fixed top-2 left-2 bg-black/70 text-white px-3 py-2 rounded z-50"
      >
        Skip to content
      </a>
      <Navigation />

      <section
        className="min-h-screen flex flex-col items-center justify-start px-6 relative pt-28 md:pt-32 pb-8 sm:pb-12"
        style={{
          background: `
            radial-gradient(69.74% 43.14% at 76.7% 39.73%, 
              rgba(90, 103, 216, 0.30) 0%, 
              rgba(90, 103, 216, 0.00) 100%), 
            radial-gradient(65.92% 55.86% at 28.92% 28.89%, 
              rgba(90, 103, 216, 0.30) 0%, 
              rgba(90, 103, 216, 0.00) 100%),
            linear-gradient(180deg, 
              #2D3748 0%,
              #1A202C 18%,
              #171923 36%,
              #0B0F14 48%,
              #000000 56%,
              #000000 100%
            )
          `,
        }}
      >
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-5 md:mb-6 relative z-10">
            <h1 className="text-[clamp(2rem,8vw,6rem)] md:text-[clamp(3rem,7vw,7rem)] font-semibold mb-6 text-shadow drop-shadow-sm leading-tight tracking-tight">
              <span className="gradient-text">Full-Stack</span> Software
              Engineer
            </h1>
          </div>

          <p className="text-lg md:text-xl text-white/85 mb-6 md:mb-8 max-w-[70ch] mx-auto leading-relaxed font-normal">
            I build secure and scalable web applications. My background working
            directly with clients helps me turn real needs into practical
            software solutions.
          </p>

          <div className="flex flex-wrap justify-center gap-8 mt-2 md:mt-3 mb-10 md:mb-12 text-white/60">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">6+</div>
              <div className="text-sm">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">Enterprise</div>
              <div className="text-sm">Gov / MINDEF Projects</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">Automation</div>
              <div className="text-sm">Workflows & Integrations</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10 mt-2 md:mt-3">
            <a
              href="#work"
              role="button"
              aria-label="View projects"
              className="bg-white text-slate-900 px-8 py-4 rounded-lg font-semibold hover:bg-white/90 transition-all glow-effect hover-scale magnetic-effect focus:outline-none focus:ring-2 focus:ring-purple-400/70 shadow-sm hover:shadow-md"
            >
              View Projects
            </a>
            <a
              href="#contact"
              role="button"
              aria-label="Contact me"
              className="border border-white/20 text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/5 transition-all neon-border focus:outline-none focus:ring-2 focus:ring-purple-400/70 shadow-sm hover:shadow-md"
            >
              Contact Me
            </a>
          </div>

          <div className="w-full max-w-6xl mx-auto mt-12 md:mt-16">
            <TechStackAnimation />
          </div>
        </div>
      </section>

      <TimelineAnimation />

      <section id="work" className="py-20 px-6 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold text-center mb-4 gradient-text leading-tight tracking-tight">
            Featured Work
          </h2>
          <p className="text-center text-white/70 mb-16 max-w-2xl mx-auto text-lg leading-relaxed">
            Selected projects that showcase problem-solving approach and
            business impact
          </p>

          <div className="space-y-16">
            <div className="card-blur rounded-3xl p-8 hover:glow-effect transition-all hover-scale relative overflow-hidden">
              <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm font-semibold">
                      Featured
                    </span>
                    <span className="text-white/60">2025</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-semibold mb-4 leading-tight tracking-tight">
                    Royal Malaysian Navy - Integrated Readiness Information
                    System
                  </h3>
                  <p className="text-white/75 text-base md:text-lg mb-6 leading-relaxed font-normal">
                    Developed for the Royal Malaysian Navy (MINDEF), supporting
                    secure, large-scale operations across engineering, HR,
                    logistics, finance, administration, and operations.
                  </p>

                  <div className="grid grid-cols-3 gap-6 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">
                        10+
                      </div>
                      <div className="text-sm text-white/60">
                        Modules Deployed
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">
                        RBAC
                      </div>
                      <div className="text-sm text-white/60">
                        Role-Based Access
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">
                        24/7
                      </div>
                      <div className="text-sm text-white/60">
                        Uptime Mission Critical
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm">
                      React
                    </span>
                    <span className="bg-orange-500/20 text-orange-300 px-3 py-1 rounded-full text-sm">
                      Next.js
                    </span>
                    <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm">
                      Node.js
                    </span>
                    <span className="bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded-full text-sm">
                      PostgreSQL
                    </span>
                    <span className="bg-red-500/20 text-red-300 px-3 py-1 rounded-full text-sm">
                      n8n
                    </span>
                  </div>

                  {/* <div className="flex gap-4">
                    <button className="bg-white text-slate-900 px-6 py-3 rounded-lg font-semibold hover:bg-white/90 transition-all">
                      View Case Study
                    </button>
                    <button className="border border-white/20 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/5 transition-all">
                      Live Demo
                    </button>
                  </div> */}
                </div>
                <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl h-80 relative overflow-hidden holographic">
                  <Image
                    src="/galleryimage/iris_background.png"
                    alt="Royal Malaysian Navy IRIS application background"
                    fill
                    className="object-cover"
                    priority
                  />
                  {/* <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 animate-shimmer"></div> */}
                </div>
              </div>
            </div>

            {/* <div className="card-blur rounded-3xl p-8 hover:glow-effect transition-all hover-scale relative overflow-hidden">
              <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
                <div className="bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-2xl h-80 flex items-center justify-center lg:order-1 relative overflow-hidden holographic">
                  <div className="text-white/60 text-center z-10 relative">
                    <div className="text-6xl mb-4 animate-bounce">🚀</div>
                    <div className="font-semibold">SaaS Dashboard</div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-l from-transparent via-white/10 to-transparent transform skew-x-12 animate-shimmer"></div>
                </div>
                <div className="lg:order-2">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm font-semibold">
                      SaaS
                    </span>
                    <span className="text-white/60">2023</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-semibold mb-4 leading-tight tracking-tight">
                    Analytics Dashboard Platform
                  </h3>
                  <p className="text-white/75 text-base md:text-lg mb-6 leading-relaxed font-normal">
                    Built real-time analytics platform processing 1M+ events
                    daily. Designed scalable microservices architecture with
                    advanced data visualization.
                  </p>

                  <div className="grid grid-cols-3 gap-6 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">
                        1M+
                      </div>
                      <div className="text-sm text-white/60">Events/Day</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">
                        99.9%
                      </div>
                      <div className="text-sm text-white/60">Uptime</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">
                        500ms
                      </div>
                      <div className="text-sm text-white/60">API Response</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm">
                      Next.js
                    </span>
                    <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm">
                      TypeScript
                    </span>
                    <span className="bg-orange-500/20 text-orange-300 px-3 py-1 rounded-full text-sm">
                      Python
                    </span>
                    <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm">
                      MongoDB
                    </span>
                  </div>

                  <div className="flex gap-4">
                    <button className="bg-white text-slate-900 px-6 py-3 rounded-lg font-semibold hover:bg-white/90 transition-all">
                      View Case Study
                    </button>
                    <button className="border border-white/20 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/5 transition-all">
                      GitHub
                    </button>
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </section>

      <BackToTop />

      <section
        id="experience"
        className="py-20 px-6 bg-black relative overflow-hidden"
      >
        {/* Experience timeline */}
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-semibold leading-tight mb-4">
              My Professional <span className="gradient-text">Journey</span>
            </h2>
            <p className="text-lg text-white/80 leading-relaxed max-w-2xl mx-auto">
              A journey from managing people and projects to building the
              systems that power them.
            </p>
          </div>

          <div className="prisma-timeline">
            <span
              className="prisma-timeline-line"
              style={{ height: "2800px" }}
            ></span>

            <div className="space-y-40">
              <div className="prisma-timeline-item" data-animate="true">
                <div className="prisma-timeline-icon hover:scale-110 transition-all duration-300 group">
                  <span className="text-[#71E8DF] font-bold text-lg">2022</span>
                </div>

                <div className="timeline-cards">
                  <div className="prisma-job-card group hover:scale-[1.02] transition-all duration-300">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm font-semibold">
                          Current
                        </span>
                        <span className="text-[#71E8DF] font-semibold">
                          2023 - Present
                        </span>
                      </div>

                      <h3 className="text-3xl font-semibold text-white">
                        Full-Stack Software Developer
                      </h3>
                      <p className="text-[#71E8DF] font-medium text-xl">
                        Current Company
                      </p>

                      <div className="space-y-4 text-white/80 text-lg">
                        <p>
                          Developing enterprise-level web applications using
                          modern full-stack technologies. Building secure,
                          scalable solutions with focus on performance and user
                          experience.
                        </p>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <span className="text-[#71E8DF] mt-1">▸</span>
                            <span>
                              Building responsive web applications with React
                              and TypeScript
                            </span>
                          </div>
                          <div className="flex items-start gap-3">
                            <span className="text-[#71E8DF] mt-1">▸</span>
                            <span>
                              Implementing secure authentication and data
                              management systems
                            </span>
                          </div>
                          <div className="flex items-start gap-3">
                            <span className="text-[#71E8DF] mt-1">▸</span>
                            <span>
                              Collaborating with cross-functional teams on
                              feature development
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="prisma-content-card accelerate group hover:scale-[1.02] transition-all duration-300">
                    <div className="space-y-6">
                      <div className="prisma-tabs">
                        <button className="prisma-tab active">
                          performance.tsx
                        </button>
                        <button className="prisma-tab">architecture.js</button>
                      </div>
                      <div className="prisma-code-block">
                        <code className="text-white">
                          <div className="mb-2">
                            <span className="token keyword">const</span>
                            <span className="token plain"> optimizeApp = </span>
                            <span className="token keyword">async</span>
                            <span className="token plain"> () </span>
                            <span className="token operator">=&gt;</span>
                            <span className="token plain"> </span>
                            <span className="token punctuation">{"{"}</span>
                          </div>
                          <div className="ml-4 mb-2">
                            <span className="token keyword">const</span>
                            <span className="token plain"> result = </span>
                            <span className="token keyword">await</span>
                            <span className="token plain"> performance.</span>
                            <span className="token function">improve</span>
                            <span className="token punctuation">(</span>
                            <span className="token punctuation">{"{"}</span>
                          </div>
                          <div className="ml-8 mb-2">
                            <span className="token plain">loadTime</span>
                            <span className="token operator">:</span>
                            <span className="token string">
                              {" "}
                              &quot;60% faster&quot;
                            </span>
                            <span className="token punctuation">,</span>
                          </div>
                          <div className="ml-8 mb-2">
                            <span className="token plain">users</span>
                            <span className="token operator">:</span>
                            <span className="token string">
                              {" "}
                              &quot;100k+ daily&quot;
                            </span>
                            <span className="token punctuation">,</span>
                          </div>
                          <div className="ml-8 mb-2">
                            <span className="token plain">architecture</span>
                            <span className="token operator">:</span>
                            <span className="token string">
                              {" "}
                              &quot;microservices&quot;
                            </span>
                          </div>
                          <div className="ml-4 mb-2">
                            <span className="token punctuation">{"}"}</span>
                            <span className="token punctuation">{")"}</span>
                          </div>
                          <div className="mb-4"></div>
                          <div className="ml-4 mb-2">
                            <span className="token keyword">return</span>
                            <span className="token plain"> </span>
                            <span className="token punctuation">{"{"}</span>
                            <span className="token plain"> success</span>
                            <span className="token operator">:</span>
                            <span className="token boolean"> true</span>
                            <span className="token plain">, result </span>
                            <span className="token punctuation">{"}"}</span>
                          </div>
                          <div>
                            <span className="token punctuation">{"}"}</span>
                          </div>
                        </code>
                        <button className="prisma-copy-btn">
                          <i className="fa-solid fa-copy"></i>
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <span className="bg-[#61DAFB]/20 text-[#61DAFB] px-3 py-1 rounded-full text-sm font-medium">
                          React
                        </span>
                        <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm font-medium">
                          TypeScript
                        </span>
                        <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm font-medium">
                          AWS
                        </span>
                        <span className="bg-orange-500/20 text-orange-300 px-3 py-1 rounded-full text-sm font-medium">
                          PostgreSQL
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="prisma-timeline-item" data-animate="true">
                <div className="prisma-timeline-icon hover:scale-110 transition-all duration-300 group">
                  <span className="text-[#71E8DF] font-bold text-lg">2020</span>
                </div>
                <div className="timeline-cards">
                  <div className="prisma-job-card group hover:scale-[1.02] transition-all duration-300">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm font-semibold">
                          Growth
                        </span>
                        <span className="text-[#71E8DF] font-semibold">
                          2020 - 2022
                        </span>
                      </div>

                      <h3 className="text-3xl font-semibold text-white">
                        Full-Stack Developer
                      </h3>
                      <p className="text-[#71E8DF] font-medium text-xl">
                        Previous Role
                      </p>

                      <div className="space-y-4 text-white/80 text-lg">
                        <p>
                          Developed web applications using JavaScript and React.
                          Learned modern development practices and gained
                          experience with full-stack development workflows.
                        </p>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <span className="text-[#71E8DF] mt-1">▸</span>
                            <span>
                              Built interactive user interfaces with React and
                              vanilla JavaScript
                            </span>
                          </div>
                          <div className="flex items-start gap-3">
                            <span className="text-[#71E8DF] mt-1">▸</span>
                            <span>
                              Worked with APIs and integrated third-party
                              services
                            </span>
                          </div>
                          <div className="flex items-start gap-3">
                            <span className="text-[#71E8DF] mt-1">▸</span>
                            <span>
                              Gained experience with version control and team
                              collaboration
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="prisma-content-card postgres group hover:scale-[1.02] transition-all duration-300">
                    <div className="space-y-6">
                      <div className="prisma-tabs">
                        <button className="prisma-tab active">
                          backend.ts
                        </button>
                        <button className="prisma-tab">deployment.yml</button>
                      </div>
                      <div className="prisma-code-block">
                        <code className="text-white">
                          <div className="mb-2">
                            <span className="token keyword">export</span>
                            <span className="token plain"> </span>
                            <span className="token keyword">const</span>
                            <span className="token plain"> system = </span>
                            <span className="token punctuation">{"{"}</span>
                          </div>
                          <div className="ml-4 mb-2">
                            <span className="token plain">api</span>
                            <span className="token operator">:</span>
                            <span className="token string">
                              {" "}
                              &quot;nodejs/express&quot;
                            </span>
                            <span className="token punctuation">,</span>
                          </div>
                          <div className="ml-4 mb-2">
                            <span className="token plain">database</span>
                            <span className="token operator">:</span>
                            <span className="token string">
                              {" "}
                              &quot;postgresql&quot;
                            </span>
                            <span className="token punctuation">,</span>
                          </div>
                          <div className="ml-4 mb-2">
                            <span className="token plain">cache</span>
                            <span className="token operator">:</span>
                            <span className="token string">
                              {" "}
                              &quot;redis&quot;
                            </span>
                          </div>
                          <div className="mb-2">
                            <span className="token punctuation">{"}"}</span>
                          </div>
                        </code>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="prisma-timeline-item" data-animate="true">
                <div className="prisma-timeline-icon hover:scale-110 transition-all duration-300 group">
                  <span className="text-[#71E8DF] font-bold text-lg">Now</span>
                </div>
                <div className="timeline-cards">
                  <div className="prisma-job-card group hover:scale-[1.02] transition-all duration-300">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          Evolution
                        </span>
                        <span className="text-[#71E8DF] font-semibold">
                          2018 - Present
                        </span>
                      </div>

                      <h3 className="text-3xl font-semibold text-white">
                        Continuous Learning Journey
                      </h3>
                      <p className="text-[#71E8DF] font-medium text-xl">
                        From HTML to Modern Full-Stack
                      </p>

                      <div className="space-y-4 text-white/80 text-lg">
                        <p>
                          My development journey: fully committed to growth,
                          continuous learning, and innovation. Building amazing
                          digital experiences with modern technologies.
                        </p>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <span className="text-[#71E8DF] mt-1">▸</span>
                            <span>
                              Evolved from HTML/CSS to full TypeScript ecosystem
                            </span>
                          </div>
                          <div className="flex items-start gap-3">
                            <span className="text-[#71E8DF] mt-1">▸</span>
                            <span>
                              Built type-safe applications with modern
                              frameworks
                            </span>
                          </div>
                          <div className="flex items-start gap-3">
                            <span className="text-[#71E8DF] mt-1">▸</span>
                            <span>
                              Always learning new technologies and best
                              practices
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="prisma-content-card postgres group hover:scale-[1.02] transition-all duration-300">
                    <div className="space-y-6">
                      <div className="prisma-tabs">
                        <button className="prisma-tab active">
                          evolution.ts
                        </button>
                        <button className="prisma-tab">types.d.ts</button>
                        <button className="prisma-tab">career.config.ts</button>
                      </div>
                      <div className="prisma-code-block">
                        <code className="text-white">
                          <div className="mb-2">
                            <span className="token keyword">interface</span>
                            <span className="token plain"> </span>
                            <span className="token class-name">
                              DeveloperGrowth
                            </span>
                            <span className="token plain"> </span>
                            <span className="token punctuation">{"{"}</span>
                          </div>
                          <div className="ml-4 mb-2">
                            <span className="token plain">skills</span>
                            <span className="token operator">:</span>
                            <span className="token plain"> string</span>
                            <span className="token punctuation">[</span>
                            <span className="token punctuation">]</span>
                          </div>
                          <div className="ml-4 mb-2">
                            <span className="token plain">experience</span>
                            <span className="token operator">:</span>
                            <span className="token plain"> number</span>
                          </div>
                          <div className="ml-4 mb-2">
                            <span className="token plain">passion</span>
                            <span className="token operator">:</span>
                            <span className="token plain"> boolean</span>
                          </div>
                          <div className="mb-2">
                            <span className="token punctuation">{"}"}</span>
                          </div>
                          <div className="mb-4"></div>
                          <div className="mb-2">
                            <span className="token keyword">const</span>
                            <span className="token plain"> myJourney</span>
                            <span className="token operator">:</span>
                            <span className="token plain">
                              {" "}
                              DeveloperGrowth ={" "}
                            </span>
                            <span className="token punctuation">{"{"}</span>
                          </div>
                          <div className="ml-4 mb-2">
                            <span className="token plain">skills</span>
                            <span className="token operator">:</span>
                            <span className="token plain"> </span>
                            <span className="token punctuation">[</span>
                            <span className="token string">
                              &apos;React&apos;
                            </span>
                            <span className="token punctuation">,</span>
                            <span className="token plain"> </span>
                            <span className="token string">
                              &apos;Node.js&apos;
                            </span>
                            <span className="token punctuation">,</span>
                            <span className="token plain"> </span>
                            <span className="token string">
                              &apos;TypeScript&apos;
                            </span>
                            <span className="token punctuation">]</span>
                            <span className="token punctuation">,</span>
                          </div>
                          <div className="ml-4 mb-2">
                            <span className="token plain">experience</span>
                            <span className="token operator">:</span>
                            <span className="token plain"> 5</span>
                            <span className="token punctuation">,</span>
                          </div>
                          <div className="ml-4 mb-2">
                            <span className="token plain">passion</span>
                            <span className="token operator">:</span>
                            <span className="token plain"> </span>
                            <span className="token boolean">true</span>
                            <span className="token punctuation">,</span>
                          </div>
                          <div className="ml-4 mb-2">
                            <span className="token plain">employer</span>
                            <span className="token operator">:</span>
                            <span className="token string">
                              &quot;Looking for senior opportunities&quot;
                            </span>
                          </div>
                          <div className="mb-2">
                            <span className="token punctuation">{"}"}</span>
                          </div>
                        </code>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-20 px-6 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-semibold gradient-text leading-tight tracking-tight mb-4">
              About Me
            </h2>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              From aviation maintenance to software development - a journey of
              continuous learning and growth.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            <div className="lg:col-span-2 card-blur rounded-2xl p-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-semibold text-white mb-4 flex items-center gap-3">
                    <span className="text-3xl">🚀</span>
                    My Development Journey
                  </h3>
                  <p className="text-white/80 text-lg leading-relaxed mb-6">
                    Transitioned from helicopter maintenance engineering to
                    software development through dedicated self-learning.
                    Completed comprehensive courses from{" "}
                    <span className="text-yellow-300 font-medium">
                      Mosh Hamedani
                    </span>
                    covering modern web technologies and best practices.
                  </p>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl p-4 border border-blue-500/20">
                      <h4 className="font-semibold text-blue-300 mb-3 flex items-center gap-2">
                        💻 Technical Skills
                      </h4>
                      <div className="space-y-2 text-sm text-white/80">
                        <div>• React & TypeScript Development</div>
                        <div>• Next.js & Modern Web Frameworks</div>
                        <div>• Full-Stack JavaScript Applications</div>
                        <div>• Git Version Control & Collaboration</div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl p-4 border border-green-500/20">
                      <h4 className="font-semibold text-green-300 mb-3 flex items-center gap-2">
                        🎯 Learning Philosophy
                      </h4>
                      <div className="space-y-2 text-sm text-white/80">
                        <div>• 2+ hours daily dedicated learning</div>
                        <div>• Hands-on project-based approach</div>
                        <div>• Continuous skill improvement</div>
                        <div>• Industry best practices focus</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 pt-4">
                  <button className="bg-green-500/20 hover:bg-green-500/30 text-green-300 px-6 py-3 rounded-lg transition-all font-medium border border-green-500/30 hover:scale-105">
                    📥 Download Resume
                  </button>
                  <button className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-6 py-3 rounded-lg transition-all font-medium border border-blue-500/30 hover:scale-105">
                    📊 View Projects
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="card-blur rounded-2xl p-6">
                <div className="text-center mb-6">
                  <div className="text-2xl font-bold text-white mb-2">
                    Currently
                  </div>
                  <div className="text-green-400 font-semibold text-lg">
                    Software Engineer
                  </div>
                  <div className="text-white/60 text-sm mt-2">
                    Building scalable web applications
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3 text-white/80">
                    <span className="text-blue-400">📍</span>
                    <span>Kuala Lumpur, Malaysia</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/80">
                    <span className="text-green-400">💼</span>
                    <span>Full-time Developer</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/80">
                    <span className="text-purple-400">⏰</span>
                    <span>MYT Timezone (UTC+8)</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/80">
                    <span className="text-yellow-400">🗣️</span>
                    <span>English & Bahasa Malaysia</span>
                  </div>
                </div>
              </div>

              <div className="card-blur rounded-2xl p-6">
                <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="text-green-400">🎯</span>
                  Availability
                </h4>
                <div className="space-y-3 text-sm text-white/80">
                  <div className="flex items-center gap-3">
                    <span className="text-green-400 text-lg">✓</span>
                    <span>2 months notice period</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-blue-400 text-lg">🌐</span>
                    <span>Remote/hybrid preferred</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-purple-400 text-lg">📋</span>
                    <span>Open to new opportunities</span>
                  </div>
                </div>
              </div>

              <div className="card-blur rounded-2xl p-6">
                <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="text-yellow-400">🎓</span>
                  Education
                </h4>
                <div className="space-y-3">
                  <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg p-3 border border-yellow-500/20">
                    <div className="font-medium text-yellow-300 text-sm mb-1">
                      Engineering Technology
                    </div>
                    <div className="text-white/60 text-xs">
                      UniKL MIAT - Aviation Maintenance
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-lg p-3 border border-green-500/20">
                    <div className="font-medium text-green-300 text-sm mb-1">
                      Web Development
                    </div>
                    <div className="text-white/60 text-xs">
                      Mosh Hamedani - React, TypeScript, Next.js
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <ErrorBoundary>
        <ScrollingGallery />
      </ErrorBoundary>

      {/* Contact */}
      <section id="contact" className="py-20 px-6 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-full mb-8">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm font-medium">
                Available for Projects
              </span>
            </div>

            <h2 className="text-4xl md:text-6xl font-semibold mb-6 gradient-text leading-tight tracking-tight">
              Let&apos;s Work Together
            </h2>
            <p className="text-white/90 text-xl mb-4 max-w-3xl mx-auto font-light leading-relaxed">
              Software Engineer with experience in secure enterprise systems.
              Open to new opportunities and interesting projects.
            </p>

            <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl p-4 border border-purple-500/20 mb-8 max-w-2xl mx-auto">
              <div className="grid grid-cols-2 gap-6 text-sm">
                <div className="text-center">
                  <div className="text-xl font-bold text-purple-300">2+</div>
                  <div className="text-white/75">Total Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-blue-300">
                    2 months
                  </div>
                  <div className="text-white/75">Notice Period</div>
                </div>
              </div>
            </div>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full mb-8" />

            <div className="grid md:grid-cols-3 gap-6 mb-16">
              <div className="group bg-gradient-to-br from-gray-800/60 to-gray-900/80 border border-gray-700/30 rounded-xl p-6 hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 backdrop-blur-sm">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  📧
                </div>
                <div className="font-bold text-white mb-2 text-lg">Email</div>
                <div className="text-blue-400 font-medium">
                  syakir.career@gmail.com
                </div>
                <div className="mt-3 text-xs text-white/50">Available 24/7</div>
              </div>
              <div className="group bg-gradient-to-br from-gray-800/60 to-gray-900/80 border border-gray-700/30 rounded-xl p-6 hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10 backdrop-blur-sm">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  💼
                </div>
                <div className="font-bold text-white mb-2 text-lg">
                  LinkedIn
                </div>
                <div className="text-purple-400 font-medium">
                  linkedin.com/in/syakir-career
                </div>
                <div className="mt-3 text-xs text-white/50">
                  Professional Network
                </div>
              </div>
              <div className="group bg-gradient-to-br from-gray-800/60 to-gray-900/80 border border-gray-700/30 rounded-xl p-6 hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/10 backdrop-blur-sm">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  🐙
                </div>
                <div className="font-bold text-white mb-2 text-lg">GitHub</div>
                <div className="text-green-400 font-medium">
                  github.com/syakir-dev
                </div>
                <div className="mt-3 text-xs text-white/50">
                  Code Repository
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="inline-flex items-center gap-3 p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                  <span className="text-green-400 font-bold text-lg">
                    Currently employed as developer
                  </span>
                </div>
                <div className="text-white/50 text-sm border-l border-green-500/30 pl-3">
                  Software Engineer
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 px-6 border-t border-white/10 bg-black">
        <div className="max-w-6xl mx-auto text-center text-white/60">
          <p>&copy; 2024 Syakir. Built with Next.js and Tailwind CSS.</p>
        </div>
      </footer>
    </div>
  );
}
