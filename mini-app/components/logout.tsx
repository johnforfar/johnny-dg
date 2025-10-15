"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export function Logout() {
  const { push } = useRouter();

  return (
    <Button
      onClick={() => {
        fetch("/xnode-auth/api/logout", { method: "POST" }).then(() =>
          push("/")
        );
      }}
    >
      Logout
    </Button>
  );
}
