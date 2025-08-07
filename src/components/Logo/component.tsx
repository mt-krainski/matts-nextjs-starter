import { Pencil } from "lucide-react";
import { authCopy } from "@/lib/copy";

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <Pencil className="h-6 w-6" />
      <span className="text-xl font-bold">{authCopy.companyName}</span>
    </div>
  );
}
