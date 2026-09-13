import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="empty-state" style={{ padding: '60px 20px', textAlign: 'center' }}>
      <h2>पृष्ठ नहीं मिला (404)</h2>
      <p>जो पृष्ठ आप खोज रहे हैं वह उपलब्ध नहीं है।</p>
      <Link href="/" className="button" style={{ marginTop: 16, display: 'inline-block' }}>
        होमपेज पर जाएं
      </Link>
    </div>
  );
}
