import { apiCom } from "../../../apiCom/apiCom.js";

export function moodsChartController(parent, fullDataset, chartFunc){
    const startingDataset = [
        {
            "title": "Energy",
            "value": 0,
        }, 
        {
            "title": "Intense",
            "value": 0,
        }, 
        {
            "title": "Sad",
            "value": 0,
        }, 
        {
            "title": "Happy",
            "value": 0,
        }, 
        {
            "title": "Calm",
            "value": 0,
        }
    ]; 

    const cache = {
        "short_term": null,
        "medium_term": null,
        "long_term": null
    } 

    const chart = chartFunc(parent, startingDataset);

    async function loadRange(range){
        if(cache[range]){
            chart.update(cache[range]);
            console.log(cache[range])
            return;
        }
        document.dispatchEvent(new CustomEvent("radar:processing"));

        const datasetToSetAndGet = [];
        const songsMood = await apiCom("server:get-mood-data", fullDataset[range]);
        let moodsData = [];

        for(const song of fullDataset[range]){
            const exists = songsMood.some(songWithMood => songWithMood.id === song.id);

            if(!exists){
                datasetToSetAndGet.push(song);   
            }
        }
        
        if(datasetToSetAndGet.length !== 0){
            console.log(datasetToSetAndGet)
            const data = await apiCom("songs:get-features", datasetToSetAndGet); //gets the song features
            moodsData = data.resource; 
        }

        const formatted = formatTrackFeatures(moodsData.concat(songsMood));

        cache[range] = formatted;
        chart.update(formatted);
    }

    function formatTrackFeatures(tracks){
        const moods = startingDataset.map(d => ({
            title: d.title,
            value: 0
        }));

        for(const track of tracks){
            track.moods.forEach((mood) => {
                const exists = moods.find(moodsItem => moodsItem.title === mood);
                if(exists)exists.value++;
            });
        }

        moods.forEach(item => item.value /= tracks.length);
        return moods;
    }

    return { loadRange };
}