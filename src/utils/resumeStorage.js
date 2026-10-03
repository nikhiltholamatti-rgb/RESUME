import { supabase, isSupabaseConfigured } from "./supabaseClient";

/**
 * Fetch all resumes for the current user.
 */
export async function fetchUserResumes(userId) {
  if (!isSupabaseConfigured || !userId) return [];
  try {
    const { data, error } = await supabase
      .from("resumes")
      .select("id, title, template_id, updated_at")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.warn("Could not fetch resumes from Supabase:", err.message);
    return [];
  }
}

/**
 * Fetch a single resume by id.
 */
export async function fetchResumeById(resumeId, userId) {
  if (!isSupabaseConfigured || !resumeId || !userId) return null;
  try {
    const { data, error } = await supabase
      .from("resumes")
      .select("*")
      .eq("id", resumeId)
      .eq("user_id", userId)
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.warn("Could not fetch resume:", err.message);
    return null;
  }
}

/**
 * Upsert a resume to Supabase resumes table.
 */
export async function saveResumeToCloud({ id, userId, title, templateId, resumeData }) {
  if (!isSupabaseConfigured || !userId) return { success: false, reason: "unconfigured" };

  try {
    const payload = {
      id: id || undefined,
      user_id: userId,
      title: title || resumeData?.personalInfo?.fullName ? `${resumeData.personalInfo.fullName}'s Resume` : "Untitled Resume",
      template_id: templateId || resumeData?.selectedTemplate || "classic",
      data: resumeData,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("resumes")
      .upsert(payload)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.warn("Cloud save error:", err.message);
    return { success: false, error: err };
  }
}

/**
 * Delete a resume by ID.
 */
export async function deleteResumeFromCloud(resumeId, userId) {
  if (!isSupabaseConfigured || !userId) return false;
  try {
    const { error } = await supabase
      .from("resumes")
      .delete()
      .eq("id", resumeId)
      .eq("user_id", userId);

    if (error) throw error;
    return true;
  } catch (err) {
    console.warn("Could not delete resume:", err.message);
    return false;
  }
}
