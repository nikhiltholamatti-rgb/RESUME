import { createContext, useContext, useReducer, useEffect } from "react";
import sampleData from "../data/sampleData";
import { DEFAULT_FONT } from "../data/fonts";

const STORAGE_KEY = "resume_builder_v3";

let idCounter = 0;
export function generateId(prefix = "item") {
  return `${prefix}-${++idCounter}-${Math.random().toString(36).slice(2, 6)}`;
}

const defaultState = {
  wizardStep: 0,
  formStep: 0,

  fontFamily: DEFAULT_FONT,
  isFresher: false,
  activeOptional: ["achievements"],

  personalInfo: {
    fullName: "",
    headline: "",
    email: "",
    phone: "",
    city: "",
  },

  links: [],

  summary: "",

  education: [],

  skills: {
    languages: [],
    web: [],
    databases: [],
    tools: [],
  },

  projects: [],

  experience: [],

  // Optional sections data
  certifications: [],
  leadership: [],
  achievements: [],
  opensource: [],
  publications: [],
  languages: [],
  interests: [],
  custom: [],
  coursework: [],
  testScores: [],

  photo: null,
  showPhoto: false,
  photoShape: "circle",

  selectedTemplate: "classic",
  accentColor: "#6366f1",
  pageSize: "a4", // "a4" | "letter"
  fontSize: "medium", // "small" | "medium" | "large"
  spacing: "normal", // "compact" | "normal" | "relaxed"

  // Unified Style State
  style: {
    accentColor: "#6366f1",
    fontFamily: DEFAULT_FONT,
    fontSize: "medium", // "small" | "medium" | "large"
    spacing: "normal", // "compact" | "normal" | "relaxed"
    headingStyle: "uppercase", // "uppercase" | "normal"
    showDividers: true,
    userChangedColor: false,
  },

  isBuilding: false,
  isBuilt: false,
};

const A = {
  SET_WIZARD_STEP: "SET_WIZARD_STEP",
  SET_FORM_STEP: "SET_FORM_STEP",
  SET_STYLE: "SET_STYLE",
  SET_FONT_FAMILY: "SET_FONT_FAMILY",
  SET_FONT_SIZE: "SET_FONT_SIZE",
  SET_SPACING: "SET_SPACING",
  SET_ACCENT_COLOR: "SET_ACCENT_COLOR",
  SET_HEADING_STYLE: "SET_HEADING_STYLE",
  SET_SHOW_DIVIDERS: "SET_SHOW_DIVIDERS",
  SET_PAGE_SIZE: "SET_PAGE_SIZE",
  SET_IS_FRESHER: "SET_IS_FRESHER",

  TOGGLE_OPTIONAL_SECTION: "TOGGLE_OPTIONAL_SECTION",
  ADD_OPTIONAL_SECTION: "ADD_OPTIONAL_SECTION",
  REMOVE_OPTIONAL_SECTION: "REMOVE_OPTIONAL_SECTION",

  ADD_SECTION_ITEM: "ADD_SECTION_ITEM",
  UPDATE_SECTION_ITEM: "UPDATE_SECTION_ITEM",
  REMOVE_SECTION_ITEM: "REMOVE_SECTION_ITEM",
  REORDER_SECTION_ITEM: "REORDER_SECTION_ITEM",

  UPDATE_PERSONAL: "UPDATE_PERSONAL",
  SET_PHOTO: "SET_PHOTO",
  SET_SHOW_PHOTO: "SET_SHOW_PHOTO",
  SET_PHOTO_SHAPE: "SET_PHOTO_SHAPE",
  REMOVE_PHOTO: "REMOVE_PHOTO",
  ADD_LINK: "ADD_LINK",
  UPDATE_LINK: "UPDATE_LINK",
  REMOVE_LINK: "REMOVE_LINK",
  SET_SUMMARY: "SET_SUMMARY",
  ADD_EDUCATION: "ADD_EDUCATION",
  UPDATE_EDUCATION: "UPDATE_EDUCATION",
  REMOVE_EDUCATION: "REMOVE_EDUCATION",
  SET_SKILLS: "SET_SKILLS",
  ADD_PROJECT: "ADD_PROJECT",
  UPDATE_PROJECT: "UPDATE_PROJECT",
  REMOVE_PROJECT: "REMOVE_PROJECT",
  ADD_EXPERIENCE: "ADD_EXPERIENCE",
  UPDATE_EXPERIENCE: "UPDATE_EXPERIENCE",
  REMOVE_EXPERIENCE: "REMOVE_EXPERIENCE",
  ADD_ACHIEVEMENT: "ADD_ACHIEVEMENT",
  UPDATE_ACHIEVEMENT: "UPDATE_ACHIEVEMENT",
  REMOVE_ACHIEVEMENT: "REMOVE_ACHIEVEMENT",
  SET_TEMPLATE: "SET_TEMPLATE",
  SET_ACCENT_COLOR: "SET_ACCENT_COLOR",
  SET_BUILDING: "SET_BUILDING",
  SET_BUILT: "SET_BUILT",
  LOAD_SAMPLE: "LOAD_SAMPLE",
  RESET: "RESET",
  RESTORE_STATE: "RESTORE_STATE",
};

