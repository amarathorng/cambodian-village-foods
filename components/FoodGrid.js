// components/FoodGrid.js
// Responsive editorial grid: three columns on desktop, two on tablet, one on
// phone. Archive numbers follow the food's position in the full collection,
// not in the filtered view, and cards stagger in as the grid renders.
import FoodCard from "./FoodCard.js";

function pad2(value) {
  return String(value).padStart(2, "0");
}

export default function FoodGrid({ entries, visible, language }) {
  const indexOf = {};
  entries.forEach((entry, index) => {
    indexOf[entry.id] = index;
  });
  const total = entries.length;

  if (visible.length === 0) return null;

  return (
    <div className="food-grid">
      {visible.map((entry, index) => (
        <FoodCard
          key={entry.id}
          entry={entry}
          index={index}
          priority={index < 3}
          number={`${pad2(indexOf[entry.id] + 1)} / ${pad2(total)}`}
          language={language}
        />
      ))}
    </div>
  );
}
