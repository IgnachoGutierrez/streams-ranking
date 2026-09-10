type Config = {
    redirectUri: string;
    clientId: string;
    clientSecret: string;
}

if (!process.env.REDIRECT_URI) {
    throw new Error('The REDIRECT_URI environment variable was not defined');
}

if (!process.env.CLIENT_ID) {
    throw new Error('The CLIENT_ID environment variable was not defined');
}

if (!process.env.CLIENT_SECRET) {
    throw new Error('The CLIENT_SECRET environment variable was not defined');
}

const config: Config = {
    redirectUri: process.env.REDIRECT_URI,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
}

export default config;