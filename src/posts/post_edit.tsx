import { useEffect, useState } from "react";
import { get_var, MarkdownWithMath, set_var } from "@/utils";

import { fetchPost, pushPost, Post } from "@/posts/utils";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

export default function PostEditPage() {
  const {postId} = useParams<{postId?: string}>();
  const [post, setPost] = useState<Post>(Object.assign(new Post(), {
    category: "post",
    priority: 0,
    deleted: false,
    private: false,
    label: "",
    title: "",
    content: "",
  }));
  if (postId)
    useEffect(() => {
      fetchPost(Number(postId), (post)=>setPost(post));
    }, []);
  return (
    <div className="w-screen h-screen flex flex-col overflow-hidden font-mono text-sm">

      <div className="text-[0.8rem] text-gray-500 flex flex-row space-x-4 px-4 py-2">
        <div className="cursor-pointer" onClick={() => history.back()}>
          ← 返回
        </div>

        <div>
          当前：{postId !== undefined ? <>编辑文章 #{postId}</> : <>新建文章</>}
        </div>

        <div className="ml-auto cursor-pointer" onClick={() => {
          const token = prompt("请输入新的token：", get_var("token") ?? "");
          if (token) set_var("token", token);
        }}>
          更改token
        </div>

        <div className="cursor-pointer" onClick={() => pushPost(post, postId ? "update" : "new", (message) => {
          const match = message.toLowerCase().match(/(\d+)/);
          const id = match ? match[1] : null;
          // console.log(message, match, id)
          if(!id){ toast.error("无法获取文章ID，请手动刷新页面"); setTimeout(() => history.back(), 1000); return; }
          setTimeout(() => location.href = `/posts/${id}`, 1000);
        })}>
          {postId ? "保存" : "发布"}
        </div>
      </div>

      <div className="text-center text-lg font-semibold px-4 py-2 border-y border-gray-200">
        <input
          value={post.title}
          onChange={(e) => setPost({ ...post, title: e.target.value })}
          placeholder="请输入标题…"
          className="w-full text-center font-semibold outline-none bg-transparent placeholder-gray-400"
        />
      </div>

      <div className="flex flex-1 overflow-hidden">

        <div className="w-1/2 h-full relative outline">
          <textarea
            value={post.content}
            onChange={(e) => setPost({ ...post, content: e.target.value })}
            className="w-full h-full resize-none bg-neutral-50 focus:outline-none p-4 tracking-tight leading-relaxed caret-black selection:bg-blue-200
            font-mono text-sm text-black"
            style={{
              lineHeight: "1.5",
              tabSize: 2,
              whiteSpace: "pre-wrap",
              overflowWrap: "break-word",
            }}
            placeholder="在此输入正文…"
          />
        </div>

        <div className="w-px bg-gray-200" />

        <div
          className="w-1/2 h-full overflow-auto px-8 py-6 prose prose-sm max-w-none break-words"
        >
          <MarkdownWithMath>{post.content}</MarkdownWithMath>
        </div>
      </div>
    </div>
  )
};