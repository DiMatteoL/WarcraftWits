import { Tables } from "@/types/database";
import { InstanceCard } from "./instance-card";

interface InstanceSelectorProps {
  instances: Tables<"instance">[];
  onInstanceChange: (instance: Tables<"instance"> | null) => void;
  correctInstanceId: string;
}

export function InstanceSelector({
  instances,
  onInstanceChange,
  correctInstanceId,
}: InstanceSelectorProps) {
  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
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
