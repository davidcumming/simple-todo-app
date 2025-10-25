/**
 * Decodes the payload of a JWT.
 * Note: This does NOT verify the signature. It should only be used for
 * client-side convenience to extract claims from a token that has
 * already been verified by its provider (e.g., Google).
 * @param token The JWT string.
 * @returns The decoded payload object, or null if decoding fails.
 */
export const decodeJwt = (token: string): any | null => {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) {
      return null;
    }
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Failed to decode JWT", e);
    return null;
  }
};