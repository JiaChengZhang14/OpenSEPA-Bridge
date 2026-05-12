"use client";

interface MappingTableProps {
  mapeo: Record<string, string | null>;
  totalFilas: number;
}

export default function MappingTable({ mapeo, totalFilas }: MappingTableProps) {
  const entries = Object.entries(mapeo);
  const mapped = entries.filter(([, v]) => v !== null).length;

  return (
    <div className="border border-brand-border rounded-sm overflow-hidden animate-fadeUp">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-brand-surface border-b border-brand-border">
        <span className="font-mono text-xs text-brand-textDim uppercase tracking-wider">
          Mapeo de columnas
        </span>
        <div className="flex gap-3">
          <span className="font-mono text-xs text-brand-green">
            {mapped}/{entries.length} campos
          </span>
          <span className="font-mono text-xs text-brand-textDim">
            {totalFilas} filas
          </span>
        </div>
      </div>

      {/* Table */}
      <table className="w-full font-mono text-xs">
        <thead>
          <tr className="border-b border-brand-border">
            <th className="text-left px-4 py-2 text-brand-textDim font-normal">Campo SEPA</th>
            <th className="text-left px-4 py-2 text-brand-textDim font-normal">Columna Excel</th>
            <th className="px-4 py-2"></th>
          </tr>
        </thead>
        <tbody>
          {entries.map(([campo, columna], i) => (
            <tr
              key={campo}
              className="border-b border-brand-border/50 last:border-0 hover:bg-brand-surface/50 transition-colors"
              style={{ animationDelay: `${i * 30}ms` }}
            >
              <td className="px-4 py-2.5 text-brand-text">{campo}</td>
              <td className="px-4 py-2.5 text-brand-green">
                {columna ?? <span className="text-brand-muted italic">— no encontrado</span>}
              </td>
              <td className="px-4 py-2.5 text-right">
                {columna
                  ? <span className="w-1.5 h-1.5 rounded-full bg-brand-green inline-block" />
                  : <span className="w-1.5 h-1.5 rounded-full bg-brand-muted inline-block" />
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
