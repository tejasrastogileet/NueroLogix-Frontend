import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const menu = [
    { name: "Shipments", path: "/dashboard" },
    { name: "Escrow Status", path: "/wallet" },
    { name: "AI Assistant", path: "/ai" },
    { name: "Profile", path: "/profile" },
  ];

  return (
    <div className="w-64 h-screen bg-[#0a0a0f] text-white p-6 border-r border-gray-800">
      <h2 className="text-xl font-bold mb-6 text-[#00FFA3]">NeuroLogix</h2>
      <ul className="space-y-3">
        {menu.map((item) => (
          <li
            key={item.name}
            onClick={() => navigate(item.path)}
            className="cursor-pointer hover:text-[#00FFA3] transition"
          >
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
