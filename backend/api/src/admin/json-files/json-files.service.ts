import { Injectable } from '@nestjs/common';
import * as jsonfile from 'jsonfile';
import { join } from 'path';
@Injectable()
export class JsonFilesService {
    async save(obj, name) {
        return jsonfile.writeFileSync(join(__dirname, name), obj)
    }

}
