import Moralis from 'moralis';

const MORALIS_API_KEY= "IAJSQYc01Z9QglRsP8iX2OZ1TYsehAPVsg8optXG5QZH2XalPIgJxlUfY7f3I96K"
const NEXTAUTH_URL= "http://localhost:3000";
const APP_DOMAIN= "nftgated.app";


const config = {
    domain: APP_DOMAIN,
    statement: 'Web Login.',
    uri: NEXTAUTH_URL,
    timeout: 60,
};

export default async function handler(req, res) {
    const { address, chain, network } = req.body;

    await Moralis.start({ apiKey: MORALIS_API_KEY });

    try {
        const message = await Moralis.Auth.requestMessage({
            address,
            chain,
            network,
            ...config,
        });

        res.status(200).json(message);
    } catch (error) {
        res.status(400).json({ error });
        console.error(error);
    }
}