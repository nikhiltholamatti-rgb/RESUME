import React, { useRef, useEffect } from "react";

export default function AutoGrowTextarea({
  value,
  onChange,
  placeholder,
  className = "",
  minRows = 2,
  id,
  ...props
}) {
  const textareaRef = useRef(null);

  const resize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.max(
        textareaRef.current.scrollHeight,
        minRows * 24
      )}px`;
    }
  };

  useEffect(() => {
    resize();
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      id={id}
      value={value}
      onChange={(e) => {
        onChange?.(e);
        resize();
      }}
      placeholder={placeholder}
      className={`form-input resize-none overflow-hidden transition-[height] duration-75 ${className}`}
      rows={minRows}
      {...props}
    />
  );
}
