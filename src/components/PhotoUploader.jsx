import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Cropper from "react-easy-crop";
import { useResume } from "../context/ResumeContext";
import { TEMPLATES } from "./templates/templateData";
import getCroppedImg from "../utils/cropImage";

export default function PhotoUploader() {
  const { state, dispatch, ACTIONS } = useResume();
  const { photo, showPhoto, photoShape, selectedTemplate } = state;

  const [imageToCrop, setImageToCrop] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const fileInputRef = useRef(null);

  // Photo supporting templates
  const photoSupportingIds = ["modern", "creative", "executive"];
  const currentTemplate = TEMPLATES.find((t) => t.id === selectedTemplate) || TEMPLATES[0];
  const supportsPhoto = photoSupportingIds.includes(selectedTemplate);

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleFile = (file) => {
    setErrorMessage("");
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setErrorMessage("Please upload a JPG, PNG, or WebP image.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setErrorMessage("File exceeds 2MB limit. Please upload a smaller image.");
      return;
    }

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setImageToCrop(reader.result);
      setZoom(1);
      setCrop({ x: 0, y: 0 });
    });
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleApplyCrop = async () => {
    if (!imageToCrop || !croppedAreaPixels) return;
    try {
      setIsProcessing(true);
      const croppedBase64 = await getCroppedImg(imageToCrop, croppedAreaPixels);
      dispatch({ type: ACTIONS.SET_PHOTO, payload: croppedBase64 });
      setImageToCrop(null);
    } catch (err) {
      console.error("Error cropping image:", err);
      setErrorMessage("Failed to crop image. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="mb-4">
      {/* Switch Toggle */}
      <div className="flex items-center justify-between p-3 rounded-[var(--radius-xs)] bg-[var(--bg-glass-strong)] border border-[var(--border-glass)]">
        <div className="flex items-center gap-2.5">
          <span className="text-sm font-semibold text-white">Include profile photo</span>
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-[var(--text-secondary)] border border-white/10">
            Optional
          </span>
        </div>

        {/* Toggle switch: blue track only when ON, knob slides with translate-x */}
        <button
          type="button"
          role="switch"
          aria-checked={showPhoto}
          className={`w-12 h-6 flex items-center rounded-full p-0.5 transition-colors duration-200 cursor-pointer ${
            showPhoto ? "bg-blue-600 shadow-[0_0_12px_rgba(37,99,235,0.4)]" : "bg-white/10"
          }`}
          onClick={() => dispatch({ type: ACTIONS.SET_SHOW_PHOTO, payload: !showPhoto })}
        >
          <span
            className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
              showPhoto ? "translate-x-6" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/* Upload area BELOW the toggle with 16px gap */}
      <AnimatePresence>
        {showPhoto && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="mt-4 p-4 rounded-[var(--radius-xs)] bg-[var(--bg-input)] border border-[var(--border-glass)] space-y-3.5">
              {/* Template hint if chosen template doesn't support photos */}
              {!supportsPhoto && (
                <div className="p-3 rounded-[var(--radius-xs)] bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2">
                  <span className="text-sm leading-none">💡</span>
                  <div className="flex-1">
                    <span>
                      <strong>{currentTemplate?.name || "This template"}</strong> is designed without a photo (ATS-friendly). Choose{" "}
                      <button
                        type="button"
                        className="underline font-semibold hover:text-white"
                        onClick={() => dispatch({ type: ACTIONS.SET_TEMPLATE, payload: "modern" })}
                      >
                        Modern Two-Column
                      </button>
                      ,{" "}
                      <button
                        type="button"
                        className="underline font-semibold hover:text-white"
                        onClick={() => dispatch({ type: ACTIONS.SET_TEMPLATE, payload: "creative" })}
                      >
                        Creative Sidebar
                      </button>
                      , or{" "}
                      <button
                        type="button"
                        className="underline font-semibold hover:text-white"
                        onClick={() => dispatch({ type: ACTIONS.SET_TEMPLATE, payload: "executive" })}
                      >
                        Executive
                      </button>{" "}
                      to display your photo.
                    </span>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {errorMessage && (
                <div className="p-2 rounded bg-red-500/15 border border-red-500/30 text-red-400 text-xs flex items-center justify-between">
                  <span>⚠️ {errorMessage}</span>
                  <button
                    type="button"
                    className="text-red-300 hover:text-white ml-2"
                    onClick={() => setErrorMessage("")}
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Flow: Upload -> Crop -> Thumbnail preview -> Remove button */}
              {photo ? (
                /* Thumbnail Preview & Shape / Remove Controls */
                <div className="flex flex-wrap items-center gap-4">
                  <div className="relative group">
                    <img
                      src={photo}
                      alt="Profile preview"
                      crossOrigin="anonymous"
                      className={`w-20 h-20 object-cover border-2 transition-all ${
                        photoShape === "square" ? "rounded-xl" : "rounded-full"
                      }`}
                      style={{
                        borderColor: "var(--accent)",
                        boxShadow: "0 0 16px var(--accent-glow)",
                      }}
                    />
                    <div
                      className={`absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer ${
                        photoShape === "square" ? "rounded-xl" : "rounded-full"
                      }`}
                      onClick={() => fileInputRef.current?.click()}
                      title="Replace photo"
                    >
                      <span className="text-[10px] text-white font-medium">Replace</span>
                    </div>
                  </div>

                  <div className="flex-1 min-w-[200px] space-y-2">
                    <div>
                      <span className="form-label !mb-1 text-xs">Photo Shape:</span>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className={`btn btn-sm !py-1 !px-3 text-xs ${
                            photoShape === "circle" ? "btn-neon" : "btn-outline"
                          }`}
                          onClick={() =>
                            dispatch({ type: ACTIONS.SET_PHOTO_SHAPE, payload: "circle" })
                          }
                        >
                          ⭕ Circle
                        </button>
                        <button
                          type="button"
                          className={`btn btn-sm !py-1 !px-3 text-xs ${
                            photoShape === "square" ? "btn-neon" : "btn-outline"
                          }`}
                          onClick={() =>
                            dispatch({ type: ACTIONS.SET_PHOTO_SHAPE, payload: "square" })
                          }
                        >
                          ⬛ Square
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        className="btn btn-outline btn-sm !py-1 text-xs"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Change Photo
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger-sm btn-sm !py-1 text-xs"
                        onClick={() => dispatch({ type: ACTIONS.REMOVE_PHOTO })}
                      >
                        Remove Photo
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Upload Drop Zone */
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-[var(--radius-xs)] p-6 text-center cursor-pointer transition-all ${
                    isDragging
                      ? "border-[var(--accent)] bg-[var(--accent)]/10"
                      : "border-white/15 hover:border-[var(--accent)]/60 bg-white/5"
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-white/5 mx-auto flex items-center justify-center text-xl mb-2 text-[var(--accent-light)]">
                    📷
                  </div>
                  <p className="text-xs font-semibold text-white">
                    Click to upload or drag & drop photo
                  </p>
                  <p className="text-[11px] text-[var(--text-muted)] mt-1">
                    JPG, PNG, or WebP (Max 2MB)
                  </p>
                </div>
              )}

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFile(e.target.files[0]);
                  }
                  e.target.value = "";
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Crop / Zoom Modal */}
      <AnimatePresence>
        {imageToCrop && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass p-5 rounded-[var(--radius)] max-w-md w-full border border-[var(--border-glass)] shadow-2xl bg-[#0f0e1e]"
            >
              <h3 className="text-sm font-bold text-white mb-2">Crop Profile Photo</h3>
              <p className="text-xs text-[var(--text-muted)] mb-3">
                Adjust zoom and position to center your portrait.
              </p>

              <div className="relative w-full h-64 bg-black/60 rounded overflow-hidden">
                <Cropper
                  image={imageToCrop}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  cropShape={photoShape === "square" ? "rect" : "round"}
                  showGrid={true}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>

              {/* Zoom Slider */}
              <div className="mt-4 flex items-center gap-3">
                <span className="text-xs text-[var(--text-muted)]">Zoom:</span>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.05}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="flex-1 accent-[var(--accent)] cursor-pointer"
                />
              </div>

              {/* Modal Buttons */}
              <div className="mt-5 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => setImageToCrop(null)}
                  disabled={isProcessing}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-neon btn-sm"
                  onClick={handleApplyCrop}
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : "Apply Crop"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
