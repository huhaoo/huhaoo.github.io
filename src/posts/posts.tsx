import { useEffect, useState } from "react";
import Sidebar from "@/sidebar";
import { formatTime, get_var, MarkdownWithMath } from "@/utils";

import Pagination, { buttonClass, fetchPost, fetchPosts, fetchPostsNum, postsPerPage, pushPost, type Post } from "@/posts/utils";
import { useParams, useSearchParams } from "react-router-dom";
import { EyeIcon, EyeSlashIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function PostsPage() {
  const { postId } = useParams<{ postId?: string }>();
  const [posts, setPosts] = useState<Post[]>([]);
  const admin_mode = get_var("admin_mode") ?? false;
  const [numPosts, setNumPosts] = useState(-1);
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  if (postId)
    useEffect(() => {
      fetchPost(Number(postId), (post) => setPosts([post]));
    }, []);
  else
    useEffect(() => {
      const limitation: Post = {
        category: "post",
        deleted: false,
        private: get_var("admin_mode") ? undefined : false
      };
      fetchPosts(posts, setPosts, limitation, (currentPage - 1) * postsPerPage, postsPerPage);
      fetchPostsNum(setNumPosts, limitation);
    }, []);

  const max_preview_length = postId ? 0x7fffffff : 500;

  return (
    <div className="flex w-screen">
      <Sidebar />
      {admin_mode && !postId &&
        <a
          href="/posts/new"
          className={buttonClass}
          title="新建文章"
        >
          <span className="text-[2rem]">＋</span>
        </a>}
      <div className="flex-1 m-8 ml-24 mr-56">
        <div className="space-y-2">
          {posts.map((post) => (
            <div
              key={post.id}
              className="w-full bg-white rounded-2xl shadow-md p-4 border border-gray-200"
            >
              <div className="text-[0.6rem] text-gray-500 flex flex-row space-x-4">
                <div>#{post.id}</div>
                <div>{formatTime(post.create_time)}</div>
                {post.update_time != post.create_time && <div>编辑于 {formatTime(post.update_time)}</div>}
                {get_var("admin_mode") &&
                  <div className="ml-auto flex flex-row space-x-2">
                    <a href={`/posts/edit/${post.id}`}>
                      <PencilIcon className="w-3 h-3" />
                    </a>
                    <div className="cursor-pointer" onClick={() => {
                      pushPost({ id: post.id, private: !post.private }, "update", () => setPosts(posts.map(p => p.id === post.id ? { ...p, private: !p.private } : p)));
                    }}>
                      {post.private ? <EyeSlashIcon className="w-3 h-3" /> : <EyeIcon className="w-3 h-3" />}
                    </div>
                    <div className="cursor-pointer" onClick={() => {
                      pushPost({ id: post.id, deleted: true }, "update", () => setPosts(posts.filter(p => p.id !== post.id)));
                    }}>
                      <TrashIcon className="w-3 h-3" />
                    </div>
                  </div>
                }
              </div>
              <a href={`/posts/${post.id}`} className="text-inherit text-center">
                <MarkdownWithMath className="text-[1.6rem] font-semibold ">{post.title}</MarkdownWithMath>
              </a>
              {post.content &&
                <MarkdownWithMath className="mt-1">{post.content.length < max_preview_length ? post.content : post.content?.slice(0, max_preview_length) + "..."}</MarkdownWithMath>
              }
            </div>
          ))}
          <Pagination numPosts={numPosts} searchParams={searchParams} setSearchParams={setSearchParams}  />
        </div>
      </div>
    </div>

  );
};