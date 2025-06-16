"use client";
export default function RightPanel() {
  return (
    <aside className="w-72 border-l border-gray-200 px-5 py-6 bg-white hidden lg:flex flex-col">
      <h3 className="text-sm font-semibold mb-4">Group Info</h3>
      <p className="text-xs text-gray-400 mb-2">Group Name</p>
      <p className="text-sm font-medium mb-6">Group #1</p>
      <p className="text-xs text-gray-400 mb-2">Description</p>
      <p className="text-sm text-gray-700 mb-6">This is a group chat for planning our New Year vacation 🎉</p>
      <p className="text-xs text-gray-400 mb-2">Members</p>
      <ul className="space-y-2">
        {[
          "Nagita salavina",
          "Zaidian azka",
          "Suneo marinir",
        ].map((name, idx) => (
          <li key={idx} className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-600 uppercase">
              {name.charAt(0)}
            </div>
            <p className="text-sm">{name}</p>
          </li>
        ))}
      </ul>
    </aside>
  );
}
