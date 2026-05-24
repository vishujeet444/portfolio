import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

const SOCIAL_LINKS = [
  {
    label: 'ArtStation',
    href: 'https://www.artstation.com/vishwajeetkumar684',
    desc: 'View 3D portfolio',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M0 17.723l2.027 3.505h.001a2.424 2.424 0 0 0 2.164 1.333h13.457l-2.792-4.838H0zm24 .025c0-.484-.143-.935-.388-1.314L15.728 2.728a2.424 2.424 0 0 0-2.164-1.333H9.044L21.616 22.038l.997-1.728c.216-.374.214-.769.215-1.133l-.001-.43zM0 13.457h14.629L7.632 1.332H5.029a2.424 2.424 0 0 0-2.165 1.333L.037 6.73c-.376.65-.376 1.443 0 2.093l.963 1.666H0v2.968z" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/vishwajeet-kumar-811949217',
    desc: 'Connect professionally',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/vishu_u___13',
    desc: 'Behind the scenes',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    ),
  },
];

function InputField({ label, type = 'text', name, value, onChange, multiline, placeholder }) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="relative group">
      <label
        className="block font-mono text-[0.65rem] tracking-[0.25em] uppercase mb-3 transition-colors duration-300"
        style={{ color: focused ? '#00FF88' : 'rgba(255,255,255,0.18)' }}
      >
        {label}
      </label>
      {multiline ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          rows={5}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="input-underline resize-none"
          style={{ borderBottomColor: focused ? 'rgba(0,255,136,0.5)' : 'rgba(0,255,136,0.1)' }}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="input-underline"
          style={{ borderBottomColor: focused ? 'rgba(0,255,136,0.5)' : 'rgba(0,255,136,0.1)' }}
        />
      )}
      {/* Focus line neon animation */}
      <div
        className="absolute bottom-0 left-0 h-px transition-all duration-500"
        style={{
          width: focused ? '100%' : '0%',
          background: '#00FF88',
          boxShadow: focused ? '0 0 10px rgba(0,255,136,0.6)' : 'none',
        }}
      />
    </div>
  );
}

