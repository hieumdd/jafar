import type { AppProps } from 'next/app';
import { ReactFlowProvider } from '@xyflow/react';
import Head from 'next/head';
import '../styles/globals.css';
import '@xyflow/react/dist/base.css';

import { title, description } from '../lib/settings';

const App = ({ Component, pageProps }: AppProps) => {
    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name="description" content={description} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <ReactFlowProvider>
                <Component {...pageProps} />
            </ReactFlowProvider>
        </>
    );
};

export default App;
