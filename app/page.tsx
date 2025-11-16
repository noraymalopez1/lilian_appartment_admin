"use client";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const page = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace("/add-listing")
  }, [])
  return (
    <div>
      <Loader2 className="size-10 animate-spin" />
    </div>
  );
};

export default page;
