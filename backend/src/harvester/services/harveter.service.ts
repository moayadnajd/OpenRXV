import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { async } from 'rxjs/internal/scheduler/async';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { JsonFilesService } from 'src/admin/json-files/json-files.service';
import { ValuesService } from 'src/shared/services/values.service';
import * as ExcelJs from 'exceljs';
import { ApiResponse } from '@elastic/elasticsearch';
import { join } from 'path';
import { CRPS } from './crps';
@Injectable()
export class HarvesterService {
    private readonly logger = new Logger(HarvesterService.name);
    mapto: {}
    constructor(
        public readonly elasticsearchService: ElasticsearchService,
        public readonly jsonFilesService: JsonFilesService,
        public readonly valuesServes: ValuesService,
        @InjectQueue('plugins') private pluginsQueue: Queue,
        @InjectQueue('fetch') private fetchQueue: Queue,
    ) { }

    async getInfo() {
        let obj = {
            active_count: 0,
            waiting_count: 0,
            completed_count: 0,
            failed_count: 0,
            plugins_active_count: 0,
            plugins_waiting_count: 0,
            plugins_completed_count: 0,
            plugins_failed_count: 0,
            completed: [],
            failed: [],
            plugins_completed: [],
            plugins_failed: []

        }
        obj.active_count = await this.fetchQueue.getActiveCount()
        obj.waiting_count = await this.fetchQueue.getWaitingCount()
        obj.completed_count = await this.fetchQueue.getCompletedCount()
        obj.failed_count = await this.fetchQueue.getFailedCount()
        obj.completed = await this.fetchQueue.getCompleted()
        obj.failed = await this.fetchQueue.getFailed()

        obj.plugins_active_count = await this.pluginsQueue.getActiveCount()
        obj.plugins_waiting_count = await this.pluginsQueue.getWaitingCount()
        obj.plugins_completed_count = await this.pluginsQueue.getCompletedCount()
        obj.plugins_failed_count = await this.pluginsQueue.getFailedCount()
        obj.plugins_completed = await this.pluginsQueue.getCompleted()
        obj.plugins_failed = await this.pluginsQueue.getFailed()

        return obj;
    }

    async getMappingValues() {

        let data = await this.valuesServes.find();
        let values = {}
        data.hits.map(d => values[d._source.find] = d._source.replace)
        return values;
    }

