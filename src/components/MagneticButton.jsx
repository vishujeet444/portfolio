import useMagnetic from '../hooks/useMagnetic';

export default function MagneticButton({
  children,
  className = '',
  variant = 'glass',
  href,
  onClick,
  type = 'button',
  ...props
}) {
  const ref = useMagnetic(0.28);
  const classes = `btn-luxury ${variant === 'primary' ? 'btn-luxury-primary' : 'btn-luxury-glass'} ${className}`;

  if (href) {
    return (
      <a ref={ref} href={href} className={classes} onClick={onClick} data-cursor {...props}>
        <span className="btn-luxury-sweep" aria-hidden />
        {children}
      </a>
    );
  }

  return (
    <button ref={ref} type={type} className={classes} onClick={onClick} data-cursor {...props}>
      <span className="btn-luxury-sweep" aria-hidden />
      {children}
    </button>
  );
}
