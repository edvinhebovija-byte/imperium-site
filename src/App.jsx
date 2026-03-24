import { motion } from "framer-motion";
import React, { useEffect, useMemo, useRef, useState } from "react";

const CONTACT_FORM_ENDPOINT = "https://formspree.io/f/xaqprbaz";

const SHIMMER_STYLE = `
  input:-webkit-autofill,
  textarea:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  textarea:-webkit-autofill:focus {
    -webkit-text-fill-color: #ffffff !important;
    -webkit-box-shadow: 0 0 0px 1000px transparent inset !important;
    box-shadow: 0 0 0px 1000px transparent inset !important;
    transition: background-color 9999s ease-in-out 0s;
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

  .site-shell { position: relative; }
  .site-shell * { cursor: default; }
  .site-shell a, .site-shell button, .site-shell .cursor-pointer { cursor: pointer; }

  @media (hover: none), (pointer: coarse) {
    .site-shell * { cursor: auto !important; }
    .site-shell .cursor-pointer { cursor: auto !important; }
    .site-shell * { transition: none !important; }
    .site-shell .group:hover * { transform: none !important; opacity: 1 !important; }
    .site-shell .group-hover\:opacity-100 { opacity: 1 !important; }
    .site-shell .group-hover\:scale-\[1\.035\],
    .site-shell .group-hover\:scale-\[1\.055\] { transform: none !important; }
  }
`;

const METHODS = ["I", "II", "III", "IV"];
const SUBURBS = [
  "Ballarat",
  "Bendigo",
  "Berwick",
  "Cheltenham",
  "Cranbourne",
  "Dandenong",
  "Frankston",
  "Geelong",
  "Melbourne",
  "Mildura",
  "Mornington",
  "Narre Warren",
  "Pakenham",
  "Richmond",
  "Shepparton",
  "South Yarra",
  "St Kilda",
  "Wodonga",
];

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

function scrollToSection(sectionId, offset = 88) {
  const element = document.getElementById(sectionId);
  if (!element) return;
  const target = element.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top: Math.max(0, target), behavior: "smooth" });
}

