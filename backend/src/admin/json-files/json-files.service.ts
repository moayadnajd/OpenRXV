import { Injectable } from '@nestjs/common';
import * as jsonfile from 'jsonfile';
import { join } from 'path';
function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
@Injectable()
export class JsonFilesService {
    async save(obj, name) {
        jsonfile.writeFileSync(join(__dirname, name), obj)
        return { success: true }
    }

    async read(name) {


        return jsonfile.readFileSync(join(__dirname, name))

    }

}
