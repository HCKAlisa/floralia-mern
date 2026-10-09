import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import logo from "../assets/logo.png";
import "./report.css";

const MAX_DESCRIPTION_LENGTH = 4000;
const MAX_SCREENSHOT_SIZE = 2 * 1024 * 1024;
const MAX_SCREENSHOT_DIMENSION = 1600;
const SCREENSHOT_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

type SubmissionState = "idle" | "sending" | "sent" | "failed";

const browserContext = (): Record<string, unknown> => ({
    capturedAt: new Date().toISOString(),
    buildVersion: "",
    platform: "Web",
    language: navigator.language,
    scene: "",
    page: "report",
    room: "",
    season: "",
    dayPhase: "",
    timelinePosition: [],
    sessionPlaySeconds: 0,
});

const readContext = (): Record<string, unknown> => {
    const encodedContext = new URLSearchParams(window.location.hash.slice(1)).get("context");
    if (!encodedContext) return browserContext();

    try {
        const value: unknown = JSON.parse(encodedContext);
        return value !== null && typeof value === "object" && !Array.isArray(value)
            ? value as Record<string, unknown>
            : browserContext();
    } catch {
        return browserContext();
    }
};

const readScreenshot = (file: Blob): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
        if (typeof reader.result !== "string") {
            reject(new Error("Unable to read screenshot"));
            return;
        }
        resolve(reader.result.slice(reader.result.indexOf(",") + 1));
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
});

const loadImage = (source: string): Promise<HTMLImageElement> => new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Unable to decode screenshot"));
    image.src = source;
});

const canvasToJpeg = (canvas: HTMLCanvasElement, quality: number): Promise<Blob> => new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Unable to encode screenshot"));
    }, "image/jpeg", quality);
});

const convertScreenshot = async (file: File): Promise<Blob> => {
    const source = URL.createObjectURL(file);
    try {
        const image = await loadImage(source);
        const scale = Math.min(1, MAX_SCREENSHOT_DIMENSION / Math.max(image.naturalWidth, image.naturalHeight));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
        canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));

        const context = canvas.getContext("2d");
        if (!context) throw new Error("Unable to prepare screenshot");
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0, canvas.width, canvas.height);

        let jpeg = await canvasToJpeg(canvas, 0.85);
        for (const quality of [0.7, 0.55]) {
            if (jpeg.size <= MAX_SCREENSHOT_SIZE) break;
            jpeg = await canvasToJpeg(canvas, quality);
        }
        return jpeg;
    } finally {
        URL.revokeObjectURL(source);
    }
};

const Report = () => {
    const [context] = useState(readContext);
    const [description, setDescription] = useState("");
    const [screenshot, setScreenshot] = useState<string>();
    const [preview, setPreview] = useState<string>();
    const [submissionState, setSubmissionState] = useState<SubmissionState>("idle");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const attachmentRequestRef = useRef(0);

    useEffect(() => {
        if (window.location.hash) {
            window.history.replaceState(window.history.state, "", `${window.location.pathname}${window.location.search}`);
        }
    }, []);

    useEffect(() => () => {
        if (preview) URL.revokeObjectURL(preview);
    }, [preview]);

    const clearScreenshot = () => {
        attachmentRequestRef.current += 1;
        if (preview) URL.revokeObjectURL(preview);
        setPreview(undefined);
        setScreenshot(undefined);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleScreenshot = async (event: ChangeEvent<HTMLInputElement>) => {
        const requestId = attachmentRequestRef.current + 1;
        attachmentRequestRef.current = requestId;
        const file = event.target.files?.[0];
        if (!file || !SCREENSHOT_TYPES.has(file.type)) {
            clearScreenshot();
            setSubmissionState("failed");
            return;
        }

        try {
            const jpeg = await convertScreenshot(file);
            if (attachmentRequestRef.current !== requestId) return;
            if (jpeg.size > MAX_SCREENSHOT_SIZE) throw new Error("Screenshot is too large");
            const encoded = await readScreenshot(jpeg);
            const nextPreview = URL.createObjectURL(jpeg);
            if (preview) URL.revokeObjectURL(preview);
            setPreview(nextPreview);
            setScreenshot(encoded);
            setSubmissionState("idle");
        } catch {
            clearScreenshot();
            setSubmissionState("failed");
        }
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!description.trim() || submissionState === "sending") return;

        setSubmissionState("sending");
        try {
            const response = await fetch("/api/bug-reports", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    description: description.trim(),
                    context,
                    ...(screenshot ? { screenshot } : {}),
                }),
            });

            if (!response.ok) throw new Error("Submission failed");
            setSubmissionState("sent");
            setDescription("");
            clearScreenshot();
        } catch {
            setSubmissionState("failed");
        }
    };

    return (
        <main className="report-page">
            <form className="report-card" onSubmit={handleSubmit}>
                <img className="report-logo" src={logo} alt="Floralia" />

                <label className="report-label" htmlFor="report-description">What happened?</label>
                <textarea
                    id="report-description"
                    className="report-description"
                    value={description}
                    onChange={(event) => {
                        setDescription(event.target.value);
                        if (submissionState !== "idle") setSubmissionState("idle");
                    }}
                    maxLength={MAX_DESCRIPTION_LENGTH}
                    required
                />
                <output className="report-count">{description.length} / {MAX_DESCRIPTION_LENGTH}</output>

                <label className="report-attachment" htmlFor="report-screenshot">Attach screenshot</label>
                <input
                    ref={fileInputRef}
                    id="report-screenshot"
                    className="report-file-input"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
                    onChange={handleScreenshot}
                />

                {preview && (
                    <div className="report-preview">
                        <img src={preview} alt="" />
                        <button className="report-remove" type="button" onClick={clearScreenshot}>×</button>
                    </div>
                )}

                <button
                    className="report-submit"
                    type="submit"
                    disabled={!description.trim() || submissionState === "sending"}
                >
                    REPORT BUG
                </button>
                <p role="status" aria-live="polite">
                    {submissionState === "sent" ? "Report sent."
                        : submissionState === "failed" ? "Couldn’t send your report. Please try again." : ""}
                </p>
            </form>
        </main>
    );
};

export default Report;
