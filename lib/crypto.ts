import crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';
const SECRET = process.env.CRYPTO_SECRET || 'default_secret_32_byte_length__!';

function getKey() {
  return Buffer.from(SECRET.padEnd(32).slice(0, 32));
}

export function encrypt(clearText: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);
  const encrypted = Buffer.concat([cipher.update(clearText, 'utf8'), cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

export function decrypt(cipherText: string): string {
  try {
    const [ivHex, encHex] = cipherText.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const encrypted = Buffer.from(encHex, 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, getKey(), iv);
    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    return decrypted.toString('utf8');
  } catch (err) {
    return '';
  }
}
