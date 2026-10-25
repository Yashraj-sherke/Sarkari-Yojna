const iterations = 600000;
const encode = (bytes: Uint8Array) => Array.from(bytes, n => n.toString(16).padStart(2, '0')).join('');
const decode = (hex: string) => Uint8Array.from(hex.match(/../g) ?? [], n => parseInt(n, 16));
export async function hashPassword(password: string) {
  if (password.length < 12 || password.length > 200) throw new Error('पासवर्ड 12–200 अक्षरों का होना चाहिए।');
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations }, key, 256);
  return `pbkdf2-sha256$${iterations}$${encode(salt)}$${encode(new Uint8Array(bits))}`;
}
export async function verifyPassword(password: string, stored: string) {
  const [algorithm, count, salt, expected] = stored.split('$');
  if (algorithm !== 'pbkdf2-sha256' || count !== String(iterations) || !/^[a-f0-9]{32}$/.test(salt ?? '') || !/^[a-f0-9]{64}$/.test(expected ?? '') || password.length > 200) return false;
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const actual = new Uint8Array(await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: decode(salt), iterations }, key, 256));
  const target = decode(expected); let difference = 0;
  actual.forEach((value, i) => { difference |= value ^ target[i]; });
  return difference === 0;
}
export async function sessionHash(token: string) {
  return encode(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token))));
}
