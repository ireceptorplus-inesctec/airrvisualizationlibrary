import {Logger, ResultSeriesType, Common, DebugTimer} from './common.js';
import {Parser, DrilldownParser} from "./parser.js";
import {ResultSeriesDataItem, ResultSeries} from "./series.js";

class ImmuneDbCloneCountParser extends Parser {
    #_logger;
    
    // Array of ResultSeries
    #_series;

    #_multipleSeries;

    constructor() {
        super();
        this.#_logger = new Logger('ImmuneDbCloneCountParser');
        this.#_logger.trace("Constructor.");

        this.#_multipleSeries = false;
        this.#_series = [];
    }

    get series(){
        this.#_logger.debug("getting series.");
        return this.#_series;
    }
    
    isMultipleSeries(){
        return this.#_multipleSeries;
    }

    preparse(sourceData){
        this.#_logger.trace("preparse.");
        
    }   
           
    onparse (sourceData){
        this.#_logger.trace("parse");
        let timer = new DebugTimer();
        timer.start("parse");
        //Highcharts default
        //let seriesColors = ["rgb(124,181,236)", "rgb(67,67,72)", "rgb(144,237,125)"];
        //Colorblind safe
        //let seriesColors = ["rgb(49,54,149)", "rgb(69,117,180)", "rgb(116,173,209)", "rgb(171,217,233)", "rgb(224,243,248)", "rgb(255,255,191)", "rgb(254,224,144)", "rgb(253,174,97)", "rgb(244,109,67)", "rgb(215,48,39)", "rgb(165,0,38)"];
        let seriesColors = ["rgb(0,66,157)", "rgb(43,87,167)", "rgb(66,108,176)", "rgb(86,129,185)", "rgb(105,151,194)", "rgb(125,174,202)", "rgb(147,196,210)", "rgb(171,218,217)", "rgb(202,239,223)", "rgb(255,226,202)", "rgb(255,196,180)", "rgb(255,165,158)", "rgb(249,134,137)", "rgb(237,105,118)", "rgb(221,76,101)", "rgb(202,47,85)", "rgb(177,19,70)", "rgb(147,0,58)"]
        let colorIndex = 0;
        let colorIndexJumper = 1;
        
        let mainSeries = [];

        if (typeof sourceData === "string"){
            sourceData = JSON.parse(sourceData);
        }

        let studies = Object.keys(sourceData);
        
        console.log(studies);
        if (studies.length > 1){
            //Why is this important? If we have a multiple studies we need a color per study.
            this.#_logger.debug("Representing " + studies + " studies.");
            this.#_multipleSeries = true;
            
            if (seriesColors.length < studies.length){
                this.#_logger.error('Not enough colors set for the amount of repertoires. Please increase the number of colors in seriesColor array.');
                throw 'Not enough colors set for the amount of repertoires. Please increase the number of colors in seriesColor array.';
            }
            colorIndexJumper = Math.floor((seriesColors.length-1)/(studies.length-1));
            
        }

        //dictionary of studies
        let studiesDict = {};
        let stats = 0;
        //prepare data
        timer.start("prepare");
        for (let i = 0; i < studies.length; i++){
            let study = studies[i];
            // lets have a key for each study in the dictionary.
            studiesDict[study] = {}
            let studyData = sourceData[study];
            //console.log(studyData);
            //iterate over all the elements in the study. 
            //each element is a pair of {subject:value} with the top n clones.
            for (let j = 0; j < studyData.length; j++) {
                const element = studyData[j];
                //console.log(element);
                let subjects = Object.keys(element);
                if (subjects.length != 1){
                    throw 'Received more than one subject for a study. Only one was expected.';
                }
                let subjectName = subjects[0];
                //console.log(subjectName);
                let value = element[subjectName];
                //the array of values for this subjectName
                let values = (studiesDict[study][subjectName] || (studiesDict[study][subjectName]=[]));
                stats++;
                values.push(value);
            }
    
        }
        timer.end("prepare");
        //console.log(studiesDict);
        console.log("Read " + studies.length + " studies, in a total of " + stats + " statistic values.")
        const colorTopByStudy = [];
        for (let i = 0; i < studies.length; i++) {
            const element = studies[i];
            colorTopByStudy[element] = seriesColors[colorIndex];
            colorIndex+=colorIndexJumper;
        }
        
        const colorRest = "rgb(192,192,192)";

        let seriesTop = new ResultSeries()
        .setRepertoireId('')
        .setSampleProcessingId('')
        .setDataProcessingId('')
        .setId('SeriesTop')
        .setName('Fraction of top n clones')
        .setFieldName('Fraction of top n clones')
        .setType(ResultSeriesType.getByName('top_clones'));
        let seriesTopData = seriesTop.data;

        let seriesRest = new ResultSeries()
        .setRepertoireId('')
        .setSampleProcessingId('')
        .setDataProcessingId('')
        .setId('SeriesRest')
        .setName('Fraction of top 1-n clones')
        .setFieldName('Fraction of top 1-n clones')
        .setType(ResultSeriesType.getByName('top_clones'));
        let seriesRestData = seriesRest.data;
        
        timer.start("calculate");
        for (let i = 0; i < studies.length; i++) {
            const study = studies[i];
            for (const key in studiesDict[study]) {
                if (studiesDict[study].hasOwnProperty(key)) {
                    const value = Common.roundTo(studiesDict[study][key].reduce((a, b) => a + b, 0), 4);
                    let dataItemTop = new ResultSeriesDataItem().setName(study+'-'+key).setY(value).setColor(colorTopByStudy[study]);
                    seriesTopData.push(dataItemTop);
                    let dataItemRest = new ResultSeriesDataItem().setName(study+'-'+key).setY(1-value).setColor(colorRest);
                    seriesRestData.push(dataItemRest);
                }
            }
            
        }
        timer.end("calculate");

        //let dataItem = new ResultSeriesDataItem().setName(familyName).setY(familySeries.data[i].count);
        //seriesData.push(dataItem);
        this.#_series.push(seriesTop, seriesRest);
        //this.#_series.push(seriesTop);
        timer.end("parse");
        timer.print();
    }  
}

/*
module.exports = {
    ImmuneDbCloneCountParser: ImmuneDbCloneCountParser
};
*/

export {ImmuneDbCloneCountParser};