import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[80vh] py-12 px-4 text-center">
      <h1 className="mb-6">Expansion Not Found</h1>
      <p className="text-muted-foreground text-lg mb-8 max-w-md">
        The expansion you&apos;re looking for doesn&apos;t exist or has been removed from the game.
      </p>
      <Link href="/">
        <Button>Return to Azeroth</Button>
      </Link>
    </div>
  )
}