function InteractiveCard({ children, className = "", glow = "rgba(241,214,122,0.18)", onMouseEnter, disableTilt = false, active = false }) {
  return (
    <div
      className={`group relative isolate overflow-visible bg-transparent transition duration-[1100ms] ease-out ${disableTilt ? "" : "[transform:perspective(1200px)_rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))] will-change-transform"} ${className}`}
      style={{ "--mx": "50%", "--my": "50%", "--rx": "0deg", "--ry": "0deg" }}
      onMouseEnter={onMouseEnter}
      onMouseMove={(e) => {
        if (disableTilt) return;
        setInteractiveVars(e.currentTarget, e.clientX, e.clientY);
      }}
      onMouseLeave={(e) => {
        if (disableTilt) return;
        resetInteractiveVars(e.currentTarget);
      }}
    >
      <div className={`pointer-events-none absolute -inset-10 transition duration-[1100ms] ease-out ${active ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
        <div className="h-full w-full rounded-[999px] bg-[radial-gradient(circle_at_center,rgba(255,230,140,0.18)_0%,rgba(241,214,122,0.08)_16%,rgba(255,230,140,0.09)_30%,rgba(241,214,122,0.028)_42%,rgba(241,214,122,0.014)_54%,rgba(241,214,122,0.006)_66%,rgba(241,214,122,0.002)_76%,transparent_88%)] blur-[46px]" />
      </div>
      <div className={`pointer-events-none absolute -inset-20 transition duration-[1100ms] ease-out ${active ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
        <div className="h-full w-full rounded-[999px] bg-[radial-gradient(circle_at_center,rgba(241,214,122,0.09)_0%,rgba(241,214,122,0.055)_20%,rgba(241,214,122,0.028)_38%,rgba(241,214,122,0.012)_54%,rgba(241,214,122,0.005)_68%,transparent_86%)] blur-[95px]" />
      </div>
      <div className={`pointer-events-none absolute inset-[-18%] transition duration-[1100ms] ease-out ${active ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`} style={{ background: `radial-gradient(720px circle at var(--mx) var(--my), ${glow} 0%, rgba(241,214,122,0.07) 18%, rgba(241,214,122,0.035) 34%, rgba(241,214,122,0.015) 50%, rgba(241,214,122,0.006) 64%, transparent 86%)`, filter: "blur(42px)" }} />
      <div className="relative z-10 bg-transparent">{children}</div>
    </div>
  );
}

function AnimatedTitle({ title, startIndex, mobile = false }) {
  const chars = Array.from(title);
  return (
    <h3 className={`font-semibold text-center text-[#f1d67a] font-['Cormorant_Garamond'] leading-[1.2] ${mobile ? "text-[22px]" : "text-[26px]"}`}>
      {chars.map((char, i) => {
        const isSpace = char === " ";
        return (
          <span
            key={`${title}-${i}`}
            className="inline-block"
            style={isSpace ? { width: "0.34em" } : { animation: `methodLetterPulse 10s linear infinite`, animationDelay: `${(startIndex + i) * 0.08}s` }}
          >
            {isSpace ? " " : char}
          </span>
        );
      })}
    </h3>
  );
}

function ServiceCard({ service, index, startIndex, isMobile, isOpen, onEnterView, onOpenService }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!isMobile) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onEnterView(index);
      },
      { threshold: 0, rootMargin: "-45% 0px -45% 0px" }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [index, isMobile, onEnterView]);

  const ensureCardVisible = (e) => {
    if (isMobile) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const topPadding = 110;
    const bottomPadding = 36;
    if (rect.bottom > window.innerHeight - bottomPadding) {
      window.scrollBy({ top: rect.bottom - (window.innerHeight - bottomPadding), behavior: "smooth" });
    } else if (rect.top < topPadding) {
      window.scrollBy({ top: rect.top - topPadding, behavior: "smooth" });
    }
  };

  return (
    <motion.div className="h-full -m-1 p-1 sm:-m-2 sm:p-2" initial={{ opacity: 0, y: 22, scale: 0.985 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.65, delay: index * 0.06, ease: "easeOut" }}>
      <button type="button" onClick={() => onOpenService(service)} className="block h-full w-full text-left">
        <div ref={ref}>
          <InteractiveCard onMouseEnter={ensureCardVisible} disableTilt={isMobile} active={isMobile && isOpen} className={`rounded-[1.5rem] bg-transparent px-3 py-4 sm:p-4 ${isMobile ? "" : "hover:-translate-y-[8px]"}`}>
            <div className={`relative z-10 flex flex-col gap-2 ${isMobile ? "pb-1" : "pb-2 transition-transform duration-[900ms] ease-out group-hover:scale-[1.035]"}`}>
              <div className="inline-block w-full text-center">
                <AnimatedTitle title={service.title} startIndex={startIndex} mobile={isMobile} />
                <div className={`mt-2 h-px w-full bg-gradient-to-r from-[#f1d67a]/70 to-transparent ${isMobile ? "scale-x-100 opacity-80" : "origin-left scale-x-0 transition-transform duration-[850ms] ease-out group-hover:scale-x-100"}`} />
              </div>
              <p className={`mt-3 text-center text-base sm:text-lg leading-7 sm:leading-8 text-white/80 overflow-hidden transition-all duration-500 ease-out ${isMobile ? (isOpen ? "max-h-[240px] opacity-100" : "max-h-0 opacity-0") : "opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-[220px]"}`}>
                {service.description}
              </p>
              <div className="mt-3 inline-flex w-full items-center justify-center gap-3 text-center text-[11px] sm:text-[13px] italic uppercase tracking-[0.16em] sm:tracking-[0.2em] text-[#f1d67a]/78">
                <span className="h-[8px] w-[8px] rounded-full bg-[#f1d67a]/90" />
                {service.result}
              </div>
              <div className={`mt-3 flex justify-end pr-1 text-white text-sm leading-none tracking-wide ${isMobile ? "opacity-45" : "opacity-20 group-hover:opacity-100 transition duration-[850ms] ease-out"}`}>
                <span className={isMobile ? "" : "transition-transform duration-[850ms] ease-out group-hover:translate-x-[3px]"}>→ Read more</span>
              </div>
            </div>
          </InteractiveCard>
        </div>
      </button>
    </motion.div>
  );
}

