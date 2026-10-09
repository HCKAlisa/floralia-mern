const MAX_SCREENSHOT_BYTES = 2 * 1024 * 1024;
const MAX_BASE64_LENGTH = Math.ceil(MAX_SCREENSHOT_BYTES / 3) * 4;

export interface BugReportContextInput {
    capturedAt: string;
    buildVersion: string;
    platform: string;
    language: string;
    scene: string;
    page?: string;
    room: string;
    day?: number;
    season: string;
    dayPhase: string;
    timelineDay?: number;
    timelinePosition: string[];
    conversation?: string;
    nodeId?: string;
    sessionPlaySeconds: number;
}

export interface ValidatedBugReport {
    description: string;
    context: BugReportContextInput;
    screenshot?: Buffer;
}

const BODY_KEYS = new Set(['description', 'context', 'screenshot']);
const CONTEXT_KEYS = new Set([
    'capturedAt', 'buildVersion', 'platform', 'language', 'scene', 'page', 'room', 'day',
    'season', 'dayPhase', 'timelineDay', 'timelinePosition', 'conversation', 'nodeId',
    'sessionPlaySeconds',
]);
const ISO_DATE_TIME = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,9})?(?:Z|[+-]\d{2}:\d{2})$/;
const BASE64 = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;

function isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function onlyKeys(value: Record<string, unknown>, allowed: Set<string>): boolean {
    return Object.keys(value).every(key => allowed.has(key));
}

function boundedString(value: unknown, maximum: number, allowEmpty = false): value is string {
    return typeof value === 'string' && value.length <= maximum && (allowEmpty || value.trim().length > 0);
}

function optionalString(value: unknown, maximum: number): value is string | undefined {
    return value === undefined || boundedString(value, maximum, true);
}

function optionalInteger(value: unknown): value is number | undefined {
    return value === undefined || (Number.isSafeInteger(value) && (value as number) >= 0 && (value as number) <= 1_000_000);
}

const START_OF_FRAME_MARKERS = new Set([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf]);

function hasJpegStructure(value: Buffer): boolean {
    if (value.length < 4 || value[0] !== 0xff || value[1] !== 0xd8) return false;
    let offset = 2;
    let sawFrame = false;
    let sawQuantizationTable = false;
    let sawCodingTable = false;
    let sawScan = false;

    while (offset < value.length) {
        if (value[offset] !== 0xff) return false;
        while (offset < value.length && value[offset] === 0xff) offset += 1;
        if (offset >= value.length) return false;
        const marker = value[offset++];
        if (marker === 0xd9) return sawFrame && sawQuantizationTable && sawCodingTable && sawScan && offset === value.length;
        if (marker === 0x00 || marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)
            || offset + 2 > value.length) return false;

        const segmentLength = value.readUInt16BE(offset);
        if (segmentLength < 2 || offset + segmentLength > value.length) return false;
        if (marker === 0xdb) {
            if (segmentLength < 67) return false;
            sawQuantizationTable = true;
        } else if (marker === 0xc4 || marker === 0xcc) {
            if (segmentLength < 4) return false;
            sawCodingTable = true;
        } else if (START_OF_FRAME_MARKERS.has(marker)) {
            if (segmentLength < 11) return false;
            const components = value[offset + 7];
            const height = value.readUInt16BE(offset + 3);
            const width = value.readUInt16BE(offset + 5);
            if (components === 0 || segmentLength !== 8 + 3 * components
                || width === 0 || height === 0 || width > 4096 || height > 4096
                || width * height > 8_000_000) return false;
            sawFrame = true;
        } else if (marker === 0xda) {
            if (!sawFrame || segmentLength < 8) return false;
            const components = value[offset + 2];
            if (components === 0 || segmentLength !== 6 + 2 * components) return false;
            sawScan = true;
            offset += segmentLength;
            let hasEntropyData = false;
            while (offset < value.length) {
                if (value[offset] !== 0xff) {
                    hasEntropyData = true;
                    offset += 1;
                    continue;
                }
                const markerStart = offset;
                while (offset < value.length && value[offset] === 0xff) offset += 1;
                if (offset >= value.length) return false;
                const scanMarker = value[offset];
                if (scanMarker === 0x00 || (scanMarker >= 0xd0 && scanMarker <= 0xd7)) {
                    hasEntropyData = true;
                    offset += 1;
                    continue;
                }
                if (!hasEntropyData) return false;
                offset = markerStart;
                break;
            }
            continue;
        }
        offset += segmentLength;
    }
    return false;
}

function decodeJpeg(value: unknown): Buffer | undefined | null {
    if (value === undefined || value === null || value === '') return undefined;
    if (typeof value !== 'string' || value.length > MAX_BASE64_LENGTH || !BASE64.test(value)) return null;
    const decoded = Buffer.from(value, 'base64');
    if (decoded.length === 0 || decoded.length > MAX_SCREENSHOT_BYTES) return null;
    if (!hasJpegStructure(decoded)) return null;
    return decoded;
}

export function validateBugReport(value: unknown): ValidatedBugReport | null {
    if (!isObject(value) || !onlyKeys(value, BODY_KEYS)
        || !boundedString(value.description, 4000) || !isObject(value.context)
        || !onlyKeys(value.context, CONTEXT_KEYS)) return null;

    const context = value.context;
    const capturedAt = context.capturedAt;
    const timelinePosition = context.timelinePosition;
    if (!boundedString(capturedAt, 40) || !ISO_DATE_TIME.test(capturedAt) || !Number.isFinite(Date.parse(capturedAt))
        || !boundedString(context.buildVersion, 100, true)
        || !boundedString(context.platform, 100, true)
        || !boundedString(context.language, 35, true)
        || !boundedString(context.scene, 200, true)
        || !optionalString(context.page, 200)
        || !boundedString(context.room, 200, true)
        || !optionalInteger(context.day)
        || !boundedString(context.season, 50, true)
        || !boundedString(context.dayPhase, 50, true)
        || !optionalInteger(context.timelineDay)
        || !Array.isArray(timelinePosition) || timelinePosition.length > 50
        || !timelinePosition.every(item => boundedString(item, 200))
        || !optionalString(context.conversation, 200)
        || !optionalString(context.nodeId, 200)
        || typeof context.sessionPlaySeconds !== 'number'
        || !Number.isFinite(context.sessionPlaySeconds) || context.sessionPlaySeconds < 0
        || context.sessionPlaySeconds > 1_000_000_000) return null;

    const screenshot = decodeJpeg(value.screenshot);
    if (screenshot === null) return null;

    return {
        description: value.description,
        context: context as unknown as BugReportContextInput,
        ...(screenshot ? { screenshot } : {}),
    };
}
