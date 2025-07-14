
export function Block({ children, key, className }: {children: React.ReactNode, key?: string|number, className?: string}) {
	return (
		<div className={`w-full bg-white rounded-2xl shadow-md p-4 border border-gray-200 ${className}`} key={key}>
			{children}
		</div>
	);
}

export function Blocks({ children, className }: {children: React.ReactNode, className?: string}) {
	return (
		<div className={`flex-1 m-8 ml-24 mr-56 space-y-2 ${className}`}>
			{children}
		</div>
	);
}

export function BlockHeader({ children, className }: {children: React.ReactNode, className?: string}) {
	return (
		<div className={`flex flex-row text-[0.6rem] text-gray-500 ${className}`}>
			{children}
		</div>
	);
}