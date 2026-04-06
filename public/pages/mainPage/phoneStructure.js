import { renderPhoneHeader } from "../../components/header/phoneHeader.js";
import { renderPhoneMostPlayedPage } from "./mostPlayedPage/phoneMostPlayedPage.js";
import { renderPhoneDecadePage } from "./decadesPage/phoneDecadePage.js";
import { renderPhoneMoodPage } from "./moodsPage/phoneMoodPage.js";

export function renderPhoneStructure(parent){
    parent.innerHTML = `<header></header>
                        <main>
                            <section id="most-played-page" class="switch-button-needed"></section>
                            <section id="decades-page"></section>
                            <section id="genre-page"></section>
                            <section id="moods-page"></section>
                            <section id="music-map-page"></section>
                            <section id="summary-page"></section>
                        </main>`;

    const mostPlayedPage = parent.querySelector("#most-played-page");
    const genrePage = parent.querySelector("#genre-page");
    const decadePage = parent.querySelector("#decades-page");
    const moodsPage = parent.querySelector("#moods-page");
    const musicMapPage = parent.querySelector("#music-map-page");
    const summaryPage = parent.querySelector("#summary-page");
    const sideButtons = parent.querySelector("#side-buttons");
    const header = parent.querySelector("header");
    
    const pageDoms = parent.querySelectorAll("section");
    renderPhoneHeader(header, pageDoms);
    renderPhoneMostPlayedPage(mostPlayedPage);
    renderPhoneDecadePage(decadePage);
    renderPhoneMoodPage(moodsPage);

/*     renderDecadePage(decadePage);
    renderMostPlayedPage(mostPlayedPage);
    renderGenresPage(genrePage);
    renderMapPage(musicMapPage);
    renderMoodsPage(moodsPage);
    renderSideButtons(sideButtons);
    renderSummaryPage(summaryPage); */
}