import Navigation from "./components/Navigation";
import FloatingParticles from "./components/FloatingParticles";
import TechStackAnimation from "./components/TechStackAnimation";

export default function Home() {
  return (
    <div className="min-h-screen relative">
      <FloatingParticles />
      <Navigation />

      <section
        className="min-h-screen flex items-center justify-center px-6 relative"
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
              <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
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
              <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
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

      <section id="experience" className="py-20 px-6 bg-black">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold text-center mb-16 gradient-text leading-tight tracking-tight">
            Experience
          </h2>

          <div className="space-y-12">
            <div className="card-blur rounded-2xl p-8 relative">
              <div className="flex flex-col md:flex-row md:items-center gap-6 mb-6">
                <div className="flex-1">
                  <h3 className="text-xl md:text-2xl font-semibold mb-2 tracking-tight">
                    Senior Full-Stack Engineer
                  </h3>
                  <div className="text-blue-400 font-medium mb-2 text-sm md:text-base">
                    TechCorp Inc.
                  </div>
                  <div className="text-white/60 text-sm">
                    2022 - Present • Remote
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-white/60 mb-2">Tech Stack</div>
                  <div className="flex flex-wrap gap-2 justify-end">
                    <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs">
                      React
                    </span>
                    <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded text-xs">
                      Node.js
                    </span>
                    <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded text-xs">
                      AWS
                    </span>
                  </div>
                </div>
              </div>

              <ul className="space-y-3 text-white/80 mb-6">
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">▸</span>
                  Led development of microservices architecture serving 100k+
                  daily users
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">▸</span>
                  Improved application performance by 60% through code
                  optimization and caching strategies
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">▸</span>
                  Mentored 3 junior developers, establishing code review
                  processes and best practices
                </li>
              </ul>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-white/10">
                <div className="text-center">
                  <div className="text-xl font-bold text-green-400">60%</div>
                  <div className="text-xs text-white/60">Performance Gain</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-blue-400">100k+</div>
                  <div className="text-xs text-white/60">Daily Users</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-purple-400">15+</div>
                  <div className="text-xs text-white/60">
                    Projects Delivered
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-yellow-400">3</div>
                  <div className="text-xs text-white/60">
                    Developers Mentored
                  </div>
                </div>
              </div>
            </div>

            <div className="card-blur rounded-2xl p-8 opacity-80">
              <div className="flex flex-col md:flex-row md:items-center gap-6 mb-6">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2">
                    Full-Stack Developer
                  </h3>
                  <div className="text-blue-400 font-semibold mb-2">
                    StartupXYZ
                  </div>
                  <div className="text-white/60">
                    2020 - 2022 • San Francisco
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-white/60 mb-2">Tech Stack</div>
                  <div className="flex flex-wrap gap-2 justify-end">
                    <span className="bg-red-500/20 text-red-300 px-2 py-1 rounded text-xs">
                      Vue.js
                    </span>
                    <span className="bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded text-xs">
                      Python
                    </span>
                    <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs">
                      PostgreSQL
                    </span>
                  </div>
                </div>
              </div>

              <ul className="space-y-3 text-white/80">
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">▸</span>
                  Built MVP from scratch, leading to $500k seed funding
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">▸</span>
                  Implemented CI/CD pipeline reducing deployment time by 80%
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">▸</span>
                  Designed and developed RESTful APIs handling 10k+
                  requests/minute
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="py-20 px-6 bg-black">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold text-center mb-16 gradient-text leading-tight tracking-tight">
            About
          </h2>
          <div className="card-blur rounded-3xl p-8">
            <div className="grid md:grid-cols-3 gap-12">
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

      <section className="py-20 px-6 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold text-center mb-4 gradient-text leading-tight tracking-tight">
            Client Testimonials
          </h2>
          <p className="text-center text-white/70 mb-16 max-w-2xl mx-auto text-lg leading-relaxed">
            What colleagues and clients say about working with me
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card-blur rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                  JS
                </div>
                <div>
                  <div className="font-semibold">John Smith</div>
                  <div className="text-sm text-white/60">CTO, TechCorp</div>
                </div>
              </div>
              <p className="text-white/80 italic mb-4">
                &quot;Syakir delivered exceptional results on our platform
                redesign. His technical expertise and attention to detail helped
                us achieve a 40% increase in conversion rates.&quot;
              </p>
              <div className="flex text-yellow-400">⭐⭐⭐⭐⭐</div>
            </div>

            <div className="card-blur rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                  MJ
                </div>
                <div>
                  <div className="font-semibold">Maria Johnson</div>
                  <div className="text-sm text-white/60">
                    Product Manager, StartupXYZ
                  </div>
                </div>
              </div>
              <p className="text-white/80 italic mb-4">
                &quot;Working with Syakir was a game-changer. He transformed our
                MVP into a production-ready platform that helped secure our
                Series A funding.&quot;
              </p>
              <div className="flex text-yellow-400">⭐⭐⭐⭐⭐</div>
            </div>

            <div className="card-blur rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                  DL
                </div>
                <div>
                  <div className="font-semibold">David Lee</div>
                  <div className="text-sm text-white/60">Senior Developer</div>
                </div>
              </div>
              <p className="text-white/80 italic mb-4">
                &quot;Syakir is an exceptional mentor and team lead. His code
                reviews and architectural decisions have significantly improved
                our development process.&quot;
              </p>
              <div className="flex text-yellow-400">⭐⭐⭐⭐⭐</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-black">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-12 gradient-text">
            Trusted by Leading Companies
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center opacity-60">
            {[
              "TechCorp",
              "StartupXYZ",
              "InnovateCo",
              "BuildFast",
              "ScaleUp",
              "DevCorp",
            ].map((company) => (
              <div
                key={company}
                className="card-blur rounded-xl p-4 text-white/60 font-semibold"
              >
                {company}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="py-20 px-6 bg-black">
        <div className="max-w-4xl mx-auto">
          <div className="card-blur rounded-3xl p-12 text-center">
            <h2 className="text-4xl font-bold mb-6 gradient-text">
              Let&apos;s Build Something Amazing
            </h2>
            <p className="text-white/70 text-xl mb-8 max-w-2xl mx-auto">
              Ready to turn your ideas into reality? I&apos;m currently
              available for senior engineering roles and complex project
              collaborations.
            </p>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="text-3xl mb-3">📧</div>
                <div className="font-semibold text-white mb-2">Email</div>
                <div className="text-white/60">syakir@example.com</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-3">💼</div>
                <div className="font-semibold text-white mb-2">LinkedIn</div>
                <div className="text-white/60">linkedin.com/in/syakir</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-3">💻</div>
                <div className="font-semibold text-white mb-2">GitHub</div>
                <div className="text-white/60">github.com/syakir</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-slate-900 px-8 py-4 rounded-lg font-semibold hover:bg-white/90 transition-all glow-effect">
                📧 Get In Touch
              </button>
              <button className="border border-white/20 text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/5 transition-all">
                📄 Download Resume
              </button>
            </div>

            <div className="mt-8 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="flex items-center justify-center gap-2 text-green-400 font-semibold">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                Available for new opportunities
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
