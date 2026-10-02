export default function Loading() {
  return (
    <div className="page-loading" role="status" aria-live="polite">
      <div className="spinner" />
      <p aria-hidden="true" className="sr-only">लोड हो रहा है...</p>
    </div>
  );
}
