import {expect} from 'chai';
import {filterMap} from '../../src/utils/FilterMap';

describe('tests for filterMap',()=>{
    it('testing FilterMap', () => {
        const a = filterMap();
        const b = a.set('a', 1);
        expect(a).to.be.eql(b);

        const c = b.set('c', 2);
        expect(c).to.be.eql(a);

        const d = c.map((value) => value + 1);
        expect(d).not.to.eql(c);
        expect(c.get('a')).to.eql(1);
        expect(a.get('c')).to.eql(2);

        expect(d.get('a')).to.eql(2);
        expect(d.get('c')).to.eql(3);
        expect(d.reduce((acc, key, value) => acc + value)).to.be.eql(5);
        expect(c.reduce((acc, key, value) => acc + value, 1)).to.be.eql(4);

        expect(Array.from(a.filter((key) =>  key === 'a'))).to.be.eql([['a', 1]])

    });
});