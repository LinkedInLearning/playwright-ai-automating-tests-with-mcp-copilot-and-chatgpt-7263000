export const searchBugs = [
  {
    title: "Login page crashes on empty password",
    severity: "HIGH",
    owner: "buggy",
    description: "App crashes when submitting an empty password on login.",
  },
  {
    title: "Login page redirect fails after auth",
    severity: "MID",
    owner: "buggy",
    description: "User is not redirected to board after successful login.",
  },
  {
    title: "Login page error message not shown",
    severity: "LOW",
    owner: "buggy",
    description: "No error message appears for invalid credentials.",
  },
  {
    title: "Login page enter key stops working",
    severity: "MID",
    owner: "buggy",
    description: "Enter key does not submit the login form.",
  },
  {
    title: "Board page fails to load",
    severity: "HIGH",
    owner: "buggy",
    description: "The bug board is empty even when bugs exist in the database.",
  },
  {
    title: "Search field disappears on page resize",
    severity: "LOW",
    owner: "buggy",
    description: "The search input is not visible after resizing the window.",
  },
  {
    title: "Severity dropdown missing on create page",
    severity: "MID",
    owner: "buggy",
    description:
      "The severity dropdown does not render in the create bug modal.",
  },
  {
    title: "Create page modal does not close on cancel",
    severity: "LOW",
    owner: "buggy",
    description: "The create bug modal stays open after clicking Cancel.",
  },
  {
    title: "Title bar logo missing on page load",
    severity: "LOW",
    owner: "buggy",
    description: "The logo image does not appear in the title bar.",
  },
  {
    title: "Sort resets on page refresh",
    severity: "MID",
    owner: "buggy",
    description: "Sorting order is lost when the page is refreshed.",
  },
];