function reducer(state, action) {
  const { type, payload } = action;
  switch (type) {
    case A.RESTORE_STATE:
      return { ...defaultState, ...payload };
    case A.SET_WIZARD_STEP:
      return { ...state, wizardStep: payload, isBuilt: payload === 2 ? state.isBuilt : false };
    case A.SET_FORM_STEP:
      return { ...state, formStep: payload };

    case A.SET_STYLE: {
      const nextStyle = { ...state.style, ...payload };
      return {
        ...state,
        style: nextStyle,
        accentColor: nextStyle.accentColor,
        fontFamily: nextStyle.fontFamily,
        fontSize: nextStyle.fontSize,
        spacing: nextStyle.spacing,
      };
    }
    case A.SET_FONT_FAMILY: {
      const nextStyle = { ...state.style, fontFamily: payload };
      return { ...state, fontFamily: payload, style: nextStyle };
    }
    case A.SET_FONT_SIZE: {
      const nextStyle = { ...state.style, fontSize: payload };
      return { ...state, fontSize: payload, style: nextStyle };
    }
    case A.SET_SPACING: {
      const nextStyle = { ...state.style, spacing: payload };
      return { ...state, spacing: payload, style: nextStyle };
    }
    case A.SET_HEADING_STYLE: {
      const nextStyle = { ...state.style, headingStyle: payload };
      return { ...state, style: nextStyle };
    }
    case A.SET_SHOW_DIVIDERS: {
      const nextStyle = { ...state.style, showDividers: payload };
      return { ...state, style: nextStyle };
    }
    case A.SET_PAGE_SIZE:
      return { ...state, pageSize: payload };
    case A.SET_IS_FRESHER:
      return { ...state, isFresher: payload };

    case A.TOGGLE_OPTIONAL_SECTION: {
      const active = state.activeOptional || [];
      const exists = active.includes(payload);
      return {
        ...state,
        activeOptional: exists ? active.filter((id) => id !== payload) : [...active, payload],
      };
    }
    case A.ADD_OPTIONAL_SECTION: {
      const active = state.activeOptional || [];
      if (active.includes(payload)) return state;
      return { ...state, activeOptional: [...active, payload] };
    }
    case A.REMOVE_OPTIONAL_SECTION: {
      const active = state.activeOptional || [];
      return { ...state, activeOptional: active.filter((id) => id !== payload) };
    }

    // Generic list items manipulator for all repeatable sections
    case A.ADD_SECTION_ITEM: {
      const { sectionId, item } = payload;
      const list = state[sectionId] || [];
      return {
        ...state,
        [sectionId]: [...list, { id: generateId(sectionId.slice(0, 3)), ...item }],
      };
    }
    case A.UPDATE_SECTION_ITEM: {
      const { sectionId, id, data } = payload;
      const list = state[sectionId] || [];
      return {
        ...state,
        [sectionId]: list.map((it) => (it.id === id ? { ...it, ...data } : it)),
      };
    }
    case A.REMOVE_SECTION_ITEM: {
      const { sectionId, id } = payload;
      const list = state[sectionId] || [];
      return {
        ...state,
        [sectionId]: list.filter((it) => it.id !== id),
      };
    }
    case A.REORDER_SECTION_ITEM: {
      const { sectionId, fromIndex, toIndex } = payload;
      const list = [...(state[sectionId] || [])];
      if (fromIndex < 0 || toIndex < 0 || fromIndex >= list.length || toIndex >= list.length) {
        return state;
      }
      const [moved] = list.splice(fromIndex, 1);
      list.splice(toIndex, 0, moved);
      return {
        ...state,
        [sectionId]: list,
      };
    }

    case A.UPDATE_PERSONAL:
      return { ...state, personalInfo: { ...state.personalInfo, ...payload } };

    case A.SET_PHOTO:
      return { ...state, photo: payload };
    case A.SET_SHOW_PHOTO:
      return { ...state, showPhoto: payload };
    case A.SET_PHOTO_SHAPE:
      return { ...state, photoShape: payload };
    case A.REMOVE_PHOTO:
      return { ...state, photo: null };

    case A.ADD_LINK:
      return { ...state, links: [...state.links, { id: generateId("lnk"), type: "LinkedIn", url: "" }] };
    case A.UPDATE_LINK:
      return { ...state, links: state.links.map((l) => (l.id === payload.id ? { ...l, ...payload.data } : l)) };
    case A.REMOVE_LINK:
      return { ...state, links: state.links.filter((l) => l.id !== payload) };

    case A.SET_SUMMARY:
      return { ...state, summary: payload };

    case A.ADD_EDUCATION:
      return {
        ...state,
        education: [...state.education, { id: generateId("edu"), college: "", degree: "", branch: "", startYear: "", endYear: "", cgpa: "" }],
      };
    case A.UPDATE_EDUCATION:
      return { ...state, education: state.education.map((e) => (e.id === payload.id ? { ...e, ...payload.data } : e)) };
    case A.REMOVE_EDUCATION:
      return { ...state, education: state.education.filter((e) => e.id !== payload) };

    case A.SET_SKILLS:
      return { ...state, skills: { ...state.skills, ...payload } };

    case A.ADD_PROJECT:
      return {
        ...state,
        projects: [...state.projects, { id: generateId("proj"), name: "", techStack: "", liveLink: "", githubLink: "", bullets: [""] }],
      };
    case A.UPDATE_PROJECT:
      return { ...state, projects: state.projects.map((p) => (p.id === payload.id ? { ...p, ...payload.data } : p)) };
    case A.REMOVE_PROJECT:
      return { ...state, projects: state.projects.filter((p) => p.id !== payload) };

    case A.ADD_EXPERIENCE:
      return {
        ...state,
        experience: [...state.experience, { id: generateId("exp"), company: "", role: "", duration: "", bullets: [""] }],
      };
    case A.UPDATE_EXPERIENCE:
      return { ...state, experience: state.experience.map((e) => (e.id === payload.id ? { ...e, ...payload.data } : e)) };
    case A.REMOVE_EXPERIENCE:
      return { ...state, experience: state.experience.filter((e) => e.id !== payload) };

    case A.ADD_ACHIEVEMENT:
      return { ...state, achievements: [...state.achievements, { id: generateId("ach"), text: "" }] };
    case A.UPDATE_ACHIEVEMENT:
      return { ...state, achievements: state.achievements.map((a) => (a.id === payload.id ? { ...a, text: payload.text } : a)) };
    case A.REMOVE_ACHIEVEMENT:
      return { ...state, achievements: state.achievements.filter((a) => a.id !== payload) };

    case A.SET_TEMPLATE:
      return { ...state, selectedTemplate: payload };
    case A.SET_ACCENT_COLOR: {
      const nextStyle = { ...state.style, accentColor: payload, userChangedColor: true };
      return { ...state, accentColor: payload, style: nextStyle };
    }
    case A.SET_BUILDING:
      return { ...state, isBuilding: payload };
    case A.SET_BUILT:
      return { ...state, isBuilt: payload, isBuilding: false };

    case A.LOAD_SAMPLE:
      return {
        ...state,
        ...sampleData,
        wizardStep: state.wizardStep,
        formStep: state.formStep,
        selectedTemplate: state.selectedTemplate,
        style: {
          ...state.style,
        },
        accentColor: state.style?.accentColor || state.accentColor,
        fontFamily: state.style?.fontFamily || state.fontFamily || DEFAULT_FONT,
        fontSize: state.style?.fontSize || state.fontSize || "medium",
        spacing: state.style?.spacing || state.spacing || "normal",
        isBuilding: false,
        isBuilt: false,
      };
    case A.RESET: {
      localStorage.removeItem(STORAGE_KEY);
      return { ...defaultState };
    }
    default:
      return state;
  }
}

