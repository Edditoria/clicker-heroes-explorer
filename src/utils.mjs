/**
 * Equivalent to minstd_rand0 in C++.
 * Ref: https://cplusplus.com/reference/random/minstd_rand0/
 * @param {number} x
 * @returns {number}
 */
export function minStdRand0(x) {
	return (x * 16807) % 2147483647;
}