export default function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('idle');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus('success');
        setForm({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
    setTimeout(() => setStatus('idle'), 5000);
  };

  return (
    <section id="contact" ref={ref} className="relative z-10 py-32 px-4">
      {/* HELIOS section ambient glow — bottom neon green */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 40% at 50% 100%, rgba(0,255,136,0.04) 0%, transparent 70%)',
        }}
      />
      {/* Cyan accent */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 40% 30% at 80% 50%, rgba(0,229,255,0.025) 0%, transparent 65%)',
        }}
      />

      <div className="section-container relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-4 mb-16"
        >
          <span className="section-number">05</span>
          <span className="block w-8 h-px" style={{ background: 'rgba(0,255,136,0.3)' }} />
          <span
            className="font-mono text-xs tracking-[0.3em] uppercase"
            style={{ color: 'rgba(255,255,255,0.28)' }}
          >
            Contact
          </span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 lg:gap-24">
          {/* Left — info */}
          <div className="lg:col-span-2">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-display text-[clamp(2.5rem,5vw,3.5rem)] font-light leading-tight mb-8"
              style={{ color: 'rgba(255,255,255,0.9)' }}
            >
              Let's create<br />
              <span className="text-gradient-gold italic">something</span><br />
              extraordinary.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="font-body text-sm leading-loose mb-10"
              style={{ color: 'rgba(255,255,255,0.3)' }}
            >
              Ready to bring your vision to life? Whether it's architectural visualization,
              product renders, or cinematic experiences — I'd love to collaborate.
            </motion.p>

            {/* Contact info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="space-y-4 mb-10"
            >
              {[
                {
                  icon: '@',
                  label: 'vishwajeetkumar2019@gmail.com',
                  href: 'mailto:vishwajeetkumar2019@gmail.com',
                  color: '#00FF88',
                },
                {
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.13 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3 1.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  ),
                  label: '+91-9608975704',
                  href: 'tel:+919608975704',
                  color: '#00E5FF',
                },
                {
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  ),
                  label: 'Mumbai, India',
                  href: null,
                  color: '#00FF88',
                },
              ].map((item, i) => {
                const Tag = item.href ? 'a' : 'div';
                return (
                  <Tag
                    key={i}
                    href={item.href || undefined}
                    className="group flex items-center gap-3"
                    data-cursor={item.href ? '' : undefined}
                  >
                    <span
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-mono transition-all duration-300 group-hover:scale-110"
                      style={{
                        color: `${item.color}60`,
                        border: `1px solid ${item.color}14`,
                        background: `${item.color}05`,
                      }}
                    >
                      {item.icon}
                    </span>
                    <span
                      className="font-mono text-xs transition-colors duration-300 group-hover:text-white/68"
                      style={{ color: 'rgba(255,255,255,0.32)' }}
                    >
                      {item.label}
                    </span>
                  </Tag>
                );
              })}
            </motion.div>

            {/* Social links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <div
                className="font-mono text-[0.65rem] tracking-widest uppercase mb-5"
                style={{ color: 'rgba(0,255,136,0.28)' }}
              >
                Find me on
              </div>
              <div className="flex flex-col gap-3">
                {SOCIAL_LINKS.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 w-fit"
                    data-cursor
                  >
                    <span
                      className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300"
                      style={{
                        color: 'rgba(255,255,255,0.28)',
                        border: '1px solid rgba(0,255,136,0.07)',
                        background: 'transparent',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#00FF88';
                        e.currentTarget.style.background = 'rgba(0,255,136,0.07)';
                        e.currentTarget.style.borderColor = 'rgba(0,255,136,0.25)';
                        e.currentTarget.style.boxShadow = '0 0 16px rgba(0,255,136,0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'rgba(255,255,255,0.28)';
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.borderColor = 'rgba(0,255,136,0.07)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      {link.icon}
                    </span>
                    <div>
                      <div
                        className="font-mono text-xs leading-none mb-0.5 transition-colors duration-300 group-hover:text-neon"
                        style={{ color: 'rgba(255,255,255,0.48)' }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(0,255,136,0.9)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.48)'; }}
                      >
                        {link.label}
                      </div>
                      <div
                        className="font-mono text-[0.58rem]"
                        style={{ color: 'rgba(255,255,255,0.18)' }}
                      >
                        {link.desc}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right — form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-3"
          >
            <div
              className="p-8 rounded-2xl"
              style={{
                border: '1px solid rgba(0,255,136,0.08)',
                background: 'rgba(0,255,136,0.018)',
              }}
            >
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <InputField
                    label="Name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your name"
                  />
                  <InputField
                    label="Email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                  />
                </div>
                <InputField
                  label="Subject"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="What's this about?"
                />
                <InputField
                  label="Message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  multiline
                  placeholder="Tell me about your project..."
                />

                <div className="flex items-center gap-6 pt-2">
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="btn-cinematic btn-cinematic-primary flex items-center gap-2 disabled:opacity-50"
                    data-cursor
                  >
                    {status === 'sending' ? (
                      <>
                        <span
                          className="w-3 h-3 rounded-full border-t border-current animate-spin"
                          style={{ borderColor: 'rgba(0,255,136,0.6)', borderTopColor: '#00FF88' }}
                        />
                        Sending...
                      </>
                    ) : (
                      <>
                        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-3.5 h-3.5">
                          <path d="M14 2L2 8l5 3 2 5 5-14z" />
                        </svg>
                        Send Message
                      </>
                    )}
                  </button>

                  {status === 'success' && (
                    <motion.div
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-2"
                    >
                      <span
                        className="w-5 h-5 rounded-full flex items-center justify-center text-[0.6rem]"
                        style={{
                          background: 'rgba(0,255,136,0.12)',
                          border: '1px solid rgba(0,255,136,0.35)',
                          color: '#00FF88',
                          boxShadow: '0 0 12px rgba(0,255,136,0.2)',
                        }}
                      >
                        ✓
                      </span>
                      <span className="font-mono text-xs" style={{ color: '#00FF88' }}>
                        Message sent!
                      </span>
                    </motion.div>
                  )}
                  {status === 'error' && (
                    <motion.span
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="font-mono text-xs text-red-400"
                    >
                      ✗ Failed. Email directly.
                    </motion.span>
                  )}
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
