import { useEffect, useRef, useState } from "react";
import Sidebar from "@/sidebar";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { Textarea } from "@/components/ui/textbox";
import { formatTime, get_var, MarkdownWithMath } from "@/utils";
import toast from "react-hot-toast";

import { fetchPosts, pushPost, Post } from "@/posts/utils";

export default function ActivitiesPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [mode, setMode] = useState<"new"|"update">("new");
  const [id, setId] = useState<number|undefined>(undefined);
  const admin_mode = get_var("admin_mode") ?? false;
  const [text,setText]= useState<string>("");
  const [title,setTitle]= useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  useEffect(() => { fetchPosts(posts,setPosts, {
    category: "activity",
    deleted: false,
    private: get_var("admin_mode")?undefined: false
  }); }, []);

  return (
    <div className="flex w-screen">
      <Sidebar />
      <div className="flex-1 m-8 ml-24 mr-56">
        <div className="space-y-2">
          {admin_mode&&
            <div className="w-full bg-white rounded-2xl shadow-md p-4 border border-gray-200 pb-2">
              {mode == "update" && <div className="text-[0.6rem] text-gray-500">#{id} 编辑中</div>}
              <div className="border border-gray-200 rounded-lg pb-2 mb-2">
                <Textarea placeholder="标题" className="text-xl font-semibold mx-2 pt-1" rows={1} text={title} setText={setTitle} />
                <hr className="border-gray-200 mx-6" />
                <Textarea placeholder="写点什么吧…" className="mx-2 pt-1" text={text} setText={setText} ref={textareaRef} />
              </div>
              <div className="flex justify-end">
                <button
                  className="bg-gray-100 hover:bg-gray-200 active:bg-gray-300 p-2 w-10 h-10 rounded-lg shadow hover:shadow-md flex items-center justify-center outline-none border-none transition-colors duration-150"
                  onClick={()=>{
                    if(text==""){ toast.error("内容不能为空"); return; }
                    var body:Post={
                      id: id,
                      category: "activity",
                      priority: 0,
                      deleted: false,
                      private: false,
                      title: title,
                      content: text,
                    }
                    pushPost(body, mode);
                  }}
                >
                  <PaperAirplaneIcon className="w-5 h-5 rotate-315 ml-1" />
                </button>
              </div>
            </div>
          }
          {posts.map((post) => (
            <div
              key={post.id}
              className="w-full bg-white rounded-2xl shadow-md p-4 border border-gray-200"
            >
              <div className="text-[0.6rem] text-gray-500 flex flex-row space-x-4">
                <div>#{post.id}</div>
                <div>{formatTime(post.create_time)}</div>
                {post.update_time!=post.create_time && <div>编辑于 {formatTime(post.update_time)}</div>}
                {get_var("admin_mode") &&
                  <div className="ml-auto flex flex-row space-x-2">
                    <div className="cursor-pointer" onClick={()=>{
                      if (mode === "update" && id === post.id) {
                        setMode("new");
                        setId(undefined);
                        setText(""); setTitle("");
                      } else {
                        setMode("update");
                        setId(post.id);
                        setText(post.content||""); setTitle(post.title||"");
                        textareaRef.current?.focus();
                      }
                    }}>
                      编辑
                    </div>
                    <div className="cursor-pointer" onClick={() =>{
                      pushPost({id: post.id, private: !post.private}, "update", () => setPosts(posts.map(p => p.id === post.id ? {...p, private: !p.private} : p)));
                    }}>
                      {!post.private&&<>取消</>}公开
                    </div>
                    <div className="cursor-pointer" onClick={() =>{
                      pushPost({id: post.id, deleted: true}, "update", () => setPosts(posts.filter(p => p.id !== post.id)));
                    }}>
                      删除
                    </div>
                  </div>
                }
              </div>
              {post.title&&post.title!=""&&<MarkdownWithMath className="text-xl font-semibold underline">{post.title}</MarkdownWithMath>}
              <MarkdownWithMath className="mt-1">{post.content}</MarkdownWithMath>
            </div>
          ))}
        </div>
      </div>
    </div>

  );
};