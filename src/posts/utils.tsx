import { api_url, get_var } from "@/utils";
import toast from "react-hot-toast";

const API_URL = api_url();
export const postsPerPage = 10;
const preSufPageNum = 3;
export class Post {
  id?: number;

  category?: string;
  priority?: number;
  deleted?: boolean;
  private?: boolean;
  label?: string;

  title?: string;
  content?: string;

  create_time?: string;
  update_time?: string;
}
export function defaultPost(category: string): Post {
  return {
    category,
    priority: 0,
    deleted: false,
    private: false,
    label: "",
    title: "",
    content: "",
  } as Post;
}

export function fetchPosts(
  posts: Post[],
  setPosts: (posts: Post[]) => void,
  limitation: Post,
  offset?: number,
  limit?: number,
) {
  // console.log(JSON.stringify(limitation));
  var head = `${API_URL}/posts/collect?`;
  for (const key in limitation) if (limitation[key as keyof Post] !== undefined)
    head += `${key}=${encodeURIComponent(limitation[key as keyof Post] as string | number | boolean)}&`;
  // console.log(head)
  if (offset !== undefined) head += `offset=${offset}&`;
  if (limit !== undefined) head += `limit=${limit}&`;
  head = head.slice(0, -1);
  fetch(head, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "token": get_var("token") ?? ""
    }
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        const newPosts = data.message.map((item: any) => Object.assign(new Post(), item))
        setPosts(posts.concat(newPosts));
        // toast.success("Posts fetched successfully");
      } else {
        toast.error(data.message);
      }
    })
    .catch((error) => {
      toast.error(error.message);
    });
}

export function fetchPost(postId: number, setPost: (post: Post) => void) {
  fetch(`${API_URL}/posts/collect/${postId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "token": get_var("token") ?? ""
    }
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        const post = Object.assign(new Post(), data.message);
        setPost(post);
      } else {
        toast.error(data.message);
      }
    })
    .catch((error) => {
      toast.error(error.message);
    });
}

export function fetchPostsNum(setNumPosts: (num: number) => void, limitation: Post) {
  var head = `${API_URL}/posts/count?`;
  for (const key in limitation) if (limitation[key as keyof Post] !== undefined)
    head += `${key}=${encodeURIComponent(limitation[key as keyof Post] as string | number | boolean)}&`;
  head = head.slice(0, -1);
  fetch(head, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "token": get_var("token") ?? ""
    }
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        setNumPosts(data.message);
      } else {
        toast.error(data.message);
      }
    })
    .catch((error) => {
      toast.error(error.message);
    });
}

export function pushPost(body: Post, mode: "new" | "update",
  final: () => void = () => { },
  onSuccess: (message: string) => void = () => setTimeout(() => { window.location.reload(); }, 1000),
) {
  fetch(`${API_URL}/posts/${mode}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', },
    body: JSON.stringify({ ...body, token: get_var("token") ?? "" }),
  }).then((response) => response.json())
    .then((message) => {
      if (message.status === "success") {
        toast.success(message.message);
        onSuccess(message.message);
      } else toast.error(message.message);
      final();
    })
    .catch((error) => { toast.error(error.message); final(); });
};

export const buttonClass = "fixed top-4 right-4 z-50 bg-white text-black border border-gray-300 rounded-full w-12 h-12 flex items-center justify-center shadow-md hover:bg-gray-200 transition-colors duration-200"

export function Pagination({ numPosts, searchParams, setSearchParams }: {
  numPosts: number;
  searchParams: URLSearchParams;
  setSearchParams: (params: URLSearchParams) => void;
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

export default Pagination;
