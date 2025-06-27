import { useState, type JSX } from "react";

export function Text_box({ text, className }: {
	text: string,
	className?: string
}): JSX.Element
{
	return (
		<div className="
			px-3 py-1.5
			rounded-full
			border border-transparent
			hover:bg-gradient-to-r
			hover:from-gray-25 hover:to-gray-50
			hover:border-gray-100
			hover:shadow
			transition
			cursor-pointer
			font-mono
		">
			<div className={className||""}>{text}</div>
		</div>
	)
}

export function Text_box_clickable({ text, type, value, className }: {
	text: string,
	type: "link" | "copy",
	value?: any,
	className?: string
}): JSX.Element|undefined
{
	if(type=="link")
		return (
			<a href={value} className="!text-black">
				<Text_box text={text} className={className} />
			</a>
		)
	else if(type=="copy")
	{
		const [copied, setCopied] = useState(false);
		const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
		const handleClick = (mouse: React.MouseEvent) => {
			navigator.clipboard.writeText(value == null ? text : value).then(() => {
				if(!copied)
				{
					setCopied(true);
					setMousePos({ x: mouse.clientX, y: mouse.clientY });
					setTimeout(() => setCopied(false), 1500);
				}
			});
		};
		return (
			<div onClick={handleClick}>
				<Text_box text={text} className={className} />
				{copied && (
				<div className="
					absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full
					mt-2
					bg-gray-200 text-black text-xs
					px-3 py-1 rounded-lg
					opacity-80
					animate-fade
					select-none"
				style={{top: mousePos.y,left: mousePos.x}}>
					Copied!
				</div>
				)}
				<style>{`
					@keyframes fadeOut {
						0% {opacity: 0.8;transform: translate(50%, -10%) translateY(0);}
						100% {opacity: 0;transform: translate(50%, -10%) translateY(-10px);}
					}
					.animate-fade {animation: fadeOut 1.5s forwards;}
				`}</style>
			</div>
		)
	}
}