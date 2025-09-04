import Navigation from "./components/Navigation";
import FloatingParticles from "./components/FloatingParticles";
import TechStackAnimation from "./components/TechStackAnimation";
import TimelineAnimation from "../components/TimelineAnimation";
import ScrollingGallery from "./components/ScrollingGallery";
import ErrorBoundary from "./components/ErrorBoundary";

export default function Home() {
  return (
    <div className="min-h-screen relative">
      <FloatingParticles />
      <Navigation />

      <section
        className="min-h-screen flex items-center justify-center px-6 relative pt-20"
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
              #1A202C 30%,
              #171923 70%,
              #000000 100%
            )
          `,
        }}
      >
        <div className="max-w-6xl mx-auto text-center">
          <div className="float-animation mb-8 relative z-10">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-semibold mb-6 text-shadow leading-tight tracking-tight">
              From <span className="gradient-text">idea</span> to{" "}
              <span className="gradient-text">scale</span>.
            </h1>
            <h2 className="text-xl md:text-2xl lg:text-3xl text-white/90 mb-8 text-shadow font-medium leading-relaxed">
              Simplified.
            </h2>
          </div>

          <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed font-normal">
            Senior Full-Stack Engineer specializing in scalable web applications
            and system architecture.
          </p>

          <div className="flex flex-wrap justify-center gap-8 mb-12 text-white/60">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">5+</div>
              <div className="text-sm">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">50+</div>
              <div className="text-sm">Projects Delivered</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">99%</div>
              <div className="text-sm">Client Satisfaction</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <button className="bg-white text-slate-900 px-8 py-4 rounded-lg font-semibold hover:bg-white/90 transition-all glow-effect hover-scale magnetic-effect">
              View Projects
            </button>
            <button className="border border-white/20 text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/5 transition-all neon-border">
              Contact Me
            </button>
          </div>

          <div className="mt-16 card-blur rounded-2xl p-6 max-w-2xl mx-auto">
            <div className="text-sm text-white/60 mb-3">Latest Project</div>
            <div className="bg-slate-800/50 rounded-lg p-4 font-mono text-sm text-left">
              <div className="text-blue-400">const</div>{" "}
              <div className="text-white">portfolio</div>{" "}
              <div className="text-white">=</div>{" "}
              <div className="text-green-400">{`{`}</div>
              <br />
              <div className="pl-4">
                <div className="text-orange-400">tech</div>: [
                <span className="text-green-300">&quot;Next.js&quot;</span>,{" "}
                <span className="text-green-300">&quot;TypeScript&quot;</span>,{" "}
                <span className="text-green-300">&quot;Tailwind&quot;</span>
                ],
                <br />
                <div className="text-orange-400">status</div>:{" "}
                <span className="text-green-300">&quot;Building...&quot;</span>
              </div>
              <div className="text-green-400">{`}`}</div>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-black">
        <TechStackAnimation />
      </div>

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
                    <span className="text-white/60">2024</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-semibold mb-4 leading-tight tracking-tight">
                    E-Commerce Platform Redesign
                  </h3>
                  <p className="text-white/75 text-base md:text-lg mb-6 leading-relaxed font-normal">
                    Led complete redesign of e-commerce platform serving 10k+
                    daily users. Transformed legacy PHP system into modern
                    React/Node.js architecture.
                  </p>

                  <div className="grid grid-cols-3 gap-6 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">
                        40%
                      </div>
                      <div className="text-sm text-white/60">
                        Conversion Rate
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">
                        2.3s
                      </div>
                      <div className="text-sm text-white/60">Load Time</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">
                        $2.1M
                      </div>
                      <div className="text-sm text-white/60">
                        Revenue Impact
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm">
                      React
                    </span>
                    <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm">
                      Node.js
                    </span>
                    <span className="bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded-full text-sm">
                      PostgreSQL
                    </span>
                    <span className="bg-red-500/20 text-red-300 px-3 py-1 rounded-full text-sm">
                      Redis
                    </span>
                  </div>

                  <div className="flex gap-4">
                    <button className="bg-white text-slate-900 px-6 py-3 rounded-lg font-semibold hover:bg-white/90 transition-all">
                      View Case Study
                    </button>
                    <button className="border border-white/20 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/5 transition-all">
                      Live Demo
                    </button>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl h-80 flex items-center justify-center relative overflow-hidden holographic">
                  <div className="text-white/60 text-center z-10 relative">
                    <div className="text-6xl mb-4 animate-pulse">💻</div>
                    <div className="font-semibold">Project Preview</div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 animate-shimmer"></div>
                </div>
              </div>
            </div>

            <div className="card-blur rounded-3xl p-8 hover:glow-effect transition-all hover-scale relative overflow-hidden">
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
            </div>
          </div>
        </div>
      </section>

      <section
        id="experience"
        className="py-20 px-6 bg-black relative overflow-hidden"
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-semibold leading-tight mb-4">
              My Professional <span className="gradient-text">Journey</span>
            </h2>
            <p className="text-lg text-white/80 leading-relaxed max-w-2xl mx-auto">
              Building scalable solutions and leading development teams across
              different stages of my career.
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
                          2022 - Present
                        </span>
                      </div>

                      <h3 className="text-3xl font-semibold text-white">
                        Senior Full-Stack Engineer
                      </h3>
                      <p className="text-[#71E8DF] font-medium text-xl">
                        TechCorp Inc.
                      </p>

                      <div className="space-y-4 text-white/80 text-lg">
                        <p>
                          Led development of microservices architecture serving
                          100k+ daily users. Built scalable React applications
                          with modern state management.
                        </p>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <span className="text-[#71E8DF] mt-1">▸</span>
                            <span>
                              Improved application performance by 60% through
                              React optimization
                            </span>
                          </div>
                          <div className="flex items-start gap-3">
                            <span className="text-[#71E8DF] mt-1">▸</span>
                            <span>
                              Mentored 3 developers on React best practices and
                              architecture
                            </span>
                          </div>
                          <div className="flex items-start gap-3">
                            <span className="text-[#71E8DF] mt-1">▸</span>
                            <span>
                              Built reusable component library reducing
                              development time by 40%
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
                        StartupXYZ
                      </p>

                      <div className="space-y-4 text-white/80 text-lg">
                        <p>
                          Built MVP from scratch that secured $500k seed
                          funding. Designed scalable Node.js APIs and
                          implemented modern deployment practices.
                        </p>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <span className="text-[#71E8DF] mt-1">▸</span>
                            <span>
                              Developed RESTful APIs handling 10k+
                              requests/minute with Node.js
                            </span>
                          </div>
                          <div className="flex items-start gap-3">
                            <span className="text-[#71E8DF] mt-1">▸</span>
                            <span>
                              Implemented CI/CD pipeline reducing deployment
                              time by 80%
                            </span>
                          </div>
                          <div className="flex items-start gap-3">
                            <span className="text-[#71E8DF] mt-1">▸</span>
                            <span>
                              Built real-time features using WebSockets and
                              Redis
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
                          mvp-builder.js
                        </button>
                        <button className="prisma-tab">deployment.yml</button>
                      </div>
                      <div className="prisma-code-block">
                        <code className="text-white">
                          <div className="mb-2">
                            <span className="token keyword">const</span>
                            <span className="token plain"> buildMVP = </span>
                            <span className="token keyword">async</span>
                            <span className="token plain"> () </span>
                            <span className="token operator">=&gt;</span>
                            <span className="token plain"> </span>
                            <span className="token punctuation">{"{"}</span>
                          </div>
                          <div className="ml-4 mb-2">
                            <span className="token keyword">const</span>
                            <span className="token plain"> startup = </span>
                            <span className="token keyword">await</span>
                            <span className="token plain"> develop.</span>
                            <span className="token function">fromScratch</span>
                            <span className="token punctuation">(</span>
                            <span className="token punctuation">{"{"}</span>
                          </div>
                          <div className="ml-8 mb-2">
                            <span className="token plain">backend</span>
                            <span className="token operator">:</span>
                            <span className="token string">
                              {" "}
                              &quot;Node.js + Express&quot;
                            </span>
                            <span className="token punctuation">,</span>
                          </div>
                          <div className="ml-8 mb-2">
                            <span className="token plain">database</span>
                            <span className="token operator">:</span>
                            <span className="token string">
                              {" "}
                              &quot;PostgreSQL&quot;
                            </span>
                            <span className="token punctuation">,</span>
                          </div>
                          <div className="ml-8 mb-2">
                            <span className="token plain">cicd</span>
                            <span className="token operator">:</span>
                            <span className="token string">
                              {" "}
                              &quot;Docker + GitHub Actions&quot;
                            </span>
                          </div>
                          <div className="ml-4 mb-2">
                            <span className="token punctuation">{"}"}</span>
                            <span className="token punctuation">{")"}</span>
                          </div>
                          <div className="mb-4"></div>
                          <div className="ml-4 mb-2">
                            <span className="token comment">{`// Result: $500k seed funding 🚀`}</span>
                          </div>
                          <div className="ml-4 mb-2">
                            <span className="token keyword">return</span>
                            <span className="token plain"> </span>
                            <span className="token punctuation">{"{"}</span>
                            <span className="token plain"> deploymentTime</span>
                            <span className="token operator">:</span>
                            <span className="token string">
                              {" "}
                              &quot;-80%&quot;
                            </span>
                            <span className="token plain"> </span>
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
                        <span className="bg-[#68A063]/20 text-[#68A063] px-3 py-1 rounded-full text-sm font-medium">
                          Node.js
                        </span>
                        <span className="bg-red-500/20 text-red-300 px-3 py-1 rounded-full text-sm font-medium">
                          Vue.js
                        </span>
                        <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm font-medium">
                          PostgreSQL
                        </span>
                        <span className="bg-gray-500/20 text-gray-300 px-3 py-1 rounded-full text-sm font-medium">
                          Docker
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="prisma-timeline-item" data-animate="true">
                <div className="prisma-timeline-icon hover:scale-110 transition-all duration-300 group">
                  <span className="text-[#71E8DF] font-bold text-lg">2018</span>
                </div>
                <div className="timeline-cards">
                  <div className="prisma-content-card optimize group hover:scale-[1.02] transition-all duration-300">
                    <div className="space-y-6">
                      <div className="prisma-tabs">
                        <button className="prisma-tab active">
                          foundation.css
                        </button>
                        <button className="prisma-tab">responsive.html</button>
                      </div>
                      <div className="prisma-code-block">
                        <code className="text-white">
                          <div className="mb-2">
                            <span className="token comment">{`/* Building solid foundations */`}</span>
                          </div>
                          <div className="mb-2">
                            <span className="token selector">
                              .responsive-layout
                            </span>
                            <span className="token plain"> </span>
                            <span className="token punctuation">{"{"}</span>
                          </div>
                          <div className="ml-4 mb-2">
                            <span className="token property">display</span>
                            <span className="token operator">:</span>
                            <span className="token plain"> grid</span>
                            <span className="token punctuation">;</span>
                          </div>
                          <div className="ml-4 mb-2">
                            <span className="token property">
                              grid-template-columns
                            </span>
                            <span className="token operator">:</span>
                            <span className="token plain">
                              {" "}
                              repeat(auto-fit, minmax(300px, 1fr))
                            </span>
                            <span className="token punctuation">;</span>
                          </div>
                          <div className="ml-4 mb-2">
                            <span className="token property">gap</span>
                            <span className="token operator">:</span>
                            <span className="token plain"> 2rem</span>
                            <span className="token punctuation">;</span>
                          </div>
                          <div className="mb-2">
                            <span className="token punctuation">{"}"}</span>
                          </div>
                          <div className="mb-4"></div>
                          <div className="mb-2">
                            <span className="token comment">{`/* Result: 20+ successful projects ✨ */`}</span>
                          </div>
                          <div className="mb-2">
                            <span className="token selector">
                              @media (max-width: 768px)
                            </span>
                            <span className="token plain"> </span>
                            <span className="token punctuation">{"{"}</span>
                          </div>
                          <div className="ml-4 mb-2">
                            <span className="token selector">
                              .responsive-layout
                            </span>
                            <span className="token plain"> </span>
                            <span className="token punctuation">{"{"}</span>
                            <span className="token plain"> gap</span>
                            <span className="token operator">:</span>
                            <span className="token plain"> 1rem</span>
                            <span className="token punctuation">;</span>
                            <span className="token plain"> </span>
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
                        <span className="bg-[#E34F26]/20 text-[#E34F26] px-3 py-1 rounded-full text-sm font-medium">
                          HTML5
                        </span>
                        <span className="bg-[#1572B6]/20 text-[#1572B6] px-3 py-1 rounded-full text-sm font-medium">
                          CSS3
                        </span>
                        <span className="bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded-full text-sm font-medium">
                          JavaScript
                        </span>
                        <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm font-medium">
                          WordPress
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="prisma-job-card group hover:scale-[1.02] transition-all duration-300">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <span className="bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded-full text-sm font-semibold">
                          Foundation
                        </span>
                        <span className="text-[#71E8DF] font-semibold">
                          2018 - 2020
                        </span>
                      </div>

                      <h3 className="text-3xl font-semibold text-white">
                        Junior Developer
                      </h3>
                      <p className="text-[#71E8DF] font-medium text-xl">
                        WebDev Agency
                      </p>

                      <div className="space-y-4 text-white/80 text-lg">
                        <p>
                          Started my journey building responsive websites and
                          learning modern development practices in a fast-paced
                          agency environment.
                        </p>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <span className="text-[#71E8DF] mt-1">▸</span>
                            <span>
                              Delivered 20+ client websites using HTML5, CSS3,
                              and JavaScript
                            </span>
                          </div>
                          <div className="flex items-start gap-3">
                            <span className="text-[#71E8DF] mt-1">▸</span>
                            <span>
                              Learned responsive design and cross-browser
                              compatibility
                            </span>
                          </div>
                          <div className="flex items-start gap-3">
                            <span className="text-[#71E8DF] mt-1">▸</span>
                            <span>
                              Gained experience with WordPress and client
                              communication
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
                        <span className="bg-[#3178C6]/20 text-[#3178C6] px-3 py-1 rounded-full text-sm font-medium">
                          TypeScript
                        </span>
                        <span className="bg-[#61DAFB]/20 text-[#61DAFB] px-3 py-1 rounded-full text-sm font-medium">
                          React
                        </span>
                        <span className="bg-[#68A063]/20 text-[#68A063] px-3 py-1 rounded-full text-sm font-medium">
                          Node.js
                        </span>
                        <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm font-medium">
                          Next.js
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <TimelineAnimation />
      </section>

      <section id="about" className="py-20 px-6 bg-black">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold text-center mb-16 gradient-text leading-tight tracking-tight">
            About
          </h2>
          <div className="card-blur rounded-3xl p-8">
            <div className="grid md:grid-cols-3 gap-16">
              <div className="md:col-span-2">
                <h3 className="text-xl md:text-2xl font-semibold mb-6 tracking-tight">
                  My Approach
                </h3>
                <p className="text-white/80 text-base md:text-lg leading-relaxed mb-6 font-normal">
                  I believe in building software that not only works flawlessly
                  but drives real business value. My approach combines technical
                  excellence with deep understanding of user needs and business
                  objectives.
                </p>
                <p className="text-white/80 text-base md:text-lg leading-relaxed mb-8 font-normal">
                  I&apos;m passionate about mentoring teams, establishing
                  scalable architectures, and creating solutions that stand the
                  test of time. Every project is an opportunity to push
                  boundaries and deliver exceptional results.
                </p>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-white mb-2">
                      Frontend Excellence
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm">
                        React
                      </span>
                      <span className="bg-black/20 text-white px-3 py-1 rounded-full text-sm">
                        Next.js
                      </span>
                      <span className="bg-blue-600/20 text-blue-300 px-3 py-1 rounded-full text-sm">
                        TypeScript
                      </span>
                      <span className="bg-cyan-500/20 text-cyan-300 px-3 py-1 rounded-full text-sm">
                        Tailwind
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-white mb-2">
                      Backend & Infrastructure
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm">
                        Node.js
                      </span>
                      <span className="bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded-full text-sm">
                        Python
                      </span>
                      <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm">
                        PostgreSQL
                      </span>
                      <span className="bg-orange-500/20 text-orange-300 px-3 py-1 rounded-full text-sm">
                        AWS
                      </span>
                      <span className="bg-red-500/20 text-red-300 px-3 py-1 rounded-full text-sm">
                        Redis
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl h-64 mb-6 flex items-center justify-center">
                  <div className="text-white/40 text-center">
                    <div className="text-4xl mb-2">📸</div>
                    <div>Professional Photo</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                      Available for
                    </div>
                    <div className="text-green-400 font-semibold">
                      Senior Roles
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-white/60">
                    <div>📍 Remote • San Francisco</div>
                    <div>💼 Full-time • Contract</div>
                    <div>⏰ PST Timezone</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ErrorBoundary>
        <ScrollingGallery />
      </ErrorBoundary>

      <section id="contact" className="py-20 px-6 bg-black">
        <div className="max-w-4xl mx-auto">
          <div className="card-blur rounded-3xl p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none" />

            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
                Let&apos;s Build Something Amazing
              </h2>
              <p className="text-white/80 text-xl mb-4 max-w-3xl mx-auto font-light leading-relaxed">
                Ready to turn your ideas into reality? I&apos;m currently
                available for senior engineering roles and complex project
                collaborations.
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full mb-8" />

              <div className="mb-12 max-w-4xl mx-auto">
                <p className="text-blue-400 font-semibold mb-4 text-lg">
                  Specialized in Full-Stack Architecture
                </p>
                <div className="flex flex-wrap justify-center gap-3 mb-8">
                  <span className="bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full text-sm font-medium border border-blue-500/30 backdrop-blur-sm">
                    React & Next.js
                  </span>
                  <span className="bg-green-500/20 text-green-300 px-4 py-2 rounded-full text-sm font-medium border border-green-500/30 backdrop-blur-sm">
                    Node.js & Express
                  </span>
                  <span className="bg-purple-500/20 text-purple-300 px-4 py-2 rounded-full text-sm font-medium border border-purple-500/30 backdrop-blur-sm">
                    PostgreSQL & Redis
                  </span>
                  <span className="bg-orange-500/20 text-orange-300 px-4 py-2 rounded-full text-sm font-medium border border-orange-500/30 backdrop-blur-sm">
                    AWS & Docker
                  </span>
                  <span className="bg-pink-500/20 text-pink-300 px-4 py-2 rounded-full text-sm font-medium border border-pink-500/30 backdrop-blur-sm">
                    TypeScript
                  </span>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-12">
                <div className="group bg-gradient-to-br from-gray-800/60 to-gray-900/80 border border-gray-700/30 rounded-xl p-6 hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 backdrop-blur-sm">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    📧
                  </div>
                  <div className="font-bold text-white mb-2 text-lg">Email</div>
                  <div className="text-blue-400 font-medium">
                    syakir@example.com
                  </div>
                  <div className="mt-3 text-xs text-white/50">
                    Available 24/7
                  </div>
                </div>
                <div className="group bg-gradient-to-br from-gray-800/60 to-gray-900/80 border border-gray-700/30 rounded-xl p-6 hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10 backdrop-blur-sm">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    💼
                  </div>
                  <div className="font-bold text-white mb-2 text-lg">
                    LinkedIn
                  </div>
                  <div className="text-purple-400 font-medium">
                    linkedin.com/in/syakir
                  </div>
                  <div className="mt-3 text-xs text-white/50">
                    Professional Network
                  </div>
                </div>
                <div className="group bg-gradient-to-br from-gray-800/60 to-gray-900/80 border border-gray-700/30 rounded-xl p-6 hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/10 backdrop-blur-sm">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    💻
                  </div>
                  <div className="font-bold text-white mb-2 text-lg">
                    GitHub
                  </div>
                  <div className="text-green-400 font-medium">
                    github.com/syakir
                  </div>
                  <div className="mt-3 text-xs text-white/50">
                    Open Source Portfolio
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <button className="group relative bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-bold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-blue-500/25 hover:scale-105">
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    📧 Get In Touch
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                </button>
                <button className="group relative bg-gray-800/50 border border-gray-600/50 text-white px-8 py-4 rounded-xl font-bold hover:bg-gray-700/50 hover:border-gray-500/50 transition-all duration-300 hover:scale-105">
                  <span className="flex items-center justify-center gap-2">
                    📄 Download Resume
                  </span>
                </button>
              </div>

              <div className="inline-flex items-center gap-3 p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                  <span className="text-green-400 font-bold text-lg">
                    Available for new opportunities
                  </span>
                </div>
                <div className="text-white/50 text-sm border-l border-green-500/30 pl-3">
                  Senior Full-Stack Developer
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
