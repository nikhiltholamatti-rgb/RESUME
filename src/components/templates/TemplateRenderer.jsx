import { getFontStack } from "../../data/fonts";
import { getTemplateComponent } from "../../templates";

export default function TemplateRenderer({
  templateId,
  data,
  accentColor,
  pageBlocks,
  pageIndex = 0,
  totalPages = 1,
  isLightContent = false,
}) {
  const tpl = templateId || "classic";
  const color = tpl === "classic" ? "#111111" : accentColor || "#6366f1";
  const fontStack = getFontStack(data?.fontFamily);
  const Component = getTemplateComponent(tpl);

  return (
    <div
      className="resume-font-scope"
      style={{
        "--resume-font-family": fontStack,
        fontFamily: "var(--resume-font-family)",
        height: "100%",
        minHeight: "100%",
      }}
    >
      <Component
        data={data}
        accentColor={color}
        pageBlocks={pageBlocks}
        pageIndex={pageIndex}
        totalPages={totalPages}
        isLightContent={isLightContent}
      />
    </div>
  );
}
