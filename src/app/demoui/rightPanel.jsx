"use client";
export default function RightPanel() {
  return (
    <aside className="w-full border-l border-gray-200 px-6 py-8 bg-gradient-to-b from-white to-gray-50 shadow-lg hidden lg:flex flex-col">
      {/* Header */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-800 mb-2">Group Info</h3>
        <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
      </div>

      {/* Group Details */}
      <div className="space-y-6">
        {/* Group Name */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Group Name</p>
          <p className="text-base font-bold text-gray-800">Group #1</p>
        </div>

        {/* Description */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Description</p>
          <p className="text-sm text-gray-700 leading-relaxed">This is a group chat for planning our New Year vacation 🎉</p>
        </div>

        {/* Members */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Members</p>
            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-medium">3</span>
          </div>
          
          <ul className="space-y-3">
            {[
              { name: "Nagita salavina", status: "online", avatar: "N" },
              { name: "Zaidian azka", status: "online", avatar: "Z" },
              { name: "Suneo marinir", status: "away", avatar: "S" },
            ].map((member, idx) => (
              <li key={idx} className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                <div className="relative">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-sm ${
                    member.status === 'online' 
                      ? 'bg-gradient-to-r from-green-400 to-green-500' 
                      : 'bg-gradient-to-r from-gray-400 to-gray-500'
                  }`}>
                    {member.avatar}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                    member.status === 'online' ? 'bg-green-500' : 'bg-yellow-500'
                  }`}></div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">{member.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{member.status}</p>
                </div>
                <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs font-medium text-gray-500 mb-3 uppercase tracking-wide">Quick Actions</p>
          <div className="space-y-2">
            <button className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-blue-50 transition-colors duration-200 text-left">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700">Add Member</span>
            </button>
            <button className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-green-50 transition-colors duration-200 text-left">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700">Share Group</span>
            </button>
            <button className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-red-50 transition-colors duration-200 text-left">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700">Leave Group</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
