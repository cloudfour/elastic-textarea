customElements.define(
  "elastic-textarea",
  class extends HTMLElement {
    connectedCallback() {
      /**
       * Find all inner textareas and use their rows attributes as a minimum count
       */
      [...this.querySelectorAll("textarea")].forEach((textareaEl) => {
        textareaEl.dataset.minRows = textareaEl.rows || 2;

        // If textareas are prefilled they may need to be resized
        this.update(textareaEl);
      });

      // Use event delegation to listen for textarea inputs and update the areas
      this.addEventListener("input", ({ target }) => {
        if (!target instanceof HTMLTextAreaElement) return;

        this.update(target);
      });
    }

    /**
     * Determine if the element is overflowing
     */
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
        textareaEl.rows = rows;

        // Get height after rows change is made
        const newHeight = textareaEl.clientHeight;

        // If the height hasn't changed, break the loop
        // This is an important safety check in case the height is hard coded
        if (newHeight === previousHeight) break;

        // Store the updated height for the next comparison and proceed
        previousHeight = newHeight;
      }
    }

    /** Shrink until the textarea matches the minimum rows or starts overflowing */
    shrink(textareaEl) {
      // Store initial height of textarea
      let previousHeight = textareaEl.clientHeight;

      const minRows = parseInt(textareaEl.dataset.minRows);
      let rows = this.rows(textareaEl);

      while (!this.isScrolling(textareaEl) && rows > minRows) {
        rows--;
        textareaEl.rows = Math.max(rows, minRows);

        // Get height after rows change is made
        const newHeight = textareaEl.clientHeight;

        // If the height hasn't changed, break the loop
        // This is an important safety check in case the height is hard coded
        if (newHeight === previousHeight) break;

        // If we shrunk so far that we're overflowing, add a row back on.
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
      return textareaEl.rows || parseInt(textareaEl.dataset.minRows);
    }
  }
);
