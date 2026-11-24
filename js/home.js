import { getUser } from "./api.js";
import { MESSAGES, errorMessage, renderProfileCard, setStatus } from "./render.js";

const status = document.querySelector("#status");
const profile = document.querySelector("#profile");

async function loadProfile() {
  setStatus(status, MESSAGES.loading);

  try {
    const user = await getUser();
    profile.replaceChildren(renderProfileCard(user));
    setStatus(status, "");
  } catch (error) {
    console.error(error);
    setStatus(status, errorMessage(error));
  }
}

loadProfile();
