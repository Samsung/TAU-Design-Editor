/**
 * Returns true if version requirement is met, otherwise false.
 * In case of missing parameters it returns true.
 * @param {string} currentVersion
 * @param {string} requiredVersion
 */
export function _compareVersions(currentVersion, requiredVersion) {
	if (!currentVersion || !requiredVersion) {
		return true;
	}

	const current = currentVersion.split('.').map(partial => parseInt(partial));
	const required = requiredVersion.split('.').map(partial => parseInt(partial));
	const minLength = Math.min(current.length, required.length);

	for (let i = 0; i < minLength; i++) {
		if (current[i] == required[i]) {
			continue;
		}

		return  current[i] >= required[i];
	}

	return current.length >= required.length;
}
