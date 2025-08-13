import { Html, Head, Main, NextScript } from 'next/document';

import { title, description } from '../lib/settings';

const Document = () => {
    return (
        <Html lang="en">
            <Head>
                <meta property="og:title" content={title} />
                <meta property="og:description" content={description} />
                <meta property="og:type" content="website" />

                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={title} />
                <meta name="twitter:description" content={description} />

                <link rel="manifest" href="manifest.json" />
                <link rel="icon" type="image/x-icon" href="favicon.ico" />
                <link rel="icon" type="image/png" sizes="16x16" href="favicon-16x16.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="favicon-32x32.png" />
                <link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png" />
                <meta name="theme-color" content="#000000" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="default" />
                <meta name="apple-mobile-web-app-title" content={title} />
            </Head>
            <body className="h-full m-0 antialiased">
                <Main />
                <NextScript />
            </body>
        </Html>
    );
};

export default Document;
