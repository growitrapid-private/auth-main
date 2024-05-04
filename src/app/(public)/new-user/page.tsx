import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";
import LoginPattern from "@/assets/login_image.svg";
import logo from "@/assets/logo/logo_dark.svg";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type Props = {
  searchParams: {
    callbackUrl?: string;
  };
};

export default function newUserPage({ searchParams: { callbackUrl } }: Props) {
  return (
    <ScrollArea className="relative h-full w-full">
      {/* Glow */}
      <div className="absolute top-0 left-0 z-0 w-0 h-0 bg-white gredient-glow" />

      {/* Form */}
      <div className="relative z-10 w-full gri d place-items-center">
        <div className="min-h-dvh w-full lg:w-1/2 transition-all duration-300">
          <div className="min-h-dvh w-full p-8 grid place-items-center">
            <div className="max-w-96 w-full">
              {/* Logo */}
              <div className="flex justify-center">
                <Image src={logo} alt="Logo" className="h-8" height={32} />
              </div>

              {/* Welcome Section */}
              <div className="w-full p-4 mt-8 rounded-lg bg-background/20 border border-[#67c1c140] backdrop-blur-sm shadow-[0_0_2rem_0_#67c1c140]">
                <div className="text-center">
                  <h1 className="text-2xl font-semibold">
                    Welcome to GrowITRapid
                  </h1>
                  <p className="mt-2 text-sm">
                    GrowITRapid is a platform that helps you to grow your
                    business and reach your goals faster.
                  </p>

                  {/* Navigation */}
                  <Button variant="default" asChild className="w-full mt-8">
                    <Link href="https://www.growitrapid.com">
                      Go to GrowITRapid
                    </Link>
                  </Button>

                  {callbackUrl && (
                    <Button
                      variant="outline"
                      asChild
                      className="w-full mt-2 bg-transparent"
                    >
                      <Link href={callbackUrl}>Go Back to Origin</Link>
                    </Button>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="mt-4 text-sm text-center">
                <Link
                  href="https://www.growitrapid.com/terms-policy/privacy-policy"
                  target="_blank"
                >
                  Privacy Policy
                </Link>
                <span className="mx-2">•</span>
                <Link
                  href="https://www.growitrapid.com/terms-policy/terms-of-use"
                  target="_blank"
                >
                  Terms of Use
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Image */}
      <div
        className={cn(
          "absolute z-20 w-full lg:w-3/5 h-full top-0 right-0",
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
