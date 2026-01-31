import { Tables } from "@/types/database";
import { InstanceCard } from "./instance-card";

interface InstanceSelectorProps {
  instances: Tables<"ww_instance">[];
  onInstanceChange: (instance: Tables<"ww_instance"> | null) => void;
  correctInstanceId: number | null;
}

export function InstanceSelector({
  instances,
  onInstanceChange,
  correctInstanceId,
}: InstanceSelectorProps) {
  return (
    <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-fr">
      {instances.map((instance) => (
        <InstanceCard
          key={instance.id}
          instance={instance}
          onInstanceSelect={onInstanceChange}
          correctInstanceId={correctInstanceId}
        />
      ))}
    </div>
  );
}
