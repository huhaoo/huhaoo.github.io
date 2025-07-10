// Local storage utility functions
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

import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"
import "dayjs/locale/zh-cn"
dayjs.extend(relativeTime)
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.locale("zh-cn")
export function formatTime(datetimeStr: string | undefined): string {
	if (!datetimeStr) return "";
	const dt = dayjs.utc(datetimeStr).local()
	const formattedDate = dt.format("YYYY/MM/DD HH:mm")
	const fromNow = dt.fromNow()
	return `${formattedDate}，${fromNow}`
}



export function api_url(): string {
	if (import.meta.env.MODE === "development")
		return import.meta.env.VITE_API_URL_LOCAL
	return import.meta.env.VITE_API_URL
}