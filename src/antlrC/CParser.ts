// Generated from /gppd/intuita/intuita-vscode-extension/src/antlrC/C.g4 by ANTLR 4.9.0-SNAPSHOT


import { ATN } from "antlr4ts/atn/ATN";
import { ATNDeserializer } from "antlr4ts/atn/ATNDeserializer";
import { FailedPredicateException } from "antlr4ts/FailedPredicateException";
import { NotNull } from "antlr4ts/Decorators";
import { NoViableAltException } from "antlr4ts/NoViableAltException";
import { Override } from "antlr4ts/Decorators";
import { Parser } from "antlr4ts/Parser";
import { ParserRuleContext } from "antlr4ts/ParserRuleContext";
import { ParserATNSimulator } from "antlr4ts/atn/ParserATNSimulator";
import { ParseTreeListener } from "antlr4ts/tree/ParseTreeListener";
import { ParseTreeVisitor } from "antlr4ts/tree/ParseTreeVisitor";
import { RecognitionException } from "antlr4ts/RecognitionException";
import { RuleContext } from "antlr4ts/RuleContext";
//import { RuleVersion } from "antlr4ts/RuleVersion";
import { TerminalNode } from "antlr4ts/tree/TerminalNode";
import { Token } from "antlr4ts/Token";
import { TokenStream } from "antlr4ts/TokenStream";
import { Vocabulary } from "antlr4ts/Vocabulary";
import { VocabularyImpl } from "antlr4ts/VocabularyImpl";

import * as Utils from "antlr4ts/misc/Utils";

import { CListener } from "./CListener";
import { CVisitor } from "./CVisitor";


export class CParser extends Parser {
	public static readonly T__0 = 1;
	public static readonly T__1 = 2;
	public static readonly T__2 = 3;
	public static readonly T__3 = 4;
	public static readonly T__4 = 5;
	public static readonly T__5 = 6;
	public static readonly T__6 = 7;
	public static readonly T__7 = 8;
	public static readonly T__8 = 9;
	public static readonly T__9 = 10;
	public static readonly T__10 = 11;
	public static readonly T__11 = 12;
	public static readonly T__12 = 13;
	public static readonly T__13 = 14;
	public static readonly T__14 = 15;
	public static readonly T__15 = 16;
	public static readonly T__16 = 17;
	public static readonly T__17 = 18;
	public static readonly T__18 = 19;
	public static readonly Auto = 20;
	public static readonly Break = 21;
	public static readonly Case = 22;
	public static readonly Char = 23;
	public static readonly Const = 24;
	public static readonly Continue = 25;
	public static readonly Default = 26;
	public static readonly Do = 27;
	public static readonly Double = 28;
	public static readonly Else = 29;
	public static readonly Enum = 30;
	public static readonly Extern = 31;
	public static readonly Float = 32;
	public static readonly For = 33;
	public static readonly Goto = 34;
	public static readonly If = 35;
	public static readonly Inline = 36;
	public static readonly Int = 37;
	public static readonly Long = 38;
	public static readonly Register = 39;
	public static readonly Restrict = 40;
	public static readonly Return = 41;
	public static readonly Short = 42;
	public static readonly Signed = 43;
	public static readonly Sizeof = 44;
	public static readonly Static = 45;
	public static readonly Struct = 46;
	public static readonly Switch = 47;
	public static readonly Typedef = 48;
	public static readonly Union = 49;
	public static readonly Unsigned = 50;
	public static readonly Void = 51;
	public static readonly Volatile = 52;
	public static readonly While = 53;
	public static readonly Alignas = 54;
	public static readonly Alignof = 55;
	public static readonly Atomic = 56;
	public static readonly Bool = 57;
	public static readonly Complex = 58;
	public static readonly Generic = 59;
	public static readonly Imaginary = 60;
	public static readonly Noreturn = 61;
	public static readonly StaticAssert = 62;
	public static readonly ThreadLocal = 63;
	public static readonly LeftParen = 64;
	public static readonly RightParen = 65;
	public static readonly LeftBracket = 66;
	public static readonly RightBracket = 67;
	public static readonly LeftBrace = 68;
	public static readonly RightBrace = 69;
	public static readonly Less = 70;
	public static readonly LessEqual = 71;
	public static readonly Greater = 72;
	public static readonly GreaterEqual = 73;
	public static readonly LeftShift = 74;
	public static readonly RightShift = 75;
	public static readonly Plus = 76;
	public static readonly PlusPlus = 77;
	public static readonly Minus = 78;
	public static readonly MinusMinus = 79;
	public static readonly Star = 80;
	public static readonly Div = 81;
	public static readonly Mod = 82;
	public static readonly And = 83;
	public static readonly Or = 84;
	public static readonly AndAnd = 85;
	public static readonly OrOr = 86;
	public static readonly Caret = 87;
	public static readonly Not = 88;
	public static readonly Tilde = 89;
	public static readonly Question = 90;
	public static readonly Colon = 91;
	public static readonly Semi = 92;
	public static readonly Comma = 93;
	public static readonly Assign = 94;
	public static readonly StarAssign = 95;
	public static readonly DivAssign = 96;
	public static readonly ModAssign = 97;
	public static readonly PlusAssign = 98;
	public static readonly MinusAssign = 99;
	public static readonly LeftShiftAssign = 100;
	public static readonly RightShiftAssign = 101;
	public static readonly AndAssign = 102;
	public static readonly XorAssign = 103;
	public static readonly OrAssign = 104;
	public static readonly Equal = 105;
	public static readonly NotEqual = 106;
	public static readonly Arrow = 107;
	public static readonly Dot = 108;
	public static readonly Ellipsis = 109;
	public static readonly Identifier = 110;
	public static readonly Constant = 111;
	public static readonly DigitSequence = 112;
	public static readonly StringLiteral = 113;
	public static readonly ComplexDefine = 114;
	public static readonly IncludeDirective = 115;
	public static readonly AsmBlock = 116;
	public static readonly LineAfterPreprocessing = 117;
	public static readonly LineDirective = 118;
	public static readonly PragmaDirective = 119;
	public static readonly Whitespace = 120;
	public static readonly Newline = 121;
	public static readonly BlockComment = 122;
	public static readonly LineComment = 123;
	public static readonly RULE_primaryExpression = 0;
	public static readonly RULE_genericSelection = 1;
	public static readonly RULE_genericAssocList = 2;
	public static readonly RULE_genericAssociation = 3;
	public static readonly RULE_postfixExpression = 4;
	public static readonly RULE_argumentExpressionList = 5;
	public static readonly RULE_unaryExpression = 6;
	public static readonly RULE_unaryOperator = 7;
	public static readonly RULE_castExpression = 8;
	public static readonly RULE_multiplicativeExpression = 9;
	public static readonly RULE_additiveExpression = 10;
	public static readonly RULE_shiftExpression = 11;
	public static readonly RULE_relationalExpression = 12;
	public static readonly RULE_equalityExpression = 13;
	public static readonly RULE_andExpression = 14;
	public static readonly RULE_exclusiveOrExpression = 15;
	public static readonly RULE_inclusiveOrExpression = 16;
	public static readonly RULE_logicalAndExpression = 17;
	public static readonly RULE_logicalOrExpression = 18;
	public static readonly RULE_conditionalExpression = 19;
	public static readonly RULE_assignmentExpression = 20;
	public static readonly RULE_assignmentOperator = 21;
	public static readonly RULE_expression = 22;
	public static readonly RULE_constantExpression = 23;
	public static readonly RULE_declaration = 24;
	public static readonly RULE_declarationSpecifiers = 25;
	public static readonly RULE_declarationSpecifiers2 = 26;
	public static readonly RULE_declarationSpecifier = 27;
	public static readonly RULE_initDeclaratorList = 28;
	public static readonly RULE_initDeclarator = 29;
	public static readonly RULE_storageClassSpecifier = 30;
	public static readonly RULE_typeSpecifier = 31;
	public static readonly RULE_structOrUnionSpecifier = 32;
	public static readonly RULE_structOrUnion = 33;
	public static readonly RULE_structDeclarationList = 34;
	public static readonly RULE_structDeclaration = 35;
	public static readonly RULE_specifierQualifierList = 36;
	public static readonly RULE_structDeclaratorList = 37;
	public static readonly RULE_structDeclarator = 38;
	public static readonly RULE_enumSpecifier = 39;
	public static readonly RULE_enumeratorList = 40;
	public static readonly RULE_enumerator = 41;
	public static readonly RULE_enumerationConstant = 42;
	public static readonly RULE_atomicTypeSpecifier = 43;
	public static readonly RULE_typeQualifier = 44;
	public static readonly RULE_functionSpecifier = 45;
	public static readonly RULE_alignmentSpecifier = 46;
	public static readonly RULE_declarator = 47;
	public static readonly RULE_directDeclarator = 48;
	public static readonly RULE_vcSpecificModifer = 49;
	public static readonly RULE_gccDeclaratorExtension = 50;
	public static readonly RULE_gccAttributeSpecifier = 51;
	public static readonly RULE_gccAttributeList = 52;
	public static readonly RULE_gccAttribute = 53;
	public static readonly RULE_nestedParenthesesBlock = 54;
	public static readonly RULE_pointer = 55;
	public static readonly RULE_typeQualifierList = 56;
	public static readonly RULE_parameterTypeList = 57;
	public static readonly RULE_parameterList = 58;
	public static readonly RULE_parameterDeclaration = 59;
	public static readonly RULE_identifierList = 60;
	public static readonly RULE_typeName = 61;
	public static readonly RULE_abstractDeclarator = 62;
	public static readonly RULE_directAbstractDeclarator = 63;
	public static readonly RULE_typedefName = 64;
	public static readonly RULE_initializer = 65;
	public static readonly RULE_initializerList = 66;
	public static readonly RULE_designation = 67;
	public static readonly RULE_designatorList = 68;
	public static readonly RULE_designator = 69;
	public static readonly RULE_staticAssertDeclaration = 70;
	public static readonly RULE_statement = 71;
	public static readonly RULE_labeledStatement = 72;
	public static readonly RULE_compoundStatement = 73;
	public static readonly RULE_blockItemList = 74;
	public static readonly RULE_blockItem = 75;
	public static readonly RULE_expressionStatement = 76;
	public static readonly RULE_selectionStatement = 77;
	public static readonly RULE_iterationStatement = 78;
	public static readonly RULE_forCondition = 79;
	public static readonly RULE_forDeclaration = 80;
	public static readonly RULE_forExpression = 81;
	public static readonly RULE_jumpStatement = 82;
	public static readonly RULE_compilationUnit = 83;
	public static readonly RULE_translationUnit = 84;
	public static readonly RULE_externalDeclaration = 85;
	public static readonly RULE_functionDefinition = 86;
	public static readonly RULE_declarationList = 87;
	// tslint:disable:no-trailing-whitespace
	public static readonly ruleNames: string[] = [
		"primaryExpression", "genericSelection", "genericAssocList", "genericAssociation", 
		"postfixExpression", "argumentExpressionList", "unaryExpression", "unaryOperator", 
		"castExpression", "multiplicativeExpression", "additiveExpression", "shiftExpression", 
		"relationalExpression", "equalityExpression", "andExpression", "exclusiveOrExpression", 
		"inclusiveOrExpression", "logicalAndExpression", "logicalOrExpression", 
		"conditionalExpression", "assignmentExpression", "assignmentOperator", 
		"expression", "constantExpression", "declaration", "declarationSpecifiers", 
		"declarationSpecifiers2", "declarationSpecifier", "initDeclaratorList", 
		"initDeclarator", "storageClassSpecifier", "typeSpecifier", "structOrUnionSpecifier", 
		"structOrUnion", "structDeclarationList", "structDeclaration", "specifierQualifierList", 
		"structDeclaratorList", "structDeclarator", "enumSpecifier", "enumeratorList", 
		"enumerator", "enumerationConstant", "atomicTypeSpecifier", "typeQualifier", 
		"functionSpecifier", "alignmentSpecifier", "declarator", "directDeclarator", 
		"vcSpecificModifer", "gccDeclaratorExtension", "gccAttributeSpecifier", 
		"gccAttributeList", "gccAttribute", "nestedParenthesesBlock", "pointer", 
		"typeQualifierList", "parameterTypeList", "parameterList", "parameterDeclaration", 
		"identifierList", "typeName", "abstractDeclarator", "directAbstractDeclarator", 
		"typedefName", "initializer", "initializerList", "designation", "designatorList", 
		"designator", "staticAssertDeclaration", "statement", "labeledStatement", 
		"compoundStatement", "blockItemList", "blockItem", "expressionStatement", 
		"selectionStatement", "iterationStatement", "forCondition", "forDeclaration", 
		"forExpression", "jumpStatement", "compilationUnit", "translationUnit", 
		"externalDeclaration", "functionDefinition", "declarationList",
	];

	private static readonly _LITERAL_NAMES: Array<string | undefined> = [
		undefined, "'__extension__'", "'__builtin_va_arg'", "'__builtin_offsetof'", 
		"'__m128'", "'__m128d'", "'__m128i'", "'__typeof__'", "'__inline__'", 
		"'__stdcall'", "'__declspec'", "'__cdecl'", "'__clrcall'", "'__fastcall'", 
		"'__thiscall'", "'__vectorcall'", "'__asm'", "'__attribute__'", "'__asm__'", 
		"'__volatile__'", "'auto'", "'break'", "'case'", "'char'", "'const'", 
		"'continue'", "'default'", "'do'", "'double'", "'else'", "'enum'", "'extern'", 
		"'float'", "'for'", "'goto'", "'if'", "'inline'", "'int'", "'long'", "'register'", 
		"'restrict'", "'return'", "'short'", "'signed'", "'sizeof'", "'static'", 
		"'struct'", "'switch'", "'typedef'", "'union'", "'unsigned'", "'void'", 
		"'volatile'", "'while'", "'_Alignas'", "'_Alignof'", "'_Atomic'", "'_Bool'", 
		"'_Complex'", "'_Generic'", "'_Imaginary'", "'_Noreturn'", "'_Static_assert'", 
		"'_Thread_local'", "'('", "')'", "'['", "']'", "'{'", "'}'", "'<'", "'<='", 
		"'>'", "'>='", "'<<'", "'>>'", "'+'", "'++'", "'-'", "'--'", "'*'", "'/'", 
		"'%'", "'&'", "'|'", "'&&'", "'||'", "'^'", "'!'", "'~'", "'?'", "':'", 
		"';'", "','", "'='", "'*='", "'/='", "'%='", "'+='", "'-='", "'<<='", 
		"'>>='", "'&='", "'^='", "'|='", "'=='", "'!='", "'->'", "'.'", "'...'",
	];
	private static readonly _SYMBOLIC_NAMES: Array<string | undefined> = [
		undefined, undefined, undefined, undefined, undefined, undefined, undefined, 
		undefined, undefined, undefined, undefined, undefined, undefined, undefined, 
		undefined, undefined, undefined, undefined, undefined, undefined, "Auto", 
		"Break", "Case", "Char", "Const", "Continue", "Default", "Do", "Double", 
		"Else", "Enum", "Extern", "Float", "For", "Goto", "If", "Inline", "Int", 
		"Long", "Register", "Restrict", "Return", "Short", "Signed", "Sizeof", 
		"Static", "Struct", "Switch", "Typedef", "Union", "Unsigned", "Void", 
		"Volatile", "While", "Alignas", "Alignof", "Atomic", "Bool", "Complex", 
		"Generic", "Imaginary", "Noreturn", "StaticAssert", "ThreadLocal", "LeftParen", 
		"RightParen", "LeftBracket", "RightBracket", "LeftBrace", "RightBrace", 
		"Less", "LessEqual", "Greater", "GreaterEqual", "LeftShift", "RightShift", 
		"Plus", "PlusPlus", "Minus", "MinusMinus", "Star", "Div", "Mod", "And", 
		"Or", "AndAnd", "OrOr", "Caret", "Not", "Tilde", "Question", "Colon", 
		"Semi", "Comma", "Assign", "StarAssign", "DivAssign", "ModAssign", "PlusAssign", 
		"MinusAssign", "LeftShiftAssign", "RightShiftAssign", "AndAssign", "XorAssign", 
		"OrAssign", "Equal", "NotEqual", "Arrow", "Dot", "Ellipsis", "Identifier", 
		"Constant", "DigitSequence", "StringLiteral", "ComplexDefine", "IncludeDirective", 
		"AsmBlock", "LineAfterPreprocessing", "LineDirective", "PragmaDirective", 
		"Whitespace", "Newline", "BlockComment", "LineComment",
	];
	public static readonly VOCABULARY: Vocabulary = new VocabularyImpl(CParser._LITERAL_NAMES, CParser._SYMBOLIC_NAMES, []);

	// @Override
	// @NotNull
	public get vocabulary(): Vocabulary {
		return CParser.VOCABULARY;
	}
	// tslint:enable:no-trailing-whitespace

	// @Override
	public get grammarFileName(): string { return "C.g4"; }

	// @Override
	public get ruleNames(): string[] { return CParser.ruleNames; }

	// @Override
	public get serializedATN(): string { return CParser._serializedATN; }

	protected createFailedPredicateException(predicate?: string, message?: string): FailedPredicateException {
		return new FailedPredicateException(this, predicate, message);
	}

	constructor(input: TokenStream) {
		super(input);
		this._interp = new ParserATNSimulator(CParser._ATN, this);
	}
	// @RuleVersion(0)
	public primaryExpression(): PrimaryExpressionContext {
		let _localctx: PrimaryExpressionContext = new PrimaryExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 0, CParser.RULE_primaryExpression);
		let _la: number;
		try {
			this.state = 209;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 2, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 176;
				this.match(CParser.Identifier);
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 177;
				this.match(CParser.Constant);
				}
				break;

			case 3:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 179;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				do {
					{
					{
					this.state = 178;
					this.match(CParser.StringLiteral);
					}
					}
					this.state = 181;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				} while (_la === CParser.StringLiteral);
				}
				break;

			case 4:
				this.enterOuterAlt(_localctx, 4);
				{
				this.state = 183;
				this.match(CParser.LeftParen);
				this.state = 184;
				this.expression();
				this.state = 185;
				this.match(CParser.RightParen);
				}
				break;

			case 5:
				this.enterOuterAlt(_localctx, 5);
				{
				this.state = 187;
				this.genericSelection();
				}
				break;

			case 6:
				this.enterOuterAlt(_localctx, 6);
				{
				this.state = 189;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === CParser.T__0) {
					{
					this.state = 188;
					this.match(CParser.T__0);
					}
				}

				this.state = 191;
				this.match(CParser.LeftParen);
				this.state = 192;
				this.compoundStatement();
				this.state = 193;
				this.match(CParser.RightParen);
				}
				break;

			case 7:
				this.enterOuterAlt(_localctx, 7);
				{
				this.state = 195;
				this.match(CParser.T__1);
				this.state = 196;
				this.match(CParser.LeftParen);
				this.state = 197;
				this.unaryExpression();
				this.state = 198;
				this.match(CParser.Comma);
				this.state = 199;
				this.typeName();
				this.state = 200;
				this.match(CParser.RightParen);
				}
				break;

			case 8:
				this.enterOuterAlt(_localctx, 8);
				{
				this.state = 202;
				this.match(CParser.T__2);
				this.state = 203;
				this.match(CParser.LeftParen);
				this.state = 204;
				this.typeName();
				this.state = 205;
				this.match(CParser.Comma);
				this.state = 206;
				this.unaryExpression();
				this.state = 207;
				this.match(CParser.RightParen);
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public genericSelection(): GenericSelectionContext {
		let _localctx: GenericSelectionContext = new GenericSelectionContext(this._ctx, this.state);
		this.enterRule(_localctx, 2, CParser.RULE_genericSelection);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 211;
			this.match(CParser.Generic);
			this.state = 212;
			this.match(CParser.LeftParen);
			this.state = 213;
			this.assignmentExpression();
			this.state = 214;
			this.match(CParser.Comma);
			this.state = 215;
			this.genericAssocList();
			this.state = 216;
			this.match(CParser.RightParen);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public genericAssocList(): GenericAssocListContext {
		let _localctx: GenericAssocListContext = new GenericAssocListContext(this._ctx, this.state);
		this.enterRule(_localctx, 4, CParser.RULE_genericAssocList);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 218;
			this.genericAssociation();
			this.state = 223;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === CParser.Comma) {
				{
				{
				this.state = 219;
				this.match(CParser.Comma);
				this.state = 220;
				this.genericAssociation();
				}
				}
				this.state = 225;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public genericAssociation(): GenericAssociationContext {
		let _localctx: GenericAssociationContext = new GenericAssociationContext(this._ctx, this.state);
		this.enterRule(_localctx, 6, CParser.RULE_genericAssociation);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 228;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case CParser.T__0:
			case CParser.T__3:
			case CParser.T__4:
			case CParser.T__5:
			case CParser.T__6:
			case CParser.Char:
			case CParser.Const:
			case CParser.Double:
			case CParser.Enum:
			case CParser.Float:
			case CParser.Int:
			case CParser.Long:
			case CParser.Restrict:
			case CParser.Short:
			case CParser.Signed:
			case CParser.Struct:
			case CParser.Union:
			case CParser.Unsigned:
			case CParser.Void:
			case CParser.Volatile:
			case CParser.Atomic:
			case CParser.Bool:
			case CParser.Complex:
			case CParser.Identifier:
				{
				this.state = 226;
				this.typeName();
				}
				break;
			case CParser.Default:
				{
				this.state = 227;
				this.match(CParser.Default);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			this.state = 230;
			this.match(CParser.Colon);
			this.state = 231;
			this.assignmentExpression();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public postfixExpression(): PostfixExpressionContext {
		let _localctx: PostfixExpressionContext = new PostfixExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 8, CParser.RULE_postfixExpression);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 247;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 7, this._ctx) ) {
			case 1:
				{
				this.state = 233;
				this.primaryExpression();
				}
				break;

			case 2:
				{
				this.state = 235;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === CParser.T__0) {
					{
					this.state = 234;
					this.match(CParser.T__0);
					}
				}

				this.state = 237;
				this.match(CParser.LeftParen);
				this.state = 238;
				this.typeName();
				this.state = 239;
				this.match(CParser.RightParen);
				this.state = 240;
				this.match(CParser.LeftBrace);
				this.state = 241;
				this.initializerList();
				this.state = 243;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === CParser.Comma) {
					{
					this.state = 242;
					this.match(CParser.Comma);
					}
				}

				this.state = 245;
				this.match(CParser.RightBrace);
				}
				break;
			}
			this.state = 263;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (((((_la - 64)) & ~0x1F) === 0 && ((1 << (_la - 64)) & ((1 << (CParser.LeftParen - 64)) | (1 << (CParser.LeftBracket - 64)) | (1 << (CParser.PlusPlus - 64)) | (1 << (CParser.MinusMinus - 64)))) !== 0) || _la === CParser.Arrow || _la === CParser.Dot) {
				{
				this.state = 261;
				this._errHandler.sync(this);
				switch (this._input.LA(1)) {
				case CParser.LeftBracket:
					{
					this.state = 249;
					this.match(CParser.LeftBracket);
					this.state = 250;
					this.expression();
					this.state = 251;
					this.match(CParser.RightBracket);
					}
					break;
				case CParser.LeftParen:
					{
					this.state = 253;
					this.match(CParser.LeftParen);
					this.state = 255;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
					if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << CParser.T__0) | (1 << CParser.T__1) | (1 << CParser.T__2))) !== 0) || ((((_la - 44)) & ~0x1F) === 0 && ((1 << (_la - 44)) & ((1 << (CParser.Sizeof - 44)) | (1 << (CParser.Alignof - 44)) | (1 << (CParser.Generic - 44)) | (1 << (CParser.LeftParen - 44)))) !== 0) || ((((_la - 76)) & ~0x1F) === 0 && ((1 << (_la - 76)) & ((1 << (CParser.Plus - 76)) | (1 << (CParser.PlusPlus - 76)) | (1 << (CParser.Minus - 76)) | (1 << (CParser.MinusMinus - 76)) | (1 << (CParser.Star - 76)) | (1 << (CParser.And - 76)) | (1 << (CParser.AndAnd - 76)) | (1 << (CParser.Not - 76)) | (1 << (CParser.Tilde - 76)))) !== 0) || ((((_la - 110)) & ~0x1F) === 0 && ((1 << (_la - 110)) & ((1 << (CParser.Identifier - 110)) | (1 << (CParser.Constant - 110)) | (1 << (CParser.DigitSequence - 110)) | (1 << (CParser.StringLiteral - 110)))) !== 0)) {
						{
						this.state = 254;
						this.argumentExpressionList();
						}
					}

					this.state = 257;
					this.match(CParser.RightParen);
					}
					break;
				case CParser.Arrow:
				case CParser.Dot:
					{
					this.state = 258;
					_la = this._input.LA(1);
					if (!(_la === CParser.Arrow || _la === CParser.Dot)) {
					this._errHandler.recoverInline(this);
					} else {
						if (this._input.LA(1) === Token.EOF) {
							this.matchedEOF = true;
						}

						this._errHandler.reportMatch(this);
						this.consume();
					}
					this.state = 259;
					this.match(CParser.Identifier);
					}
					break;
				case CParser.PlusPlus:
				case CParser.MinusMinus:
					{
					this.state = 260;
					_la = this._input.LA(1);
					if (!(_la === CParser.PlusPlus || _la === CParser.MinusMinus)) {
					this._errHandler.recoverInline(this);
					} else {
						if (this._input.LA(1) === Token.EOF) {
							this.matchedEOF = true;
						}

						this._errHandler.reportMatch(this);
						this.consume();
					}
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				}
				this.state = 265;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public argumentExpressionList(): ArgumentExpressionListContext {
		let _localctx: ArgumentExpressionListContext = new ArgumentExpressionListContext(this._ctx, this.state);
		this.enterRule(_localctx, 10, CParser.RULE_argumentExpressionList);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 266;
			this.assignmentExpression();
			this.state = 271;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === CParser.Comma) {
				{
				{
				this.state = 267;
				this.match(CParser.Comma);
				this.state = 268;
				this.assignmentExpression();
				}
				}
				this.state = 273;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public unaryExpression(): UnaryExpressionContext {
		let _localctx: UnaryExpressionContext = new UnaryExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 12, CParser.RULE_unaryExpression);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 277;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 12, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 274;
					_la = this._input.LA(1);
					if (!(_la === CParser.Sizeof || _la === CParser.PlusPlus || _la === CParser.MinusMinus)) {
					this._errHandler.recoverInline(this);
					} else {
						if (this._input.LA(1) === Token.EOF) {
							this.matchedEOF = true;
						}

						this._errHandler.reportMatch(this);
						this.consume();
					}
					}
					}
				}
				this.state = 279;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 12, this._ctx);
			}
			this.state = 291;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case CParser.T__0:
			case CParser.T__1:
			case CParser.T__2:
			case CParser.Generic:
			case CParser.LeftParen:
			case CParser.Identifier:
			case CParser.Constant:
			case CParser.StringLiteral:
				{
				this.state = 280;
				this.postfixExpression();
				}
				break;
			case CParser.Plus:
			case CParser.Minus:
			case CParser.Star:
			case CParser.And:
			case CParser.Not:
			case CParser.Tilde:
				{
				this.state = 281;
				this.unaryOperator();
				this.state = 282;
				this.castExpression();
				}
				break;
			case CParser.Sizeof:
			case CParser.Alignof:
				{
				this.state = 284;
				_la = this._input.LA(1);
				if (!(_la === CParser.Sizeof || _la === CParser.Alignof)) {
				this._errHandler.recoverInline(this);
				} else {
					if (this._input.LA(1) === Token.EOF) {
						this.matchedEOF = true;
					}

					this._errHandler.reportMatch(this);
					this.consume();
				}
				this.state = 285;
				this.match(CParser.LeftParen);
				this.state = 286;
				this.typeName();
				this.state = 287;
				this.match(CParser.RightParen);
				}
				break;
			case CParser.AndAnd:
				{
				this.state = 289;
				this.match(CParser.AndAnd);
				this.state = 290;
				this.match(CParser.Identifier);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public unaryOperator(): UnaryOperatorContext {
		let _localctx: UnaryOperatorContext = new UnaryOperatorContext(this._ctx, this.state);
		this.enterRule(_localctx, 14, CParser.RULE_unaryOperator);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 293;
			_la = this._input.LA(1);
			if (!(((((_la - 76)) & ~0x1F) === 0 && ((1 << (_la - 76)) & ((1 << (CParser.Plus - 76)) | (1 << (CParser.Minus - 76)) | (1 << (CParser.Star - 76)) | (1 << (CParser.And - 76)) | (1 << (CParser.Not - 76)) | (1 << (CParser.Tilde - 76)))) !== 0))) {
			this._errHandler.recoverInline(this);
			} else {
				if (this._input.LA(1) === Token.EOF) {
					this.matchedEOF = true;
				}

				this._errHandler.reportMatch(this);
				this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public castExpression(): CastExpressionContext {
		let _localctx: CastExpressionContext = new CastExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 16, CParser.RULE_castExpression);
		let _la: number;
		try {
			this.state = 305;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 15, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 296;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === CParser.T__0) {
					{
					this.state = 295;
					this.match(CParser.T__0);
					}
				}

				this.state = 298;
				this.match(CParser.LeftParen);
				this.state = 299;
				this.typeName();
				this.state = 300;
				this.match(CParser.RightParen);
				this.state = 301;
				this.castExpression();
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 303;
				this.unaryExpression();
				}
				break;

			case 3:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 304;
				this.match(CParser.DigitSequence);
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public multiplicativeExpression(): MultiplicativeExpressionContext {
		let _localctx: MultiplicativeExpressionContext = new MultiplicativeExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 18, CParser.RULE_multiplicativeExpression);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 307;
			this.castExpression();
			this.state = 312;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (((((_la - 80)) & ~0x1F) === 0 && ((1 << (_la - 80)) & ((1 << (CParser.Star - 80)) | (1 << (CParser.Div - 80)) | (1 << (CParser.Mod - 80)))) !== 0)) {
				{
				{
				this.state = 308;
				_la = this._input.LA(1);
				if (!(((((_la - 80)) & ~0x1F) === 0 && ((1 << (_la - 80)) & ((1 << (CParser.Star - 80)) | (1 << (CParser.Div - 80)) | (1 << (CParser.Mod - 80)))) !== 0))) {
				this._errHandler.recoverInline(this);
				} else {
					if (this._input.LA(1) === Token.EOF) {
						this.matchedEOF = true;
					}

					this._errHandler.reportMatch(this);
					this.consume();
				}
				this.state = 309;
				this.castExpression();
				}
				}
				this.state = 314;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public additiveExpression(): AdditiveExpressionContext {
		let _localctx: AdditiveExpressionContext = new AdditiveExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 20, CParser.RULE_additiveExpression);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 315;
			this.multiplicativeExpression();
			this.state = 320;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === CParser.Plus || _la === CParser.Minus) {
				{
				{
				this.state = 316;
				_la = this._input.LA(1);
				if (!(_la === CParser.Plus || _la === CParser.Minus)) {
				this._errHandler.recoverInline(this);
				} else {
					if (this._input.LA(1) === Token.EOF) {
						this.matchedEOF = true;
					}

					this._errHandler.reportMatch(this);
					this.consume();
				}
				this.state = 317;
				this.multiplicativeExpression();
				}
				}
				this.state = 322;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public shiftExpression(): ShiftExpressionContext {
		let _localctx: ShiftExpressionContext = new ShiftExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 22, CParser.RULE_shiftExpression);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 323;
			this.additiveExpression();
			this.state = 328;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === CParser.LeftShift || _la === CParser.RightShift) {
				{
				{
				this.state = 324;
				_la = this._input.LA(1);
				if (!(_la === CParser.LeftShift || _la === CParser.RightShift)) {
				this._errHandler.recoverInline(this);
				} else {
					if (this._input.LA(1) === Token.EOF) {
						this.matchedEOF = true;
					}

					this._errHandler.reportMatch(this);
					this.consume();
				}
				this.state = 325;
				this.additiveExpression();
				}
				}
				this.state = 330;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public relationalExpression(): RelationalExpressionContext {
		let _localctx: RelationalExpressionContext = new RelationalExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 24, CParser.RULE_relationalExpression);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 331;
			this.shiftExpression();
			this.state = 336;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (((((_la - 70)) & ~0x1F) === 0 && ((1 << (_la - 70)) & ((1 << (CParser.Less - 70)) | (1 << (CParser.LessEqual - 70)) | (1 << (CParser.Greater - 70)) | (1 << (CParser.GreaterEqual - 70)))) !== 0)) {
				{
				{
				this.state = 332;
				_la = this._input.LA(1);
				if (!(((((_la - 70)) & ~0x1F) === 0 && ((1 << (_la - 70)) & ((1 << (CParser.Less - 70)) | (1 << (CParser.LessEqual - 70)) | (1 << (CParser.Greater - 70)) | (1 << (CParser.GreaterEqual - 70)))) !== 0))) {
				this._errHandler.recoverInline(this);
				} else {
					if (this._input.LA(1) === Token.EOF) {
						this.matchedEOF = true;
					}

					this._errHandler.reportMatch(this);
					this.consume();
				}
				this.state = 333;
				this.shiftExpression();
				}
				}
				this.state = 338;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public equalityExpression(): EqualityExpressionContext {
		let _localctx: EqualityExpressionContext = new EqualityExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 26, CParser.RULE_equalityExpression);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 339;
			this.relationalExpression();
			this.state = 344;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === CParser.Equal || _la === CParser.NotEqual) {
				{
				{
				this.state = 340;
				_la = this._input.LA(1);
				if (!(_la === CParser.Equal || _la === CParser.NotEqual)) {
				this._errHandler.recoverInline(this);
				} else {
					if (this._input.LA(1) === Token.EOF) {
						this.matchedEOF = true;
					}

					this._errHandler.reportMatch(this);
					this.consume();
				}
				this.state = 341;
				this.relationalExpression();
				}
				}
				this.state = 346;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public andExpression(): AndExpressionContext {
		let _localctx: AndExpressionContext = new AndExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 28, CParser.RULE_andExpression);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 347;
			this.equalityExpression();
			this.state = 352;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === CParser.And) {
				{
				{
				this.state = 348;
				this.match(CParser.And);
				this.state = 349;
				this.equalityExpression();
				}
				}
				this.state = 354;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public exclusiveOrExpression(): ExclusiveOrExpressionContext {
		let _localctx: ExclusiveOrExpressionContext = new ExclusiveOrExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 30, CParser.RULE_exclusiveOrExpression);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 355;
			this.andExpression();
			this.state = 360;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === CParser.Caret) {
				{
				{
				this.state = 356;
				this.match(CParser.Caret);
				this.state = 357;
				this.andExpression();
				}
				}
				this.state = 362;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public inclusiveOrExpression(): InclusiveOrExpressionContext {
		let _localctx: InclusiveOrExpressionContext = new InclusiveOrExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 32, CParser.RULE_inclusiveOrExpression);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 363;
			this.exclusiveOrExpression();
			this.state = 368;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === CParser.Or) {
				{
				{
				this.state = 364;
				this.match(CParser.Or);
				this.state = 365;
				this.exclusiveOrExpression();
				}
				}
				this.state = 370;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public logicalAndExpression(): LogicalAndExpressionContext {
		let _localctx: LogicalAndExpressionContext = new LogicalAndExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 34, CParser.RULE_logicalAndExpression);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 371;
			this.inclusiveOrExpression();
			this.state = 376;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === CParser.AndAnd) {
				{
				{
				this.state = 372;
				this.match(CParser.AndAnd);
				this.state = 373;
				this.inclusiveOrExpression();
				}
				}
				this.state = 378;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public logicalOrExpression(): LogicalOrExpressionContext {
		let _localctx: LogicalOrExpressionContext = new LogicalOrExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 36, CParser.RULE_logicalOrExpression);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 379;
			this.logicalAndExpression();
			this.state = 384;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === CParser.OrOr) {
				{
				{
				this.state = 380;
				this.match(CParser.OrOr);
				this.state = 381;
				this.logicalAndExpression();
				}
				}
				this.state = 386;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public conditionalExpression(): ConditionalExpressionContext {
		let _localctx: ConditionalExpressionContext = new ConditionalExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 38, CParser.RULE_conditionalExpression);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 387;
			this.logicalOrExpression();
			this.state = 393;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === CParser.Question) {
				{
				this.state = 388;
				this.match(CParser.Question);
				this.state = 389;
				this.expression();
				this.state = 390;
				this.match(CParser.Colon);
				this.state = 391;
				this.conditionalExpression();
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public assignmentExpression(): AssignmentExpressionContext {
		let _localctx: AssignmentExpressionContext = new AssignmentExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 40, CParser.RULE_assignmentExpression);
		try {
			this.state = 401;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 27, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 395;
				this.conditionalExpression();
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 396;
				this.unaryExpression();
				this.state = 397;
				this.assignmentOperator();
				this.state = 398;
				this.assignmentExpression();
				}
				break;

			case 3:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 400;
				this.match(CParser.DigitSequence);
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public assignmentOperator(): AssignmentOperatorContext {
		let _localctx: AssignmentOperatorContext = new AssignmentOperatorContext(this._ctx, this.state);
		this.enterRule(_localctx, 42, CParser.RULE_assignmentOperator);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 403;
			_la = this._input.LA(1);
			if (!(((((_la - 94)) & ~0x1F) === 0 && ((1 << (_la - 94)) & ((1 << (CParser.Assign - 94)) | (1 << (CParser.StarAssign - 94)) | (1 << (CParser.DivAssign - 94)) | (1 << (CParser.ModAssign - 94)) | (1 << (CParser.PlusAssign - 94)) | (1 << (CParser.MinusAssign - 94)) | (1 << (CParser.LeftShiftAssign - 94)) | (1 << (CParser.RightShiftAssign - 94)) | (1 << (CParser.AndAssign - 94)) | (1 << (CParser.XorAssign - 94)) | (1 << (CParser.OrAssign - 94)))) !== 0))) {
			this._errHandler.recoverInline(this);
			} else {
				if (this._input.LA(1) === Token.EOF) {
					this.matchedEOF = true;
				}

				this._errHandler.reportMatch(this);
				this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public expression(): ExpressionContext {
		let _localctx: ExpressionContext = new ExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 44, CParser.RULE_expression);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 405;
			this.assignmentExpression();
			this.state = 410;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === CParser.Comma) {
				{
				{
				this.state = 406;
				this.match(CParser.Comma);
				this.state = 407;
				this.assignmentExpression();
				}
				}
				this.state = 412;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public constantExpression(): ConstantExpressionContext {
		let _localctx: ConstantExpressionContext = new ConstantExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 46, CParser.RULE_constantExpression);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 413;
			this.conditionalExpression();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public declaration(): DeclarationContext {
		let _localctx: DeclarationContext = new DeclarationContext(this._ctx, this.state);
		this.enterRule(_localctx, 48, CParser.RULE_declaration);
		let _la: number;
		try {
			this.state = 422;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case CParser.T__0:
			case CParser.T__3:
			case CParser.T__4:
			case CParser.T__5:
			case CParser.T__6:
			case CParser.T__7:
			case CParser.T__8:
			case CParser.T__9:
			case CParser.T__16:
			case CParser.Auto:
			case CParser.Char:
			case CParser.Const:
			case CParser.Double:
			case CParser.Enum:
			case CParser.Extern:
			case CParser.Float:
			case CParser.Inline:
			case CParser.Int:
			case CParser.Long:
			case CParser.Register:
			case CParser.Restrict:
			case CParser.Short:
			case CParser.Signed:
			case CParser.Static:
			case CParser.Struct:
			case CParser.Typedef:
			case CParser.Union:
			case CParser.Unsigned:
			case CParser.Void:
			case CParser.Volatile:
			case CParser.Alignas:
			case CParser.Atomic:
			case CParser.Bool:
			case CParser.Complex:
			case CParser.Noreturn:
			case CParser.ThreadLocal:
			case CParser.Identifier:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 415;
				this.declarationSpecifiers();
				this.state = 417;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << CParser.T__8) | (1 << CParser.T__10) | (1 << CParser.T__11) | (1 << CParser.T__12) | (1 << CParser.T__13) | (1 << CParser.T__14))) !== 0) || ((((_la - 64)) & ~0x1F) === 0 && ((1 << (_la - 64)) & ((1 << (CParser.LeftParen - 64)) | (1 << (CParser.Star - 64)) | (1 << (CParser.Caret - 64)))) !== 0) || _la === CParser.Identifier) {
					{
					this.state = 416;
					this.initDeclaratorList();
					}
				}

				this.state = 419;
				this.match(CParser.Semi);
				}
				break;
			case CParser.StaticAssert:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 421;
				this.staticAssertDeclaration();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public declarationSpecifiers(): DeclarationSpecifiersContext {
		let _localctx: DeclarationSpecifiersContext = new DeclarationSpecifiersContext(this._ctx, this.state);
		this.enterRule(_localctx, 50, CParser.RULE_declarationSpecifiers);
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 425;
			this._errHandler.sync(this);
			_alt = 1;
			do {
				switch (_alt) {
				case 1:
					{
					{
					this.state = 424;
					this.declarationSpecifier();
					}
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				this.state = 427;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 31, this._ctx);
			} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public declarationSpecifiers2(): DeclarationSpecifiers2Context {
		let _localctx: DeclarationSpecifiers2Context = new DeclarationSpecifiers2Context(this._ctx, this.state);
		this.enterRule(_localctx, 52, CParser.RULE_declarationSpecifiers2);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 430;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			do {
				{
				{
				this.state = 429;
				this.declarationSpecifier();
				}
				}
				this.state = 432;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			} while ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << CParser.T__0) | (1 << CParser.T__3) | (1 << CParser.T__4) | (1 << CParser.T__5) | (1 << CParser.T__6) | (1 << CParser.T__7) | (1 << CParser.T__8) | (1 << CParser.T__9) | (1 << CParser.T__16) | (1 << CParser.Auto) | (1 << CParser.Char) | (1 << CParser.Const) | (1 << CParser.Double) | (1 << CParser.Enum) | (1 << CParser.Extern))) !== 0) || ((((_la - 32)) & ~0x1F) === 0 && ((1 << (_la - 32)) & ((1 << (CParser.Float - 32)) | (1 << (CParser.Inline - 32)) | (1 << (CParser.Int - 32)) | (1 << (CParser.Long - 32)) | (1 << (CParser.Register - 32)) | (1 << (CParser.Restrict - 32)) | (1 << (CParser.Short - 32)) | (1 << (CParser.Signed - 32)) | (1 << (CParser.Static - 32)) | (1 << (CParser.Struct - 32)) | (1 << (CParser.Typedef - 32)) | (1 << (CParser.Union - 32)) | (1 << (CParser.Unsigned - 32)) | (1 << (CParser.Void - 32)) | (1 << (CParser.Volatile - 32)) | (1 << (CParser.Alignas - 32)) | (1 << (CParser.Atomic - 32)) | (1 << (CParser.Bool - 32)) | (1 << (CParser.Complex - 32)) | (1 << (CParser.Noreturn - 32)) | (1 << (CParser.ThreadLocal - 32)))) !== 0) || _la === CParser.Identifier);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public declarationSpecifier(): DeclarationSpecifierContext {
		let _localctx: DeclarationSpecifierContext = new DeclarationSpecifierContext(this._ctx, this.state);
		this.enterRule(_localctx, 54, CParser.RULE_declarationSpecifier);
		try {
			this.state = 439;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 33, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 434;
				this.storageClassSpecifier();
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 435;
				this.typeSpecifier();
				}
				break;

			case 3:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 436;
				this.typeQualifier();
				}
				break;

			case 4:
				this.enterOuterAlt(_localctx, 4);
				{
				this.state = 437;
				this.functionSpecifier();
				}
				break;

			case 5:
				this.enterOuterAlt(_localctx, 5);
				{
				this.state = 438;
				this.alignmentSpecifier();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public initDeclaratorList(): InitDeclaratorListContext {
		let _localctx: InitDeclaratorListContext = new InitDeclaratorListContext(this._ctx, this.state);
		this.enterRule(_localctx, 56, CParser.RULE_initDeclaratorList);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 441;
			this.initDeclarator();
			this.state = 446;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === CParser.Comma) {
				{
				{
				this.state = 442;
				this.match(CParser.Comma);
				this.state = 443;
				this.initDeclarator();
				}
				}
				this.state = 448;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public initDeclarator(): InitDeclaratorContext {
		let _localctx: InitDeclaratorContext = new InitDeclaratorContext(this._ctx, this.state);
		this.enterRule(_localctx, 58, CParser.RULE_initDeclarator);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 449;
			this.declarator();
			this.state = 452;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === CParser.Assign) {
				{
				this.state = 450;
				this.match(CParser.Assign);
				this.state = 451;
				this.initializer();
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public storageClassSpecifier(): StorageClassSpecifierContext {
		let _localctx: StorageClassSpecifierContext = new StorageClassSpecifierContext(this._ctx, this.state);
		this.enterRule(_localctx, 60, CParser.RULE_storageClassSpecifier);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 454;
			_la = this._input.LA(1);
			if (!(_la === CParser.Auto || _la === CParser.Extern || ((((_la - 39)) & ~0x1F) === 0 && ((1 << (_la - 39)) & ((1 << (CParser.Register - 39)) | (1 << (CParser.Static - 39)) | (1 << (CParser.Typedef - 39)) | (1 << (CParser.ThreadLocal - 39)))) !== 0))) {
			this._errHandler.recoverInline(this);
			} else {
				if (this._input.LA(1) === Token.EOF) {
					this.matchedEOF = true;
				}

				this._errHandler.reportMatch(this);
				this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public typeSpecifier(): TypeSpecifierContext {
		let _localctx: TypeSpecifierContext = new TypeSpecifierContext(this._ctx, this.state);
		this.enterRule(_localctx, 62, CParser.RULE_typeSpecifier);
		let _la: number;
		try {
			this.state = 470;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case CParser.T__3:
			case CParser.T__4:
			case CParser.T__5:
			case CParser.Char:
			case CParser.Double:
			case CParser.Float:
			case CParser.Int:
			case CParser.Long:
			case CParser.Short:
			case CParser.Signed:
			case CParser.Unsigned:
			case CParser.Void:
			case CParser.Bool:
			case CParser.Complex:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 456;
				_la = this._input.LA(1);
				if (!((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << CParser.T__3) | (1 << CParser.T__4) | (1 << CParser.T__5) | (1 << CParser.Char) | (1 << CParser.Double))) !== 0) || ((((_la - 32)) & ~0x1F) === 0 && ((1 << (_la - 32)) & ((1 << (CParser.Float - 32)) | (1 << (CParser.Int - 32)) | (1 << (CParser.Long - 32)) | (1 << (CParser.Short - 32)) | (1 << (CParser.Signed - 32)) | (1 << (CParser.Unsigned - 32)) | (1 << (CParser.Void - 32)) | (1 << (CParser.Bool - 32)) | (1 << (CParser.Complex - 32)))) !== 0))) {
				this._errHandler.recoverInline(this);
				} else {
					if (this._input.LA(1) === Token.EOF) {
						this.matchedEOF = true;
					}

					this._errHandler.reportMatch(this);
					this.consume();
				}
				}
				break;
			case CParser.T__0:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 457;
				this.match(CParser.T__0);
				this.state = 458;
				this.match(CParser.LeftParen);
				this.state = 459;
				_la = this._input.LA(1);
				if (!((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << CParser.T__3) | (1 << CParser.T__4) | (1 << CParser.T__5))) !== 0))) {
				this._errHandler.recoverInline(this);
				} else {
					if (this._input.LA(1) === Token.EOF) {
						this.matchedEOF = true;
					}

					this._errHandler.reportMatch(this);
					this.consume();
				}
				this.state = 460;
				this.match(CParser.RightParen);
				}
				break;
			case CParser.Atomic:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 461;
				this.atomicTypeSpecifier();
				}
				break;
			case CParser.Struct:
			case CParser.Union:
				this.enterOuterAlt(_localctx, 4);
				{
				this.state = 462;
				this.structOrUnionSpecifier();
				}
				break;
			case CParser.Enum:
				this.enterOuterAlt(_localctx, 5);
				{
				this.state = 463;
				this.enumSpecifier();
				}
				break;
			case CParser.Identifier:
				this.enterOuterAlt(_localctx, 6);
				{
				this.state = 464;
				this.typedefName();
				}
				break;
			case CParser.T__6:
				this.enterOuterAlt(_localctx, 7);
				{
				this.state = 465;
				this.match(CParser.T__6);
				this.state = 466;
				this.match(CParser.LeftParen);
				this.state = 467;
				this.constantExpression();
				this.state = 468;
				this.match(CParser.RightParen);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public structOrUnionSpecifier(): StructOrUnionSpecifierContext {
		let _localctx: StructOrUnionSpecifierContext = new StructOrUnionSpecifierContext(this._ctx, this.state);
		this.enterRule(_localctx, 64, CParser.RULE_structOrUnionSpecifier);
		let _la: number;
		try {
			this.state = 483;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 38, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 472;
				this.structOrUnion();
				this.state = 474;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === CParser.Identifier) {
					{
					this.state = 473;
					this.match(CParser.Identifier);
					}
				}

				this.state = 476;
				this.match(CParser.LeftBrace);
				this.state = 477;
				this.structDeclarationList();
				this.state = 478;
				this.match(CParser.RightBrace);
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 480;
				this.structOrUnion();
				this.state = 481;
				this.match(CParser.Identifier);
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public structOrUnion(): StructOrUnionContext {
		let _localctx: StructOrUnionContext = new StructOrUnionContext(this._ctx, this.state);
		this.enterRule(_localctx, 66, CParser.RULE_structOrUnion);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 485;
			_la = this._input.LA(1);
			if (!(_la === CParser.Struct || _la === CParser.Union)) {
			this._errHandler.recoverInline(this);
			} else {
				if (this._input.LA(1) === Token.EOF) {
					this.matchedEOF = true;
				}

				this._errHandler.reportMatch(this);
				this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public structDeclarationList(): StructDeclarationListContext {
		let _localctx: StructDeclarationListContext = new StructDeclarationListContext(this._ctx, this.state);
		this.enterRule(_localctx, 68, CParser.RULE_structDeclarationList);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 488;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			do {
				{
				{
				this.state = 487;
				this.structDeclaration();
				}
				}
				this.state = 490;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			} while ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << CParser.T__0) | (1 << CParser.T__3) | (1 << CParser.T__4) | (1 << CParser.T__5) | (1 << CParser.T__6) | (1 << CParser.Char) | (1 << CParser.Const) | (1 << CParser.Double) | (1 << CParser.Enum))) !== 0) || ((((_la - 32)) & ~0x1F) === 0 && ((1 << (_la - 32)) & ((1 << (CParser.Float - 32)) | (1 << (CParser.Int - 32)) | (1 << (CParser.Long - 32)) | (1 << (CParser.Restrict - 32)) | (1 << (CParser.Short - 32)) | (1 << (CParser.Signed - 32)) | (1 << (CParser.Struct - 32)) | (1 << (CParser.Union - 32)) | (1 << (CParser.Unsigned - 32)) | (1 << (CParser.Void - 32)) | (1 << (CParser.Volatile - 32)) | (1 << (CParser.Atomic - 32)) | (1 << (CParser.Bool - 32)) | (1 << (CParser.Complex - 32)) | (1 << (CParser.StaticAssert - 32)))) !== 0) || _la === CParser.Identifier);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public structDeclaration(): StructDeclarationContext {
		let _localctx: StructDeclarationContext = new StructDeclarationContext(this._ctx, this.state);
		this.enterRule(_localctx, 70, CParser.RULE_structDeclaration);
		try {
			this.state = 500;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 40, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 492;
				this.specifierQualifierList();
				this.state = 493;
				this.structDeclaratorList();
				this.state = 494;
				this.match(CParser.Semi);
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 496;
				this.specifierQualifierList();
				this.state = 497;
				this.match(CParser.Semi);
				}
				break;

			case 3:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 499;
				this.staticAssertDeclaration();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public specifierQualifierList(): SpecifierQualifierListContext {
		let _localctx: SpecifierQualifierListContext = new SpecifierQualifierListContext(this._ctx, this.state);
		this.enterRule(_localctx, 72, CParser.RULE_specifierQualifierList);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 504;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 41, this._ctx) ) {
			case 1:
				{
				this.state = 502;
				this.typeSpecifier();
				}
				break;

			case 2:
				{
				this.state = 503;
				this.typeQualifier();
				}
				break;
			}
			this.state = 507;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 42, this._ctx) ) {
			case 1:
				{
				this.state = 506;
				this.specifierQualifierList();
				}
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public structDeclaratorList(): StructDeclaratorListContext {
		let _localctx: StructDeclaratorListContext = new StructDeclaratorListContext(this._ctx, this.state);
		this.enterRule(_localctx, 74, CParser.RULE_structDeclaratorList);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 509;
			this.structDeclarator();
			this.state = 514;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === CParser.Comma) {
				{
				{
				this.state = 510;
				this.match(CParser.Comma);
				this.state = 511;
				this.structDeclarator();
				}
				}
				this.state = 516;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public structDeclarator(): StructDeclaratorContext {
		let _localctx: StructDeclaratorContext = new StructDeclaratorContext(this._ctx, this.state);
		this.enterRule(_localctx, 76, CParser.RULE_structDeclarator);
		let _la: number;
		try {
			this.state = 523;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 45, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 517;
				this.declarator();
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 519;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << CParser.T__8) | (1 << CParser.T__10) | (1 << CParser.T__11) | (1 << CParser.T__12) | (1 << CParser.T__13) | (1 << CParser.T__14))) !== 0) || ((((_la - 64)) & ~0x1F) === 0 && ((1 << (_la - 64)) & ((1 << (CParser.LeftParen - 64)) | (1 << (CParser.Star - 64)) | (1 << (CParser.Caret - 64)))) !== 0) || _la === CParser.Identifier) {
					{
					this.state = 518;
					this.declarator();
					}
				}

				this.state = 521;
				this.match(CParser.Colon);
				this.state = 522;
				this.constantExpression();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public enumSpecifier(): EnumSpecifierContext {
		let _localctx: EnumSpecifierContext = new EnumSpecifierContext(this._ctx, this.state);
		this.enterRule(_localctx, 78, CParser.RULE_enumSpecifier);
		let _la: number;
		try {
			this.state = 538;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 48, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 525;
				this.match(CParser.Enum);
				this.state = 527;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === CParser.Identifier) {
					{
					this.state = 526;
					this.match(CParser.Identifier);
					}
				}

				this.state = 529;
				this.match(CParser.LeftBrace);
				this.state = 530;
				this.enumeratorList();
				this.state = 532;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === CParser.Comma) {
					{
					this.state = 531;
					this.match(CParser.Comma);
					}
				}

				this.state = 534;
				this.match(CParser.RightBrace);
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 536;
				this.match(CParser.Enum);
				this.state = 537;
				this.match(CParser.Identifier);
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public enumeratorList(): EnumeratorListContext {
		let _localctx: EnumeratorListContext = new EnumeratorListContext(this._ctx, this.state);
		this.enterRule(_localctx, 80, CParser.RULE_enumeratorList);
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 540;
			this.enumerator();
			this.state = 545;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 49, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 541;
					this.match(CParser.Comma);
					this.state = 542;
					this.enumerator();
					}
					}
				}
				this.state = 547;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 49, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public enumerator(): EnumeratorContext {
		let _localctx: EnumeratorContext = new EnumeratorContext(this._ctx, this.state);
		this.enterRule(_localctx, 82, CParser.RULE_enumerator);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 548;
			this.enumerationConstant();
			this.state = 551;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === CParser.Assign) {
				{
				this.state = 549;
				this.match(CParser.Assign);
				this.state = 550;
				this.constantExpression();
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public enumerationConstant(): EnumerationConstantContext {
		let _localctx: EnumerationConstantContext = new EnumerationConstantContext(this._ctx, this.state);
		this.enterRule(_localctx, 84, CParser.RULE_enumerationConstant);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 553;
			this.match(CParser.Identifier);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public atomicTypeSpecifier(): AtomicTypeSpecifierContext {
		let _localctx: AtomicTypeSpecifierContext = new AtomicTypeSpecifierContext(this._ctx, this.state);
		this.enterRule(_localctx, 86, CParser.RULE_atomicTypeSpecifier);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 555;
			this.match(CParser.Atomic);
			this.state = 556;
			this.match(CParser.LeftParen);
			this.state = 557;
			this.typeName();
			this.state = 558;
			this.match(CParser.RightParen);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public typeQualifier(): TypeQualifierContext {
		let _localctx: TypeQualifierContext = new TypeQualifierContext(this._ctx, this.state);
		this.enterRule(_localctx, 88, CParser.RULE_typeQualifier);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 560;
			_la = this._input.LA(1);
			if (!(_la === CParser.Const || ((((_la - 40)) & ~0x1F) === 0 && ((1 << (_la - 40)) & ((1 << (CParser.Restrict - 40)) | (1 << (CParser.Volatile - 40)) | (1 << (CParser.Atomic - 40)))) !== 0))) {
			this._errHandler.recoverInline(this);
			} else {
				if (this._input.LA(1) === Token.EOF) {
					this.matchedEOF = true;
				}

				this._errHandler.reportMatch(this);
				this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public functionSpecifier(): FunctionSpecifierContext {
		let _localctx: FunctionSpecifierContext = new FunctionSpecifierContext(this._ctx, this.state);
		this.enterRule(_localctx, 90, CParser.RULE_functionSpecifier);
		let _la: number;
		try {
			this.state = 568;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case CParser.T__7:
			case CParser.T__8:
			case CParser.Inline:
			case CParser.Noreturn:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 562;
				_la = this._input.LA(1);
				if (!(_la === CParser.T__7 || _la === CParser.T__8 || _la === CParser.Inline || _la === CParser.Noreturn)) {
				this._errHandler.recoverInline(this);
				} else {
					if (this._input.LA(1) === Token.EOF) {
						this.matchedEOF = true;
					}

					this._errHandler.reportMatch(this);
					this.consume();
				}
				}
				break;
			case CParser.T__16:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 563;
				this.gccAttributeSpecifier();
				}
				break;
			case CParser.T__9:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 564;
				this.match(CParser.T__9);
				this.state = 565;
				this.match(CParser.LeftParen);
				this.state = 566;
				this.match(CParser.Identifier);
				this.state = 567;
				this.match(CParser.RightParen);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public alignmentSpecifier(): AlignmentSpecifierContext {
		let _localctx: AlignmentSpecifierContext = new AlignmentSpecifierContext(this._ctx, this.state);
		this.enterRule(_localctx, 92, CParser.RULE_alignmentSpecifier);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 570;
			this.match(CParser.Alignas);
			this.state = 571;
			this.match(CParser.LeftParen);
			this.state = 574;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 52, this._ctx) ) {
			case 1:
				{
				this.state = 572;
				this.typeName();
				}
				break;

			case 2:
				{
				this.state = 573;
				this.constantExpression();
				}
				break;
			}
			this.state = 576;
			this.match(CParser.RightParen);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public declarator(): DeclaratorContext {
		let _localctx: DeclaratorContext = new DeclaratorContext(this._ctx, this.state);
		this.enterRule(_localctx, 94, CParser.RULE_declarator);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 579;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === CParser.Star || _la === CParser.Caret) {
				{
				this.state = 578;
				this.pointer();
				}
			}

			this.state = 581;
			this.directDeclarator(0);
			this.state = 585;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 54, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 582;
					this.gccDeclaratorExtension();
					}
					}
				}
				this.state = 587;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 54, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}

	public directDeclarator(): DirectDeclaratorContext;
	public directDeclarator(_p: number): DirectDeclaratorContext;
	// @RuleVersion(0)
	public directDeclarator(_p?: number): DirectDeclaratorContext {
		if (_p === undefined) {
			_p = 0;
		}

		let _parentctx: ParserRuleContext = this._ctx;
		let _parentState: number = this.state;
		let _localctx: DirectDeclaratorContext = new DirectDeclaratorContext(this._ctx, _parentState);
		let _prevctx: DirectDeclaratorContext = _localctx;
		let _startState: number = 96;
		this.enterRecursionRule(_localctx, 96, CParser.RULE_directDeclarator, _p);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 605;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 55, this._ctx) ) {
			case 1:
				{
				this.state = 589;
				this.match(CParser.Identifier);
				}
				break;

			case 2:
				{
				this.state = 590;
				this.match(CParser.LeftParen);
				this.state = 591;
				this.declarator();
				this.state = 592;
				this.match(CParser.RightParen);
				}
				break;

			case 3:
				{
				this.state = 594;
				this.match(CParser.Identifier);
				this.state = 595;
				this.match(CParser.Colon);
				this.state = 596;
				this.match(CParser.DigitSequence);
				}
				break;

			case 4:
				{
				this.state = 597;
				this.vcSpecificModifer();
				this.state = 598;
				this.match(CParser.Identifier);
				}
				break;

			case 5:
				{
				this.state = 600;
				this.match(CParser.LeftParen);
				this.state = 601;
				this.vcSpecificModifer();
				this.state = 602;
				this.declarator();
				this.state = 603;
				this.match(CParser.RightParen);
				}
				break;
			}
			this._ctx._stop = this._input.tryLT(-1);
			this.state = 652;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 62, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					if (this._parseListeners != null) {
						this.triggerExitRuleEvent();
					}
					_prevctx = _localctx;
					{
					this.state = 650;
					this._errHandler.sync(this);
					switch ( this.interpreter.adaptivePredict(this._input, 61, this._ctx) ) {
					case 1:
						{
						_localctx = new DirectDeclaratorContext(_parentctx, _parentState);
						this.pushNewRecursionContext(_localctx, _startState, CParser.RULE_directDeclarator);
						this.state = 607;
						if (!(this.precpred(this._ctx, 9))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 9)");
						}
						this.state = 608;
						this.match(CParser.LeftBracket);
						this.state = 610;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
						if (_la === CParser.Const || ((((_la - 40)) & ~0x1F) === 0 && ((1 << (_la - 40)) & ((1 << (CParser.Restrict - 40)) | (1 << (CParser.Volatile - 40)) | (1 << (CParser.Atomic - 40)))) !== 0)) {
							{
							this.state = 609;
							this.typeQualifierList();
							}
						}

						this.state = 613;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
						if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << CParser.T__0) | (1 << CParser.T__1) | (1 << CParser.T__2))) !== 0) || ((((_la - 44)) & ~0x1F) === 0 && ((1 << (_la - 44)) & ((1 << (CParser.Sizeof - 44)) | (1 << (CParser.Alignof - 44)) | (1 << (CParser.Generic - 44)) | (1 << (CParser.LeftParen - 44)))) !== 0) || ((((_la - 76)) & ~0x1F) === 0 && ((1 << (_la - 76)) & ((1 << (CParser.Plus - 76)) | (1 << (CParser.PlusPlus - 76)) | (1 << (CParser.Minus - 76)) | (1 << (CParser.MinusMinus - 76)) | (1 << (CParser.Star - 76)) | (1 << (CParser.And - 76)) | (1 << (CParser.AndAnd - 76)) | (1 << (CParser.Not - 76)) | (1 << (CParser.Tilde - 76)))) !== 0) || ((((_la - 110)) & ~0x1F) === 0 && ((1 << (_la - 110)) & ((1 << (CParser.Identifier - 110)) | (1 << (CParser.Constant - 110)) | (1 << (CParser.DigitSequence - 110)) | (1 << (CParser.StringLiteral - 110)))) !== 0)) {
							{
							this.state = 612;
							this.assignmentExpression();
							}
						}

						this.state = 615;
						this.match(CParser.RightBracket);
						}
						break;

					case 2:
						{
						_localctx = new DirectDeclaratorContext(_parentctx, _parentState);
						this.pushNewRecursionContext(_localctx, _startState, CParser.RULE_directDeclarator);
						this.state = 616;
						if (!(this.precpred(this._ctx, 8))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 8)");
						}
						this.state = 617;
						this.match(CParser.LeftBracket);
						this.state = 618;
						this.match(CParser.Static);
						this.state = 620;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
						if (_la === CParser.Const || ((((_la - 40)) & ~0x1F) === 0 && ((1 << (_la - 40)) & ((1 << (CParser.Restrict - 40)) | (1 << (CParser.Volatile - 40)) | (1 << (CParser.Atomic - 40)))) !== 0)) {
							{
							this.state = 619;
							this.typeQualifierList();
							}
						}

						this.state = 622;
						this.assignmentExpression();
						this.state = 623;
						this.match(CParser.RightBracket);
						}
						break;

					case 3:
						{
						_localctx = new DirectDeclaratorContext(_parentctx, _parentState);
						this.pushNewRecursionContext(_localctx, _startState, CParser.RULE_directDeclarator);
						this.state = 625;
						if (!(this.precpred(this._ctx, 7))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 7)");
						}
						this.state = 626;
						this.match(CParser.LeftBracket);
						this.state = 627;
						this.typeQualifierList();
						this.state = 628;
						this.match(CParser.Static);
						this.state = 629;
						this.assignmentExpression();
						this.state = 630;
						this.match(CParser.RightBracket);
						}
						break;

					case 4:
						{
						_localctx = new DirectDeclaratorContext(_parentctx, _parentState);
						this.pushNewRecursionContext(_localctx, _startState, CParser.RULE_directDeclarator);
						this.state = 632;
						if (!(this.precpred(this._ctx, 6))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 6)");
						}
						this.state = 633;
						this.match(CParser.LeftBracket);
						this.state = 635;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
						if (_la === CParser.Const || ((((_la - 40)) & ~0x1F) === 0 && ((1 << (_la - 40)) & ((1 << (CParser.Restrict - 40)) | (1 << (CParser.Volatile - 40)) | (1 << (CParser.Atomic - 40)))) !== 0)) {
							{
							this.state = 634;
							this.typeQualifierList();
							}
						}

						this.state = 637;
						this.match(CParser.Star);
						this.state = 638;
						this.match(CParser.RightBracket);
						}
						break;

					case 5:
						{
						_localctx = new DirectDeclaratorContext(_parentctx, _parentState);
						this.pushNewRecursionContext(_localctx, _startState, CParser.RULE_directDeclarator);
						this.state = 639;
						if (!(this.precpred(this._ctx, 5))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 5)");
						}
						this.state = 640;
						this.match(CParser.LeftParen);
						this.state = 641;
						this.parameterTypeList();
						this.state = 642;
						this.match(CParser.RightParen);
						}
						break;

					case 6:
						{
						_localctx = new DirectDeclaratorContext(_parentctx, _parentState);
						this.pushNewRecursionContext(_localctx, _startState, CParser.RULE_directDeclarator);
						this.state = 644;
						if (!(this.precpred(this._ctx, 4))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 4)");
						}
						this.state = 645;
						this.match(CParser.LeftParen);
						this.state = 647;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
						if (_la === CParser.Identifier) {
							{
							this.state = 646;
							this.identifierList();
							}
						}

						this.state = 649;
						this.match(CParser.RightParen);
						}
						break;
					}
					}
				}
				this.state = 654;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 62, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.unrollRecursionContexts(_parentctx);
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public vcSpecificModifer(): VcSpecificModiferContext {
		let _localctx: VcSpecificModiferContext = new VcSpecificModiferContext(this._ctx, this.state);
		this.enterRule(_localctx, 98, CParser.RULE_vcSpecificModifer);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 655;
			_la = this._input.LA(1);
			if (!((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << CParser.T__8) | (1 << CParser.T__10) | (1 << CParser.T__11) | (1 << CParser.T__12) | (1 << CParser.T__13) | (1 << CParser.T__14))) !== 0))) {
			this._errHandler.recoverInline(this);
			} else {
				if (this._input.LA(1) === Token.EOF) {
					this.matchedEOF = true;
				}

				this._errHandler.reportMatch(this);
				this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public gccDeclaratorExtension(): GccDeclaratorExtensionContext {
		let _localctx: GccDeclaratorExtensionContext = new GccDeclaratorExtensionContext(this._ctx, this.state);
		this.enterRule(_localctx, 100, CParser.RULE_gccDeclaratorExtension);
		let _la: number;
		try {
			this.state = 666;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case CParser.T__15:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 657;
				this.match(CParser.T__15);
				this.state = 658;
				this.match(CParser.LeftParen);
				this.state = 660;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				do {
					{
					{
					this.state = 659;
					this.match(CParser.StringLiteral);
					}
					}
					this.state = 662;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				} while (_la === CParser.StringLiteral);
				this.state = 664;
				this.match(CParser.RightParen);
				}
				break;
			case CParser.T__16:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 665;
				this.gccAttributeSpecifier();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public gccAttributeSpecifier(): GccAttributeSpecifierContext {
		let _localctx: GccAttributeSpecifierContext = new GccAttributeSpecifierContext(this._ctx, this.state);
		this.enterRule(_localctx, 102, CParser.RULE_gccAttributeSpecifier);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 668;
			this.match(CParser.T__16);
			this.state = 669;
			this.match(CParser.LeftParen);
			this.state = 670;
			this.match(CParser.LeftParen);
			this.state = 671;
			this.gccAttributeList();
			this.state = 672;
			this.match(CParser.RightParen);
			this.state = 673;
			this.match(CParser.RightParen);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public gccAttributeList(): GccAttributeListContext {
		let _localctx: GccAttributeListContext = new GccAttributeListContext(this._ctx, this.state);
		this.enterRule(_localctx, 104, CParser.RULE_gccAttributeList);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 676;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << CParser.T__0) | (1 << CParser.T__1) | (1 << CParser.T__2) | (1 << CParser.T__3) | (1 << CParser.T__4) | (1 << CParser.T__5) | (1 << CParser.T__6) | (1 << CParser.T__7) | (1 << CParser.T__8) | (1 << CParser.T__9) | (1 << CParser.T__10) | (1 << CParser.T__11) | (1 << CParser.T__12) | (1 << CParser.T__13) | (1 << CParser.T__14) | (1 << CParser.T__15) | (1 << CParser.T__16) | (1 << CParser.T__17) | (1 << CParser.T__18) | (1 << CParser.Auto) | (1 << CParser.Break) | (1 << CParser.Case) | (1 << CParser.Char) | (1 << CParser.Const) | (1 << CParser.Continue) | (1 << CParser.Default) | (1 << CParser.Do) | (1 << CParser.Double) | (1 << CParser.Else) | (1 << CParser.Enum) | (1 << CParser.Extern))) !== 0) || ((((_la - 32)) & ~0x1F) === 0 && ((1 << (_la - 32)) & ((1 << (CParser.Float - 32)) | (1 << (CParser.For - 32)) | (1 << (CParser.Goto - 32)) | (1 << (CParser.If - 32)) | (1 << (CParser.Inline - 32)) | (1 << (CParser.Int - 32)) | (1 << (CParser.Long - 32)) | (1 << (CParser.Register - 32)) | (1 << (CParser.Restrict - 32)) | (1 << (CParser.Return - 32)) | (1 << (CParser.Short - 32)) | (1 << (CParser.Signed - 32)) | (1 << (CParser.Sizeof - 32)) | (1 << (CParser.Static - 32)) | (1 << (CParser.Struct - 32)) | (1 << (CParser.Switch - 32)) | (1 << (CParser.Typedef - 32)) | (1 << (CParser.Union - 32)) | (1 << (CParser.Unsigned - 32)) | (1 << (CParser.Void - 32)) | (1 << (CParser.Volatile - 32)) | (1 << (CParser.While - 32)) | (1 << (CParser.Alignas - 32)) | (1 << (CParser.Alignof - 32)) | (1 << (CParser.Atomic - 32)) | (1 << (CParser.Bool - 32)) | (1 << (CParser.Complex - 32)) | (1 << (CParser.Generic - 32)) | (1 << (CParser.Imaginary - 32)) | (1 << (CParser.Noreturn - 32)) | (1 << (CParser.StaticAssert - 32)) | (1 << (CParser.ThreadLocal - 32)))) !== 0) || ((((_la - 66)) & ~0x1F) === 0 && ((1 << (_la - 66)) & ((1 << (CParser.LeftBracket - 66)) | (1 << (CParser.RightBracket - 66)) | (1 << (CParser.LeftBrace - 66)) | (1 << (CParser.RightBrace - 66)) | (1 << (CParser.Less - 66)) | (1 << (CParser.LessEqual - 66)) | (1 << (CParser.Greater - 66)) | (1 << (CParser.GreaterEqual - 66)) | (1 << (CParser.LeftShift - 66)) | (1 << (CParser.RightShift - 66)) | (1 << (CParser.Plus - 66)) | (1 << (CParser.PlusPlus - 66)) | (1 << (CParser.Minus - 66)) | (1 << (CParser.MinusMinus - 66)) | (1 << (CParser.Star - 66)) | (1 << (CParser.Div - 66)) | (1 << (CParser.Mod - 66)) | (1 << (CParser.And - 66)) | (1 << (CParser.Or - 66)) | (1 << (CParser.AndAnd - 66)) | (1 << (CParser.OrOr - 66)) | (1 << (CParser.Caret - 66)) | (1 << (CParser.Not - 66)) | (1 << (CParser.Tilde - 66)) | (1 << (CParser.Question - 66)) | (1 << (CParser.Colon - 66)) | (1 << (CParser.Semi - 66)) | (1 << (CParser.Assign - 66)) | (1 << (CParser.StarAssign - 66)) | (1 << (CParser.DivAssign - 66)) | (1 << (CParser.ModAssign - 66)))) !== 0) || ((((_la - 98)) & ~0x1F) === 0 && ((1 << (_la - 98)) & ((1 << (CParser.PlusAssign - 98)) | (1 << (CParser.MinusAssign - 98)) | (1 << (CParser.LeftShiftAssign - 98)) | (1 << (CParser.RightShiftAssign - 98)) | (1 << (CParser.AndAssign - 98)) | (1 << (CParser.XorAssign - 98)) | (1 << (CParser.OrAssign - 98)) | (1 << (CParser.Equal - 98)) | (1 << (CParser.NotEqual - 98)) | (1 << (CParser.Arrow - 98)) | (1 << (CParser.Dot - 98)) | (1 << (CParser.Ellipsis - 98)) | (1 << (CParser.Identifier - 98)) | (1 << (CParser.Constant - 98)) | (1 << (CParser.DigitSequence - 98)) | (1 << (CParser.StringLiteral - 98)) | (1 << (CParser.ComplexDefine - 98)) | (1 << (CParser.IncludeDirective - 98)) | (1 << (CParser.AsmBlock - 98)) | (1 << (CParser.LineAfterPreprocessing - 98)) | (1 << (CParser.LineDirective - 98)) | (1 << (CParser.PragmaDirective - 98)) | (1 << (CParser.Whitespace - 98)) | (1 << (CParser.Newline - 98)) | (1 << (CParser.BlockComment - 98)) | (1 << (CParser.LineComment - 98)))) !== 0)) {
				{
				this.state = 675;
				this.gccAttribute();
				}
			}

			this.state = 684;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === CParser.Comma) {
				{
				{
				this.state = 678;
				this.match(CParser.Comma);
				this.state = 680;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << CParser.T__0) | (1 << CParser.T__1) | (1 << CParser.T__2) | (1 << CParser.T__3) | (1 << CParser.T__4) | (1 << CParser.T__5) | (1 << CParser.T__6) | (1 << CParser.T__7) | (1 << CParser.T__8) | (1 << CParser.T__9) | (1 << CParser.T__10) | (1 << CParser.T__11) | (1 << CParser.T__12) | (1 << CParser.T__13) | (1 << CParser.T__14) | (1 << CParser.T__15) | (1 << CParser.T__16) | (1 << CParser.T__17) | (1 << CParser.T__18) | (1 << CParser.Auto) | (1 << CParser.Break) | (1 << CParser.Case) | (1 << CParser.Char) | (1 << CParser.Const) | (1 << CParser.Continue) | (1 << CParser.Default) | (1 << CParser.Do) | (1 << CParser.Double) | (1 << CParser.Else) | (1 << CParser.Enum) | (1 << CParser.Extern))) !== 0) || ((((_la - 32)) & ~0x1F) === 0 && ((1 << (_la - 32)) & ((1 << (CParser.Float - 32)) | (1 << (CParser.For - 32)) | (1 << (CParser.Goto - 32)) | (1 << (CParser.If - 32)) | (1 << (CParser.Inline - 32)) | (1 << (CParser.Int - 32)) | (1 << (CParser.Long - 32)) | (1 << (CParser.Register - 32)) | (1 << (CParser.Restrict - 32)) | (1 << (CParser.Return - 32)) | (1 << (CParser.Short - 32)) | (1 << (CParser.Signed - 32)) | (1 << (CParser.Sizeof - 32)) | (1 << (CParser.Static - 32)) | (1 << (CParser.Struct - 32)) | (1 << (CParser.Switch - 32)) | (1 << (CParser.Typedef - 32)) | (1 << (CParser.Union - 32)) | (1 << (CParser.Unsigned - 32)) | (1 << (CParser.Void - 32)) | (1 << (CParser.Volatile - 32)) | (1 << (CParser.While - 32)) | (1 << (CParser.Alignas - 32)) | (1 << (CParser.Alignof - 32)) | (1 << (CParser.Atomic - 32)) | (1 << (CParser.Bool - 32)) | (1 << (CParser.Complex - 32)) | (1 << (CParser.Generic - 32)) | (1 << (CParser.Imaginary - 32)) | (1 << (CParser.Noreturn - 32)) | (1 << (CParser.StaticAssert - 32)) | (1 << (CParser.ThreadLocal - 32)))) !== 0) || ((((_la - 66)) & ~0x1F) === 0 && ((1 << (_la - 66)) & ((1 << (CParser.LeftBracket - 66)) | (1 << (CParser.RightBracket - 66)) | (1 << (CParser.LeftBrace - 66)) | (1 << (CParser.RightBrace - 66)) | (1 << (CParser.Less - 66)) | (1 << (CParser.LessEqual - 66)) | (1 << (CParser.Greater - 66)) | (1 << (CParser.GreaterEqual - 66)) | (1 << (CParser.LeftShift - 66)) | (1 << (CParser.RightShift - 66)) | (1 << (CParser.Plus - 66)) | (1 << (CParser.PlusPlus - 66)) | (1 << (CParser.Minus - 66)) | (1 << (CParser.MinusMinus - 66)) | (1 << (CParser.Star - 66)) | (1 << (CParser.Div - 66)) | (1 << (CParser.Mod - 66)) | (1 << (CParser.And - 66)) | (1 << (CParser.Or - 66)) | (1 << (CParser.AndAnd - 66)) | (1 << (CParser.OrOr - 66)) | (1 << (CParser.Caret - 66)) | (1 << (CParser.Not - 66)) | (1 << (CParser.Tilde - 66)) | (1 << (CParser.Question - 66)) | (1 << (CParser.Colon - 66)) | (1 << (CParser.Semi - 66)) | (1 << (CParser.Assign - 66)) | (1 << (CParser.StarAssign - 66)) | (1 << (CParser.DivAssign - 66)) | (1 << (CParser.ModAssign - 66)))) !== 0) || ((((_la - 98)) & ~0x1F) === 0 && ((1 << (_la - 98)) & ((1 << (CParser.PlusAssign - 98)) | (1 << (CParser.MinusAssign - 98)) | (1 << (CParser.LeftShiftAssign - 98)) | (1 << (CParser.RightShiftAssign - 98)) | (1 << (CParser.AndAssign - 98)) | (1 << (CParser.XorAssign - 98)) | (1 << (CParser.OrAssign - 98)) | (1 << (CParser.Equal - 98)) | (1 << (CParser.NotEqual - 98)) | (1 << (CParser.Arrow - 98)) | (1 << (CParser.Dot - 98)) | (1 << (CParser.Ellipsis - 98)) | (1 << (CParser.Identifier - 98)) | (1 << (CParser.Constant - 98)) | (1 << (CParser.DigitSequence - 98)) | (1 << (CParser.StringLiteral - 98)) | (1 << (CParser.ComplexDefine - 98)) | (1 << (CParser.IncludeDirective - 98)) | (1 << (CParser.AsmBlock - 98)) | (1 << (CParser.LineAfterPreprocessing - 98)) | (1 << (CParser.LineDirective - 98)) | (1 << (CParser.PragmaDirective - 98)) | (1 << (CParser.Whitespace - 98)) | (1 << (CParser.Newline - 98)) | (1 << (CParser.BlockComment - 98)) | (1 << (CParser.LineComment - 98)))) !== 0)) {
					{
					this.state = 679;
					this.gccAttribute();
					}
				}

				}
				}
				this.state = 686;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public gccAttribute(): GccAttributeContext {
		let _localctx: GccAttributeContext = new GccAttributeContext(this._ctx, this.state);
		this.enterRule(_localctx, 106, CParser.RULE_gccAttribute);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 687;
			_la = this._input.LA(1);
			if (_la <= 0 || (((((_la - 64)) & ~0x1F) === 0 && ((1 << (_la - 64)) & ((1 << (CParser.LeftParen - 64)) | (1 << (CParser.RightParen - 64)) | (1 << (CParser.Comma - 64)))) !== 0))) {
			this._errHandler.recoverInline(this);
			} else {
				if (this._input.LA(1) === Token.EOF) {
					this.matchedEOF = true;
				}

				this._errHandler.reportMatch(this);
				this.consume();
			}
			this.state = 693;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === CParser.LeftParen) {
				{
				this.state = 688;
				this.match(CParser.LeftParen);
				this.state = 690;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << CParser.T__0) | (1 << CParser.T__1) | (1 << CParser.T__2))) !== 0) || ((((_la - 44)) & ~0x1F) === 0 && ((1 << (_la - 44)) & ((1 << (CParser.Sizeof - 44)) | (1 << (CParser.Alignof - 44)) | (1 << (CParser.Generic - 44)) | (1 << (CParser.LeftParen - 44)))) !== 0) || ((((_la - 76)) & ~0x1F) === 0 && ((1 << (_la - 76)) & ((1 << (CParser.Plus - 76)) | (1 << (CParser.PlusPlus - 76)) | (1 << (CParser.Minus - 76)) | (1 << (CParser.MinusMinus - 76)) | (1 << (CParser.Star - 76)) | (1 << (CParser.And - 76)) | (1 << (CParser.AndAnd - 76)) | (1 << (CParser.Not - 76)) | (1 << (CParser.Tilde - 76)))) !== 0) || ((((_la - 110)) & ~0x1F) === 0 && ((1 << (_la - 110)) & ((1 << (CParser.Identifier - 110)) | (1 << (CParser.Constant - 110)) | (1 << (CParser.DigitSequence - 110)) | (1 << (CParser.StringLiteral - 110)))) !== 0)) {
					{
					this.state = 689;
					this.argumentExpressionList();
					}
				}

				this.state = 692;
				this.match(CParser.RightParen);
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public nestedParenthesesBlock(): NestedParenthesesBlockContext {
		let _localctx: NestedParenthesesBlockContext = new NestedParenthesesBlockContext(this._ctx, this.state);
		this.enterRule(_localctx, 108, CParser.RULE_nestedParenthesesBlock);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 702;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << CParser.T__0) | (1 << CParser.T__1) | (1 << CParser.T__2) | (1 << CParser.T__3) | (1 << CParser.T__4) | (1 << CParser.T__5) | (1 << CParser.T__6) | (1 << CParser.T__7) | (1 << CParser.T__8) | (1 << CParser.T__9) | (1 << CParser.T__10) | (1 << CParser.T__11) | (1 << CParser.T__12) | (1 << CParser.T__13) | (1 << CParser.T__14) | (1 << CParser.T__15) | (1 << CParser.T__16) | (1 << CParser.T__17) | (1 << CParser.T__18) | (1 << CParser.Auto) | (1 << CParser.Break) | (1 << CParser.Case) | (1 << CParser.Char) | (1 << CParser.Const) | (1 << CParser.Continue) | (1 << CParser.Default) | (1 << CParser.Do) | (1 << CParser.Double) | (1 << CParser.Else) | (1 << CParser.Enum) | (1 << CParser.Extern))) !== 0) || ((((_la - 32)) & ~0x1F) === 0 && ((1 << (_la - 32)) & ((1 << (CParser.Float - 32)) | (1 << (CParser.For - 32)) | (1 << (CParser.Goto - 32)) | (1 << (CParser.If - 32)) | (1 << (CParser.Inline - 32)) | (1 << (CParser.Int - 32)) | (1 << (CParser.Long - 32)) | (1 << (CParser.Register - 32)) | (1 << (CParser.Restrict - 32)) | (1 << (CParser.Return - 32)) | (1 << (CParser.Short - 32)) | (1 << (CParser.Signed - 32)) | (1 << (CParser.Sizeof - 32)) | (1 << (CParser.Static - 32)) | (1 << (CParser.Struct - 32)) | (1 << (CParser.Switch - 32)) | (1 << (CParser.Typedef - 32)) | (1 << (CParser.Union - 32)) | (1 << (CParser.Unsigned - 32)) | (1 << (CParser.Void - 32)) | (1 << (CParser.Volatile - 32)) | (1 << (CParser.While - 32)) | (1 << (CParser.Alignas - 32)) | (1 << (CParser.Alignof - 32)) | (1 << (CParser.Atomic - 32)) | (1 << (CParser.Bool - 32)) | (1 << (CParser.Complex - 32)) | (1 << (CParser.Generic - 32)) | (1 << (CParser.Imaginary - 32)) | (1 << (CParser.Noreturn - 32)) | (1 << (CParser.StaticAssert - 32)) | (1 << (CParser.ThreadLocal - 32)))) !== 0) || ((((_la - 64)) & ~0x1F) === 0 && ((1 << (_la - 64)) & ((1 << (CParser.LeftParen - 64)) | (1 << (CParser.LeftBracket - 64)) | (1 << (CParser.RightBracket - 64)) | (1 << (CParser.LeftBrace - 64)) | (1 << (CParser.RightBrace - 64)) | (1 << (CParser.Less - 64)) | (1 << (CParser.LessEqual - 64)) | (1 << (CParser.Greater - 64)) | (1 << (CParser.GreaterEqual - 64)) | (1 << (CParser.LeftShift - 64)) | (1 << (CParser.RightShift - 64)) | (1 << (CParser.Plus - 64)) | (1 << (CParser.PlusPlus - 64)) | (1 << (CParser.Minus - 64)) | (1 << (CParser.MinusMinus - 64)) | (1 << (CParser.Star - 64)) | (1 << (CParser.Div - 64)) | (1 << (CParser.Mod - 64)) | (1 << (CParser.And - 64)) | (1 << (CParser.Or - 64)) | (1 << (CParser.AndAnd - 64)) | (1 << (CParser.OrOr - 64)) | (1 << (CParser.Caret - 64)) | (1 << (CParser.Not - 64)) | (1 << (CParser.Tilde - 64)) | (1 << (CParser.Question - 64)) | (1 << (CParser.Colon - 64)) | (1 << (CParser.Semi - 64)) | (1 << (CParser.Comma - 64)) | (1 << (CParser.Assign - 64)) | (1 << (CParser.StarAssign - 64)))) !== 0) || ((((_la - 96)) & ~0x1F) === 0 && ((1 << (_la - 96)) & ((1 << (CParser.DivAssign - 96)) | (1 << (CParser.ModAssign - 96)) | (1 << (CParser.PlusAssign - 96)) | (1 << (CParser.MinusAssign - 96)) | (1 << (CParser.LeftShiftAssign - 96)) | (1 << (CParser.RightShiftAssign - 96)) | (1 << (CParser.AndAssign - 96)) | (1 << (CParser.XorAssign - 96)) | (1 << (CParser.OrAssign - 96)) | (1 << (CParser.Equal - 96)) | (1 << (CParser.NotEqual - 96)) | (1 << (CParser.Arrow - 96)) | (1 << (CParser.Dot - 96)) | (1 << (CParser.Ellipsis - 96)) | (1 << (CParser.Identifier - 96)) | (1 << (CParser.Constant - 96)) | (1 << (CParser.DigitSequence - 96)) | (1 << (CParser.StringLiteral - 96)) | (1 << (CParser.ComplexDefine - 96)) | (1 << (CParser.IncludeDirective - 96)) | (1 << (CParser.AsmBlock - 96)) | (1 << (CParser.LineAfterPreprocessing - 96)) | (1 << (CParser.LineDirective - 96)) | (1 << (CParser.PragmaDirective - 96)) | (1 << (CParser.Whitespace - 96)) | (1 << (CParser.Newline - 96)) | (1 << (CParser.BlockComment - 96)) | (1 << (CParser.LineComment - 96)))) !== 0)) {
				{
				this.state = 700;
				this._errHandler.sync(this);
				switch (this._input.LA(1)) {
				case CParser.T__0:
				case CParser.T__1:
				case CParser.T__2:
				case CParser.T__3:
				case CParser.T__4:
				case CParser.T__5:
				case CParser.T__6:
				case CParser.T__7:
				case CParser.T__8:
				case CParser.T__9:
				case CParser.T__10:
				case CParser.T__11:
				case CParser.T__12:
				case CParser.T__13:
				case CParser.T__14:
				case CParser.T__15:
				case CParser.T__16:
				case CParser.T__17:
				case CParser.T__18:
				case CParser.Auto:
				case CParser.Break:
				case CParser.Case:
				case CParser.Char:
				case CParser.Const:
				case CParser.Continue:
				case CParser.Default:
				case CParser.Do:
				case CParser.Double:
				case CParser.Else:
				case CParser.Enum:
				case CParser.Extern:
				case CParser.Float:
				case CParser.For:
				case CParser.Goto:
				case CParser.If:
				case CParser.Inline:
				case CParser.Int:
				case CParser.Long:
				case CParser.Register:
				case CParser.Restrict:
				case CParser.Return:
				case CParser.Short:
				case CParser.Signed:
				case CParser.Sizeof:
				case CParser.Static:
				case CParser.Struct:
				case CParser.Switch:
				case CParser.Typedef:
				case CParser.Union:
				case CParser.Unsigned:
				case CParser.Void:
				case CParser.Volatile:
				case CParser.While:
				case CParser.Alignas:
				case CParser.Alignof:
				case CParser.Atomic:
				case CParser.Bool:
				case CParser.Complex:
				case CParser.Generic:
				case CParser.Imaginary:
				case CParser.Noreturn:
				case CParser.StaticAssert:
				case CParser.ThreadLocal:
				case CParser.LeftBracket:
				case CParser.RightBracket:
				case CParser.LeftBrace:
				case CParser.RightBrace:
				case CParser.Less:
				case CParser.LessEqual:
				case CParser.Greater:
				case CParser.GreaterEqual:
				case CParser.LeftShift:
				case CParser.RightShift:
				case CParser.Plus:
				case CParser.PlusPlus:
				case CParser.Minus:
				case CParser.MinusMinus:
				case CParser.Star:
				case CParser.Div:
				case CParser.Mod:
				case CParser.And:
				case CParser.Or:
				case CParser.AndAnd:
				case CParser.OrOr:
				case CParser.Caret:
				case CParser.Not:
				case CParser.Tilde:
				case CParser.Question:
				case CParser.Colon:
				case CParser.Semi:
				case CParser.Comma:
				case CParser.Assign:
				case CParser.StarAssign:
				case CParser.DivAssign:
				case CParser.ModAssign:
				case CParser.PlusAssign:
				case CParser.MinusAssign:
				case CParser.LeftShiftAssign:
				case CParser.RightShiftAssign:
				case CParser.AndAssign:
				case CParser.XorAssign:
				case CParser.OrAssign:
				case CParser.Equal:
				case CParser.NotEqual:
				case CParser.Arrow:
				case CParser.Dot:
				case CParser.Ellipsis:
				case CParser.Identifier:
				case CParser.Constant:
				case CParser.DigitSequence:
				case CParser.StringLiteral:
				case CParser.ComplexDefine:
				case CParser.IncludeDirective:
				case CParser.AsmBlock:
				case CParser.LineAfterPreprocessing:
				case CParser.LineDirective:
				case CParser.PragmaDirective:
				case CParser.Whitespace:
				case CParser.Newline:
				case CParser.BlockComment:
				case CParser.LineComment:
					{
					this.state = 695;
					_la = this._input.LA(1);
					if (_la <= 0 || (_la === CParser.LeftParen || _la === CParser.RightParen)) {
					this._errHandler.recoverInline(this);
					} else {
						if (this._input.LA(1) === Token.EOF) {
							this.matchedEOF = true;
						}

						this._errHandler.reportMatch(this);
						this.consume();
					}
					}
					break;
				case CParser.LeftParen:
					{
					this.state = 696;
					this.match(CParser.LeftParen);
					this.state = 697;
					this.nestedParenthesesBlock();
					this.state = 698;
					this.match(CParser.RightParen);
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				}
				this.state = 704;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public pointer(): PointerContext {
		let _localctx: PointerContext = new PointerContext(this._ctx, this.state);
		this.enterRule(_localctx, 110, CParser.RULE_pointer);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 709;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			do {
				{
				{
				this.state = 705;
				_la = this._input.LA(1);
				if (!(_la === CParser.Star || _la === CParser.Caret)) {
				this._errHandler.recoverInline(this);
				} else {
					if (this._input.LA(1) === Token.EOF) {
						this.matchedEOF = true;
					}

					this._errHandler.reportMatch(this);
					this.consume();
				}
				this.state = 707;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === CParser.Const || ((((_la - 40)) & ~0x1F) === 0 && ((1 << (_la - 40)) & ((1 << (CParser.Restrict - 40)) | (1 << (CParser.Volatile - 40)) | (1 << (CParser.Atomic - 40)))) !== 0)) {
					{
					this.state = 706;
					this.typeQualifierList();
					}
				}

				}
				}
				this.state = 711;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			} while (_la === CParser.Star || _la === CParser.Caret);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public typeQualifierList(): TypeQualifierListContext {
		let _localctx: TypeQualifierListContext = new TypeQualifierListContext(this._ctx, this.state);
		this.enterRule(_localctx, 112, CParser.RULE_typeQualifierList);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 714;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			do {
				{
				{
				this.state = 713;
				this.typeQualifier();
				}
				}
				this.state = 716;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			} while (_la === CParser.Const || ((((_la - 40)) & ~0x1F) === 0 && ((1 << (_la - 40)) & ((1 << (CParser.Restrict - 40)) | (1 << (CParser.Volatile - 40)) | (1 << (CParser.Atomic - 40)))) !== 0));
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public parameterTypeList(): ParameterTypeListContext {
		let _localctx: ParameterTypeListContext = new ParameterTypeListContext(this._ctx, this.state);
		this.enterRule(_localctx, 114, CParser.RULE_parameterTypeList);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 718;
			this.parameterList();
			this.state = 721;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === CParser.Comma) {
				{
				this.state = 719;
				this.match(CParser.Comma);
				this.state = 720;
				this.match(CParser.Ellipsis);
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public parameterList(): ParameterListContext {
		let _localctx: ParameterListContext = new ParameterListContext(this._ctx, this.state);
		this.enterRule(_localctx, 116, CParser.RULE_parameterList);
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 723;
			this.parameterDeclaration();
			this.state = 728;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 76, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 724;
					this.match(CParser.Comma);
					this.state = 725;
					this.parameterDeclaration();
					}
					}
				}
				this.state = 730;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 76, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public parameterDeclaration(): ParameterDeclarationContext {
		let _localctx: ParameterDeclarationContext = new ParameterDeclarationContext(this._ctx, this.state);
		this.enterRule(_localctx, 118, CParser.RULE_parameterDeclaration);
		let _la: number;
		try {
			this.state = 738;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 78, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 731;
				this.declarationSpecifiers();
				this.state = 732;
				this.declarator();
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 734;
				this.declarationSpecifiers2();
				this.state = 736;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (((((_la - 64)) & ~0x1F) === 0 && ((1 << (_la - 64)) & ((1 << (CParser.LeftParen - 64)) | (1 << (CParser.LeftBracket - 64)) | (1 << (CParser.Star - 64)) | (1 << (CParser.Caret - 64)))) !== 0)) {
					{
					this.state = 735;
					this.abstractDeclarator();
					}
				}

				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public identifierList(): IdentifierListContext {
		let _localctx: IdentifierListContext = new IdentifierListContext(this._ctx, this.state);
		this.enterRule(_localctx, 120, CParser.RULE_identifierList);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 740;
			this.match(CParser.Identifier);
			this.state = 745;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === CParser.Comma) {
				{
				{
				this.state = 741;
				this.match(CParser.Comma);
				this.state = 742;
				this.match(CParser.Identifier);
				}
				}
				this.state = 747;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public typeName(): TypeNameContext {
		let _localctx: TypeNameContext = new TypeNameContext(this._ctx, this.state);
		this.enterRule(_localctx, 122, CParser.RULE_typeName);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 748;
			this.specifierQualifierList();
			this.state = 750;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 64)) & ~0x1F) === 0 && ((1 << (_la - 64)) & ((1 << (CParser.LeftParen - 64)) | (1 << (CParser.LeftBracket - 64)) | (1 << (CParser.Star - 64)) | (1 << (CParser.Caret - 64)))) !== 0)) {
				{
				this.state = 749;
				this.abstractDeclarator();
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public abstractDeclarator(): AbstractDeclaratorContext {
		let _localctx: AbstractDeclaratorContext = new AbstractDeclaratorContext(this._ctx, this.state);
		this.enterRule(_localctx, 124, CParser.RULE_abstractDeclarator);
		let _la: number;
		try {
			this.state = 763;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 83, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 752;
				this.pointer();
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 754;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === CParser.Star || _la === CParser.Caret) {
					{
					this.state = 753;
					this.pointer();
					}
				}

				this.state = 756;
				this.directAbstractDeclarator(0);
				this.state = 760;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la === CParser.T__15 || _la === CParser.T__16) {
					{
					{
					this.state = 757;
					this.gccDeclaratorExtension();
					}
					}
					this.state = 762;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}

	public directAbstractDeclarator(): DirectAbstractDeclaratorContext;
	public directAbstractDeclarator(_p: number): DirectAbstractDeclaratorContext;
	// @RuleVersion(0)
	public directAbstractDeclarator(_p?: number): DirectAbstractDeclaratorContext {
		if (_p === undefined) {
			_p = 0;
		}

		let _parentctx: ParserRuleContext = this._ctx;
		let _parentState: number = this.state;
		let _localctx: DirectAbstractDeclaratorContext = new DirectAbstractDeclaratorContext(this._ctx, _parentState);
		let _prevctx: DirectAbstractDeclaratorContext = _localctx;
		let _startState: number = 126;
		this.enterRecursionRule(_localctx, 126, CParser.RULE_directAbstractDeclarator, _p);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 811;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 90, this._ctx) ) {
			case 1:
				{
				this.state = 766;
				this.match(CParser.LeftParen);
				this.state = 767;
				this.abstractDeclarator();
				this.state = 768;
				this.match(CParser.RightParen);
				this.state = 772;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 84, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 769;
						this.gccDeclaratorExtension();
						}
						}
					}
					this.state = 774;
					this._errHandler.sync(this);
					_alt = this.interpreter.adaptivePredict(this._input, 84, this._ctx);
				}
				}
				break;

			case 2:
				{
				this.state = 775;
				this.match(CParser.LeftBracket);
				this.state = 777;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === CParser.Const || ((((_la - 40)) & ~0x1F) === 0 && ((1 << (_la - 40)) & ((1 << (CParser.Restrict - 40)) | (1 << (CParser.Volatile - 40)) | (1 << (CParser.Atomic - 40)))) !== 0)) {
					{
					this.state = 776;
					this.typeQualifierList();
					}
				}

				this.state = 780;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << CParser.T__0) | (1 << CParser.T__1) | (1 << CParser.T__2))) !== 0) || ((((_la - 44)) & ~0x1F) === 0 && ((1 << (_la - 44)) & ((1 << (CParser.Sizeof - 44)) | (1 << (CParser.Alignof - 44)) | (1 << (CParser.Generic - 44)) | (1 << (CParser.LeftParen - 44)))) !== 0) || ((((_la - 76)) & ~0x1F) === 0 && ((1 << (_la - 76)) & ((1 << (CParser.Plus - 76)) | (1 << (CParser.PlusPlus - 76)) | (1 << (CParser.Minus - 76)) | (1 << (CParser.MinusMinus - 76)) | (1 << (CParser.Star - 76)) | (1 << (CParser.And - 76)) | (1 << (CParser.AndAnd - 76)) | (1 << (CParser.Not - 76)) | (1 << (CParser.Tilde - 76)))) !== 0) || ((((_la - 110)) & ~0x1F) === 0 && ((1 << (_la - 110)) & ((1 << (CParser.Identifier - 110)) | (1 << (CParser.Constant - 110)) | (1 << (CParser.DigitSequence - 110)) | (1 << (CParser.StringLiteral - 110)))) !== 0)) {
					{
					this.state = 779;
					this.assignmentExpression();
					}
				}

				this.state = 782;
				this.match(CParser.RightBracket);
				}
				break;

			case 3:
				{
				this.state = 783;
				this.match(CParser.LeftBracket);
				this.state = 784;
				this.match(CParser.Static);
				this.state = 786;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === CParser.Const || ((((_la - 40)) & ~0x1F) === 0 && ((1 << (_la - 40)) & ((1 << (CParser.Restrict - 40)) | (1 << (CParser.Volatile - 40)) | (1 << (CParser.Atomic - 40)))) !== 0)) {
					{
					this.state = 785;
					this.typeQualifierList();
					}
				}

				this.state = 788;
				this.assignmentExpression();
				this.state = 789;
				this.match(CParser.RightBracket);
				}
				break;

			case 4:
				{
				this.state = 791;
				this.match(CParser.LeftBracket);
				this.state = 792;
				this.typeQualifierList();
				this.state = 793;
				this.match(CParser.Static);
				this.state = 794;
				this.assignmentExpression();
				this.state = 795;
				this.match(CParser.RightBracket);
				}
				break;

			case 5:
				{
				this.state = 797;
				this.match(CParser.LeftBracket);
				this.state = 798;
				this.match(CParser.Star);
				this.state = 799;
				this.match(CParser.RightBracket);
				}
				break;

			case 6:
				{
				this.state = 800;
				this.match(CParser.LeftParen);
				this.state = 802;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << CParser.T__0) | (1 << CParser.T__3) | (1 << CParser.T__4) | (1 << CParser.T__5) | (1 << CParser.T__6) | (1 << CParser.T__7) | (1 << CParser.T__8) | (1 << CParser.T__9) | (1 << CParser.T__16) | (1 << CParser.Auto) | (1 << CParser.Char) | (1 << CParser.Const) | (1 << CParser.Double) | (1 << CParser.Enum) | (1 << CParser.Extern))) !== 0) || ((((_la - 32)) & ~0x1F) === 0 && ((1 << (_la - 32)) & ((1 << (CParser.Float - 32)) | (1 << (CParser.Inline - 32)) | (1 << (CParser.Int - 32)) | (1 << (CParser.Long - 32)) | (1 << (CParser.Register - 32)) | (1 << (CParser.Restrict - 32)) | (1 << (CParser.Short - 32)) | (1 << (CParser.Signed - 32)) | (1 << (CParser.Static - 32)) | (1 << (CParser.Struct - 32)) | (1 << (CParser.Typedef - 32)) | (1 << (CParser.Union - 32)) | (1 << (CParser.Unsigned - 32)) | (1 << (CParser.Void - 32)) | (1 << (CParser.Volatile - 32)) | (1 << (CParser.Alignas - 32)) | (1 << (CParser.Atomic - 32)) | (1 << (CParser.Bool - 32)) | (1 << (CParser.Complex - 32)) | (1 << (CParser.Noreturn - 32)) | (1 << (CParser.ThreadLocal - 32)))) !== 0) || _la === CParser.Identifier) {
					{
					this.state = 801;
					this.parameterTypeList();
					}
				}

				this.state = 804;
				this.match(CParser.RightParen);
				this.state = 808;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 89, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 805;
						this.gccDeclaratorExtension();
						}
						}
					}
					this.state = 810;
					this._errHandler.sync(this);
					_alt = this.interpreter.adaptivePredict(this._input, 89, this._ctx);
				}
				}
				break;
			}
			this._ctx._stop = this._input.tryLT(-1);
			this.state = 856;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 97, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					if (this._parseListeners != null) {
						this.triggerExitRuleEvent();
					}
					_prevctx = _localctx;
					{
					this.state = 854;
					this._errHandler.sync(this);
					switch ( this.interpreter.adaptivePredict(this._input, 96, this._ctx) ) {
					case 1:
						{
						_localctx = new DirectAbstractDeclaratorContext(_parentctx, _parentState);
						this.pushNewRecursionContext(_localctx, _startState, CParser.RULE_directAbstractDeclarator);
						this.state = 813;
						if (!(this.precpred(this._ctx, 5))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 5)");
						}
						this.state = 814;
						this.match(CParser.LeftBracket);
						this.state = 816;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
						if (_la === CParser.Const || ((((_la - 40)) & ~0x1F) === 0 && ((1 << (_la - 40)) & ((1 << (CParser.Restrict - 40)) | (1 << (CParser.Volatile - 40)) | (1 << (CParser.Atomic - 40)))) !== 0)) {
							{
							this.state = 815;
							this.typeQualifierList();
							}
						}

						this.state = 819;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
						if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << CParser.T__0) | (1 << CParser.T__1) | (1 << CParser.T__2))) !== 0) || ((((_la - 44)) & ~0x1F) === 0 && ((1 << (_la - 44)) & ((1 << (CParser.Sizeof - 44)) | (1 << (CParser.Alignof - 44)) | (1 << (CParser.Generic - 44)) | (1 << (CParser.LeftParen - 44)))) !== 0) || ((((_la - 76)) & ~0x1F) === 0 && ((1 << (_la - 76)) & ((1 << (CParser.Plus - 76)) | (1 << (CParser.PlusPlus - 76)) | (1 << (CParser.Minus - 76)) | (1 << (CParser.MinusMinus - 76)) | (1 << (CParser.Star - 76)) | (1 << (CParser.And - 76)) | (1 << (CParser.AndAnd - 76)) | (1 << (CParser.Not - 76)) | (1 << (CParser.Tilde - 76)))) !== 0) || ((((_la - 110)) & ~0x1F) === 0 && ((1 << (_la - 110)) & ((1 << (CParser.Identifier - 110)) | (1 << (CParser.Constant - 110)) | (1 << (CParser.DigitSequence - 110)) | (1 << (CParser.StringLiteral - 110)))) !== 0)) {
							{
							this.state = 818;
							this.assignmentExpression();
							}
						}

						this.state = 821;
						this.match(CParser.RightBracket);
						}
						break;

					case 2:
						{
						_localctx = new DirectAbstractDeclaratorContext(_parentctx, _parentState);
						this.pushNewRecursionContext(_localctx, _startState, CParser.RULE_directAbstractDeclarator);
						this.state = 822;
						if (!(this.precpred(this._ctx, 4))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 4)");
						}
						this.state = 823;
						this.match(CParser.LeftBracket);
						this.state = 824;
						this.match(CParser.Static);
						this.state = 826;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
						if (_la === CParser.Const || ((((_la - 40)) & ~0x1F) === 0 && ((1 << (_la - 40)) & ((1 << (CParser.Restrict - 40)) | (1 << (CParser.Volatile - 40)) | (1 << (CParser.Atomic - 40)))) !== 0)) {
							{
							this.state = 825;
							this.typeQualifierList();
							}
						}

						this.state = 828;
						this.assignmentExpression();
						this.state = 829;
						this.match(CParser.RightBracket);
						}
						break;

					case 3:
						{
						_localctx = new DirectAbstractDeclaratorContext(_parentctx, _parentState);
						this.pushNewRecursionContext(_localctx, _startState, CParser.RULE_directAbstractDeclarator);
						this.state = 831;
						if (!(this.precpred(this._ctx, 3))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 3)");
						}
						this.state = 832;
						this.match(CParser.LeftBracket);
						this.state = 833;
						this.typeQualifierList();
						this.state = 834;
						this.match(CParser.Static);
						this.state = 835;
						this.assignmentExpression();
						this.state = 836;
						this.match(CParser.RightBracket);
						}
						break;

					case 4:
						{
						_localctx = new DirectAbstractDeclaratorContext(_parentctx, _parentState);
						this.pushNewRecursionContext(_localctx, _startState, CParser.RULE_directAbstractDeclarator);
						this.state = 838;
						if (!(this.precpred(this._ctx, 2))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 2)");
						}
						this.state = 839;
						this.match(CParser.LeftBracket);
						this.state = 840;
						this.match(CParser.Star);
						this.state = 841;
						this.match(CParser.RightBracket);
						}
						break;

					case 5:
						{
						_localctx = new DirectAbstractDeclaratorContext(_parentctx, _parentState);
						this.pushNewRecursionContext(_localctx, _startState, CParser.RULE_directAbstractDeclarator);
						this.state = 842;
						if (!(this.precpred(this._ctx, 1))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 1)");
						}
						this.state = 843;
						this.match(CParser.LeftParen);
						this.state = 845;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
						if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << CParser.T__0) | (1 << CParser.T__3) | (1 << CParser.T__4) | (1 << CParser.T__5) | (1 << CParser.T__6) | (1 << CParser.T__7) | (1 << CParser.T__8) | (1 << CParser.T__9) | (1 << CParser.T__16) | (1 << CParser.Auto) | (1 << CParser.Char) | (1 << CParser.Const) | (1 << CParser.Double) | (1 << CParser.Enum) | (1 << CParser.Extern))) !== 0) || ((((_la - 32)) & ~0x1F) === 0 && ((1 << (_la - 32)) & ((1 << (CParser.Float - 32)) | (1 << (CParser.Inline - 32)) | (1 << (CParser.Int - 32)) | (1 << (CParser.Long - 32)) | (1 << (CParser.Register - 32)) | (1 << (CParser.Restrict - 32)) | (1 << (CParser.Short - 32)) | (1 << (CParser.Signed - 32)) | (1 << (CParser.Static - 32)) | (1 << (CParser.Struct - 32)) | (1 << (CParser.Typedef - 32)) | (1 << (CParser.Union - 32)) | (1 << (CParser.Unsigned - 32)) | (1 << (CParser.Void - 32)) | (1 << (CParser.Volatile - 32)) | (1 << (CParser.Alignas - 32)) | (1 << (CParser.Atomic - 32)) | (1 << (CParser.Bool - 32)) | (1 << (CParser.Complex - 32)) | (1 << (CParser.Noreturn - 32)) | (1 << (CParser.ThreadLocal - 32)))) !== 0) || _la === CParser.Identifier) {
							{
							this.state = 844;
							this.parameterTypeList();
							}
						}

						this.state = 847;
						this.match(CParser.RightParen);
						this.state = 851;
						this._errHandler.sync(this);
						_alt = this.interpreter.adaptivePredict(this._input, 95, this._ctx);
						while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
							if (_alt === 1) {
								{
								{
								this.state = 848;
								this.gccDeclaratorExtension();
								}
								}
							}
							this.state = 853;
							this._errHandler.sync(this);
							_alt = this.interpreter.adaptivePredict(this._input, 95, this._ctx);
						}
						}
						break;
					}
					}
				}
				this.state = 858;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 97, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.unrollRecursionContexts(_parentctx);
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public typedefName(): TypedefNameContext {
		let _localctx: TypedefNameContext = new TypedefNameContext(this._ctx, this.state);
		this.enterRule(_localctx, 128, CParser.RULE_typedefName);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 859;
			this.match(CParser.Identifier);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public initializer(): InitializerContext {
		let _localctx: InitializerContext = new InitializerContext(this._ctx, this.state);
		this.enterRule(_localctx, 130, CParser.RULE_initializer);
		let _la: number;
		try {
			this.state = 869;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case CParser.T__0:
			case CParser.T__1:
			case CParser.T__2:
			case CParser.Sizeof:
			case CParser.Alignof:
			case CParser.Generic:
			case CParser.LeftParen:
			case CParser.Plus:
			case CParser.PlusPlus:
			case CParser.Minus:
			case CParser.MinusMinus:
			case CParser.Star:
			case CParser.And:
			case CParser.AndAnd:
			case CParser.Not:
			case CParser.Tilde:
			case CParser.Identifier:
			case CParser.Constant:
			case CParser.DigitSequence:
			case CParser.StringLiteral:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 861;
				this.assignmentExpression();
				}
				break;
			case CParser.LeftBrace:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 862;
				this.match(CParser.LeftBrace);
				this.state = 863;
				this.initializerList();
				this.state = 865;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === CParser.Comma) {
					{
					this.state = 864;
					this.match(CParser.Comma);
					}
				}

				this.state = 867;
				this.match(CParser.RightBrace);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public initializerList(): InitializerListContext {
		let _localctx: InitializerListContext = new InitializerListContext(this._ctx, this.state);
		this.enterRule(_localctx, 132, CParser.RULE_initializerList);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 872;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === CParser.LeftBracket || _la === CParser.Dot) {
				{
				this.state = 871;
				this.designation();
				}
			}

			this.state = 874;
			this.initializer();
			this.state = 882;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 102, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 875;
					this.match(CParser.Comma);
					this.state = 877;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
					if (_la === CParser.LeftBracket || _la === CParser.Dot) {
						{
						this.state = 876;
						this.designation();
						}
					}

					this.state = 879;
					this.initializer();
					}
					}
				}
				this.state = 884;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 102, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public designation(): DesignationContext {
		let _localctx: DesignationContext = new DesignationContext(this._ctx, this.state);
		this.enterRule(_localctx, 134, CParser.RULE_designation);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 885;
			this.designatorList();
			this.state = 886;
			this.match(CParser.Assign);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public designatorList(): DesignatorListContext {
		let _localctx: DesignatorListContext = new DesignatorListContext(this._ctx, this.state);
		this.enterRule(_localctx, 136, CParser.RULE_designatorList);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 889;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			do {
				{
				{
				this.state = 888;
				this.designator();
				}
				}
				this.state = 891;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			} while (_la === CParser.LeftBracket || _la === CParser.Dot);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public designator(): DesignatorContext {
		let _localctx: DesignatorContext = new DesignatorContext(this._ctx, this.state);
		this.enterRule(_localctx, 138, CParser.RULE_designator);
		try {
			this.state = 899;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case CParser.LeftBracket:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 893;
				this.match(CParser.LeftBracket);
				this.state = 894;
				this.constantExpression();
				this.state = 895;
				this.match(CParser.RightBracket);
				}
				break;
			case CParser.Dot:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 897;
				this.match(CParser.Dot);
				this.state = 898;
				this.match(CParser.Identifier);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public staticAssertDeclaration(): StaticAssertDeclarationContext {
		let _localctx: StaticAssertDeclarationContext = new StaticAssertDeclarationContext(this._ctx, this.state);
		this.enterRule(_localctx, 140, CParser.RULE_staticAssertDeclaration);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 901;
			this.match(CParser.StaticAssert);
			this.state = 902;
			this.match(CParser.LeftParen);
			this.state = 903;
			this.constantExpression();
			this.state = 904;
			this.match(CParser.Comma);
			this.state = 906;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			do {
				{
				{
				this.state = 905;
				this.match(CParser.StringLiteral);
				}
				}
				this.state = 908;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			} while (_la === CParser.StringLiteral);
			this.state = 910;
			this.match(CParser.RightParen);
			this.state = 911;
			this.match(CParser.Semi);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public statement(): StatementContext {
		let _localctx: StatementContext = new StatementContext(this._ctx, this.state);
		this.enterRule(_localctx, 142, CParser.RULE_statement);
		let _la: number;
		try {
			this.state = 950;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 111, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 913;
				this.labeledStatement();
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 914;
				this.compoundStatement();
				}
				break;

			case 3:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 915;
				this.expressionStatement();
				}
				break;

			case 4:
				this.enterOuterAlt(_localctx, 4);
				{
				this.state = 916;
				this.selectionStatement();
				}
				break;

			case 5:
				this.enterOuterAlt(_localctx, 5);
				{
				this.state = 917;
				this.iterationStatement();
				}
				break;

			case 6:
				this.enterOuterAlt(_localctx, 6);
				{
				this.state = 918;
				this.jumpStatement();
				}
				break;

			case 7:
				this.enterOuterAlt(_localctx, 7);
				{
				this.state = 919;
				_la = this._input.LA(1);
				if (!(_la === CParser.T__15 || _la === CParser.T__17)) {
				this._errHandler.recoverInline(this);
				} else {
					if (this._input.LA(1) === Token.EOF) {
						this.matchedEOF = true;
					}

					this._errHandler.reportMatch(this);
					this.consume();
				}
				this.state = 920;
				_la = this._input.LA(1);
				if (!(_la === CParser.T__18 || _la === CParser.Volatile)) {
				this._errHandler.recoverInline(this);
				} else {
					if (this._input.LA(1) === Token.EOF) {
						this.matchedEOF = true;
					}

					this._errHandler.reportMatch(this);
					this.consume();
				}
				this.state = 921;
				this.match(CParser.LeftParen);
				this.state = 930;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << CParser.T__0) | (1 << CParser.T__1) | (1 << CParser.T__2))) !== 0) || ((((_la - 44)) & ~0x1F) === 0 && ((1 << (_la - 44)) & ((1 << (CParser.Sizeof - 44)) | (1 << (CParser.Alignof - 44)) | (1 << (CParser.Generic - 44)) | (1 << (CParser.LeftParen - 44)))) !== 0) || ((((_la - 76)) & ~0x1F) === 0 && ((1 << (_la - 76)) & ((1 << (CParser.Plus - 76)) | (1 << (CParser.PlusPlus - 76)) | (1 << (CParser.Minus - 76)) | (1 << (CParser.MinusMinus - 76)) | (1 << (CParser.Star - 76)) | (1 << (CParser.And - 76)) | (1 << (CParser.AndAnd - 76)) | (1 << (CParser.Not - 76)) | (1 << (CParser.Tilde - 76)))) !== 0) || ((((_la - 110)) & ~0x1F) === 0 && ((1 << (_la - 110)) & ((1 << (CParser.Identifier - 110)) | (1 << (CParser.Constant - 110)) | (1 << (CParser.DigitSequence - 110)) | (1 << (CParser.StringLiteral - 110)))) !== 0)) {
					{
					this.state = 922;
					this.logicalOrExpression();
					this.state = 927;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
					while (_la === CParser.Comma) {
						{
						{
						this.state = 923;
						this.match(CParser.Comma);
						this.state = 924;
						this.logicalOrExpression();
						}
						}
						this.state = 929;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
					}
					}
				}

				this.state = 945;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la === CParser.Colon) {
					{
					{
					this.state = 932;
					this.match(CParser.Colon);
					this.state = 941;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
					if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << CParser.T__0) | (1 << CParser.T__1) | (1 << CParser.T__2))) !== 0) || ((((_la - 44)) & ~0x1F) === 0 && ((1 << (_la - 44)) & ((1 << (CParser.Sizeof - 44)) | (1 << (CParser.Alignof - 44)) | (1 << (CParser.Generic - 44)) | (1 << (CParser.LeftParen - 44)))) !== 0) || ((((_la - 76)) & ~0x1F) === 0 && ((1 << (_la - 76)) & ((1 << (CParser.Plus - 76)) | (1 << (CParser.PlusPlus - 76)) | (1 << (CParser.Minus - 76)) | (1 << (CParser.MinusMinus - 76)) | (1 << (CParser.Star - 76)) | (1 << (CParser.And - 76)) | (1 << (CParser.AndAnd - 76)) | (1 << (CParser.Not - 76)) | (1 << (CParser.Tilde - 76)))) !== 0) || ((((_la - 110)) & ~0x1F) === 0 && ((1 << (_la - 110)) & ((1 << (CParser.Identifier - 110)) | (1 << (CParser.Constant - 110)) | (1 << (CParser.DigitSequence - 110)) | (1 << (CParser.StringLiteral - 110)))) !== 0)) {
						{
						this.state = 933;
						this.logicalOrExpression();
						this.state = 938;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
						while (_la === CParser.Comma) {
							{
							{
							this.state = 934;
							this.match(CParser.Comma);
							this.state = 935;
							this.logicalOrExpression();
							}
							}
							this.state = 940;
							this._errHandler.sync(this);
							_la = this._input.LA(1);
						}
						}
					}

					}
					}
					this.state = 947;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 948;
				this.match(CParser.RightParen);
				this.state = 949;
				this.match(CParser.Semi);
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public labeledStatement(): LabeledStatementContext {
		let _localctx: LabeledStatementContext = new LabeledStatementContext(this._ctx, this.state);
		this.enterRule(_localctx, 144, CParser.RULE_labeledStatement);
		try {
			this.state = 963;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case CParser.Identifier:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 952;
				this.match(CParser.Identifier);
				this.state = 953;
				this.match(CParser.Colon);
				this.state = 954;
				this.statement();
				}
				break;
			case CParser.Case:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 955;
				this.match(CParser.Case);
				this.state = 956;
				this.constantExpression();
				this.state = 957;
				this.match(CParser.Colon);
				this.state = 958;
				this.statement();
				}
				break;
			case CParser.Default:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 960;
				this.match(CParser.Default);
				this.state = 961;
				this.match(CParser.Colon);
				this.state = 962;
				this.statement();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public compoundStatement(): CompoundStatementContext {
		let _localctx: CompoundStatementContext = new CompoundStatementContext(this._ctx, this.state);
		this.enterRule(_localctx, 146, CParser.RULE_compoundStatement);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 965;
			this.match(CParser.LeftBrace);
			this.state = 967;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << CParser.T__0) | (1 << CParser.T__1) | (1 << CParser.T__2) | (1 << CParser.T__3) | (1 << CParser.T__4) | (1 << CParser.T__5) | (1 << CParser.T__6) | (1 << CParser.T__7) | (1 << CParser.T__8) | (1 << CParser.T__9) | (1 << CParser.T__15) | (1 << CParser.T__16) | (1 << CParser.T__17) | (1 << CParser.Auto) | (1 << CParser.Break) | (1 << CParser.Case) | (1 << CParser.Char) | (1 << CParser.Const) | (1 << CParser.Continue) | (1 << CParser.Default) | (1 << CParser.Do) | (1 << CParser.Double) | (1 << CParser.Enum) | (1 << CParser.Extern))) !== 0) || ((((_la - 32)) & ~0x1F) === 0 && ((1 << (_la - 32)) & ((1 << (CParser.Float - 32)) | (1 << (CParser.For - 32)) | (1 << (CParser.Goto - 32)) | (1 << (CParser.If - 32)) | (1 << (CParser.Inline - 32)) | (1 << (CParser.Int - 32)) | (1 << (CParser.Long - 32)) | (1 << (CParser.Register - 32)) | (1 << (CParser.Restrict - 32)) | (1 << (CParser.Return - 32)) | (1 << (CParser.Short - 32)) | (1 << (CParser.Signed - 32)) | (1 << (CParser.Sizeof - 32)) | (1 << (CParser.Static - 32)) | (1 << (CParser.Struct - 32)) | (1 << (CParser.Switch - 32)) | (1 << (CParser.Typedef - 32)) | (1 << (CParser.Union - 32)) | (1 << (CParser.Unsigned - 32)) | (1 << (CParser.Void - 32)) | (1 << (CParser.Volatile - 32)) | (1 << (CParser.While - 32)) | (1 << (CParser.Alignas - 32)) | (1 << (CParser.Alignof - 32)) | (1 << (CParser.Atomic - 32)) | (1 << (CParser.Bool - 32)) | (1 << (CParser.Complex - 32)) | (1 << (CParser.Generic - 32)) | (1 << (CParser.Noreturn - 32)) | (1 << (CParser.StaticAssert - 32)) | (1 << (CParser.ThreadLocal - 32)))) !== 0) || ((((_la - 64)) & ~0x1F) === 0 && ((1 << (_la - 64)) & ((1 << (CParser.LeftParen - 64)) | (1 << (CParser.LeftBrace - 64)) | (1 << (CParser.Plus - 64)) | (1 << (CParser.PlusPlus - 64)) | (1 << (CParser.Minus - 64)) | (1 << (CParser.MinusMinus - 64)) | (1 << (CParser.Star - 64)) | (1 << (CParser.And - 64)) | (1 << (CParser.AndAnd - 64)) | (1 << (CParser.Not - 64)) | (1 << (CParser.Tilde - 64)) | (1 << (CParser.Semi - 64)))) !== 0) || ((((_la - 110)) & ~0x1F) === 0 && ((1 << (_la - 110)) & ((1 << (CParser.Identifier - 110)) | (1 << (CParser.Constant - 110)) | (1 << (CParser.DigitSequence - 110)) | (1 << (CParser.StringLiteral - 110)))) !== 0)) {
				{
				this.state = 966;
				this.blockItemList();
				}
			}

			this.state = 969;
			this.match(CParser.RightBrace);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public blockItemList(): BlockItemListContext {
		let _localctx: BlockItemListContext = new BlockItemListContext(this._ctx, this.state);
		this.enterRule(_localctx, 148, CParser.RULE_blockItemList);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 972;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			do {
				{
				{
				this.state = 971;
				this.blockItem();
				}
				}
				this.state = 974;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			} while ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << CParser.T__0) | (1 << CParser.T__1) | (1 << CParser.T__2) | (1 << CParser.T__3) | (1 << CParser.T__4) | (1 << CParser.T__5) | (1 << CParser.T__6) | (1 << CParser.T__7) | (1 << CParser.T__8) | (1 << CParser.T__9) | (1 << CParser.T__15) | (1 << CParser.T__16) | (1 << CParser.T__17) | (1 << CParser.Auto) | (1 << CParser.Break) | (1 << CParser.Case) | (1 << CParser.Char) | (1 << CParser.Const) | (1 << CParser.Continue) | (1 << CParser.Default) | (1 << CParser.Do) | (1 << CParser.Double) | (1 << CParser.Enum) | (1 << CParser.Extern))) !== 0) || ((((_la - 32)) & ~0x1F) === 0 && ((1 << (_la - 32)) & ((1 << (CParser.Float - 32)) | (1 << (CParser.For - 32)) | (1 << (CParser.Goto - 32)) | (1 << (CParser.If - 32)) | (1 << (CParser.Inline - 32)) | (1 << (CParser.Int - 32)) | (1 << (CParser.Long - 32)) | (1 << (CParser.Register - 32)) | (1 << (CParser.Restrict - 32)) | (1 << (CParser.Return - 32)) | (1 << (CParser.Short - 32)) | (1 << (CParser.Signed - 32)) | (1 << (CParser.Sizeof - 32)) | (1 << (CParser.Static - 32)) | (1 << (CParser.Struct - 32)) | (1 << (CParser.Switch - 32)) | (1 << (CParser.Typedef - 32)) | (1 << (CParser.Union - 32)) | (1 << (CParser.Unsigned - 32)) | (1 << (CParser.Void - 32)) | (1 << (CParser.Volatile - 32)) | (1 << (CParser.While - 32)) | (1 << (CParser.Alignas - 32)) | (1 << (CParser.Alignof - 32)) | (1 << (CParser.Atomic - 32)) | (1 << (CParser.Bool - 32)) | (1 << (CParser.Complex - 32)) | (1 << (CParser.Generic - 32)) | (1 << (CParser.Noreturn - 32)) | (1 << (CParser.StaticAssert - 32)) | (1 << (CParser.ThreadLocal - 32)))) !== 0) || ((((_la - 64)) & ~0x1F) === 0 && ((1 << (_la - 64)) & ((1 << (CParser.LeftParen - 64)) | (1 << (CParser.LeftBrace - 64)) | (1 << (CParser.Plus - 64)) | (1 << (CParser.PlusPlus - 64)) | (1 << (CParser.Minus - 64)) | (1 << (CParser.MinusMinus - 64)) | (1 << (CParser.Star - 64)) | (1 << (CParser.And - 64)) | (1 << (CParser.AndAnd - 64)) | (1 << (CParser.Not - 64)) | (1 << (CParser.Tilde - 64)) | (1 << (CParser.Semi - 64)))) !== 0) || ((((_la - 110)) & ~0x1F) === 0 && ((1 << (_la - 110)) & ((1 << (CParser.Identifier - 110)) | (1 << (CParser.Constant - 110)) | (1 << (CParser.DigitSequence - 110)) | (1 << (CParser.StringLiteral - 110)))) !== 0));
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public blockItem(): BlockItemContext {
		let _localctx: BlockItemContext = new BlockItemContext(this._ctx, this.state);
		this.enterRule(_localctx, 150, CParser.RULE_blockItem);
		try {
			this.state = 978;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 115, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 976;
				this.statement();
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 977;
				this.declaration();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public expressionStatement(): ExpressionStatementContext {
		let _localctx: ExpressionStatementContext = new ExpressionStatementContext(this._ctx, this.state);
		this.enterRule(_localctx, 152, CParser.RULE_expressionStatement);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 981;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << CParser.T__0) | (1 << CParser.T__1) | (1 << CParser.T__2))) !== 0) || ((((_la - 44)) & ~0x1F) === 0 && ((1 << (_la - 44)) & ((1 << (CParser.Sizeof - 44)) | (1 << (CParser.Alignof - 44)) | (1 << (CParser.Generic - 44)) | (1 << (CParser.LeftParen - 44)))) !== 0) || ((((_la - 76)) & ~0x1F) === 0 && ((1 << (_la - 76)) & ((1 << (CParser.Plus - 76)) | (1 << (CParser.PlusPlus - 76)) | (1 << (CParser.Minus - 76)) | (1 << (CParser.MinusMinus - 76)) | (1 << (CParser.Star - 76)) | (1 << (CParser.And - 76)) | (1 << (CParser.AndAnd - 76)) | (1 << (CParser.Not - 76)) | (1 << (CParser.Tilde - 76)))) !== 0) || ((((_la - 110)) & ~0x1F) === 0 && ((1 << (_la - 110)) & ((1 << (CParser.Identifier - 110)) | (1 << (CParser.Constant - 110)) | (1 << (CParser.DigitSequence - 110)) | (1 << (CParser.StringLiteral - 110)))) !== 0)) {
				{
				this.state = 980;
				this.expression();
				}
			}

			this.state = 983;
			this.match(CParser.Semi);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public selectionStatement(): SelectionStatementContext {
		let _localctx: SelectionStatementContext = new SelectionStatementContext(this._ctx, this.state);
		this.enterRule(_localctx, 154, CParser.RULE_selectionStatement);
		try {
			this.state = 1000;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case CParser.If:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 985;
				this.match(CParser.If);
				this.state = 986;
				this.match(CParser.LeftParen);
				this.state = 987;
				this.expression();
				this.state = 988;
				this.match(CParser.RightParen);
				this.state = 989;
				this.statement();
				this.state = 992;
				this._errHandler.sync(this);
				switch ( this.interpreter.adaptivePredict(this._input, 117, this._ctx) ) {
				case 1:
					{
					this.state = 990;
					this.match(CParser.Else);
					this.state = 991;
					this.statement();
					}
					break;
				}
				}
				break;
			case CParser.Switch:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 994;
				this.match(CParser.Switch);
				this.state = 995;
				this.match(CParser.LeftParen);
				this.state = 996;
				this.expression();
				this.state = 997;
				this.match(CParser.RightParen);
				this.state = 998;
				this.statement();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public iterationStatement(): IterationStatementContext {
		let _localctx: IterationStatementContext = new IterationStatementContext(this._ctx, this.state);
		this.enterRule(_localctx, 156, CParser.RULE_iterationStatement);
		try {
			this.state = 1022;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case CParser.While:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 1002;
				this.match(CParser.While);
				this.state = 1003;
				this.match(CParser.LeftParen);
				this.state = 1004;
				this.expression();
				this.state = 1005;
				this.match(CParser.RightParen);
				this.state = 1006;
				this.statement();
				}
				break;
			case CParser.Do:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 1008;
				this.match(CParser.Do);
				this.state = 1009;
				this.statement();
				this.state = 1010;
				this.match(CParser.While);
				this.state = 1011;
				this.match(CParser.LeftParen);
				this.state = 1012;
				this.expression();
				this.state = 1013;
				this.match(CParser.RightParen);
				this.state = 1014;
				this.match(CParser.Semi);
				}
				break;
			case CParser.For:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 1016;
				this.match(CParser.For);
				this.state = 1017;
				this.match(CParser.LeftParen);
				this.state = 1018;
				this.forCondition();
				this.state = 1019;
				this.match(CParser.RightParen);
				this.state = 1020;
				this.statement();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public forCondition(): ForConditionContext {
		let _localctx: ForConditionContext = new ForConditionContext(this._ctx, this.state);
		this.enterRule(_localctx, 158, CParser.RULE_forCondition);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1028;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 121, this._ctx) ) {
			case 1:
				{
				this.state = 1024;
				this.forDeclaration();
				}
				break;

			case 2:
				{
				this.state = 1026;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << CParser.T__0) | (1 << CParser.T__1) | (1 << CParser.T__2))) !== 0) || ((((_la - 44)) & ~0x1F) === 0 && ((1 << (_la - 44)) & ((1 << (CParser.Sizeof - 44)) | (1 << (CParser.Alignof - 44)) | (1 << (CParser.Generic - 44)) | (1 << (CParser.LeftParen - 44)))) !== 0) || ((((_la - 76)) & ~0x1F) === 0 && ((1 << (_la - 76)) & ((1 << (CParser.Plus - 76)) | (1 << (CParser.PlusPlus - 76)) | (1 << (CParser.Minus - 76)) | (1 << (CParser.MinusMinus - 76)) | (1 << (CParser.Star - 76)) | (1 << (CParser.And - 76)) | (1 << (CParser.AndAnd - 76)) | (1 << (CParser.Not - 76)) | (1 << (CParser.Tilde - 76)))) !== 0) || ((((_la - 110)) & ~0x1F) === 0 && ((1 << (_la - 110)) & ((1 << (CParser.Identifier - 110)) | (1 << (CParser.Constant - 110)) | (1 << (CParser.DigitSequence - 110)) | (1 << (CParser.StringLiteral - 110)))) !== 0)) {
					{
					this.state = 1025;
					this.expression();
					}
				}

				}
				break;
			}
			this.state = 1030;
			this.match(CParser.Semi);
			this.state = 1032;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << CParser.T__0) | (1 << CParser.T__1) | (1 << CParser.T__2))) !== 0) || ((((_la - 44)) & ~0x1F) === 0 && ((1 << (_la - 44)) & ((1 << (CParser.Sizeof - 44)) | (1 << (CParser.Alignof - 44)) | (1 << (CParser.Generic - 44)) | (1 << (CParser.LeftParen - 44)))) !== 0) || ((((_la - 76)) & ~0x1F) === 0 && ((1 << (_la - 76)) & ((1 << (CParser.Plus - 76)) | (1 << (CParser.PlusPlus - 76)) | (1 << (CParser.Minus - 76)) | (1 << (CParser.MinusMinus - 76)) | (1 << (CParser.Star - 76)) | (1 << (CParser.And - 76)) | (1 << (CParser.AndAnd - 76)) | (1 << (CParser.Not - 76)) | (1 << (CParser.Tilde - 76)))) !== 0) || ((((_la - 110)) & ~0x1F) === 0 && ((1 << (_la - 110)) & ((1 << (CParser.Identifier - 110)) | (1 << (CParser.Constant - 110)) | (1 << (CParser.DigitSequence - 110)) | (1 << (CParser.StringLiteral - 110)))) !== 0)) {
				{
				this.state = 1031;
				this.forExpression();
				}
			}

			this.state = 1034;
			this.match(CParser.Semi);
			this.state = 1036;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << CParser.T__0) | (1 << CParser.T__1) | (1 << CParser.T__2))) !== 0) || ((((_la - 44)) & ~0x1F) === 0 && ((1 << (_la - 44)) & ((1 << (CParser.Sizeof - 44)) | (1 << (CParser.Alignof - 44)) | (1 << (CParser.Generic - 44)) | (1 << (CParser.LeftParen - 44)))) !== 0) || ((((_la - 76)) & ~0x1F) === 0 && ((1 << (_la - 76)) & ((1 << (CParser.Plus - 76)) | (1 << (CParser.PlusPlus - 76)) | (1 << (CParser.Minus - 76)) | (1 << (CParser.MinusMinus - 76)) | (1 << (CParser.Star - 76)) | (1 << (CParser.And - 76)) | (1 << (CParser.AndAnd - 76)) | (1 << (CParser.Not - 76)) | (1 << (CParser.Tilde - 76)))) !== 0) || ((((_la - 110)) & ~0x1F) === 0 && ((1 << (_la - 110)) & ((1 << (CParser.Identifier - 110)) | (1 << (CParser.Constant - 110)) | (1 << (CParser.DigitSequence - 110)) | (1 << (CParser.StringLiteral - 110)))) !== 0)) {
				{
				this.state = 1035;
				this.forExpression();
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public forDeclaration(): ForDeclarationContext {
		let _localctx: ForDeclarationContext = new ForDeclarationContext(this._ctx, this.state);
		this.enterRule(_localctx, 160, CParser.RULE_forDeclaration);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1038;
			this.declarationSpecifiers();
			this.state = 1040;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << CParser.T__8) | (1 << CParser.T__10) | (1 << CParser.T__11) | (1 << CParser.T__12) | (1 << CParser.T__13) | (1 << CParser.T__14))) !== 0) || ((((_la - 64)) & ~0x1F) === 0 && ((1 << (_la - 64)) & ((1 << (CParser.LeftParen - 64)) | (1 << (CParser.Star - 64)) | (1 << (CParser.Caret - 64)))) !== 0) || _la === CParser.Identifier) {
				{
				this.state = 1039;
				this.initDeclaratorList();
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public forExpression(): ForExpressionContext {
		let _localctx: ForExpressionContext = new ForExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 162, CParser.RULE_forExpression);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1042;
			this.assignmentExpression();
			this.state = 1047;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === CParser.Comma) {
				{
				{
				this.state = 1043;
				this.match(CParser.Comma);
				this.state = 1044;
				this.assignmentExpression();
				}
				}
				this.state = 1049;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public jumpStatement(): JumpStatementContext {
		let _localctx: JumpStatementContext = new JumpStatementContext(this._ctx, this.state);
		this.enterRule(_localctx, 164, CParser.RULE_jumpStatement);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1059;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 127, this._ctx) ) {
			case 1:
				{
				this.state = 1050;
				this.match(CParser.Goto);
				this.state = 1051;
				this.match(CParser.Identifier);
				}
				break;

			case 2:
				{
				this.state = 1052;
				_la = this._input.LA(1);
				if (!(_la === CParser.Break || _la === CParser.Continue)) {
				this._errHandler.recoverInline(this);
				} else {
					if (this._input.LA(1) === Token.EOF) {
						this.matchedEOF = true;
					}

					this._errHandler.reportMatch(this);
					this.consume();
				}
				}
				break;

			case 3:
				{
				this.state = 1053;
				this.match(CParser.Return);
				this.state = 1055;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << CParser.T__0) | (1 << CParser.T__1) | (1 << CParser.T__2))) !== 0) || ((((_la - 44)) & ~0x1F) === 0 && ((1 << (_la - 44)) & ((1 << (CParser.Sizeof - 44)) | (1 << (CParser.Alignof - 44)) | (1 << (CParser.Generic - 44)) | (1 << (CParser.LeftParen - 44)))) !== 0) || ((((_la - 76)) & ~0x1F) === 0 && ((1 << (_la - 76)) & ((1 << (CParser.Plus - 76)) | (1 << (CParser.PlusPlus - 76)) | (1 << (CParser.Minus - 76)) | (1 << (CParser.MinusMinus - 76)) | (1 << (CParser.Star - 76)) | (1 << (CParser.And - 76)) | (1 << (CParser.AndAnd - 76)) | (1 << (CParser.Not - 76)) | (1 << (CParser.Tilde - 76)))) !== 0) || ((((_la - 110)) & ~0x1F) === 0 && ((1 << (_la - 110)) & ((1 << (CParser.Identifier - 110)) | (1 << (CParser.Constant - 110)) | (1 << (CParser.DigitSequence - 110)) | (1 << (CParser.StringLiteral - 110)))) !== 0)) {
					{
					this.state = 1054;
					this.expression();
					}
				}

				}
				break;

			case 4:
				{
				this.state = 1057;
				this.match(CParser.Goto);
				this.state = 1058;
				this.unaryExpression();
				}
				break;
			}
			this.state = 1061;
			this.match(CParser.Semi);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public compilationUnit(): CompilationUnitContext {
		let _localctx: CompilationUnitContext = new CompilationUnitContext(this._ctx, this.state);
		this.enterRule(_localctx, 166, CParser.RULE_compilationUnit);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1064;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 1)) & ~0x1F) === 0 && ((1 << (_la - 1)) & ((1 << (CParser.T__0 - 1)) | (1 << (CParser.T__3 - 1)) | (1 << (CParser.T__4 - 1)) | (1 << (CParser.T__5 - 1)) | (1 << (CParser.T__6 - 1)) | (1 << (CParser.T__7 - 1)) | (1 << (CParser.T__8 - 1)) | (1 << (CParser.T__9 - 1)) | (1 << (CParser.T__10 - 1)) | (1 << (CParser.T__11 - 1)) | (1 << (CParser.T__12 - 1)) | (1 << (CParser.T__13 - 1)) | (1 << (CParser.T__14 - 1)) | (1 << (CParser.T__16 - 1)) | (1 << (CParser.Auto - 1)) | (1 << (CParser.Char - 1)) | (1 << (CParser.Const - 1)) | (1 << (CParser.Double - 1)) | (1 << (CParser.Enum - 1)) | (1 << (CParser.Extern - 1)) | (1 << (CParser.Float - 1)))) !== 0) || ((((_la - 36)) & ~0x1F) === 0 && ((1 << (_la - 36)) & ((1 << (CParser.Inline - 36)) | (1 << (CParser.Int - 36)) | (1 << (CParser.Long - 36)) | (1 << (CParser.Register - 36)) | (1 << (CParser.Restrict - 36)) | (1 << (CParser.Short - 36)) | (1 << (CParser.Signed - 36)) | (1 << (CParser.Static - 36)) | (1 << (CParser.Struct - 36)) | (1 << (CParser.Typedef - 36)) | (1 << (CParser.Union - 36)) | (1 << (CParser.Unsigned - 36)) | (1 << (CParser.Void - 36)) | (1 << (CParser.Volatile - 36)) | (1 << (CParser.Alignas - 36)) | (1 << (CParser.Atomic - 36)) | (1 << (CParser.Bool - 36)) | (1 << (CParser.Complex - 36)) | (1 << (CParser.Noreturn - 36)) | (1 << (CParser.StaticAssert - 36)) | (1 << (CParser.ThreadLocal - 36)) | (1 << (CParser.LeftParen - 36)))) !== 0) || ((((_la - 80)) & ~0x1F) === 0 && ((1 << (_la - 80)) & ((1 << (CParser.Star - 80)) | (1 << (CParser.Caret - 80)) | (1 << (CParser.Semi - 80)) | (1 << (CParser.Identifier - 80)))) !== 0)) {
				{
				this.state = 1063;
				this.translationUnit();
				}
			}

			this.state = 1066;
			this.match(CParser.EOF);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public translationUnit(): TranslationUnitContext {
		let _localctx: TranslationUnitContext = new TranslationUnitContext(this._ctx, this.state);
		this.enterRule(_localctx, 168, CParser.RULE_translationUnit);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1069;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			do {
				{
				{
				this.state = 1068;
				this.externalDeclaration();
				}
				}
				this.state = 1071;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			} while (((((_la - 1)) & ~0x1F) === 0 && ((1 << (_la - 1)) & ((1 << (CParser.T__0 - 1)) | (1 << (CParser.T__3 - 1)) | (1 << (CParser.T__4 - 1)) | (1 << (CParser.T__5 - 1)) | (1 << (CParser.T__6 - 1)) | (1 << (CParser.T__7 - 1)) | (1 << (CParser.T__8 - 1)) | (1 << (CParser.T__9 - 1)) | (1 << (CParser.T__10 - 1)) | (1 << (CParser.T__11 - 1)) | (1 << (CParser.T__12 - 1)) | (1 << (CParser.T__13 - 1)) | (1 << (CParser.T__14 - 1)) | (1 << (CParser.T__16 - 1)) | (1 << (CParser.Auto - 1)) | (1 << (CParser.Char - 1)) | (1 << (CParser.Const - 1)) | (1 << (CParser.Double - 1)) | (1 << (CParser.Enum - 1)) | (1 << (CParser.Extern - 1)) | (1 << (CParser.Float - 1)))) !== 0) || ((((_la - 36)) & ~0x1F) === 0 && ((1 << (_la - 36)) & ((1 << (CParser.Inline - 36)) | (1 << (CParser.Int - 36)) | (1 << (CParser.Long - 36)) | (1 << (CParser.Register - 36)) | (1 << (CParser.Restrict - 36)) | (1 << (CParser.Short - 36)) | (1 << (CParser.Signed - 36)) | (1 << (CParser.Static - 36)) | (1 << (CParser.Struct - 36)) | (1 << (CParser.Typedef - 36)) | (1 << (CParser.Union - 36)) | (1 << (CParser.Unsigned - 36)) | (1 << (CParser.Void - 36)) | (1 << (CParser.Volatile - 36)) | (1 << (CParser.Alignas - 36)) | (1 << (CParser.Atomic - 36)) | (1 << (CParser.Bool - 36)) | (1 << (CParser.Complex - 36)) | (1 << (CParser.Noreturn - 36)) | (1 << (CParser.StaticAssert - 36)) | (1 << (CParser.ThreadLocal - 36)) | (1 << (CParser.LeftParen - 36)))) !== 0) || ((((_la - 80)) & ~0x1F) === 0 && ((1 << (_la - 80)) & ((1 << (CParser.Star - 80)) | (1 << (CParser.Caret - 80)) | (1 << (CParser.Semi - 80)) | (1 << (CParser.Identifier - 80)))) !== 0));
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public externalDeclaration(): ExternalDeclarationContext {
		let _localctx: ExternalDeclarationContext = new ExternalDeclarationContext(this._ctx, this.state);
		this.enterRule(_localctx, 170, CParser.RULE_externalDeclaration);
		try {
			this.state = 1076;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 130, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 1073;
				this.functionDefinition();
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 1074;
				this.declaration();
				}
				break;

			case 3:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 1075;
				this.match(CParser.Semi);
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public functionDefinition(): FunctionDefinitionContext {
		let _localctx: FunctionDefinitionContext = new FunctionDefinitionContext(this._ctx, this.state);
		this.enterRule(_localctx, 172, CParser.RULE_functionDefinition);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1079;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 131, this._ctx) ) {
			case 1:
				{
				this.state = 1078;
				this.declarationSpecifiers();
				}
				break;
			}
			this.state = 1081;
			this.declarator();
			this.state = 1083;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << CParser.T__0) | (1 << CParser.T__3) | (1 << CParser.T__4) | (1 << CParser.T__5) | (1 << CParser.T__6) | (1 << CParser.T__7) | (1 << CParser.T__8) | (1 << CParser.T__9) | (1 << CParser.T__16) | (1 << CParser.Auto) | (1 << CParser.Char) | (1 << CParser.Const) | (1 << CParser.Double) | (1 << CParser.Enum) | (1 << CParser.Extern))) !== 0) || ((((_la - 32)) & ~0x1F) === 0 && ((1 << (_la - 32)) & ((1 << (CParser.Float - 32)) | (1 << (CParser.Inline - 32)) | (1 << (CParser.Int - 32)) | (1 << (CParser.Long - 32)) | (1 << (CParser.Register - 32)) | (1 << (CParser.Restrict - 32)) | (1 << (CParser.Short - 32)) | (1 << (CParser.Signed - 32)) | (1 << (CParser.Static - 32)) | (1 << (CParser.Struct - 32)) | (1 << (CParser.Typedef - 32)) | (1 << (CParser.Union - 32)) | (1 << (CParser.Unsigned - 32)) | (1 << (CParser.Void - 32)) | (1 << (CParser.Volatile - 32)) | (1 << (CParser.Alignas - 32)) | (1 << (CParser.Atomic - 32)) | (1 << (CParser.Bool - 32)) | (1 << (CParser.Complex - 32)) | (1 << (CParser.Noreturn - 32)) | (1 << (CParser.StaticAssert - 32)) | (1 << (CParser.ThreadLocal - 32)))) !== 0) || _la === CParser.Identifier) {
				{
				this.state = 1082;
				this.declarationList();
				}
			}

			this.state = 1085;
			this.compoundStatement();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public declarationList(): DeclarationListContext {
		let _localctx: DeclarationListContext = new DeclarationListContext(this._ctx, this.state);
		this.enterRule(_localctx, 174, CParser.RULE_declarationList);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1088;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			do {
				{
				{
				this.state = 1087;
				this.declaration();
				}
				}
				this.state = 1090;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			} while ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << CParser.T__0) | (1 << CParser.T__3) | (1 << CParser.T__4) | (1 << CParser.T__5) | (1 << CParser.T__6) | (1 << CParser.T__7) | (1 << CParser.T__8) | (1 << CParser.T__9) | (1 << CParser.T__16) | (1 << CParser.Auto) | (1 << CParser.Char) | (1 << CParser.Const) | (1 << CParser.Double) | (1 << CParser.Enum) | (1 << CParser.Extern))) !== 0) || ((((_la - 32)) & ~0x1F) === 0 && ((1 << (_la - 32)) & ((1 << (CParser.Float - 32)) | (1 << (CParser.Inline - 32)) | (1 << (CParser.Int - 32)) | (1 << (CParser.Long - 32)) | (1 << (CParser.Register - 32)) | (1 << (CParser.Restrict - 32)) | (1 << (CParser.Short - 32)) | (1 << (CParser.Signed - 32)) | (1 << (CParser.Static - 32)) | (1 << (CParser.Struct - 32)) | (1 << (CParser.Typedef - 32)) | (1 << (CParser.Union - 32)) | (1 << (CParser.Unsigned - 32)) | (1 << (CParser.Void - 32)) | (1 << (CParser.Volatile - 32)) | (1 << (CParser.Alignas - 32)) | (1 << (CParser.Atomic - 32)) | (1 << (CParser.Bool - 32)) | (1 << (CParser.Complex - 32)) | (1 << (CParser.Noreturn - 32)) | (1 << (CParser.StaticAssert - 32)) | (1 << (CParser.ThreadLocal - 32)))) !== 0) || _la === CParser.Identifier);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}

	public sempred(_localctx: RuleContext, ruleIndex: number, predIndex: number): boolean {
		switch (ruleIndex) {
		case 48:
			return this.directDeclarator_sempred(_localctx as DirectDeclaratorContext, predIndex);

		case 63:
			return this.directAbstractDeclarator_sempred(_localctx as DirectAbstractDeclaratorContext, predIndex);
		}
		return true;
	}
	private directDeclarator_sempred(_localctx: DirectDeclaratorContext, predIndex: number): boolean {
		switch (predIndex) {
		case 0:
			return this.precpred(this._ctx, 9);

		case 1:
			return this.precpred(this._ctx, 8);

		case 2:
			return this.precpred(this._ctx, 7);

		case 3:
			return this.precpred(this._ctx, 6);

		case 4:
			return this.precpred(this._ctx, 5);

		case 5:
			return this.precpred(this._ctx, 4);
		}
		return true;
	}
	private directAbstractDeclarator_sempred(_localctx: DirectAbstractDeclaratorContext, predIndex: number): boolean {
		switch (predIndex) {
		case 6:
			return this.precpred(this._ctx, 5);

		case 7:
			return this.precpred(this._ctx, 4);

		case 8:
			return this.precpred(this._ctx, 3);

		case 9:
			return this.precpred(this._ctx, 2);

		case 10:
			return this.precpred(this._ctx, 1);
		}
		return true;
	}

	private static readonly _serializedATNSegments: number = 2;
	private static readonly _serializedATNSegment0: string =
		"\x03\uC91D\uCABA\u058D\uAFBA\u4F53\u0607\uEA8B\uC241\x03}\u0447\x04\x02" +
		"\t\x02\x04\x03\t\x03\x04\x04\t\x04\x04\x05\t\x05\x04\x06\t\x06\x04\x07" +
		"\t\x07\x04\b\t\b\x04\t\t\t\x04\n\t\n\x04\v\t\v\x04\f\t\f\x04\r\t\r\x04" +
		"\x0E\t\x0E\x04\x0F\t\x0F\x04\x10\t\x10\x04\x11\t\x11\x04\x12\t\x12\x04" +
		"\x13\t\x13\x04\x14\t\x14\x04\x15\t\x15\x04\x16\t\x16\x04\x17\t\x17\x04" +
		"\x18\t\x18\x04\x19\t\x19\x04\x1A\t\x1A\x04\x1B\t\x1B\x04\x1C\t\x1C\x04" +
		"\x1D\t\x1D\x04\x1E\t\x1E\x04\x1F\t\x1F\x04 \t \x04!\t!\x04\"\t\"\x04#" +
		"\t#\x04$\t$\x04%\t%\x04&\t&\x04\'\t\'\x04(\t(\x04)\t)\x04*\t*\x04+\t+" +
		"\x04,\t,\x04-\t-\x04.\t.\x04/\t/\x040\t0\x041\t1\x042\t2\x043\t3\x044" +
		"\t4\x045\t5\x046\t6\x047\t7\x048\t8\x049\t9\x04:\t:\x04;\t;\x04<\t<\x04" +
		"=\t=\x04>\t>\x04?\t?\x04@\t@\x04A\tA\x04B\tB\x04C\tC\x04D\tD\x04E\tE\x04" +
		"F\tF\x04G\tG\x04H\tH\x04I\tI\x04J\tJ\x04K\tK\x04L\tL\x04M\tM\x04N\tN\x04" +
		"O\tO\x04P\tP\x04Q\tQ\x04R\tR\x04S\tS\x04T\tT\x04U\tU\x04V\tV\x04W\tW\x04" +
		"X\tX\x04Y\tY\x03\x02\x03\x02\x03\x02\x06\x02\xB6\n\x02\r\x02\x0E\x02\xB7" +
		"\x03\x02\x03\x02\x03\x02\x03\x02\x03\x02\x03\x02\x05\x02\xC0\n\x02\x03" +
		"\x02\x03\x02\x03\x02\x03\x02\x03\x02\x03\x02\x03\x02\x03\x02\x03\x02\x03" +
		"\x02\x03\x02\x03\x02\x03\x02\x03\x02\x03\x02\x03\x02\x03\x02\x03\x02\x05" +
		"\x02\xD4\n\x02\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03" +
		"\x03\x04\x03\x04\x03\x04\x07\x04\xE0\n\x04\f\x04\x0E\x04\xE3\v\x04\x03" +
		"\x05\x03\x05\x05\x05\xE7\n\x05\x03\x05\x03\x05\x03\x05\x03\x06\x03\x06" +
		"\x05\x06\xEE\n\x06\x03\x06\x03\x06\x03\x06\x03\x06\x03\x06\x03\x06\x05" +
		"\x06\xF6\n\x06\x03\x06\x03\x06\x05\x06\xFA\n\x06\x03\x06\x03\x06\x03\x06" +
		"\x03\x06\x03\x06\x03\x06\x05\x06\u0102\n\x06\x03\x06\x03\x06\x03\x06\x03" +
		"\x06\x07\x06\u0108\n\x06\f\x06\x0E\x06\u010B\v\x06\x03\x07\x03\x07\x03" +
		"\x07\x07\x07\u0110\n\x07\f\x07\x0E\x07\u0113\v\x07\x03\b\x07\b\u0116\n" +
		"\b\f\b\x0E\b\u0119\v\b\x03\b\x03\b\x03\b\x03\b\x03\b\x03\b\x03\b\x03\b" +
		"\x03\b\x03\b\x03\b\x05\b\u0126\n\b\x03\t\x03\t\x03\n\x05\n\u012B\n\n\x03" +
		"\n\x03\n\x03\n\x03\n\x03\n\x03\n\x03\n\x05\n\u0134\n\n\x03\v\x03\v\x03" +
		"\v\x07\v\u0139\n\v\f\v\x0E\v\u013C\v\v\x03\f\x03\f\x03\f\x07\f\u0141\n" +
		"\f\f\f\x0E\f\u0144\v\f\x03\r\x03\r\x03\r\x07\r\u0149\n\r\f\r\x0E\r\u014C" +
		"\v\r\x03\x0E\x03\x0E\x03\x0E\x07\x0E\u0151\n\x0E\f\x0E\x0E\x0E\u0154\v" +
		"\x0E\x03\x0F\x03\x0F\x03\x0F\x07\x0F\u0159\n\x0F\f\x0F\x0E\x0F\u015C\v" +
		"\x0F\x03\x10\x03\x10\x03\x10\x07\x10\u0161\n\x10\f\x10\x0E\x10\u0164\v" +
		"\x10\x03\x11\x03\x11\x03\x11\x07\x11\u0169\n\x11\f\x11\x0E\x11\u016C\v" +
		"\x11\x03\x12\x03\x12\x03\x12\x07\x12\u0171\n\x12\f\x12\x0E\x12\u0174\v" +
		"\x12\x03\x13\x03\x13\x03\x13\x07\x13\u0179\n\x13\f\x13\x0E\x13\u017C\v" +
		"\x13\x03\x14\x03\x14\x03\x14\x07\x14\u0181\n\x14\f\x14\x0E\x14\u0184\v" +
		"\x14\x03\x15\x03\x15\x03\x15\x03\x15\x03\x15\x03\x15\x05\x15\u018C\n\x15" +
		"\x03\x16\x03\x16\x03\x16\x03\x16\x03\x16\x03\x16\x05\x16\u0194\n\x16\x03" +
		"\x17\x03\x17\x03\x18\x03\x18\x03\x18\x07\x18\u019B\n\x18\f\x18\x0E\x18" +
		"\u019E\v\x18\x03\x19\x03\x19\x03\x1A\x03\x1A\x05\x1A\u01A4\n\x1A\x03\x1A" +
		"\x03\x1A\x03\x1A\x05\x1A\u01A9\n\x1A\x03\x1B\x06\x1B\u01AC\n\x1B\r\x1B" +
		"\x0E\x1B\u01AD\x03\x1C\x06\x1C\u01B1\n\x1C\r\x1C\x0E\x1C\u01B2\x03\x1D" +
		"\x03\x1D\x03\x1D\x03\x1D\x03\x1D\x05\x1D\u01BA\n\x1D\x03\x1E\x03\x1E\x03" +
		"\x1E\x07\x1E\u01BF\n\x1E\f\x1E\x0E\x1E\u01C2\v\x1E\x03\x1F\x03\x1F\x03" +
		"\x1F\x05\x1F\u01C7\n\x1F\x03 \x03 \x03!\x03!\x03!\x03!\x03!\x03!\x03!" +
		"\x03!\x03!\x03!\x03!\x03!\x03!\x03!\x05!\u01D9\n!\x03\"\x03\"\x05\"\u01DD" +
		"\n\"\x03\"\x03\"\x03\"\x03\"\x03\"\x03\"\x03\"\x05\"\u01E6\n\"\x03#\x03" +
		"#\x03$\x06$\u01EB\n$\r$\x0E$\u01EC\x03%\x03%\x03%\x03%\x03%\x03%\x03%" +
		"\x03%\x05%\u01F7\n%\x03&\x03&\x05&\u01FB\n&\x03&\x05&\u01FE\n&\x03\'\x03" +
		"\'\x03\'\x07\'\u0203\n\'\f\'\x0E\'\u0206\v\'\x03(\x03(\x05(\u020A\n(\x03" +
		"(\x03(\x05(\u020E\n(\x03)\x03)\x05)\u0212\n)\x03)\x03)\x03)\x05)\u0217" +
		"\n)\x03)\x03)\x03)\x03)\x05)\u021D\n)\x03*\x03*\x03*\x07*\u0222\n*\f*" +
		"\x0E*\u0225\v*\x03+\x03+\x03+\x05+\u022A\n+\x03,\x03,\x03-\x03-\x03-\x03" +
		"-\x03-\x03.\x03.\x03/\x03/\x03/\x03/\x03/\x03/\x05/\u023B\n/\x030\x03" +
		"0\x030\x030\x050\u0241\n0\x030\x030\x031\x051\u0246\n1\x031\x031\x071" +
		"\u024A\n1\f1\x0E1\u024D\v1\x032\x032\x032\x032\x032\x032\x032\x032\x03" +
		"2\x032\x032\x032\x032\x032\x032\x032\x032\x052\u0260\n2\x032\x032\x03" +
		"2\x052\u0265\n2\x032\x052\u0268\n2\x032\x032\x032\x032\x032\x052\u026F" +
		"\n2\x032\x032\x032\x032\x032\x032\x032\x032\x032\x032\x032\x032\x032\x05" +
		"2\u027E\n2\x032\x032\x032\x032\x032\x032\x032\x032\x032\x032\x052\u028A" +
		"\n2\x032\x072\u028D\n2\f2\x0E2\u0290\v2\x033\x033\x034\x034\x034\x064" +
		"\u0297\n4\r4\x0E4\u0298\x034\x034\x054\u029D\n4\x035\x035\x035\x035\x03" +
		"5\x035\x035\x036\x056\u02A7\n6\x036\x036\x056\u02AB\n6\x076\u02AD\n6\f" +
		"6\x0E6\u02B0\v6\x037\x037\x037\x057\u02B5\n7\x037\x057\u02B8\n7\x038\x03" +
		"8\x038\x038\x038\x078\u02BF\n8\f8\x0E8\u02C2\v8\x039\x039\x059\u02C6\n" +
		"9\x069\u02C8\n9\r9\x0E9\u02C9\x03:\x06:\u02CD\n:\r:\x0E:\u02CE\x03;\x03" +
		";\x03;\x05;\u02D4\n;\x03<\x03<\x03<\x07<\u02D9\n<\f<\x0E<\u02DC\v<\x03" +
		"=\x03=\x03=\x03=\x03=\x05=\u02E3\n=\x05=\u02E5\n=\x03>\x03>\x03>\x07>" +
		"\u02EA\n>\f>\x0E>\u02ED\v>\x03?\x03?\x05?\u02F1\n?\x03@\x03@\x05@\u02F5" +
		"\n@\x03@\x03@\x07@\u02F9\n@\f@\x0E@\u02FC\v@\x05@\u02FE\n@\x03A\x03A\x03" +
		"A\x03A\x03A\x07A\u0305\nA\fA\x0EA\u0308\vA\x03A\x03A\x05A\u030C\nA\x03" +
		"A\x05A\u030F\nA\x03A\x03A\x03A\x03A\x05A\u0315\nA\x03A\x03A\x03A\x03A" +
		"\x03A\x03A\x03A\x03A\x03A\x03A\x03A\x03A\x03A\x03A\x05A\u0325\nA\x03A" +
		"\x03A\x07A\u0329\nA\fA\x0EA\u032C\vA\x05A\u032E\nA\x03A\x03A\x03A\x05" +
		"A\u0333\nA\x03A\x05A\u0336\nA\x03A\x03A\x03A\x03A\x03A\x05A\u033D\nA\x03" +
		"A\x03A\x03A\x03A\x03A\x03A\x03A\x03A\x03A\x03A\x03A\x03A\x03A\x03A\x03" +
		"A\x03A\x03A\x05A\u0350\nA\x03A\x03A\x07A\u0354\nA\fA\x0EA\u0357\vA\x07" +
		"A\u0359\nA\fA\x0EA\u035C\vA\x03B\x03B\x03C\x03C\x03C\x03C\x05C\u0364\n" +
		"C\x03C\x03C\x05C\u0368\nC\x03D\x05D\u036B\nD\x03D\x03D\x03D\x05D\u0370" +
		"\nD\x03D\x07D\u0373\nD\fD\x0ED\u0376\vD\x03E\x03E\x03E\x03F\x06F\u037C" +
		"\nF\rF\x0EF\u037D\x03G\x03G\x03G\x03G\x03G\x03G\x05G\u0386\nG\x03H\x03" +
		"H\x03H\x03H\x03H\x06H\u038D\nH\rH\x0EH\u038E\x03H\x03H\x03H\x03I\x03I" +
		"\x03I\x03I\x03I\x03I\x03I\x03I\x03I\x03I\x03I\x03I\x07I\u03A0\nI\fI\x0E" +
		"I\u03A3\vI\x05I\u03A5\nI\x03I\x03I\x03I\x03I\x07I\u03AB\nI\fI\x0EI\u03AE" +
		"\vI\x05I\u03B0\nI\x07I\u03B2\nI\fI\x0EI\u03B5\vI\x03I\x03I\x05I\u03B9" +
		"\nI\x03J\x03J\x03J\x03J\x03J\x03J\x03J\x03J\x03J\x03J\x03J\x05J\u03C6" +
		"\nJ\x03K\x03K\x05K\u03CA\nK\x03K\x03K\x03L\x06L\u03CF\nL\rL\x0EL\u03D0" +
		"\x03M\x03M\x05M\u03D5\nM\x03N\x05N\u03D8\nN\x03N\x03N\x03O\x03O\x03O\x03" +
		"O\x03O\x03O\x03O\x05O\u03E3\nO\x03O\x03O\x03O\x03O\x03O\x03O\x05O\u03EB" +
		"\nO\x03P\x03P\x03P\x03P\x03P\x03P\x03P\x03P\x03P\x03P\x03P\x03P\x03P\x03" +
		"P\x03P\x03P\x03P\x03P\x03P\x03P\x05P\u0401\nP\x03Q\x03Q\x05Q\u0405\nQ" +
		"\x05Q\u0407\nQ\x03Q\x03Q\x05Q\u040B\nQ\x03Q\x03Q\x05Q\u040F\nQ\x03R\x03" +
		"R\x05R\u0413\nR\x03S\x03S\x03S\x07S\u0418\nS\fS\x0ES\u041B\vS\x03T\x03" +
		"T\x03T\x03T\x03T\x05T\u0422\nT\x03T\x03T\x05T\u0426\nT\x03T\x03T\x03U" +
		"\x05U\u042B\nU\x03U\x03U\x03V\x06V\u0430\nV\rV\x0EV\u0431\x03W\x03W\x03" +
		"W\x05W\u0437\nW\x03X\x05X\u043A\nX\x03X\x03X\x05X\u043E\nX\x03X\x03X\x03" +
		"Y\x06Y\u0443\nY\rY\x0EY\u0444\x03Y\x02\x02\x04b\x80Z\x02\x02\x04\x02\x06" +
		"\x02\b\x02\n\x02\f\x02\x0E\x02\x10\x02\x12\x02\x14\x02\x16\x02\x18\x02" +
		"\x1A\x02\x1C\x02\x1E\x02 \x02\"\x02$\x02&\x02(\x02*\x02,\x02.\x020\x02" +
		"2\x024\x026\x028\x02:\x02<\x02>\x02@\x02B\x02D\x02F\x02H\x02J\x02L\x02" +
		"N\x02P\x02R\x02T\x02V\x02X\x02Z\x02\\\x02^\x02`\x02b\x02d\x02f\x02h\x02" +
		"j\x02l\x02n\x02p\x02r\x02t\x02v\x02x\x02z\x02|\x02~\x02\x80\x02\x82\x02" +
		"\x84\x02\x86\x02\x88\x02\x8A\x02\x8C\x02\x8E\x02\x90\x02\x92\x02\x94\x02" +
		"\x96\x02\x98\x02\x9A\x02\x9C\x02\x9E\x02\xA0\x02\xA2\x02\xA4\x02\xA6\x02" +
		"\xA8\x02\xAA\x02\xAC\x02\xAE\x02\xB0\x02\x02\x1A\x03\x02mn\x04\x02OOQ" +
		"Q\x05\x02..OOQQ\x04\x02..99\x07\x02NNPPRRUUZ[\x03\x02RT\x04\x02NNPP\x03" +
		"\x02LM\x03\x02HK\x03\x02kl\x03\x02`j\b\x02\x16\x16!!))//22AA\n\x02\x06" +
		"\b\x19\x19\x1E\x1E\"\"\'(,-45;<\x03\x02\x06\b\x04\x020033\x06\x02\x1A" +
		"\x1A**66::\x05\x02\n\v&&??\x04\x02\v\v\r\x11\x04\x02BC__\x03\x02BC\x04" +
		"\x02RRYY\x04\x02\x12\x12\x14\x14\x04\x02\x15\x1566\x04\x02\x17\x17\x1B" +
		"\x1B\x02\u04A2\x02\xD3\x03\x02\x02\x02\x04\xD5\x03\x02\x02\x02\x06\xDC" +
		"\x03\x02\x02\x02\b\xE6\x03\x02\x02\x02\n\xF9\x03\x02\x02\x02\f\u010C\x03" +
		"\x02\x02\x02\x0E\u0117\x03\x02\x02\x02\x10\u0127\x03\x02\x02\x02\x12\u0133" +
		"\x03\x02\x02\x02\x14\u0135\x03\x02\x02\x02\x16\u013D\x03\x02\x02\x02\x18" +
		"\u0145\x03\x02\x02\x02\x1A\u014D\x03\x02\x02\x02\x1C\u0155\x03\x02\x02" +
		"\x02\x1E\u015D\x03\x02\x02\x02 \u0165\x03\x02\x02\x02\"\u016D\x03\x02" +
		"\x02\x02$\u0175\x03\x02\x02\x02&\u017D\x03\x02\x02\x02(\u0185\x03\x02" +
		"\x02\x02*\u0193\x03\x02\x02\x02,\u0195\x03\x02\x02\x02.\u0197\x03\x02" +
		"\x02\x020\u019F\x03\x02\x02\x022\u01A8\x03\x02\x02\x024\u01AB\x03\x02" +
		"\x02\x026\u01B0\x03\x02\x02\x028\u01B9\x03\x02\x02\x02:\u01BB\x03\x02" +
		"\x02\x02<\u01C3\x03\x02\x02\x02>\u01C8\x03\x02\x02\x02@\u01D8\x03\x02" +
		"\x02\x02B\u01E5\x03\x02\x02\x02D\u01E7\x03\x02\x02\x02F\u01EA\x03\x02" +
		"\x02\x02H\u01F6\x03\x02\x02\x02J\u01FA\x03\x02\x02\x02L\u01FF\x03\x02" +
		"\x02\x02N\u020D\x03\x02\x02\x02P\u021C\x03\x02\x02\x02R\u021E\x03\x02" +
		"\x02\x02T\u0226\x03\x02\x02\x02V\u022B\x03\x02\x02\x02X\u022D\x03\x02" +
		"\x02\x02Z\u0232\x03\x02\x02\x02\\\u023A\x03\x02\x02\x02^\u023C\x03\x02" +
		"\x02\x02`\u0245\x03\x02\x02\x02b\u025F\x03\x02\x02\x02d\u0291\x03\x02" +
		"\x02\x02f\u029C\x03\x02\x02\x02h\u029E\x03\x02\x02\x02j\u02A6\x03\x02" +
		"\x02\x02l\u02B1\x03\x02\x02\x02n\u02C0\x03\x02\x02\x02p\u02C7\x03\x02" +
		"\x02\x02r\u02CC\x03\x02\x02\x02t\u02D0\x03\x02\x02\x02v\u02D5\x03\x02" +
		"\x02\x02x\u02E4\x03\x02\x02\x02z\u02E6\x03\x02\x02\x02|\u02EE\x03\x02" +
		"\x02\x02~\u02FD\x03\x02\x02\x02\x80\u032D\x03\x02\x02\x02\x82\u035D\x03" +
		"\x02\x02\x02\x84\u0367\x03\x02\x02\x02\x86\u036A\x03\x02\x02\x02\x88\u0377" +
		"\x03\x02\x02\x02\x8A\u037B\x03\x02\x02\x02\x8C\u0385\x03\x02\x02\x02\x8E" +
		"\u0387\x03\x02\x02\x02\x90\u03B8\x03\x02\x02\x02\x92\u03C5\x03\x02\x02" +
		"\x02\x94\u03C7\x03\x02\x02\x02\x96\u03CE\x03\x02\x02\x02\x98\u03D4\x03" +
		"\x02\x02\x02\x9A\u03D7\x03\x02\x02\x02\x9C\u03EA\x03\x02\x02\x02\x9E\u0400" +
		"\x03\x02\x02\x02\xA0\u0406\x03\x02\x02\x02\xA2\u0410\x03\x02\x02\x02\xA4" +
		"\u0414\x03\x02\x02\x02\xA6\u0425\x03\x02\x02\x02\xA8\u042A\x03\x02\x02" +
		"\x02\xAA\u042F\x03\x02\x02\x02\xAC\u0436\x03\x02\x02\x02\xAE\u0439\x03" +
		"\x02\x02\x02\xB0\u0442\x03\x02\x02\x02\xB2\xD4\x07p\x02\x02\xB3\xD4\x07" +
		"q\x02\x02\xB4\xB6\x07s\x02\x02\xB5\xB4\x03\x02\x02\x02\xB6\xB7\x03\x02" +
		"\x02\x02\xB7\xB5\x03\x02\x02\x02\xB7\xB8\x03\x02\x02\x02\xB8\xD4\x03\x02" +
		"\x02\x02\xB9\xBA\x07B\x02\x02\xBA\xBB\x05.\x18\x02\xBB\xBC\x07C\x02\x02" +
		"\xBC\xD4\x03\x02\x02\x02\xBD\xD4\x05\x04\x03\x02\xBE\xC0\x07\x03\x02\x02" +
		"\xBF\xBE\x03\x02\x02\x02\xBF\xC0\x03\x02\x02\x02\xC0\xC1\x03\x02\x02\x02" +
		"\xC1\xC2\x07B\x02\x02\xC2\xC3\x05\x94K\x02\xC3\xC4\x07C\x02\x02\xC4\xD4" +
		"\x03\x02\x02\x02\xC5\xC6\x07\x04\x02\x02\xC6\xC7\x07B\x02\x02\xC7\xC8" +
		"\x05\x0E\b\x02\xC8\xC9\x07_\x02\x02\xC9\xCA\x05|?\x02\xCA\xCB\x07C\x02" +
		"\x02\xCB\xD4\x03\x02\x02\x02\xCC\xCD\x07\x05\x02\x02\xCD\xCE\x07B\x02" +
		"\x02\xCE\xCF\x05|?\x02\xCF\xD0\x07_\x02\x02\xD0\xD1\x05\x0E\b\x02\xD1" +
		"\xD2\x07C\x02\x02\xD2\xD4\x03\x02\x02\x02\xD3\xB2\x03\x02\x02\x02\xD3" +
		"\xB3\x03\x02\x02\x02\xD3\xB5\x03\x02\x02\x02\xD3\xB9\x03\x02\x02\x02\xD3" +
		"\xBD\x03\x02\x02\x02\xD3\xBF\x03\x02\x02\x02\xD3\xC5\x03\x02\x02\x02\xD3" +
		"\xCC\x03\x02\x02\x02\xD4\x03\x03\x02\x02\x02\xD5\xD6\x07=\x02\x02\xD6" +
		"\xD7\x07B\x02\x02\xD7\xD8\x05*\x16\x02\xD8\xD9\x07_\x02\x02\xD9\xDA\x05" +
		"\x06\x04\x02\xDA\xDB\x07C\x02\x02\xDB\x05\x03\x02\x02\x02\xDC\xE1\x05" +
		"\b\x05\x02\xDD\xDE\x07_\x02\x02\xDE\xE0\x05\b\x05\x02\xDF\xDD\x03\x02" +
		"\x02\x02\xE0\xE3\x03\x02\x02\x02\xE1\xDF\x03\x02\x02\x02\xE1\xE2\x03\x02" +
		"\x02\x02\xE2\x07\x03\x02\x02\x02\xE3\xE1\x03\x02\x02\x02\xE4\xE7\x05|" +
		"?\x02\xE5\xE7\x07\x1C\x02\x02\xE6\xE4\x03\x02\x02\x02\xE6\xE5\x03\x02" +
		"\x02\x02\xE7\xE8\x03\x02\x02\x02\xE8\xE9\x07]\x02\x02\xE9\xEA\x05*\x16" +
		"\x02\xEA\t\x03\x02\x02\x02\xEB\xFA\x05\x02\x02\x02\xEC\xEE\x07\x03\x02" +
		"\x02\xED\xEC\x03\x02\x02\x02\xED\xEE\x03\x02\x02\x02\xEE\xEF\x03\x02\x02" +
		"\x02\xEF\xF0\x07B\x02\x02\xF0\xF1\x05|?\x02\xF1\xF2\x07C\x02\x02\xF2\xF3" +
		"\x07F\x02\x02\xF3\xF5\x05\x86D\x02\xF4\xF6\x07_\x02\x02\xF5\xF4\x03\x02" +
		"\x02\x02\xF5\xF6\x03\x02\x02\x02\xF6\xF7\x03\x02\x02\x02\xF7\xF8\x07G" +
		"\x02\x02\xF8\xFA\x03\x02\x02\x02\xF9\xEB\x03\x02\x02\x02\xF9\xED\x03\x02" +
		"\x02\x02\xFA\u0109\x03\x02\x02\x02\xFB\xFC\x07D\x02\x02\xFC\xFD\x05.\x18" +
		"\x02\xFD\xFE\x07E\x02\x02\xFE\u0108\x03\x02\x02\x02\xFF\u0101\x07B\x02" +
		"\x02\u0100\u0102\x05\f\x07\x02\u0101\u0100\x03\x02\x02\x02\u0101\u0102" +
		"\x03\x02\x02\x02\u0102\u0103\x03\x02\x02\x02\u0103\u0108\x07C\x02\x02" +
		"\u0104\u0105\t\x02\x02\x02\u0105\u0108\x07p\x02\x02\u0106\u0108\t\x03" +
		"\x02\x02\u0107\xFB\x03\x02\x02\x02\u0107\xFF\x03\x02\x02\x02\u0107\u0104" +
		"\x03\x02\x02\x02\u0107\u0106\x03\x02\x02\x02\u0108\u010B\x03\x02\x02\x02" +
		"\u0109\u0107\x03\x02\x02\x02\u0109\u010A\x03\x02\x02\x02\u010A\v\x03\x02" +
		"\x02\x02\u010B\u0109\x03\x02\x02\x02\u010C\u0111\x05*\x16\x02\u010D\u010E" +
		"\x07_\x02\x02\u010E\u0110\x05*\x16\x02\u010F\u010D\x03\x02\x02\x02\u0110" +
		"\u0113\x03\x02\x02\x02\u0111\u010F\x03\x02\x02\x02\u0111\u0112\x03\x02" +
		"\x02\x02\u0112\r\x03\x02\x02\x02\u0113\u0111\x03\x02\x02\x02\u0114\u0116" +
		"\t\x04\x02\x02\u0115\u0114\x03\x02\x02\x02\u0116\u0119\x03\x02\x02\x02" +
		"\u0117\u0115\x03\x02\x02\x02\u0117\u0118\x03\x02\x02\x02\u0118\u0125\x03" +
		"\x02\x02\x02\u0119\u0117\x03\x02\x02\x02\u011A\u0126\x05\n\x06\x02\u011B" +
		"\u011C\x05\x10\t\x02\u011C\u011D\x05\x12\n\x02\u011D\u0126\x03\x02\x02" +
		"\x02\u011E\u011F\t\x05\x02\x02\u011F\u0120\x07B\x02\x02\u0120\u0121\x05" +
		"|?\x02\u0121\u0122\x07C\x02\x02\u0122\u0126\x03\x02\x02\x02\u0123\u0124" +
		"\x07W\x02\x02\u0124\u0126\x07p\x02\x02\u0125\u011A\x03\x02\x02\x02\u0125" +
		"\u011B\x03\x02\x02\x02\u0125\u011E\x03\x02\x02\x02\u0125\u0123\x03\x02" +
		"\x02\x02\u0126\x0F\x03\x02\x02\x02\u0127\u0128\t\x06\x02\x02\u0128\x11" +
		"\x03\x02\x02\x02\u0129\u012B\x07\x03\x02\x02\u012A\u0129\x03\x02\x02\x02" +
		"\u012A\u012B\x03\x02\x02\x02\u012B\u012C\x03\x02\x02\x02\u012C\u012D\x07" +
		"B\x02\x02\u012D\u012E\x05|?\x02\u012E\u012F\x07C\x02\x02\u012F\u0130\x05" +
		"\x12\n\x02\u0130\u0134\x03\x02\x02\x02\u0131\u0134\x05\x0E\b\x02\u0132" +
		"\u0134\x07r\x02\x02\u0133\u012A\x03\x02\x02\x02\u0133\u0131\x03\x02\x02" +
		"\x02\u0133\u0132\x03\x02\x02\x02\u0134\x13\x03\x02\x02\x02\u0135\u013A" +
		"\x05\x12\n\x02\u0136\u0137\t\x07\x02\x02\u0137\u0139\x05\x12\n\x02\u0138" +
		"\u0136\x03\x02\x02\x02\u0139\u013C\x03\x02\x02\x02\u013A\u0138\x03\x02" +
		"\x02\x02\u013A\u013B\x03\x02\x02\x02\u013B\x15\x03\x02\x02\x02\u013C\u013A" +
		"\x03\x02\x02\x02\u013D\u0142\x05\x14\v\x02\u013E\u013F\t\b\x02\x02\u013F" +
		"\u0141\x05\x14\v\x02\u0140\u013E\x03\x02\x02\x02\u0141\u0144\x03\x02\x02" +
		"\x02\u0142\u0140\x03\x02\x02\x02\u0142\u0143\x03\x02\x02\x02\u0143\x17" +
		"\x03\x02\x02\x02\u0144\u0142\x03\x02\x02\x02\u0145\u014A\x05\x16\f\x02" +
		"\u0146\u0147\t\t\x02\x02\u0147\u0149\x05\x16\f\x02\u0148\u0146\x03\x02" +
		"\x02\x02\u0149\u014C\x03\x02\x02\x02\u014A\u0148\x03\x02\x02\x02\u014A" +
		"\u014B\x03\x02\x02\x02\u014B\x19\x03\x02\x02\x02\u014C\u014A\x03\x02\x02" +
		"\x02\u014D\u0152\x05\x18\r\x02\u014E\u014F\t\n\x02\x02\u014F\u0151\x05" +
		"\x18\r\x02\u0150\u014E\x03\x02\x02\x02\u0151\u0154\x03\x02\x02\x02\u0152" +
		"\u0150\x03\x02\x02\x02\u0152\u0153\x03\x02\x02\x02\u0153\x1B\x03\x02\x02" +
		"\x02\u0154\u0152\x03\x02\x02\x02\u0155\u015A\x05\x1A\x0E\x02\u0156\u0157" +
		"\t\v\x02\x02\u0157\u0159\x05\x1A\x0E\x02\u0158\u0156\x03\x02\x02\x02\u0159" +
		"\u015C\x03\x02\x02\x02\u015A\u0158\x03\x02\x02\x02\u015A\u015B\x03\x02" +
		"\x02\x02\u015B\x1D\x03\x02\x02\x02\u015C\u015A\x03\x02\x02\x02\u015D\u0162" +
		"\x05\x1C\x0F\x02\u015E\u015F\x07U\x02\x02\u015F\u0161\x05\x1C\x0F\x02" +
		"\u0160\u015E\x03\x02\x02\x02\u0161\u0164\x03\x02\x02\x02\u0162\u0160\x03" +
		"\x02\x02\x02\u0162\u0163\x03\x02\x02\x02\u0163\x1F\x03\x02\x02\x02\u0164" +
		"\u0162\x03\x02\x02\x02\u0165\u016A\x05\x1E\x10\x02\u0166\u0167\x07Y\x02" +
		"\x02\u0167\u0169\x05\x1E\x10\x02\u0168\u0166\x03\x02\x02\x02\u0169\u016C" +
		"\x03\x02\x02\x02\u016A\u0168\x03\x02\x02\x02\u016A\u016B\x03\x02\x02\x02" +
		"\u016B!\x03\x02\x02\x02\u016C\u016A\x03\x02\x02\x02\u016D\u0172\x05 \x11" +
		"\x02\u016E\u016F\x07V\x02\x02\u016F\u0171\x05 \x11\x02\u0170\u016E\x03" +
		"\x02\x02\x02\u0171\u0174\x03\x02\x02\x02\u0172\u0170\x03\x02\x02\x02\u0172" +
		"\u0173\x03\x02\x02\x02\u0173#\x03\x02\x02\x02\u0174\u0172\x03\x02\x02" +
		"\x02\u0175\u017A\x05\"\x12\x02\u0176\u0177\x07W\x02\x02\u0177\u0179\x05" +
		"\"\x12\x02\u0178\u0176\x03\x02\x02\x02\u0179\u017C\x03\x02\x02\x02\u017A" +
		"\u0178\x03\x02\x02\x02\u017A\u017B\x03\x02\x02\x02\u017B%\x03\x02\x02" +
		"\x02\u017C\u017A\x03\x02\x02\x02\u017D\u0182\x05$\x13\x02\u017E\u017F" +
		"\x07X\x02\x02\u017F\u0181\x05$\x13\x02\u0180\u017E\x03\x02\x02\x02\u0181" +
		"\u0184\x03\x02\x02\x02\u0182\u0180\x03\x02\x02\x02\u0182\u0183\x03\x02" +
		"\x02\x02\u0183\'\x03\x02\x02\x02\u0184\u0182\x03\x02\x02\x02\u0185\u018B" +
		"\x05&\x14\x02\u0186\u0187\x07\\\x02\x02\u0187\u0188\x05.\x18\x02\u0188" +
		"\u0189\x07]\x02\x02\u0189\u018A\x05(\x15\x02\u018A\u018C\x03\x02\x02\x02" +
		"\u018B\u0186\x03\x02\x02\x02\u018B\u018C\x03\x02\x02\x02\u018C)\x03\x02" +
		"\x02\x02\u018D\u0194\x05(\x15\x02\u018E\u018F\x05\x0E\b\x02\u018F\u0190" +
		"\x05,\x17\x02\u0190\u0191\x05*\x16\x02\u0191\u0194\x03\x02\x02\x02\u0192" +
		"\u0194\x07r\x02\x02\u0193\u018D\x03\x02\x02\x02\u0193\u018E\x03\x02\x02" +
		"\x02\u0193\u0192\x03\x02\x02\x02\u0194+\x03\x02\x02\x02\u0195\u0196\t" +
		"\f\x02\x02\u0196-\x03\x02\x02\x02\u0197\u019C\x05*\x16\x02\u0198\u0199" +
		"\x07_\x02\x02\u0199\u019B\x05*\x16\x02\u019A\u0198\x03\x02\x02\x02\u019B" +
		"\u019E\x03\x02\x02\x02\u019C\u019A\x03\x02\x02\x02\u019C\u019D\x03\x02" +
		"\x02\x02\u019D/\x03\x02\x02\x02\u019E\u019C\x03\x02\x02\x02\u019F\u01A0" +
		"\x05(\x15\x02\u01A01\x03\x02\x02\x02\u01A1\u01A3\x054\x1B\x02\u01A2\u01A4" +
		"\x05:\x1E\x02\u01A3\u01A2\x03\x02\x02\x02\u01A3\u01A4\x03\x02\x02\x02" +
		"\u01A4\u01A5\x03\x02\x02\x02\u01A5\u01A6\x07^\x02\x02\u01A6\u01A9\x03" +
		"\x02\x02\x02\u01A7\u01A9\x05\x8EH\x02\u01A8\u01A1\x03\x02\x02\x02\u01A8" +
		"\u01A7\x03\x02\x02\x02\u01A93\x03\x02\x02\x02\u01AA\u01AC\x058";
	private static readonly _serializedATNSegment1: string =
		"\x1D\x02\u01AB\u01AA\x03\x02\x02\x02\u01AC\u01AD\x03\x02\x02\x02\u01AD" +
		"\u01AB\x03\x02\x02\x02\u01AD\u01AE\x03\x02\x02\x02\u01AE5\x03\x02\x02" +
		"\x02\u01AF\u01B1\x058\x1D\x02\u01B0\u01AF\x03\x02\x02\x02\u01B1\u01B2" +
		"\x03\x02\x02\x02\u01B2\u01B0\x03\x02\x02\x02\u01B2\u01B3\x03\x02\x02\x02" +
		"\u01B37\x03\x02\x02\x02\u01B4\u01BA\x05> \x02\u01B5\u01BA\x05@!\x02\u01B6" +
		"\u01BA\x05Z.\x02\u01B7\u01BA\x05\\/\x02\u01B8\u01BA\x05^0\x02\u01B9\u01B4" +
		"\x03\x02\x02\x02\u01B9\u01B5\x03\x02\x02\x02\u01B9\u01B6\x03\x02\x02\x02" +
		"\u01B9\u01B7\x03\x02\x02\x02\u01B9\u01B8\x03\x02\x02\x02\u01BA9\x03\x02" +
		"\x02\x02\u01BB\u01C0\x05<\x1F\x02\u01BC\u01BD\x07_\x02\x02\u01BD\u01BF" +
		"\x05<\x1F\x02\u01BE\u01BC\x03\x02\x02\x02\u01BF\u01C2\x03\x02\x02\x02" +
		"\u01C0\u01BE\x03\x02\x02\x02\u01C0\u01C1\x03\x02\x02\x02\u01C1;\x03\x02" +
		"\x02\x02\u01C2\u01C0\x03\x02\x02\x02\u01C3\u01C6\x05`1\x02\u01C4\u01C5" +
		"\x07`\x02\x02\u01C5\u01C7\x05\x84C\x02\u01C6\u01C4\x03\x02\x02\x02\u01C6" +
		"\u01C7\x03\x02\x02\x02\u01C7=\x03\x02\x02\x02\u01C8\u01C9\t\r\x02\x02" +
		"\u01C9?\x03\x02\x02\x02\u01CA\u01D9\t\x0E\x02\x02\u01CB\u01CC\x07\x03" +
		"\x02\x02\u01CC\u01CD\x07B\x02\x02\u01CD\u01CE\t\x0F\x02\x02\u01CE\u01D9" +
		"\x07C\x02\x02\u01CF\u01D9\x05X-\x02\u01D0\u01D9\x05B\"\x02\u01D1\u01D9" +
		"\x05P)\x02\u01D2\u01D9\x05\x82B\x02\u01D3\u01D4\x07\t\x02\x02\u01D4\u01D5" +
		"\x07B\x02\x02\u01D5\u01D6\x050\x19\x02\u01D6\u01D7\x07C\x02\x02\u01D7" +
		"\u01D9\x03\x02\x02\x02\u01D8\u01CA\x03\x02\x02\x02\u01D8\u01CB\x03\x02" +
		"\x02\x02\u01D8\u01CF\x03\x02\x02\x02\u01D8\u01D0\x03\x02\x02\x02\u01D8" +
		"\u01D1\x03\x02\x02\x02\u01D8\u01D2\x03\x02\x02\x02\u01D8\u01D3\x03\x02" +
		"\x02\x02\u01D9A\x03\x02\x02\x02\u01DA\u01DC\x05D#\x02\u01DB\u01DD\x07" +
		"p\x02\x02\u01DC\u01DB\x03\x02\x02\x02\u01DC\u01DD\x03\x02\x02\x02\u01DD" +
		"\u01DE\x03\x02\x02\x02\u01DE\u01DF\x07F\x02\x02\u01DF\u01E0\x05F$\x02" +
		"\u01E0\u01E1\x07G\x02\x02\u01E1\u01E6\x03\x02\x02\x02\u01E2\u01E3\x05" +
		"D#\x02\u01E3\u01E4\x07p\x02\x02\u01E4\u01E6\x03\x02\x02\x02\u01E5\u01DA" +
		"\x03\x02\x02\x02\u01E5\u01E2\x03\x02\x02\x02\u01E6C\x03\x02\x02\x02\u01E7" +
		"\u01E8\t\x10\x02\x02\u01E8E\x03\x02\x02\x02\u01E9\u01EB\x05H%\x02\u01EA" +
		"\u01E9\x03\x02\x02\x02\u01EB\u01EC\x03\x02\x02\x02\u01EC\u01EA\x03\x02" +
		"\x02\x02\u01EC\u01ED\x03\x02\x02\x02\u01EDG\x03\x02\x02\x02\u01EE\u01EF" +
		"\x05J&\x02\u01EF\u01F0\x05L\'\x02\u01F0\u01F1\x07^\x02\x02\u01F1\u01F7" +
		"\x03\x02\x02\x02\u01F2\u01F3\x05J&\x02\u01F3\u01F4\x07^\x02\x02\u01F4" +
		"\u01F7\x03\x02\x02\x02\u01F5\u01F7\x05\x8EH\x02\u01F6\u01EE\x03\x02\x02" +
		"\x02\u01F6\u01F2\x03\x02\x02\x02\u01F6\u01F5\x03\x02\x02\x02\u01F7I\x03" +
		"\x02\x02\x02\u01F8\u01FB\x05@!\x02\u01F9\u01FB\x05Z.\x02\u01FA\u01F8\x03" +
		"\x02\x02\x02\u01FA\u01F9\x03\x02\x02\x02\u01FB\u01FD\x03\x02\x02\x02\u01FC" +
		"\u01FE\x05J&\x02\u01FD\u01FC\x03\x02\x02\x02\u01FD\u01FE\x03\x02\x02\x02" +
		"\u01FEK\x03\x02\x02\x02\u01FF\u0204\x05N(\x02\u0200\u0201\x07_\x02\x02" +
		"\u0201\u0203\x05N(\x02\u0202\u0200\x03\x02\x02\x02\u0203\u0206\x03\x02" +
		"\x02\x02\u0204\u0202\x03\x02\x02\x02\u0204\u0205\x03\x02\x02\x02\u0205" +
		"M\x03\x02\x02\x02\u0206\u0204\x03\x02\x02\x02\u0207\u020E\x05`1\x02\u0208" +
		"\u020A\x05`1\x02\u0209\u0208\x03\x02\x02\x02\u0209\u020A\x03\x02\x02\x02" +
		"\u020A\u020B\x03\x02\x02\x02\u020B\u020C\x07]\x02\x02\u020C\u020E\x05" +
		"0\x19\x02\u020D\u0207\x03\x02\x02\x02\u020D\u0209\x03\x02\x02\x02\u020E" +
		"O\x03\x02\x02\x02\u020F\u0211\x07 \x02\x02\u0210\u0212\x07p\x02\x02\u0211" +
		"\u0210\x03\x02\x02\x02\u0211\u0212\x03\x02\x02\x02\u0212\u0213\x03\x02" +
		"\x02\x02\u0213\u0214\x07F\x02\x02\u0214\u0216\x05R*\x02\u0215\u0217\x07" +
		"_\x02\x02\u0216\u0215\x03\x02\x02\x02\u0216\u0217\x03\x02\x02\x02\u0217" +
		"\u0218\x03\x02\x02\x02\u0218\u0219\x07G\x02\x02\u0219\u021D\x03\x02\x02" +
		"\x02\u021A\u021B\x07 \x02\x02\u021B\u021D\x07p\x02\x02\u021C\u020F\x03" +
		"\x02\x02\x02\u021C\u021A\x03\x02\x02\x02\u021DQ\x03\x02\x02\x02\u021E" +
		"\u0223\x05T+\x02\u021F\u0220\x07_\x02\x02\u0220\u0222\x05T+\x02\u0221" +
		"\u021F\x03\x02\x02\x02\u0222\u0225\x03\x02\x02\x02\u0223\u0221\x03\x02" +
		"\x02\x02\u0223\u0224\x03\x02\x02\x02\u0224S\x03\x02\x02\x02\u0225\u0223" +
		"\x03\x02\x02\x02\u0226\u0229\x05V,\x02\u0227\u0228\x07`\x02\x02\u0228" +
		"\u022A\x050\x19\x02\u0229\u0227\x03\x02\x02\x02\u0229\u022A\x03\x02\x02" +
		"\x02\u022AU\x03\x02\x02\x02\u022B\u022C\x07p\x02\x02\u022CW\x03\x02\x02" +
		"\x02\u022D\u022E\x07:\x02\x02\u022E\u022F\x07B\x02\x02\u022F\u0230\x05" +
		"|?\x02\u0230\u0231\x07C\x02\x02\u0231Y\x03\x02\x02\x02\u0232\u0233\t\x11" +
		"\x02\x02\u0233[\x03\x02\x02\x02\u0234\u023B\t\x12\x02\x02\u0235\u023B" +
		"\x05h5\x02\u0236\u0237\x07\f\x02\x02\u0237\u0238\x07B\x02\x02\u0238\u0239" +
		"\x07p\x02\x02\u0239\u023B\x07C\x02\x02\u023A\u0234\x03\x02\x02\x02\u023A" +
		"\u0235\x03\x02\x02\x02\u023A\u0236\x03\x02\x02\x02\u023B]\x03\x02\x02" +
		"\x02\u023C\u023D\x078\x02\x02\u023D\u0240\x07B\x02\x02\u023E\u0241\x05" +
		"|?\x02\u023F\u0241\x050\x19\x02\u0240\u023E\x03\x02\x02\x02\u0240\u023F" +
		"\x03\x02\x02\x02\u0241\u0242\x03\x02\x02\x02\u0242\u0243\x07C\x02\x02" +
		"\u0243_\x03\x02\x02\x02\u0244\u0246\x05p9\x02\u0245\u0244\x03\x02\x02" +
		"\x02\u0245\u0246\x03\x02\x02\x02\u0246\u0247\x03\x02\x02\x02\u0247\u024B" +
		"\x05b2\x02\u0248\u024A\x05f4\x02\u0249\u0248\x03\x02\x02\x02\u024A\u024D" +
		"\x03\x02\x02\x02\u024B\u0249\x03\x02\x02\x02\u024B\u024C\x03\x02\x02\x02" +
		"\u024Ca\x03\x02\x02\x02\u024D\u024B\x03\x02\x02\x02\u024E\u024F\b2\x01" +
		"\x02\u024F\u0260\x07p\x02\x02\u0250\u0251\x07B\x02\x02\u0251\u0252\x05" +
		"`1\x02\u0252\u0253\x07C\x02\x02\u0253\u0260\x03\x02\x02\x02\u0254\u0255" +
		"\x07p\x02\x02\u0255\u0256\x07]\x02\x02\u0256\u0260\x07r\x02\x02\u0257" +
		"\u0258\x05d3\x02\u0258\u0259\x07p\x02\x02\u0259\u0260\x03\x02\x02\x02" +
		"\u025A\u025B\x07B\x02\x02\u025B\u025C\x05d3\x02\u025C\u025D\x05`1\x02" +
		"\u025D\u025E\x07C\x02\x02\u025E\u0260\x03\x02\x02\x02\u025F\u024E\x03" +
		"\x02\x02\x02\u025F\u0250\x03\x02\x02\x02\u025F\u0254\x03\x02\x02\x02\u025F" +
		"\u0257\x03\x02\x02\x02\u025F\u025A\x03\x02\x02\x02\u0260\u028E\x03\x02" +
		"\x02\x02\u0261\u0262\f\v\x02\x02\u0262\u0264\x07D\x02\x02\u0263\u0265" +
		"\x05r:\x02\u0264\u0263\x03\x02\x02\x02\u0264\u0265\x03\x02\x02\x02\u0265" +
		"\u0267\x03\x02\x02\x02\u0266\u0268\x05*\x16\x02\u0267\u0266\x03\x02\x02" +
		"\x02\u0267\u0268\x03\x02\x02\x02\u0268\u0269\x03\x02\x02\x02\u0269\u028D" +
		"\x07E\x02\x02\u026A\u026B\f\n\x02\x02\u026B\u026C\x07D\x02\x02\u026C\u026E" +
		"\x07/\x02\x02\u026D\u026F\x05r:\x02\u026E\u026D\x03\x02\x02\x02\u026E" +
		"\u026F\x03\x02\x02\x02\u026F\u0270\x03\x02\x02\x02\u0270\u0271\x05*\x16" +
		"\x02\u0271\u0272\x07E\x02\x02\u0272\u028D\x03\x02\x02\x02\u0273\u0274" +
		"\f\t\x02\x02\u0274\u0275\x07D\x02\x02\u0275\u0276\x05r:\x02\u0276\u0277" +
		"\x07/\x02\x02\u0277\u0278\x05*\x16\x02\u0278\u0279\x07E\x02\x02\u0279" +
		"\u028D\x03\x02\x02\x02\u027A\u027B\f\b\x02\x02\u027B\u027D\x07D\x02\x02" +
		"\u027C\u027E\x05r:\x02\u027D\u027C\x03\x02\x02\x02\u027D\u027E\x03\x02" +
		"\x02\x02\u027E\u027F\x03\x02\x02\x02\u027F\u0280\x07R\x02\x02\u0280\u028D" +
		"\x07E\x02\x02\u0281\u0282\f\x07\x02\x02\u0282\u0283\x07B\x02\x02\u0283" +
		"\u0284\x05t;\x02\u0284\u0285\x07C\x02\x02\u0285\u028D\x03\x02\x02\x02" +
		"\u0286\u0287\f\x06\x02\x02\u0287\u0289\x07B\x02\x02\u0288\u028A\x05z>" +
		"\x02\u0289\u0288\x03\x02\x02\x02\u0289\u028A\x03\x02\x02\x02\u028A\u028B" +
		"\x03\x02\x02\x02\u028B\u028D\x07C\x02\x02\u028C\u0261\x03\x02\x02\x02" +
		"\u028C\u026A\x03\x02\x02\x02\u028C\u0273\x03\x02\x02\x02\u028C\u027A\x03" +
		"\x02\x02\x02\u028C\u0281\x03\x02\x02\x02\u028C\u0286\x03\x02\x02\x02\u028D" +
		"\u0290\x03\x02\x02\x02\u028E\u028C\x03\x02\x02\x02\u028E\u028F\x03\x02" +
		"\x02\x02\u028Fc\x03\x02\x02\x02\u0290\u028E\x03\x02\x02\x02\u0291\u0292" +
		"\t\x13\x02\x02\u0292e\x03\x02\x02\x02\u0293\u0294\x07\x12\x02\x02\u0294" +
		"\u0296\x07B\x02\x02\u0295\u0297\x07s\x02\x02\u0296\u0295\x03\x02\x02\x02" +
		"\u0297\u0298\x03\x02\x02\x02\u0298\u0296\x03\x02\x02\x02\u0298\u0299\x03" +
		"\x02\x02\x02\u0299\u029A\x03\x02\x02\x02\u029A\u029D\x07C\x02\x02\u029B" +
		"\u029D\x05h5\x02\u029C\u0293\x03\x02\x02\x02\u029C\u029B\x03\x02\x02\x02" +
		"\u029Dg\x03\x02\x02\x02\u029E\u029F\x07\x13\x02\x02\u029F\u02A0\x07B\x02" +
		"\x02\u02A0\u02A1\x07B\x02\x02\u02A1\u02A2\x05j6\x02\u02A2\u02A3\x07C\x02" +
		"\x02\u02A3\u02A4\x07C\x02\x02\u02A4i\x03\x02\x02\x02\u02A5\u02A7\x05l" +
		"7\x02\u02A6\u02A5\x03\x02\x02\x02\u02A6\u02A7\x03\x02\x02\x02\u02A7\u02AE" +
		"\x03\x02\x02\x02\u02A8\u02AA\x07_\x02\x02\u02A9\u02AB\x05l7\x02\u02AA" +
		"\u02A9\x03\x02\x02\x02\u02AA\u02AB\x03\x02\x02\x02\u02AB\u02AD\x03\x02" +
		"\x02\x02\u02AC\u02A8\x03\x02\x02\x02\u02AD\u02B0\x03\x02\x02\x02\u02AE" +
		"\u02AC\x03\x02\x02\x02\u02AE\u02AF\x03\x02\x02\x02\u02AFk\x03\x02\x02" +
		"\x02\u02B0\u02AE\x03\x02\x02\x02\u02B1\u02B7\n\x14\x02\x02\u02B2\u02B4" +
		"\x07B\x02\x02\u02B3\u02B5\x05\f\x07\x02\u02B4\u02B3\x03\x02\x02\x02\u02B4" +
		"\u02B5\x03\x02\x02\x02\u02B5\u02B6\x03\x02\x02\x02\u02B6\u02B8\x07C\x02" +
		"\x02\u02B7\u02B2\x03\x02\x02\x02\u02B7\u02B8\x03\x02\x02\x02\u02B8m\x03" +
		"\x02\x02\x02\u02B9\u02BF\n\x15\x02\x02\u02BA\u02BB\x07B\x02\x02\u02BB" +
		"\u02BC\x05n8\x02\u02BC\u02BD\x07C\x02\x02\u02BD\u02BF\x03\x02\x02\x02" +
		"\u02BE\u02B9\x03\x02\x02\x02\u02BE\u02BA\x03\x02\x02\x02\u02BF\u02C2\x03" +
		"\x02\x02\x02\u02C0\u02BE\x03\x02\x02\x02\u02C0\u02C1\x03\x02\x02\x02\u02C1" +
		"o\x03\x02\x02\x02\u02C2\u02C0\x03\x02\x02\x02\u02C3\u02C5\t\x16\x02\x02" +
		"\u02C4\u02C6\x05r:\x02\u02C5\u02C4\x03\x02\x02\x02\u02C5\u02C6\x03\x02" +
		"\x02\x02\u02C6\u02C8\x03\x02\x02\x02\u02C7\u02C3\x03\x02\x02\x02\u02C8" +
		"\u02C9\x03\x02\x02\x02\u02C9\u02C7\x03\x02\x02\x02\u02C9\u02CA\x03\x02" +
		"\x02\x02\u02CAq\x03\x02\x02\x02\u02CB\u02CD\x05Z.\x02\u02CC\u02CB\x03" +
		"\x02\x02\x02\u02CD\u02CE\x03\x02\x02\x02\u02CE\u02CC\x03\x02\x02\x02\u02CE" +
		"\u02CF\x03\x02\x02\x02\u02CFs\x03\x02\x02\x02\u02D0\u02D3\x05v<\x02\u02D1" +
		"\u02D2\x07_\x02\x02\u02D2\u02D4\x07o\x02\x02\u02D3\u02D1\x03\x02\x02\x02" +
		"\u02D3\u02D4\x03\x02\x02\x02\u02D4u\x03\x02\x02\x02\u02D5\u02DA\x05x=" +
		"\x02\u02D6\u02D7\x07_\x02\x02\u02D7\u02D9\x05x=\x02\u02D8\u02D6\x03\x02" +
		"\x02\x02\u02D9\u02DC\x03\x02\x02\x02\u02DA\u02D8\x03\x02\x02\x02\u02DA" +
		"\u02DB\x03\x02\x02\x02\u02DBw\x03\x02\x02\x02\u02DC\u02DA\x03\x02\x02" +
		"\x02\u02DD\u02DE\x054\x1B\x02\u02DE\u02DF\x05`1\x02\u02DF\u02E5\x03\x02" +
		"\x02\x02\u02E0\u02E2\x056\x1C\x02\u02E1\u02E3\x05~@\x02\u02E2\u02E1\x03" +
		"\x02\x02\x02\u02E2\u02E3\x03\x02\x02\x02\u02E3\u02E5\x03\x02\x02\x02\u02E4" +
		"\u02DD\x03\x02\x02\x02\u02E4\u02E0\x03\x02\x02\x02\u02E5y\x03\x02\x02" +
		"\x02\u02E6\u02EB\x07p\x02\x02\u02E7\u02E8\x07_\x02\x02\u02E8\u02EA\x07" +
		"p\x02\x02\u02E9\u02E7\x03\x02\x02\x02\u02EA\u02ED\x03\x02\x02\x02\u02EB" +
		"\u02E9\x03\x02\x02\x02\u02EB\u02EC\x03\x02\x02\x02\u02EC{\x03\x02\x02" +
		"\x02\u02ED\u02EB\x03\x02\x02\x02\u02EE\u02F0\x05J&\x02\u02EF\u02F1\x05" +
		"~@\x02\u02F0\u02EF\x03\x02\x02\x02\u02F0\u02F1\x03\x02\x02\x02\u02F1}" +
		"\x03\x02\x02\x02\u02F2\u02FE\x05p9\x02\u02F3\u02F5\x05p9\x02\u02F4\u02F3" +
		"\x03\x02\x02\x02\u02F4\u02F5\x03\x02\x02\x02\u02F5\u02F6\x03\x02\x02\x02" +
		"\u02F6\u02FA\x05\x80A\x02\u02F7\u02F9\x05f4\x02\u02F8\u02F7\x03\x02\x02" +
		"\x02\u02F9\u02FC\x03\x02\x02\x02\u02FA\u02F8\x03\x02\x02\x02\u02FA\u02FB" +
		"\x03\x02\x02\x02\u02FB\u02FE\x03\x02\x02\x02\u02FC\u02FA\x03\x02\x02\x02" +
		"\u02FD\u02F2\x03\x02\x02\x02\u02FD\u02F4\x03\x02\x02\x02\u02FE\x7F\x03" +
		"\x02\x02\x02\u02FF\u0300\bA\x01\x02\u0300\u0301\x07B\x02\x02\u0301\u0302" +
		"\x05~@\x02\u0302\u0306\x07C\x02\x02\u0303\u0305\x05f4\x02\u0304\u0303" +
		"\x03\x02\x02\x02\u0305\u0308\x03\x02\x02\x02\u0306\u0304\x03\x02\x02\x02" +
		"\u0306\u0307\x03\x02\x02\x02\u0307\u032E\x03\x02\x02\x02\u0308\u0306\x03" +
		"\x02\x02\x02\u0309\u030B\x07D\x02\x02\u030A\u030C\x05r:\x02\u030B\u030A" +
		"\x03\x02\x02\x02\u030B\u030C\x03\x02\x02\x02\u030C\u030E\x03\x02\x02\x02" +
		"\u030D\u030F\x05*\x16\x02\u030E\u030D\x03\x02\x02\x02\u030E\u030F\x03" +
		"\x02\x02\x02\u030F\u0310\x03\x02\x02\x02\u0310\u032E\x07E\x02\x02\u0311" +
		"\u0312\x07D\x02\x02\u0312\u0314\x07/\x02\x02\u0313\u0315\x05r:\x02\u0314" +
		"\u0313\x03\x02\x02\x02\u0314\u0315\x03\x02\x02\x02\u0315\u0316\x03\x02" +
		"\x02\x02\u0316\u0317\x05*\x16\x02\u0317\u0318\x07E\x02\x02\u0318\u032E" +
		"\x03\x02\x02\x02\u0319\u031A\x07D\x02\x02\u031A\u031B\x05r:\x02\u031B" +
		"\u031C\x07/\x02\x02\u031C\u031D\x05*\x16\x02\u031D\u031E\x07E\x02\x02" +
		"\u031E\u032E\x03\x02\x02\x02\u031F\u0320\x07D\x02\x02\u0320\u0321\x07" +
		"R\x02\x02\u0321\u032E\x07E\x02\x02\u0322\u0324\x07B\x02\x02\u0323\u0325" +
		"\x05t;\x02\u0324\u0323\x03\x02\x02\x02\u0324\u0325\x03\x02\x02\x02\u0325" +
		"\u0326\x03\x02\x02\x02\u0326\u032A\x07C\x02\x02\u0327\u0329\x05f4\x02" +
		"\u0328\u0327\x03\x02\x02\x02\u0329\u032C\x03\x02\x02\x02\u032A\u0328\x03" +
		"\x02\x02\x02\u032A\u032B\x03\x02\x02\x02\u032B\u032E\x03\x02\x02\x02\u032C" +
		"\u032A\x03\x02\x02\x02\u032D\u02FF\x03\x02\x02\x02\u032D\u0309\x03\x02" +
		"\x02\x02\u032D\u0311\x03\x02\x02\x02\u032D\u0319\x03\x02\x02\x02\u032D" +
		"\u031F\x03\x02\x02\x02\u032D\u0322\x03\x02\x02\x02\u032E\u035A\x03\x02" +
		"\x02\x02\u032F\u0330\f\x07\x02\x02\u0330\u0332\x07D\x02\x02\u0331\u0333" +
		"\x05r:\x02\u0332\u0331\x03\x02\x02\x02\u0332\u0333\x03\x02\x02\x02\u0333" +
		"\u0335\x03\x02\x02\x02\u0334\u0336\x05*\x16\x02\u0335\u0334\x03\x02\x02" +
		"\x02\u0335\u0336\x03\x02\x02\x02\u0336\u0337\x03\x02\x02\x02\u0337\u0359" +
		"\x07E\x02\x02\u0338\u0339\f\x06\x02\x02\u0339\u033A\x07D\x02\x02\u033A" +
		"\u033C\x07/\x02\x02\u033B\u033D\x05r:\x02\u033C\u033B\x03\x02\x02\x02" +
		"\u033C\u033D\x03\x02\x02\x02\u033D\u033E\x03\x02\x02\x02\u033E\u033F\x05" +
		"*\x16\x02\u033F\u0340\x07E\x02\x02\u0340\u0359\x03\x02\x02\x02\u0341\u0342" +
		"\f\x05\x02\x02\u0342\u0343\x07D\x02\x02\u0343\u0344\x05r:\x02\u0344\u0345" +
		"\x07/\x02\x02\u0345\u0346\x05*\x16\x02\u0346\u0347\x07E\x02\x02\u0347" +
		"\u0359\x03\x02\x02\x02\u0348\u0349\f\x04\x02\x02\u0349\u034A\x07D\x02" +
		"\x02\u034A\u034B\x07R\x02\x02\u034B\u0359\x07E\x02\x02\u034C\u034D\f\x03" +
		"\x02\x02\u034D\u034F\x07B\x02\x02\u034E\u0350\x05t;\x02\u034F\u034E\x03" +
		"\x02\x02\x02\u034F\u0350\x03\x02\x02\x02\u0350\u0351\x03\x02\x02\x02\u0351" +
		"\u0355\x07C\x02\x02\u0352\u0354\x05f4\x02\u0353\u0352\x03\x02\x02\x02" +
		"\u0354\u0357\x03\x02\x02\x02\u0355\u0353\x03\x02\x02\x02\u0355\u0356\x03" +
		"\x02\x02\x02\u0356\u0359\x03\x02\x02\x02\u0357\u0355\x03\x02\x02\x02\u0358" +
		"\u032F\x03\x02\x02\x02\u0358\u0338\x03\x02\x02\x02\u0358\u0341\x03\x02" +
		"\x02\x02\u0358\u0348\x03\x02\x02\x02\u0358\u034C\x03\x02\x02\x02\u0359" +
		"\u035C\x03\x02\x02\x02\u035A\u0358\x03\x02\x02\x02\u035A\u035B\x03\x02" +
		"\x02\x02\u035B\x81\x03\x02\x02\x02\u035C\u035A\x03\x02\x02\x02\u035D\u035E" +
		"\x07p\x02\x02\u035E\x83\x03\x02\x02\x02\u035F\u0368\x05*\x16\x02\u0360" +
		"\u0361\x07F\x02\x02\u0361\u0363\x05\x86D\x02\u0362\u0364\x07_\x02\x02" +
		"\u0363\u0362\x03\x02\x02\x02\u0363\u0364\x03\x02\x02\x02\u0364\u0365\x03" +
		"\x02\x02\x02\u0365\u0366\x07G\x02\x02\u0366\u0368\x03\x02\x02\x02\u0367" +
		"\u035F\x03\x02\x02\x02\u0367\u0360\x03\x02\x02\x02\u0368\x85\x03\x02\x02" +
		"\x02\u0369\u036B\x05\x88E\x02\u036A\u0369\x03\x02\x02\x02\u036A\u036B" +
		"\x03\x02\x02\x02\u036B\u036C\x03\x02\x02\x02\u036C\u0374\x05\x84C\x02" +
		"\u036D\u036F\x07_\x02\x02\u036E\u0370\x05\x88E\x02\u036F\u036E\x03\x02" +
		"\x02\x02\u036F\u0370\x03\x02\x02\x02\u0370\u0371\x03\x02\x02\x02\u0371" +
		"\u0373\x05\x84C\x02\u0372\u036D\x03\x02\x02\x02\u0373\u0376\x03\x02\x02" +
		"\x02\u0374\u0372\x03\x02\x02\x02\u0374\u0375\x03\x02\x02\x02\u0375\x87" +
		"\x03\x02\x02\x02\u0376\u0374\x03\x02\x02\x02\u0377\u0378\x05\x8AF\x02" +
		"\u0378\u0379\x07`\x02\x02\u0379\x89\x03\x02\x02\x02\u037A\u037C\x05\x8C" +
		"G\x02\u037B\u037A\x03\x02\x02\x02\u037C\u037D\x03\x02\x02\x02\u037D\u037B" +
		"\x03\x02\x02\x02\u037D\u037E\x03\x02\x02\x02\u037E\x8B\x03\x02\x02\x02" +
		"\u037F\u0380\x07D\x02\x02\u0380\u0381\x050\x19\x02\u0381\u0382\x07E\x02" +
		"\x02\u0382\u0386\x03\x02\x02\x02\u0383\u0384\x07n\x02\x02\u0384\u0386" +
		"\x07p\x02\x02\u0385\u037F\x03\x02\x02\x02\u0385\u0383\x03\x02\x02\x02" +
		"\u0386\x8D\x03\x02\x02\x02\u0387\u0388\x07@\x02\x02\u0388\u0389\x07B\x02" +
		"\x02\u0389\u038A\x050\x19\x02\u038A\u038C\x07_\x02\x02\u038B\u038D\x07" +
		"s\x02\x02\u038C\u038B\x03\x02\x02\x02\u038D\u038E\x03\x02\x02\x02\u038E" +
		"\u038C\x03\x02\x02\x02\u038E\u038F\x03\x02\x02\x02\u038F\u0390\x03\x02" +
		"\x02\x02\u0390\u0391\x07C\x02\x02\u0391\u0392\x07^\x02\x02\u0392\x8F\x03" +
		"\x02\x02\x02\u0393\u03B9\x05\x92J\x02\u0394\u03B9\x05\x94K\x02\u0395\u03B9" +
		"\x05\x9AN\x02\u0396\u03B9\x05\x9CO\x02\u0397\u03B9\x05\x9EP\x02\u0398" +
		"\u03B9\x05\xA6T\x02\u0399\u039A\t\x17\x02\x02\u039A\u039B\t\x18\x02\x02" +
		"\u039B\u03A4\x07B\x02\x02\u039C\u03A1\x05&\x14\x02\u039D\u039E\x07_\x02" +
		"\x02\u039E\u03A0\x05&\x14\x02\u039F\u039D\x03\x02\x02\x02\u03A0\u03A3" +
		"\x03\x02\x02\x02\u03A1\u039F\x03\x02\x02\x02\u03A1\u03A2\x03\x02\x02\x02" +
		"\u03A2\u03A5\x03\x02\x02\x02\u03A3\u03A1\x03\x02\x02\x02\u03A4\u039C\x03" +
		"\x02\x02\x02\u03A4\u03A5\x03\x02\x02\x02\u03A5\u03B3\x03\x02\x02\x02\u03A6" +
		"\u03AF\x07]\x02\x02\u03A7\u03AC\x05&\x14\x02\u03A8\u03A9\x07_\x02\x02" +
		"\u03A9\u03AB\x05&\x14\x02\u03AA\u03A8\x03\x02\x02\x02\u03AB\u03AE\x03" +
		"\x02\x02\x02\u03AC\u03AA\x03\x02\x02\x02\u03AC\u03AD\x03\x02\x02\x02\u03AD" +
		"\u03B0\x03\x02\x02\x02\u03AE\u03AC\x03\x02\x02\x02\u03AF\u03A7\x03\x02" +
		"\x02\x02\u03AF\u03B0\x03\x02\x02\x02\u03B0\u03B2\x03\x02\x02\x02\u03B1" +
		"\u03A6\x03\x02\x02\x02\u03B2\u03B5\x03\x02\x02\x02\u03B3\u03B1\x03\x02" +
		"\x02\x02\u03B3\u03B4\x03\x02\x02\x02\u03B4\u03B6\x03\x02\x02\x02\u03B5" +
		"\u03B3\x03\x02\x02\x02\u03B6\u03B7\x07C\x02\x02\u03B7\u03B9\x07^\x02\x02" +
		"\u03B8\u0393\x03\x02\x02\x02\u03B8\u0394\x03\x02\x02\x02\u03B8\u0395\x03" +
		"\x02\x02\x02\u03B8\u0396\x03\x02\x02\x02\u03B8\u0397\x03\x02\x02\x02\u03B8" +
		"\u0398\x03\x02\x02\x02\u03B8\u0399\x03\x02\x02\x02\u03B9\x91\x03\x02\x02" +
		"\x02\u03BA\u03BB\x07p\x02\x02\u03BB\u03BC\x07]\x02\x02\u03BC\u03C6\x05" +
		"\x90I\x02\u03BD\u03BE\x07\x18\x02\x02\u03BE\u03BF\x050\x19\x02\u03BF\u03C0" +
		"\x07]\x02\x02\u03C0\u03C1\x05\x90I\x02\u03C1\u03C6\x03\x02\x02\x02\u03C2" +
		"\u03C3\x07\x1C\x02\x02\u03C3\u03C4\x07]\x02\x02\u03C4\u03C6\x05\x90I\x02" +
		"\u03C5\u03BA\x03\x02\x02\x02\u03C5\u03BD\x03\x02\x02\x02\u03C5\u03C2\x03" +
		"\x02\x02\x02\u03C6\x93\x03\x02\x02\x02\u03C7\u03C9\x07F\x02\x02\u03C8" +
		"\u03CA\x05\x96L\x02\u03C9\u03C8\x03\x02\x02\x02\u03C9\u03CA\x03\x02\x02" +
		"\x02\u03CA\u03CB\x03\x02\x02\x02\u03CB\u03CC\x07G\x02\x02\u03CC\x95\x03" +
		"\x02\x02\x02\u03CD\u03CF\x05\x98M\x02\u03CE\u03CD\x03\x02\x02\x02\u03CF" +
		"\u03D0\x03\x02\x02\x02\u03D0\u03CE\x03\x02\x02\x02\u03D0\u03D1\x03\x02" +
		"\x02\x02\u03D1\x97\x03\x02\x02\x02\u03D2\u03D5\x05\x90I\x02\u03D3\u03D5" +
		"\x052\x1A\x02\u03D4\u03D2\x03\x02\x02\x02\u03D4\u03D3\x03\x02\x02\x02" +
		"\u03D5\x99\x03\x02\x02\x02\u03D6\u03D8\x05.\x18\x02\u03D7\u03D6\x03\x02" +
		"\x02\x02\u03D7\u03D8\x03\x02\x02\x02\u03D8\u03D9\x03\x02\x02\x02\u03D9" +
		"\u03DA\x07^\x02\x02\u03DA\x9B\x03\x02\x02\x02\u03DB\u03DC\x07%\x02\x02" +
		"\u03DC\u03DD\x07B\x02\x02\u03DD\u03DE\x05.\x18\x02\u03DE\u03DF\x07C\x02" +
		"\x02\u03DF\u03E2\x05\x90I\x02\u03E0\u03E1\x07\x1F\x02\x02\u03E1\u03E3" +
		"\x05\x90I\x02\u03E2\u03E0\x03\x02\x02\x02\u03E2\u03E3\x03\x02\x02\x02" +
		"\u03E3\u03EB\x03\x02\x02\x02\u03E4\u03E5\x071\x02\x02\u03E5\u03E6\x07" +
		"B\x02\x02\u03E6\u03E7\x05.\x18\x02\u03E7\u03E8\x07C\x02\x02\u03E8\u03E9" +
		"\x05\x90I\x02\u03E9\u03EB\x03\x02\x02\x02\u03EA\u03DB\x03\x02\x02\x02" +
		"\u03EA\u03E4\x03\x02\x02\x02\u03EB\x9D\x03\x02\x02\x02\u03EC\u03ED\x07" +
		"7\x02\x02\u03ED\u03EE\x07B\x02\x02\u03EE\u03EF\x05.\x18\x02\u03EF\u03F0" +
		"\x07C\x02\x02\u03F0\u03F1\x05\x90I\x02\u03F1\u0401\x03\x02\x02\x02\u03F2" +
		"\u03F3\x07\x1D\x02\x02\u03F3\u03F4\x05\x90I\x02\u03F4\u03F5\x077\x02\x02" +
		"\u03F5\u03F6\x07B\x02\x02\u03F6\u03F7\x05.\x18\x02\u03F7\u03F8\x07C\x02" +
		"\x02\u03F8\u03F9\x07^\x02\x02\u03F9\u0401\x03\x02\x02\x02\u03FA\u03FB" +
		"\x07#\x02\x02\u03FB\u03FC\x07B\x02\x02\u03FC\u03FD\x05\xA0Q\x02\u03FD" +
		"\u03FE\x07C\x02\x02\u03FE\u03FF\x05\x90I\x02\u03FF\u0401\x03\x02\x02\x02" +
		"\u0400\u03EC\x03\x02\x02\x02\u0400\u03F2\x03\x02\x02\x02\u0400\u03FA\x03" +
		"\x02\x02\x02\u0401\x9F\x03\x02\x02\x02\u0402\u0407\x05\xA2R\x02\u0403" +
		"\u0405\x05.\x18\x02\u0404\u0403\x03\x02\x02\x02\u0404\u0405\x03\x02\x02" +
		"\x02\u0405\u0407\x03\x02\x02\x02\u0406\u0402\x03\x02\x02\x02\u0406\u0404" +
		"\x03\x02\x02\x02\u0407\u0408\x03\x02\x02\x02\u0408\u040A\x07^\x02\x02" +
		"\u0409\u040B\x05\xA4S\x02\u040A\u0409\x03\x02\x02\x02\u040A\u040B\x03" +
		"\x02\x02\x02\u040B\u040C\x03\x02\x02\x02\u040C\u040E\x07^\x02\x02\u040D" +
		"\u040F\x05\xA4S\x02\u040E\u040D\x03\x02\x02\x02\u040E\u040F\x03\x02\x02" +
		"\x02\u040F\xA1\x03\x02\x02\x02\u0410\u0412\x054\x1B\x02\u0411\u0413\x05" +
		":\x1E\x02\u0412\u0411\x03\x02\x02\x02\u0412\u0413\x03\x02\x02\x02\u0413" +
		"\xA3\x03\x02\x02\x02\u0414\u0419\x05*\x16\x02\u0415\u0416\x07_\x02\x02" +
		"\u0416\u0418\x05*\x16\x02\u0417\u0415\x03\x02\x02\x02\u0418\u041B\x03" +
		"\x02\x02\x02\u0419\u0417\x03\x02\x02\x02\u0419\u041A\x03\x02\x02\x02\u041A" +
		"\xA5\x03\x02\x02\x02\u041B\u0419\x03\x02\x02\x02\u041C\u041D\x07$\x02" +
		"\x02\u041D\u0426\x07p\x02\x02\u041E\u0426\t\x19\x02\x02\u041F\u0421\x07" +
		"+\x02\x02\u0420\u0422\x05.\x18\x02\u0421\u0420\x03\x02\x02\x02\u0421\u0422" +
		"\x03\x02\x02\x02\u0422\u0426\x03\x02\x02\x02\u0423\u0424\x07$\x02\x02" +
		"\u0424\u0426\x05\x0E\b\x02\u0425\u041C\x03\x02\x02\x02\u0425\u041E\x03" +
		"\x02\x02\x02\u0425\u041F\x03\x02\x02\x02\u0425\u0423\x03\x02\x02\x02\u0426" +
		"\u0427\x03\x02\x02\x02\u0427\u0428\x07^\x02\x02\u0428\xA7\x03\x02\x02" +
		"\x02\u0429\u042B\x05\xAAV\x02\u042A\u0429\x03\x02\x02\x02\u042A\u042B" +
		"\x03\x02\x02\x02\u042B\u042C\x03\x02\x02\x02\u042C\u042D\x07\x02\x02\x03" +
		"\u042D\xA9\x03\x02\x02\x02\u042E\u0430\x05\xACW\x02\u042F\u042E\x03\x02" +
		"\x02\x02\u0430\u0431\x03\x02\x02\x02\u0431\u042F\x03\x02\x02\x02\u0431" +
		"\u0432\x03\x02\x02\x02\u0432\xAB\x03\x02\x02\x02\u0433\u0437\x05\xAEX" +
		"\x02\u0434\u0437\x052\x1A\x02\u0435\u0437\x07^\x02\x02\u0436\u0433\x03" +
		"\x02\x02\x02\u0436\u0434\x03\x02\x02\x02\u0436\u0435\x03\x02\x02\x02\u0437" +
		"\xAD\x03\x02\x02\x02\u0438\u043A\x054\x1B\x02\u0439\u0438\x03\x02\x02" +
		"\x02\u0439\u043A\x03\x02\x02\x02\u043A\u043B\x03\x02\x02\x02\u043B\u043D" +
		"\x05`1\x02\u043C\u043E\x05\xB0Y\x02\u043D\u043C\x03\x02\x02\x02\u043D" +
		"\u043E\x03\x02\x02\x02\u043E\u043F\x03\x02\x02\x02\u043F\u0440\x05\x94" +
		"K\x02\u0440\xAF\x03\x02\x02\x02\u0441\u0443\x052\x1A\x02\u0442\u0441\x03" +
		"\x02\x02\x02\u0443\u0444\x03\x02\x02\x02\u0444\u0442\x03\x02\x02\x02\u0444" +
		"\u0445\x03\x02\x02\x02\u0445\xB1\x03\x02\x02\x02\x88\xB7\xBF\xD3\xE1\xE6" +
		"\xED\xF5\xF9\u0101\u0107\u0109\u0111\u0117\u0125\u012A\u0133\u013A\u0142" +
		"\u014A\u0152\u015A\u0162\u016A\u0172\u017A\u0182\u018B\u0193\u019C\u01A3" +
		"\u01A8\u01AD\u01B2\u01B9\u01C0\u01C6\u01D8\u01DC\u01E5\u01EC\u01F6\u01FA" +
		"\u01FD\u0204\u0209\u020D\u0211\u0216\u021C\u0223\u0229\u023A\u0240\u0245" +
		"\u024B\u025F\u0264\u0267\u026E\u027D\u0289\u028C\u028E\u0298\u029C\u02A6" +
		"\u02AA\u02AE\u02B4\u02B7\u02BE\u02C0\u02C5\u02C9\u02CE\u02D3\u02DA\u02E2" +
		"\u02E4\u02EB\u02F0\u02F4\u02FA\u02FD\u0306\u030B\u030E\u0314\u0324\u032A" +
		"\u032D\u0332\u0335\u033C\u034F\u0355\u0358\u035A\u0363\u0367\u036A\u036F" +
		"\u0374\u037D\u0385\u038E\u03A1\u03A4\u03AC\u03AF\u03B3\u03B8\u03C5\u03C9" +
		"\u03D0\u03D4\u03D7\u03E2\u03EA\u0400\u0404\u0406\u040A\u040E\u0412\u0419" +
		"\u0421\u0425\u042A\u0431\u0436\u0439\u043D\u0444";
	public static readonly _serializedATN: string = Utils.join(
		[
			CParser._serializedATNSegment0,
			CParser._serializedATNSegment1,
		],
		"",
	);
	public static __ATN: ATN;
	public static get _ATN(): ATN {
		if (!CParser.__ATN) {
			CParser.__ATN = new ATNDeserializer().deserialize(Utils.toCharArray(CParser._serializedATN));
		}

		return CParser.__ATN;
	}

}

export class PrimaryExpressionContext extends ParserRuleContext {
	public Identifier(): TerminalNode | undefined { return this.tryGetToken(CParser.Identifier, 0); }
	public Constant(): TerminalNode | undefined { return this.tryGetToken(CParser.Constant, 0); }
	public StringLiteral(): TerminalNode[];
	public StringLiteral(i: number): TerminalNode;
	public StringLiteral(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(CParser.StringLiteral);
		} else {
			return this.getToken(CParser.StringLiteral, i);
		}
	}
	public LeftParen(): TerminalNode | undefined { return this.tryGetToken(CParser.LeftParen, 0); }
	public expression(): ExpressionContext | undefined {
		return this.tryGetRuleContext(0, ExpressionContext);
	}
	public RightParen(): TerminalNode | undefined { return this.tryGetToken(CParser.RightParen, 0); }
	public genericSelection(): GenericSelectionContext | undefined {
		return this.tryGetRuleContext(0, GenericSelectionContext);
	}
	public compoundStatement(): CompoundStatementContext | undefined {
		return this.tryGetRuleContext(0, CompoundStatementContext);
	}
	public unaryExpression(): UnaryExpressionContext | undefined {
		return this.tryGetRuleContext(0, UnaryExpressionContext);
	}
	public Comma(): TerminalNode | undefined { return this.tryGetToken(CParser.Comma, 0); }
	public typeName(): TypeNameContext | undefined {
		return this.tryGetRuleContext(0, TypeNameContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CParser.RULE_primaryExpression; }
	// @Override
	public enterRule(listener: CListener): void {
		if (listener.enterPrimaryExpression) {
			listener.enterPrimaryExpression(this);
		}
	}
	// @Override
	public exitRule(listener: CListener): void {
		if (listener.exitPrimaryExpression) {
			listener.exitPrimaryExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CVisitor<Result>): Result {
		if (visitor.visitPrimaryExpression) {
			return visitor.visitPrimaryExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class GenericSelectionContext extends ParserRuleContext {
	public Generic(): TerminalNode { return this.getToken(CParser.Generic, 0); }
	public LeftParen(): TerminalNode { return this.getToken(CParser.LeftParen, 0); }
	public assignmentExpression(): AssignmentExpressionContext {
		return this.getRuleContext(0, AssignmentExpressionContext);
	}
	public Comma(): TerminalNode { return this.getToken(CParser.Comma, 0); }
	public genericAssocList(): GenericAssocListContext {
		return this.getRuleContext(0, GenericAssocListContext);
	}
	public RightParen(): TerminalNode { return this.getToken(CParser.RightParen, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CParser.RULE_genericSelection; }
	// @Override
	public enterRule(listener: CListener): void {
		if (listener.enterGenericSelection) {
			listener.enterGenericSelection(this);
		}
	}
	// @Override
	public exitRule(listener: CListener): void {
		if (listener.exitGenericSelection) {
			listener.exitGenericSelection(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CVisitor<Result>): Result {
		if (visitor.visitGenericSelection) {
			return visitor.visitGenericSelection(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class GenericAssocListContext extends ParserRuleContext {
	public genericAssociation(): GenericAssociationContext[];
	public genericAssociation(i: number): GenericAssociationContext;
	public genericAssociation(i?: number): GenericAssociationContext | GenericAssociationContext[] {
		if (i === undefined) {
			return this.getRuleContexts(GenericAssociationContext);
		} else {
			return this.getRuleContext(i, GenericAssociationContext);
		}
	}
	public Comma(): TerminalNode[];
	public Comma(i: number): TerminalNode;
	public Comma(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(CParser.Comma);
		} else {
			return this.getToken(CParser.Comma, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CParser.RULE_genericAssocList; }
	// @Override
	public enterRule(listener: CListener): void {
		if (listener.enterGenericAssocList) {
			listener.enterGenericAssocList(this);
		}
	}
	// @Override
	public exitRule(listener: CListener): void {
		if (listener.exitGenericAssocList) {
			listener.exitGenericAssocList(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CVisitor<Result>): Result {
		if (visitor.visitGenericAssocList) {
			return visitor.visitGenericAssocList(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class GenericAssociationContext extends ParserRuleContext {
	public Colon(): TerminalNode { return this.getToken(CParser.Colon, 0); }
	public assignmentExpression(): AssignmentExpressionContext {
		return this.getRuleContext(0, AssignmentExpressionContext);
	}
	public typeName(): TypeNameContext | undefined {
		return this.tryGetRuleContext(0, TypeNameContext);
	}
	public Default(): TerminalNode | undefined { return this.tryGetToken(CParser.Default, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CParser.RULE_genericAssociation; }
	// @Override
	public enterRule(listener: CListener): void {
		if (listener.enterGenericAssociation) {
			listener.enterGenericAssociation(this);
		}
	}
	// @Override
	public exitRule(listener: CListener): void {
		if (listener.exitGenericAssociation) {
			listener.exitGenericAssociation(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CVisitor<Result>): Result {
		if (visitor.visitGenericAssociation) {
			return visitor.visitGenericAssociation(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class PostfixExpressionContext extends ParserRuleContext {
	public primaryExpression(): PrimaryExpressionContext | undefined {
		return this.tryGetRuleContext(0, PrimaryExpressionContext);
	}
	public LeftParen(): TerminalNode[];
	public LeftParen(i: number): TerminalNode;
	public LeftParen(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(CParser.LeftParen);
		} else {
			return this.getToken(CParser.LeftParen, i);
		}
	}
	public typeName(): TypeNameContext | undefined {
		return this.tryGetRuleContext(0, TypeNameContext);
	}
	public RightParen(): TerminalNode[];
	public RightParen(i: number): TerminalNode;
	public RightParen(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(CParser.RightParen);
		} else {
			return this.getToken(CParser.RightParen, i);
		}
	}
	public LeftBrace(): TerminalNode | undefined { return this.tryGetToken(CParser.LeftBrace, 0); }
	public initializerList(): InitializerListContext | undefined {
		return this.tryGetRuleContext(0, InitializerListContext);
	}
	public RightBrace(): TerminalNode | undefined { return this.tryGetToken(CParser.RightBrace, 0); }
	public LeftBracket(): TerminalNode[];
	public LeftBracket(i: number): TerminalNode;
	public LeftBracket(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(CParser.LeftBracket);
		} else {
			return this.getToken(CParser.LeftBracket, i);
		}
	}
	public expression(): ExpressionContext[];
	public expression(i: number): ExpressionContext;
	public expression(i?: number): ExpressionContext | ExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ExpressionContext);
		} else {
			return this.getRuleContext(i, ExpressionContext);
		}
	}
	public RightBracket(): TerminalNode[];
	public RightBracket(i: number): TerminalNode;
	public RightBracket(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(CParser.RightBracket);
		} else {
			return this.getToken(CParser.RightBracket, i);
		}
	}
	public Identifier(): TerminalNode[];
	public Identifier(i: number): TerminalNode;
	public Identifier(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(CParser.Identifier);
		} else {
			return this.getToken(CParser.Identifier, i);
		}
	}
	public Dot(): TerminalNode[];
	public Dot(i: number): TerminalNode;
	public Dot(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(CParser.Dot);
		} else {
			return this.getToken(CParser.Dot, i);
		}
	}
	public Arrow(): TerminalNode[];
	public Arrow(i: number): TerminalNode;
	public Arrow(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(CParser.Arrow);
		} else {
			return this.getToken(CParser.Arrow, i);
		}
	}
	public PlusPlus(): TerminalNode[];
	public PlusPlus(i: number): TerminalNode;
	public PlusPlus(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(CParser.PlusPlus);
		} else {
			return this.getToken(CParser.PlusPlus, i);
		}
	}
	public MinusMinus(): TerminalNode[];
	public MinusMinus(i: number): TerminalNode;
	public MinusMinus(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(CParser.MinusMinus);
		} else {
			return this.getToken(CParser.MinusMinus, i);
		}
	}
	public Comma(): TerminalNode | undefined { return this.tryGetToken(CParser.Comma, 0); }
	public argumentExpressionList(): ArgumentExpressionListContext[];
	public argumentExpressionList(i: number): ArgumentExpressionListContext;
	public argumentExpressionList(i?: number): ArgumentExpressionListContext | ArgumentExpressionListContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ArgumentExpressionListContext);
		} else {
			return this.getRuleContext(i, ArgumentExpressionListContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CParser.RULE_postfixExpression; }
	// @Override
	public enterRule(listener: CListener): void {
		if (listener.enterPostfixExpression) {
			listener.enterPostfixExpression(this);
		}
	}
	// @Override
	public exitRule(listener: CListener): void {
		if (listener.exitPostfixExpression) {
			listener.exitPostfixExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CVisitor<Result>): Result {
		if (visitor.visitPostfixExpression) {
			return visitor.visitPostfixExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ArgumentExpressionListContext extends ParserRuleContext {
	public assignmentExpression(): AssignmentExpressionContext[];
	public assignmentExpression(i: number): AssignmentExpressionContext;
	public assignmentExpression(i?: number): AssignmentExpressionContext | AssignmentExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(AssignmentExpressionContext);
		} else {
			return this.getRuleContext(i, AssignmentExpressionContext);
		}
	}
	public Comma(): TerminalNode[];
	public Comma(i: number): TerminalNode;
	public Comma(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(CParser.Comma);
		} else {
			return this.getToken(CParser.Comma, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CParser.RULE_argumentExpressionList; }
	// @Override
	public enterRule(listener: CListener): void {
		if (listener.enterArgumentExpressionList) {
			listener.enterArgumentExpressionList(this);
		}
	}
	// @Override
	public exitRule(listener: CListener): void {
		if (listener.exitArgumentExpressionList) {
			listener.exitArgumentExpressionList(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CVisitor<Result>): Result {
		if (visitor.visitArgumentExpressionList) {
			return visitor.visitArgumentExpressionList(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class UnaryExpressionContext extends ParserRuleContext {
	public postfixExpression(): PostfixExpressionContext | undefined {
		return this.tryGetRuleContext(0, PostfixExpressionContext);
	}
	public unaryOperator(): UnaryOperatorContext | undefined {
		return this.tryGetRuleContext(0, UnaryOperatorContext);
	}
	public castExpression(): CastExpressionContext | undefined {
		return this.tryGetRuleContext(0, CastExpressionContext);
	}
	public LeftParen(): TerminalNode | undefined { return this.tryGetToken(CParser.LeftParen, 0); }
	public typeName(): TypeNameContext | undefined {
		return this.tryGetRuleContext(0, TypeNameContext);
	}
	public RightParen(): TerminalNode | undefined { return this.tryGetToken(CParser.RightParen, 0); }
	public AndAnd(): TerminalNode | undefined { return this.tryGetToken(CParser.AndAnd, 0); }
	public Identifier(): TerminalNode | undefined { return this.tryGetToken(CParser.Identifier, 0); }
	public Sizeof(): TerminalNode[];
	public Sizeof(i: number): TerminalNode;
	public Sizeof(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(CParser.Sizeof);
		} else {
			return this.getToken(CParser.Sizeof, i);
		}
	}
	public Alignof(): TerminalNode | undefined { return this.tryGetToken(CParser.Alignof, 0); }
	public PlusPlus(): TerminalNode[];
	public PlusPlus(i: number): TerminalNode;
	public PlusPlus(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(CParser.PlusPlus);
		} else {
			return this.getToken(CParser.PlusPlus, i);
		}
	}
	public MinusMinus(): TerminalNode[];
	public MinusMinus(i: number): TerminalNode;
	public MinusMinus(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(CParser.MinusMinus);
		} else {
			return this.getToken(CParser.MinusMinus, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CParser.RULE_unaryExpression; }
	// @Override
	public enterRule(listener: CListener): void {
		if (listener.enterUnaryExpression) {
			listener.enterUnaryExpression(this);
		}
	}
	// @Override
	public exitRule(listener: CListener): void {
		if (listener.exitUnaryExpression) {
			listener.exitUnaryExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CVisitor<Result>): Result {
		if (visitor.visitUnaryExpression) {
			return visitor.visitUnaryExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class UnaryOperatorContext extends ParserRuleContext {
	public And(): TerminalNode | undefined { return this.tryGetToken(CParser.And, 0); }
	public Star(): TerminalNode | undefined { return this.tryGetToken(CParser.Star, 0); }
	public Plus(): TerminalNode | undefined { return this.tryGetToken(CParser.Plus, 0); }
	public Minus(): TerminalNode | undefined { return this.tryGetToken(CParser.Minus, 0); }
	public Tilde(): TerminalNode | undefined { return this.tryGetToken(CParser.Tilde, 0); }
	public Not(): TerminalNode | undefined { return this.tryGetToken(CParser.Not, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CParser.RULE_unaryOperator; }
	// @Override
	public enterRule(listener: CListener): void {
		if (listener.enterUnaryOperator) {
			listener.enterUnaryOperator(this);
		}
	}
	// @Override
	public exitRule(listener: CListener): void {
		if (listener.exitUnaryOperator) {
			listener.exitUnaryOperator(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CVisitor<Result>): Result {
		if (visitor.visitUnaryOperator) {
			return visitor.visitUnaryOperator(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class CastExpressionContext extends ParserRuleContext {
	public LeftParen(): TerminalNode | undefined { return this.tryGetToken(CParser.LeftParen, 0); }
	public typeName(): TypeNameContext | undefined {
		return this.tryGetRuleContext(0, TypeNameContext);
	}
	public RightParen(): TerminalNode | undefined { return this.tryGetToken(CParser.RightParen, 0); }
	public castExpression(): CastExpressionContext | undefined {
		return this.tryGetRuleContext(0, CastExpressionContext);
	}
	public unaryExpression(): UnaryExpressionContext | undefined {
		return this.tryGetRuleContext(0, UnaryExpressionContext);
	}
	public DigitSequence(): TerminalNode | undefined { return this.tryGetToken(CParser.DigitSequence, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CParser.RULE_castExpression; }
	// @Override
	public enterRule(listener: CListener): void {
		if (listener.enterCastExpression) {
			listener.enterCastExpression(this);
		}
	}
	// @Override
	public exitRule(listener: CListener): void {
		if (listener.exitCastExpression) {
			listener.exitCastExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CVisitor<Result>): Result {
		if (visitor.visitCastExpression) {
			return visitor.visitCastExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class MultiplicativeExpressionContext extends ParserRuleContext {
	public castExpression(): CastExpressionContext[];
	public castExpression(i: number): CastExpressionContext;
	public castExpression(i?: number): CastExpressionContext | CastExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(CastExpressionContext);
		} else {
			return this.getRuleContext(i, CastExpressionContext);
		}
	}
	public Star(): TerminalNode[];
	public Star(i: number): TerminalNode;
	public Star(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(CParser.Star);
		} else {
			return this.getToken(CParser.Star, i);
		}
	}
	public Div(): TerminalNode[];
	public Div(i: number): TerminalNode;
	public Div(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(CParser.Div);
		} else {
			return this.getToken(CParser.Div, i);
		}
	}
	public Mod(): TerminalNode[];
	public Mod(i: number): TerminalNode;
	public Mod(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(CParser.Mod);
		} else {
			return this.getToken(CParser.Mod, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CParser.RULE_multiplicativeExpression; }
	// @Override
	public enterRule(listener: CListener): void {
		if (listener.enterMultiplicativeExpression) {
			listener.enterMultiplicativeExpression(this);
		}
	}
	// @Override
	public exitRule(listener: CListener): void {
		if (listener.exitMultiplicativeExpression) {
			listener.exitMultiplicativeExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CVisitor<Result>): Result {
		if (visitor.visitMultiplicativeExpression) {
			return visitor.visitMultiplicativeExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class AdditiveExpressionContext extends ParserRuleContext {
	public multiplicativeExpression(): MultiplicativeExpressionContext[];
	public multiplicativeExpression(i: number): MultiplicativeExpressionContext;
	public multiplicativeExpression(i?: number): MultiplicativeExpressionContext | MultiplicativeExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(MultiplicativeExpressionContext);
		} else {
			return this.getRuleContext(i, MultiplicativeExpressionContext);
		}
	}
	public Plus(): TerminalNode[];
	public Plus(i: number): TerminalNode;
	public Plus(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(CParser.Plus);
		} else {
			return this.getToken(CParser.Plus, i);
		}
	}
	public Minus(): TerminalNode[];
	public Minus(i: number): TerminalNode;
	public Minus(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(CParser.Minus);
		} else {
			return this.getToken(CParser.Minus, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CParser.RULE_additiveExpression; }
	// @Override
	public enterRule(listener: CListener): void {
		if (listener.enterAdditiveExpression) {
			listener.enterAdditiveExpression(this);
		}
	}
	// @Override
	public exitRule(listener: CListener): void {
		if (listener.exitAdditiveExpression) {
			listener.exitAdditiveExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CVisitor<Result>): Result {
		if (visitor.visitAdditiveExpression) {
			return visitor.visitAdditiveExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ShiftExpressionContext extends ParserRuleContext {
	public additiveExpression(): AdditiveExpressionContext[];
	public additiveExpression(i: number): AdditiveExpressionContext;
	public additiveExpression(i?: number): AdditiveExpressionContext | AdditiveExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(AdditiveExpressionContext);
		} else {
			return this.getRuleContext(i, AdditiveExpressionContext);
		}
	}
	public LeftShift(): TerminalNode[];
	public LeftShift(i: number): TerminalNode;
	public LeftShift(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(CParser.LeftShift);
		} else {
			return this.getToken(CParser.LeftShift, i);
		}
	}
	public RightShift(): TerminalNode[];
	public RightShift(i: number): TerminalNode;
	public RightShift(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(CParser.RightShift);
		} else {
			return this.getToken(CParser.RightShift, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CParser.RULE_shiftExpression; }
	// @Override
	public enterRule(listener: CListener): void {
		if (listener.enterShiftExpression) {
			listener.enterShiftExpression(this);
		}
	}
	// @Override
	public exitRule(listener: CListener): void {
		if (listener.exitShiftExpression) {
			listener.exitShiftExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CVisitor<Result>): Result {
		if (visitor.visitShiftExpression) {
			return visitor.visitShiftExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class RelationalExpressionContext extends ParserRuleContext {
	public shiftExpression(): ShiftExpressionContext[];
	public shiftExpression(i: number): ShiftExpressionContext;
	public shiftExpression(i?: number): ShiftExpressionContext | ShiftExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ShiftExpressionContext);
		} else {
			return this.getRuleContext(i, ShiftExpressionContext);
		}
	}
	public Less(): TerminalNode[];
	public Less(i: number): TerminalNode;
	public Less(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(CParser.Less);
		} else {
			return this.getToken(CParser.Less, i);
		}
	}
	public Greater(): TerminalNode[];
	public Greater(i: number): TerminalNode;
	public Greater(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(CParser.Greater);
		} else {
			return this.getToken(CParser.Greater, i);
		}
	}
	public LessEqual(): TerminalNode[];
	public LessEqual(i: number): TerminalNode;
	public LessEqual(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(CParser.LessEqual);
		} else {
			return this.getToken(CParser.LessEqual, i);
		}
	}
	public GreaterEqual(): TerminalNode[];
	public GreaterEqual(i: number): TerminalNode;
	public GreaterEqual(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(CParser.GreaterEqual);
		} else {
			return this.getToken(CParser.GreaterEqual, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CParser.RULE_relationalExpression; }
	// @Override
	public enterRule(listener: CListener): void {
		if (listener.enterRelationalExpression) {
			listener.enterRelationalExpression(this);
		}
	}
	// @Override
	public exitRule(listener: CListener): void {
		if (listener.exitRelationalExpression) {
			listener.exitRelationalExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CVisitor<Result>): Result {
		if (visitor.visitRelationalExpression) {
			return visitor.visitRelationalExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class EqualityExpressionContext extends ParserRuleContext {
	public relationalExpression(): RelationalExpressionContext[];
	public relationalExpression(i: number): RelationalExpressionContext;
	public relationalExpression(i?: number): RelationalExpressionContext | RelationalExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(RelationalExpressionContext);
		} else {
			return this.getRuleContext(i, RelationalExpressionContext);
		}
	}
	public Equal(): TerminalNode[];
	public Equal(i: number): TerminalNode;
	public Equal(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(CParser.Equal);
		} else {
			return this.getToken(CParser.Equal, i);
		}
	}
	public NotEqual(): TerminalNode[];
	public NotEqual(i: number): TerminalNode;
	public NotEqual(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(CParser.NotEqual);
		} else {
			return this.getToken(CParser.NotEqual, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CParser.RULE_equalityExpression; }
	// @Override
	public enterRule(listener: CListener): void {
		if (listener.enterEqualityExpression) {
			listener.enterEqualityExpression(this);
		}
	}
	// @Override
	public exitRule(listener: CListener): void {
		if (listener.exitEqualityExpression) {
			listener.exitEqualityExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CVisitor<Result>): Result {
		if (visitor.visitEqualityExpression) {
			return visitor.visitEqualityExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class AndExpressionContext extends ParserRuleContext {
	public equalityExpression(): EqualityExpressionContext[];
	public equalityExpression(i: number): EqualityExpressionContext;
	public equalityExpression(i?: number): EqualityExpressionContext | EqualityExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(EqualityExpressionContext);
		} else {
			return this.getRuleContext(i, EqualityExpressionContext);
		}
	}
	public And(): TerminalNode[];
	public And(i: number): TerminalNode;
	public And(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(CParser.And);
		} else {
			return this.getToken(CParser.And, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CParser.RULE_andExpression; }
	// @Override
	public enterRule(listener: CListener): void {
		if (listener.enterAndExpression) {
			listener.enterAndExpression(this);
		}
	}
	// @Override
	public exitRule(listener: CListener): void {
		if (listener.exitAndExpression) {
			listener.exitAndExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CVisitor<Result>): Result {
		if (visitor.visitAndExpression) {
			return visitor.visitAndExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ExclusiveOrExpressionContext extends ParserRuleContext {
	public andExpression(): AndExpressionContext[];
	public andExpression(i: number): AndExpressionContext;
	public andExpression(i?: number): AndExpressionContext | AndExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(AndExpressionContext);
		} else {
			return this.getRuleContext(i, AndExpressionContext);
		}
	}
	public Caret(): TerminalNode[];
	public Caret(i: number): TerminalNode;
	public Caret(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(CParser.Caret);
		} else {
			return this.getToken(CParser.Caret, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CParser.RULE_exclusiveOrExpression; }
	// @Override
	public enterRule(listener: CListener): void {
		if (listener.enterExclusiveOrExpression) {
			listener.enterExclusiveOrExpression(this);
		}
	}
	// @Override
	public exitRule(listener: CListener): void {
		if (listener.exitExclusiveOrExpression) {
			listener.exitExclusiveOrExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CVisitor<Result>): Result {
		if (visitor.visitExclusiveOrExpression) {
			return visitor.visitExclusiveOrExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class InclusiveOrExpressionContext extends ParserRuleContext {
	public exclusiveOrExpression(): ExclusiveOrExpressionContext[];
	public exclusiveOrExpression(i: number): ExclusiveOrExpressionContext;
	public exclusiveOrExpression(i?: number): ExclusiveOrExpressionContext | ExclusiveOrExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ExclusiveOrExpressionContext);
		} else {
			return this.getRuleContext(i, ExclusiveOrExpressionContext);
		}
	}
	public Or(): TerminalNode[];
	public Or(i: number): TerminalNode;
	public Or(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(CParser.Or);
		} else {
			return this.getToken(CParser.Or, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CParser.RULE_inclusiveOrExpression; }
	// @Override
	public enterRule(listener: CListener): void {
		if (listener.enterInclusiveOrExpression) {
			listener.enterInclusiveOrExpression(this);
		}
	}
	// @Override
	public exitRule(listener: CListener): void {
		if (listener.exitInclusiveOrExpression) {
			listener.exitInclusiveOrExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CVisitor<Result>): Result {
		if (visitor.visitInclusiveOrExpression) {
			return visitor.visitInclusiveOrExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class LogicalAndExpressionContext extends ParserRuleContext {
	public inclusiveOrExpression(): InclusiveOrExpressionContext[];
	public inclusiveOrExpression(i: number): InclusiveOrExpressionContext;
	public inclusiveOrExpression(i?: number): InclusiveOrExpressionContext | InclusiveOrExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(InclusiveOrExpressionContext);
		} else {
			return this.getRuleContext(i, InclusiveOrExpressionContext);
		}
	}
	public AndAnd(): TerminalNode[];
	public AndAnd(i: number): TerminalNode;
	public AndAnd(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(CParser.AndAnd);
		} else {
			return this.getToken(CParser.AndAnd, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CParser.RULE_logicalAndExpression; }
	// @Override
	public enterRule(listener: CListener): void {
		if (listener.enterLogicalAndExpression) {
			listener.enterLogicalAndExpression(this);
		}
	}
	// @Override
	public exitRule(listener: CListener): void {
		if (listener.exitLogicalAndExpression) {
			listener.exitLogicalAndExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CVisitor<Result>): Result {
		if (visitor.visitLogicalAndExpression) {
			return visitor.visitLogicalAndExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class LogicalOrExpressionContext extends ParserRuleContext {
	public logicalAndExpression(): LogicalAndExpressionContext[];
	public logicalAndExpression(i: number): LogicalAndExpressionContext;
	public logicalAndExpression(i?: number): LogicalAndExpressionContext | LogicalAndExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(LogicalAndExpressionContext);
		} else {
			return this.getRuleContext(i, LogicalAndExpressionContext);
		}
	}
	public OrOr(): TerminalNode[];
	public OrOr(i: number): TerminalNode;
	public OrOr(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(CParser.OrOr);
		} else {
			return this.getToken(CParser.OrOr, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CParser.RULE_logicalOrExpression; }
	// @Override
	public enterRule(listener: CListener): void {
		if (listener.enterLogicalOrExpression) {
			listener.enterLogicalOrExpression(this);
		}
	}
	// @Override
	public exitRule(listener: CListener): void {
		if (listener.exitLogicalOrExpression) {
			listener.exitLogicalOrExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CVisitor<Result>): Result {
		if (visitor.visitLogicalOrExpression) {
			return visitor.visitLogicalOrExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ConditionalExpressionContext extends ParserRuleContext {
	public logicalOrExpression(): LogicalOrExpressionContext {
		return this.getRuleContext(0, LogicalOrExpressionContext);
	}
	public Question(): TerminalNode | undefined { return this.tryGetToken(CParser.Question, 0); }
	public expression(): ExpressionContext | undefined {
		return this.tryGetRuleContext(0, ExpressionContext);
	}
	public Colon(): TerminalNode | undefined { return this.tryGetToken(CParser.Colon, 0); }
	public conditionalExpression(): ConditionalExpressionContext | undefined {
		return this.tryGetRuleContext(0, ConditionalExpressionContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CParser.RULE_conditionalExpression; }
	// @Override
	public enterRule(listener: CListener): void {
		if (listener.enterConditionalExpression) {
			listener.enterConditionalExpression(this);
		}
	}
	// @Override
	public exitRule(listener: CListener): void {
		if (listener.exitConditionalExpression) {
			listener.exitConditionalExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CVisitor<Result>): Result {
		if (visitor.visitConditionalExpression) {
			return visitor.visitConditionalExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class AssignmentExpressionContext extends ParserRuleContext {
	public conditionalExpression(): ConditionalExpressionContext | undefined {
		return this.tryGetRuleContext(0, ConditionalExpressionContext);
	}
	public unaryExpression(): UnaryExpressionContext | undefined {
		return this.tryGetRuleContext(0, UnaryExpressionContext);
	}
	public assignmentOperator(): AssignmentOperatorContext | undefined {
		return this.tryGetRuleContext(0, AssignmentOperatorContext);
	}
	public assignmentExpression(): AssignmentExpressionContext | undefined {
		return this.tryGetRuleContext(0, AssignmentExpressionContext);
	}
	public DigitSequence(): TerminalNode | undefined { return this.tryGetToken(CParser.DigitSequence, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CParser.RULE_assignmentExpression; }
	// @Override
	public enterRule(listener: CListener): void {
		if (listener.enterAssignmentExpression) {
			listener.enterAssignmentExpression(this);
		}
	}
	// @Override
	public exitRule(listener: CListener): void {
		if (listener.exitAssignmentExpression) {
			listener.exitAssignmentExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CVisitor<Result>): Result {
		if (visitor.visitAssignmentExpression) {
			return visitor.visitAssignmentExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class AssignmentOperatorContext extends ParserRuleContext {
	public Assign(): TerminalNode | undefined { return this.tryGetToken(CParser.Assign, 0); }
	public StarAssign(): TerminalNode | undefined { return this.tryGetToken(CParser.StarAssign, 0); }
	public DivAssign(): TerminalNode | undefined { return this.tryGetToken(CParser.DivAssign, 0); }
	public ModAssign(): TerminalNode | undefined { return this.tryGetToken(CParser.ModAssign, 0); }
	public PlusAssign(): TerminalNode | undefined { return this.tryGetToken(CParser.PlusAssign, 0); }
	public MinusAssign(): TerminalNode | undefined { return this.tryGetToken(CParser.MinusAssign, 0); }
	public LeftShiftAssign(): TerminalNode | undefined { return this.tryGetToken(CParser.LeftShiftAssign, 0); }
	public RightShiftAssign(): TerminalNode | undefined { return this.tryGetToken(CParser.RightShiftAssign, 0); }
	public AndAssign(): TerminalNode | undefined { return this.tryGetToken(CParser.AndAssign, 0); }
	public XorAssign(): TerminalNode | undefined { return this.tryGetToken(CParser.XorAssign, 0); }
	public OrAssign(): TerminalNode | undefined { return this.tryGetToken(CParser.OrAssign, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CParser.RULE_assignmentOperator; }
	// @Override
	public enterRule(listener: CListener): void {
		if (listener.enterAssignmentOperator) {
			listener.enterAssignmentOperator(this);
		}
	}
	// @Override
	public exitRule(listener: CListener): void {
		if (listener.exitAssignmentOperator) {
			listener.exitAssignmentOperator(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CVisitor<Result>): Result {
		if (visitor.visitAssignmentOperator) {
			return visitor.visitAssignmentOperator(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ExpressionContext extends ParserRuleContext {
	public assignmentExpression(): AssignmentExpressionContext[];
	public assignmentExpression(i: number): AssignmentExpressionContext;
	public assignmentExpression(i?: number): AssignmentExpressionContext | AssignmentExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(AssignmentExpressionContext);
		} else {
			return this.getRuleContext(i, AssignmentExpressionContext);
		}
	}
	public Comma(): TerminalNode[];
	public Comma(i: number): TerminalNode;
	public Comma(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(CParser.Comma);
		} else {
			return this.getToken(CParser.Comma, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CParser.RULE_expression; }
	// @Override
	public enterRule(listener: CListener): void {
		if (listener.enterExpression) {
			listener.enterExpression(this);
		}
	}
	// @Override
	public exitRule(listener: CListener): void {
		if (listener.exitExpression) {
			listener.exitExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CVisitor<Result>): Result {
		if (visitor.visitExpression) {
			return visitor.visitExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ConstantExpressionContext extends ParserRuleContext {
	public conditionalExpression(): ConditionalExpressionContext {
		return this.getRuleContext(0, ConditionalExpressionContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CParser.RULE_constantExpression; }
	// @Override
	public enterRule(listener: CListener): void {
		if (listener.enterConstantExpression) {
			listener.enterConstantExpression(this);
		}
	}
	// @Override
	public exitRule(listener: CListener): void {
		if (listener.exitConstantExpression) {
			listener.exitConstantExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CVisitor<Result>): Result {
		if (visitor.visitConstantExpression) {
			return visitor.visitConstantExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class DeclarationContext extends ParserRuleContext {
	public declarationSpecifiers(): DeclarationSpecifiersContext | undefined {
		return this.tryGetRuleContext(0, DeclarationSpecifiersContext);
	}
	public Semi(): TerminalNode | undefined { return this.tryGetToken(CParser.Semi, 0); }
	public initDeclaratorList(): InitDeclaratorListContext | undefined {
		return this.tryGetRuleContext(0, InitDeclaratorListContext);
	}
	public staticAssertDeclaration(): StaticAssertDeclarationContext | undefined {
		return this.tryGetRuleContext(0, StaticAssertDeclarationContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CParser.RULE_declaration; }
	// @Override
	public enterRule(listener: CListener): void {
		if (listener.enterDeclaration) {
			listener.enterDeclaration(this);
		}
	}
	// @Override
	public exitRule(listener: CListener): void {
		if (listener.exitDeclaration) {
			listener.exitDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CVisitor<Result>): Result {
		if (visitor.visitDeclaration) {
			return visitor.visitDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class DeclarationSpecifiersContext extends ParserRuleContext {
	public declarationSpecifier(): DeclarationSpecifierContext[];
	public declarationSpecifier(i: number): DeclarationSpecifierContext;
	public declarationSpecifier(i?: number): DeclarationSpecifierContext | DeclarationSpecifierContext[] {
		if (i === undefined) {
			return this.getRuleContexts(DeclarationSpecifierContext);
		} else {
			return this.getRuleContext(i, DeclarationSpecifierContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CParser.RULE_declarationSpecifiers; }
	// @Override
	public enterRule(listener: CListener): void {
		if (listener.enterDeclarationSpecifiers) {
			listener.enterDeclarationSpecifiers(this);
		}
	}
	// @Override
	public exitRule(listener: CListener): void {
		if (listener.exitDeclarationSpecifiers) {
			listener.exitDeclarationSpecifiers(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CVisitor<Result>): Result {
		if (visitor.visitDeclarationSpecifiers) {
			return visitor.visitDeclarationSpecifiers(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class DeclarationSpecifiers2Context extends ParserRuleContext {
	public declarationSpecifier(): DeclarationSpecifierContext[];
	public declarationSpecifier(i: number): DeclarationSpecifierContext;
	public declarationSpecifier(i?: number): DeclarationSpecifierContext | DeclarationSpecifierContext[] {
		if (i === undefined) {
			return this.getRuleContexts(DeclarationSpecifierContext);
		} else {
			return this.getRuleContext(i, DeclarationSpecifierContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CParser.RULE_declarationSpecifiers2; }
	// @Override
	public enterRule(listener: CListener): void {
		if (listener.enterDeclarationSpecifiers2) {
			listener.enterDeclarationSpecifiers2(this);
		}
	}
	// @Override
	public exitRule(listener: CListener): void {
		if (listener.exitDeclarationSpecifiers2) {
			listener.exitDeclarationSpecifiers2(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CVisitor<Result>): Result {
		if (visitor.visitDeclarationSpecifiers2) {
			return visitor.visitDeclarationSpecifiers2(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class DeclarationSpecifierContext extends ParserRuleContext {
	public storageClassSpecifier(): StorageClassSpecifierContext | undefined {
		return this.tryGetRuleContext(0, StorageClassSpecifierContext);
	}
	public typeSpecifier(): TypeSpecifierContext | undefined {
		return this.tryGetRuleContext(0, TypeSpecifierContext);
	}
	public typeQualifier(): TypeQualifierContext | undefined {
		return this.tryGetRuleContext(0, TypeQualifierContext);
	}
	public functionSpecifier(): FunctionSpecifierContext | undefined {
		return this.tryGetRuleContext(0, FunctionSpecifierContext);
	}
	public alignmentSpecifier(): AlignmentSpecifierContext | undefined {
		return this.tryGetRuleContext(0, AlignmentSpecifierContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CParser.RULE_declarationSpecifier; }
	// @Override
	public enterRule(listener: CListener): void {
		if (listener.enterDeclarationSpecifier) {
			listener.enterDeclarationSpecifier(this);
		}
	}
	// @Override
	public exitRule(listener: CListener): void {
		if (listener.exitDeclarationSpecifier) {
			listener.exitDeclarationSpecifier(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CVisitor<Result>): Result {
		if (visitor.visitDeclarationSpecifier) {
			return visitor.visitDeclarationSpecifier(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class InitDeclaratorListContext extends ParserRuleContext {
	public initDeclarator(): InitDeclaratorContext[];
	public initDeclarator(i: number): InitDeclaratorContext;
	public initDeclarator(i?: number): InitDeclaratorContext | InitDeclaratorContext[] {
		if (i === undefined) {
			return this.getRuleContexts(InitDeclaratorContext);
		} else {
			return this.getRuleContext(i, InitDeclaratorContext);
		}
	}
	public Comma(): TerminalNode[];
	public Comma(i: number): TerminalNode;
	public Comma(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(CParser.Comma);
		} else {
			return this.getToken(CParser.Comma, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CParser.RULE_initDeclaratorList; }
	// @Override
	public enterRule(listener: CListener): void {
		if (listener.enterInitDeclaratorList) {
			listener.enterInitDeclaratorList(this);
		}
	}
	// @Override
	public exitRule(listener: CListener): void {
		if (listener.exitInitDeclaratorList) {
			listener.exitInitDeclaratorList(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CVisitor<Result>): Result {
		if (visitor.visitInitDeclaratorList) {
			return visitor.visitInitDeclaratorList(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class InitDeclaratorContext extends ParserRuleContext {
	public declarator(): DeclaratorContext {
		return this.getRuleContext(0, DeclaratorContext);
	}
	public Assign(): TerminalNode | undefined { return this.tryGetToken(CParser.Assign, 0); }
	public initializer(): InitializerContext | undefined {
		return this.tryGetRuleContext(0, InitializerContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CParser.RULE_initDeclarator; }
	// @Override
	public enterRule(listener: CListener): void {
		if (listener.enterInitDeclarator) {
			listener.enterInitDeclarator(this);
		}
	}
	// @Override
	public exitRule(listener: CListener): void {
		if (listener.exitInitDeclarator) {
			listener.exitInitDeclarator(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CVisitor<Result>): Result {
		if (visitor.visitInitDeclarator) {
			return visitor.visitInitDeclarator(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class StorageClassSpecifierContext extends ParserRuleContext {
	public Typedef(): TerminalNode | undefined { return this.tryGetToken(CParser.Typedef, 0); }
	public Extern(): TerminalNode | undefined { return this.tryGetToken(CParser.Extern, 0); }
	public Static(): TerminalNode | undefined { return this.tryGetToken(CParser.Static, 0); }
	public ThreadLocal(): TerminalNode | undefined { return this.tryGetToken(CParser.ThreadLocal, 0); }
	public Auto(): TerminalNode | undefined { return this.tryGetToken(CParser.Auto, 0); }
	public Register(): TerminalNode | undefined { return this.tryGetToken(CParser.Register, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CParser.RULE_storageClassSpecifier; }
	// @Override
	public enterRule(listener: CListener): void {
		if (listener.enterStorageClassSpecifier) {
			listener.enterStorageClassSpecifier(this);
		}
	}
	// @Override
	public exitRule(listener: CListener): void {
		if (listener.exitStorageClassSpecifier) {
			listener.exitStorageClassSpecifier(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CVisitor<Result>): Result {
		if (visitor.visitStorageClassSpecifier) {
			return visitor.visitStorageClassSpecifier(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TypeSpecifierContext extends ParserRuleContext {
	public Void(): TerminalNode | undefined { return this.tryGetToken(CParser.Void, 0); }
	public Char(): TerminalNode | undefined { return this.tryGetToken(CParser.Char, 0); }
	public Short(): TerminalNode | undefined { return this.tryGetToken(CParser.Short, 0); }
	public Int(): TerminalNode | undefined { return this.tryGetToken(CParser.Int, 0); }
	public Long(): TerminalNode | undefined { return this.tryGetToken(CParser.Long, 0); }
	public Float(): TerminalNode | undefined { return this.tryGetToken(CParser.Float, 0); }
	public Double(): TerminalNode | undefined { return this.tryGetToken(CParser.Double, 0); }
	public Signed(): TerminalNode | undefined { return this.tryGetToken(CParser.Signed, 0); }
	public Unsigned(): TerminalNode | undefined { return this.tryGetToken(CParser.Unsigned, 0); }
	public Bool(): TerminalNode | undefined { return this.tryGetToken(CParser.Bool, 0); }
	public Complex(): TerminalNode | undefined { return this.tryGetToken(CParser.Complex, 0); }
	public LeftParen(): TerminalNode | undefined { return this.tryGetToken(CParser.LeftParen, 0); }
	public RightParen(): TerminalNode | undefined { return this.tryGetToken(CParser.RightParen, 0); }
	public atomicTypeSpecifier(): AtomicTypeSpecifierContext | undefined {
		return this.tryGetRuleContext(0, AtomicTypeSpecifierContext);
	}
	public structOrUnionSpecifier(): StructOrUnionSpecifierContext | undefined {
		return this.tryGetRuleContext(0, StructOrUnionSpecifierContext);
	}
	public enumSpecifier(): EnumSpecifierContext | undefined {
		return this.tryGetRuleContext(0, EnumSpecifierContext);
	}
	public typedefName(): TypedefNameContext | undefined {
		return this.tryGetRuleContext(0, TypedefNameContext);
	}
	public constantExpression(): ConstantExpressionContext | undefined {
		return this.tryGetRuleContext(0, ConstantExpressionContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CParser.RULE_typeSpecifier; }
	// @Override
	public enterRule(listener: CListener): void {
		if (listener.enterTypeSpecifier) {
			listener.enterTypeSpecifier(this);
		}
	}
	// @Override
	public exitRule(listener: CListener): void {
		if (listener.exitTypeSpecifier) {
			listener.exitTypeSpecifier(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CVisitor<Result>): Result {
		if (visitor.visitTypeSpecifier) {
			return visitor.visitTypeSpecifier(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class StructOrUnionSpecifierContext extends ParserRuleContext {
	public structOrUnion(): StructOrUnionContext {
		return this.getRuleContext(0, StructOrUnionContext);
	}
	public LeftBrace(): TerminalNode | undefined { return this.tryGetToken(CParser.LeftBrace, 0); }
	public structDeclarationList(): StructDeclarationListContext | undefined {
		return this.tryGetRuleContext(0, StructDeclarationListContext);
	}
	public RightBrace(): TerminalNode | undefined { return this.tryGetToken(CParser.RightBrace, 0); }
	public Identifier(): TerminalNode | undefined { return this.tryGetToken(CParser.Identifier, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CParser.RULE_structOrUnionSpecifier; }
	// @Override
	public enterRule(listener: CListener): void {
		if (listener.enterStructOrUnionSpecifier) {
			listener.enterStructOrUnionSpecifier(this);
		}
	}
	// @Override
	public exitRule(listener: CListener): void {
		if (listener.exitStructOrUnionSpecifier) {
			listener.exitStructOrUnionSpecifier(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CVisitor<Result>): Result {
		if (visitor.visitStructOrUnionSpecifier) {
			return visitor.visitStructOrUnionSpecifier(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class StructOrUnionContext extends ParserRuleContext {
	public Struct(): TerminalNode | undefined { return this.tryGetToken(CParser.Struct, 0); }
	public Union(): TerminalNode | undefined { return this.tryGetToken(CParser.Union, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CParser.RULE_structOrUnion; }
	// @Override
	public enterRule(listener: CListener): void {
		if (listener.enterStructOrUnion) {
			listener.enterStructOrUnion(this);
		}
	}
	// @Override
	public exitRule(listener: CListener): void {
		if (listener.exitStructOrUnion) {
			listener.exitStructOrUnion(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CVisitor<Result>): Result {
		if (visitor.visitStructOrUnion) {
			return visitor.visitStructOrUnion(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class StructDeclarationListContext extends ParserRuleContext {
	public structDeclaration(): StructDeclarationContext[];
	public structDeclaration(i: number): StructDeclarationContext;
	public structDeclaration(i?: number): StructDeclarationContext | StructDeclarationContext[] {
		if (i === undefined) {
			return this.getRuleContexts(StructDeclarationContext);
		} else {
			return this.getRuleContext(i, StructDeclarationContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CParser.RULE_structDeclarationList; }
	// @Override
	public enterRule(listener: CListener): void {
		if (listener.enterStructDeclarationList) {
			listener.enterStructDeclarationList(this);
		}
	}
	// @Override
	public exitRule(listener: CListener): void {
		if (listener.exitStructDeclarationList) {
			listener.exitStructDeclarationList(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CVisitor<Result>): Result {
		if (visitor.visitStructDeclarationList) {
			return visitor.visitStructDeclarationList(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class StructDeclarationContext extends ParserRuleContext {
	public specifierQualifierList(): SpecifierQualifierListContext | undefined {
		return this.tryGetRuleContext(0, SpecifierQualifierListContext);
	}
	public structDeclaratorList(): StructDeclaratorListContext | undefined {
		return this.tryGetRuleContext(0, StructDeclaratorListContext);
	}
	public Semi(): TerminalNode | undefined { return this.tryGetToken(CParser.Semi, 0); }
	public staticAssertDeclaration(): StaticAssertDeclarationContext | undefined {
		return this.tryGetRuleContext(0, StaticAssertDeclarationContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CParser.RULE_structDeclaration; }
	// @Override
	public enterRule(listener: CListener): void {
		if (listener.enterStructDeclaration) {
			listener.enterStructDeclaration(this);
		}
	}
	// @Override
	public exitRule(listener: CListener): void {
		if (listener.exitStructDeclaration) {
			listener.exitStructDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CVisitor<Result>): Result {
		if (visitor.visitStructDeclaration) {
			return visitor.visitStructDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class SpecifierQualifierListContext extends ParserRuleContext {
	public typeSpecifier(): TypeSpecifierContext | undefined {
		return this.tryGetRuleContext(0, TypeSpecifierContext);
	}
	public typeQualifier(): TypeQualifierContext | undefined {
		return this.tryGetRuleContext(0, TypeQualifierContext);
	}
	public specifierQualifierList(): SpecifierQualifierListContext | undefined {
		return this.tryGetRuleContext(0, SpecifierQualifierListContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CParser.RULE_specifierQualifierList; }
	// @Override
	public enterRule(listener: CListener): void {
		if (listener.enterSpecifierQualifierList) {
			listener.enterSpecifierQualifierList(this);
		}
	}
	// @Override
	public exitRule(listener: CListener): void {
		if (listener.exitSpecifierQualifierList) {
			listener.exitSpecifierQualifierList(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CVisitor<Result>): Result {
		if (visitor.visitSpecifierQualifierList) {
			return visitor.visitSpecifierQualifierList(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class StructDeclaratorListContext extends ParserRuleContext {
	public structDeclarator(): StructDeclaratorContext[];
	public structDeclarator(i: number): StructDeclaratorContext;
	public structDeclarator(i?: number): StructDeclaratorContext | StructDeclaratorContext[] {
		if (i === undefined) {
			return this.getRuleContexts(StructDeclaratorContext);
		} else {
			return this.getRuleContext(i, StructDeclaratorContext);
		}
	}
	public Comma(): TerminalNode[];
	public Comma(i: number): TerminalNode;
	public Comma(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(CParser.Comma);
		} else {
			return this.getToken(CParser.Comma, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CParser.RULE_structDeclaratorList; }
	// @Override
	public enterRule(listener: CListener): void {
		if (listener.enterStructDeclaratorList) {
			listener.enterStructDeclaratorList(this);
		}
	}
	// @Override
	public exitRule(listener: CListener): void {
		if (listener.exitStructDeclaratorList) {
			listener.exitStructDeclaratorList(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CVisitor<Result>): Result {
		if (visitor.visitStructDeclaratorList) {
			return visitor.visitStructDeclaratorList(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class StructDeclaratorContext extends ParserRuleContext {
	public declarator(): DeclaratorContext | undefined {
		return this.tryGetRuleContext(0, DeclaratorContext);
	}
	public Colon(): TerminalNode | undefined { return this.tryGetToken(CParser.Colon, 0); }
	public constantExpression(): ConstantExpressionContext | undefined {
		return this.tryGetRuleContext(0, ConstantExpressionContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CParser.RULE_structDeclarator; }
	// @Override
	public enterRule(listener: CListener): void {
		if (listener.enterStructDeclarator) {
			listener.enterStructDeclarator(this);
		}
	}
	// @Override
	public exitRule(listener: CListener): void {
		if (listener.exitStructDeclarator) {
			listener.exitStructDeclarator(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CVisitor<Result>): Result {
		if (visitor.visitStructDeclarator) {
			return visitor.visitStructDeclarator(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class EnumSpecifierContext extends ParserRuleContext {
	public Enum(): TerminalNode { return this.getToken(CParser.Enum, 0); }
	public LeftBrace(): TerminalNode | undefined { return this.tryGetToken(CParser.LeftBrace, 0); }
	public enumeratorList(): EnumeratorListContext | undefined {
		return this.tryGetRuleContext(0, EnumeratorListContext);
	}
	public RightBrace(): TerminalNode | undefined { return this.tryGetToken(CParser.RightBrace, 0); }
	public Identifier(): TerminalNode | undefined { return this.tryGetToken(CParser.Identifier, 0); }
	public Comma(): TerminalNode | undefined { return this.tryGetToken(CParser.Comma, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CParser.RULE_enumSpecifier; }
	// @Override
	public enterRule(listener: CListener): void {
		if (listener.enterEnumSpecifier) {
			listener.enterEnumSpecifier(this);
		}
	}
	// @Override
	public exitRule(listener: CListener): void {
		if (listener.exitEnumSpecifier) {
			listener.exitEnumSpecifier(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CVisitor<Result>): Result {
		if (visitor.visitEnumSpecifier) {
			return visitor.visitEnumSpecifier(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class EnumeratorListContext extends ParserRuleContext {
	public enumerator(): EnumeratorContext[];
	public enumerator(i: number): EnumeratorContext;
	public enumerator(i?: number): EnumeratorContext | EnumeratorContext[] {
		if (i === undefined) {
			return this.getRuleContexts(EnumeratorContext);
		} else {
			return this.getRuleContext(i, EnumeratorContext);
		}
	}
	public Comma(): TerminalNode[];
	public Comma(i: number): TerminalNode;
	public Comma(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(CParser.Comma);
		} else {
			return this.getToken(CParser.Comma, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CParser.RULE_enumeratorList; }
	// @Override
	public enterRule(listener: CListener): void {
		if (listener.enterEnumeratorList) {
			listener.enterEnumeratorList(this);
		}
	}
	// @Override
	public exitRule(listener: CListener): void {
		if (listener.exitEnumeratorList) {
			listener.exitEnumeratorList(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CVisitor<Result>): Result {
		if (visitor.visitEnumeratorList) {
			return visitor.visitEnumeratorList(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class EnumeratorContext extends ParserRuleContext {
	public enumerationConstant(): EnumerationConstantContext {
		return this.getRuleContext(0, EnumerationConstantContext);
	}
	public Assign(): TerminalNode | undefined { return this.tryGetToken(CParser.Assign, 0); }
	public constantExpression(): ConstantExpressionContext | undefined {
		return this.tryGetRuleContext(0, ConstantExpressionContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CParser.RULE_enumerator; }
	// @Override
	public enterRule(listener: CListener): void {
		if (listener.enterEnumerator) {
			listener.enterEnumerator(this);
		}
	}
	// @Override
	public exitRule(listener: CListener): void {
		if (listener.exitEnumerator) {
			listener.exitEnumerator(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CVisitor<Result>): Result {
		if (visitor.visitEnumerator) {
			return visitor.visitEnumerator(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class EnumerationConstantContext extends ParserRuleContext {
	public Identifier(): TerminalNode { return this.getToken(CParser.Identifier, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CParser.RULE_enumerationConstant; }
	// @Override
	public enterRule(listener: CListener): void {
		if (listener.enterEnumerationConstant) {
			listener.enterEnumerationConstant(this);
		}
	}
	// @Override
	public exitRule(listener: CListener): void {
		if (listener.exitEnumerationConstant) {
			listener.exitEnumerationConstant(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CVisitor<Result>): Result {
		if (visitor.visitEnumerationConstant) {
			return visitor.visitEnumerationConstant(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class AtomicTypeSpecifierContext extends ParserRuleContext {
	public Atomic(): TerminalNode { return this.getToken(CParser.Atomic, 0); }
	public LeftParen(): TerminalNode { return this.getToken(CParser.LeftParen, 0); }
	public typeName(): TypeNameContext {
		return this.getRuleContext(0, TypeNameContext);
	}
	public RightParen(): TerminalNode { return this.getToken(CParser.RightParen, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CParser.RULE_atomicTypeSpecifier; }
	// @Override
	public enterRule(listener: CListener): void {
		if (listener.enterAtomicTypeSpecifier) {
			listener.enterAtomicTypeSpecifier(this);
		}
	}
	// @Override
	public exitRule(listener: CListener): void {
		if (listener.exitAtomicTypeSpecifier) {
			listener.exitAtomicTypeSpecifier(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CVisitor<Result>): Result {
		if (visitor.visitAtomicTypeSpecifier) {
			return visitor.visitAtomicTypeSpecifier(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TypeQualifierContext extends ParserRuleContext {
	public Const(): TerminalNode | undefined { return this.tryGetToken(CParser.Const, 0); }
	public Restrict(): TerminalNode | undefined { return this.tryGetToken(CParser.Restrict, 0); }
	public Volatile(): TerminalNode | undefined { return this.tryGetToken(CParser.Volatile, 0); }
	public Atomic(): TerminalNode | undefined { return this.tryGetToken(CParser.Atomic, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CParser.RULE_typeQualifier; }
	// @Override
	public enterRule(listener: CListener): void {
		if (listener.enterTypeQualifier) {
			listener.enterTypeQualifier(this);
		}
	}
	// @Override
	public exitRule(listener: CListener): void {
		if (listener.exitTypeQualifier) {
			listener.exitTypeQualifier(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CVisitor<Result>): Result {
		if (visitor.visitTypeQualifier) {
			return visitor.visitTypeQualifier(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class FunctionSpecifierContext extends ParserRuleContext {
	public Inline(): TerminalNode | undefined { return this.tryGetToken(CParser.Inline, 0); }
	public Noreturn(): TerminalNode | undefined { return this.tryGetToken(CParser.Noreturn, 0); }
	public gccAttributeSpecifier(): GccAttributeSpecifierContext | undefined {
		return this.tryGetRuleContext(0, GccAttributeSpecifierContext);
	}
	public LeftParen(): TerminalNode | undefined { return this.tryGetToken(CParser.LeftParen, 0); }
	public Identifier(): TerminalNode | undefined { return this.tryGetToken(CParser.Identifier, 0); }
	public RightParen(): TerminalNode | undefined { return this.tryGetToken(CParser.RightParen, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CParser.RULE_functionSpecifier; }
	// @Override
	public enterRule(listener: CListener): void {
		if (listener.enterFunctionSpecifier) {
			listener.enterFunctionSpecifier(this);
		}
	}
	// @Override
	public exitRule(listener: CListener): void {
		if (listener.exitFunctionSpecifier) {
			listener.exitFunctionSpecifier(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CVisitor<Result>): Result {
		if (visitor.visitFunctionSpecifier) {
			return visitor.visitFunctionSpecifier(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class AlignmentSpecifierContext extends ParserRuleContext {
	public Alignas(): TerminalNode { return this.getToken(CParser.Alignas, 0); }
	public LeftParen(): TerminalNode { return this.getToken(CParser.LeftParen, 0); }
	public RightParen(): TerminalNode { return this.getToken(CParser.RightParen, 0); }
	public typeName(): TypeNameContext | undefined {
		return this.tryGetRuleContext(0, TypeNameContext);
	}
	public constantExpression(): ConstantExpressionContext | undefined {
		return this.tryGetRuleContext(0, ConstantExpressionContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CParser.RULE_alignmentSpecifier; }
	// @Override
	public enterRule(listener: CListener): void {
		if (listener.enterAlignmentSpecifier) {
			listener.enterAlignmentSpecifier(this);
		}
	}
	// @Override
	public exitRule(listener: CListener): void {
		if (listener.exitAlignmentSpecifier) {
			listener.exitAlignmentSpecifier(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CVisitor<Result>): Result {
		if (visitor.visitAlignmentSpecifier) {
			return visitor.visitAlignmentSpecifier(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class DeclaratorContext extends ParserRuleContext {
	public directDeclarator(): DirectDeclaratorContext {
		return this.getRuleContext(0, DirectDeclaratorContext);
	}
	public pointer(): PointerContext | undefined {
		return this.tryGetRuleContext(0, PointerContext);
	}
	public gccDeclaratorExtension(): GccDeclaratorExtensionContext[];
	public gccDeclaratorExtension(i: number): GccDeclaratorExtensionContext;
	public gccDeclaratorExtension(i?: number): GccDeclaratorExtensionContext | GccDeclaratorExtensionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(GccDeclaratorExtensionContext);
		} else {
			return this.getRuleContext(i, GccDeclaratorExtensionContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CParser.RULE_declarator; }
	// @Override
	public enterRule(listener: CListener): void {
		if (listener.enterDeclarator) {
			listener.enterDeclarator(this);
		}
	}
	// @Override
	public exitRule(listener: CListener): void {
		if (listener.exitDeclarator) {
			listener.exitDeclarator(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CVisitor<Result>): Result {
		if (visitor.visitDeclarator) {
			return visitor.visitDeclarator(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class DirectDeclaratorContext extends ParserRuleContext {
	public Identifier(): TerminalNode | undefined { return this.tryGetToken(CParser.Identifier, 0); }
	public LeftParen(): TerminalNode | undefined { return this.tryGetToken(CParser.LeftParen, 0); }
	public declarator(): DeclaratorContext | undefined {
		return this.tryGetRuleContext(0, DeclaratorContext);
	}
	public RightParen(): TerminalNode | undefined { return this.tryGetToken(CParser.RightParen, 0); }
	public directDeclarator(): DirectDeclaratorContext | undefined {
		return this.tryGetRuleContext(0, DirectDeclaratorContext);
	}
	public LeftBracket(): TerminalNode | undefined { return this.tryGetToken(CParser.LeftBracket, 0); }
	public RightBracket(): TerminalNode | undefined { return this.tryGetToken(CParser.RightBracket, 0); }
	public typeQualifierList(): TypeQualifierListContext | undefined {
		return this.tryGetRuleContext(0, TypeQualifierListContext);
	}
	public assignmentExpression(): AssignmentExpressionContext | undefined {
		return this.tryGetRuleContext(0, AssignmentExpressionContext);
	}
	public Static(): TerminalNode | undefined { return this.tryGetToken(CParser.Static, 0); }
	public Star(): TerminalNode | undefined { return this.tryGetToken(CParser.Star, 0); }
	public parameterTypeList(): ParameterTypeListContext | undefined {
		return this.tryGetRuleContext(0, ParameterTypeListContext);
	}
	public identifierList(): IdentifierListContext | undefined {
		return this.tryGetRuleContext(0, IdentifierListContext);
	}
	public Colon(): TerminalNode | undefined { return this.tryGetToken(CParser.Colon, 0); }
	public DigitSequence(): TerminalNode | undefined { return this.tryGetToken(CParser.DigitSequence, 0); }
	public vcSpecificModifer(): VcSpecificModiferContext | undefined {
		return this.tryGetRuleContext(0, VcSpecificModiferContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CParser.RULE_directDeclarator; }
	// @Override
	public enterRule(listener: CListener): void {
		if (listener.enterDirectDeclarator) {
			listener.enterDirectDeclarator(this);
		}
	}
	// @Override
	public exitRule(listener: CListener): void {
		if (listener.exitDirectDeclarator) {
			listener.exitDirectDeclarator(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CVisitor<Result>): Result {
		if (visitor.visitDirectDeclarator) {
			return visitor.visitDirectDeclarator(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class VcSpecificModiferContext extends ParserRuleContext {
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CParser.RULE_vcSpecificModifer; }
	// @Override
	public enterRule(listener: CListener): void {
		if (listener.enterVcSpecificModifer) {
			listener.enterVcSpecificModifer(this);
		}
	}
	// @Override
	public exitRule(listener: CListener): void {
		if (listener.exitVcSpecificModifer) {
			listener.exitVcSpecificModifer(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CVisitor<Result>): Result {
		if (visitor.visitVcSpecificModifer) {
			return visitor.visitVcSpecificModifer(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class GccDeclaratorExtensionContext extends ParserRuleContext {
	public LeftParen(): TerminalNode | undefined { return this.tryGetToken(CParser.LeftParen, 0); }
	public RightParen(): TerminalNode | undefined { return this.tryGetToken(CParser.RightParen, 0); }
	public StringLiteral(): TerminalNode[];
	public StringLiteral(i: number): TerminalNode;
	public StringLiteral(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(CParser.StringLiteral);
		} else {
			return this.getToken(CParser.StringLiteral, i);
		}
	}
	public gccAttributeSpecifier(): GccAttributeSpecifierContext | undefined {
		return this.tryGetRuleContext(0, GccAttributeSpecifierContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CParser.RULE_gccDeclaratorExtension; }
	// @Override
	public enterRule(listener: CListener): void {
		if (listener.enterGccDeclaratorExtension) {
			listener.enterGccDeclaratorExtension(this);
		}
	}
	// @Override
	public exitRule(listener: CListener): void {
		if (listener.exitGccDeclaratorExtension) {
			listener.exitGccDeclaratorExtension(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CVisitor<Result>): Result {
		if (visitor.visitGccDeclaratorExtension) {
			return visitor.visitGccDeclaratorExtension(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class GccAttributeSpecifierContext extends ParserRuleContext {
	public LeftParen(): TerminalNode[];
	public LeftParen(i: number): TerminalNode;
	public LeftParen(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(CParser.LeftParen);
		} else {
			return this.getToken(CParser.LeftParen, i);
		}
	}
	public gccAttributeList(): GccAttributeListContext {
		return this.getRuleContext(0, GccAttributeListContext);
	}
	public RightParen(): TerminalNode[];
	public RightParen(i: number): TerminalNode;
	public RightParen(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(CParser.RightParen);
		} else {
			return this.getToken(CParser.RightParen, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CParser.RULE_gccAttributeSpecifier; }
	// @Override
	public enterRule(listener: CListener): void {
		if (listener.enterGccAttributeSpecifier) {
			listener.enterGccAttributeSpecifier(this);
		}
	}
	// @Override
	public exitRule(listener: CListener): void {
		if (listener.exitGccAttributeSpecifier) {
			listener.exitGccAttributeSpecifier(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CVisitor<Result>): Result {
		if (visitor.visitGccAttributeSpecifier) {
			return visitor.visitGccAttributeSpecifier(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class GccAttributeListContext extends ParserRuleContext {
	public gccAttribute(): GccAttributeContext[];
	public gccAttribute(i: number): GccAttributeContext;
	public gccAttribute(i?: number): GccAttributeContext | GccAttributeContext[] {
		if (i === undefined) {
			return this.getRuleContexts(GccAttributeContext);
		} else {
			return this.getRuleContext(i, GccAttributeContext);
		}
	}
	public Comma(): TerminalNode[];
	public Comma(i: number): TerminalNode;
	public Comma(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(CParser.Comma);
		} else {
			return this.getToken(CParser.Comma, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CParser.RULE_gccAttributeList; }
	// @Override
	public enterRule(listener: CListener): void {
		if (listener.enterGccAttributeList) {
			listener.enterGccAttributeList(this);
		}
	}
	// @Override
	public exitRule(listener: CListener): void {
		if (listener.exitGccAttributeList) {
			listener.exitGccAttributeList(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CVisitor<Result>): Result {
		if (visitor.visitGccAttributeList) {
			return visitor.visitGccAttributeList(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class GccAttributeContext extends ParserRuleContext {
	public Comma(): TerminalNode | undefined { return this.tryGetToken(CParser.Comma, 0); }
	public LeftParen(): TerminalNode[];
	public LeftParen(i: number): TerminalNode;
	public LeftParen(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(CParser.LeftParen);
		} else {
			return this.getToken(CParser.LeftParen, i);
		}
	}
	public RightParen(): TerminalNode[];
	public RightParen(i: number): TerminalNode;
	public RightParen(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(CParser.RightParen);
		} else {
			return this.getToken(CParser.RightParen, i);
		}
	}
	public argumentExpressionList(): ArgumentExpressionListContext | undefined {
		return this.tryGetRuleContext(0, ArgumentExpressionListContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CParser.RULE_gccAttribute; }
	// @Override
	public enterRule(listener: CListener): void {
		if (listener.enterGccAttribute) {
			listener.enterGccAttribute(this);
		}
	}
	// @Override
	public exitRule(listener: CListener): void {
		if (listener.exitGccAttribute) {
			listener.exitGccAttribute(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CVisitor<Result>): Result {
		if (visitor.visitGccAttribute) {
			return visitor.visitGccAttribute(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class NestedParenthesesBlockContext extends ParserRuleContext {
	public LeftParen(): TerminalNode[];
	public LeftParen(i: number): TerminalNode;
	public LeftParen(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(CParser.LeftParen);
		} else {
			return this.getToken(CParser.LeftParen, i);
		}
	}
	public nestedParenthesesBlock(): NestedParenthesesBlockContext[];
	public nestedParenthesesBlock(i: number): NestedParenthesesBlockContext;
	public nestedParenthesesBlock(i?: number): NestedParenthesesBlockContext | NestedParenthesesBlockContext[] {
		if (i === undefined) {
			return this.getRuleContexts(NestedParenthesesBlockContext);
		} else {
			return this.getRuleContext(i, NestedParenthesesBlockContext);
		}
	}
	public RightParen(): TerminalNode[];
	public RightParen(i: number): TerminalNode;
	public RightParen(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(CParser.RightParen);
		} else {
			return this.getToken(CParser.RightParen, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CParser.RULE_nestedParenthesesBlock; }
	// @Override
	public enterRule(listener: CListener): void {
		if (listener.enterNestedParenthesesBlock) {
			listener.enterNestedParenthesesBlock(this);
		}
	}
	// @Override
	public exitRule(listener: CListener): void {
		if (listener.exitNestedParenthesesBlock) {
			listener.exitNestedParenthesesBlock(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CVisitor<Result>): Result {
		if (visitor.visitNestedParenthesesBlock) {
			return visitor.visitNestedParenthesesBlock(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class PointerContext extends ParserRuleContext {
	public Star(): TerminalNode[];
	public Star(i: number): TerminalNode;
	public Star(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(CParser.Star);
		} else {
			return this.getToken(CParser.Star, i);
		}
	}
	public Caret(): TerminalNode[];
	public Caret(i: number): TerminalNode;
	public Caret(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(CParser.Caret);
		} else {
			return this.getToken(CParser.Caret, i);
		}
	}
	public typeQualifierList(): TypeQualifierListContext[];
	public typeQualifierList(i: number): TypeQualifierListContext;
	public typeQualifierList(i?: number): TypeQualifierListContext | TypeQualifierListContext[] {
		if (i === undefined) {
			return this.getRuleContexts(TypeQualifierListContext);
		} else {
			return this.getRuleContext(i, TypeQualifierListContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CParser.RULE_pointer; }
	// @Override
	public enterRule(listener: CListener): void {
		if (listener.enterPointer) {
			listener.enterPointer(this);
		}
	}
	// @Override
	public exitRule(listener: CListener): void {
		if (listener.exitPointer) {
			listener.exitPointer(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CVisitor<Result>): Result {
		if (visitor.visitPointer) {
			return visitor.visitPointer(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TypeQualifierListContext extends ParserRuleContext {
	public typeQualifier(): TypeQualifierContext[];
	public typeQualifier(i: number): TypeQualifierContext;
	public typeQualifier(i?: number): TypeQualifierContext | TypeQualifierContext[] {
		if (i === undefined) {
			return this.getRuleContexts(TypeQualifierContext);
		} else {
			return this.getRuleContext(i, TypeQualifierContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CParser.RULE_typeQualifierList; }
	// @Override
	public enterRule(listener: CListener): void {
		if (listener.enterTypeQualifierList) {
			listener.enterTypeQualifierList(this);
		}
	}
	// @Override
	public exitRule(listener: CListener): void {
		if (listener.exitTypeQualifierList) {
			listener.exitTypeQualifierList(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CVisitor<Result>): Result {
		if (visitor.visitTypeQualifierList) {
			return visitor.visitTypeQualifierList(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ParameterTypeListContext extends ParserRuleContext {
	public parameterList(): ParameterListContext {
		return this.getRuleContext(0, ParameterListContext);
	}
	public Comma(): TerminalNode | undefined { return this.tryGetToken(CParser.Comma, 0); }
	public Ellipsis(): TerminalNode | undefined { return this.tryGetToken(CParser.Ellipsis, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CParser.RULE_parameterTypeList; }
	// @Override
	public enterRule(listener: CListener): void {
		if (listener.enterParameterTypeList) {
			listener.enterParameterTypeList(this);
		}
	}
	// @Override
	public exitRule(listener: CListener): void {
		if (listener.exitParameterTypeList) {
			listener.exitParameterTypeList(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CVisitor<Result>): Result {
		if (visitor.visitParameterTypeList) {
			return visitor.visitParameterTypeList(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ParameterListContext extends ParserRuleContext {
	public parameterDeclaration(): ParameterDeclarationContext[];
	public parameterDeclaration(i: number): ParameterDeclarationContext;
	public parameterDeclaration(i?: number): ParameterDeclarationContext | ParameterDeclarationContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ParameterDeclarationContext);
		} else {
			return this.getRuleContext(i, ParameterDeclarationContext);
		}
	}
	public Comma(): TerminalNode[];
	public Comma(i: number): TerminalNode;
	public Comma(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(CParser.Comma);
		} else {
			return this.getToken(CParser.Comma, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CParser.RULE_parameterList; }
	// @Override
	public enterRule(listener: CListener): void {
		if (listener.enterParameterList) {
			listener.enterParameterList(this);
		}
	}
	// @Override
	public exitRule(listener: CListener): void {
		if (listener.exitParameterList) {
			listener.exitParameterList(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CVisitor<Result>): Result {
		if (visitor.visitParameterList) {
			return visitor.visitParameterList(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ParameterDeclarationContext extends ParserRuleContext {
	public declarationSpecifiers(): DeclarationSpecifiersContext | undefined {
		return this.tryGetRuleContext(0, DeclarationSpecifiersContext);
	}
	public declarator(): DeclaratorContext | undefined {
		return this.tryGetRuleContext(0, DeclaratorContext);
	}
	public declarationSpecifiers2(): DeclarationSpecifiers2Context | undefined {
		return this.tryGetRuleContext(0, DeclarationSpecifiers2Context);
	}
	public abstractDeclarator(): AbstractDeclaratorContext | undefined {
		return this.tryGetRuleContext(0, AbstractDeclaratorContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CParser.RULE_parameterDeclaration; }
	// @Override
	public enterRule(listener: CListener): void {
		if (listener.enterParameterDeclaration) {
			listener.enterParameterDeclaration(this);
		}
	}
	// @Override
	public exitRule(listener: CListener): void {
		if (listener.exitParameterDeclaration) {
			listener.exitParameterDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CVisitor<Result>): Result {
		if (visitor.visitParameterDeclaration) {
			return visitor.visitParameterDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class IdentifierListContext extends ParserRuleContext {
	public Identifier(): TerminalNode[];
	public Identifier(i: number): TerminalNode;
	public Identifier(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(CParser.Identifier);
		} else {
			return this.getToken(CParser.Identifier, i);
		}
	}
	public Comma(): TerminalNode[];
	public Comma(i: number): TerminalNode;
	public Comma(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(CParser.Comma);
		} else {
			return this.getToken(CParser.Comma, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CParser.RULE_identifierList; }
	// @Override
	public enterRule(listener: CListener): void {
		if (listener.enterIdentifierList) {
			listener.enterIdentifierList(this);
		}
	}
	// @Override
	public exitRule(listener: CListener): void {
		if (listener.exitIdentifierList) {
			listener.exitIdentifierList(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CVisitor<Result>): Result {
		if (visitor.visitIdentifierList) {
			return visitor.visitIdentifierList(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TypeNameContext extends ParserRuleContext {
	public specifierQualifierList(): SpecifierQualifierListContext {
		return this.getRuleContext(0, SpecifierQualifierListContext);
	}
	public abstractDeclarator(): AbstractDeclaratorContext | undefined {
		return this.tryGetRuleContext(0, AbstractDeclaratorContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CParser.RULE_typeName; }
	// @Override
	public enterRule(listener: CListener): void {
		if (listener.enterTypeName) {
			listener.enterTypeName(this);
		}
	}
	// @Override
	public exitRule(listener: CListener): void {
		if (listener.exitTypeName) {
			listener.exitTypeName(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CVisitor<Result>): Result {
		if (visitor.visitTypeName) {
			return visitor.visitTypeName(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class AbstractDeclaratorContext extends ParserRuleContext {
	public pointer(): PointerContext | undefined {
		return this.tryGetRuleContext(0, PointerContext);
	}
	public directAbstractDeclarator(): DirectAbstractDeclaratorContext | undefined {
		return this.tryGetRuleContext(0, DirectAbstractDeclaratorContext);
	}
	public gccDeclaratorExtension(): GccDeclaratorExtensionContext[];
	public gccDeclaratorExtension(i: number): GccDeclaratorExtensionContext;
	public gccDeclaratorExtension(i?: number): GccDeclaratorExtensionContext | GccDeclaratorExtensionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(GccDeclaratorExtensionContext);
		} else {
			return this.getRuleContext(i, GccDeclaratorExtensionContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CParser.RULE_abstractDeclarator; }
	// @Override
	public enterRule(listener: CListener): void {
		if (listener.enterAbstractDeclarator) {
			listener.enterAbstractDeclarator(this);
		}
	}
	// @Override
	public exitRule(listener: CListener): void {
		if (listener.exitAbstractDeclarator) {
			listener.exitAbstractDeclarator(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CVisitor<Result>): Result {
		if (visitor.visitAbstractDeclarator) {
			return visitor.visitAbstractDeclarator(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class DirectAbstractDeclaratorContext extends ParserRuleContext {
	public LeftParen(): TerminalNode | undefined { return this.tryGetToken(CParser.LeftParen, 0); }
	public abstractDeclarator(): AbstractDeclaratorContext | undefined {
		return this.tryGetRuleContext(0, AbstractDeclaratorContext);
	}
	public RightParen(): TerminalNode | undefined { return this.tryGetToken(CParser.RightParen, 0); }
	public gccDeclaratorExtension(): GccDeclaratorExtensionContext[];
	public gccDeclaratorExtension(i: number): GccDeclaratorExtensionContext;
	public gccDeclaratorExtension(i?: number): GccDeclaratorExtensionContext | GccDeclaratorExtensionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(GccDeclaratorExtensionContext);
		} else {
			return this.getRuleContext(i, GccDeclaratorExtensionContext);
		}
	}
	public LeftBracket(): TerminalNode | undefined { return this.tryGetToken(CParser.LeftBracket, 0); }
	public RightBracket(): TerminalNode | undefined { return this.tryGetToken(CParser.RightBracket, 0); }
	public typeQualifierList(): TypeQualifierListContext | undefined {
		return this.tryGetRuleContext(0, TypeQualifierListContext);
	}
	public assignmentExpression(): AssignmentExpressionContext | undefined {
		return this.tryGetRuleContext(0, AssignmentExpressionContext);
	}
	public Static(): TerminalNode | undefined { return this.tryGetToken(CParser.Static, 0); }
	public Star(): TerminalNode | undefined { return this.tryGetToken(CParser.Star, 0); }
	public parameterTypeList(): ParameterTypeListContext | undefined {
		return this.tryGetRuleContext(0, ParameterTypeListContext);
	}
	public directAbstractDeclarator(): DirectAbstractDeclaratorContext | undefined {
		return this.tryGetRuleContext(0, DirectAbstractDeclaratorContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CParser.RULE_directAbstractDeclarator; }
	// @Override
	public enterRule(listener: CListener): void {
		if (listener.enterDirectAbstractDeclarator) {
			listener.enterDirectAbstractDeclarator(this);
		}
	}
	// @Override
	public exitRule(listener: CListener): void {
		if (listener.exitDirectAbstractDeclarator) {
			listener.exitDirectAbstractDeclarator(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CVisitor<Result>): Result {
		if (visitor.visitDirectAbstractDeclarator) {
			return visitor.visitDirectAbstractDeclarator(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TypedefNameContext extends ParserRuleContext {
	public Identifier(): TerminalNode { return this.getToken(CParser.Identifier, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CParser.RULE_typedefName; }
	// @Override
	public enterRule(listener: CListener): void {
		if (listener.enterTypedefName) {
			listener.enterTypedefName(this);
		}
	}
	// @Override
	public exitRule(listener: CListener): void {
		if (listener.exitTypedefName) {
			listener.exitTypedefName(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CVisitor<Result>): Result {
		if (visitor.visitTypedefName) {
			return visitor.visitTypedefName(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class InitializerContext extends ParserRuleContext {
	public assignmentExpression(): AssignmentExpressionContext | undefined {
		return this.tryGetRuleContext(0, AssignmentExpressionContext);
	}
	public LeftBrace(): TerminalNode | undefined { return this.tryGetToken(CParser.LeftBrace, 0); }
	public initializerList(): InitializerListContext | undefined {
		return this.tryGetRuleContext(0, InitializerListContext);
	}
	public RightBrace(): TerminalNode | undefined { return this.tryGetToken(CParser.RightBrace, 0); }
	public Comma(): TerminalNode | undefined { return this.tryGetToken(CParser.Comma, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CParser.RULE_initializer; }
	// @Override
	public enterRule(listener: CListener): void {
		if (listener.enterInitializer) {
			listener.enterInitializer(this);
		}
	}
	// @Override
	public exitRule(listener: CListener): void {
		if (listener.exitInitializer) {
			listener.exitInitializer(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CVisitor<Result>): Result {
		if (visitor.visitInitializer) {
			return visitor.visitInitializer(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class InitializerListContext extends ParserRuleContext {
	public initializer(): InitializerContext[];
	public initializer(i: number): InitializerContext;
	public initializer(i?: number): InitializerContext | InitializerContext[] {
		if (i === undefined) {
			return this.getRuleContexts(InitializerContext);
		} else {
			return this.getRuleContext(i, InitializerContext);
		}
	}
	public designation(): DesignationContext[];
	public designation(i: number): DesignationContext;
	public designation(i?: number): DesignationContext | DesignationContext[] {
		if (i === undefined) {
			return this.getRuleContexts(DesignationContext);
		} else {
			return this.getRuleContext(i, DesignationContext);
		}
	}
	public Comma(): TerminalNode[];
	public Comma(i: number): TerminalNode;
	public Comma(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(CParser.Comma);
		} else {
			return this.getToken(CParser.Comma, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CParser.RULE_initializerList; }
	// @Override
	public enterRule(listener: CListener): void {
		if (listener.enterInitializerList) {
			listener.enterInitializerList(this);
		}
	}
	// @Override
	public exitRule(listener: CListener): void {
		if (listener.exitInitializerList) {
			listener.exitInitializerList(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CVisitor<Result>): Result {
		if (visitor.visitInitializerList) {
			return visitor.visitInitializerList(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class DesignationContext extends ParserRuleContext {
	public designatorList(): DesignatorListContext {
		return this.getRuleContext(0, DesignatorListContext);
	}
	public Assign(): TerminalNode { return this.getToken(CParser.Assign, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CParser.RULE_designation; }
	// @Override
	public enterRule(listener: CListener): void {
		if (listener.enterDesignation) {
			listener.enterDesignation(this);
		}
	}
	// @Override
	public exitRule(listener: CListener): void {
		if (listener.exitDesignation) {
			listener.exitDesignation(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CVisitor<Result>): Result {
		if (visitor.visitDesignation) {
			return visitor.visitDesignation(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class DesignatorListContext extends ParserRuleContext {
	public designator(): DesignatorContext[];
	public designator(i: number): DesignatorContext;
	public designator(i?: number): DesignatorContext | DesignatorContext[] {
		if (i === undefined) {
			return this.getRuleContexts(DesignatorContext);
		} else {
			return this.getRuleContext(i, DesignatorContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CParser.RULE_designatorList; }
	// @Override
	public enterRule(listener: CListener): void {
		if (listener.enterDesignatorList) {
			listener.enterDesignatorList(this);
		}
	}
	// @Override
	public exitRule(listener: CListener): void {
		if (listener.exitDesignatorList) {
			listener.exitDesignatorList(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CVisitor<Result>): Result {
		if (visitor.visitDesignatorList) {
			return visitor.visitDesignatorList(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class DesignatorContext extends ParserRuleContext {
	public LeftBracket(): TerminalNode | undefined { return this.tryGetToken(CParser.LeftBracket, 0); }
	public constantExpression(): ConstantExpressionContext | undefined {
		return this.tryGetRuleContext(0, ConstantExpressionContext);
	}
	public RightBracket(): TerminalNode | undefined { return this.tryGetToken(CParser.RightBracket, 0); }
	public Dot(): TerminalNode | undefined { return this.tryGetToken(CParser.Dot, 0); }
	public Identifier(): TerminalNode | undefined { return this.tryGetToken(CParser.Identifier, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CParser.RULE_designator; }
	// @Override
	public enterRule(listener: CListener): void {
		if (listener.enterDesignator) {
			listener.enterDesignator(this);
		}
	}
	// @Override
	public exitRule(listener: CListener): void {
		if (listener.exitDesignator) {
			listener.exitDesignator(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CVisitor<Result>): Result {
		if (visitor.visitDesignator) {
			return visitor.visitDesignator(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class StaticAssertDeclarationContext extends ParserRuleContext {
	public StaticAssert(): TerminalNode { return this.getToken(CParser.StaticAssert, 0); }
	public LeftParen(): TerminalNode { return this.getToken(CParser.LeftParen, 0); }
	public constantExpression(): ConstantExpressionContext {
		return this.getRuleContext(0, ConstantExpressionContext);
	}
	public Comma(): TerminalNode { return this.getToken(CParser.Comma, 0); }
	public RightParen(): TerminalNode { return this.getToken(CParser.RightParen, 0); }
	public Semi(): TerminalNode { return this.getToken(CParser.Semi, 0); }
	public StringLiteral(): TerminalNode[];
	public StringLiteral(i: number): TerminalNode;
	public StringLiteral(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(CParser.StringLiteral);
		} else {
			return this.getToken(CParser.StringLiteral, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CParser.RULE_staticAssertDeclaration; }
	// @Override
	public enterRule(listener: CListener): void {
		if (listener.enterStaticAssertDeclaration) {
			listener.enterStaticAssertDeclaration(this);
		}
	}
	// @Override
	public exitRule(listener: CListener): void {
		if (listener.exitStaticAssertDeclaration) {
			listener.exitStaticAssertDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CVisitor<Result>): Result {
		if (visitor.visitStaticAssertDeclaration) {
			return visitor.visitStaticAssertDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class StatementContext extends ParserRuleContext {
	public labeledStatement(): LabeledStatementContext | undefined {
		return this.tryGetRuleContext(0, LabeledStatementContext);
	}
	public compoundStatement(): CompoundStatementContext | undefined {
		return this.tryGetRuleContext(0, CompoundStatementContext);
	}
	public expressionStatement(): ExpressionStatementContext | undefined {
		return this.tryGetRuleContext(0, ExpressionStatementContext);
	}
	public selectionStatement(): SelectionStatementContext | undefined {
		return this.tryGetRuleContext(0, SelectionStatementContext);
	}
	public iterationStatement(): IterationStatementContext | undefined {
		return this.tryGetRuleContext(0, IterationStatementContext);
	}
	public jumpStatement(): JumpStatementContext | undefined {
		return this.tryGetRuleContext(0, JumpStatementContext);
	}
	public LeftParen(): TerminalNode | undefined { return this.tryGetToken(CParser.LeftParen, 0); }
	public RightParen(): TerminalNode | undefined { return this.tryGetToken(CParser.RightParen, 0); }
	public Semi(): TerminalNode | undefined { return this.tryGetToken(CParser.Semi, 0); }
	public Volatile(): TerminalNode | undefined { return this.tryGetToken(CParser.Volatile, 0); }
	public logicalOrExpression(): LogicalOrExpressionContext[];
	public logicalOrExpression(i: number): LogicalOrExpressionContext;
	public logicalOrExpression(i?: number): LogicalOrExpressionContext | LogicalOrExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(LogicalOrExpressionContext);
		} else {
			return this.getRuleContext(i, LogicalOrExpressionContext);
		}
	}
	public Colon(): TerminalNode[];
	public Colon(i: number): TerminalNode;
	public Colon(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(CParser.Colon);
		} else {
			return this.getToken(CParser.Colon, i);
		}
	}
	public Comma(): TerminalNode[];
	public Comma(i: number): TerminalNode;
	public Comma(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(CParser.Comma);
		} else {
			return this.getToken(CParser.Comma, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CParser.RULE_statement; }
	// @Override
	public enterRule(listener: CListener): void {
		if (listener.enterStatement) {
			listener.enterStatement(this);
		}
	}
	// @Override
	public exitRule(listener: CListener): void {
		if (listener.exitStatement) {
			listener.exitStatement(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CVisitor<Result>): Result {
		if (visitor.visitStatement) {
			return visitor.visitStatement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class LabeledStatementContext extends ParserRuleContext {
	public Identifier(): TerminalNode | undefined { return this.tryGetToken(CParser.Identifier, 0); }
	public Colon(): TerminalNode { return this.getToken(CParser.Colon, 0); }
	public statement(): StatementContext {
		return this.getRuleContext(0, StatementContext);
	}
	public Case(): TerminalNode | undefined { return this.tryGetToken(CParser.Case, 0); }
	public constantExpression(): ConstantExpressionContext | undefined {
		return this.tryGetRuleContext(0, ConstantExpressionContext);
	}
	public Default(): TerminalNode | undefined { return this.tryGetToken(CParser.Default, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CParser.RULE_labeledStatement; }
	// @Override
	public enterRule(listener: CListener): void {
		if (listener.enterLabeledStatement) {
			listener.enterLabeledStatement(this);
		}
	}
	// @Override
	public exitRule(listener: CListener): void {
		if (listener.exitLabeledStatement) {
			listener.exitLabeledStatement(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CVisitor<Result>): Result {
		if (visitor.visitLabeledStatement) {
			return visitor.visitLabeledStatement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class CompoundStatementContext extends ParserRuleContext {
	public LeftBrace(): TerminalNode { return this.getToken(CParser.LeftBrace, 0); }
	public RightBrace(): TerminalNode { return this.getToken(CParser.RightBrace, 0); }
	public blockItemList(): BlockItemListContext | undefined {
		return this.tryGetRuleContext(0, BlockItemListContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CParser.RULE_compoundStatement; }
	// @Override
	public enterRule(listener: CListener): void {
		if (listener.enterCompoundStatement) {
			listener.enterCompoundStatement(this);
		}
	}
	// @Override
	public exitRule(listener: CListener): void {
		if (listener.exitCompoundStatement) {
			listener.exitCompoundStatement(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CVisitor<Result>): Result {
		if (visitor.visitCompoundStatement) {
			return visitor.visitCompoundStatement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class BlockItemListContext extends ParserRuleContext {
	public blockItem(): BlockItemContext[];
	public blockItem(i: number): BlockItemContext;
	public blockItem(i?: number): BlockItemContext | BlockItemContext[] {
		if (i === undefined) {
			return this.getRuleContexts(BlockItemContext);
		} else {
			return this.getRuleContext(i, BlockItemContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CParser.RULE_blockItemList; }
	// @Override
	public enterRule(listener: CListener): void {
		if (listener.enterBlockItemList) {
			listener.enterBlockItemList(this);
		}
	}
	// @Override
	public exitRule(listener: CListener): void {
		if (listener.exitBlockItemList) {
			listener.exitBlockItemList(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CVisitor<Result>): Result {
		if (visitor.visitBlockItemList) {
			return visitor.visitBlockItemList(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class BlockItemContext extends ParserRuleContext {
	public statement(): StatementContext | undefined {
		return this.tryGetRuleContext(0, StatementContext);
	}
	public declaration(): DeclarationContext | undefined {
		return this.tryGetRuleContext(0, DeclarationContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CParser.RULE_blockItem; }
	// @Override
	public enterRule(listener: CListener): void {
		if (listener.enterBlockItem) {
			listener.enterBlockItem(this);
		}
	}
	// @Override
	public exitRule(listener: CListener): void {
		if (listener.exitBlockItem) {
			listener.exitBlockItem(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CVisitor<Result>): Result {
		if (visitor.visitBlockItem) {
			return visitor.visitBlockItem(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ExpressionStatementContext extends ParserRuleContext {
	public Semi(): TerminalNode { return this.getToken(CParser.Semi, 0); }
	public expression(): ExpressionContext | undefined {
		return this.tryGetRuleContext(0, ExpressionContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CParser.RULE_expressionStatement; }
	// @Override
	public enterRule(listener: CListener): void {
		if (listener.enterExpressionStatement) {
			listener.enterExpressionStatement(this);
		}
	}
	// @Override
	public exitRule(listener: CListener): void {
		if (listener.exitExpressionStatement) {
			listener.exitExpressionStatement(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CVisitor<Result>): Result {
		if (visitor.visitExpressionStatement) {
			return visitor.visitExpressionStatement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class SelectionStatementContext extends ParserRuleContext {
	public If(): TerminalNode | undefined { return this.tryGetToken(CParser.If, 0); }
	public LeftParen(): TerminalNode { return this.getToken(CParser.LeftParen, 0); }
	public expression(): ExpressionContext {
		return this.getRuleContext(0, ExpressionContext);
	}
	public RightParen(): TerminalNode { return this.getToken(CParser.RightParen, 0); }
	public statement(): StatementContext[];
	public statement(i: number): StatementContext;
	public statement(i?: number): StatementContext | StatementContext[] {
		if (i === undefined) {
			return this.getRuleContexts(StatementContext);
		} else {
			return this.getRuleContext(i, StatementContext);
		}
	}
	public Else(): TerminalNode | undefined { return this.tryGetToken(CParser.Else, 0); }
	public Switch(): TerminalNode | undefined { return this.tryGetToken(CParser.Switch, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CParser.RULE_selectionStatement; }
	// @Override
	public enterRule(listener: CListener): void {
		if (listener.enterSelectionStatement) {
			listener.enterSelectionStatement(this);
		}
	}
	// @Override
	public exitRule(listener: CListener): void {
		if (listener.exitSelectionStatement) {
			listener.exitSelectionStatement(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CVisitor<Result>): Result {
		if (visitor.visitSelectionStatement) {
			return visitor.visitSelectionStatement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class IterationStatementContext extends ParserRuleContext {
	public While(): TerminalNode | undefined { return this.tryGetToken(CParser.While, 0); }
	public LeftParen(): TerminalNode { return this.getToken(CParser.LeftParen, 0); }
	public expression(): ExpressionContext | undefined {
		return this.tryGetRuleContext(0, ExpressionContext);
	}
	public RightParen(): TerminalNode { return this.getToken(CParser.RightParen, 0); }
	public statement(): StatementContext {
		return this.getRuleContext(0, StatementContext);
	}
	public Do(): TerminalNode | undefined { return this.tryGetToken(CParser.Do, 0); }
	public Semi(): TerminalNode | undefined { return this.tryGetToken(CParser.Semi, 0); }
	public For(): TerminalNode | undefined { return this.tryGetToken(CParser.For, 0); }
	public forCondition(): ForConditionContext | undefined {
		return this.tryGetRuleContext(0, ForConditionContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CParser.RULE_iterationStatement; }
	// @Override
	public enterRule(listener: CListener): void {
		if (listener.enterIterationStatement) {
			listener.enterIterationStatement(this);
		}
	}
	// @Override
	public exitRule(listener: CListener): void {
		if (listener.exitIterationStatement) {
			listener.exitIterationStatement(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CVisitor<Result>): Result {
		if (visitor.visitIterationStatement) {
			return visitor.visitIterationStatement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ForConditionContext extends ParserRuleContext {
	public Semi(): TerminalNode[];
	public Semi(i: number): TerminalNode;
	public Semi(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(CParser.Semi);
		} else {
			return this.getToken(CParser.Semi, i);
		}
	}
	public forDeclaration(): ForDeclarationContext | undefined {
		return this.tryGetRuleContext(0, ForDeclarationContext);
	}
	public forExpression(): ForExpressionContext[];
	public forExpression(i: number): ForExpressionContext;
	public forExpression(i?: number): ForExpressionContext | ForExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ForExpressionContext);
		} else {
			return this.getRuleContext(i, ForExpressionContext);
		}
	}
	public expression(): ExpressionContext | undefined {
		return this.tryGetRuleContext(0, ExpressionContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CParser.RULE_forCondition; }
	// @Override
	public enterRule(listener: CListener): void {
		if (listener.enterForCondition) {
			listener.enterForCondition(this);
		}
	}
	// @Override
	public exitRule(listener: CListener): void {
		if (listener.exitForCondition) {
			listener.exitForCondition(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CVisitor<Result>): Result {
		if (visitor.visitForCondition) {
			return visitor.visitForCondition(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ForDeclarationContext extends ParserRuleContext {
	public declarationSpecifiers(): DeclarationSpecifiersContext {
		return this.getRuleContext(0, DeclarationSpecifiersContext);
	}
	public initDeclaratorList(): InitDeclaratorListContext | undefined {
		return this.tryGetRuleContext(0, InitDeclaratorListContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CParser.RULE_forDeclaration; }
	// @Override
	public enterRule(listener: CListener): void {
		if (listener.enterForDeclaration) {
			listener.enterForDeclaration(this);
		}
	}
	// @Override
	public exitRule(listener: CListener): void {
		if (listener.exitForDeclaration) {
			listener.exitForDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CVisitor<Result>): Result {
		if (visitor.visitForDeclaration) {
			return visitor.visitForDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ForExpressionContext extends ParserRuleContext {
	public assignmentExpression(): AssignmentExpressionContext[];
	public assignmentExpression(i: number): AssignmentExpressionContext;
	public assignmentExpression(i?: number): AssignmentExpressionContext | AssignmentExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(AssignmentExpressionContext);
		} else {
			return this.getRuleContext(i, AssignmentExpressionContext);
		}
	}
	public Comma(): TerminalNode[];
	public Comma(i: number): TerminalNode;
	public Comma(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(CParser.Comma);
		} else {
			return this.getToken(CParser.Comma, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CParser.RULE_forExpression; }
	// @Override
	public enterRule(listener: CListener): void {
		if (listener.enterForExpression) {
			listener.enterForExpression(this);
		}
	}
	// @Override
	public exitRule(listener: CListener): void {
		if (listener.exitForExpression) {
			listener.exitForExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CVisitor<Result>): Result {
		if (visitor.visitForExpression) {
			return visitor.visitForExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class JumpStatementContext extends ParserRuleContext {
	public Semi(): TerminalNode { return this.getToken(CParser.Semi, 0); }
	public Goto(): TerminalNode | undefined { return this.tryGetToken(CParser.Goto, 0); }
	public Identifier(): TerminalNode | undefined { return this.tryGetToken(CParser.Identifier, 0); }
	public Return(): TerminalNode | undefined { return this.tryGetToken(CParser.Return, 0); }
	public unaryExpression(): UnaryExpressionContext | undefined {
		return this.tryGetRuleContext(0, UnaryExpressionContext);
	}
	public Continue(): TerminalNode | undefined { return this.tryGetToken(CParser.Continue, 0); }
	public Break(): TerminalNode | undefined { return this.tryGetToken(CParser.Break, 0); }
	public expression(): ExpressionContext | undefined {
		return this.tryGetRuleContext(0, ExpressionContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CParser.RULE_jumpStatement; }
	// @Override
	public enterRule(listener: CListener): void {
		if (listener.enterJumpStatement) {
			listener.enterJumpStatement(this);
		}
	}
	// @Override
	public exitRule(listener: CListener): void {
		if (listener.exitJumpStatement) {
			listener.exitJumpStatement(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CVisitor<Result>): Result {
		if (visitor.visitJumpStatement) {
			return visitor.visitJumpStatement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class CompilationUnitContext extends ParserRuleContext {
	public EOF(): TerminalNode { return this.getToken(CParser.EOF, 0); }
	public translationUnit(): TranslationUnitContext | undefined {
		return this.tryGetRuleContext(0, TranslationUnitContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CParser.RULE_compilationUnit; }
	// @Override
	public enterRule(listener: CListener): void {
		if (listener.enterCompilationUnit) {
			listener.enterCompilationUnit(this);
		}
	}
	// @Override
	public exitRule(listener: CListener): void {
		if (listener.exitCompilationUnit) {
			listener.exitCompilationUnit(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CVisitor<Result>): Result {
		if (visitor.visitCompilationUnit) {
			return visitor.visitCompilationUnit(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TranslationUnitContext extends ParserRuleContext {
	public externalDeclaration(): ExternalDeclarationContext[];
	public externalDeclaration(i: number): ExternalDeclarationContext;
	public externalDeclaration(i?: number): ExternalDeclarationContext | ExternalDeclarationContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ExternalDeclarationContext);
		} else {
			return this.getRuleContext(i, ExternalDeclarationContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CParser.RULE_translationUnit; }
	// @Override
	public enterRule(listener: CListener): void {
		if (listener.enterTranslationUnit) {
			listener.enterTranslationUnit(this);
		}
	}
	// @Override
	public exitRule(listener: CListener): void {
		if (listener.exitTranslationUnit) {
			listener.exitTranslationUnit(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CVisitor<Result>): Result {
		if (visitor.visitTranslationUnit) {
			return visitor.visitTranslationUnit(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ExternalDeclarationContext extends ParserRuleContext {
	public functionDefinition(): FunctionDefinitionContext | undefined {
		return this.tryGetRuleContext(0, FunctionDefinitionContext);
	}
	public declaration(): DeclarationContext | undefined {
		return this.tryGetRuleContext(0, DeclarationContext);
	}
	public Semi(): TerminalNode | undefined { return this.tryGetToken(CParser.Semi, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CParser.RULE_externalDeclaration; }
	// @Override
	public enterRule(listener: CListener): void {
		if (listener.enterExternalDeclaration) {
			listener.enterExternalDeclaration(this);
		}
	}
	// @Override
	public exitRule(listener: CListener): void {
		if (listener.exitExternalDeclaration) {
			listener.exitExternalDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CVisitor<Result>): Result {
		if (visitor.visitExternalDeclaration) {
			return visitor.visitExternalDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class FunctionDefinitionContext extends ParserRuleContext {
	public declarator(): DeclaratorContext {
		return this.getRuleContext(0, DeclaratorContext);
	}
	public compoundStatement(): CompoundStatementContext {
		return this.getRuleContext(0, CompoundStatementContext);
	}
	public declarationSpecifiers(): DeclarationSpecifiersContext | undefined {
		return this.tryGetRuleContext(0, DeclarationSpecifiersContext);
	}
	public declarationList(): DeclarationListContext | undefined {
		return this.tryGetRuleContext(0, DeclarationListContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CParser.RULE_functionDefinition; }
	// @Override
	public enterRule(listener: CListener): void {
		if (listener.enterFunctionDefinition) {
			listener.enterFunctionDefinition(this);
		}
	}
	// @Override
	public exitRule(listener: CListener): void {
		if (listener.exitFunctionDefinition) {
			listener.exitFunctionDefinition(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CVisitor<Result>): Result {
		if (visitor.visitFunctionDefinition) {
			return visitor.visitFunctionDefinition(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class DeclarationListContext extends ParserRuleContext {
	public declaration(): DeclarationContext[];
	public declaration(i: number): DeclarationContext;
	public declaration(i?: number): DeclarationContext | DeclarationContext[] {
		if (i === undefined) {
			return this.getRuleContexts(DeclarationContext);
		} else {
			return this.getRuleContext(i, DeclarationContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CParser.RULE_declarationList; }
	// @Override
	public enterRule(listener: CListener): void {
		if (listener.enterDeclarationList) {
			listener.enterDeclarationList(this);
		}
	}
	// @Override
	public exitRule(listener: CListener): void {
		if (listener.exitDeclarationList) {
			listener.exitDeclarationList(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CVisitor<Result>): Result {
		if (visitor.visitDeclarationList) {
			return visitor.visitDeclarationList(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


