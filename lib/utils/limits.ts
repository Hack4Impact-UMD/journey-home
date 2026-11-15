// Keep these in step with the caps in firestore.rules and storage.rules. The
// forms enforce them so a user hits a visible stop instead of a permission-denied
// they can't interpret. They are deliberately generous — the point is to keep a
// document well under Firestore's 1 MiB ceiling, not to ration what people write.

export const MAX_NAME = 200;
export const MAX_TITLE = 500;
export const MAX_SHORT_TEXT = 2000;
export const MAX_NOTES = 20000;
export const MAX_EMAIL = 320;

// Volunteer groups per shift. firestore.rules checks each group slot by hand because
// rules cannot loop, so raising this means adding slots there too.
export const MAX_VOLUNTEER_GROUPS = 5;

export const MAX_PHOTO_BYTES = 10 * 1024 * 1024;
export const MAX_WAIVER_BYTES = 20 * 1024 * 1024;

// Rules accept a client timestamp within 10 minutes of server time. Warn earlier
// than that so a drifting clock is fixable before it starts costing people work.
export const CLOCK_SKEW_WARN_MS = 5 * 60 * 1000;

export function formatBytes(bytes: number): string {
    return `${(bytes / (1024 * 1024)).toFixed(0)}MB`;
}

// Last skew measured by getClockSkewMs, so error messages can say whether a bad
// clock is a plausible cause instead of guessing.
let lastSkewMs: number | null = null;

export function clockLooksWrong(): boolean {
    return lastSkewMs !== null && Math.abs(lastSkewMs) > CLOCK_SKEW_WARN_MS;
}

// Positive means the device clock is ahead of the server. Returns null when the
// server time can't be read — that is not itself worth reporting to the user.
export async function getClockSkewMs(): Promise<number | null> {
    try {
        const res = await fetch(window.location.origin, { method: "HEAD", cache: "no-store" });
        const serverDate = res.headers.get("date");
        if (!serverDate) return null;
        const serverMs = new Date(serverDate).getTime();
        if (Number.isNaN(serverMs)) return null;
        lastSkewMs = Date.now() - serverMs;
        return lastSkewMs;
    } catch {
        return null;
    }
}
