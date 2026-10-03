import React from "react";

export function ResumeBlock({
  id,
  type = "item",
  headingFor,
  children,
  pageBlocks,
  className = "",
  style = {},
}) {
  if (pageBlocks && !pageBlocks.includes(id)) {
    return null;
  }

  const isHeading = type === "heading";

  return (
    <div
      data-page-block="true"
      data-block-id={id}
      data-block-type={type}
      data-heading-for={headingFor || ""}
      className={className}
      style={{
        breakInside: "avoid",
        pageBreakInside: "avoid",
        ...(isHeading
          ? {
              breakAfter: "avoid",
              pageBreakAfter: "avoid",
            }
          : {}),
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export default ResumeBlock;
