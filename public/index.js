import { apiCom } from "./apiCom/apiCom.js";
import { updateNavMarker } from "./components/header/nav/nav.js";
import { updateSwitchMarker } from "./components/header/switch/switch.js";
import { handleRedirect } from "./logic/handleRedirect.js";
import { getAllTopUserDataAndSetState, setStateToServer, loadDemoDataAndSetState } from "./logic/utils.js";
import { renderHomePage } from "./pages/homePage/homePage.js";
import { renderPhoneHomePage } from "./pages/homePage/phoneHomePage.js";
import { updateArtistDivPosition } from "./pages/mainPage/decadesPage/decadesPage.js";
import { renderPhoneStructure } from "./pages/mainPage/phoneStructure.js";
import { renderStructure } from "./pages/mainPage/structure.js";


export const State = {
    clientId: "aa99b24e94d448eab167b514b89f2de2",
    redirectUri: /* "https://visualify.gnajor.deno.net/" */"http://127.0.0.1:8888/",
    demoPressed: false,
    userData: {
        artists:{
            short_term: null,
            medium_term: null,
            long_term: null
        },
        tracks:{
            short_term: null,
            medium_term: null,
            long_term: null
        }
    },
    overlayData: {
        short_term: {
            avgTrackPopularity: null,
            avgArtistPopularity: null,
            mostListenedGenre: null,
            mostListenedDecade: null,
            mostListenedCountry: {
                svg: null,
                name: null,
            },
            mostListenedTrack: {
                image: null,
                name: null,
            },
            mostListenedArtist: {
                image: null,
                name: null,
            }
        },
        medium_term: {
            avgTrackPopularity: null,
            avgArtistPopularity: null,
            mostListenedGenre: null,
            mostListenedDecade: null,
            mostListenedCountry: {
                svg: null,
                name: null,
            },
            mostListenedTrack: {
                image: null,
                name: null,
            },
            mostListenedArtist: {
                image: null,
                name: null,
            }
        },
        long_term: {
            avgTrackPopularity: null,
            avgArtistPopularity: null,
            mostListenedGenre: null,
            mostListenedDecade: null,
            mostListenedCountry: {
                svg: null,
                name: null,
            },
            mostListenedTrack: {
                image: null,
                name: null,
            },
            mostListenedArtist: {
                image: null,
                name: null,
            }
        }
    },

    setStateData(key, timeTerm, data){
        this.userData[key][timeTerm] = data;
    },

    setStateOverlayData(key, timeTerm, data){
        this.overlayData[timeTerm][key] = data; 
    },

    getStateOverlayDate(){
        return State.overlayData;
    }
}

const app = {
    parent: document.querySelector("#wrapper"),
    resizeTimer: undefined,
    currentVersion: undefined,
    isLoggedIn: false,

    async start(){
        const isTokenCorrect = await apiCom("token:auth");
        window.onresize = app.onResizeWindow;

        if(!isTokenCorrect.ok){
            const handled = await handleRedirect();

            if(this.isPhone()){
                this.startPhoneHomePage();
            }
            else{
                this.startDesktopHomePage();
            }
        }
        else{
            this.isLoggedIn = true;
            await getAllTopUserDataAndSetState();
            setStateToServer();

            if(this.isPhone()){
                this.startPhoneVersion();
            }
            else{
                this.startDesktopVersion();
            }
        }
    },

    startPhoneHomePage(){
        this.currentVersion = "phone";
        this.parent.className = "phone";
        renderPhoneHomePage(this.parent);
    },

    startDesktopHomePage(){
        this.currentVersion = "desktop";
        this.parent.className = "desktop";
        renderHomePage(this.parent, async () => {
            State.demoPressed = true;
            await loadDemoDataAndSetState();
            this.startDesktopVersion();
        });   
    },

    startPhoneVersion(){
        this.currentVersion = "phone";
        this.parent.className = "phone";
        renderPhoneStructure(this.parent, State.demoPressed);
    },

    startDesktopVersion(){
        this.currentVersion = "desktop";
        this.parent.className = "desktop";
        renderStructure(this.parent, State.demoPressed);
    },

    onResizeWindow(){
        const nowPhone = app.isPhone();

        if(nowPhone && app.currentVersion === "desktop"){
            if(app.isLoggedIn) app.startPhoneVersion();
            else app.startPhoneHomePage();
        }
        else if(!nowPhone && app.currentVersion === "phone"){
            if(app.isLoggedIn) app.startDesktopVersion();
            else app.startDesktopHomePage();
        }

        if(!nowPhone && app.currentVersion === "desktop"){
            updateSwitchMarker();
            updateNavMarker();
            updateArtistDivPosition();
        }

        document.body.classList.add("no-transition");
        clearTimeout(app.resizeTimer);
        app.resizeTimer = setTimeout(() => {
            document.body.classList.remove("no-transition");
        }, 200);
    },

    isPhone() {
        return window.innerWidth <= 450;
    }
}

app.start();