export function validateMandatoryResume(state) {
  const errors = [];

  // 1. Personal & Contact
  if (!state.personalInfo?.fullName?.trim()) {
    errors.push({
      sectionId: "personal",
      fieldId: "fullName",
      message: "Full Name is required in Personal Information.",
    });
  }
  if (!state.personalInfo?.email?.trim()) {
    errors.push({
      sectionId: "personal",
      fieldId: "email",
      message: "Email address is required in Personal Information.",
    });
  }

  // 2. Professional Summary
  if (!state.summary?.trim()) {
    errors.push({
      sectionId: "summary",
      fieldId: "summary",
      message: "Professional Summary is required.",
    });
  }

  // 3. Technical Skills
  const hasAnySkill = state.skills && Object.values(state.skills).some((arr) => Array.isArray(arr) && arr.length > 0);
  if (!hasAnySkill) {
    errors.push({
      sectionId: "skills",
      fieldId: "skills",
      message: "At least one skill must be added in Technical Skills.",
    });
  }

  // 4. Work Experience (skipped if fresher)
  if (!state.isFresher) {
    const hasExp =
      state.experience &&
      state.experience.length > 0 &&
      state.experience.some((e) => (e.company && e.company.trim()) || (e.role && e.role.trim()));
    if (!hasExp) {
      errors.push({
        sectionId: "experience",
        fieldId: "experience",
        message: "At least one work experience entry is required (or check 'I am a fresher').",
      });
    }
  }

  // 5. Projects
  const hasProjects =
    state.projects &&
    state.projects.length > 0 &&
    state.projects.some((p) => p.name && p.name.trim());
  if (!hasProjects) {
    errors.push({
      sectionId: "projects",
      fieldId: "projects",
      message: "At least one project entry is required.",
    });
  }

  // 6. Education
  const hasEducation =
    state.education &&
    state.education.length > 0 &&
    state.education.some((e) => e.college && e.college.trim());
  if (!hasEducation) {
    errors.push({
      sectionId: "education",
      fieldId: "education",
      message: "At least one education entry is required.",
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
