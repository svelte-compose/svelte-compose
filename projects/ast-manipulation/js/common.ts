import { AstKinds, AstTypes, parseScript, serializeScript } from "@svelte-compose/ast-tooling";

export function addJsDocTypeComment(node: AstTypes.Node, type: string) {
    const comment: AstTypes.CommentBlock = {
        type: "CommentBlock",
        value: `* @type {${type}} `,
    };

    if (!node.comments) node.comments = [];

    node.comments.push(comment);
}

export function createLiteral(value: string | null = null) {
    const literal: AstTypes.Literal = {
        type: "Literal",
        value,
    };

    return literal;
}

export function areNodesEqual(ast1: AstTypes.ASTNode, ast2: AstTypes.ASTNode) {
    return serializeScript(ast1) == serializeScript(ast2);
}

export function blockStatement() {
    const statement: AstTypes.BlockStatement = {
        type: "BlockStatement",
        body: [],
    };
    return statement;
}

export function expressionStatement(expression: AstKinds.ExpressionKind) {
    const statement: AstTypes.ExpressionStatement = {
        type: "ExpressionStatement",
        expression,
    };
    return statement;
}

export function addFromString(ast: AstTypes.BlockStatement, value: string) {
    const program = parseScript(value);

    for (const childNode of program.body) {
        ast.body.push(childNode);
    }
}
