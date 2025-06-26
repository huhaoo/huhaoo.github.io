import { Disclosure } from '@headlessui/react'
// import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

export default function IndexPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <Disclosure as="nav" className="bg-white shadow">
        {({  }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 justify-between">
                <div className="flex items-center">
                  <h1 className="text-xl font-bold text-gray-900">huhao</h1>
                </div>
              </div>
            </div>
          </>
        )}
      </Disclosure>

      {/* 主内容区 */}
      <main className="mx-auto max-w-7xl py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            新博客开发中
          </h2>
        </div>
      </main>
    </div>
  )
}