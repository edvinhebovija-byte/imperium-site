import { motion } from "framer-motion";
import React, { useMemo } from "react";

const SHIMMER_STYLE = `
  @keyframes serviceShimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }

  @keyframes ambientDrift {
    0% { transform: translate3d(-2%, -1%, 0) scale(1); opacity: 0.42; }
    50% { transform: translate3d(2%, 1%, 0) scale(1.04); opacity: 0.55; }
    100% { transform: translate3d(-2%, -1%, 0) scale(1); opacity: 0.42; }
  }

  @keyframes ambientPulse {
    0% { opacity: 0.18; transform: scale(1); }
    50% { opacity: 0.28; transform: scale(1.06); }
    100% { opacity: 0.18; transform: scale(1); }
  }

  @keyframes methodLetterPulse {
    0%, 8%, 100% {
      color: rgba(241,214,122,0.82);
      text-shadow: 0 0 0 rgba(255,255,255,0);
    }
    35% {
      color: #fbf3dc;
      text-shadow: 0 0 10px rgba(255,255,245,0.55), 0 0 20px rgba(241,214,122,0.3);
    }
    70% {
      color: #f7e7aa;
      text-shadow: 0 0 6px rgba(255,255,255,0.2);
    }
  }

  .site-shell {
    position: relative;
  }

  .site-shell * {
    cursor: default;
  }

  .site-shell a,
  .site-shell button,
  .site-shell .cursor-pointer {
    cursor: pointer;
  }

  .shimmer-text {
    position: relative;
    color: #f1d67a;
  }

  .shimmer-text::after {
    content: attr(data-text);
    position: absolute;
    inset: 0;
    color: transparent;
    background-image: linear-gradient(
      90deg,
      transparent 0%,
      transparent 47%,
      rgba(255,255,255,0.98) 50%,
      transparent 53%,
      transparent 100%
    );
    background-size: 200% 100%;
    background-position: -200% 0;
    -webkit-background-clip: text;
    background-clip: text;
    pointer-events: none;
    animation: serviceShimmer 4.5s linear infinite;
  }
`;

const METHODS = ["I", "II", "III", "IV"];

function setInteractiveVars(el, clientX, clientY) {
  const rect = el.getBoundingClientRect();
  const x = clientX - rect.left;
  const y = clientY - rect.top;
  const rx = ((y / rect.height) - 0.5) * -8;
  const ry = ((x / rect.width) - 0.5) * 10;

  el.style.setProperty("--mx", `${x}px`);
  el.style.setProperty("--my", `${y}px`);
  el.style.setProperty("--rx", `${rx}deg`);
  el.style.setProperty("--ry", `${ry}deg`);
}

function resetInteractiveVars(el) {
  el.style.setProperty("--mx", "50%");
  el.style.setProperty("--my", "50%");
  el.style.setProperty("--rx", "0deg");
  el.style.setProperty("--ry", "0deg");
}

