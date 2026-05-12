"use client";

import { useRef, useState, DragEvent, ChangeEvent } from "react";

interface DropZoneProps {
  onFile: (file: File) => void;
  disabled?: boolean;
}

export default function DropZone({ onFile, disabled }: DropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(false);
    if (disabled) return;
    const file = e.dataTransfer.files?.[0];
    if (file) onFile(file);
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) onFile(file);
    // Reset so same file can be re-uploaded
    e.target.value = "";
  }

  return (
    <div
      onClick={() => !disabled && inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); if (!disabled) setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={`
        relative flex flex-col items-center justify-center gap-3
        border border-dashed rounded-sm
        px-8 py-12 cursor-pointer select-none
        transition-all duration-200
        ${dragging
          ? "border-brand-green bg-brand-green/5"
          : "border-brand-border hover:border-brand-muted hover:bg-brand-surface/60"
        }
        ${disabled ? "opacity-40 cursor-not-allowed" : ""}
      `}
    >
      {/* Icon */}
      <svg
        width="32" height="32" viewBox="0 0 32 32" fill="none"
        className={`transition-colors duration-200 ${dragging ? "text-brand-green" : "text-brand-textDim"}`}
      >
        <path d="M16 4L16 20M16 4L10 10M16 4L22 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6 24H26" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M6 28H26" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
      </svg>

      <div className="text-center">
        <p className="font-mono text-sm text-brand-text">
          <span className="text-brand-green">Selecciona</span> o arrastra tu Excel
        </p>
        <p className="font-mono text-xs text-brand-textDim mt-1">.xlsx · .xls · máx. 10 MB</p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls"
        className="hidden"
        onChange={handleChange}
        disabled={disabled}
      />
    </div>
  );
}
