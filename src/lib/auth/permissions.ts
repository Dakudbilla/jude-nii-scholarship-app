import { AuthContext } from "./middleware";

export type PermissionAction = "create_year" | "edit_year" | "review_applications" | "publish_awards" | "view_audit";

export function hasPermission(user: AuthContext, action: PermissionAction): boolean {
  if (user.role === "SUPER_ADMIN") return true;

  switch (action) {
    case "create_year":
    case "publish_awards":
    case "view_audit":
      return false; // Only SUPER_ADMIN
      
    case "edit_year":
    case "review_applications":
      return user.role === "ADMIN";
      
    default:
      return false;
  }
}