function InteractiveCard({ children, className = "", glow = "rgba(241,214,122,0.18)", glowMode = "local", onMouseEnter }) {
  return (
    <div
      className={`group relative isolate overflow-visible bg-transparent transition duration-[1100ms] ease-out [transform:perspective(1200px)_rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))] will-change-transform ${className}`}
      style={{ "--mx": "50%", "--my": "50%", "--rx": "0deg", "--ry": "0deg" }}
      onMouseEnter={onMouseEnter}
      onMouseMove={(e) => setInteractiveVars(e.currentTarget, e.clientX, e.clientY)}
      onMouseLeave={(e) => resetInteractiveVars(e.currentTarget)}
    >
      {glowMode === "local" && (
        <>
          <div className="pointer-events-none absolute -inset-10 opacity-0 transition duration-[1100ms] ease-out group-hover:opacity-100">
            <div className="h-full w-full rounded-[999px] bg-[radial-gradient(circle_at_center,rgba(241,214,122,0.12)_0%,rgba(241,214,122,0.08)_16%,rgba(241,214,122,0.05)_30%,rgba(241,214,122,0.028)_42%,rgba(241,214,122,0.014)_54%,rgba(241,214,122,0.006)_66%,rgba(241,214,122,0.002)_76%,transparent_88%)] blur-[46px]" />
          </div>

          <div className="pointer-events-none absolute -inset-20 opacity-0 transition duration-[1100ms] ease-out group-hover:opacity-100">
            <div className="h-full w-full rounded-[999px] bg-[radial-gradient(circle_at_center,rgba(241,214,122,0.09)_0%,rgba(241,214,122,0.055)_20%,rgba(241,214,122,0.028)_38%,rgba(241,214,122,0.012)_54%,rgba(241,214,122,0.005)_68%,transparent_86%)] blur-[95px]" />
          </div>

          <div className="pointer-events-none absolute -inset-32 opacity-0 transition duration-[1100ms] ease-out group-hover:opacity-100">
            <div className="h-full w-full rounded-[999px] bg-[radial-gradient(circle_at_center,rgba(241,214,122,0.06)_0%,rgba(241,214,122,0.032)_24%,rgba(241,214,122,0.014)_46%,rgba(241,214,122,0.006)_62%,transparent_84%)] blur-[160px]" />
          </div>

          <div
            className="pointer-events-none absolute inset-[-18%] opacity-0 transition duration-[1100ms] ease-out group-hover:opacity-100"
            style={{
              background: `radial-gradient(720px circle at var(--mx) var(--my), ${glow} 0%, rgba(241,214,122,0.07) 18%, rgba(241,214,122,0.035) 34%, rgba(241,214,122,0.015) 50%, rgba(241,214,122,0.006) 64%, transparent 86%)`,
              filter: "blur(42px)",
            }}
          />

          <div
            className="pointer-events-none absolute inset-[-34%] opacity-0 transition duration-[1100ms] ease-out group-hover:opacity-100"
            style={{
              background: `radial-gradient(980px circle at var(--mx) var(--my), rgba(241,214,122,0.045) 0%, rgba(241,214,122,0.02) 22%, rgba(241,214,122,0.008) 42%, transparent 78%)`,
              filter: "blur(90px)",
            }}
          />
        </>
      )}

      <div className="relative z-10 bg-transparent">
        {children}
      </div>
    </div>
  );
}

function ServiceTitle({ title, startIndex, stepDuration = 0.08, cycleDuration = 10 }) {
  const chars = Array.from(title);

  return (
    <h3 className="cursor-pointer text-[26px] font-semibold tracking-[0.04em] text-center text-[#f1d67a] font-['Cormorant_Garamond'] leading-[1.2] transition duration-300 group-hover:brightness-110">
      {chars.map((char, charIndex) => {
        const isSpace = char === " ";
        const delay = (startIndex + charIndex) * stepDuration;

        return (
          <span
            key={`${title}-${charIndex}`}
            className="inline-block"
            style={
              isSpace
                ? { width: "0.34em" }
                : {
                    animation: `methodLetterPulse ${cycleDuration}s linear infinite`,
                    animationDelay: `${delay}s`,
                  }
            }
          >
            {isSpace ? " " : char}
          </span>
        );
      })}
    </h3>
  );
}

function ServiceCard({ service, index, startIndex }) {
  const ensureCardVisible = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const topPadding = 110;
    const bottomPadding = 36;

    if (rect.bottom > window.innerHeight - bottomPadding) {
      const delta = rect.bottom - (window.innerHeight - bottomPadding);
      window.scrollBy({ top: delta, behavior: "smooth" });
    } else if (rect.top < topPadding) {
      const delta = rect.top - topPadding;
      window.scrollBy({ top: delta, behavior: "smooth" });
    }
  };
  const content = (
    <InteractiveCard
      onMouseEnter={ensureCardVisible}
      className={`cursor-pointer select-none rounded-[1.5rem] bg-transparent p-4 hover:-translate-y-[8px]`}
    >
      <div className="relative z-10 max-w-full flex flex-col gap-2 pb-2 transition-transform duration-[900ms] ease-out group-hover:scale-[1.035] cursor-pointer select-none">
        <div className="inline-block w-full text-center">
          <ServiceTitle title={service.title} startIndex={startIndex} />
          <div className="mt-2 h-px w-full origin-left scale-x-0 bg-gradient-to-r from-[#f1d67a]/70 to-transparent transition-transform duration-[850ms] ease-out group-hover:scale-x-100" />
        </div>

        <p className="cursor-pointer mt-3 text-center text-lg leading-8 text-white/80 overflow-hidden opacity-0 max-h-0 transition-all duration-[950ms] ease-out group-hover:opacity-100 group-hover:max-h-[220px]">
          {service.description}
        </p>

        <div className="cursor-pointer mt-3 inline-flex w-full items-center justify-center gap-3 text-center text-[13px] italic uppercase tracking-[0.2em] text-[#f1d67a]/78">
          <span className="h-[8px] w-[8px] rounded-full bg-[#f1d67a]/90" />
          {service.result}
        </div>

        <div className="cursor-pointer mt-3 w-full flex justify-end pr-1 text-white text-sm leading-none tracking-wide opacity-20 group-hover:opacity-100 transition duration-[850ms] ease-out">
          <span className="inline-block transition-transform duration-[850ms] ease-out group-hover:translate-x-[3px]">
            → Read more
          </span>
        </div>
      </div>
    </InteractiveCard>
  );

  return (
    <motion.div
      className="h-full -m-2 p-2"
      initial={{ opacity: 0, y: 22, scale: 0.985 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.65, delay: index * 0.06, ease: "easeOut" }}
    >
      {service.href ? (
        <a href={service.href} className="block h-full">
          {content}
        </a>
      ) : (
        content
      )}
    </motion.div>
  );
}

