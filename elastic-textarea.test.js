// If you want to use module imports you’ll need to configure
//  Jest and Babel to use ESM
// See https://jestjs.io/docs/getting-started#using-babel
const { withBrowser } = require("pleasantest");

const initTextareaJS = (utils) => utils.runJS(`import './index.js'`);

test(
  "Resizes correctly with no rows attribute",
  withBrowser(async ({ utils, screen, user }) => {
    await utils.injectHTML(`
      <elastic-textarea>
        <textarea></textarea>
      </elastic-textarea>
    `);
    const textarea = await screen.getByRole("textbox");
    await initTextareaJS(utils);

    textarea.evaluate((el) => (el.style.width = "500px"));

    // Default of 2 rows
    await expect(textarea).toHaveAttribute("data-min-rows", "2");

    // This wraps, so both lines should be full now
    await user.type(
      textarea,
      "this is a very long sentence with a lot of words that make it wrap"
    );
    // 2 rows is the default, so we don't need a rows attribute
    await expect(textarea).not.toHaveAttribute("rows");

    // Enter is pressed, so now there should be 3 lines (this line doesn't wrap)
    await user.type(textarea, "{enter}this is a very long sentence with a lot");
    await expect(textarea).toHaveAttribute("rows", "3");

    // After emptying it out, it should have 2 rows, since that is the default
    await user.clear(textarea);
    await expect(textarea).toHaveAttribute("rows", "2");
  })
);

test(
  "Allows you to override the minimum number of rows",
  withBrowser(async ({ utils, screen, user }) => {
    await utils.injectHTML(`
      <elastic-textarea>
        <textarea rows="1"></textarea>
      </elastic-textarea>
    `);
    const textarea = await screen.getByRole("textbox");
    await initTextareaJS(utils);
    await textarea.evaluate((el) => (el.style.width = "500px"));

    // Starts at 1 row since we set rows attribute
    await expect(textarea).toHaveAttribute("rows", "1");

    await user.type(textarea, "I have {enter}{enter}{enter} a long message");
    await expect(textarea).toHaveAttribute("rows", "4");

    // After emptying it out, it should have 1 row, since that is what we initialized `rows` to
    await user.clear(textarea);
    await expect(textarea).toHaveAttribute("rows", "1");
  })
);

test(
  "Resizes on initial load",
  withBrowser(async ({ utils, screen, user }) => {
    await utils.injectHTML(`
      <elastic-textarea>
        <textarea>
        I have
        
        
        
        a long message
        </textarea>
      </elastic-textarea>
    `);
    const textarea = await screen.getByRole("textbox");
    textarea.evaluate((el) => (el.style.width = "500px"));

    await initTextareaJS(utils);

    await expect(textarea).toHaveAttribute("rows", "6");
  })
);

test(
  "Supports multiple textareas",
  withBrowser(async ({ utils, screen, user }) => {
    await utils.injectHTML(`
      <elastic-textarea>
        <textarea name="textarea-1" aria-label="textarea-1"></textarea>
        <textarea name="textarea-2" aria-label="textarea-2"></textarea>
      </elastic-textarea>
    `);
    const textarea1 = await screen.getByRole("textbox", { name: "textarea-1" });
    const textarea2 = await screen.getByRole("textbox", { name: "textarea-2" });
    textarea1.evaluate((el) => (el.style.width = "500px"));
    textarea2.evaluate((el) => (el.style.width = "500px"));

    await initTextareaJS(utils);

    await user.type(textarea1, "I have {enter}{enter}{enter} a long message");
    await expect(textarea1).toHaveAttribute("rows", "4");

    await user.type(textarea2, "I have {enter}{enter} a medium message");
    await expect(textarea2).toHaveAttribute("rows", "3");
  })
);