    async stopHarvest() {
        this.logger.debug("Stopping Harvest")
        await this.fetchQueue.pause();
        await this.fetchQueue.clean(0, 'wait')
        return await this.fetchQueue.clean(0, 'active')
    }
    async startHarvest() {
        this.logger.debug("Starting Harvest")
        await this.fetchQueue.pause();
        await this.fetchQueue.empty();
        await this.fetchQueue.clean(0, 'failed')
        await this.fetchQueue.clean(0, 'wait')
        await this.fetchQueue.clean(0, 'active')
        await this.fetchQueue.clean(0, 'delayed')
        await this.fetchQueue.clean(0, 'completed')
        await this.fetchQueue.resume();

        let settings = await this.jsonFilesService.read('../../../data/dataToUse.json');
        settings.repositories.forEach(repo => {
            this.fetchQueue.add('fetch', { page: parseInt(repo.startPage), repo }, { attempts: 3 })
        });
        return "started";
    }
    async pluginsStart() {
        await this.pluginsQueue.pause();
        await this.pluginsQueue.empty();
        await this.pluginsQueue.clean(0, 'failed')
        await this.pluginsQueue.clean(0, 'wait')
        await this.pluginsQueue.clean(0, 'active')
        await this.pluginsQueue.clean(0, 'delayed')
        await this.pluginsQueue.clean(0, 'completed')
        await this.pluginsQueue.resume();
        let settings = await this.jsonFilesService.read('../../../data/dataToUse.json');
        let plugins: Array<any> = await this.jsonFilesService.read('../../../data/plugins.json');
        if (plugins.filter(plugin => plugin.value.length > 0).length > 0)
            for (let plugin of plugins) {
                for (let param of plugin.value) {
                    await this.pluginsQueue.add(plugin.name, { ...param, page: 1, index: settings.index_alias }, { attempts: 10 })
                }

            }
        else
            this.Reindex()

    }
    async Reindex() {
        this.logger.debug("reindex function is called")
        await this.elasticsearchService.indices.updateAliases({
            body: {
                actions: [
                    { remove: { index: process.env.OPENRXV_FINAL_INDEX, alias: process.env.OPENRXV_ALIAS } },
                    { add: { index: process.env.OPENRXV_TEMP_INDEX, alias: process.env.OPENRXV_ALIAS } }
                ]
            }
        })

        this.logger.debug("updateAliases final to tmep")

        await this.elasticsearchService.indices.delete({
            index: process.env.OPENRXV_FINAL_INDEX,
            ignore_unavailable: true
        })
        this.logger.debug("delete final")

        await this.elasticsearchService.indices.create({
            index: process.env.OPENRXV_FINAL_INDEX,
            body: {
                settings: {
                    mapping: {
                        ignore_malformed: true
                    }
                }
            }
        })
        this.logger.debug("create final")

        await this.elasticsearchService.reindex({

            wait_for_completion: true,
            body: {
                "conflicts": "proceed",
                source: {
                    index: process.env.OPENRXV_TEMP_INDEX
                },
                dest: { index: process.env.OPENRXV_FINAL_INDEX }
            }
        }, { requestTimeout: 2000000 })
        this.logger.debug("reindex to final")


        await this.elasticsearchService.indices.updateAliases({
            body: {
                actions: [
                    { remove: { index: process.env.OPENRXV_TEMP_INDEX, alias: process.env.OPENRXV_ALIAS } },
                    { add: { index: process.env.OPENRXV_FINAL_INDEX, alias: process.env.OPENRXV_ALIAS } }
                ]
            }
        })

        this.logger.debug("updateAliases temp to final")

        await this.elasticsearchService.indices.delete({
            index: process.env.OPENRXV_TEMP_INDEX,
            ignore_unavailable: true
        })
        this.logger.debug("delete temp")

        await this.elasticsearchService.indices.create({
            index: process.env.OPENRXV_TEMP_INDEX,
            body: {
                settings: {
                    mapping: {
                        ignore_malformed: true
                    }
                }
            }
        })

        this.logger.debug("create temp")

        this.logger.debug("Index All Done ");

    }
    async  getCRPS() {
        let reg = new RegExp(/(?<=\/)10\..*/)
        const workbook = new ExcelJs.Workbook();
        let finalData = {};
        let doc = await workbook.xlsx.readFile(join(__dirname, '../../../data/files/imported/Publications_20200520_MA_SJ_1F.xlsx'));
        doc.getWorksheet('AR 2019').eachRow((row, row_num) => {
            if (row_num > 1) {
                if (row.getCell(17).text != '' && row.getCell(17).text != null && row.getCell(18).text != 'NA') {
                    let formated = reg.exec(row.getCell(17).text.split('?')[0])
                    if (formated && formated[0] && formated[0] != null)
                        if (finalData[row.getCell(1).text])
                            finalData[row.getCell(1).text].push(formated[0])
                        else
                            finalData[row.getCell(1).text] = [formated[0]]
                }
            }
        })
        return finalData;
    }

