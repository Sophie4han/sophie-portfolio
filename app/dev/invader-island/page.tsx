import { notFound } from "next/navigation";
import { InvaderIslandPreview } from "./InvaderIslandPreview";

export default function InvaderIslandPreviewPage() {
  if (process.env.NODE_ENV !== "development") notFound();

  return <InvaderIslandPreview />;
}
