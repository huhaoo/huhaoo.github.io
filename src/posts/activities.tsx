import { Textarea } from "@/components/ui/textbox";
import { formatTime, get_var } from "@/utils";
import { EyeIcon, EyeSlashIcon, PaperAirplaneIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

import { defaultPostsPerPage, Pagination } from "@/components/pagination";
import { Block, BlockHeader, Blocks } from "@/components/ui/block";
import { defaultPost, fetchPosts, fetchPostsNum, Post, pushPost } from "@/posts/utils";
import { DefaultPage } from "@/sidebar";
import { useSearchParams } from "react-router-dom";

export default function ActivitiesPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [mode, setMode] = useState<"new" | "update">("new");
  const admin_mode = get_var("admin_mode") ?? false;
  const [epost, setEpost] = useState<Post>(defaultPost("activity"));
  const [sending, setSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [numPosts, setNumPosts] = useState(-1);
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  useEffect(() => {
    const limitation: Post = {
      category: "activity",
      deleted: false,
      private: get_var("admin_mode") ? undefined : false
    }
    fetchPostsNum(setNumPosts, limitation);
    fetchPosts(posts, setPosts, limitation, (currentPage - 1) * defaultPostsPerPage, defaultPostsPerPage);
  }, []);
  const pushPost_ = () => {
    if (sending) return;
    console.log("Pushing post", JSON.stringify(epost));
    if ((epost.content ?? "") == "") { toast.error("内容不能为空"); return; }
    setSending(true);
    pushPost(epost, mode, (success) => { if (success) setEpost(defaultPost("activity")); setSending(false); });
  }
  return (
    <DefaultPage>
      <Blocks>
        {admin_mode &&
          <Block>
            <BlockHeader>
              {mode == "update" && <div>#{epost.id} 编辑中</div>}
              <div className="ml-auto cursor-pointer" onClick={() => { setEpost({ ...epost, private: !epost.private }); }}>
                {epost.private ? <EyeSlashIcon className="w-3 h-3" /> : <EyeIcon className="w-3 h-3" />}
              </div>
            </BlockHeader>
            <div className="border border-gray-200 rounded-lg pb-2 mb-2">
              <Textarea placeholder="标题" className="text-xl font-semibold mx-2 pt-1" rows={1} text={epost.title ?? ""} setText={(text) => setEpost({ ...epost, title: text })} />
              <hr className="border-gray-200 mx-6" />
              <Textarea placeholder="写点什么吧…" className="mx-2 pt-1" text={epost.content ?? ""} setText={(text) => setEpost({ ...epost, content: text })} ref={textareaRef} onKeyDown={(e) => {
                if ((e.ctrlKey || e.metaKey) && e.key == "Enter") pushPost_();
              }} />
            </div>
            <div className="flex justify-end">
              <button
                className="bg-gray-100 hover:bg-gray-200 active:bg-gray-300 p-2 w-10 h-10 rounded-lg shadow hover:shadow-md flex items-center justify-center outline-none border-none transition-colors duration-150"
                onClick={pushPost_}
              >
                {sending ?
                  <div className="w-5 h-5 ml-1 animate-spin border-2 border-t-transparent border-gray-500 rounded-full" /> :
                  <PaperAirplaneIcon className="w-5 h-5 rotate-315 ml-1" />
                }
              </button>
            </div>
          </Block>
        }
        {posts.map((post) => (
          <Block key={post.id}>
            <BlockHeader>
              <div>#{post.id}</div>
              <div>{formatTime(post.create_time)}</div>
              {post.update_time != post.create_time && <div>编辑于 {formatTime(post.update_time)}</div>}
              {get_var("admin_mode") &&
                <div className="ml-auto flex flex-row space-x-2">
                  <div className="cursor-pointer" onClick={() => {
                    console.log(post.content)
                    if (mode == "update" && epost.id == post.id) {
                      setMode("new");
                      setEpost(defaultPost("activity"));
                    } else {
                      setMode("update");
                      setEpost(post);
                      textareaRef.current?.focus();
                    }
                  }}>
                    <PencilIcon className="w-3 h-3" />
                  </div>
                  <div className="cursor-pointer" onClick={() => {
                    pushPost({ id: post.id, private: !post.private }, "update", () => setPosts(posts.map(p => p.id == post.id ? { ...p, private: !p.private } : p)));
                  }}>
                    {post.private ? <EyeSlashIcon className="w-3 h-3" /> : <EyeIcon className="w-3 h-3" />}
                  </div>
                  <div className="cursor-pointer" onClick={() => {
                    pushPost({ id: post.id, deleted: true }, "update", () => setPosts(posts.filter(p => p.id != post.id)));
                  }}>
                    <TrashIcon className="w-3 h-3" />
                  </div>
                </div>
              }
            </BlockHeader>
            {post.title && post.title != "" && <div className="text-xl font-semibold underline">{post.title}</div>}
            <div className="mt-1 whitespace-pre-line break-words">{post.content}</div>
          </Block>
        ))}
        <Pagination numPosts={numPosts} searchParams={searchParams} setSearchParams={setSearchParams} />
      </Blocks>
    </DefaultPage>
  );
};