function MethodTitle({ title, startIndex, stepDuration = 0.09, cycleDuration = 8 }) {
  const chars = Array.from(title);

  return (
    <h3 className="text-center text-2xl font-semibold tracking-tight text-[#f1d67a] transition duration-300 group-hover:brightness-110">
      {chars.map((char, charIndex) => {
        const isSpace = char === " ";
        const delay = (startIndex + charIndex) * stepDuration;

        return (
          <span
            key={`${title}-${charIndex}`}
            className="inline-block"
            style={
              isSpace
                ? { width: "0.34em" }
                : {
                    animation: `methodLetterPulse ${cycleDuration}s linear infinite`,
                    animationDelay: `${delay}s`,
                  }
            }
          >
            {isSpace ? " " : char}
          </span>
        );
      })}
    </h3>
  );
}

function MethodCard({ step, index, startIndex }) {
  return (
    <InteractiveCard className="cursor-pointer rounded-[1.75rem] p-6 hover:-translate-y-[10px] hover:shadow-[0_42px_140px_rgba(0,0,0,0.72)]" glow="rgba(241,214,122,0.14)">
      <div className="relative z-10 transition-transform duration-300 group-hover:scale-[1.055]">
        <div className="inline-block w-full text-center">
          <div className="flex flex-col items-center gap-1">
            <span className="flex h-12 w-12 items-center justify-center rounded-full border-[2.5px] border-[#f1d67a]/90 font-['Cormorant_Garamond'] text-[20px] font-extrabold tracking-[0.06em] text-[#ffe8a3] shadow-[inset_0_2px_8px_rgba(0,0,0,0.65),0_6px_18px_rgba(241,214,122,0.22)]">
              {METHODS[index]}
            </span>
            <MethodTitle title={step.title} startIndex={startIndex} />
          </div>
          <div className="mt-3 h-px w-full origin-left scale-x-0 bg-gradient-to-r from-[#f1d67a]/70 to-transparent transition-transform duration-[850ms] ease-out group-hover:scale-x-100" />
        </div>

        <p className="max-w-xs text-center text-lg leading-8 text-white/40">{step.description}</p>
      </div>
    </InteractiveCard>
  );
}

function HeaderLogo() {
  return (
    <div className="relative flex h-12 w-12 items-center justify-center">
      <svg viewBox="0 0 120 120" className="h-full w-full">
        <circle cx="60" cy="60" r="19" fill="#f1d67a" />
        <g stroke="#f1d67a" strokeWidth="2" strokeLinecap="round">
          <line x1="60" y1="10" x2="60" y2="36" />
          <line x1="60" y1="84" x2="60" y2="110" />
          <line x1="10" y1="60" x2="36" y2="60" />
          <line x1="84" y1="60" x2="110" y2="60" />
          <line x1="22" y1="22" x2="40" y2="40" />
          <line x1="80" y1="80" x2="98" y2="98" />
          <line x1="98" y1="22" x2="80" y2="40" />
          <line x1="40" y1="80" x2="22" y2="98" />
        </g>
        <text x="60" y="68" textAnchor="middle" fontSize="20" fontWeight="900" fontFamily="serif" fill="#000" letterSpacing="2">
          IR
        </text>
        <g fill="none" stroke="#f1d67a" strokeWidth="2" strokeLinejoin="round">
          <path d="M38 42 C30 40,26 46,28 52 C32 50,34 48,38 46" />
          <path d="M82 42 C90 40,94 46,92 52 C88 50,86 48,82 46" />
          <path d="M60 58 C34 50,20 64,26 82 C42 74,52 70,60 66" />
          <path d="M60 58 C86 50,100 64,94 82 C78 74,68 70,60 66" />
          <path d="M60 58 L60 84" />
          <path d="M54 84 L60 94 L66 84" />
        </g>
      </svg>
    </div>
  );
}

