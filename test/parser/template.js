import {templateParser} from '../../src/parser/templateParser';
import {templateRenderer} from '../../src/parser/templateRenderer';
import {flatten, diff} from '../../src/diff/Diff';
import {expect} from 'chai';

import {before} from './samples/templateBefore';
import {after, parsed} from './samples/templateAfter';
import {bindingsExpected, updated} from './samples/bindingsExpected';

describe('test for flattening dom Nodes', () => {

    it('test Dom Parser', () => {


        const start = Date.now();
        const {template, bindings} = templateParser(before);
        expect(template).to.be.eql(parsed);
        expect(bindings).to.be.eql(bindingsExpected);
        const finishFirst = Date.now();
        console.log(finishFirst - start);
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
        console.log(Date.now() - finishFirst);
        expect(compiled).to.be.eql(after);
        expect(rendered).to.be.eql(updated);


    })

});