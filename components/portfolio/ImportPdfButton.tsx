"use client";

import { useRef, useState } from "react";
import { Upload } from "lucide-react";

export default function ImportPdfButton() {

    const inputRef = useRef<HTMLInputElement>(null);

    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("");

    async function handleChange(
        e: React.ChangeEvent<HTMLInputElement>
    ) {

        const file = e.target.files?.[0];

        if (!file) return;

        const form = new FormData();

        form.append("file", file);

        setLoading(true);
        setStatus("â³ Importing contract note...");

        try {

            const response = await fetch(
                "/api/portfolio/import-contract-note",
                {
                    method: "POST",
                    body: form
                }
            );

            const result = await response.json();

            if (result.success) {

                setStatus(
                    `âœ… Imported Successfully

Contract Note : ${result.contractNoteNo}

Trades Imported : ${result.trades}`
                );

            } else {

                setStatus(
                    `âŒ Import Failed

${result.error ?? result.message ?? "Unknown error"}`
                );

            }

        } catch (error) {

            setStatus(
                `âŒ ${error instanceof Error ? error.message : "Import failed"}`
            );

        } finally {

            setLoading(false);

            if (inputRef.current) {
                inputRef.current.value = "";
            }

        }

    }

    return (
        <>
            <input
                ref={inputRef}
                type="file"
                accept=".pdf"
                hidden
                onChange={handleChange}
            />

            <button
                onClick={() => inputRef.current?.click()}
                disabled={loading}
                className="flex h-11 w-full items-center gap-3 px-4 text-white hover:bg-slate-800 disabled:opacity-50"
            >
                <Upload size={18} />

                <span>
                    {loading ? "Importing..." : "Import PDF"}
                </span>
            </button>

            {status && (
                <div className="mt-3 rounded border border-slate-700 bg-slate-900 p-3 text-sm whitespace-pre-line text-white">
                    {status}
                </div>
            )}
        </>
    );

}
