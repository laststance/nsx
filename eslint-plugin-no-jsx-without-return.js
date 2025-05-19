// TODO: Extract this to a separate package
module.exports = {
  rules: {
    'no-jsx-without-return': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Disallow JSX elements not returned or assigned.',
        },
        schema: [],
      },
      create(context) {
        // Helper function to check if a node is a JSX element or fragment
        function isJSX(node) {
          return (
            node && (node.type === 'JSXElement' || node.type === 'JSXFragment')
          )
        }

        return {
          // Check for standalone JSX expressions
          ExpressionStatement(node) {
            if (isJSX(node.expression)) {
              context.report({
                node,
                message:
                  'JSX must be returned or assigned. Did you forget to write "return"?',
              })
            }
          },

          // Check for JSX in if statements without return
          IfStatement(node) {
            // Check if the consequent (the "then" part) is a JSX element directly
            // (not wrapped in a block or return statement)
            if (
              node.consequent &&
              node.consequent.type !== 'BlockStatement' &&
              isJSX(node.consequent)
            ) {
              context.report({
                node: node.consequent,
                message:
                  'JSX in if statement must be returned or wrapped in a block. Did you forget to write "return" or "{}"?',
              })
            }

            // Also check the "else" part if it exists
            if (
              node.alternate &&
              node.alternate.type !== 'BlockStatement' &&
              node.alternate.type !== 'IfStatement' &&
              isJSX(node.alternate)
            ) {
              context.report({
                node: node.alternate,
                message:
                  'JSX in else statement must be returned or wrapped in a block. Did you forget to write "return" or "{}"?',
              })
            }
          },
        }
      },
    },
  },
}
