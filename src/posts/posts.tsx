import { useEffect, useState } from "react";
import Sidebar from "@/sidebar";
import { formatTime, get_var, MarkdownWithMath } from "@/utils";

import { buttonClass, fetchPost, fetchPosts, pushPost, type Post } from "@/posts/utils";
import { useParams } from "react-router-dom";

export default function PostsPage() {
  const { postId } = useParams<{ postId?: string }>();
  const [posts, setPosts] = useState<Post[]>([]);
  const admin_mode = get_var("admin_mode") || false;
  if (postId)
    useEffect(() => {
      fetchPost(Number(postId), (post) => setPosts([post]));
    }, []);
  else
    useEffect(() => {
      fetchPosts(posts, setPosts, {
        category: "post",
        // category: "activity",
        deleted: false,
        // deleted: true,
        private: get_var("admin_mode") ? undefined : false
      } as Post);
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
                      编辑
                    </a>
                    <div className="cursor-pointer" onClick={() => {
                      pushPost({ id: post.id, private: !post.private }, "update", () => setPosts(posts.map(p => p.id === post.id ? { ...p, private: !p.private } : p)));
                    }}>
                      {!post.private && <>取消</>}公开
                    </div>
                    <div className="cursor-pointer" onClick={() => {
                      pushPost({ id: post.id, deleted: true }, "update", () => setPosts(posts.filter(p => p.id !== post.id)));
                    }}>
                      删除
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
        </div>
      </div>
    </div>

  );
};