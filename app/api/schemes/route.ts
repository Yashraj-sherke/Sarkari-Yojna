import {allSchemes,failure,json} from '@/lib/server';
import {searchSchemes} from '@/lib/domain';
export async function GET(req:Request){try{const p=new URL(req.url).searchParams;return json(searchSchemes(await allSchemes(),p.get('q')??'',p.get('category')??'all',p.get('state')??'all'));}catch(e){return failure(e);}}
