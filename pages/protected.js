import { getSession } from 'next-auth/react';
import Moralis from 'moralis';
import { useRouter } from 'next/router';


function Protected({message, nftList}) {
    const {push} = useRouter();

    return (
        <div>
            <button onClick={()=> push('/user')}>Profile</button>
            <h3>Protected content</h3>
            <div>{message}</div>
            {nftList.map((e)=>{
                return (<img src={JSON.parse(e.metadata).image} alt="nftImg" height={100}/>)
            })}
            <pre>{JSON.stringify(nftList, null, 2)}</pre>
        </div>
    );
}


export async function getServerSideProps(context) {

    const session = await getSession(context);

    if (!session) {
        return {
            redirect: {
                destination: '/signin',
                permanent: false,
            },
        };
    }

    const MORALIS_API_KEY = "IAJSQYc01Z9QglRsP8iX2OZ1TYsehAPVsg8optXG5QZH2XalPIgJxlUfY7f3I96K"
    await Moralis.start({ apiKey: MORALIS_API_KEY });

    const nftList = await Moralis.EvmApi.account.getNFTsForContract({
        address: session.user.address,
        tokenAddress: '0x689be69e432473B7ac8b994a920C73d9081D5B14',
        chain: 5 // defualt 1 (MATIC)
    });

    return {
        props: {
            message:
                nftList.raw.total > 0 ? 'Nice! You have our NFT' : "Sorry, you don't have our NFT",
            nftList: nftList.raw.result
        },
    };
    
}

export default Protected;