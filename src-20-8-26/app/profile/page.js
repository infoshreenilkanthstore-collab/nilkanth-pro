"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Profile from "../../components/Profile";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const phone = localStorage.getItem("ns_userPhone");
    setUser(phone);
    if (!phone) {
      router.replace("/");
    }
  }, [router]);

  return <Profile />;
}