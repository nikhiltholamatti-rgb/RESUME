import ClassicSingleColumn from "./ClassicSingleColumn";
import ModernSplitTwoColumn from "./ModernSplitTwoColumn";
import MinimalistTech from "./MinimalistTech";
import ExecutiveHeader from "./ExecutiveHeader";
import CompactHighDensity from "./CompactHighDensity";
import CorporateSlate from "./CorporateSlate";
import CreativeSidebar from "./CreativeSidebar";
import AcademicCV from "./AcademicCV";
import Timeline from "./Timeline";
import ModularCardGrid from "./ModularCardGrid";

export {
  ClassicSingleColumn,
  ModernSplitTwoColumn,
  MinimalistTech,
  ExecutiveHeader,
  CompactHighDensity,
  CorporateSlate,
  CreativeSidebar,
  AcademicCV,
  Timeline,
  ModularCardGrid,
};

export const TEMPLATE_COMPONENTS = {
  classic: ClassicSingleColumn,
  modern: ModernSplitTwoColumn,
  tech: MinimalistTech,
  executive: ExecutiveHeader,
  compact: CompactHighDensity,
  slate: CorporateSlate,
  creative: CreativeSidebar,
  academic: AcademicCV,
  timeline: Timeline,
  modular: ModularCardGrid,
};

export function getTemplateComponent(templateId) {
  return TEMPLATE_COMPONENTS[templateId] || TEMPLATE_COMPONENTS.classic;
}
