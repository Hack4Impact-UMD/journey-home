import { TimeBlock, RecurrenceRule, RecurrenceFrequency } from "@/types/schedule";
import { Timestamp } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";


export function isInSeries(tb: TimeBlock, allTB: TimeBlock[]): boolean {
    return allTB.some((other) => other.id !== tb.id && other.seriesId === tb.seriesId);
}

export function getSeriesLeader(tb: TimeBlock, allTB: TimeBlock[]): TimeBlock {
    return allTB
        .filter((other) => other.seriesId === tb.seriesId)
        .reduce((oldest, other) => other.startTime.toMillis() < oldest.startTime.toMillis() ? other : oldest, tb);
}

function getClockTime(d: Date):{h: number;m:number} {
    return {h: d.getHours(), m: d.getMinutes()}
}

function applyClockTime(date: Date, h: number, m:number):Date {
    const newDate = new Date(date.getTime());
    newDate.setHours(h, m, 0, 0);
    return newDate;
}

function addOccurenceDate(baseDate: Date, frequency: RecurrenceFrequency, stepIndex: number): Date | null {
    const base = new Date(baseDate.getTime())
    base.setHours(0,0,0,0);
    switch(frequency) {
        case "daily":
            return new Date(base.getFullYear(), base.getMonth(), base.getDate() + stepIndex);
        case "weekly":
            return new Date(base.getFullYear(), base.getMonth(), base.getDate() + stepIndex * 7);
        case "biweekly":
            return new Date(base.getFullYear(), base.getMonth(), base.getDate() + stepIndex * 14);
        case "monthly":
            const c = new Date(base.getFullYear(), base.getMonth() + stepIndex, base.getDate());
            return c.getDate() === base.getDate() ? c : null;
        default:
            return null
    }
}

export function generateSeries(template: TimeBlock, rule:RecurrenceRule): {occurences: TimeBlock[]; truncated: boolean} {
    const seriesId = uuidv4();
    const untilDate = rule.until.toDate()
    const baseDate = template.startTime.toDate()

    const {h: startH, m: startM} = getClockTime(baseDate)
    const {h: endH, m: endM} = getClockTime(template.endTime.toDate())
    const occurences: TimeBlock[] = []
    const MAX_ITERATIONS = 500
    let truncated = true

    for(let stepIndex = 0; stepIndex < MAX_ITERATIONS; stepIndex ++) {
        const occDate = addOccurenceDate(baseDate, rule.frequency, stepIndex);
        if(occDate === null) {
            continue;
        }
        if(occDate > untilDate) {
            truncated = false;
            break;
        }

        const start = applyClockTime(occDate, startH, startM);
        const end = applyClockTime(occDate, endH, endM);

        occurences.push({
            ...template,
            id: stepIndex === 0 ? template.id : uuidv4(),
            seriesId,
            recurrence: rule,
            startTime: Timestamp.fromDate(start),
            endTime: Timestamp.fromDate(end),
            volunteerGroups: stepIndex === 0
                ? template.volunteerGroups
                : template.volunteerGroups.map((g) => ({...g, volunterIDs: []})),
            tasks: stepIndex === 0 ? template.tasks : [],
        });
    }

    return {occurences, truncated}

}

export function getFollowingInSeries(tb: TimeBlock, allTB: TimeBlock[]): TimeBlock[] {
    return allTB.filter((other) =>
        other.seriesId === tb.seriesId && other.startTime.toMillis() >= tb.startTime.toMillis()
    );
}

export function dayDiff(from: Date, to: Date): number {
    const a = new Date(from.getFullYear(), from.getMonth(), from.getDate());
    const b = new Date(to.getFullYear(), to.getMonth(), to.getDate());
    return Math.round((b.getTime() - a.getTime()) / 86400000);
}

export function applyEditToSeries(edited: TimeBlock, original: TimeBlock, targets: TimeBlock[], seriesId: string): TimeBlock[] {
    const {h: startH, m: startM} = getClockTime(edited.startTime.toDate())
    const {h: endH, m: endM} = getClockTime(edited.endTime.toDate())

    const editedDate = edited.startTime.toDate();
    const originalDate = original.startTime.toDate();
    const dayOffset = dayDiff(originalDate, editedDate);
    const monthly = edited.recurrence?.frequency === "monthly";
    const monthOffset = (editedDate.getFullYear() - originalDate.getFullYear()) * 12
        + (editedDate.getMonth() - originalDate.getMonth());

    return targets.map((target) => {
        const targetDate = target.startTime.toDate();
        let shifted: Date;
        if (monthly) {
            const lastDay = new Date(targetDate.getFullYear(), targetDate.getMonth() + monthOffset + 1, 0).getDate();
            shifted = new Date(targetDate.getFullYear(), targetDate.getMonth() + monthOffset, Math.min(editedDate.getDate(), lastDay));
        } else {
            shifted = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate() + dayOffset);
        }
        return {
            ...edited,
            id: target.id,
            seriesId,
            tasks: target.tasks,
            startTime: Timestamp.fromDate(applyClockTime(shifted, startH, startM)),
            endTime: Timestamp.fromDate(applyClockTime(shifted, endH, endM)),
            volunteerGroups: edited.volunteerGroups.map((g) => {
                const existing = target.volunteerGroups.find((tg) => tg.name === g.name);
                return {...g, volunterIDs: existing ? existing.volunterIDs : []};
            }),
        };
    });
}