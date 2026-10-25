import type { Scheme } from './domain';
export type AdminResponse = {
  error?: string; issues?: unknown; slug: string;
  users: {id:string;email:string;role:string;active:boolean}[];
  existing: {data:Scheme;version:number}|null;
};
