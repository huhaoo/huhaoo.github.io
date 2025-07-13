import { useState } from "react";
import ToggleSwitch from "./components/ui/switch";
import { Input_text_box, Settings_text_box, Text_box_hl_clickable } from "./components/ui/textbox";
import { get_var, set_var } from "./utils";

const Sidebar = () => {
  const hr = <hr className="border-gray-200 my-2" />;
  const edit = get_var("admin_mode") ?? false;
  const [token, setToken] = useState(get_var("token") ?? "");
  const block_class = `
    block w-full 
    px-10 font-bold py-3 transition !text-black text-lg
    hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:border-gray-200 hover:shadow hover:outline-none
    duration-200 select-none
  `;
  const path = location.pathname =="/"? "/posts" : window.location.pathname;
  return (
    <div className="w-72 h-screen bg-white border-r border-gray-200 flex flex-col justify-between sticky top-0">
      <div>
        <div className="flex items-center space-x-2 px-6 pt-4">
          <img
            src="https://avatars.githubusercontent.com/u/25236123?v=4&size=64"
            alt="huhaoo"
            className="w-10 h-10 rounded-full"
          />
          <Text_box_hl_clickable
            text="huhao"
            type="link"
            data="https://github.com/huhaoo"
            className="text-lg font-semibold font-serif"
          />
        </div>
        {hr}
        <div className="flex items-center space-x-2 text-sm px-6">
          📞
          <Settings_text_box
            key_="phone"
            type="copy"
            className="select-none font-mono"
            edit={edit}
            placeholder="Phone ..."
          />
        </div>
        <div className="flex items-center space-x-2 text-sm px-6">
          ✉️
          <Settings_text_box
            key_="email"
            type="copy"
            className="select-none font-mono"
            edit={edit}
            placeholder="Email ..."
          />
        </div>
        {hr}
        <a
          rel="noopener noreferrer"
          className={block_class+(path=="/posts"&&" bg-gray-50 border-gray-200 shadow")}
          href={path !== "/posts" ? "/posts" : undefined}
        >
          文章
        </a>
        <hr className="border-gray-200 mx-5" />
        <a
          rel="noopener noreferrer"
          className={block_class+(path=="/activities"&&" bg-gray-50 border-gray-200 shadow")}
          href={path !== "/activities" ? "/activities" : undefined}
        >
          动态
        </a>
      </div>
      <div>
        <div className="flex items-center space-x-2 px-6">
          <ToggleSwitch
            knobSize={20}
            enabled={edit}
            setEnabled={(v: boolean) => { set_var("admin_mode", v); window.location.reload(); }}
            offcolor="#cccccc"
            title={edit ? "Editing mode" : "View mode"}
          />
          <div className="w-12 h-8">
            {edit && <Input_text_box
              value={token}
              setValue={(v: string) => { setToken(v); set_var("token", v); }}
              className="text-sm font-mono w-40"
            />}
          </div>
        </div>
        {hr}
        <div className="text-xs text-gray-500 px-6 pb-4 text-center">
          <p>Powered by huhao, © 2025</p>
        </div>
      </div>
    </div>
  )
};

export default Sidebar;