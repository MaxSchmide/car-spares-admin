/* eslint-disable @next/next/no-title-in-document-head */
import { Html, Head, Main, NextScript } from "next/document"

export default function Document() {
	return (
		<Html lang="en">
			<Head>
				<title>Car Spares</title>
				<link
					rel="shortcut icon"
					href="/favicon.svg"
				/>
			</Head>
			<body>
				<Main />
				<NextScript />
				<div id="modal-root"></div>
			</body>
		</Html>
	)
}
