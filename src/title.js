import { c3_chart_internal_fn } from './core';
import { isEmpty } from './util';

c3_chart_internal_fn.initTitle = function () {
    var $$ = this;
    if (!isEmpty($$.config.title_text)) {
        $$.title = $$.svg.append("text")
            .text($$.config.title_text)
            .attr("class", $$.CLASS.title);
    }
};
c3_chart_internal_fn.redrawTitle = function () {
    var $$ = this;
    if ($$.title) {
        $$.title
            .attr("x", $$.xForTitle.bind($$))
            .attr("y", $$.yForTitle.bind($$));
    }
};
c3_chart_internal_fn.xForTitle = function () {
    var $$ = this;
    if ($$.title) {
        var config = $$.config, position = config.title_position || 'left', x;
        if (position.indexOf('right') >= 0) {
            x = $$.currentWidth - $$.getTextRect($$.title.node().textContent, $$.CLASS.title, $$.title.node()).width - config.title_padding.right;
        } else if (position.indexOf('center') >= 0) {
            x = ($$.currentWidth - $$.getTextRect($$.title.node().textContent, $$.CLASS.title, $$.title.node()).width) / 2;
        } else { // left
            x = config.title_padding.left;
        }
    } else {
        x = 0;
    }
    return x;
};
c3_chart_internal_fn.yForTitle = function () {
    var $$ = this;
    if ($$.title) {
        return $$.config.title_padding.top + $$.getTextRect($$.title.node().textContent, $$.CLASS.title, $$.title.node()).height;
    } else {
        return 0;
    }
};
c3_chart_internal_fn.getTitlePadding = function() {
    var $$ = this;
    if ($$.title) {
        return $$.yForTitle() + $$.config.title_padding.bottom;
    } else {
        return 0;
    }
};
