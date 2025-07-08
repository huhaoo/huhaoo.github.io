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


import { useEffect, useState, type ReactNode } from "react"
import { marked } from "marked"
import katex from "katex"
import DOMPurify from "dompurify"
import "katex/dist/katex.min.css"

function renderMath(content: string): string {
	content = content.replace(/\$\$(.+?)\$\$/gs, (_, formula) => {
		try {
			return katex.renderToString(formula, {
				displayMode: true,
				throwOnError: false,
			})
		} catch {
			return formula
		}
	})
	content = content.replace(/\$(.+?)\$/g, (_, formula) => {
		try {
			return katex.renderToString(formula, {
				displayMode: false,
				throwOnError: false,
			})
		} catch {
			return formula
		}
	})

	return content
}

export function MarkdownWithMath({ children, className }: { children: ReactNode, className?: string }) {
	const [renderHtml, setRenderHtml] = useState<string>("")
	useEffect(() => {
		const fetchData = async () => {
			const markdownHtml = await marked.parse(children?.toString() ?? "")
			const mathRendered = renderMath(markdownHtml)
			const safeHtml = DOMPurify.sanitize(mathRendered)
			setRenderHtml(safeHtml)
		}
		fetchData()
	}, [children])

	return (
		<div
			className={`prose max-w-none ${className}`}
			dangerouslySetInnerHTML={{ __html: renderHtml }}
		/>
	)
}


export function api_url(): string {
	if (import.meta.env.MODE === "development")
		return import.meta.env.VITE_API_URL_LOCAL
	return import.meta.env.VITE_API_URL
}