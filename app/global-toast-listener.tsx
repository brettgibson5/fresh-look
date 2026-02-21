"use client";

import { useEffect, useMemo, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export function GlobalToastListener() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const lastHandled = useRef<string | null>(null);

  const queryString = useMemo(() => searchParams.toString(), [searchParams]);

  useEffect(() => {
    if (!queryString) {
      return;
    }

    const params = new URLSearchParams(queryString);
    const success = params.get("success");
    const error = params.get("error");
    const info = params.get("info");

    if (!success && !error && !info) {
      return;
    }

    const key = `${pathname}?${queryString}`;
    if (lastHandled.current === key) {
      return;
    }
    lastHandled.current = key;

    if (error) {
      toast.error(error);
    }

    if (success) {
      toast.success(success);
    }

    if (info) {
      toast(info);
    }

    params.delete("error");
    params.delete("success");
    params.delete("info");

    const nextQuery = params.toString();
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, {
      scroll: false,
    });
  }, [pathname, queryString, router]);

  return null;
}
