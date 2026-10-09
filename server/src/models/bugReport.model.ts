import mongoose from 'mongoose';

const { Schema } = mongoose;

const BugReportContextSchema = new Schema({
    capturedAt: { type: Date, required: true },
    buildVersion: { type: String },
    platform: { type: String },
    language: { type: String },
    scene: { type: String },
    page: { type: String },
    room: { type: String },
    day: { type: Number },
    season: { type: String },
    dayPhase: { type: String },
    timelineDay: { type: Number },
    timelinePosition: { type: [String], required: true },
    conversation: { type: String },
    nodeId: { type: String },
    sessionPlaySeconds: { type: Number, required: true },
}, { _id: false, strict: 'throw' });

const BugReportSchema = new Schema({
    reportId: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: true },
    context: { type: BugReportContextSchema, required: true },
    hasScreenshot: { type: Boolean, required: true },
    screenshot: { type: Buffer, select: false },
    screenshotBytes: { type: Number, required: true, select: false },
    screenshotContentType: { type: String, select: false },
    expiresAt: { type: Date, required: true, index: { expires: 0 } },
}, { timestamps: true, strict: 'throw' });

const BugReportModel = mongoose.model('BugReport', BugReportSchema);

export default BugReportModel;
