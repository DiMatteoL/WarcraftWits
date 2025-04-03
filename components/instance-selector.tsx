import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Tables } from "@/types/database";

interface InstanceSelectorProps {
  instances: Tables<"instance">[];
  selectedInstance: Tables<"instance"> | null;
  onInstanceChange: (instance: Tables<"instance"> | null) => void;
}

export function InstanceSelector({
  instances,
  selectedInstance,
  onInstanceChange,
}: InstanceSelectorProps) {
  return (
    <Select
      value={selectedInstance?.id.toString() || "none"}
      onValueChange={(value) => {
        if (value === "none") {
          onInstanceChange(null);
        } else {
          const instance = instances.find((i) => i.id.toString() === value);
          onInstanceChange(instance || null);
        }
      }}
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select instance" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="none">None</SelectItem>
        {instances.map((instance) => (
          <SelectItem key={instance.id} value={instance.id.toString()}>
            {instance.name} (Level {instance.min_level}-{instance.max_level})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
