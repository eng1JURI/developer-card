// بناء العناصر من البيانات. كل النصوص بـ textContent، والعناصر بـ createElement.

export const MESSAGES = {
  loading: "جاري التحميل...",
  notFound: "الحساب مو موجود، تأكد من اسم المستخدم في الكود.",
  rateLimit: "وصلت للحد المسموح من الطلبات، جرّب بعد شوي",
  failed: "تعذّر جلب البيانات، تأكد من الإنترنت وجرّب مرة ثانية",
  noBio: "لا يوجد نبذة",
  noDescription: "بدون وصف",
  noRepos: "ما فيه مستودعات",
  sending: "جاري الإرسال...",
  sendFailed: "فشل الإرسال، جرّب مرة ثانية",
  nameRequired: "اكتب اسمك من فضلك",
  messageTooShort: "الرسالة لازم تكون 10 أحرف على الأقل",
};

export function sentMessage(name) {
  return `نجح الإرسال، شكرًا ${name}`;
}

export function el(tag, options = {}, children = []) {
  const node = document.createElement(tag);

  if (options.className) node.className = options.className;
  if (options.text !== undefined) node.textContent = options.text;

  for (const [name, value] of Object.entries(options.attrs ?? {})) {
    node.setAttribute(name, value);
  }

  node.append(...children);
  return node;
}

function arabicText(text) {
  return el("span", { text, attrs: { lang: "ar" } });
}

function safeUrl(url) {
  return typeof url === "string" && url.startsWith("https://") ? url : "#";
}

export function setStatus(node, message) {
  node.textContent = message;
}

export function errorMessage(error) {
  if (error?.kind === "not-found") return MESSAGES.notFound;
  if (error?.kind === "rate-limit") return MESSAGES.rateLimit;
  return MESSAGES.failed;
}

export function renderProfileCard(user) {
  const displayName = user.name || user.login;
  const bio = user.bio ? document.createTextNode(user.bio) : arabicText(MESSAGES.noBio);

  return el("article", { className: "card profile-card" }, [
    el("img", {
      className: "avatar",
      attrs: {
        src: safeUrl(user.avatar_url),
        alt: `GitHub profile photo of ${displayName}`,
        width: "120",
        height: "120",
      },
    }),
    el("h3", { text: displayName }),
    el("p", {}, [bio]),
    el("ul", { className: "stats" }, [
      el("li", { text: `Followers: ${user.followers}` }),
      el("li", { text: `Public repositories: ${user.public_repos}` }),
    ]),
    el("p", {}, [
      el("a", { text: "View my GitHub profile", attrs: { href: safeUrl(user.html_url) } }),
    ]),
  ]);
}

export function renderRepoCard(repo) {
  const description = repo.description
    ? document.createTextNode(repo.description)
    : arabicText(MESSAGES.noDescription);

  const children = [
    el("h3", {}, [el("a", { text: repo.name, attrs: { href: safeUrl(repo.html_url) } })]),
    el("p", {}, [description]),
  ];

  if (repo.language) {
    children.push(el("p", { text: `Language: ${repo.language}` }));
  }

  return el("article", { className: "card" }, children);
}

export function renderRepoList(container, repos) {
  container.replaceChildren(...repos.map(renderRepoCard));
}
