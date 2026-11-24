import { sendContact } from "./api.js";
import { MESSAGES, sentMessage, setStatus } from "./render.js";

const form = document.querySelector("#contact-form");
const status = document.querySelector("#form-status");
const button = form.querySelector("button[type='submit']");

function readValues() {
  const data = Object.fromEntries(new FormData(form));
  for (const key of Object.keys(data)) {
    data[key] = String(data[key]).trim();
  }
  return data;
}

async function handleSubmit(event) {
  event.preventDefault();
  const values = readValues();

  if (values.name === "") {
    setStatus(status, MESSAGES.nameRequired);
    form.elements.name.focus();
    return;
  }

  if (values.message.length < 10) {
    setStatus(status, MESSAGES.messageTooShort);
    form.elements.message.focus();
    return;
  }

  setStatus(status, MESSAGES.sending);
  button.disabled = true;

  try {
    await sendContact(values);
    setStatus(status, sentMessage(values.name));
    form.reset();
  } catch (error) {
    console.error(error);
    setStatus(status, MESSAGES.sendFailed);
  } finally {
    button.disabled = false;
  }
}

form.addEventListener("submit", handleSubmit);
