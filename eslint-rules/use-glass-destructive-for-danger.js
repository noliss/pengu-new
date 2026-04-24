/**
 * Предлагает variant="glassDestructive" вместо glassPrimary для кнопок
 * с деструктивной семантикой (удаление / wipe и т.п.).
 * @type {import('eslint').Rule.RuleModule}
 */
export const useGlassDestructiveForDanger = {
  meta: {
    type: 'suggestion',
    docs: { description: 'Use glassDestructive for destructive MUI Button actions' },
    messages: {
      useGlassDestructive:
        'Для деструктивного действия используй variant="glassDestructive", а не "glassPrimary".',
    },
    schema: [],
  },
  create(context) {
    const destructive = (s) =>
      /удал|delete|remove|wipe|стер(еть)?|стир|очистк|уничтож/i.test(String(s).trim());

    return {
      JSXElement(node) {
        const o = node.openingElement;
        if (o.name?.type !== 'JSXIdentifier' || o.name.name !== 'Button') return;

        const variantAttr = o.attributes.find(
          (a) => a.type === 'JSXAttribute' && a.name?.name === 'variant',
        );
        const val = variantAttr?.value;
        if (val?.type !== 'Literal' || val.value !== 'glassPrimary') return;

        const labelAttr = o.attributes.find(
          (a) => a.type === 'JSXAttribute' && a.name?.name === 'aria-label',
        );
        if (labelAttr?.value?.type === 'Literal' && destructive(String(labelAttr.value.value))) {
          context.report({ node: variantAttr, messageId: 'useGlassDestructive' });
          return;
        }

        for (const c of node.children) {
          if (c.type === 'JSXText' && destructive(c.value)) {
            context.report({ node: variantAttr, messageId: 'useGlassDestructive' });
            return;
          }
        }
      },
    };
  },
};
