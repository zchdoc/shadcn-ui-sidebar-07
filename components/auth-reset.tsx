"use client";

import { Button } from "@/components/ui/button";
import { clearAuth } from "@/lib/auth";
import { useAuth } from "@/components/auth-provider";
import { useRouter } from "next/navigation";

// import {Trash2} from 'lucide-react';

export function AuthReset() {
  const { setIsAuthenticated } = useAuth();
  const router = useRouter();

  const handleReset = () => {
    clearAuth();
    setIsAuthenticated(false);
    router.push("/login");
  };

  return (
    // <Trash2 onClick={handleReset}/>
    <Button variant="link" onClick={handleReset} size={"sm"} className={"h-4"}>
      Auth Reset
    </Button>
  );
}
