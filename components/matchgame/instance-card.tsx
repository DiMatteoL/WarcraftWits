import { Tables } from "@/types/database";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Check, X } from "lucide-react";
import { useState, useEffect } from "react";

interface InstanceCardProps {
  instance: Tables<"instance">;
  onInstanceSelect: (instance: Tables<"instance"> | null) => void;
  correctInstanceId: number | null;
}

export function InstanceCard({
  instance,
  onInstanceSelect,
  correctInstanceId,
}: InstanceCardProps) {
  const [animationState, setAnimationState] = useState<'success' | 'fail' | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (animationState) {
      const timer = setTimeout(() => {
        setAnimationState(null);
        // Trigger onInstanceSelect after animation completes
        onInstanceSelect(instance);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [animationState, onInstanceSelect, instance]);

  const handleClick = (instance: Tables<"instance">) => {
    if (String(instance.id) === String(correctInstanceId)) {
      setAnimationState('success');
    } else {
      setAnimationState('fail');
    }
  };

  return (
    <div
      key={instance.id}
      className="w-full h-full flex"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card
        className={cn(
          "w-full h-full flex flex-col relative cursor-pointer overflow-hidden transition-all duration-300",
          "hover:shadow-lg hover:scale-[1.02]",
          isHovered && "ring-2 ring-primary/50",
          animationState === 'success' && "bg-green-500/20 shadow-green-500/50",
          animationState === 'fail' && "bg-red-500/20 shadow-red-500/50"
        )}
        onClick={() => handleClick(instance)}
      >
        <div className="aspect-[4/3] relative flex-shrink-0">
          {instance.backgroud_uri && (
            <Image
              src={instance.backgroud_uri}
              alt={instance.name || "Instance background"}
              fill
              className={cn(
                "object-cover transition-all duration-300",
                isHovered && "scale-105",
                animationState && "brightness-50"
              )}
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
            />
          )}
          {animationState === 'success' && (
            <div className="absolute inset-0 flex items-center justify-center animate-in zoom-in-50 duration-300">
              <div className="bg-green-500/20 p-4 rounded-full animate-in zoom-in-50 duration-300">
                <Check className="w-16 h-16 text-white animate-in zoom-in-50 duration-300" />
              </div>
            </div>
          )}
          {animationState === 'fail' && (
            <div className="absolute inset-0 flex items-center justify-center animate-in zoom-in-50 duration-300">
              <div className="bg-red-500/20 p-4 rounded-full animate-in zoom-in-50 duration-300">
                <X className="w-16 h-16 text-white animate-in zoom-in-50 duration-300" />
              </div>
            </div>
          )}
        </div>
        <div className={cn(
          "p-3 bg-card transition-all duration-300 flex-shrink-0",
          animationState === 'success' && "bg-green-600/20",
          animationState === 'fail' && "bg-red-600/20"
        )}>
          <h3 className="font-semibold truncate">{instance.name}</h3>
          {instance.slug && (
            <p className="text-sm text-muted-foreground truncate">
              {instance.slug}
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}
