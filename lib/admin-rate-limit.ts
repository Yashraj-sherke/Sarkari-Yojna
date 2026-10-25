import { db,HttpError } from './server';
import { sessionHash } from './admin-password';
export async function adminRateLimit(userId:string,operation:string,limit=120){
 const sql=db();if(!sql)throw new HttpError(503,'Database configuration आवश्यक है।');
 const key=`cms:${operation}:${await sessionHash(userId)}:${Math.floor(Date.now()/3600000)}`;
 const rows=await sql`INSERT INTO rate_limits(key,count,expires) VALUES(${key},1,${Math.floor(Date.now()/1000)+3600}) ON CONFLICT(key) DO UPDATE SET count=rate_limits.count+1 RETURNING count`;
 if(rows[0].count>limit)throw new HttpError(429,'इस कार्य की सीमा पूरी हो गई है। कुछ समय बाद प्रयास करें।');
}
