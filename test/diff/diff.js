import {diff, flatten} from '../../src/diff/Diff';
import {filterMap} from '../../src/utils/FilterMap';

import {expect} from 'chai';

describe('test for file diff', () => {
    it('flatten, return flat result', () => {
        const sampleA = {
            a: {b: 2},
            c: {
                d: {e: 'abs'},
                f: {g: [1, 2, 3]}
            }
        };
        const resultA = [
            [
                'a.b', 2
            ],
            [
                'c.d.e',
                'abs'
            ],
            [
                'c.f.g.0',
                1
            ],
            [
                'c.f.g.1',
                2
            ],
            [
                'c.f.g.2',
                3
            ]
        ];

        const sampleB = {
            a: {b: 2},
            c: {
                d: {e: 'abs'},
                f: {g: [{h: 1}, {h: 3}, 3]}
            }
        };
        const resultB = [
            [
                'a.b',
                2
            ],
            [
                'c.d.e',
                'abs'
            ],
            [
                'c.f.g.0.h',
                1
            ],
            [
                'c.f.g.1.h',
                3
            ],
            [
                'c.f.g.2',
                3
            ]
        ];

        expect(Array.from(flatten(sampleA))).to.be.eql(resultA);
        expect(Array.from(flatten(sampleB))).to.be.eql(resultB);
    });
    it('diff two objects', () => {
        const sourceA = filterMap([
            [
                'a.b',
                2
            ],
            [
                'c.d.e',
                'absd'
            ],
            [
                'c.f.g.0',
                1
            ],
            [
                'c.f.g.1',
                2
            ],
            [
                'c.f.g.2',
                3
            ]
        ]);
        const targetA = filterMap([
            [
                'a.b',
                2
            ],
            [
                'c.d.e',
                'abs'
            ],
            [
                'c.f.g.0.h',
                1
            ],
            [
                'c.f.g.1.h',
                3
            ],
            [
                'c.f.g.2',
                3
            ]
        ]);

        const resultA = {
            update: [
                {
                    path:  'c.d.e',
                    value: 'absd'
                }
            ],
            add:    [
                {
                    path:  'c.f.g.0',
                    value: 1
                },
                {
                    path:  'c.f.g.1',
                    value: 2
                }
            ],
            remove: [
                {
                    path:  'c.f.g.0.h',
                    value: 1
                },
                {
                    path:  'c.f.g.1.h',
                    value: 3
                }
            ]
        };
        expect(diff(sourceA, targetA)).to.be.eql(resultA)
    });

});