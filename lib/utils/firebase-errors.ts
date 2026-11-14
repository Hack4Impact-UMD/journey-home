import { MAX_PHOTO_BYTES, formatBytes } from "./limits";

// Turns a Firestore/Storage failure into something a user can act on. Every save
// path should surface one of these rather than failing quietly.
export function writeErrorMessage(e: unknown): string {
    const code = (e as { code?: string })?.code ?? "";

    switch (code) {
        case "permission-denied":
            return "The server rejected this save. If your device's date and time are wrong, correct them and try again.";
        case "unavailable":
        case "storage/retry-limit-exceeded":
            return "We couldn't reach the server. Check your connection and try again.";
        case "storage/unauthorized":
            return `A photo was rejected. Images must be under ${formatBytes(MAX_PHOTO_BYTES)}.`;
        case "storage/quota-exceeded":
            return "The storage limit has been reached. Please contact Journey Home.";
        case "unauthenticated":
            return "Your session expired. Please log in again.";
        default:
            return "Something went wrong. Please try again, and let Journey Home know if it keeps happening.";
    }
}
