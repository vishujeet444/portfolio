import { NAV_LINKS, SOCIAL_LINKS, CONTACT, SITE, scrollToSection } from '../lib/constants';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 section-pad !pt-12 !pb-12">
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(0,255,136,0.2), transparent)' }}
        aria-hidden
      />

      <div className="section-container">
        <div className="divider-gold mb-12" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-7 h-7" aria-hidden>
                <div
                  className="absolute inset-0 rounded-full"
                  style={{ border: '1px solid rgba(0,255,136,0.3)' }}
                />
                <div
                  className="absolute inset-1.5 rounded-full"
                  style={{ background: 'rgba(0,255,136,0.6)' }}
                />
              </div>
              <span className="type-label text-white/55">
                {SITE.name}
              </span>
            </div>
            <p className="type-body-sm max-w-xs">
              {SITE.title} crafting immersive visual experiences through light, rendering, and storytelling.
            </p>
          </div>

          <nav aria-label="Footer">
            <div className="type-label mb-6">
              Navigation
            </div>
            <div className="flex flex-col gap-2">
              {NAV_LINKS.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(item.href);
                  }}
                  className="type-label w-fit link-muted !normal-case"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </nav>

          <div>
            <div className="type-label mb-6">
              Connect
            </div>
            <div className="flex flex-col gap-2">
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs w-fit flex items-center gap-2 group link-muted"
                >
                  <span
                    className="w-3 h-px bg-white/15 transition-all duration-300 group-hover:w-5 group-hover:bg-neon/40"
                    aria-hidden
                  />
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="divider-gold mb-6" />
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="type-label !text-[0.65rem] text-white/25">
            © {year} {SITE.name}. All rights reserved.
          </span>
          <span className="type-label !text-[0.65rem] text-white/25">
            {SITE.location} · {CONTACT.email}
          </span>
        </div>
      </div>
    </footer>
  );
}
