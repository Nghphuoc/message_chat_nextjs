"use client";

export default function ChatWindow() {
  return (
    <section className="flex flex-col flex-1 px-6 py-6">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-gray-200 pb-3 mb-4">
        <h2 className="text-sm font-semibold">Group #1</h2>
        <div className="flex items-center space-x-4 text-gray-400 text-lg">
          <button className="hover:text-gray-600">
            <i className="far fa-copy" />
          </button>
          <button className="hover:text-gray-600">
            <i className="fas fa-phone" />
          </button>
          <button className="hover:text-gray-600">
            <i className="fas fa-video" />
          </button>
          <button className="hover:text-gray-600">
            <i className="fas fa-user-plus" />
          </button>

          <div className="flex items-center -space-x-2">
            <img
              className="rounded-full border-2 border-white"
              src="https://storage.googleapis.com/a1aa/image/4cf23f41-8a5f-4d21-7197-c7ae87377368.jpg"
              width="24"
              height="24"
              alt="User"
            />

            <img
              className="rounded-full border-2 border-white"
              src="https://storage.googleapis.com/a1aa/image/a0773811-3e87-4fcc-ea3b-8d900e8daf49.jpg"
              width="24"
              height="24"
              alt="User"
            />
            <div className="w-6 h-6 bg-blue-600 text-white text-xs font-semibold rounded-full border-2 border-white flex items-center justify-center">
              +6
            </div>
          </div>
        </div>
      </header>


      {/* Chat Messages */}
      <div className="flex flex-col space-y-6 overflow-y-auto scrollbar-thin flex-1">
        <div className="flex space-x-3">
          <img className="rounded-full" src="https://storage.googleapis.com/a1aa/image/f7816717-892c-4842-b3e5-15e590093f25.jpg" width="32" height="32" alt="Nagita" />
          <div>
            <div className="flex space-x-2">
              <p className="text-sm font-semibold">Nagita salavina</p>
              <span className="text-xs text-gray-400">1d</span>
            </div>
            <p className="text-sm text-gray-700">Hi, are we going on new year's holiday?</p>
          </div>
        </div>
        <div className="flex justify-end space-x-3">
          <div className="bg-blue-600 text-white text-sm rounded-full px-4 py-2 max-w-max">
            wow, that's an interesting place
          </div>
          <img className="rounded-full" src="https://storage.googleapis.com/a1aa/image/4df810c1-d96a-4fea-e9fc-43ed453fd83c.jpg" width="32" height="32" alt="You" />
        </div>
        <div className="flex space-x-3">
          <i className="fas fa-comment-alt text-gray-400 mt-1 self-end" />
        </div>
      </div>

      {/* Message input */}
      <form className="flex items-center space-x-3 border-t border-gray-200 pt-3 mt-4">
        <button type="button" className="text-gray-400 text-lg hover:text-gray-600">
          <i className="fas fa-plus" />
        </button>
        <input
          className="flex-1 rounded-full border bg-gray-50 px-4 py-2 text-sm text-gray-700"
          placeholder="Type your message here..."
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium">
          Send
        </button>
      </form>
    </section>
  );
}

