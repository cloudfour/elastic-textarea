import { afterEach, beforeEach, expect, test } from "vitest";
import { page, userEvent } from "vitest/browser";

// Importing the component registers <elastic-textarea> for the whole file.
// Registration is global and one-time, so markup added below is upgraded
// (and therefore resized) the moment it is inserted into the document.
import "./index.js";

// A fixed width plus a monospace font makes wrapping deterministic: roughly 52
// characters fit on a line, so the tests can rely on exact row counts instead
// of on whatever font the browser happens to default to.
const style = "width: 500px; font: 16px monospace;";

let container;

beforeEach(() => {
  container = document.createElement("div");
  document.body.append(container);
});

afterEach(() => {
  container.remove();
});

test("Resizes correctly with no rows attribute", async () => {
  container.innerHTML = `
    <elastic-textarea>
      <textarea style="${style}"></textarea>
    </elastic-textarea>
  `;
  const textarea = page.getByRole("textbox");

  // Default of 2 rows
  await expect.element(textarea).toHaveAttribute("data-min-rows", "2");

  // This wraps, so both lines should be full now
  await userEvent.type(
    textarea,
    "this is a very long sentence with a lot of words that make it wrap"
  );
  // 2 rows is the default, so we don't need a rows attribute
  await expect.element(textarea).not.toHaveAttribute("rows");

  // Enter is pressed, so now there should be 3 lines (this line doesn't wrap)
  await userEvent.type(
    textarea,
    "{Enter}this is a very long sentence with a lot"
  );
  await expect.element(textarea).toHaveAttribute("rows", "3");

  // After emptying it out, it should have 2 rows, since that is the default
  await userEvent.clear(textarea);
  await expect.element(textarea).toHaveAttribute("rows", "2");
});

test("Allows you to override the minimum number of rows", async () => {
  container.innerHTML = `
    <elastic-textarea>
      <textarea rows="1" style="${style}"></textarea>
    </elastic-textarea>
  `;
  const textarea = page.getByRole("textbox");

  // Starts at 1 row since we set rows attribute
  await expect.element(textarea).toHaveAttribute("rows", "1");

  await userEvent.type(textarea, "I have {Enter}{Enter}{Enter} a long message");
  await expect.element(textarea).toHaveAttribute("rows", "4");

  // After emptying it out, it should have 1 row, since that is what we initialized `rows` to
  await userEvent.clear(textarea);
  await expect.element(textarea).toHaveAttribute("rows", "1");
});

test("Resizes on initial load", async () => {
  // Six lines of prefilled content, so the component has to resize during
  // `connectedCallback` rather than in response to an `input` event.
  container.innerHTML = `
    <elastic-textarea>
      <textarea style="${style}">I have\n\n\n\n\na long message</textarea>
    </elastic-textarea>
  `;
  const textarea = page.getByRole("textbox");

  await expect.element(textarea).toHaveAttribute("rows", "6");
});

test("Supports multiple textareas", async () => {
  container.innerHTML = `
    <elastic-textarea>
      <textarea name="textarea-1" aria-label="textarea-1" style="${style}"></textarea>
      <textarea name="textarea-2" aria-label="textarea-2" style="${style}"></textarea>
    </elastic-textarea>
  `;
  const textarea1 = page.getByRole("textbox", { name: "textarea-1" });
  const textarea2 = page.getByRole("textbox", { name: "textarea-2" });

  await userEvent.type(textarea1, "I have {Enter}{Enter}{Enter} a long message");
  await expect.element(textarea1).toHaveAttribute("rows", "4");

  await userEvent.type(textarea2, "I have {Enter}{Enter} a medium message");
  await expect.element(textarea2).toHaveAttribute("rows", "3");
});

test("Still shrinks when over 10 rows", async () => {
  container.innerHTML = `
    <elastic-textarea>
      <textarea style="${style}"></textarea>
    </elastic-textarea>
  `;
  const textarea = page.getByRole("textbox");

  await userEvent.type(
    textarea,
    "{Enter}{Enter}{Enter}{Enter}{Enter}{Enter}{Enter}{Enter}{Enter}{Enter}"
  );
  await expect.element(textarea).toHaveAttribute("rows", "11");

  // After emptying it out, it should have 2 rows, since that is the default
  await userEvent.clear(textarea);
  await expect.element(textarea).toHaveAttribute("rows", "2");
});
