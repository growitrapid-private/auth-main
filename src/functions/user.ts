import { DBAuthType } from "@/types/auth";
import { Response, ServerFunctionResponse } from "./functions";
import { WithId } from "mongodb";
import { matchPermissions } from "./auth";
import clientPromise from "@/db/db";
import { PermissionType } from "@/types/permissions";
import config from "@/config";

/**
 * Create a new user
 * May be created by an operator or by the user themselves through the signup page
 * If the user is created by an operator, then the user will be created with the status "active"
 * If the user is created by the user themselves, then the user will be created with the status "pending"
 * Also the user will be created with the role "user" and a payload of created user will be received through
 * parameter of this function
 */
export async function createUser(
  user: Partial<DBAuthType>
): Promise<ServerFunctionResponse<WithId<DBAuthType> | null>> {
  try {
    // Match permissions to get if the user has the permission to create user
    // If the user has the permission to create user, then create the user as active
    const t = await matchPermissions(["user_add"]);
    const { session, isMatched, matches } = t || {
      session: null,
      isMatched: false,
      matches: [] as PermissionType[],
    };
    const isCreatedFromOperator = matches.includes("user_add");

    const client = await clientPromise;
    const db = client.db(config.db.auth_name);
    const user_collection = db.collection<DBAuthType>("users");

    if (!user.email || user.email === "")
      return Response("error", null, 400, "Email is required");

    // Create a new user object
    const new_user: DBAuthType = {
      ...(user as DBAuthType),
      roles: ["user", ...(user.roles || [])],
      is_employee: false,
      status: user.status || (isCreatedFromOperator ? "active" : "pending"),
      createdAt: user.createdAt || new Date(),
    };

    // If user exists, then update the user
    // If user doesn't exist, then create a new user
    const result = await user_collection.updateOne(
      { email: user.email },
      { $set: new_user },
      { upsert: true }
    );

    // Get the user from the database
    const created_user = await user_collection.findOne({
      $or: [{ _id: result.upsertedId! }, { email: user.email }],
    });

    return Response("success", created_user);
  } catch (error) {
    console.error(error);
    return Response("error", null, 500, "Internal server error");
  }
}
