// import { Disclosure } from '@headlessui/react'
// import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

import { Sidebar } from "./sidebar";

export default function IndexPage() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-8 p-8">
        <div>新博客开发中。</div>
      </div>
    </div>
  )
}