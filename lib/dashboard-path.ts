/**
 * Where a user lands after authenticating. Shared by the login modal and the
 * change-password page so the two never disagree about a role's home.
 */
export function dashboardPathForRole(role?: string): string {
  switch (role) {
    case "Admin":
      return "/currentUser";
    case "Teacher":
      return "/teacher";
    case "Student":
      return "/students";
    default:
      return "/";
  }
}
