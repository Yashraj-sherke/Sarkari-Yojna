'use client';
import {useState} from 'react';
import {api} from './site';

export function SchemeFeedback({slug, title, english = false}: {slug: string; title: string; english?: boolean}) {
  const [reason, setReason] = useState('outdated');
  const [detail, setDetail] = useState('');
  const [state, setState] = useState<'idle'|'busy'|'sent'>('idle');
  const [error, setError] = useState('');
  return <section className="flat-section" id="feedback">
    <h2 className="flat-section-heading">{english ? 'Feedback' : 'प्रतिपुष्टि'}</h2>
    <p>{english ? `Found an error in ${title}? Select the section and explain what needs correcting.` : `${title} की जानकारी में कोई गलती दिखी? नीचे विषय चुनें और बताएँ कि किस बात में सुधार चाहिए। नया सरकारी आदेश या स्रोत मिला हो तो उसका लिंक भी लिख सकते हैं।`}</p>
    <p>{english ? 'This form reports errors on this website. It does not submit a government application or grievance. Do not include Aadhaar, bank details or OTPs.' : 'यह फॉर्म इस वेबसाइट की जानकारी में सुधार के लिए है। इससे सरकारी आवेदन या विभागीय शिकायत दर्ज नहीं होती। आधार नंबर, बैंक विवरण या OTP न लिखें।'}</p>
    {state === 'sent' ? <p role="status">{english ? 'Your report has been received. Thank you.' : 'आपकी रिपोर्ट मिल गई है। सुधार बताने के लिए धन्यवाद।'}</p> : <form onSubmit={async e => {
      e.preventDefault(); setState('busy'); setError('');
      try { await api('/api/reports', {slug, reason, detail}); setState('sent'); }
      catch (e) {setError((e as Error).message); setState('idle');}
    }}>
      <label className="field">{english ? 'What needs correcting?' : 'किस जानकारी में सुधार चाहिए?'}
        <select value={reason} onChange={e => setReason(e.target.value)} disabled={state === 'busy'}>
          {[
            ['wrong-benefit','लाभ या राशि','Benefits or amount'], ['wrong-eligibility','पात्रता या अपवाद','Eligibility or exclusions'],
            ['broken-link','आवेदन या स्रोत का लिंक','Application or source link'], ['outdated','पुरानी जानकारी','Outdated information'], ['other','दस्तावेज़ या अन्य जानकारी','Documents or other information'],
          ].map(([value,hi,en]) => <option key={value} value={value}>{english ? en : hi}</option>)}
        </select>
      </label>
      <label className="field">{english ? 'Describe the correction (optional)' : 'सुधार का विवरण (वैकल्पिक)'}
        <textarea rows={4} maxLength={1000} value={detail} onChange={e => setDetail(e.target.value)} disabled={state === 'busy'} />
      </label>
      {error && <p role="alert" className="error-message">{error}</p>}
      <button className="btn secondary" disabled={state === 'busy'}>{state === 'busy' ? (english ? 'Sending…' : 'भेज रहे हैं…') : (english ? 'Send correction' : 'सुधार भेजें')}</button>
    </form>}
  </section>;
}