export default function ImperiumRevenueWebsite() {
  const services = useMemo(
    () => [
      {
        title: "Marketing Assets",
        description:
          "Websites, campaigns, and social media assets aligned with acquisition, authority, and conversion.",
        result: "Sharper brand authority",
        href: "#",
      },
      {
        title: "Sales Strategy",
        description:
          "CRM setup, KPI tracking, and process optimisation that turn effort into a measurable growth system.",
        result: "Clear commercial visibility",
      },
      {
        title: "Lead Generation",
        description:
          "Cold calling, paid ads, and social funnels designed to create a steady flow of qualified opportunities.",
        result: "More qualified leads",
      },
      {
        title: "Staff Training",
        description:
          "Appointment setter coaching and sales team development to improve performance across the pipeline.",
        result: "Stronger team output",
      },
      {
        title: "Sales Closing",
        description:
          "Sharper scripts, stronger sales structure, and trained closers built to lift conversion and consistency.",
        result: "Higher close rates",
      },
      {
        title: "Full Management",
        description:
          "Automation, dashboards, and reporting that create visibility, control, and operational clarity.",
        result: "End-to-end oversight",
      },
    ],
    []
  );

  const processSteps = useMemo(
    () => [
      {
        title: "Discovery",
        description:
          "Deep analysis of your current position, opportunities, and constraints to define a clear direction.",
      },
      {
        title: "Architecture",
        description:
          "Designing the full revenue system including funnels, messaging, processes, and infrastructure.",
      },
      {
        title: "Deployment",
        description:
          "Executing and implementing the systems, assets, and workflows into your business environment.",
      },
      {
        title: "Optimization",
        description:
          "Refining performance through data, testing, training, and continuous improvement.",
      },
    ],
    []
  );

  const serviceTitleStartIndexes = useMemo(() => {
    let running = 0;
    return services.map((service) => {
      const start = running;
      running += service.title.length + 3;
      return start;
    });
  }, [services]);

  const methodTitleStartIndexes = useMemo(() => {
    let running = 0;
    return processSteps.map((step) => {
      const start = running;
      running += step.title.length + 2;
      return start;
    });
  }, [processSteps]);

  const scrollToServices = () => {
    window.scrollTo({ top: 848, behavior: "smooth" });
  };

  const scrollToMethods = () => {
    const el = document.getElementById("methods-heading");
    const header = document.querySelector("header");
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const sectionTop = rect.top + window.scrollY;
    const headerHeight = header instanceof HTMLElement ? header.offsetHeight : 0;
    const targetY = sectionTop - headerHeight - 40;
    window.scrollTo({ top: Math.max(0, targetY), behavior: "smooth" });
  };

  return (
    <div className="site-shell min-h-screen overflow-x-hidden bg-[#070707] text-white selection:bg-[#d4af37]/25 selection:text-white">
      <style>{SHIMMER_STYLE}</style>

      <div
        className="pointer-events-none fixed inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"180\" height=\"180\" viewBox=\"0 0 180 180\"><filter id=\"n\"><feTurbulence type=\"fractalNoise\" baseFrequency=\"0.85\" numOctaves=\"2\" stitchTiles=\"stitch\"/></filter><rect width=\"180\" height=\"180\" filter=\"url(%23n)\" opacity=\"1\"/></svg>')",
        }}
      />

      <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_top,rgba(241,214,122,0.18),transparent_58%)]" />

      <header className="sticky top-0 z-30 border-b border-[#f1d67a]/10 bg-black/45 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
          <div className="flex items-center justify-center gap-3">
            <HeaderLogo />
            <div>
              <div className="text-[13px] md:text-[15px] uppercase tracking-[0.38em] font-semibold bg-gradient-to-r from-[#fff0b8] via-[#f1d67a] to-[#e0b94a] bg-clip-text text-transparent drop-shadow-[0_4px_18px_rgba(241,214,122,0.35)]">
                Imperium Revenue
              </div>
            </div>
          </div>

          <nav className="hidden items-center gap-8 text-sm text-white/40 md:flex">
            <button type="button" onClick={scrollToServices} className="transition hover:text-[#f1d67a]">
              Services
            </button>
            <button type="button" onClick={scrollToMethods} className="transition hover:text-[#f1d67a]">
              Methods
            </button>
            <a href="#contact" className="transition hover:text-[#f1d67a]">
              Contact
            </a>
          </nav>
        </div>
      </header>

      <main className="relative bg-[linear-gradient(to_bottom,#070707_0%,#070707_40%,#060606_60%,#050505_100%)]">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute inset-[-10%] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04),transparent_58%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.02),rgba(0,0,0,0.28))]" />
          <div className="absolute inset-[-12%] bg-[radial-gradient(circle_at_20%_18%,rgba(241,214,122,0.10),transparent_32%),radial-gradient(circle_at_78%_38%,rgba(241,214,122,0.07),transparent_30%),radial-gradient(circle_at_52%_78%,rgba(241,214,122,0.06),transparent_34%)] [animation:ambientDrift_18s_ease-in-out_infinite]" />
          <div className="absolute inset-[-8%] bg-[radial-gradient(circle_at_18%_24%,rgba(241,214,122,0.10),transparent_22%),radial-gradient(circle_at_82%_62%,rgba(241,214,122,0.08),transparent_24%)] [animation:ambientPulse_12s_ease-in-out_infinite]" />
          <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(241,214,122,0.04),transparent_30%,transparent_70%,rgba(241,214,122,0.03))]" />
        </div>

        <section className="mx-auto max-w-7xl px-6 pb-20 pt-20 lg:px-10 lg:pb-24 lg:pt-24">
          <div className="max-w-4xl">
            <h1 className="text-5xl font-semibold leading-[1.18] tracking-[-0.03em] text-white drop-shadow-[0_18px_60px_rgba(0,0,0,0.75)] overflow-visible pb-[0.14em] md:text-6xl lg:text-[5.4rem]">
              Revenue systems built
              <span className="block bg-gradient-to-r from-[#fff0b8] via-[#f1d67a] to-[#e0b94a] bg-clip-text py-1 pb-[0.18em] text-transparent leading-[1.16]">
                for control, clarity, and growth.
              </span>
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-8 text-white/74 md:text-[1.32rem]">
              Imperium Revenue designs, installs, and manages the systems behind lead flow, conversion, team performance, and reporting.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="#contact"
                className="rounded-full bg-[#f1d67a] px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.18em] text-black shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_18px_36px_rgba(241,214,122,0.14)] transition duration-300 hover:scale-[1.03] hover:bg-[#f6de8f] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.55),0_0_40px_rgba(241,214,122,0.28)]"
              >
                Book a Strategy Call
              </a>
              <button
                type="button"
                onClick={scrollToServices}
                className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/[0.04] px-8 py-4 text-sm font-medium uppercase tracking-[0.16em] text-white/82 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition duration-300 hover:border-[#f1d67a]/45 hover:bg-white/[0.14] hover:text-[#f1d67a] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_18px_42px_rgba(0,0,0,0.28)] active:scale-[0.98]"
              >
                View Services
              </button>
            </div>
          </div>
        </section>

        <section id="services" className="relative mx-auto max-w-7xl scroll-mt-36 px-6 py-14 lg:px-10">
          <div className="mb-6 max-w-2xl">
            <div className="text-[11px] uppercase tracking-[0.28em] text-[#f6de8f]">Services</div>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] md:text-4xl">Built to drive revenue end-to-end.</h2>
            <div className="mt-4 h-px w-20 bg-gradient-to-r from-[#f1d67a]/60 to-transparent" />
            <p className="mt-4 text-lg leading-7 text-white">
              <span className="inline-block bg-gradient-to-r from-[#fff0b8] via-[#f1d67a] to-[#e0b94a] bg-clip-text text-transparent">
                Each service connects into a single system designed to generate, convert, and scale.
              </span>
            </p>
          </div>

          <div className="relative grid gap-0 md:grid-cols-3">
            {services.map((service, index) => (
              <ServiceCard
                key={service.title}
                service={service}
                index={index}
                startIndex={serviceTitleStartIndexes[index]}
              />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{ duration: 0.55 }}
            className="mt-12 flex justify-center"
          >
            <a
              href="#contact"
              className="rounded-full bg-[#f1d67a] px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.18em] text-black shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_18px_36px_rgba(241,214,122,0.14)] transition duration-300 hover:scale-[1.03] hover:bg-[#f6de8f] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.55),0_0_40px_rgba(241,214,122,0.28)]"
            >
              Book a Strategy Call
            </a>
          </motion.div>
        </section>

        <section id="process" className="relative">
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
            <div className="mb-10 max-w-2xl">
              <div className="text-[11px] uppercase tracking-[0.28em] text-[#f1d67a]">Methods</div>
              <h2 id="methods-heading" className="mt-4 text-4xl font-semibold tracking-[-0.03em] md:text-5xl">
                The Imperium Method
              </h2>
              <div className="mt-6 h-px w-20 bg-gradient-to-r from-[#f1d67a]/60 to-transparent" />
              <p className="mt-6 text-lg leading-8 text-white">
                <span className="inline-block bg-gradient-to-r from-[#fff0b8] via-[#f1d67a] to-[#e0b94a] bg-clip-text text-transparent">
                  A clean, structured approach designed to remove chaos, install control, and drive consistent growth.
                </span>
              </p>
            </div>

            <div className="relative grid gap-12 md:grid-cols-4">
              {processSteps.map((step, index) => (
                <MethodCard key={step.title} step={step} index={index} startIndex={methodTitleStartIndexes[index]} />
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="scroll-mt-28 px-6 pb-20 lg:px-10 relative">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute left-[-10%] bottom-[-20%] h-[720px] w-[900px] bg-[radial-gradient(circle_at_bottom_left,rgba(241,214,122,0.22),transparent_60%)] blur-[40px]" />
          </div>
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-12 px-2 py-6 md:px-4 lg:grid-cols-[1fr_0.95fr] lg:items-start lg:px-6 lg:py-6">
              <div className="relative rounded-[1.75rem] p-6">
                <div className="relative z-10">
                  <div className="text-[11px] uppercase tracking-[0.28em] text-[#f1d67a]">Contact</div>
                  <h2 className="mt-4 text-4xl font-semibold tracking-[-0.03em] text-white md:text-5xl">Turn growth into a system.</h2>
                  <div className="mt-6 h-px w-20 bg-gradient-to-r from-[#f1d67a]/60 to-transparent" />

                  <div className="mt-6">
                    <p className="text-center text-lg leading-8 bg-gradient-to-r from-[#fff0b8] via-[#f1d67a] to-[#e0b94a] bg-clip-text text-transparent">
                      Build the structure, assets, and operational clarity needed to generate more opportunities and convert them with confidence.
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative p-2">
                <div className="relative z-10 space-y-5">
                  <input type="text" placeholder="Your name" className="w-full rounded-2xl border border-white/12 bg-white/[0.02] px-5 py-4 text-white shadow-[0_18px_50px_rgba(0,0,0,0.28)] backdrop-blur-md outline-none transition placeholder:text-white/45 focus:border-[#f1d67a]/55 focus:bg-white/[0.04]" />
                  <input type="text" placeholder="Your business name" className="w-full rounded-2xl border border-white/12 bg-white/[0.02] px-5 py-4 text-white shadow-[0_18px_50px_rgba(0,0,0,0.28)] backdrop-blur-md outline-none transition placeholder:text-white/45 focus:border-[#f1d67a]/55 focus:bg-white/[0.04]" />
                  <input type="email" placeholder="Email" className="w-full rounded-2xl border border-white/12 bg-white/[0.02] px-5 py-4 text-white shadow-[0_18px_50px_rgba(0,0,0,0.28)] backdrop-blur-md outline-none transition placeholder:text-white/45 focus:border-[#f1d67a]/55 focus:bg-white/[0.04]" />
                  <textarea rows={4} placeholder="Tell us about your goals" className="w-full rounded-2xl border border-white/12 bg-white/[0.02] px-5 py-4 text-white shadow-[0_18px_50px_rgba(0,0,0,0.28)] backdrop-blur-md outline-none transition placeholder:text-white/45 focus:border-[#f1d67a]/55 focus:bg-white/[0.04]" />
                  <button className="w-full rounded-2xl bg-[#f1d67a] px-5 py-3.5 text-sm font-semibold uppercase tracking-[0.16em] text-black shadow-[0_18px_40px_rgba(241,214,122,0.16)] transition duration-300 hover:opacity-100 hover:shadow-[0_0_40px_rgba(241,214,122,0.26)]">
                    Request Consultation
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
