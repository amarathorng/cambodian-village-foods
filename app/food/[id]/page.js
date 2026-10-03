// app/food/[id]/page.js
// Server wrapper: resolves the route param (a Promise in Next 15) and hands the
// id to the client-side detail component, which loads the record from the
// existing /api/entries endpoint.
import FoodDetail from "./FoodDetail.js";

export default async function FoodPage({ params }) {
  const { id } = await params;
  return <FoodDetail id={id} />;
}