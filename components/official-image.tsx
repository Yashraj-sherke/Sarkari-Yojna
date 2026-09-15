'use client';
import {useState} from 'react';
import {officialImages} from '@/lib/official-content';

export function OfficialImage({slug}:{slug:string}) {
  const [failed,setFailed]=useState(false);
  const asset=officialImages[slug];
  if(!asset||failed)return null;
  return <figure className="official-image">
    {/* Original government banners are kept uncropped so their text remains intact. */}
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img
      src={asset.src}
      alt={asset.alt}
      width={asset.width}
      height={asset.height}
      loading="lazy"
      decoding="async"
      style={{aspectRatio:`${asset.width}/${asset.height}`}}
      onError={()=>setFailed(true)}
    />
    <figcaption>चित्र स्रोत: <a href={asset.source} target="_blank" rel="noopener noreferrer">{asset.credit} ↗</a></figcaption>
  </figure>;
}
