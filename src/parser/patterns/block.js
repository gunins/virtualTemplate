import {inScope, joinString, concat, getHead} from './utils';
import {templateRenderer} from '../templateRenderer';
import {templateId, fold, combine} from './utils';
import {monad} from '../../utils/Monad';
import {lensPath, over, set, view} from '../../utils/lenses';
import {compose} from '../../utils/curry';

const templateLens = lensPath('template');
const renderedLens = lensPath('rendered');
const mapLens = lensPath('map');

const joinDot = joinString('.');
const joinTogether = joinString('');

const tagEmptyRegex = uid => new RegExp(`<([a-z-]+)\\s+id="${uid}">.*?</\\1>`);

const isBlock = ({bindingType}) => bindingType === 'block';

const splitHead = ({path, value}) => monad(getHead(path))
    .map(([head, path]) => ({value, path, head}));

const inBlock = inScope(({blockName}, paths) => paths
    .map(_ => splitHead(_).toObj())
    .filter(({head}) => blockName === head));

const findBlock = (_, pos, scope) => _.find(({index}) => pos === index) || {index: pos, parent: scope, map: []};

const updateBlock = (_, obj, target, pos) => concat(_.filter(({index}) => pos !== index), over(mapLens, source => concat(source, obj), target));


const flattenBlock = (_, obj, pos, scope) => monad(findBlock(_, pos, scope))
    .map((target) => updateBlock(_, obj, target, pos));

const segmentValues = (_, segment, value, parent) => monad(getHead(segment))
    .map(([head, tail]) => ({
        head,
        tail,
        index: isNaN(+head) ? 0 : +head,
        path:  isNaN(+head) ? segment : tail
    }))
    .flatMap(({head, tail, index, path}) => flattenBlock(_, {path, value, head}, index, parent));


const groupValues = _ => _.reduce((acc, {path, value, head}) => segmentValues(acc, path, value, head).toObj(), []);

const addParent = parent => (..._) => _.map(({path, ...data}) => ({path: joinDot(parent, path), ...data}));

const blockTemplate = (path, uid) => ({
    path,
    uid,
    type: 'block'
});

const segmentRenderer = ({map, parent, index}, children) => monad(templateRenderer(children, map, templateId()))
    .map(({template, rendered, uid}) => compose(
        set(renderedLens, addParent(parent)(blockTemplate(index, uid), ...rendered)),
        set(templateLens, template)
    )({}));


const joinTemplate = fold(templateLens, (left, right) => joinTogether(left, right));
const joinBindings = fold(renderedLens, (left, right) => concat(left, right));
const addToTemplate = (id) => combine(templateLens, (left, right) => left.replace(tagEmptyRegex(id), () => right));

const mergeChildren = (..._) => compose(
    joinTemplate(_),
    joinBindings(_)
)({});

const addToContext = (id, ..._) => compose(
    addToTemplate(id)(..._),
    joinBindings(_)
)({});

const groupTemplate = (children, values) => groupValues(values)
    .map((_) => segmentRenderer(_, children).toObj())
    .reduce((left, right) => mergeChildren(left, right), {});


const block = (left, {uid, children, values}) => monad(groupTemplate(children, values))
    .map((right) => addToContext(uid, left, right))
    .toObj();

export {block, isBlock, inBlock};
