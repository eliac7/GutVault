// Generate a random salt for PIN hashing
function generateSalt(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
}

// Convert string to ArrayBuffer for crypto operations
function stringToArrayBuffer(str: string): ArrayBuffer {
  const encoder = new TextEncoder();
  return encoder.encode(str).buffer;
}

// Convert ArrayBuffer to hex string
function arrayBufferToHex(buffer: ArrayBuffer): string {
  const array = new Uint8Array(buffer);
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
}

//Hash a PIN using SHA-256 with a salt
export async function hashPin(pin: string): Promise<string> {
  const salt = generateSalt();
  const saltedPin = salt + pin;
  const buffer = stringToArrayBuffer(saltedPin);
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hash = arrayBufferToHex(hashBuffer);
  return `${salt}:${hash}`;
}

//Verify a PIN against a stored hash
export async function verifyPin(
  pin: string,
  storedHash: string
): Promise<boolean> {
  const [salt, expectedHash] = storedHash.split(":");
  if (!salt || !expectedHash) return false;

  const saltedPin = salt + pin;
  const buffer = stringToArrayBuffer(saltedPin);
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hash = arrayBufferToHex(hashBuffer);

  return hash === expectedHash;
}

//Check if Web Authentication API (biometric) is available
export function isBiometricAvailable(): boolean {
  if (typeof window === "undefined") return false;

  return (
    window.PublicKeyCredential !== undefined &&
    typeof window.PublicKeyCredential === "function"
  );
}

//Check if platform authenticator (biometric) is available
export async function isPlatformAuthenticatorAvailable(): Promise<boolean> {
  if (!isBiometricAvailable()) return false;

  try {
    const available =
      await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    return available;
  } catch {
    return false;
  }
}

// Storage key for credential ID
const CREDENTIAL_ID_KEY = "gutvault_biometric_credential_id";

//Register biometric authentication
export async function registerBiometric(): Promise<boolean> {
  if (!isBiometricAvailable()) return false;

  try {
    // Generate a random user ID
    const userId = new Uint8Array(16);
    crypto.getRandomValues(userId);

    // Generate a random challenge
    const challenge = new Uint8Array(32);
    crypto.getRandomValues(challenge);

    const credential = await navigator.credentials.create({
      publicKey: {
        challenge,
        rp: {
          name: "GutVault",
          id: window.location.hostname,
        },
        user: {
          id: userId,
          name: "GutVault User",
          displayName: "GutVault User",
        },
        pubKeyCredParams: [
          { type: "public-key", alg: -7 }, // ES256
          { type: "public-key", alg: -257 }, // RS256
        ],
        authenticatorSelection: {
          authenticatorAttachment: "platform",
          userVerification: "required",
          residentKey: "preferred",
        },
        timeout: 60000,
        attestation: "none",
      },
    });

    if (credential && credential instanceof PublicKeyCredential) {
      // Store credential ID for later authentication
      const credentialId = arrayBufferToHex(credential.rawId);
      localStorage.setItem(CREDENTIAL_ID_KEY, credentialId);
      return true;
    }

    return false;
  } catch (error) {
    console.error("Biometric registration failed:", error);
    return false;
  }
}

//Authenticate using biometric
export async function authenticateBiometric(): Promise<boolean> {
  if (!isBiometricAvailable()) return false;

  try {
    const credentialIdHex = localStorage.getItem(CREDENTIAL_ID_KEY);

    // Generate a random challenge
    const challenge = new Uint8Array(32);
    crypto.getRandomValues(challenge);

    const allowCredentials: PublicKeyCredentialDescriptor[] = credentialIdHex
      ? [
          {
            type: "public-key",
            id: hexToArrayBuffer(credentialIdHex),
            transports: ["internal"],
          },
        ]
      : [];

    const assertion = await navigator.credentials.get({
      publicKey: {
        challenge,
        rpId: window.location.hostname,
        allowCredentials,
        userVerification: "required",
        timeout: 60000,
      },
    });

    return assertion !== null;
  } catch (error) {
    console.error("Biometric authentication failed:", error);
    return false;
  }
}

//Check if biometric credential is registered
export function isBiometricRegistered(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(CREDENTIAL_ID_KEY) !== null;
}

//Clear biometric registration
export function clearBiometricRegistration(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CREDENTIAL_ID_KEY);
}

//Convert hex string to ArrayBuffer
function hexToArrayBuffer(hex: string): ArrayBuffer {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes.buffer;
}
