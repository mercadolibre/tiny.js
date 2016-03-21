import jsonp from './modules/jsonp';
import parent from './modules/parent';
import next from './modules/next';
import css from './modules/css';
import offset from './modules/offset';
import scroll from './modules/scroll';
import support from './modules/support';
import * as events from './modules/events';
import extend from './modules/extend';

let addons = {
    jsonp,
    parent,
    next,
    css,
    offset,
    scroll,
    support,
    events
};

for (let e in events) {
    addons[e] = events[e];
}

if (typeof window !== 'undefined' && window.tiny) {
    extend(window.tiny, addons);
}

export default addons;
