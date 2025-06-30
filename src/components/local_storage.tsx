export function set_var(key: string, value: any): void {
	localStorage.setItem(key, JSON.stringify(value));
}
export function get_var(key: string): any {
	const value = localStorage.getItem(key);
	if (value === null) {
		return null;
	}
	try {
		return JSON.parse(value);
	} catch (e) {
		console.error(`Error parsing JSON for key "${key}":`, e);
		return null;
	}
}