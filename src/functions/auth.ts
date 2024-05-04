/**
 * @module @functions/auth
 *
 * Developed bt @NeuroNexul / Arif Sardar
 * @license MIT
 */
"use server";

import { nextAuthOptions } from "@/app/(apis)/api/auth/[...nextauth]/authOptions";
import { AuthType } from "@/types/auth";
import { PermissionType } from "@/types/permissions";
import { Session, getServerSession } from "next-auth";

/**
 * If returns null, then the user is not logged in
 * or, occoured an error
 */
export async function matchPermissions(permissions: PermissionType[]): Promise<{
  session: Session;
  matches: typeof permissions;
  isMatched: boolean;
  isFullyMatched: boolean;
} | null> {
  try {
    const session = await getServerSession(nextAuthOptions);
    if (!session) return null;

    const user = session.user;
    if (!user) return null;

    // Match permissions
    const matches = permissions.filter((permission) => {
      return user.permissions?.[permission] === true;
    });

    return {
      session,
      matches,
      isMatched: matches.length > 0,
      isFullyMatched: matches.length === permissions.length,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}
