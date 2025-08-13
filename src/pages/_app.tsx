import type { AppProps } from 'next/app';
import { ReactFlowProvider } from '@xyflow/react';
import Head from 'next/head';
import { Inter } from 'next/font/google';
import '@xyflow/react/dist/base.css';

import '../styles/globals.css';
import { title, description } from '../lib/settings';

const font = Inter({ subsets: ['vietnamese'] });

const App = ({ Component, pageProps }: AppProps) => {
    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name="description" content={description} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <ReactFlowProvider>
                <div className={font.className}>
                    <Component {...pageProps} />
                </div>
            </ReactFlowProvider>
        </>
    );
};

export default App;
