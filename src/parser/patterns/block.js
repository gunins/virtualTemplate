import {inScope, joinString, objMap} from './utils';
import {templateRenderer} from '../templateRenderer';
import {uid} from './utils';

const joinDot = joinString('.');
const joinTogether = joinString('');

const tagEmptyRegex = uid => new RegExp(`<([a-z-]+)\\s+id="${uid}">.*?</\\1>`);

const isBlock = ({bindingType}) => bindingType === 'block';
const inBlock = inScope(({blockName}, paths) => paths.map(({path, value}) => {
    const [head, tail] = path.split(/\.(.+)/);
    return ({value, path: tail, head})
}).filter(({head}) => blockName === head));


const flattenBlock = (_, obj, pos, scope) => {
    const {parent, index, map} = _.find(({index}) => pos === index) || {index: pos, parent: scope, map: []};
    return ([..._.filter(({index}) => pos !== index), {parent, index, map: [...map, obj]}]);
};

const groupValues = (array) => array.reduce((acc, {path: segment, value, head: parent}) => {
    const [head, tail] = segment.split(/\.(.+)/);
    const index = isNaN(+head) ? 0 : +head;
    const path = isNaN(+head) ? segment : tail;
    return flattenBlock(acc, {path, value, head}, index, parent);
}, []);

const addParent = parent => (..._) => _.map(({path, ...data}) => ({path: joinDot(parent, path), ...data}));

const groupTemplate = (children, values) => groupValues(values)
    .map(({map, parent, index}) => objMap(templateRenderer(children, map, uid()))(({template, rendered, id}) => ({
        template,
        rendered: addParent(parent)({
            path: index,
            uid:  id,
            type: 'block'
        }, ...rendered)
    }))).reduce((_, {template, rendered}) => ({
        template: joinTogether(_.template, template),
        rendered: [..._.rendered, ...rendered]
    }), {template: '', rendered: []});


const block = ({template, rendered, ...args}, {uid: id, children, values}) => {
    const {template: childTemplate, rendered: bindings} = groupTemplate(children, values);
    return {
        template: template.replace(tagEmptyRegex(id), () => childTemplate),
        rendered: [...rendered, ...bindings],
        ...args
    };
};
export {block, isBlock, inBlock};
