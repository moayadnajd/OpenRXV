import { Injectable, Logger } from '@nestjs/common';
import { FileType } from 'src/shared/models/types.helpers';
import {
  BodyResponse,
  Hits,
  InnterHits,
  ExporterResponse
} from 'src/shared/models/ResponseBody.modal';
import { DocxData, Publication } from 'src/shared/models/DocxData.modal';
import { ApiResponse } from '@elastic/elasticsearch';
import { Response as ExpressRes } from 'express';
import { v4 } from 'uuid';
import * as path from 'path';
import * as fs from 'fs';
import * as PizZip from 'pizzip';
import * as Docxtemplater from 'docxtemplater';
import * as word2pdf from 'word2pdf-promises';
import * as ExcelJs from 'exceljs';
import { ElasticsearchService } from '@nestjs/elasticsearch';
@Injectable()
export class ExportService {

  constructor(public readonly elasticsearchService: ElasticsearchService) { }
  async ImportExcleFile(path) {
    new Logger(ExportService.name).log(path)
    const workbook = new ExcelJs.Workbook();
    await workbook.xlsx.readFile(path);

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
    workbook.eachSheet((worksheet) => {
      worksheet.eachRow((row, row_num) => {
        if (row_num > 1) {
          let formated = {}
          let exist = null;
          row.eachCell((col, col_num) => {
            if (schema[col_num] == "DOI") {
              if (primaryTrack[(col.value as string)]) {
                exist = col.value
              } else
                primaryTrack[(col.value as string)] = finaldata.length + 1
            }
            formated[schema[col_num]] = this.extractValues(col.value)
          })
          if (exist != null) {
            let temp = finaldata[primaryTrack[exist]]
            if (Array.isArray(temp.organization))
              temp.organization.push(worksheet.name)
            else
              temp.organization = [temp.organization, worksheet.name]

            finaldata[primaryTrack[exist]] = temp
          } else {
            formated['organization'] = worksheet.name;
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
        return splited.map(d => d.trim())
      else
        return splited[0].trim()
    }
    else
      value
  }
  async downloadFile(
    res: ExpressRes,
    { body: { hits, _scroll_id } }: ApiResponse<BodyResponse>,
    type: FileType,
    part: number
  ): Promise<void> {
    try {
      const fileName = `AReS-${part}-${v4()}`;
      if (hits.hits.length === 0) {
        res.json({ end: true });
        return;
      }

      const response: ExporterResponse = {
        end: hits.hits.length === 0,
        scrollId: _scroll_id,
        fileName: `${fileName}.${type}`,
        path: '/downloads',
        per_doc_size: 2000,
        total: hits.total.value
      };

      let filePath: string;

      if (type !== 'xlsx') {
        filePath = await this.createDocx(fileName, hits);
      } else {
        response.hits = hits.hits;
      }

      if (type === 'pdf') {
        this.createPdf(filePath, fileName, type, res, response);
      } else {
        res.json(response);
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  private async createDocx(fileName: string, hits: Hits): Promise<string> {
    try {
      const zip = new PizZip(
        await fs.promises.readFile(this.resolvePath('exports-template.docx'), 'binary')
      );
      const doc = new Docxtemplater();
      doc.loadZip(zip);
      doc.setData({
        publications: this.mapDataToDocxTemplate(hits.hits)
      } as DocxData);
      doc.render();
      const buf = doc.getZip().generate({ type: 'nodebuffer' });
      const filePath = this.resolvePath(`${fileName}.docx`, true);
      // const spinner = ora(`🚀 writing DOCX`).start();
      return fs.promises.writeFile(filePath, buf).then(() => {
        // spinner.succeed(`👾 we are done writing DOCX`).stop();
        return filePath;
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  private resolvePath(file: string, download?: boolean): string {
    return download
      ? path.resolve(__dirname, `../../../../data/files/downloads/${file}`)
      : path.resolve(__dirname, `../template-files/${file}`);
  }

  private createPdf(
    filePath: string,
    fileName: string,
    type: FileType,
    res: ExpressRes,
    response: object
  ): void {
    // const spinner = ora(`🔭 converting to PDF`).start();
    word2pdf(filePath)
      .then((data: Buffer) => {
        fs.promises.writeFile(this.resolvePath(`${fileName}.${type}`, true), data).then(
          () => {
            // spinner.succeed(`☄️ Done writing  PDF FROM DOCX`).stop();
            res.json(response);
          }
        );
      })
      .catch(() => {
        res.status(500).json({ message: 'Something went wrong' });
      });
  }

  private mapDataToDocxTemplate(
    h: Array<InnterHits>
  ): Array<Partial<Publication>> {
    return h.map<Partial<Publication>>(({ _source, _id }: InnterHits) => ({
      id: _id,
      title: _source.title,
      identifier_status: _source.status,
      identifier_citation: _source.citation,
      subject: Array.isArray(_source.subject)
        ? _source.subject.join('; ')
        : _source.subject || '',
      date_issued: _source.date,
      contributor_crp: _source.crp,
      identifier_uri: _source.uri,
      type: _source.type,
      isMELSPACE: _source.repo === 'MELSPACE'
    }));
  }
}
