if ("documentTransition" in document) {
  async function navigateTo(url) {
    const header = document.querySelector("header");
    const nav = document.querySelector("nav");
    const main = document.querySelector("main");

    await document.documentTransition.prepare({
      rootTransition: "cover-up",
      sharedElements: [header, nav],
    });

    const html = await fetch(url).then((response) => response.text());

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const newMain = doc.querySelector("main");
    main.replaceWith(newMain);

    await document.documentTransition.start({
      sharedElements: [header, nav],
    });

    history.pushState({}, "", url);
  }

  document.body.addEventListener("click", (event) => {
    if (event.target.tagName === "A") {
      const url = new URL(event.target.href);

      const internalLink = url.origin === location.origin;
      const differentPath = url.pathname !== location.pathname;

      if (internalLink && differentPath) {
        event.preventDefault();
        navigateTo(url);
      }
    }
  });
} else {
  console.log("documentTransition not supported in this browser");
}
