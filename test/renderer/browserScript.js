import {templateParser} from '../../src/parser/templateParser';
import {templateRenderer} from '../../src/parser/templateRenderer';
import {flatten, diff} from '../../src/diff/Diff';
import {before} from "../parser/samples/templateBefore";

const {template, bindings} = templateParser(before);


const data = {
    oo:     'ooBinding',
    uu:     'uuBinding',
    bb:     'bbBinding',
    aa:     'aaBinding',
    ff:     'ffBinding',
    inText: 'inTextBinding',
    ab:     {bb: [{c: 'test in array'}]},
    lista:  {
        listb: {

            listc: [
                {caption: 'captionBinding1', item: 'itemBinding1'},
                {caption: 'captionBinding2', item: 'itemBinding2'},
                {caption: 'captionBinding3', item: 'itemBinding3'}
            ]
        }
    }
};

const {add} = diff(flatten(data));
const {template: compiled, rendered} = templateRenderer({template, bindings}, add);

export default {compiled, rendered}
