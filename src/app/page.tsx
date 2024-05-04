"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function Home() {
  const { data: session, status } = useSession();

  return (
    <main className="p-24">
      <div className="flex flex-row justify-center items-center gap-4">
        <Button onClick={() => signOut()}>Sign Out</Button>

        {/* All Links */}
        <Link href="/signin">Sign In</Link>
        <Link href="/new-user">New User</Link>
        <Link href="/profile">Profile</Link>
      </div>

      <div className="mt-8 border rounded-md p-4">
        <h2>Session</h2>
        <ScrollArea className="h-96 w-full">
          <pre>{JSON.stringify(session, null, 2)}</pre>
        </ScrollArea>
      </div>
    </main>
  );
}
