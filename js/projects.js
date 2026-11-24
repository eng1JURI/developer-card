import { getRepos } from "./api.js";
import { MESSAGES, errorMessage, renderRepoList, setStatus } from "./render.js";

// أسماء المستودعات اللي تبغين تعرضينها. إذا فاضية أو ما طابق ولا اسم، تظهر أحدث 5.
const FEATURED = ["SPACE"];

const status = document.querySelector("#status");
const list = document.querySelector("#repos");

function pickRepos(repos) {
  const own = repos.filter((repo) => !repo.fork);
  const featured = own.filter((repo) => FEATURED.includes(repo.name));
  return featured.length > 0 ? featured : own.slice(0, 5);
}

async function loadRepos() {
  setStatus(status, MESSAGES.loading);

  try {
    const repos = pickRepos(await getRepos());

    if (repos.length === 0) {
      list.replaceChildren();
      setStatus(status, MESSAGES.noRepos);
      return;
    }

    renderRepoList(list, repos);
    setStatus(status, "");
  } catch (error) {
    console.error(error);
    setStatus(status, errorMessage(error));
  }
}

loadRepos();
