// components/FoodGrid.js
// Responsive editorial grid. Every card uses the same frame and the same height
// so the rows read as a tidy, symmetrical collection: three columns on desktop,
// two on tablet, one on mobile. Archive numbers reflect each food's position in
// the full collection, not the current filtered view.
import FoodCard from "./FoodCard.js";

function pad2(n) {
  return String(n).padStart(2, "0");
}

export default function FoodGrid({ entries, visible, language }) {
  // Position of every entry within the archive, for stable "01 / 08" numbers.
  const indexOf = {};
  entries.forEach((e, i) => {
    indexOf[e.id] = i;
  });
  const total = entries.length;

  if (visible.length === 0) return null;

  return (
    <div className="food-grid">
      {visible.map((entry) => (
        <FoodCard
          key={entry.id}
          entry={entry}
          number={`${pad2(indexOf[entry.id] + 1)} / ${pad2(total)}`}
          language={language}
        />
      ))}
    </div>
  );
}