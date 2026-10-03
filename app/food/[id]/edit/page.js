// app/food/[id]/edit/page.js
// Server wrapper: resolves the route param (a Promise in Next 15) and hands the
// id to the client edit form, which loads the record and owns ownership checks.
import EditForm from "./EditForm.js";

export default async function EditPage({ params }) {
  const { id } = await params;
  return <EditForm id={id} />;
}
