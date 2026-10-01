import { chatGPTSignInPath } from '@/app/chatgpt-auth';
import { PageTitle } from '@/components/site';

export const metadata = {
  title: 'व्यवस्थापक प्रवेश',
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <main id="main" className="page-wrap">
      <PageTitle
        eyebrow="सुरक्षित समीक्षा डेस्क"
        title="व्यवस्थापक प्रवेश"
        description="योजनाओं का संपादन केवल अधिकृत समीक्षक कर सकते हैं।"
      />
      <div className="panel">
        <p>अपनी अधिकृत पहचान से प्रवेश करें।</p>
        <a className="btn" style={{ marginTop: 20 }} href={chatGPTSignInPath('/admin')} target="_top">
          Sign in with ChatGPT
        </a>
      </div>
    </main>
  );
}
