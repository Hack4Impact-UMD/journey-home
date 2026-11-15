import { UserData } from "@/types/user";

// Mirrors isVolunteer() in firestore.rules: the only accounts that may read live
// shifts and sign up for them.
export function isActiveVolunteer(user: UserData | null | undefined): boolean {
    return !!user
        && user.role === "Volunteer"
        && !user.disabled
        && !user.pending
        && user.emailVerified
        && !!user.signedWaiver;
}
