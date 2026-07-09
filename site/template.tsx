interface Page {
	source: string;
	href: string;
	title: string;
	mime: string;
	extensions: Record<string, unknown>;
}

interface TemplateProps {
	title: string;
	body: string;
	config: Record<string, unknown>;
	pages: Page[];
}

const permalink = (href: string): string =>
	`/${href.replace(/index\.html$/, "")}`;

const postsOf = (pages: Page[]): Page[] =>
	pages
		.filter((p) => p.mime === "text/markdown" && p.href !== "index.html")
		.sort((a, b) =>
			String(b.extensions.date ?? "").localeCompare(
				String(a.extensions.date ?? ""),
			),
		);

const formatDate = (value: unknown): string | undefined => {
	if (typeof value !== "string") return undefined;
	const date = new Date(`${value}T00:00:00Z`);
	if (Number.isNaN(date.getTime())) return value;
	return date.toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
		timeZone: "UTC",
	});
};

const excerptOf = (page: Page): string | undefined => {
	const excerpt = page.extensions.excerpt;
	return typeof excerpt === "string" && excerpt.length > 0
		? excerpt
		: undefined;
};

export default function Template({
	title,
	body,
	config,
	pages,
}: TemplateProps) {
	const siteTitle = String(config.title ?? "");
	const tagline = String(config.tagline ?? "");
	const current = pages.find((p) => p.title === title);
	const isHome = current?.href === "index.html";
	const date = formatDate(current?.extensions.date);
	const posts = postsOf(pages);

	return (
		<html lang="en">
			<head>
				<meta charset="utf-8" />
				<meta name="viewport" content="width=device-width,initial-scale=1" />
				<title>{isHome ? siteTitle : `${title} — ${siteTitle}`}</title>
				<link rel="stylesheet" href="/style.css" />
				<link
					rel="alternate"
					type="application/rss+xml"
					title={siteTitle}
					href="/feed.xml"
				/>
			</head>
			<body>
				<header class="masthead">
					{isHome ? (
						<h1 class="site-title">{siteTitle}</h1>
					) : (
						<p class="site-title">
							<a href="/">{siteTitle}</a>
						</p>
					)}
					{tagline ? <p class="tagline">{tagline}</p> : null}
				</header>
				<div class="layout">
					<main>
						{isHome ? (
							<>
								{posts.map((post) => (
									<article class="entry">
										<h2 class="entry-title">
											<a href={permalink(post.href)}>{post.title}</a>
										</h2>
										{formatDate(post.extensions.date) ? (
											<time class="entry-date">
												{formatDate(post.extensions.date)}
											</time>
										) : null}
										{excerptOf(post) ? (
											<p class="entry-excerpt">{excerptOf(post)}</p>
										) : null}
										<a class="entry-more" href={permalink(post.href)}>
											Read the rest of this entry »
										</a>
									</article>
								))}
							</>
						) : (
							<article class="post">
								<h1 class="post-title">{title}</h1>
								{date ? <time class="entry-date">{date}</time> : null}
								<div
									class="prose"
									dangerouslySetInnerHTML={{ __html: body }}
								/>
							</article>
						)}
					</main>
					<aside class="sidebar">
						<img
							class="avatar"
							src="/avatar.jpg"
							alt="Matthijs van Henten"
							width="160"
							height="160"
						/>
						<p class="bio">
							I'm Matthijs van Henten, Principal Software Engineer at STX
							Group in Amsterdam. The views published here are my own, not
							my employer's. I promise that my blog posts are always
							written by me, and never slop.
						</p>
						<div class="sidebar-search">
							<input
								type="search"
								id="search-input"
								class="search-input"
								placeholder="Search…"
								aria-label="Search posts"
								autocomplete="off"
							/>
							<ul id="search-results" class="search-results" hidden />
						</div>
						<h2 class="sidebar-heading">pages</h2>
						<ul class="sidebar-list">
							<li>
								<a href="/">Home</a>
							</li>
						</ul>
						<h2 class="sidebar-heading">recent posts</h2>
						<ul class="sidebar-list">
							{posts.map((post) => (
								<li>
									<a href={permalink(post.href)}>{post.title}</a>
								</li>
							))}
						</ul>
						<h2 class="sidebar-heading">elsewhere</h2>
						<ul class="sidebar-list">
							<li>
								<a href="https://github.com/mvhenten">GitHub</a>
							</li>
							<li>
								<a href="/feed.xml">RSS</a>
							</li>
						</ul>
					</aside>
				</div>
				<script src="/search.js" />
				<script dangerouslySetInnerHTML={{ __html: SEARCH_WIDGET_SCRIPT }} />
			</body>
		</html>
	);
}

const SEARCH_WIDGET_SCRIPT = `(function () {
	var input = document.getElementById("search-input");
	var results = document.getElementById("search-results");
	if (!input || !results) return;

	var timer = null;

	function permalink(href) {
		return "/" + href.replace(/index\\.html$/, "");
	}

	function render(items) {
		results.innerHTML = "";
		if (!items.length) {
			results.hidden = true;
			return;
		}
		items.forEach(function (item) {
			var li = document.createElement("li");
			var a = document.createElement("a");
			a.href = permalink(item.href);
			a.textContent = item.title;
			li.appendChild(a);
			results.appendChild(li);
		});
		results.hidden = false;
	}

	input.addEventListener("input", function () {
		var value = input.value.trim();
		window.clearTimeout(timer);
		if (!value) {
			render([]);
			return;
		}
		timer = window.setTimeout(function () {
			window.tinyss.search(value).then(render);
		}, 150);
	});
})();`;
