customElements.define(
  "elastic-textarea",
  class extends HTMLElement {
    connectedCallback() {
      [...this.querySelectorAll("textarea")].forEach((textareaEl) => {
        textareaEl.setAttribute(
          "data-min-rows",
          textareaEl.getAttribute("rows") || 2
        );

        this.update(textareaEl);
      });

      // TODO: Do I also need change?
      this.addEventListener("input", ({ target }) => {
        if (!target instanceof HTMLTextAreaElement) return;

        this.update(target);
      });
    }

    isScrolling(textareaEl) {
      return textareaEl.scrollHeight > textareaEl.clientHeight;
    }

    /** Grow until the textarea stops scrolling */
    grow(textareaEl) {
      // Store initial height of textarea
      let previousHeight = textareaEl.clientHeight;
      let rows = this.rows(textareaEl);

      while (this.isScrolling(textareaEl)) {
        rows++;
        textareaEl.setAttribute("rows", String(rows));

        // Get height after rows change is made
        const newHeight = textareaEl.clientHeight;

        // If the height hasn't changed, break the loop
        // This safety check is to prevent an infinite loop in IE11
        if (newHeight === previousHeight) break;

        // Store the updated height for the next comparison and proceed
        previousHeight = newHeight;
      }
    }

    /** Shrink until the textarea matches the minimum rows or starts scrolling */
    shrink(textareaEl) {
      const minRows = textareaEl.getAttribute("data-min-rows");
      let rows = this.rows(textareaEl);
      while (!this.isScrolling(textareaEl) && rows > minRows) {
        rows--;
        textareaEl.setAttribute("rows", String(Math.max(rows, minRows)));

        if (this.isScrolling(textareaEl)) {
          this.grow(textareaEl);
          break;
        }
      }
    }

    update(textareaEl) {
      if (this.isScrolling(textareaEl)) {
        this.grow(textareaEl);
      } else {
        this.shrink(textareaEl);
      }
    }

    rows(textareaEl) {
      return textareaEl.getAttribute("rows") || textareaEl.dataset.minRows;
    }
  }
);
