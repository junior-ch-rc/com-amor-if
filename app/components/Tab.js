const Tab = ({ tabs, activeTab, onTabChange, tabColors }) => (
  <div className="flex border-b">
    {tabs.map((tab) => (
      <button
        key={tab}
        onClick={() => onTabChange(tab)}
        className={`px-4 py-2 ${
          tab === activeTab
            ? "font-bold border-b-2"
            : "text-gray-500 hover:text-black"
        }`}
        style={{
          borderColor: tab === activeTab ? tabColors[tab] : "transparent",
        }}
      >
        {tab}
      </button>
    ))}
  </div>
);

export default Tab;
