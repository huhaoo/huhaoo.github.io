
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
		marked.setOptions({
			gfm: true,
			breaks: true,
		})
		const fetchData = async () => {
			const markdownHtml = await marked.parse(children?.toString() ?? "")
			console.log("Markdown HTML:", markdownHtml)
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
