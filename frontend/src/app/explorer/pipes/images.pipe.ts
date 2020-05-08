import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'getFirstImage' })
export class GetFirstImage implements PipeTransform {
    transform(value: any): number {

        if (Array.isArray(value))
            return value[0];
        else
            return value;
    }
}