const Ctx = createContext(null);

export function ResumeProvider({ children }) {
  const saved = (() => {
    try {
      const draft = localStorage.getItem("resume_guest_draft");
      if (draft) {
        return JSON.parse(draft);
      }
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();

  const initialState = (() => {
    if (!saved) return defaultState;
    const merged = { ...defaultState, ...saved };
    const userAccent = saved.style?.accentColor || saved.accentColor || defaultState.style.accentColor;
    const userFont = saved.style?.fontFamily || saved.fontFamily || defaultState.style.fontFamily;
    const userFontSize = saved.style?.fontSize || saved.fontSize || defaultState.style.fontSize;
    const userSpacing = saved.style?.spacing || saved.spacing || defaultState.style.spacing;
    const userHeadingStyle = saved.style?.headingStyle || defaultState.style.headingStyle;
    const userShowDividers = saved.style?.showDividers !== undefined ? saved.style.showDividers : defaultState.style.showDividers;
    const userChangedColor = saved.style?.userChangedColor !== undefined ? saved.style.userChangedColor : (Boolean(saved.accentColor && saved.accentColor !== "#6366f1"));

    merged.style = {
      accentColor: userAccent,
      fontFamily: userFont,
      fontSize: userFontSize,
      spacing: userSpacing,
      headingStyle: userHeadingStyle,
      showDividers: userShowDividers,
      userChangedColor,
    };
    merged.accentColor = userAccent;
    merged.fontFamily = userFont;
    merged.fontSize = userFontSize;
    merged.spacing = userSpacing;
    return merged;
  })();

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }, [state]);

  return <Ctx.Provider value={{ state, dispatch, ACTIONS: A }}>{children}</Ctx.Provider>;
}

export function useResume() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useResume must be inside ResumeProvider");
  return c;
}

export { A as ACTIONS };
