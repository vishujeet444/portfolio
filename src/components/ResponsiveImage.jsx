/**
 * Responsive picture element (Vite/React — not next/image).
 * Pass mobile/tablet/desktop URLs or a single src with width hints.
 */
export default function ResponsiveImage({
  src,
  alt,
  className = '',
  sizes = '(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw',
  mobileSrc,
  tabletSrc,
  desktopSrc,
  loading = 'lazy',
  decoding = 'async',
  onLoad,
  onError,
}) {
  const mobile = mobileSrc || src;
  const tablet = tabletSrc || src;
  const desktop = desktopSrc || src;

  return (
    <picture>
      {desktop && desktop !== mobile && (
        <source media="(min-width: 1440px)" srcSet={desktop} />
      )}
      {tablet && tablet !== mobile && (
        <source media="(min-width: 768px)" srcSet={tablet} />
      )}
      <img
        src={mobile}
        srcSet={
          mobile !== desktop
            ? `${mobile} 768w, ${tablet} 1024w, ${desktop} 1600w`
            : undefined
        }
        sizes={sizes}
        alt={alt}
        className={className}
        loading={loading}
        decoding={decoding}
        onLoad={onLoad}
        onError={onError}
      />
    </picture>
  );
}
