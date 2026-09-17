'use client';
import Link from 'next/link';
import { Search, ShieldCheck, FileText, ExternalLink, ChevronRight, Sprout } from 'lucide-react';

export function ProcessFlow({ lang = 'hi' }: { lang?: string }) {
  const steps = [
    {
      num: 1,
      icon: (
        <div className="flow-icon-composite">
          <Search size={22} className="flow-icon-search" />
          <Sprout size={14} className="flow-icon-sprout" />
        </div>
      ),
      title: lang === 'hi' ? 'योजना खोजें' : 'Search Schemes',
      desc: lang === 'hi' ? 'अपनी जरूरत के अनुसार योजना खोजें' : 'Find schemes tailored to your needs',
      href: '#main',
      isExternal: false,
    },
    {
      num: 2,
      icon: <ShieldCheck size={24} className="flow-icon-main" />,
      title: lang === 'hi' ? 'पात्रता जानें' : 'Check Eligibility',
      desc: lang === 'hi' ? 'देखें कि आप पात्र हो सकते हैं या नहीं' : 'Verify if you are eligible or not',
      href: '/mere-liye',
      isExternal: false,
    },
    {
      num: 3,
      icon: <FileText size={24} className="flow-icon-main" />,
      title: lang === 'hi' ? 'दस्तावेज़ देखें' : 'Prepare Documents',
      desc: lang === 'hi' ? 'जरूरी प्रमाण पत्र पहले से तैयार करें' : 'Keep required certificates ready in advance',
      href: '/praman-patr',
      isExternal: false,
    },
    {
      num: 4,
      icon: <ExternalLink size={23} className="flow-icon-main" />,
      flag: true,
      title: lang === 'hi' ? 'Official Portal पर आवेदन करें' : 'Apply on Official Portal',
      desc: lang === 'hi' ? 'संबंधित सरकारी पोर्टल पर जाएँ' : 'Visit authorized government portals',
      href: 'https://www.india.gov.in',
      isExternal: true,
    },
  ];

  return (
    <section
      className="flow-workflow-section"
      aria-label={lang === 'hi' ? 'योजना से लाभ तक की प्रक्रिया' : 'Scheme to Benefit Workflow'}
    >
      {/* 3 Complete Flowing Flora Waves on Left (Self-contained, curves back into 0,300) */}
      <div className="flow-bg-decor-left" aria-hidden="true">
        <svg viewBox="0 0 320 300" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          {/* Outer soft mint wave */}
          <path
            d="M 0,0 C 230,30 270,160 180,255 C 130,300 40,300 0,300 Z"
            fill="#8fcfae"
            fillOpacity="0.85"
          />
          {/* Middle emerald/sage wave */}
          <path
            d="M 0,0 C 180,20 205,145 130,235 C 90,285 30,300 0,300 Z"
            fill="#4ea878"
            fillOpacity="0.95"
          />
          {/* Inner dark forest green wave */}
          <path
            d="M 0,0 C 130,15 140,135 80,215 C 50,260 20,300 0,300 Z"
            fill="#22784d"
          />
          {/* Soft inner highlight curve */}
          <path
            d="M 0,150 C 55,175 70,240 0,300 Z"
            fill="#bde7ce"
            fillOpacity="0.6"
          />
        </svg>
      </div>

      {/* Subtle Dot Matrix on Right */}
      <div className="flow-bg-decor-dots" aria-hidden="true" />

      <div className="flow-inner-container">
        {/* Centered Heading Cluster */}
        <div className="flow-heading-cluster">
          <h2 className="flow-main-title">
            {lang === 'hi' ? 'योजना से लाभ तक' : 'From Scheme to Benefit'}
          </h2>
          <p className="flow-subtitle">
            {lang === 'hi'
              ? 'सही योजना खोजें, पात्रता समझें और सही सरकारी पोर्टल पर आवेदन करें।'
              : 'Discover schemes, check eligibility criteria, and apply directly on official portals.'}
          </p>
        </div>

        {/* 4 Connected Process Step Cards */}
        <div className="flow-steps-chain">
          {steps.map((step, idx) => {
            const CardBody = (
              <div className={`flow-step-card ${step.num === 4 ? 'is-goal-step' : ''}`}>
                {/* Concentric Circle Cluster on Left */}
                <div className="flow-circle-cluster">
                  {/* Floating Number Badge at top center */}
                  <span className="flow-step-num">{step.num}</span>

                  {/* Chevron Badge at left center */}
                  <span className="flow-card-chevron" aria-hidden="true">
                    <ChevronRight size={10} strokeWidth={3.5} />
                  </span>

                  {/* Outer Ring */}
                  <div className="flow-outer-ring">
                    {/* Inner White Disc with Icon */}
                    <div className="flow-inner-icon-disc">{step.icon}</div>
                  </div>
                </div>

                {/* Card Text Information */}
                <div className="flow-card-content">
                  <h3 className="flow-card-title">{step.title}</h3>
                  <p className="flow-card-desc">{step.desc}</p>
                </div>

                {/* Indian Tricolor Flag on Goal Step */}
                {step.flag && (
                  <div className="flow-flag-badge" title="Government of India" aria-label="India Flag">
                    <svg
                      width="24"
                      height="16"
                      viewBox="0 0 24 16"
                      fill="none"
                      style={{ borderRadius: '2px', display: 'block', boxShadow: '0 1px 3px rgba(0,0,0,0.22)' }}
                    >
                      <rect width="24" height="5.33" fill="#FF9933" />
                      <rect y="5.33" width="24" height="5.33" fill="#FFFFFF" />
                      <rect y="10.66" width="24" height="5.34" fill="#138808" />
                      <circle cx="12" cy="8" r="2" stroke="#000080" strokeWidth="0.65" fill="none" />
                    </svg>
                  </div>
                )}
              </div>
            );

            return (
              <div key={step.num} className="flow-step-wrapper">
                {step.isExternal ? (
                  <a
                    href={step.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flow-step-link"
                    title={step.title}
                  >
                    {CardBody}
                  </a>
                ) : (
                  <Link href={step.href} className="flow-step-link" title={step.title}>
                    {CardBody}
                  </Link>
                )}

                {/* Inter-step S-Swoop Connector Line */}
                {idx < steps.length - 1 && (
                  <div className="flow-connector" aria-hidden="true">
                    <svg className="flow-connector-svg" viewBox="0 0 44 28" fill="none" preserveAspectRatio="none">
                      <path
                        d="M 0,14 C 12,28 32,28 44,14"
                        stroke="#1b7348"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
