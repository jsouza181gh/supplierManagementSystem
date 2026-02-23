"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function useAuthGuard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function validateToken() {
      const token = localStorage.getItem("token");

      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/users/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status !== 200) {
          localStorage.removeItem("token");
          router.replace("/login");
          return;
        }

        setLoading(false);
      } catch (error) {
        router.replace("/login");
      }
    }

    validateToken();
  }, [router]);

  return loading;
}