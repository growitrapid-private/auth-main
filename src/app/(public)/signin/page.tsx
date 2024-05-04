import { nextAuthOptions } from "@/app/(apis)/api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";
import Form from "./form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import LoginPattern from "@/assets/login_image.svg";
import Image from "next/image";

type Props = {
  searchParams: {
    callbackUrl?: string;
    error?: string;
    verify_request?: string;
  };
};

export default async function page({
  searchParams: { callbackUrl, error, verify_request },
}: Props) {
  const session = await getServerSession(nextAuthOptions);

  if (session?.user) {
    // Redirect to the original URL
    return redirect(callbackUrl || "/");
  }

  return (
    <ScrollArea className="relative h-full w-full">
      {/* Glow */}
      <div className="absolute top-0 left-0 z-0 w-0 h-0 bg-white gredient-glow" />

      {/* Form */}
      <div className="relative z-10 w-full">
        <div className="min-h-dvh w-full lg:w-1/2 transition-all duration-300">
          <Form error={error} />
        </div>
      </div>

      {/* Background Image */}
      <div
        className={cn(
          "absolute z-0 w-full lg:w-3/5 h-full top-0 right-0",
          "bg-center bg-cover bg-no-repeat",
          "bg-background",
          "[clip-path:_polygon(0_0,_100%_0%,_100%_100%,_0%_100%)]",
          "lg:[clip-path:_polygon(21%_0,_100%_0%,_100%_100%,_0%_100%)]"
        )}
      >
        <div className="relative w-full h-full">
          <Image
            src={LoginPattern}
            alt="Login Pattern"
            layout="fill"
            objectFit="cover"
            objectPosition="center"
            className="absolute z-0 w-full h-full"
          />

          {/* Gradient */}
          <div className="absolute z-10 w-full h-full bg-background/60">
            <div className="absolute top-0 right-0 z-0 w-0 h-0 gredient-glow ![--glow-color:#00000070]" />
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
