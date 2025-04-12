import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Tables } from "@/types/database";

interface ExpansionSelectorProps {
  expansions: Tables<"expansion">[];
  currentExpansion: string;
  onExpansionChange: (expansionSlug: string) => void;
}

export function ExpansionSelector({
  expansions,
  currentExpansion,
  onExpansionChange,
}: ExpansionSelectorProps) {
  return (
    <Select
      value={currentExpansion}
      onValueChange={onExpansionChange}
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select expansion" />
      </SelectTrigger>
      <SelectContent>
        {expansions.map((expansion) => (
          <SelectItem key={expansion.id} value={expansion.slug || ""}>
            {expansion.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
