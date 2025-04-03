import Image from "next/image";
import type { Tables } from "@/types/database";

type MapWithRelations = Tables<"map"> & {
  pin: (Tables<"pin"> & {
    instance: Tables<"instance"> | null;
  })[];
};

interface MapProps {
  map: MapWithRelations | null;
  selectedInstance: Tables<"instance"> | null;
}

export function Map({ map, selectedInstance }: MapProps) {
  if (!map?.uri) {
    return (
      <div className="w-full h-[600px] bg-muted rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground">No map available</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[600px] relative rounded-lg overflow-hidden bg-muted">
      <Image
        src={map.uri}
        alt={map.name || "Map"}
        fill
        className="object-contain"
      />
      {map.pin.map((pin) => (
        <div
          key={pin.id}
          className={`absolute w-4 h-4 rounded-full cursor-pointer transition-colors ${
            pin.instance?.id === selectedInstance?.id
              ? "bg-blue-500"
              : "bg-red-500"
          }`}
          style={{
            left: `${pin.x}%`,
            top: `${pin.y}%`,
          }}
        />
      ))}
    </div>
  );
}
