import { api_url, get_var } from "@/utils";
import toast from "react-hot-toast";

const API_URL = api_url();
export class Post {
  id?: number;

  category?: string;
  priority?: number;
  visible?: boolean;
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
  var head = `${API_URL}/posts/collect?`;
  for (const key in limitation) if (limitation[key as keyof Post] !== undefined)
    head += `${key}=${encodeURIComponent(limitation[key as keyof Post] || "")}&`;
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