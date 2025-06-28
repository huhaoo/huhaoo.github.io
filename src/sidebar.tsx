import { useState } from "react";
import { Input_text_box, Settings_text_box, Text_box_hl_clickable } from "./components/ui/textbox";
import ToggleSwitch from "./components/ui/switch";
import { get_var, set_var } from "./components/local_storage";

const Sidebar = () => {
  const hr = <hr className="border-gray-200 my-2" />;
  const [edit, setEdit] = useState(get_var("edit_mode") || false);
  const [token, setToken] = useState(get_var("token") || "");
  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center space-x-3">
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
        <div className="flex items-center space-x-2 text-sm">
          📞
          <Settings_text_box
            key_="phone"
            type="copy"
            className="select-none font-mono"
            edit={edit}
            token={token}
            placeholder="Phone ..."
          />
        </div>
        <div className="flex items-center space-x-2 text-sm">
          ✉️
        <Settings_text_box
            key_="email"
            type="copy"
            className="select-none font-mono"
            edit={edit}
            token={token}
            placeholder="Email ..."
          />
        </div>
        {hr}
      </div>
      <div>
        <div className="flex items-center space-x-2">
          <ToggleSwitch
            knobSize={20}
            enabled={edit}
            setEnabled={(v: boolean) => { setEdit(v); set_var("edit_mode", v); }}
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
        <div className="text-xs text-gray-500">
          <p>Powered by huhao, © 2025</p>
        </div>
      </div>
    </div>
  )
};

export default Sidebar;