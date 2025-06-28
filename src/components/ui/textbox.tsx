import { useEffect, useState, type JSX } from "react";
import toast from "react-hot-toast";

const hl_class = `px-3 py-1.5
  rounded-full
  border border-transparent
  hover:bg-gradient-to-r focus:bg-gradient-to-r
  hover:from-gray-25 focus:from-gray-25
  hover:to-gray-50 focus:to-gray-50
  hover:border-gray-100 focus:border-gray-100
  hover:shadow focus:shadow
  hover:outline-none focus:outline-none
  transition
  cursor-pointer
  select-none
`

export function Text_box_hl({ text, className }: {
  text: string,
  className?: string
}): JSX.Element {
  return (
    <div className={hl_class}>
      <div className={className || ""}>{text}</div>
    </div>
  )
}

export function Text_box_hl_clickable({ text, type, data, className }: {
  text: string,
  type?: "link" | "copy",
  data?: any,
  className?: string
}): JSX.Element {
  if (type == "link")
    return (
      <a href={data} className="!text-black">
        <Text_box_hl text={text} className={className} />
      </a>
    )
  else if (type == "copy") {
    const [copied, setCopied] = useState(false);
    const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const handleClick = (mouse: React.MouseEvent) => {
      navigator.clipboard.writeText(data == null ? text : data).then(() => {
        if (!copied) {
          setCopied(true);
          setMousePos({ x: mouse.clientX, y: mouse.clientY });
          setTimeout(() => setCopied(false), 1500);
        }
      });
    };
    return (
      <div onClick={handleClick}>
        <Text_box_hl text={text} className={className} />
        {copied && (
          <div className="
            absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full
            mt-2
            bg-gray-200 text-black text-xs
            px-3 py-1 rounded-lg
            opacity-80
            animate-fade
            select-none"
            style={{ top: mousePos.y, left: mousePos.x }}>
            Copied!
          </div>
        )}
        <style>{`
            @keyframes fadeOut {
                0% {opacity: 0.8;transform: translate(50%, -10%) translateY(0);}
                100% {opacity: 0;transform: translate(50%, -10%) translateY(-10px);}
            }
            .animate-fade {animation: fadeOut 1.5s forwards;}
        `}</style>
      </div>
    )
  }
  return <Text_box_hl text={text} className={className} />
}

export function Input_text_box({ value, setValue, onEnter, placeholder, className }: {
  value: string,
  setValue: (v: string) => void,
  onEnter?: () => void,
  placeholder?: string,
  className?: string
}): JSX.Element {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          if (onEnter) onEnter();
          e.currentTarget.blur();
        }
      }}
      placeholder={placeholder || "Text ..."}
      className={`${hl_class} ${className || ""}`}
    />
  )
}

export function Settings_text_box({ key_, type, data, className, edit, token, placeholder }: {
  key_: string,
  type?: "link" | "copy",
  data?: any,
  className?: string
  edit: boolean
  token: string
  placeholder?: string
}): JSX.Element {
  const [text, setText] = useState<string>("");
  const API_URL = import.meta.env.VITE_API_URL;
  // console.log(`${API_URL}/api/settings?key=` + key_)
  useEffect(() => {
    fetch(`${API_URL}/api/settings?key=` + key_)
      .then((response) => response.json())
      .then((data) => {setText(data.message);})
      .catch((error) => {console.error(error);});
  }, []);
  if(!edit)
    return (
      <Text_box_hl_clickable
        text={text}
        type={type}
        data={data}
        className={className}
      />
    )
  else
    return (
      <Input_text_box
        value={text}
        setValue={setText}
        onEnter={() => {
          console.log(text);
          fetch(`${API_URL}/api/settings?key=` + key_, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ key: key_, value: text, token: token })
          })
        .then((response) => response.json())
          .then((data) => {
            console.log(data);
            if(data.status==="success")
              toast.success(data.message);
            else
              toast.error(data.message);
          })
          .catch((error) => {toast.error(error);});
        }}
        className={className}
        placeholder={placeholder}
      />
    )
}