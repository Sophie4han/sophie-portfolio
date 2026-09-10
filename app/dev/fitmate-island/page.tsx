import { notFound } from "next/navigation";
import { FitMateIslandPreview } from "./FitMateIslandPreview";

export default function FitMateIslandPreviewPage() {
  if (process.env.NODE_ENV !== "development") notFound();

  return <FitMateIslandPreview />;
}
