import { api_url, get_var } from "@/utils";
import toast from "react-hot-toast";

const API_URL = api_url();
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
    head += `${key}=${encodeURIComponent(limitation[key as keyof Post] as string|number|boolean)}&`;
  // console.log(head)
  if (offset !== undefined) head += `offset=${offset}&`;
  if (limit !== undefined) head += `limit=${limit}&`;
  head = head.slice(0, -1);
  fetch(head, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "token": get_var("token") || ""
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
      "token": get_var("token") || ""
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

export function pushPost(body: Post, mode: "new" | "update",
  onSuccess: (message: string) => void = () => setTimeout(() => { window.location.reload(); }, 2000))
{
  fetch(`${API_URL}/posts/${mode}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', },
    body: JSON.stringify({ ...body, token: get_var("token") || "" }),
  }).then((response) => response.json())
    .then((message) => {
      if (message.status === "success") {
        toast.success(message.message);
        onSuccess(message.message);
      } else toast.error(message.message);
    })
    .catch((error) => { toast.error(error.message); });
};

export const buttonClass="fixed top-4 right-4 z-50 bg-white text-black border border-gray-300 rounded-full w-12 h-12 flex items-center justify-center shadow-md hover:bg-gray-100 transition-colors duration-200"