function MethodCard({ step, index, startIndex, isMobile }) {
  return (
    <InteractiveCard className="p-5 sm:p-6" glow="rgba(241,214,122,0.14)" disableTilt={isMobile}>
      <div className={`relative z-10 ${isMobile ? "" : "transition-transform duration-300 group-hover:scale-[1.055]"}`}>
        <div className="inline-block w-full text-center">
          <div className="flex flex-col items-center gap-1">
            <span className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full border-[2.5px] border-[#f1d67a]/90 font-['Cormorant_Garamond'] text-[18px] sm:text-[20px] font-extrabold tracking-[0.06em] text-[#ffe8a3] shadow-[inset_0_2px_8px_rgba(0,0,0,0.65),0_6px_18px_rgba(255,230,140,0.32)]">{METHODS[index]}</span>
            <AnimatedTitle title={step.title} startIndex={startIndex} mobile={isMobile} />
          </div>
          <div className={`mt-3 h-px w-full bg-gradient-to-r from-[#f1d67a]/70 to-transparent ${isMobile ? "scale-x-100 opacity-80" : "origin-left scale-x-0 transition-transform duration-[850ms] ease-out group-hover:scale-x-100"}`} />
        </div>
        <p className="mx-auto max-w-xs text-center text-base sm:text-lg leading-7 sm:leading-8 text-white/55">{step.description}</p>
      </div>
    </InteractiveCard>
  );
}

function MobileMenuButton({ open, onClick }) {
  return (
    <button type="button" onClick={onClick} className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-[#f1d67a] md:hidden" aria-label="Toggle menu" aria-expanded={open}>
      <div className="relative h-4 w-5">
        <span className={`absolute left-0 top-0 h-[1.5px] w-5 bg-current transition ${open ? "translate-y-[7px] rotate-45" : ""}`} />
        <span className={`absolute left-0 top-[7px] h-[1.5px] w-5 bg-current transition ${open ? "opacity-0" : "opacity-100"}`} />
        <span className={`absolute left-0 top-[14px] h-[1.5px] w-5 bg-current transition ${open ? "-translate-y-[7px] -rotate-45" : ""}`} />
      </div>
    </button>
  );
}

function HeaderLogo() {
  return (
    <div className="relative flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center">
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
        <text x="60" y="68" textAnchor="middle" fontSize="20" fontWeight="900" fontFamily="serif" fill="#000" letterSpacing="2">IR</text>
      </svg>
    </div>
  );
}

function ServiceOverlay({ service, suburb, onClose, onBookNow, onChangeSuburb }) {
  const keyword = `${service.title} ${suburb}`;
  const pageTitle = `${service.title} in ${suburb}, Victoria`;
  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto bg-black/88 backdrop-blur-xl">
      <div className="min-h-screen px-4 py-12 sm:px-6 sm:py-16 lg:px-10">
        <div className="mx-auto max-w-5xl grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-10">
          <div>
            <button type="button" onClick={onClose} className="mb-8 inline-flex items-center gap-2 text-sm uppercase tracking-[0.18em] text-white/60 hover:text-[#f1d67a]">← Back</button>
            <div className="text-[11px] uppercase tracking-[0.28em] text-[#f1d67a]">Service Landing Page</div>
            <h1 className="mt-4 text-[2rem] sm:text-5xl font-semibold text-[#f1d67a] leading-tight">{pageTitle}</h1>
            <p className="mt-6 text-lg leading-8 text-white/72">{service.description} Built for businesses in {suburb}, Melbourne, and wider Victoria that want stronger lead flow, better conversion, and a revenue system they can actually control.</p>
            <div className="mt-10 space-y-10 text-white/80">
              <section>
                <h2 className="text-2xl font-semibold text-white">{keyword} Services</h2>
                <p className="mt-4 leading-8">Imperium Revenue provides {service.title.toLowerCase()} in {suburb}, Victoria for businesses that want predictable growth instead of random wins. We build structured systems around acquisition, sales process, conversion, and reporting so the business can scale with clarity.</p>
                <p className="mt-4 leading-8">If your business in {suburb} is dealing with inconsistent enquiries, weak close rates, poor visibility across the pipeline, or disconnected sales activity, this service is built to fix the bottlenecks and install a cleaner path to revenue.</p>
              </section>
              <section>
                <h2 className="text-2xl font-semibold text-white">What We Do</h2>
                <p className="mt-4 leading-8">We design, install, and refine {service.title.toLowerCase()} systems that connect directly to commercial outcomes.</p>
                <ul className="mt-4 space-y-2 leading-8">
                  <li>• Diagnose the bottlenecks slowing growth</li>
                  <li>• Build clearer offers, messaging, systems, and workflows</li>
                  <li>• Improve lead quality and conversion structure</li>
                  <li>• Create better operational visibility and control</li>
                </ul>
              </section>
              <section>
                <h2 className="text-2xl font-semibold text-white">Why Businesses in {suburb} Choose Imperium Revenue</h2>
                <p className="mt-4 leading-8">We do not rely on vague agency language or disconnected tactics. We build revenue systems around structure, execution, and measurable output.</p>
              </section>
              <section>
                <h2 className="text-2xl font-semibold text-white">Areas We Service</h2>
                <p className="mt-4 leading-8 text-white/70">Alongside {suburb}, we service Melbourne, Frankston, Dandenong, Cranbourne, Berwick, Narre Warren, Pakenham, Geelong, Ballarat, Bendigo, Shepparton, Wodonga, Mildura, and surrounding suburbs across Victoria.</p>
              </section>
              <section>
                <h2 className="text-2xl font-semibold text-white">Results You Can Expect</h2>
                <ul className="mt-4 space-y-2 leading-8">
                  <li>• Increased qualified lead flow</li>
                  <li>• Higher close rates and cleaner follow-up</li>
                  <li>• Better reporting and operational visibility</li>
                  <li>• A more scalable revenue system built for growth</li>
                </ul>
              </section>
            </div>
            <button type="button" onClick={onBookNow} className="mt-12 inline-flex w-full sm:w-auto justify-center rounded-2xl bg-[#f1d67a] px-6 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-black">Book Now</button>
          </div>
          <aside className="space-y-4 lg:space-y-5 lg:pt-16">
            <div className="rounded-[1.35rem] border border-white/10 bg-white/[0.03] p-5">
              <div className="text-sm uppercase tracking-[0.18em] text-[#f1d67a]">Keyword Target</div>
              <div className="mt-3 text-white text-lg">{keyword}</div>
            </div>
            <div className="rounded-[1.35rem] border border-white/10 bg-white/[0.03] p-5">
              <div className="text-sm uppercase tracking-[0.18em] text-[#f1d67a]">Meta Title</div>
              <div className="mt-3 text-white/78 leading-7">{pageTitle} | Imperium Revenue</div>
            </div>
            <div className="rounded-[1.35rem] border border-white/10 bg-white/[0.03] p-5">
              <div className="text-sm uppercase tracking-[0.18em] text-[#f1d67a]">Meta Description</div>
              <div className="mt-3 text-white/72 leading-7">Imperium Revenue provides {service.title.toLowerCase()} in {suburb}, Victoria. Build stronger lead flow, sharper conversion, and scalable revenue systems for long-term business growth.</div>
            </div>
            <div className="rounded-[1.35rem] border border-white/10 bg-white/[0.03] p-5">
              <div className="text-sm uppercase tracking-[0.18em] text-[#f1d67a]">Local SEO Target</div>
              <div className="mt-3 text-white/78 leading-7">
                {suburb}, Victoria
              </div>
              <p className="mt-3 text-sm leading-6 text-white/48">
                Suburb variants are hidden from site navigation so the page feels clean and premium.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function TermsOverlay({ onClose }) {
  return (
    <div className="fixed inset-0 z-[80] overflow-y-auto bg-black/90 backdrop-blur-xl">
      <div className="min-h-screen px-4 py-12 sm:px-6 sm:py-16 lg:px-10">
        <div className="mx-auto max-w-4xl">
          <button
            type="button"
            onClick={onClose}
            className="mb-8 inline-flex items-center gap-2 text-sm uppercase tracking-[0.18em] text-white/60 transition hover:text-[#f1d67a]"
          >
            ← Back
          </button>

          <div className="text-[11px] uppercase tracking-[0.28em] text-[#f1d67a]">Legal</div>
          <h1 className="mt-4 text-4xl font-semibold text-[#f1d67a] sm:text-5xl">Terms & Conditions</h1>
          <p className="mt-6 text-base leading-8 text-white/68">
            These terms govern the use of the Imperium Revenue website and any enquiries, consultations, or services requested through it.
          </p>

          <div className="mt-10 space-y-10 text-white/78">
            <section>
              <h2 className="text-2xl font-semibold text-white">1. Website Use</h2>
              <p className="mt-4 leading-8">
                By using this website, you agree to use it lawfully and in a way that does not interfere with its operation, security, or availability.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">2. Enquiries and Consultations</h2>
              <p className="mt-4 leading-8">
                Submitting an enquiry or requesting a consultation does not create a binding service agreement. Any engagement, pricing, scope, and deliverables are only confirmed in writing after direct discussion and approval.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">3. No Guaranteed Results</h2>
              <p className="mt-4 leading-8">
                Imperium Revenue provides strategy, systems, implementation support, and commercial advice. Outcomes may vary depending on market conditions, business readiness, sales execution, budget, and external factors. No specific revenue, lead, or conversion outcome is guaranteed unless expressly agreed in writing.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">4. Intellectual Property</h2>
              <p className="mt-4 leading-8">
                All website content, branding, copy, layouts, frameworks, and materials remain the property of Imperium Revenue unless otherwise stated. They may not be copied, republished, or reused without permission.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">5. Third-Party Services</h2>
              <p className="mt-4 leading-8">
                This website may use third-party tools or services for hosting, form handling, analytics, communication, or scheduling. Imperium Revenue is not responsible for the independent policies, outages, or actions of those third-party providers.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">6. Information Submitted</h2>
              <p className="mt-4 leading-8">
                Information submitted through the contact form should be accurate and not misleading. By submitting information, you confirm that you are authorised to provide it and to be contacted regarding your enquiry.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">7. Liability</h2>
              <p className="mt-4 leading-8">
                To the maximum extent permitted by law, Imperium Revenue is not liable for indirect, incidental, or consequential loss arising from the use of this website or reliance on website content.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">8. Privacy</h2>
              <p className="mt-4 leading-8">
                Contact details and enquiry information may be used to respond to your enquiry, provide service information, and manage business communications. Sensitive or payment information should not be submitted through the standard website form unless specifically requested through a secure process.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">9. Changes to These Terms</h2>
              <p className="mt-4 leading-8">
                Imperium Revenue may update these terms from time to time. Continued use of the website after updates constitutes acceptance of the revised terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">10. Contact</h2>
              <p className="mt-4 leading-8">
                For legal or website-related enquiries, contact edvinhebovija@gmail.com.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ImperiumRevenueWebsite() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    businessName: "",
    phone: "",
    message: "",
  });
  const [formStatus, setFormStatus] = useState({ state: "idle", message: "" });
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [openServiceIndex, setOpenServiceIndex] = useState(0);
  const [activeService, setActiveService] = useState(null);
  const [activeSuburb, setActiveSuburb] = useState("Melbourne");
  const [termsOpen, setTermsOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const nextIsMobile = window.innerWidth < 768;
      setIsMobile(nextIsMobile);
      if (!nextIsMobile) setMobileMenuOpen(false);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    if (activeService || termsOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = previousOverflow || "";
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [activeService, termsOpen]);

  const services = useMemo(() => [
    { title: "Marketing Assets", description: "Websites, campaigns, and social media assets aligned with acquisition, authority, and conversion.", result: "Sharper brand authority" },
    { title: "Sales Strategy", description: "CRM setup, KPI tracking, and process optimisation that turn effort into a measurable growth system.", result: "Clear commercial visibility" },
    { title: "Lead Generation", description: "Cold calling, paid ads, and social funnels designed to create a steady flow of qualified opportunities.", result: "More qualified leads" },
    { title: "Staff Training", description: "Appointment setter coaching and sales team development to improve performance across the pipeline.", result: "Stronger team output" },
    { title: "Sales Closing", description: "Sharper scripts, stronger sales structure, and trained closers built to lift conversion and consistency.", result: "Higher close rates" },
    { title: "Full Management", description: "Automation, dashboards, and reporting that create visibility, control, and operational clarity.", result: "End-to-end oversight" },
  ], []);

  const processSteps = useMemo(() => [
    { title: "Discovery", description: "Deep analysis of your current position, opportunities, and constraints to define a clear direction." },
    { title: "Architecture", description: "Designing the full revenue system including funnels, messaging, processes, and infrastructure." },
    { title: "Deployment", description: "Executing and implementing the systems, assets, and workflows into your business environment." },
    { title: "Optimization", description: "Refining performance through data, testing, training, and continuous improvement." },
  ], []);

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

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!formData.firstName.trim() || !formData.email.trim() || !formData.message.trim()) {
      setFormStatus({ state: "error", message: "Please complete your name, email, and message." });
      return;
    }

    if (!CONTACT_FORM_ENDPOINT) {
      setFormStatus({
        state: "error",
        message: "Add your form endpoint to CONTACT_FORM_ENDPOINT to enable live submissions.",
      });
      return;
    }

    setFormStatus({ state: "submitting", message: "Sending request..." });

    try {
      const response = await fetch(CONTACT_FORM_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          businessName: formData.businessName,
          phone: formData.phone,
          message: formData.message,
          source: "Imperium Revenue website",
        }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.errors?.[0]?.message || "Submission failed");
      }

      setFormStatus({ state: "success", message: "Request sent successfully. We will be in touch soon." });
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        businessName: "",
        phone: "",
        message: "",
      });
    } catch (error) {
      setFormStatus({
        state: "error",
        message: error instanceof Error ? error.message : "Submission failed. Try again.",
      });
    }
  };

  const openServiceOverlay = (service) => {
    setActiveService(service);
    setActiveSuburb("Melbourne");
    setServicesDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const scrollToServices = () => {
    setMobileMenuOpen(false);
    setServicesDropdownOpen(false);
    setActiveService(null);
    requestAnimationFrame(() => {
      scrollToSection("services", isMobile ? 84 : 96);
    });
  };

  const scrollToMethods = () => {
    setMobileMenuOpen(false);
    setServicesDropdownOpen(false);
    setActiveService(null);
    const el = document.getElementById("methods-heading");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollToContact = () => {
    setMobileMenuOpen(false);
    setServicesDropdownOpen(false);
    setActiveService(null);
    setTermsOpen(false);

    window.setTimeout(() => {
      const element = document.getElementById("contact");
      if (!element) return;
      const offset = isMobile ? 84 : 96;
      const target = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: Math.max(0, target), behavior: "smooth" });
    }, 60);
  };

  const openServiceFromMenu = (title) => {
    const matchedService = services.find((service) => service.title === title);
    if (!matchedService) return;
    openServiceOverlay(matchedService);
  };

  const scrollToServiceCard = (title) => {
    setMobileMenuOpen(false);
    setServicesDropdownOpen(false);
    setActiveService(null);
    const targetId = `service-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
    const target = document.getElementById(targetId);
    if (!target) return;
    const offset = isMobile ? 92 : 108;
    const scrollTarget = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: Math.max(0, scrollTarget), behavior: "smooth" });
    const serviceIndex = services.findIndex((service) => service.title === title);
    if (serviceIndex >= 0) setOpenServiceIndex(serviceIndex);
  };

  return (
    <div className="site-shell flex min-h-screen flex-col overflow-x-hidden bg-[#070707] text-white selection:bg-[#d4af37]/25 selection:text-white">
      <style>{SHIMMER_STYLE}</style>

      <header className="sticky top-0 z-40 border-b border-[#f1d67a]/10 bg-black/45 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 sm:py-5 lg:px-10">
          <div className="flex min-w-0 items-center justify-center gap-3">
            
            <div className="truncate text-[11px] sm:text-[13px] md:text-[15px] uppercase tracking-[0.24em] sm:tracking-[0.32em] md:tracking-[0.38em] font-semibold bg-gradient-to-r from-[#fff0b8] via-[#f1d67a] to-[#e0b94a] bg-clip-text text-transparent">
              Imperium Revenue
            </div>
          </div>

          <nav className="hidden items-center gap-8 text-sm text-white/40 md:flex">
            <div className="relative">
              <button
                type="button"
                onClick={() => setServicesDropdownOpen((v) => !v)}
                className="group relative inline-flex items-center gap-2 px-2 py-1 text-[12px] uppercase tracking-[0.24em] text-white/68 transition duration-300 hover:text-white"
              >
                <span className="bg-gradient-to-r from-[#fff0b8] via-[#f1d67a] to-[#e0b94a] bg-clip-text text-transparent opacity-90 transition duration-300 group-hover:opacity-100">
                  Services
                </span>
                <span className={`text-[10px] transition duration-500 ${servicesDropdownOpen ? "rotate-180 text-[#f1d67a]" : "text-white/35 group-hover:text-[#f1d67a]"}`}>
                  ▼
                </span>
                <span className="absolute left-0 -bottom-1 h-px w-0 bg-gradient-to-r from-[#f1d67a] to-transparent transition-all duration-500 group-hover:w-full" />
              </button>

              {servicesDropdownOpen && (
                <div className="absolute left-0 top-full z-20 mt-4 w-[290px] overflow-hidden rounded-[1.4rem] border border-[#f1d67a]/12 bg-black/90 p-2 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
                  <button
                    type="button"
                    onClick={scrollToServices}
                    className="flex w-full items-center justify-between rounded-[1rem] px-4 py-3 text-left text-white/80 transition hover:bg-white/[0.04] hover:text-[#f1d67a]"
                  >
                    <span>All Services</span>
                    <span className="text-white/30">→</span>
                  </button>
                  <div className="my-1 h-px bg-gradient-to-r from-[#f1d67a]/20 to-transparent" />
                  {services.map((service) => (
                    <button
                      key={service.title}
                      type="button"
                      onClick={() => openServiceFromMenu(service.title)}
                      className="flex w-full items-center justify-between rounded-[1rem] px-4 py-3 text-left text-white/72 transition hover:bg-white/[0.04] hover:text-[#f1d67a]"
                    >
                      <span>{service.title}</span>
                      <span className="text-white/25">→</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </nav>

          <MobileMenuButton open={mobileMenuOpen} onClick={() => setMobileMenuOpen((v) => !v)} />
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-white/10 bg-black/70 px-4 py-4 backdrop-blur-xl md:hidden">
            <div className="flex flex-col gap-2 text-sm uppercase tracking-[0.16em] text-white/78">
              <button type="button" onClick={scrollToServices} className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left">
                Services
              </button>
              <div className="rounded-[1.25rem] border border-white/8 bg-white/[0.02] p-2">
                {services.map((service) => (
                  <button
                    type="button"
                    key={service.title}
                    onClick={() => openServiceFromMenu(service.title)}
                    className="block w-full rounded-xl px-3 py-2 text-left text-[12px] tracking-[0.12em] text-white/68 transition hover:bg-white/[0.04] hover:text-[#f1d67a]"
                  >
                    {service.title}
                  </button>
                ))}
              </div>
              <button type="button" onClick={scrollToMethods} className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left">
                Methods
              </button>
              <button type="button" onClick={scrollToContact} className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left">
                Contact
              </button>
            </div>
          </div>
        )}
      </header>

      {termsOpen && <TermsOverlay onClose={() => setTermsOpen(false)} />}

      {activeService && (
        <ServiceOverlay
          service={activeService}
          suburb={activeSuburb}
          onClose={() => setActiveService(null)}
          onChangeSuburb={setActiveSuburb}
          onBookNow={() => {
            setActiveService(null);
            requestAnimationFrame(() => scrollToSection("contact", isMobile ? 84 : 96));
          }}
        />
      )}

      <main className="flex-1">
        <section className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-10 lg:py-24">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute top-[-10%] left-[10%] h-[900px] w-[1100px] bg-[radial-gradient(ellipse_at_40%_30%,rgba(255,230,140,0.32),rgba(255,230,140,0.18)_25%,rgba(255,230,140,0.09)_50%,transparent_75%)] blur-[120px]" />
          </div>
          <div className="relative z-10 max-w-5xl">
            <h1 className="text-[2.2rem] font-semibold leading-[1.04] sm:text-5xl sm:leading-tight md:text-6xl lg:text-[5.4rem]">
              Revenue systems built
              <span className="block text-[#f1d67a]">for control, clarity, and growth.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-[15px] leading-7 text-white/68 sm:text-lg sm:leading-8">Imperium Revenue designs clear systems for lead flow, conversion, team performance, and operational control.</p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setServicesDropdownOpen(false);
                  setActiveService(null);
                  setTermsOpen(false);

                  const element = document.getElementById("contact");
                  if (!element) return;
                  const offset = isMobile ? 84 : 96;
                  const target = element.getBoundingClientRect().top + window.scrollY - offset;
                  window.scrollTo({ top: Math.max(0, target), behavior: "smooth" });
                }}
                className="inline-flex w-full sm:w-auto justify-center rounded-2xl bg-[#f1d67a] px-6 py-4 text-sm font-semibold uppercase tracking-[0.14em] sm:tracking-[0.18em] text-black transition duration-300 hover:scale-[1.02] hover:bg-[#f5df8f] hover:shadow-[0_0_40px_rgba(241,214,122,0.25)]"
              >
                Book Now
              </button>
              <button
                type="button"
                onClick={scrollToMethods}
                className="group inline-flex w-full sm:w-auto items-center justify-center rounded-2xl border border-[#f1d67a]/40 px-6 py-4 text-sm font-semibold uppercase tracking-[0.14em] sm:tracking-[0.18em] text-[#f1d67a] transition duration-300 hover:bg-[#f1d67a]/10 hover:shadow-[0_0_30px_rgba(241,214,122,0.2)]"
              >
                <span className="bg-gradient-to-r from-[#fff0b8] via-[#f1d67a] to-[#e0b94a] bg-clip-text text-transparent">Methods</span>
              </button>
            </div>
          </div>
        </section>

        <section id="services" className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-10">
          <div className="mb-8 max-w-2xl sm:mb-10">
            <div className="text-[11px] uppercase tracking-[0.28em] text-[#f6de8f]">Services</div>
            <h2 className="mt-3 text-[1.8rem] font-semibold tracking-[-0.03em] sm:text-3xl md:text-4xl">Built to drive revenue end-to-end.</h2>
            <div className="mt-4 h-px w-20 bg-gradient-to-r from-[#f1d67a]/60 to-transparent" />
            <p className="mt-4 text-base leading-7 text-white sm:text-lg">
              <span className="bg-gradient-to-r from-[#fff0b8] via-[#f1d67a] to-[#e0b94a] bg-clip-text text-transparent">Each service connects into a single system designed to generate, convert, and scale.</span>
            </p>
          </div>
          <div className="relative grid gap-1 sm:gap-2 md:grid-cols-3">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute left-[-20%] top-[10%] h-[1000px] w-[1200px] bg-[radial-gradient(circle_at_left,rgba(255,230,140,0.32),rgba(255,230,140,0.18)_25%,rgba(255,230,140,0.09)_50%,transparent_75%)] blur-[120px]" />
            </div>
            {services.map((service, index) => (
              <div key={service.title} id={`service-${service.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}>
                <ServiceCard service={service} index={index} startIndex={serviceTitleStartIndexes[index]} isMobile={isMobile} isOpen={openServiceIndex === index} onEnterView={setOpenServiceIndex} onOpenService={openServiceOverlay} />
              </div>
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <button type="button" onClick={scrollToContact} className="inline-flex w-full sm:w-auto justify-center rounded-2xl bg-[#f1d67a] px-6 py-4 text-sm font-semibold uppercase tracking-[0.14em] sm:tracking-[0.18em] text-black transition duration-300 hover:scale-[1.02] hover:bg-[#f5df8f] hover:shadow-[0_0_40px_rgba(241,214,122,0.25)]">Book Now</button>
          </div>
        </section>

        <section id="process" className="relative mx-auto max-w-7xl px-4 pt-10 pb-2 sm:px-6 sm:pt-12 lg:px-10">
          <div className="mb-8 max-w-2xl">
            <div className="text-[11px] uppercase tracking-[0.28em] text-[#f1d67a]">Methods</div>
            <h2 id="methods-heading" className="scroll-mt-28 mt-4 text-[1.95rem] font-semibold tracking-[-0.03em] sm:text-4xl md:text-5xl">The Imperium Method</h2>
            <div className="mt-6 h-px w-20 bg-gradient-to-r from-[#f1d67a]/60 to-transparent" />
            <p className="mt-6 text-base leading-7 text-white sm:text-lg sm:leading-8"><span className="bg-gradient-to-r from-[#fff0b8] via-[#f1d67a] to-[#e0b94a] bg-clip-text text-transparent">A clean, structured approach designed to remove chaos, install control, and drive consistent growth.</span></p>
          </div>
          <div className="relative grid gap-0 md:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step, index) => (
              <div key={step.title} className="h-full -m-2 p-2">
                <MethodCard step={step} index={index} startIndex={methodTitleStartIndexes[index]} isMobile={isMobile} />
              </div>
            ))}
          </div>
        </section>

        <section id="contact" className="scroll-mt-28 relative overflow-hidden pt-6 sm:pt-8">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute bottom-[-20%] left-1/2 -translate-x-1/2 h-[600px] w-[900px] bg-[radial-gradient(circle_at_center,rgba(241,214,122,0.25)_0%,rgba(241,214,122,0.15)_25%,rgba(241,214,122,0.08)_45%,transparent_75%)] blur-[100px]" />
          </div>
          <div className="relative mx-auto grid max-w-7xl gap-8 px-4 pt-6 pb-0 sm:px-6 sm:pt-8 sm:pb-0 lg:grid-cols-[0.95fr_1.05fr] lg:gap-10 lg:px-10 lg:pt-10 lg:pb-0">
            <div className="max-w-xl">
              <div className="text-[11px] uppercase tracking-[0.28em] text-[#f1d67a]">Contact</div>
              <h2 className="mt-4 text-[1.95rem] font-semibold tracking-[-0.03em] text-white sm:text-4xl md:text-5xl">Build a revenue system that actually holds.</h2>
              <div className="mt-6 h-px w-24 bg-gradient-to-r from-[#f1d67a]/80 to-transparent" />
              <div className="mt-10 space-y-8 text-white/72">
                <div>
                  <p className="mt-3 text-base leading-7 text-white/68">
                    <span className="bg-gradient-to-r from-[#fff0b8] via-[#f1d67a] to-[#e0b94a] bg-clip-text text-transparent">
                      A focused conversation around your lead flow, conversion gaps, team performance, and the systems needed to scale cleanly.
                    </span>
                  </p>
                </div>
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
                  <div>
                    <div className="text-sm uppercase tracking-[0.16em] text-[#f1d67a]">Email</div>
                    <div className="mt-2 text-base text-white">ed@imperiumrevenue.com.au</div>

                    <div className="mt-6 text-sm uppercase tracking-[0.16em] text-[#f1d67a]">Mobile</div>
                    <div className="mt-2 text-base text-white">0413162201</div>
                  </div>

                  <div>
                    <div className="text-sm uppercase tracking-[0.16em] text-[#f1d67a]">Response</div>
                    <div className="mt-2 text-base text-white">Within 1 business day</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-0 sm:p-2 lg:p-6">
              <form onSubmit={handleFormSubmit} className="grid gap-4 sm:gap-5">
                <div className="grid gap-5 grid-cols-1 sm:grid-cols-2">
                  <input name="firstName" value={formData.firstName} onChange={handleFormChange} type="text" placeholder="First name" className="w-full border-0 border-b border-white/20 bg-transparent px-5 py-4 text-[16px] text-white outline-none transition placeholder:text-white/35 focus:border-[#f1d67a]/55" />
                  <input name="lastName" value={formData.lastName} onChange={handleFormChange} type="text" placeholder="Last name" className="w-full border-0 border-b border-white/20 bg-transparent px-5 py-4 text-[16px] text-white outline-none transition placeholder:text-white/35 focus:border-[#f1d67a]/55" />
                </div>
                <div className="grid gap-5 grid-cols-1 sm:grid-cols-2">
                  <input name="email" value={formData.email} onChange={handleFormChange} type="email" placeholder="Email address" className="w-full border-0 border-b border-white/20 bg-transparent px-5 py-4 text-[16px] text-white outline-none transition placeholder:text-white/35 focus:border-[#f1d67a]/55" />
                  <input name="businessName" value={formData.businessName} onChange={handleFormChange} type="text" placeholder="Business name" className="w-full border-0 border-b border-white/20 bg-transparent px-5 py-4 text-[16px] text-white outline-none transition placeholder:text-white/35 focus:border-[#f1d67a]/55" />
                </div>
                <input name="phone" value={formData.phone} onChange={handleFormChange} type="text" placeholder="Phone number" className="w-full border-0 border-b border-white/20 bg-transparent px-5 py-4 text-[16px] text-white outline-none transition placeholder:text-white/35 focus:border-[#f1d67a]/55" />
                <textarea name="message" value={formData.message} onChange={handleFormChange} rows={5} placeholder="Tell us about your business, your goals, and what needs fixing" className="w-full border-0 border-b border-white/20 bg-transparent px-5 py-4 text-[16px] text-white outline-none transition placeholder:text-white/35 focus:border-[#f1d67a]/55" />
                <button type="submit" disabled={formStatus.state === "submitting"} className="mt-8 mb-8 rounded-2xl bg-[#f1d67a] px-6 py-4 text-sm font-semibold uppercase tracking-[0.14em] sm:tracking-[0.18em] text-black transition duration-300 hover:scale-[1.01] hover:bg-[#f5df8f] hover:shadow-[0_0_40px_rgba(241,214,122,0.24)] disabled:cursor-not-allowed disabled:opacity-70">
                  {formStatus.state === "submitting" ? "Sending..." : "Request Consultation"}
                </button>
                {formStatus.message && (
                  <p className={`text-sm leading-6 ${formStatus.state === "success" ? "text-[#f1d67a]" : "text-white/60"}`}>
                    {formStatus.message}
                  </p>
                )}
              </form>
            </div>
          </div>      </section>
      </main>

      <footer className="w-full border-t border-[#f1d67a]/10 bg-black/45 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-10">
          <div className="relative flex flex-col items-center justify-center gap-2 text-[10px] tracking-[0.18em] uppercase sm:text-[11px] sm:tracking-[0.24em]">
            <button
              onClick={() => setTermsOpen(true)}
              className="bg-gradient-to-r from-[#fff0b8] via-[#f1d67a] to-[#e0b94a] bg-clip-text text-transparent opacity-80 transition hover:opacity-100"
            >
              Terms & Conditions
            </button>

            <div className="text-center bg-gradient-to-r from-[#fff0b8] via-[#f1d67a] to-[#e0b94a] bg-clip-text text-transparent opacity-70 sm:absolute sm:right-0">
              IMPERIUMREVENUE™
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
