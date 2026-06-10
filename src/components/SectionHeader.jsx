export default function SectionHeader({ number, label, title, titleAccent, accentClass = 'text-gradient-luxury' }) {
  return (
    <div data-reveal className="mb-16 md:mb-20">
      <div className="flex items-center gap-4 mb-6">
        <span className="section-number">{number}</span>
        <span className="section-connector" />
        <span className="type-label">{label}</span>
      </div>
      <h2 className="type-section max-w-4xl">
        {title}
        {titleAccent && (
          <>
            <br />
            <span className={`type-section-accent ${accentClass}`}>{titleAccent}</span>
          </>
        )}
      </h2>
    </div>
  );
}
