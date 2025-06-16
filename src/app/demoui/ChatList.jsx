"use client";
export default function ChatList() {
  return (
    <div className="hidden md:flex w-80 flex-col border-r border-gray-200 bg-white">

      <section className="flex flex-col w-80 border-r border-gray-200 px-5 py-6">
      {/* User Info */}
      <div className="flex items-center space-x-3 mb-8">
        <img className="rounded-full" src="https://storage.googleapis.com/a1aa/image/e15f9630-bf6e-41b6-90e8-2df7a4517e02.jpg" width="40" height="40" alt="Rohmad Khoir" />
        <div>
          <p className="text-sm font-semibold">Rohmad Khoir</p>
          <p className="text-xs text-gray-400">My account</p>
        </div>
      </div>

      {/* Online Users */}
      <div className="mb-6">
        <p className="text-sm font-semibold mb-3">Online now</p>
        <div className="flex items-center space-x-3">
          {[
            "4cf23f41-8a5f-4d21-7197-c7ae87377368",
            "a0773811-3e87-4fcc-ea3b-8d900e8daf49",
            "942f765a-82e3-45f5-467d-6af82467557f",
            "4b748e32-024c-4824-9c3c-60206204ddc3",
          ].map((id, i) => (
            <img
              key={i}
              className="rounded-full border-2 border-white shadow-sm"
              src={`https://storage.googleapis.com/a1aa/image/${id}.jpg`}
              width="32"
              height="32"
              alt={`User ${i + 1}`}
            />
          ))}
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-semibold" title="+6 more">
            +6
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold">Messages</p>
        <button className="text-gray-400 hover:text-gray-600">
          <i className="fas fa-chevron-down" />
        </button>
      </div>
      <div className="mb-4">
        <input className="w-full rounded-lg border bg-gray-50 px-3 py-2 text-sm text-gray-500" placeholder="Search" />
      </div>
      <ul className="flex flex-col space-y-4 overflow-y-auto scrollbar-thin" style={{ maxHeight: "400px" }}>
        {/* Sample Message */}
        <li className="flex items-center space-x-3">
          <img className="rounded-full" src="https://storage.googleapis.com/a1aa/image/44c5dedb-c60c-47f5-04c5-d3cd4b60e8da.jpg" width="32" height="32" alt="Suneo" />
          <div className="flex flex-col flex-1">
            <p className="text-sm font-semibold">Suneo Marinir</p>
            <p className="text-xs text-gray-400">Suneo is typing...</p>
          </div>
          <div className="w-6 h-6 bg-blue-600 text-white text-xs font-semibold rounded-full flex items-center justify-center">2</div>
        </li>
      </ul>
    </section>
    </div>
  );
}
