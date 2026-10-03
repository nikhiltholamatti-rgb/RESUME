export const PAGE_DIMENSIONS = {
  a4: {
    id: "a4",
    name: "A4",
    label: "A4 (210 × 297 mm)",
    width: 794,
    height: 1123,
    paddingTop: 32,
    paddingBottom: 32,
    paddingHorizontal: 36,
  },
  letter: {
    id: "letter",
    name: "Letter",
    label: "Letter (8.5 × 11 in)",
    width: 816,
    height: 1056,
    paddingTop: 30,
    paddingBottom: 30,
    paddingHorizontal: 36,
  },
};

/**
 * Greedily partition resume blocks into pages based on measured DOM heights.
 * Guarantees that headings are never orphaned from their first item.
 */
export function computePagination(measurerEl, pageSize = "a4") {
  const dim = PAGE_DIMENSIONS[pageSize] || PAGE_DIMENSIONS.a4;
  const availableHeight = dim.height - (dim.paddingTop + dim.paddingBottom);

  if (!measurerEl) {
    return {
      pages: [null],
      isLightContent: false,
      dimensions: dim,
      pageCount: 1,
    };
  }

  // Find all elements marked for page measurement in document order
  const blockNodes = Array.from(
    measurerEl.querySelectorAll('[data-page-block="true"]')
  );

  if (blockNodes.length === 0) {
    return {
      pages: [null],
      isLightContent: false,
      dimensions: dim,
      pageCount: 1,
    };
  }

  const blocks = blockNodes.map((el) => {
    const rect = el.getBoundingClientRect();
    const style = window.getComputedStyle(el);
    const marginTop = parseFloat(style.marginTop) || 0;
    const marginBottom = parseFloat(style.marginBottom) || 0;
    const effectiveHeight = Math.ceil(rect.height + marginTop + marginBottom);

    return {
      id: el.getAttribute("data-block-id"),
      type: el.getAttribute("data-block-type") || "item",
      headingFor: el.getAttribute("data-heading-for") || "",
      height: effectiveHeight > 0 ? effectiveHeight : 24,
    };
  });

  const totalHeight = blocks.reduce((sum, b) => sum + b.height, 0);

  const pages = [];
  let currentPage = [];
  let currentHeight = 0;

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];

    // Rule: Heading must never be orphaned from its first item
    if (block.type === "heading") {
      const nextBlock = blocks[i + 1];
      const nextHeight = nextBlock ? nextBlock.height : 30;

      if (
        currentPage.length > 0 &&
        currentHeight + block.height + nextHeight > availableHeight
      ) {
        pages.push(currentPage);
        currentPage = [block.id];
        currentHeight = block.height;
        continue;
      }
    }

    // Normal block placement
    if (currentPage.length > 0 && currentHeight + block.height > availableHeight) {
      pages.push(currentPage);
      currentPage = [block.id];
      currentHeight = block.height;
    } else {
      currentPage.push(block.id);
      currentHeight += block.height;
    }
  }

  if (currentPage.length > 0) {
    pages.push(currentPage);
  }

  // Single page default if only 1 page
  const finalPages = pages.length > 0 ? pages : [blocks.map((b) => b.id)];

  // Keep isLightContent false so content flows consistently with fixed spacing
  const isLightContent = false;

  return {
    pages: finalPages,
    isLightContent: false,
    dimensions: dim,
    pageCount: finalPages.length,
    totalHeight,
  };
}
