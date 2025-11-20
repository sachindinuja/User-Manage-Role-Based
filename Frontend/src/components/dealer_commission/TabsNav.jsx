import React from "react";

function TabsNav({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'slab-performance', label: 'Slab Performance' },
    { id: 'package-rates', label: 'Package Analysis' },
    { id: 'bearer-rates', label: 'Bearer Rates' },
    { id: 'service-overview', label: 'Service Overview' }
  ];

  return (
    <div className="flex flex-wrap gap-2 p-2 bg-black/30 rounded-2xl border border-white/10">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
            activeTab === tab.id
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export default TabsNav;
