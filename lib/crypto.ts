
const ALGORITHM = 'AES-CBC';
const SECRET = process.env.CRYPTO_SECRET || 'default_secret_32_byte_length__!';

async function getKey() {
  // Convert secret to a CryptoKey
  const encoder = new TextEncoder();
  const keyData = encoder.encode(SECRET.padEnd(32).slice(0, 32));
  
  return await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: ALGORITHM, length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function encryptEdge(clearText: string): Promise<string> {
  try {
    const iv = crypto.getRandomValues(new Uint8Array(16));
    const key = await getKey();
    const encoder = new TextEncoder();
    const data = encoder.encode(clearText);
    
    const encrypted = await crypto.subtle.encrypt(
      { name: ALGORITHM, iv },
      key,
      data
    );
    
    const ivHex = Array.from(iv).map(b => b.toString(16).padStart(2, '0')).join('');
    const encHex = Array.from(new Uint8Array(encrypted)).map(b => b.toString(16).padStart(2, '0')).join('');
    
    return ivHex + ':' + encHex;
  } catch (error) {
    console.error('Encryption error:', error);
    return clearText;
  }
}

export async function decryptEdge(cipherText: string): Promise<string> {
  try {
    const [ivHex, encHex] = cipherText.split(':');
    if (!ivHex || !encHex) {
      console.error('Invalid cipher text format');
      return '';
    }
    
    const iv = new Uint8Array(ivHex.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []);
    const encrypted = new Uint8Array(encHex.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []);
    
    const key = await getKey();
    
    const decrypted = await crypto.subtle.decrypt(
      { name: ALGORITHM, iv },
      key,
      encrypted
    );
    
    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  } catch (error) {
    console.error('Decryption error:', error);
    return '';
  }
}