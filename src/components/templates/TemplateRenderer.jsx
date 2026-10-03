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
  const style = data?.style || {};
  const userChangedColor = Boolean(style.userChangedColor);

  // Keep the "Max ATS / B&W" Classic template readable:
  // only apply the accent color there if the user changes it, with black as default.
  const effectiveAccent =
    tpl === "classic"
      ? userChangedColor
        ? style.accentColor || accentColor || "#111111"
        : "#111111"
      : style.accentColor || accentColor || "#6366f1";

  const fontId = style.fontFamily || data?.fontFamily || "inter";
  const fontStack = getFontStack(fontId);
  const Component = getTemplateComponent(tpl);

  const fontSizeSetting = style.fontSize || data?.fontSize || "medium";
  const spacingSetting = style.spacing || data?.spacing || "normal";
  const headingTransform = style.headingStyle === "normal" ? "none" : "uppercase";
  const showDividers = style.showDividers !== false;

  const fontSizeCss =
    fontSizeSetting === "small" ? "92%" : fontSizeSetting === "large" ? "108%" : "100%";
  const spacingCss =
    spacingSetting === "compact" ? "1.35" : spacingSetting === "relaxed" ? "1.65" : "1.5";

  // Merge effective style into data passed to templates
  const enhancedData = {
    ...data,
    accentColor: effectiveAccent,
    style: {
      ...style,
      accentColor: effectiveAccent,
      fontFamily: fontId,
      fontSize: fontSizeSetting,
      spacing: spacingSetting,
      headingStyle: style.headingStyle || "uppercase",
      showDividers,
      userChangedColor,
    },
  };

  return (
    <div
      className="resume-font-scope"
      style={{
        "--accent": effectiveAccent,
        "--font-family": fontStack,
        "--font-size": fontSizeCss,
        "--spacing": spacingCss,
        "--heading-transform": headingTransform,
        "--divider-display": showDividers ? "block" : "none",
        "--resume-font-family": fontStack,
        fontFamily: "var(--font-family)",
        fontSize: "var(--font-size)",
        lineHeight: "var(--spacing)",
        height: "100%",
        minHeight: "100%",
      }}
    >
      <Component
        data={enhancedData}
        accentColor={effectiveAccent}
        pageBlocks={pageBlocks}
        pageIndex={pageIndex}
        totalPages={totalPages}
        isLightContent={false}
      />
    </div>
  );
}
