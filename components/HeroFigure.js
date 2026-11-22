// components/HeroFigure.js
// The dominant archive photograph, a small inset of a second real photograph,
// a gold woven motif, and a caption. Images are sized to reserve space and
// avoid layout shift while they load.
export default function HeroFigure({
  image,
  alt,
  insetAlt = "fish and rice noodles in a bowl with herbs and vegetables",
  captionName,
  captionSub,
}) {
  return (
    <figure className="hero-figure">
      <span className="hero-motif" aria-hidden="true">
        <span style={{ width: 26 }} />
        <span style={{ width: 18 }} />
        <span style={{ width: 10 }} />
      </span>

      <div className="hero-frame">
        <img
          className="hero-image"
          src="/images/Num-Banh-Chok-Khmer.jpg"
          alt={alt}
          width={768}
          height={564}
          fetchPriority="high"
        />
        <img
          className="hero-inset"
          src="/images/nom-banh-chok.jpg"
          alt={insetAlt}
          aria-hidden="true"
          width={515}
          height={388}
          loading="lazy"
        />
      </div>

      <figcaption className="hero-caption">
        <span className="hero-caption-name">{captionName}</span>
        <span className="hero-caption-sub">{captionSub}</span>
      </figcaption>
    </figure>
  );
}
