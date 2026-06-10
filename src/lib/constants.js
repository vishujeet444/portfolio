export const SITE = {
  name: 'Vishwajeet Kumar',
  title: '3D Cinematic Artist',
  tagline: 'Photorealistic rendering · Architectural visualization · Cinematic storytelling',
  location: 'Mumbai, India',
  year: 2026,
};

export const CONTACT = {
  email: 'vishwajeetkumar2019@gmail.com',
  phone: '+91-9608975704',
  phoneHref: 'tel:+919608975704',
};

export const NAV_LINKS = [
  { label: 'Home', href: '#hero', id: 'hero' },
  { label: 'Works', href: '#works', id: 'works' },
  { label: '3D Lab', href: '#lab', id: 'lab' },
  { label: 'About', href: '#about', id: 'about' },
  { label: 'Skills', href: '#skills', id: 'skills' },
  { label: 'Experience', href: '#experience', id: 'experience' },
  { label: 'Contact', href: '#contact', id: 'contact' },
];

export const SOCIAL_LINKS = [
  {
    label: 'ArtStation',
    short: 'AS',
    href: 'https://www.artstation.com/vishwajeetkumar684',
    desc: 'View 3D portfolio',
  },
  {
    label: 'LinkedIn',
    short: 'LI',
    href: 'https://www.linkedin.com/in/vishwajeet-kumar-811949217',
    desc: 'Connect professionally',
  },
  {
    label: 'Instagram',
    short: 'IG',
    href: 'https://www.instagram.com/vishu_u___13',
    desc: 'Behind the scenes',
  },
];

export function scrollToSection(href) {
  const el = document.querySelector(href);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}
