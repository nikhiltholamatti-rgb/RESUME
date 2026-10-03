import { FileText, LayoutTemplate, Palette, Eye } from "lucide-react";

export default function MobileTabBar({ activeTab, onTabChange }) {
  const tabs = [
    {
      id: "edit",
      label: "Edit",
      icon: FileText,
      description: "Content",
    },
    {
      id: "templates",
      label: "Templates",
      icon: LayoutTemplate,
      description: "Themes",
    },
    {
      id: "design",
      label: "Design",
      icon: Palette,
      description: "Styles",
    },
    {
      id: "preview",
      label: "Preview",
      icon: Eye,
      description: "Live",
    },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-[#070714]/95 backdrop-blur-2xl border-t border-[var(--border-glass)] shadow-[0_-10px_35px_rgba(0,0,0,0.6)] px-2.5 pt-2 pb-[max(8px,env(safe-area-inset-bottom))]"
    >
      <div className="grid grid-cols-4 gap-1.5 max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`min-h-[48px] py-1.5 px-1 rounded-xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer relative select-none active:scale-95 ${
                isActive
                  ? "bg-indigo-500/20 text-white border border-indigo-500/35 shadow-[0_0_15px_rgba(99,102,241,0.25)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-secondary)] border border-transparent"
              }`}
            >
              {/* Active Glow Dot */}
              {isActive && (
                <div className="absolute -top-1 w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_#818cf8]" />
              )}
              <Icon
                size={19}
                className={`transition-colors ${
                  isActive ? "text-indigo-400 stroke-[2.4]" : "stroke-[1.8]"
                }`}
              />
              <span
                className={`text-[11px] leading-none transition-all ${
                  isActive ? "font-bold text-white" : "font-medium"
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
