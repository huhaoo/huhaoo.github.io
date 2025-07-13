
import { useContext, useEffect, useState, type ReactNode } from "react"
import { marked } from "marked"
import katex from "katex"
import DOMPurify from "dompurify"
import "katex/dist/katex.min.css"
import { GlobalContext } from "@/global_context"

function renderMath(content: string, macros: string): string {
	console.log("Global Context:", macros)
	content = content.replace(/\$\$(.+?)\$\$/gs, (_, formula) => {
		try {
			return katex.renderToString(formula, {
				displayMode: true,
				throwOnError: false,
				macros: JSON.parse(macros)
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
	const macros = useContext(GlobalContext)["md_macros"] ?? "{}"
	const [renderHtml, setRenderHtml] = useState<string>("")
	useEffect(() => {
		marked.setOptions({
			gfm: true,
			breaks: true,
		})
		const fetchData = async () => {
			const markdownHtml = await marked.parse(children?.toString() ?? "")
			console.log("Markdown HTML:", markdownHtml)
			const mathRendered = renderMath(markdownHtml, macros)
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
