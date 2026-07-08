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

export default function Template({
	title,
	body,
	config,
	pages,
}: TemplateProps) {
	const siteTitle = String(config.title ?? "");
	const current = pages.find((p) => p.title === title);
	const isHome = current?.href === "index.html";
	const date = current?.extensions.date;
	const posts = postsOf(pages);

	return (
		<html lang="en">
			<head>
				<meta charset="utf-8" />
				<meta name="viewport" content="width=device-width,initial-scale=1" />
				<title>{isHome ? siteTitle : `${title} — ${siteTitle}`}</title>
				<link rel="stylesheet" href="/style.css" />
			</head>
			<body>
				<header class="site-header">
					{isHome ? (
						<h1 class="site-title">{siteTitle}</h1>
					) : (
						<a class="site-title" href="/">
							{siteTitle}
						</a>
					)}
				</header>
				<main>
					{isHome ? (
						<>
							<div
								class="prose"
								dangerouslySetInnerHTML={{ __html: body }}
							/>
							<section class="posts">
								<h2>Posts</h2>
								<ul>
									{posts.map((post) => (
										<li>
											<a href={permalink(post.href)}>{post.title}</a>
											{typeof post.extensions.date === "string" ? (
												<time>{post.extensions.date}</time>
											) : null}
										</li>
									))}
								</ul>
							</section>
						</>
					) : (
						<article>
							<h1>{title}</h1>
							{typeof date === "string" ? <time>{date}</time> : null}
							<div
								class="prose"
								dangerouslySetInnerHTML={{ __html: body }}
							/>
						</article>
					)}
				</main>
			</body>
		</html>
	);
}
