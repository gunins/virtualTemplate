import {zip, zipFold} from '../../src/utils/array';
import {expect} from 'chai';

const {assign} = Object;
describe('testing array utilities zip method', () => {
    it('test zip method', () => {
        zip((a, b) => {
            expect(a + b).to.be.eql(4);
        }, [1, 2, 3], [3, 2, 1]);

        const resultA = zip((a, b, c, d) => a + b + c + d, [1, 2, 3], [3, 2, 1], [3, 2, 1], [1, 2, 3]);

        expect(resultA).to.be.eql([8, 8, 8]);
    });
    it('test zipFold method', () => {
        const resultA = zipFold((acc, a, b) => acc + a + b, 0, [1, 2, 3], [3, 2, 1]);
        expect(resultA).to.be.eql(12);

        const resultB = zipFold((acc, a, b, c, d) => assign(acc, {[a + '_id']: a + b + c + d}), {}, [1, 2, 3], [3, 2, 1], [3, 2, 1], [1, 2, 3]);
        expect(resultB).to.be.eql({
            '1_id': 8,
            '2_id': 8,
            '3_id': 8
        });

    });
});