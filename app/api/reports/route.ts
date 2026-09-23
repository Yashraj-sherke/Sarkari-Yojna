import {reportSchema} from '@/lib/domain';
import {checkOrigin,readBody,db,failure,json,rateLimit,getScheme,HttpError,event} from '@/lib/server';

export async function POST(req:Request){
  try{
    checkOrigin(req);
    // Limit to 2 reports per IP per hour to prevent spam
    await rateLimit(req,'reports',2);
    
    const v=reportSchema.parse(await readBody(req));
    const scheme = await getScheme(v.slug);
    if(!scheme) throw new HttpError(404,'योजना नहीं मिली।');
    
    const sql=db()!;
    await sql`INSERT INTO reports(id,slug,reason,detail,created_at) VALUES (${crypto.randomUUID()},${v.slug},${v.reason},${v.detail},${new Date().toISOString()})`;
    await event('report_submitted');

    // Send email via Resend if configured
    if (process.env.RESEND_API_KEY && process.env.ADMIN_EMAIL) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'Sarkari Yojna Feedback <onboarding@resend.dev>',
          to: process.env.ADMIN_EMAIL,
          subject: `New Feedback Report: ${scheme.title || v.slug}`,
          text: `A new feedback report was submitted for the scheme: ${scheme.title || v.slug} (${v.slug})\n\nReason: ${v.reason}\n\nDetails: ${v.detail || 'No additional details provided.'}\n\nPlease review this feedback in the admin dashboard.`
        })
      }).catch(err => console.error('Failed to send email:', err));
    }

    return json({ok:true},201);
  }catch(e){
    return failure(e);
  }
}
