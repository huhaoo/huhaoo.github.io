import { Text_box_clickable } from "./components/ui/textbox";

const Sidebar = () => {
  const hr= <hr className="border-gray-200 my-2" />;
  return (
		<div className="w-64 h-screen bg-white border-r border-gray-200 p-6">
			<div className="flex items-center space-x-3">
				<img 
					src="https://avatars.githubusercontent.com/u/25236123?v=4&size=64" 
					alt="huhaoo"
					className="w-10 h-10 rounded-full"
				/>
				<Text_box_clickable
					text="huhao"
					type="link"
					value="https://github.com/huhaoo"
					className="text-lg font-semibold font-serif"
				/>
			</div>
			{hr}
			<div className="flex items-center space-x-2 text-sm">
				📞
				<Text_box_clickable
					text="(+86) 153-9997-7699"
					type="copy"
					className="select-none "
				/>
			</div>
			<div className="flex items-center space-x-2 text-sm">
				✉️
				<Text_box_clickable
					text="hh826538400@outlook.com"
					type="copy"
					className="select-none "
				/>
			</div>
			{hr}
		</div>
  )
};

export default Sidebar;