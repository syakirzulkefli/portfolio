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
              Developer
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
            Projects that I've done so far, this includes official work and also
            personal projects.
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
                    Developed for the Royal Malaysian Navy (TLDM). Secure,
                    large-scale operations across engineering, HR, logistics,
                    finance, administration, and operations.
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
                  <span className="text-[#71E8DF] font-bold text-lg">Now</span>
                </div>

                <div className="timeline-cards">
                  <div className="prisma-job-card group hover:scale-[1.02] transition-all duration-300">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm font-semibold">
                          Current
                        </span>
                        <span className="text-[#71E8DF] font-semibold">
                          Dec 2023 - Present
                        </span>
                      </div>

                      <h3 className="text-3xl font-semibold text-white">
                        Full-Stack Software Developer
                      </h3>
                      <p className="text-[#71E8DF] font-medium text-xl">
                        Tulip Resources Sdn. Bhd.
                      </p>

                      <div className="space-y-4 text-white/80 text-lg">
                        <p>
                          Developing RMN-IRIS, an enterprise-level web
                          applications with modern full-stack technologies.
                          Secure, scalable systems used by TLDM.
                        </p>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <span className="text-[#71E8DF] mt-1">▸</span>
                            <span>Handling core authentication modules.</span>
                          </div>
                          <div className="flex items-start gap-3">
                            <span className="text-[#71E8DF] mt-1">▸</span>
                            <span>
                              Building full-stack features end-to-end.
                            </span>
                          </div>
                          <div className="flex items-start gap-3">
                            <span className="text-[#71E8DF] mt-1">▸</span>
                            <span>Optimizing performance and reliability.</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="prisma-content-card accelerate group hover:scale-[1.02] transition-all duration-300 flex flex-col gap-4 justify-center self-center">
                    <span className="text-xs md:text-sm text-white/70 tracking-wide">
                      n8n Flows
                    </span>
                    <div
                      className="relative w-full overflow-hidden rounded-3xl bg-black/40 flex items-center justify-center"
                      style={{ aspectRatio: "3418 / 1896" }}
                    >
                      <Image
                        src="/galleryimage/n8n_screenshot.png"
                        alt="n8n automation workflow screenshot"
                        fill
                        className="object-contain object-center"
                        sizes="(min-width: 1024px) 40vw, (min-width: 768px) 60vw, 100vw"
                        priority
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="prisma-timeline-item" data-animate="true">
                <div className="prisma-timeline-icon hover:scale-110 transition-all duration-300 group">
                  <span className="text-[#71E8DF] font-bold text-lg">2023</span>
                </div>
                <div className="timeline-cards">
                  <div className="prisma-content-card group hover:scale-[1.02] transition-all duration-300 flex flex-col justify-center self-center">
                    <div className="flex flex-col gap-5">
                      <span className="text-xs md:text-sm text-white/70 tracking-wide">
                        Products
                      </span>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="rounded-xl p-5 border border-teal-500/30 bg-teal-500/10 flex flex-col items-center justify-center text-center">
                          <div className="h-12 w-12 flex items-center justify-center">
                            <Image
                              src="/galleryimage/icons8-track-96.png"
                              alt="TrackerHero route icon"
                              width={44}
                              height={44}
                              className="object-contain h-11 w-11"
                              priority={false}
                            />
                          </div>
                          <span className="mt-2 text-xs text-white/80">TrackerHero</span>
                        </div>
                        <div className="rounded-xl p-5 border border-indigo-500/30 bg-indigo-500/10 flex flex-col items-center justify-center text-center">
                          <div className="h-12 w-12 flex items-center justify-center">
                            <i className="fa-solid fa-building text-indigo-300 text-[38px] leading-none" aria-hidden="true"></i>
                          </div>
                          <span className="mt-2 text-xs text-white/80">PropKita</span>
                        </div>
                        <div className="rounded-xl p-5 border border-amber-500/30 bg-amber-500/10 flex flex-col items-center justify-center text-center">
                          <div className="h-12 w-12 flex items-center justify-center">
                            <i className="fa-solid fa-square-parking text-amber-300 text-[38px] leading-none" aria-hidden="true"></i>
                          </div>
                          <span className="mt-2 text-xs text-white/80">LPR/ANPR</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="prisma-job-card group hover:scale-[1.02] transition-all duration-300">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        {/* <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm font-semibold">
                          Growth
                        </span> */}
                        <span className="text-[#71E8DF] font-semibold">
                          March 2023 - November 2023
                        </span>
                      </div>

                      <h3 className="text-3xl font-semibold text-white">
                        Account Manager
                      </h3>
                      <p className="text-[#71E8DF] font-medium text-xl">
                        Ultrack Technology Sdn. Bhd.
                      </p>

                      <div className="space-y-4 text-white/80 text-lg">
                        <p>
                          Managed key client accounts, built lasting
                          relationships, and coordinated with internal teams to
                          deliver client-focused solutions.
                        </p>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <span className="text-[#71E8DF] mt-1">▸</span>
                            <span>
                              Tracked project progress and provided regular
                              updates to clients.
                            </span>
                          </div>
                          <div className="flex items-start gap-3">
                            <span className="text-[#71E8DF] mt-1">▸</span>
                            <span>
                              Facilitated collaboration between technical and
                              business teams.
                            </span>
                          </div>
                          <div className="flex items-start gap-3">
                            <span className="text-[#71E8DF] mt-1">▸</span>
                            <span>
                              Maintained documentation and ensured timely
                              project completion.
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="prisma-timeline-item" data-animate="true">
                <div className="prisma-timeline-icon hover:scale-110 transition-all duration-300 group">
                  <span className="text-[#71E8DF] font-bold text-lg">2021</span>
                </div>
                <div className="timeline-cards">
                  <div className="prisma-job-card group hover:scale-[1.02] transition-all duration-300">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        {/* <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          Evolution
                        </span> */}
                        <span className="text-[#71E8DF] font-semibold">
                          Jan 2021 - Feb 2023
                        </span>
                      </div>

                      <h3 className="text-3xl font-semibold text-white">
                        IT Support
                      </h3>
                      <p className="text-[#71E8DF] font-medium text-xl">
                        Ultrack Technology Sdn. Bhd.
                      </p>

                      <div className="space-y-4 text-white/80 text-lg">
                        <p>
                          Assisted users with inquiries, provided solutions via
                          chat and video calls, and supported individuals from
                          diverse backgrounds.
                        </p>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <span className="text-[#71E8DF] mt-1">▸</span>
                            <span>
                              Monitored system performance and escalated issues
                              when needed.
                            </span>
                          </div>
                          <div className="flex items-start gap-3">
                            <span className="text-[#71E8DF] mt-1">▸</span>
                            <span>
                              Logged and tracked support requests for faster
                              resolution.
                            </span>
                          </div>
                          <div className="flex items-start gap-3">
                            <span className="text-[#71E8DF] mt-1">▸</span>
                            <span>
                              Ensured smooth daily operations for all active
                              users.
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="prisma-content-card group hover:scale-[1.02] transition-all duration-300 flex flex-col justify-center self-center">
                    <div className="flex flex-col gap-5">
                      <span className="text-xs md:text-sm text-white/70 tracking-wide">
                        Product
                      </span>
                      <div className="grid grid-cols-1 gap-4 place-items-center">
                        <div className="rounded-xl p-6 border border-teal-500/30 bg-teal-500/10 flex flex-col items-center justify-center text-center w-full max-w-[160px]">
                          <div className="h-12 w-12 flex items-center justify-center">
                            <Image
                              src="/galleryimage/icons8-track-96.png"
                              alt="TrackerHero route icon"
                              width={44}
                              height={44}
                              className="object-contain h-11 w-11"
                              priority={false}
                            />
                          </div>
                          <span className="mt-2 text-sm text-white/85 font-medium">TrackerHero</span>
                        </div>
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
      {/* <section id="about" className="py-20 px-6 bg-black">
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
      </section> */}

      {/* Gallery */}
      <ErrorBoundary>
        <section id="gallery">
          <ScrollingGallery />
        </section>
      </ErrorBoundary>

      {/* Contact */}
      <section id="contact" className="py-20 px-6 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-full mb-8">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm font-medium">
                Available for New Project
              </span>
            </div>

            <h2 className="text-4xl md:text-6xl font-semibold mb-6 gradient-text leading-tight tracking-tight">
              Get in Touch
            </h2>
            <p className="text-white/90 text-xl mb-4 max-w-3xl mx-auto font-light leading-relaxed">
              Fullstack Software Developer experienced in secure enterprise
              systems — open to remote work and new opportunities.
            </p>

            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full mb-8" />

            <div className="grid md:grid-cols-2 gap-6 mb-16 max-w-3xl mx-auto">
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=msyakirzulkefli@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-gradient-to-br from-gray-800/60 to-gray-900/80 border border-gray-700/30 rounded-xl p-6 hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 backdrop-blur-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 mb-5 flex items-center justify-center rounded-2xl bg-[#1A73E8]/10 border border-[#1A73E8]/30 group-hover:scale-105 transition-transform duration-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    width="100"
                    height="100"
                    viewBox="0 0 48 48"
                  >
                    <path
                      fill="#4caf50"
                      d="M45,16.2l-5,2.75l-5,4.75L35,40h7c1.657,0,3-1.343,3-3V16.2z"
                    ></path>
                    <path
                      fill="#1e88e5"
                      d="M3,16.2l3.614,1.71L13,23.7V40H6c-1.657,0-3-1.343-3-3V16.2z"
                    ></path>
                    <polygon
                      fill="#e53935"
                      points="35,11.2 24,19.45 13,11.2 12,17 13,23.7 24,31.95 35,23.7 36,17"
                    ></polygon>
                    <path
                      fill="#c62828"
                      d="M3,12.298V16.2l10,7.5V11.2L9.876,8.859C9.132,8.301,8.228,8,7.298,8h0C4.924,8,3,9.924,3,12.298z"
                    ></path>
                    <path
                      fill="#fbc02d"
                      d="M45,12.298V16.2l-10,7.5V11.2l3.124-2.341C38.868,8.301,39.772,8,40.702,8h0 C43.076,8,45,9.924,45,12.298z"
                    ></path>
                  </svg>
                </div>
                <div className="font-bold text-white mb-2 text-lg">Email</div>
                <div className="font-medium text-[#8AB4F8]">
                  msyakirzulkefli@gmail.com
                </div>
              </a>
              <a
                href="https://wa.me/60134568185"
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-gradient-to-br from-gray-800/60 to-gray-900/80 border border-gray-700/30 rounded-xl p-6 hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/10 backdrop-blur-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400 flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 mb-5 flex items-center justify-center rounded-2xl bg-[#25D366]/10 border border-[#25D366]/30 group-hover:scale-105 transition-transform duration-300">
                  <svg
                    className="w-10 h-10"
                    viewBox="0 0 32 32"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path
                      d="M16.04 3A12.97 12.97 0 003.06 16.18a12.9 12.9 0 001.72 6.45L3 29l6.55-1.73a12.98 12.98 0 006.49 1.69h.01c7.14 0 12.96-5.75 12.96-12.84A12.7 12.7 0 0016.04 3zm.03 23.56a10.8 10.8 0 01-5.5-1.5l-.39-.23-3.88 1.03 1.04-3.79-.25-.39a10.78 10.78 0 01-1.65-5.83c0-5.97 4.89-10.82 10.9-10.82a10.6 10.6 0 017.58 3.13 10.64 10.64 0 013.15 7.55c0 5.97-4.89 10.82-10.9 10.82zm5.95-7.8c-.33-.17-1.94-.96-2.24-1.06-.3-.11-.52-.17-.74.17-.22.33-.86 1.05-1.06 1.27-.2.22-.39.25-.72.08-.33-.17-1.37-.5-2.6-1.6-.96-.86-1.61-1.91-1.8-2.23-.19-.33-.02-.51.14-.68.14-.14.33-.36.5-.55.17-.19.22-.33.33-.55.11-.22.06-.41-.03-.57-.08-.17-.74-1.78-1.02-2.44-.27-.65-.55-.56-.74-.57h-.64c-.22 0-.57.08-.86.42-.3.33-1.13 1.1-1.13 2.68 0 1.58 1.16 3.11 1.32 3.33.17.22 2.27 3.56 5.5 4.99.77.33 1.37.53 1.83.68.77.25 1.47.22 2.02.14.62-.09 1.94-.79 2.22-1.56.27-.77.27-1.43.19-1.56-.08-.13-.3-.2-.63-.36z"
                      fill="#25D366"
                    />
                  </svg>
                </div>
                <div className="font-bold text-white mb-2 text-lg">
                  WhatsApp
                </div>
                <div className="text-green-400 font-medium">+60134568185</div>
              </a>
            </div>

            {/* <div className="flex justify-center">
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
            </div> */}
          </div>
        </div>
      </section>

      <footer className="py-12 px-6 border-t border-white/10 bg-black">
        <div className="max-w-6xl mx-auto text-center text-white/60">
          <p>
            &copy; {new Date().getFullYear()} Syakir. Powered by Next.js and
            Tailwind CSS.
          </p>
        </div>
      </footer>
    </div>
  );
}
