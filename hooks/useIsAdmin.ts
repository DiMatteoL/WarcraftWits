import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/contexts/supabase-context";

export function useIsAdmin() {
  const router = useRouter();
  const supabase = useSupabase();

  useEffect(() => {
    async function checkAdmin() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user || user.email !== "luca7dimatteo@gmail.com") {
        router.push("/sign-in");
      }
    }

    checkAdmin();
  }, [supabase, router]);
}
