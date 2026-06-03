(function () {
  const form = document.querySelector(".contact-form");
  const fields = [...document.querySelectorAll(".contact-form .label-focus")];

  if (!form) return;

  const syncField = (field) => {
    const widget = field.closest(".contact-widget");
    const value = field.value || "";
    field.setAttribute("value", value);
    widget?.classList.toggle("is-filled", value.length > 0);
  };

  fields.forEach((field) => {
    syncField(field);
    field.addEventListener("input", () => syncField(field));
    field.addEventListener("change", () => syncField(field));
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
  });
})();
