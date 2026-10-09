import { useCallback, useEffect, useState } from "react";

type ReportContext = Record<string, unknown>;

type BugReport = {
    reportId: string;
    description: string;
    context: ReportContext;
    hasScreenshot: boolean;
    createdAt: string;
    updatedAt: string;
    expiresAt: string;
};

type ReportListResponse = {
    reports: BugReport[];
    total: number;
    page: number;
    limit: number;
    pages: number;
};

const formatDate = (value: string) => new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
}).format(new Date(value));

const Reports = () => {
    const [reports, setReports] = useState<BugReport[]>([]);
    const [selected, setSelected] = useState<BugReport>();
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadReports = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const response = await fetch(`/api/bug-reports?page=${page}&limit=25`);
            if (!response.ok) throw new Error(`Request failed (${response.status})`);
            const data = await response.json() as ReportListResponse;
            setReports(data.reports);
            setPages(Math.max(data.pages, 1));
            setTotal(data.total);
        } catch (requestError) {
            setError(requestError instanceof Error ? requestError.message : "Unable to load reports");
        } finally {
            setLoading(false);
        }
    }, [page]);

    useEffect(() => {
        void loadReports();
    }, [loadReports]);

    const openReport = async (reportId: string) => {
        setError("");
        try {
            const response = await fetch(`/api/bug-reports/${reportId}`);
            if (!response.ok) throw new Error(`Request failed (${response.status})`);
            const data = await response.json() as { report: BugReport };
            setSelected(data.report);
        } catch (requestError) {
            setError(requestError instanceof Error ? requestError.message : "Unable to load report");
        }
    };

    return (
        <main className="p-6 min-h-full bg-slate-50 text-slate-900">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-4xl">Reports</h1>
                    <p className="mt-1 text-slate-600">{total} total</p>
                </div>
                <button className="px-4 py-2 rounded-lg bg-blue-100 hover:bg-blue-200" onClick={() => void loadReports()}>Refresh</button>
            </div>

            {error && <p className="mb-4 p-3 rounded-lg bg-red-100 text-red-800">{error}</p>}

            <div className="grid xl:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)] gap-6">
                <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    {loading ? (
                        <p className="p-6 text-slate-600">Loading…</p>
                    ) : reports.length === 0 ? (
                        <p className="p-6 text-slate-600">No reports found.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-100 text-sm text-slate-600">
                                    <tr>
                                        <th className="p-3 font-normal">Submitted</th>
                                        <th className="p-3 font-normal">Description</th>
                                        <th className="p-3 font-normal">Screenshot</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reports.map((report) => (
                                        <tr
                                            key={report.reportId}
                                            className={`border-t border-slate-200 cursor-pointer hover:bg-blue-50 ${selected?.reportId === report.reportId ? "bg-blue-50" : ""}`}
                                            onClick={() => void openReport(report.reportId)}
                                        >
                                            <td className="p-3 whitespace-nowrap align-top">{formatDate(report.createdAt)}</td>
                                            <td className="p-3 max-w-md align-top"><p className="line-clamp-3 whitespace-pre-wrap break-words">{report.description}</p></td>
                                            <td className="p-3 align-top">{report.hasScreenshot ? "Yes" : "No"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    <div className="flex items-center justify-between gap-4 p-3 border-t border-slate-200">
                        <button className="px-3 py-2 rounded-lg bg-slate-100 disabled:opacity-40" disabled={page <= 1} onClick={() => setPage((value) => value - 1)}>Previous</button>
                        <span>Page {page} of {pages}</span>
                        <button className="px-3 py-2 rounded-lg bg-slate-100 disabled:opacity-40" disabled={page >= pages} onClick={() => setPage((value) => value + 1)}>Next</button>
                    </div>
                </section>

                <section className="min-w-0 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    {!selected ? (
                        <p className="text-slate-600">Select a report to view its details.</p>
                    ) : (
                        <div className="space-y-5">
                            <div>
                                <h2 className="text-2xl">Report details</h2>
                                <p className="mt-1 text-sm text-slate-500 break-all">{selected.reportId}</p>
                            </div>

                            <div>
                                <h3 className="text-sm text-slate-500 mb-1">Submitted</h3>
                                <p>{formatDate(selected.createdAt)}</p>
                            </div>

                            <div>
                                <h3 className="text-sm text-slate-500 mb-1">Description</h3>
                                <p className="whitespace-pre-wrap break-words">{selected.description}</p>
                            </div>

                            <div>
                                <h3 className="text-sm text-slate-500 mb-1">Context</h3>
                                <pre className="max-h-80 overflow-auto rounded-lg bg-slate-100 p-3 text-sm whitespace-pre-wrap break-words">{JSON.stringify(selected.context, null, 2)}</pre>
                            </div>

                            {selected.hasScreenshot && (
                                <div>
                                    <h3 className="text-sm text-slate-500 mb-2">Screenshot</h3>
                                    <a href={`/api/bug-reports/${selected.reportId}/image`} target="_blank" rel="noreferrer">
                                        <img className="max-h-96 max-w-full rounded-lg border border-slate-200 object-contain" src={`/api/bug-reports/${selected.reportId}/image`} alt="Attached bug report screenshot" />
                                    </a>
                                </div>
                            )}

                            <div>
                                <h3 className="text-sm text-slate-500 mb-1">Expires</h3>
                                <p>{formatDate(selected.expiresAt)}</p>
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
};

export default Reports;
