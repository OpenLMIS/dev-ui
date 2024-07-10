/* eslint-disable no-undef */

const stylelint = require('stylelint');

const ruleName = 'custom/no-fixed-direction-styles';

const FIXED_DIRECTION_PROPERTIES = [
    'float',
    'left',
    'right',
    'top',
    'bottom',
    'margin',
    'margin-left',
    'margin-right',
    'padding',
    'padding-left',
    'padding-right',
    'text-align'
];

const messages = stylelint.utils.ruleMessages(ruleName, {
    foundFixedDirectionStyle: function(prop, value) {
        return 'RTL Support | `' + prop + ': ' + value + '` - Can break layout in RTL languages.';
    }
});

const isFixedDirectionProperty = (prop) => {
    return FIXED_DIRECTION_PROPERTIES.includes(prop.toLowerCase());
};

const rule = stylelint.createPlugin(ruleName, function(enabled) {
    return function(root, result) {

        if (!enabled) {
            return;
        }

        root.walkDecls((decl) => {
            if (isFixedDirectionProperty(decl.prop)) {
                stylelint.utils.report({
                    ruleName,
                    result,
                    node: decl,
                    message: messages.foundFixedDirectionStyle(decl.prop, decl.value)
                });
            }
        });
    };
});

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
