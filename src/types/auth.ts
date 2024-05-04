/**
 * @file auth.ts
 * The typescript types for auth.
 *
 * Developed bt @NeuroNexul / Arif Sardar
 * @license MIT
 */
import { z } from "zod";
import { ObjectId } from "mongodb";
import { PermissionSchema, PermissionType, permissions } from "./permissions";

const PhoneSchema = z.object({
  countryCode: z.string(),
  number: z.string(),
  verified: z.boolean(),
});
type PhoneType = z.infer<typeof PhoneSchema>;

const AddressSchema = z.object({
  addressLine1: z.string(),
  addressLine2: z.string().optional(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  zipCode: z.string(),
});
type AddressType = z.infer<typeof AddressSchema>;

const SocialProfileSchema = z.object({
  name: z.string(),
  url: z.string(),
});
type SocialProfileType = z.infer<typeof SocialProfileSchema>;

const SavedContentSchema = z.object({
  ref: z.string(),
  type: z.enum(["post", "course", "service"]),
  createdAt: z.date(),
});
type SavedContentType = z.infer<typeof SavedContentSchema>;

const DefaultRoles = z.enum(["user", "operator"]);
type DefaultRolesType = z.infer<typeof DefaultRoles>;

const DBAuthSchema = z.object({
  // User Meta
  _id: z.union([z.instanceof(ObjectId), z.string()]),
  id: z.string(),
  roles: z.array(z.string()),
  is_employee: z.boolean(),
  status: z.enum(["active", "inactive", "blocked", "pending"]),
  createdAt: z.date(),

  // Basic User Info
  name: z.string().optional(),
  email: z.string().email(),
  username: z.string().optional(),
  image: z.string().url().optional(),
  bio: z.string().optional(),
  emailVerified: z.union([z.boolean(), z.date()]).optional(),

  // Extra User Info
  dob: z.date().optional(),
  gender: z.enum(["male", "female", "other", "not-specified"]).optional(),
  phone: PhoneSchema.optional(),
  extraEmails: z.array(z.string()).optional(),
  extraPhones: z.array(PhoneSchema).optional(),
  addresses: z.array(AddressSchema).optional(),
  socialProfiles: z.array(SocialProfileSchema).optional(),
  savedContent: z.array(SavedContentSchema).optional(),
});
type DBAuthType = z.infer<typeof DBAuthSchema>;

/**
 * Convert the permissions array to a zod object.
 *
 * Record<typeof permissions[number], z.boolean | z.optional>
 */
const FinalPermissionObj: Record<
  PermissionType,
  z.ZodOptional<z.ZodBoolean>
> = {} as any;
permissions.forEach((permission) => {
  FinalPermissionObj[permission] = z.boolean().optional();
});
const FinalPermissionSchema = z.object(FinalPermissionObj);
type FinalPermissionsType = z.infer<typeof FinalPermissionSchema>;

const AuthSchema = z.intersection(
  DBAuthSchema,
  z.object({
    roles: z.union([z.array(DefaultRoles), z.array(z.string())]),
    permissions: FinalPermissionSchema,
  })
);
type AuthType = z.infer<typeof AuthSchema>;

const RoleSchema = z.object({
  _id: z.union([z.instanceof(ObjectId), z.string()]),
  name: z.union([z.string(), DefaultRoles]),
  description: z.string(),
  rank: z.number(),
  permissions: z.array(PermissionSchema),
  createdAt: z.date(),
  updatedAt: z.date(),
  createdBy: z.string(),
  updatedBy: z.string(),
  status: z.enum(["active", "inactive"]),
});
type RoleType = z.infer<typeof RoleSchema>;

export {
  PhoneSchema,
  AddressSchema,
  SocialProfileSchema,
  SavedContentSchema,
  DefaultRoles,
  DBAuthSchema,
  AuthSchema,
  RoleSchema,
};

export type {
  PhoneType,
  AddressType,
  SocialProfileType,
  SavedContentType,
  DefaultRolesType,
  FinalPermissionsType,
  DBAuthType,
  AuthType,
  RoleType,
};
