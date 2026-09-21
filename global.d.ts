declare module 'next/navigation' {
  export function notFound(): never;
  export function redirect(url: string, type?: 'replace' | 'push'): never;
  export function permanentRedirect(url: string, type?: 'replace' | 'push'): never;
  export function useRouter(): any;
  export function usePathname(): string;
  export function useSearchParams(): any;
}

declare module 'next/link' {
  const Link: any;
  export default Link;
}