    async ImportExcleFile(path) {
        const workbook = new ExcelJs.Workbook();
        await workbook.xlsx.readFile(path);


        this.mapto = await this.getMappingValues()

        let schema = {
            "1": "Publication Type",
            "2": "Authors",
            "3": "Book Authors",
            "4": "Editors",
            "5": "Book Group Authors",
            "6": "Author Full Name",
            "7": "Book Authors Full Name",
            "8": "Group Authors",
            "9": "Document Title",
            "10": "Publication Name",
            "11": "Book Series Title",
            "12": "Book Series Subtitle",
            "13": "Language",
            "14": "Document Type",
            "15": "Conference Title",
            "16": "Conference Date",
            "17": "Conference Location",
            "18": "Conference Sponsors",
            "19": "Conference Host",
            "20": "Author Keywords",
            "21": "Keywords Plus®",
            "22": "Abstract",
            "23": "Author Address",
            "24": "Reprint Address",
            "25": "E mail Address",
            "26": "ResearcherID Number",
            "27": "ORCID Identifier",
            "28": "Funding Agency / Grant Number",
            "29": "Funding Text",
            "30": "Cited References",
            "31": "Cited Reference Count",
            "32": "Core Collection Times Cited Count",
            "33": "Total Times Cited Count",
            "34": "Usage Count (Last 180 Days)",
            "35": "Usage Count (Since 2013)",
            "36": "Publisher",
            "37": "Publisher City",
            "38": "Publisher Address",
            "39": "ISSN",
            "40": "eISSN",
            "41": "ISBN",
            "42": "Character Source Abbreviation",
            "43": "ISO Source Abbreviation",
            "44": "Publication Date",
            "45": "Year Published",
            "46": "Volume",
            "47": "Issue",
            "48": "Part Number",
            "49": "Supplement",
            "50": "SI",
            "51": "Meeting Abstract",
            "52": "Beginning Page",
            "53": "Ending Page",
            "54": "Article Number",
            "55": "DOI",
            "56": "Book Digital Object Identifier (DOI)",
            "57": "Early access date",
            "58": "Page Count",
            "59": "Web of Science Categories",
            "60": "Research Areas",
            "61": "Document Delivery Number",
            "62": "Accession Number",
            "63": "PubMed ID",
            "64": "Open Access Indicator",
            "65": "ESI Highly Cited Paper",
            "66": "ESI Hot Paper",
            "67": "Date this report was generated"
        }
        let finaldata = [];
        let primaryTrack = {}
        workbook.eachSheet((worksheet, id) => {
            worksheet.eachRow((row, row_num) => {
                if (row_num > 1) {
                    let formated = {}
                    let exist = null;
                    row.eachCell({ includeEmpty: true }, (col, col_num) => {

                        if (schema[col_num] == "DOI") {
                            col.value = col.value ? col.value : 'NODOI/' + row_num
                            formated["DOI_STATUS"] = col.value ? "Yes" : 'No'
                            if (primaryTrack[(col.value as string)]) {
                                exist = col.value
                            } else
                                primaryTrack[(col.value as string)] = finaldata.length + 1
                            Object.keys(CRPS).forEach(crp => {
                                if (CRPS[crp].indexOf(col.value) != -1) {
                                    if (formated['CRP'])
                                        formated['CRP'].push(crp);
                                    else
                                        formated['CRP'] = [crp];
                                }
                            })
                            if (!formated['CRP'])
                                formated['CRP'] = ["SRF Related"]
                        }
                        if (col.value)
                            formated[schema[col_num]] = col_num != 22 ? this.extractValues(col.value) : col.value
                    })
                    if (exist != null) {
                        let temp = finaldata[primaryTrack[exist]]
                        if (Array.isArray(temp.organization))
                            temp.organization.push(worksheet.name)
                        else
                            temp.organization = [temp.organization, worksheet.name]

                        finaldata[primaryTrack[exist]] = temp
                    } else {
                        formated['organization'] = this.mapto[worksheet.name] ? this.mapto[worksheet.name] : worksheet.name;
                        finaldata.push({ index: { _index: process.env.OPENRXV_TEMP_INDEX } });
                        finaldata.push(formated);
                    }
                }
            })
        })

        let resp: ApiResponse = await this.elasticsearchService.bulk({
            refresh: 'wait_for',
            body: finaldata
        });

        return resp
    }

    extractValues(value) {
        if (value.split) {
            let splited = value.split(';')
            if (splited.length > 1)
                return splited.map(d => this.mapto[d.trim()] ? this.mapto[d.trim()] : d.trim())
            else
                return this.mapto[splited[0].trim()] ? this.mapto[splited[0].trim()] : splited[0].trim()
        }
        else
            return this.mapto[value] ? this.mapto[value] : value;
    }

}