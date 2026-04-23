/* ═══════════════════════════════════════════════════════════
   ID Obfuscation Utility (Sync with Backend/App)
   ═══════════════════════════════════════════════════════════ */

const SALT = "am_secure_2026";

/**
 * Decodes an obfuscated string back into a numeric ID.
 */
export function decodeId(code: string | undefined): number | null {
  if (!code) return null;
  try {
    // Revert URL-safe replacements
    const normalized = code.replace(/_/g, '/').replace(/-/g, '+');
    // Pad with '=' if necessary to restore valid Base64
    const padded = normalized.padEnd(normalized.length + (4 - normalized.length % 4) % 4, '=');
    const decoded = atob(padded);
    const [idStr, salt] = decoded.split(':');
    
    if (salt === SALT && idStr) {
      const id = parseInt(idStr);
      return isNaN(id) ? null : id;
    }
    return null;
  } catch (err) {
    return null;
  }
}
