import { Logo } from "../../../sharedComponents/logo/logo.js";

export function renderHomePage(parent){
    parent.innerHTML = `<div id="home-page">
                            <div class="circle-box" id="top-circle"></div>
                            <div id="logo"></div>
                            <div class="circle-box" id="bottom-circle">
                                <button id="login">
                                    <img src="media/icons/spotify-logo.svg" alt="spotify logo">
                                    <span>Login with Spotify</span>    
                                </button>
                            </div>
                        </div>`;

    const loginButton = parent.querySelector("button#login");
    const logo = new Logo(logoContainer, 500, 90, 30, 140);
    logo.initLogo();
    logo.initAnimation();
    
    loginButton.addEventListener("click", async () => {
        const {codeChallenge, codeVerifier} = await getCodes();
        const authUrl = new URL("https://accounts.spotify.com/authorize")
        const scope = 'user-top-read user-read-recently-played';
        
        window.localStorage.setItem('codeVerifier', codeVerifier);
        
        const params = {
            response_type: 'code',
            client_id: State.clientId,
            scope,
            code_challenge_method: 'S256',
            code_challenge: codeChallenge,
            redirect_uri: State.redirectUri,
        }
        
        authUrl.search = new URLSearchParams(params).toString();
        window.location.href = authUrl.toString();
    });

    async function getCodes(){
        const generateRandomString = (length) => {
            const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            const values = crypto.getRandomValues(new Uint8Array(length));
            return values.reduce((acc, x) => acc + possible[x % possible.length], "");
        };        
    
        const sha256 = async (plain) => {
            const encoder = new TextEncoder()
            const data = encoder.encode(plain)
            return window.crypto.subtle.digest('SHA-256', data)
        };  
    
        const base64encode = (input) => {
            return btoa(String.fromCharCode(...new Uint8Array(input)))
                .replace(/=/g, '')
                .replace(/\+/g, '-')
                .replace(/\//g, '_');
        };


        const codeVerifier  = generateRandomString(64);
        const hashed = await sha256(codeVerifier);
        const codeChallenge = base64encode(hashed)

        return {
            codeChallenge,
            codeVerifier
        };
    }
}