const FIELD_RULES = {
  "Nom complet": {
    minLength: 2,
    message: "Merci d'indiquer un nom d'au moins 2 caracteres."
  },
  Email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Merci d'indiquer une adresse email valide."
  },
  "Type de demande": {
    requiredValue: true,
    message: "Merci de selectionner le type de demande."
  },
  Message: {
    minLength: 20,
    message: "Votre message doit contenir au moins 20 caracteres."
  },
  "Consentement RGPD": {
    requiredChecked: true,
    message: "Merci d'accepter le traitement des donnees pour continuer."
  }
};

const MIN_SUBMIT_DELAY = 2500;

const UI_MESSAGES = {
  missingFormspree: "Ajoutez votre identifiant Formspree dans l'attribut action du formulaire pour activer l'envoi.",
  success: "Merci, votre message a bien ete envoye. Je vous reponds des que possible.",
  tooFast: "Merci de patienter un instant avant d'envoyer le formulaire.",
  error: "Une erreur est survenue. Vous pouvez aussi me contacter par email."
};

const sanitizeValue = (value) => value.trim().replace(/[<>]/g, "");

const getFieldValue = (field) => {
  if (field.type === "checkbox") {
    return field.checked;
  }

  return sanitizeValue(field.value);
};

const setFieldError = (field, message) => {
  const error = document.getElementById(`${field.id}-error`);
  field.setAttribute("aria-invalid", String(Boolean(message)));

  if (error) {
    error.textContent = message;
  }
};

const validateField = (field) => {
  const value = getFieldValue(field);
  const rules = FIELD_RULES[field.name];

  if (!rules) {
    return true;
  }

  let isValid = true;
  let message = "";

  if (rules.requiredChecked && !value) {
    isValid = false;
    message = rules.message;
  }

  if (isValid && rules.requiredValue && !value) {
    isValid = false;
    message = rules.message;
  }

  if (isValid && typeof value === "string" && value.length < (rules.minLength ?? 0)) {
    isValid = false;
    message = rules.message;
  }

  if (isValid && rules.pattern && typeof value === "string" && !rules.pattern.test(value)) {
    isValid = false;
    message = rules.message;
  }

  setFieldError(field, message);

  if (typeof value === "string") {
    field.value = value;
  }

  return isValid;
};

const setButtonState = (button, state) => {
  button.classList.toggle("is-loading", state === "loading");
  button.disabled = state === "loading";
};

export const initForm = () => {
  const form = document.getElementById("contact-form");

  if (!form) {
    return;
  }

  const fields = [...form.querySelectorAll("input, textarea, select")];
  const submitButton = form.querySelector(".btn--submit");
  const status = form.querySelector(".form-success");
  const trapField = form.querySelector('input[name="_gotcha"]');
  const subjectField = form.querySelector("#form-subject");
  const replyToField = form.querySelector("#form-replyto");
  const emailField = form.querySelector("#email");
  const nameField = form.querySelector("#name");
  const inquiryField = form.querySelector("#inquiry-type");
  const formStartedAt = Date.now();

  fields.forEach((field) => {
    const validate = () => {
      validateField(field);
    };

    field.addEventListener("blur", validate);
    field.addEventListener("change", validate);
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const isValid = fields.every((field) => validateField(field));
    if (!isValid) {
      status.textContent = "";
      return;
    }

    if (Date.now() - formStartedAt < MIN_SUBMIT_DELAY) {
      status.textContent = UI_MESSAGES.tooFast;
      return;
    }

    if (trapField?.value) {
      form.reset();
      fields.forEach((field) => setFieldError(field, ""));
      status.textContent = UI_MESSAGES.success;
      return;
    }

    if (form.action.includes("your-form-id") || form.action.includes("[TON_ID]")) {
      status.textContent = UI_MESSAGES.missingFormspree;
      return;
    }

    setButtonState(submitButton, "loading");
    status.textContent = "";

    const senderName = sanitizeValue(nameField?.value ?? "") || "Contact";
    const senderEmail = sanitizeValue(emailField?.value ?? "");
    const inquiryLabel =
      inquiryField?.options?.[inquiryField.selectedIndex]?.text?.trim() ||
      "Demande generale";

    if (subjectField) {
      subjectField.value = `Nouveau message - ${inquiryLabel} - ${senderName}`;
    }

    if (replyToField) {
      replyToField.value = senderEmail;
    }

    try {
      const response = await fetch(form.action, {
        method: "POST",
        headers: {
          Accept: "application/json"
        },
        body: new FormData(form)
      });

      if (!response.ok) {
        throw new Error("Formspree request failed");
      }

      form.reset();
      fields.forEach((field) => setFieldError(field, ""));
      status.textContent = UI_MESSAGES.success;
    } catch (error) {
      status.textContent = UI_MESSAGES.error;
    } finally {
      setButtonState(submitButton, "idle");
    }
  });
};
