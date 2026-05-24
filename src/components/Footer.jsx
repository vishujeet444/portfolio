import { motion } from 'framer-motion';

const NAV = ['Home', 'Works', 'About', 'Skills', 'Contact'];
const SOCIALS = [
  { label: 'ArtStation', href: 'https://www.artstation.com/vishwajeetkumar684' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/vishwajeet-kumar-811949217' },
  { label: 'Instagram', href: 'https://www.instagram.com/vishu_u___13' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 py-16 px-4">
      {/* HELIOS top glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(0,255,136,0.2), transparent)' }}
      />

      <div className="section-container">
        <div className="divider-gold mb-12" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-7 h-7">
                <div
                  className="absolute inset-0 rounded-full"
                  style={{ border: '1px solid rgba(0,255,136,0.3)' }}
                />
                <div
                  className="absolute inset-1.5 rounded-full"
                  style={{ background: 'rgba(0,255,136,0.6)' }}
                />
              </div>
              <span
                className="font-mono text-sm font-semibold tracking-widest uppercase"
                style={{ color: 'rgba(255,255,255,0.58)' }}
              >
                Vishwajeet Kumar
              </span>
            </div>
            <p
              className="font-body text-xs leading-relaxed max-w-xs"
              style={{ color: 'rgba(255,255,255,0.22)' }}
            >
              3D Cinematic Artist crafting immersive visual experiences through light, rendering, and storytelling.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <div
              className="font-mono text-xs tracking-widest uppercase mb-5"
              style={{ color: 'rgba(0,255,136,0.3)' }}
            >
              Navigation
            </div>
            <div className="flex flex-col gap-2">
              {NAV.map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={(e) => {
                    e.preventDefault();
                    const id = item === 'Works' ? '#works' : item === 'Home' ? '#hero' : `#${item.toLowerCase()}`;
                    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="font-mono text-xs w-fit transition-colors duration-300"
                  style={{ color: 'rgba(255,255,255,0.28)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(0,255,136,0.7)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.28)'; }}
                >
                  {item}
                </a>
              ))}
            </div>
          </div>

          {/* Social */}
          <div>
            <div
              className="font-mono text-xs tracking-widest uppercase mb-5"
              style={{ color: 'rgba(0,255,136,0.3)' }}
            >
              Connect
            </div>
            <div className="flex flex-col gap-2">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs w-fit flex items-center gap-2 group transition-colors duration-300"
                  style={{ color: 'rgba(255,255,255,0.28)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(0,255,136,0.7)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.28)'; }}
                >
                  <span
                    className="w-3 h-px transition-all duration-300 group-hover:w-5"
                    style={{ background: 'rgba(255,255,255,0.15)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,255,136,0.4)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; }}
                  />
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="divider-gold mb-6" />
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="font-mono text-xs" style={{ color: 'rgba(255,255,255,0.13)' }}>
            © {year} Vishwajeet Kumar. All rights reserved.
          </span>
          <span className="font-mono text-xs" style={{ color: 'rgba(255,255,255,0.13)' }}>
            Mumbai, India · vishwajeetkumar2019@gmail.com
          </span>
        </div>
      </div>
    </footer>
  );
}
