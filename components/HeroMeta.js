// components/HeroMeta.js
// The small archive facts under the hero buttons. Only real numbers are shown:
// the published entry count and the number of distinct recorded places.
import { formatCount } from "./hero-copy.js";

export default function HeroMeta({ tUI, language, count = 0, places = 0 }) {
  return (
    <dl className="hero-meta">
      {count > 0 && (
        <div>
          <dt>{tUI.foodsLabel}</dt>
          <dd>
            <strong>{formatCount(count, language)}</strong>
            {tUI.foodsUnit}
          </dd>
        </div>
      )}
      {places > 0 && (
        <div>
          <dt>{tUI.placesLabel}</dt>
          <dd>
            <strong>{formatCount(places, language)}</strong>
            {tUI.placesUnit}
          </dd>
        </div>
      )}
      <div>
        <dt>{tUI.languagesLabel}</dt>
        <dd>{tUI.languagesValue}</dd>
      </div>
    </dl>
  );
}
