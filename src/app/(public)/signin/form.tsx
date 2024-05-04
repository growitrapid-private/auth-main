"use client";

import Image from "next/image";
import React from "react";
import { RocketIcon } from "@radix-ui/react-icons";
import { FcGoogle } from "react-icons/fc";
import { FaXTwitter, FaLinkedinIn } from "react-icons/fa6";

import logo from "@/assets/logo/logo_dark.svg";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { errorMessages, signinErrorMessages } from "./errors";

type Props = {
  error?: string;
};

export default function Form({ error }: Props) {
  let errorCode = error?.toLowerCase();
  let errorMessage = "";

  if (errorCode) {
    if (errorMessages[errorCode]) {
      errorMessage = errorMessages[errorCode];
    } else if (signinErrorMessages[errorCode]) {
      errorMessage = signinErrorMessages[errorCode];
    } else {
      errorMessage = "An error occurred. Please try again.";
    }
  }

  const [email, setEmail] = React.useState("");
  const [emailSent, setEmailSent] = React.useState(false);
  const [emailError, setEmailError] = React.useState<string | undefined>();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    signIn("email", {
      email,
      callbackUrl: "/",
      redirect: false,
    }).then((response) => {
      if (response?.error) {
        console.error(response.error);
        setEmailError(response.error);
      } else {
        setEmailSent(true);
      }
    });
  }

  return (
    <div className="min-h-dvh w-full p-8 grid place-items-center">
      <div className="max-w-96 w-full">
        {/* Logo */}
        <div className="flex justify-center">
          <Image src={logo} alt="Logo" className="h-8" height={32} />
        </div>

        {/* Form */}
        <div className="w-full mt-8 rounded-lg bg-foreground text-background p-4">
          <form onSubmit={handleSubmit}>
            <div>
              {/* Error Message */}
              {errorMessage && (
                <div className="p-2 text-sm text-center bg-red-200 text-red-800 rounded-md">
                  {errorMessage}
                </div>
              )}

              {/* Title */}
              <h2 className="text-2xl font-semibold">Sign in</h2>

              {/* Email Field */}
              {emailSent ? (
                <div className="min-h-[124px] grid place-items-center">
                  <p className="mt-2 text-sm font-medium">
                    A magic link has been sent to your email address. Click the
                    link to sign in.
                  </p>
                </div>
              ) : emailError ? (
                <div className="min-h-[124px] grid place-items-center">
                  <p className="mt-2 text-sm">
                    An error occurred. Please try again.
                    {/* Error Message */}
                    {emailError && (
                      <div className="mt-2 p-2 text-sm text-center bg-red-200 text-red-800 rounded-md">
                        {emailError}
                      </div>
                    )}
                  </p>
                </div>
              ) : (
                <div className="min-h-[124px]">
                  <p className="mt-2 text-sm">
                    Sign in with your email address to continue.
                  </p>
                  <Input
                    id="email"
                    type="email"
                    className="w-full bg-secondary-foreground focus-visible:ring-0 focus-visible:ring-offset-0 mt-2"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full mt-4 bg-transparent"
                    variant="outline"
                  >
                    <RocketIcon className="w-4 h-4 mr-2" />
                    Send Magic Link
                  </Button>
                </div>
              )}

              {/* OR */}
              <div className="flex items-center mt-4">
                <div className="flex-1 border-t border-secondary"></div>
                <div className="mx-4 text-sm">OR</div>
                <div className="flex-1 border-t border-secondary"></div>
              </div>

              {/* OAuth */}
              <div className="mt-4">
                <Button
                  className="w-full bg-transparent"
                  variant="outline"
                  onClick={() => {
                    signIn("google", {
                      callbackUrl: "/",
                      redirect: false,
                    });
                  }}
                >
                  <FcGoogle className="w-4 h-4 mr-2" />
                  Continue with Google
                </Button>
              </div>

              <div className="mt-4">
                <Button
                  className="w-full bg-transparent"
                  variant="outline"
                  onClick={() => {
                    signIn("linkedin", {
                      callbackUrl: "/",
                      redirect: false,
                    });
                  }}
                >
                  <FaLinkedinIn className="w-4 h-4 mr-2" />
                  Continue with LinkedIn
                </Button>
              </div>

              <div className="mt-4">
                <Button
                  className="w-full bg-transparent"
                  variant="outline"
                  onClick={() => {
                    signIn("twitter", {
                      callbackUrl: "/",
                      redirect: false,
                    });
                  }}
                >
                  <FaXTwitter className="w-4 h-4 mr-2" />
                  Continue with Twitter (X)
                </Button>
              </div>
            </div>
          </form>
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
  );
}
