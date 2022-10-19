import * as ts from 'typescript';
import { buildHash } from '../../../utilities';
import { getTopLevelNodeProperties } from './buildTypeScriptTopLevelNode';
import { TopLevelNode } from './topLevelNode';

const factory = ts.factory;

const block = factory.createBlock(
	[factory.createExpressionStatement(factory.createPropertyAccessExpression(
	  factory.createIdentifier("error"),
	  factory.createIdentifier("message")
	))],
	true
  )

// console.log(block.getText())

const resultFile = ts.createSourceFile("someFileName.ts", "", ts.ScriptTarget.Latest, /*setParentNodes*/ false, ts.ScriptKind.TS);
const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

const result = printer.printNode(ts.EmitHint.Unspecified, block, resultFile);
console.log(result);


export const getChildIdentifiers = (node: ts.Node): ReadonlyArray<string> => {
	if (ts.isIdentifier(node)) {
		return [node.text];
	}

	return node
		.getChildren()
		.map((childNode) => getChildIdentifiers(childNode))
		.flat();
};
export const getNameIdentifiers = (node: ts.Node): ReadonlySet<string> => {
	if (ts.isImportDeclaration(node)) {
		const literal = node
			.getChildren()
			.filter(ts.isStringLiteral)?.[0]
			?.getText();

		if (literal) {
			return new Set([literal]);
		}
	}

	if (ts.isClassDeclaration(node) || ts.isFunctionDeclaration(node)) {
		const text = node.name?.text ?? null;

		if (text === null) {
			return new Set();
		}

		return new Set([text]);
	}

	if (
		ts.isInterfaceDeclaration(node) ||
		ts.isInterfaceDeclaration(node) ||
		ts.isTypeAliasDeclaration(node) ||
		ts.isEnumDeclaration(node)
	) {
		return new Set([node.name.text]);
	}

	if (ts.isBlock(node)) {
		return new Set(['block']);
	}

	if (ts.isVariableStatement(node)) {
		const identifiers = node.declarationList.declarations
			.map(({ name }) => name)
			.filter(ts.isIdentifier)
			.map(({ text }) => text);

		return new Set(identifiers);
	}

	if (ts.isExportAssignment(node)) {
		return new Set('default export');
	}

	return new Set();
};

export const buildHeritageIdentifiers = (
	node: ts.Node,
): ReadonlySet<string> => {
	if (!ts.isClassDeclaration(node) && !ts.isInterfaceDeclaration(node)) {
		return new Set();
	}

	const identifiers =
		node.heritageClauses?.flatMap((heritageClause) => {
			return getChildIdentifiers(heritageClause);
		}) ?? [];

	return new Set(identifiers);
};

export const getScriptKind = (fileName: string): ts.ScriptKind | null => {
	if (fileName.endsWith('.js')) {
		return ts.ScriptKind.JS;
	}

	if (fileName.endsWith('.jsx')) {
		return ts.ScriptKind.JSX;
	}

	if (fileName.endsWith('.ts')) {
		return ts.ScriptKind.TS;
	}

	if (fileName.endsWith('.tsx')) {
		return ts.ScriptKind.TSX;
	}

	return null;
};

export const buildTypeScriptTopLevelNodes = (
	fileName: string,
	fileText: string,
): ReadonlyArray<TopLevelNode> => {
	const sourceFile = ts.createSourceFile(
		fileName,
		fileText,
		ts.ScriptTarget.ES5,
		true,
		getScriptKind(fileName) ?? undefined,
	);

	return sourceFile
		.getChildren()
		.filter((node) => node.kind === ts.SyntaxKind.SyntaxList)
		.flatMap((node) => node.getChildren())
		.map((node) => {
			const { modifier, kind } = getTopLevelNodeProperties(node);

			const nodeStart = node.getStart();
			const nodeEnd = node.getEnd();

			const start =
				ts
					.getLeadingCommentRanges(fileText, node.getFullStart())
					?.map((range) => range.pos)
					?.reduce((a, b) => (a < b ? a : b), nodeStart) ?? nodeStart;

			const end =
				ts
					.getTrailingCommentRanges(fileText, node.getEnd() + 1)
					?.map((range) => range.end)
					?.reduce((a, b) => (a > b ? a : b), nodeEnd) ?? nodeEnd;

			const text = fileText.slice(start, end);

			const id = buildHash(text);

			const childIdentifiers = new Set(getChildIdentifiers(node));

			const identifiers = new Set(getNameIdentifiers(node));

			identifiers.forEach((identifier) => {
				childIdentifiers.delete(identifier);
			});

			const heritageIdentifiers = buildHeritageIdentifiers(node);

			heritageIdentifiers.forEach((identifier) => {
				childIdentifiers.delete(identifier);
			});

			return {
				modifier,
				kind,
				id,
				triviaStart: start,
				nodeStart,
				triviaEnd: end,
				nodeEnd,
				identifiers,
				childIdentifiers,
				heritageIdentifiers,
			};
		});
};
