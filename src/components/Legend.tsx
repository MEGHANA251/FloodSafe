export function Legend() {
  const items = [
    { color: 'bg-yellow-400', label: 'Low risk' },
    { color: 'bg-orange-500', label: 'Medium risk' },
    { color: 'bg-red-600', label: 'High risk' },
    { color: 'bg-blue-600', label: 'Rainfall (GPM)' }
  ];
  return (
    <div className="pointer-events-auto glass rounded-xl p-3 text-xs shadow-soft">
      <div className="font-semibold mb-2">Legend</div>
      <ul className="space-y-1">
        {items.map((i) => (
          <li key={i.label} className="flex items-center gap-2">
            <span className={`h-3 w-3 rounded-sm ${i.color}`} aria-hidden />
            <span>{i.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

