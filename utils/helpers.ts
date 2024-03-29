// import { Price } from 'types';

export const getURL = () => {
    let url = 
        process?.env?.PUBLIC_SITE_URL ?? // SET THIS TO YOUR SITE PRODUCTION
        process?.env?.PUBLIC_VERCEL_URL ?? 
        'http://localhost:3000/';
    //make sure to include https://
    // url = url.includes('http') ? url : `https://${url}`;

    url = url.charAt(url.length - 1 ) === '/' ? url : `${url}/`;
    return url
};


export const redirectURL = () => {
    let url = `https://domain.apac.ai/home`;
    url = url.charAt(url.length - 1 ) === '/' ? url : `${url}/`;
    return url
}