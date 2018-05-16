const zip = (fn, acc, ...args) => acc.map((_, index) => fn(_, ...args.map(_ => _[index % _.length])));
const zipFold = (fn, acc = {}, initial, ...args) => initial.reduce((acc, _, index) => fn(acc, _, ...args.map(_ => _[index % _.length])), acc);


export {zip, zipFold}