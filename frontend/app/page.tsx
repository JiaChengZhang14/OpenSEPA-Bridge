"use client";

import { useState } from "react";
import DropZone from "@/components/DropZone";
import StatusLog, { LogEntry } from "@/components/StatusLog";
import MappingTable from "@/components/MappingTable";
import { debugExcel, convertToXml, downloadBlob, DebugExcelResponse } from "@/lib/api";

type Stage = "idle" | "processing" | "preview" | "converting" | "done" | "error";

export default function Home() {
  const [stage, setStage] = useState<Stage>("idle");
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<DebugExcelResponse | null>(null);

  function addLog(entry: LogEntry) {
    setLogs((prev) => [...prev, entry]);
  }

  async function handleFile(f: File) {
    setFile(f);
    setPreview(null);
    setLogs([]);
    setStage("processing");

    const sizeKB = (f.size / 1024).toFixed(1);
    addLog({ type: "info", text: `Fichero: ${f.name} (${sizeKB} KB)` });
    addLog({ type: "info", text: "Enviando al backend..." });

    try {
      const result = await debugExcel(f);
      setPreview(result);

      addLog({ type: "ok", text: `Llama3 completó el análisis` });
      addLog({ type: "ok", text: `${result.total_filas} filas detectadas` });

      const mapped = Object.values(result.mapeo_utilizado).filter(Boolean).length;
      const total = Object.keys(result.mapeo_utilizado).length;
      addLog({ type: "ok", text: `Mapeo: ${mapped}/${total} campos identificados` });

      if (mapped < total) {
        addLog({ type: "warn", text: `${total - mapped} campo(s) no encontrados — revisa el Excel` });
      }

      setStage("preview");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error desconocido";
      addLog({ type: "error", text: msg });
      setStage("error");
    }
  }

  async function handleConvert() {
    if (!file) return;
    setStage("converting");
    addLog({ type: "info", text: "Generando XML pain.001.001.03..." });

    try {
      const blob = await convertToXml(file);
      const filename = `remesa_${new Date().toISOString().slice(0, 10)}.xml`;
      downloadBlob(blob, filename);
      addLog({ type: "ok", text: `XML generado → ${filename}` });
      setStage("done");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error desconocido";
      // If endpoint not yet implemented, show a friendly message
      if (msg.includes("404") || msg.includes("Not Found")) {
        addLog({ type: "warn", text: "El endpoint /convert aún no está implementado en el backend" });
        addLog({ type: "info", text: "Completa el XML builder en el backend para activar esta función" });
      } else {
        addLog({ type: "error", text: msg });
      }
      setStage("preview"); // Go back to preview so user can retry
    }
  }

  function handleReset() {
    setStage("idle");
    setLogs([]);
    setFile(null);
    setPreview(null);
  }

  const isLoading = stage === "processing" || stage === "converting";
  const canConvert = stage === "preview";
  const isDone = stage === "done";

  return (
    <main className="min-h-screen bg-brand-bg px-4 py-16 flex flex-col items-center">

      {/* Header */}
      <div className="w-full max-w-2xl mb-12 animate-fadeUp">
        <div className="flex items-baseline gap-3">
          <h1 className="font-mono text-xl font-medium text-brand-text tracking-tight">
            Open<span className="text-brand-green">SEPA</span>·Bridge
          </h1>
          <span className="font-mono text-xs text-brand-muted border border-brand-border px-2 py-0.5 rounded-sm">
            v0.1
          </span>
        </div>
        <p className="font-mono text-xs text-brand-textDim mt-1">
          Excel → pain.001.001.03 · Bankinter · ISO 20022
        </p>
        {/* Separator line */}
        <div className="mt-6 h-px bg-gradient-to-r from-brand-green/30 via-brand-border to-transparent" />
      </div>

      {/* Main card */}
      <div className="w-full max-w-2xl space-y-4">

        {/* Step 1 — Upload */}
        <section className="space-y-2">
          <SectionLabel num="01" label="Subir Excel" />
          <DropZone onFile={handleFile} disabled={isLoading} />

          {/* File pill */}
          {file && (
            <div className="flex items-center justify-between px-3 py-2 bg-brand-surface border border-brand-border rounded-sm animate-fadeUp">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse_soft" />
                <span className="font-mono text-xs text-brand-text">{file.name}</span>
              </div>
              <button
                onClick={handleReset}
                className="font-mono text-xs text-brand-textDim hover:text-brand-text transition-colors"
              >
                cambiar
              </button>
            </div>
          )}
        </section>

        {/* Step 2 — Log */}
        <section className="space-y-2">
          <SectionLabel num="02" label="Proceso" />
          <StatusLog entries={logs} loading={isLoading} />
        </section>

        {/* Step 3 — Mapping preview */}
        {preview && (
          <section className="space-y-2 animate-fadeUp">
            <SectionLabel num="03" label="Mapeo detectado por Llama3" />
            <MappingTable
              mapeo={preview.mapeo_utilizado}
              totalFilas={preview.total_filas}
            />
          </section>
        )}

        {/* Step 4 — Convert / Download */}
        {(canConvert || isDone) && (
          <section className="space-y-2 animate-fadeUp">
            <SectionLabel num="04" label="Generar XML" />

            {isDone ? (
              <div className="flex items-center gap-3 px-4 py-3 bg-brand-green/5 border border-brand-green/30 rounded-sm">
                <span className="font-mono text-sm text-brand-green">✓</span>
                <span className="font-mono text-sm text-brand-green">XML descargado correctamente</span>
                <button
                  onClick={handleReset}
                  className="ml-auto font-mono text-xs text-brand-textDim hover:text-brand-text transition-colors"
                >
                  nueva remesa →
                </button>
              </div>
            ) : (
              <button
                onClick={handleConvert}
                disabled={stage === "converting"}
                className="
                  w-full flex items-center justify-center gap-2
                  font-mono text-sm
                  border border-brand-green text-brand-green
                  hover:bg-brand-green hover:text-brand-bg
                  disabled:opacity-40 disabled:cursor-not-allowed
                  transition-all duration-150
                  px-6 py-3 rounded-sm
                "
              >
                {stage === "converting" ? (
                  <>
                    <span className="animate-pulse_soft">··</span>
                    generando XML...
                  </>
                ) : (
                  <>
                    Convertir a XML · pain.001.001.03
                    <span className="text-xs opacity-60">↓</span>
                  </>
                )}
              </button>
            )}
          </section>
        )}

      </div>

      {/* Footer */}
      <footer className="mt-16 font-mono text-xs text-brand-muted text-center">
        OpenSEPA-Bridge · datos procesados localmente con Ollama
      </footer>
    </main>
  );
}

function SectionLabel({ num, label }: { num: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-xs text-brand-green opacity-60">{num}</span>
      <span className="font-mono text-xs text-brand-textDim uppercase tracking-widest">{label}</span>
      <div className="flex-1 h-px bg-brand-border" />
    </div>
  );
}
