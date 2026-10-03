// components/FoodGrid.js
// Responsive editorial grid. On a 3-column desktop layout the first visible
// card becomes a "featured" card spanning two columns; on tablet it stays two
// columns and on mobile it stacks to one. Archive numbers reflect each food's
// position in the full collection, not the current filtered view.
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

  const makeProps = (entry) => ({
    entry,
    number: `${pad2(indexOf[entry.id] + 1)} / ${pad2(total)}`,
    total,
    language,
  });

  if (visible.length === 0) return null;

  const featured = visible[0];
  const rest = visible.slice(1);

  return (
    <div className="food-grid">
      <div className="food-grid-featured">
        <FoodCard {...makeProps(featured)} featured />
      </div>
      {rest.map((entry) => (
        <FoodCard key={entry.id} {...makeProps(entry)} />
      ))}
    </div>
  );
}