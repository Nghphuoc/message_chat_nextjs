"use client";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBolt,
  faUser,
  faCommentAlt,
  faCog,
  faQuestionCircle,
  faSignOutAlt,
} from '@fortawesome/free-solid-svg-icons';


export default function Sidebar() {
  return (
    <aside className="flex flex-col w-20 bg-white border-r border-gray-200 ">
      <button
        aria-label="Home"
        className="flex items-center justify-center w-16 h-16 mx-auto mt-6 mb-8 rounded-full bg-blue-600 text-white text-2xl"
      >
        <FontAwesomeIcon icon={faBolt} />
      </button>
      <nav className="flex flex-col space-y-8 mt-4">
        {[faUser, faCommentAlt, faCog, faQuestionCircle, faSignOutAlt].map((icon, idx) => (
          <button
            key={idx}
            className="flex items-center justify-center w-12 h-12 mx-auto rounded-lg hover:bg-gray-100"
          >
            <FontAwesomeIcon icon={icon} className="text-gray-600 text-lg" />
          </button>
        ))}
      </nav>
    </aside>
  );
}
