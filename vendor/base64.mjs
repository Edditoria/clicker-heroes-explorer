/**
 * Convert base64 to bytes. Code copied from MDN website.
 * Ref: {@link https://developer.mozilla.org/en-US/docs/Glossary/Base64#the_unicode_problem MDN Docs}
 * @param {string} base64
 * @returns {Uint8Array}
 */
export function base64ToBytes(base64) {
	const binString = atob(base64);
	return Uint8Array.from(binString, (m) => m.codePointAt(0));
}

/**
 * Convert bytes to base64. Code copied from MDN website.
 * Ref: {@link https://developer.mozilla.org/en-US/docs/Glossary/Base64#the_unicode_problem MDN Docs}
 * @param {Uint8Array} bytes
 * @returns {string}
 */
export function bytesToBase64(bytes) {
	const binString = String.fromCodePoint(...bytes);
	return btoa(binString);
}
