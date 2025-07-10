import toast from "react-hot-toast";

export const defaultPostsPerPage = 10;
export const defaultPreSufPageNum = 3;

export function Pagination({ numPosts, searchParams, setSearchParams, postsPerPage=defaultPostsPerPage, preSufPageNum=defaultPreSufPageNum }: {
	numPosts: number;
	searchParams: URLSearchParams;
	setSearchParams: (params: URLSearchParams) => void;
	postsPerPage?: number;
	preSufPageNum?: number;
}) {
	const currentPage = Number(searchParams.get("page")) || 1;
	const goToPage = (page: number) => {
		const newParams = new URLSearchParams(searchParams);
		newParams.set("page", String(page));
		setSearchParams(newParams);
		window.location.reload();
	};
	const totalPages = Math.ceil(numPosts / postsPerPage);
	if (numPosts != -1 && totalPages < currentPage) {
		toast.error("当前页码超出范围")
		goToPage(totalPages)
	}
	const handlePrevious = () => { if (currentPage > 1) goToPage(currentPage - 1); };
	const handleNext = () => { if (currentPage < totalPages) goToPage(currentPage + 1); };
	const renderPages = () => {
		const pages = [];
		const visiblePages = new Set<number>();
		visiblePages.add(1);
		visiblePages.add(totalPages);
		for (let i = currentPage - preSufPageNum; i <= currentPage + preSufPageNum; i++) if (i > 1 && i < totalPages) visiblePages.add(i);
		const sortedPages = Array.from(visiblePages).sort((a, b) => a - b);
		let lastPage = 0;
		for (const page of sortedPages) {
			if (page - lastPage > 1) {
				pages.push(
					<button
						key={`ellipsis-${page}`}
						disabled
						className="px-3 py-1 mx-1 rounded bg-gray-100 text-gray-400 cursor-default"
					>
						...
					</button>
				);
			}

			pages.push(
				<button
					key={page}
					onClick={() => goToPage(page)}
					className={`px-3 py-1 mx-1 rounded ${page === currentPage
						? "bg-gray-200 text-black shadow-md"
						: "bg-gray-100 text-black shadow-sm"
						}`}
					style={{ border: "1px solid #f3f4f6" }} // gray-100 border tone
				>
					{page}
				</button>
			);
			lastPage = page;
		}
		return pages;
	};
	return (
		<div className="flex items-center justify-center mt-4">
			<button
				onClick={handlePrevious}
				disabled={currentPage == 1}
				className="px-3 py-1 mx-1 rounded bg-gray-200 text-black shadow-sm disabled:opacity-50"
			>
				←
			</button>

			{renderPages()}

			<button
				onClick={handleNext}
				disabled={currentPage == totalPages}
				className="px-3 py-1 mx-1 rounded bg-gray-200 text-black shadow-sm disabled:opacity-50"
			>
				→
			</button>
		</div>
	);
};