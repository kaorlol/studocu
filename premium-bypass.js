document.querySelectorAll(".page-content").forEach((page) => {
    const style = window.getComputedStyle(page);
    if (style.filter !== "blur(2px)") return;

    const waitForBlurredImage = new Promise((resolve, reject) => {
        const startTime = Date.now();
        const interval = setInterval(() => {
            const imgMatch = page.innerHTML.match(/<img[^>]*src="([^"]*)"/);
            if (imgMatch) {
                clearInterval(interval);
                resolve(imgMatch[1]);
            } else if (Date.now() - startTime > 5000) {
                clearInterval(interval);
                reject(new Error("Timeout: No blurred image found within 5 seconds."));
            }
        }, 100);
    });

    waitForBlurredImage
        .then((blurredUrl) => {
            const urlMatch = blurredUrl.match(/https:\/\/.*?\/(.*)\/html\/pages\/blurred\/page(\d+)\.webp/);
            if (!urlMatch) return console.error("Failed to parse unique ID and page number.");

            const [_, uniqueId, pageNumberStr] = urlMatch;
            const pageNumber = parseInt(pageNumberStr, 10);

            const pngSuffix = pageNumber > 9 ? String.fromCharCode(96 + (pageNumber - 9)) : pageNumber;

            const unblurredUrl = `https://doc-assets-us-west-1.studocu.com/${uniqueId}/html/${uniqueId}${pageNumber}.page`;

            fetch(unblurredUrl)
                .then((res) => res.text())
                .then((html) => {
                    const tempDiv = document.createElement("div");
                    tempDiv.innerHTML = html;
                    const img = tempDiv.querySelector("img");
                    img.src = `https://doc-assets-us-west-1.studocu.com/${uniqueId}/html/bg${pngSuffix}.png`;

                    const parent = page.parentElement;
                    parent.innerHTML = tempDiv.innerHTML;
                    const firstChild = parent.firstElementChild;
                    if (firstChild) firstChild.style.display = "block";

                    const previewDiv = document.querySelector('div[style="margin-top: -532px;"]');
                    if (previewDiv) previewDiv.remove();
                })
                .catch((err) => console.error("Error fetching unblurred page:", err));
        })
        .catch((err) => console.error(err.message));
});
