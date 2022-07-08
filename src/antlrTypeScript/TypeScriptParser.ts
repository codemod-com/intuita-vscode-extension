// Generated from /gppd/intuita/intuita-vscode-extension/src/antlrTypeScript/lexer/TypeScriptParser.g4 by ANTLR 4.9.0-SNAPSHOT


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

import { TypeScriptParserListener } from "./TypeScriptParserListener";
import { TypeScriptParserVisitor } from "./TypeScriptParserVisitor";
import {TypeScriptParserBase} from "./TypeScriptParserBase";


export class TypeScriptParser extends TypeScriptParserBase {
	public static readonly MultiLineComment = 1;
	public static readonly SingleLineComment = 2;
	public static readonly RegularExpressionLiteral = 3;
	public static readonly OpenBracket = 4;
	public static readonly CloseBracket = 5;
	public static readonly OpenParen = 6;
	public static readonly CloseParen = 7;
	public static readonly OpenBrace = 8;
	public static readonly TemplateCloseBrace = 9;
	public static readonly CloseBrace = 10;
	public static readonly SemiColon = 11;
	public static readonly Comma = 12;
	public static readonly Assign = 13;
	public static readonly QuestionMark = 14;
	public static readonly Colon = 15;
	public static readonly Ellipsis = 16;
	public static readonly Dot = 17;
	public static readonly PlusPlus = 18;
	public static readonly MinusMinus = 19;
	public static readonly Plus = 20;
	public static readonly Minus = 21;
	public static readonly BitNot = 22;
	public static readonly Not = 23;
	public static readonly Multiply = 24;
	public static readonly Divide = 25;
	public static readonly Modulus = 26;
	public static readonly RightShiftArithmetic = 27;
	public static readonly LeftShiftArithmetic = 28;
	public static readonly RightShiftLogical = 29;
	public static readonly LessThan = 30;
	public static readonly MoreThan = 31;
	public static readonly LessThanEquals = 32;
	public static readonly GreaterThanEquals = 33;
	public static readonly Equals_ = 34;
	public static readonly NotEquals = 35;
	public static readonly IdentityEquals = 36;
	public static readonly IdentityNotEquals = 37;
	public static readonly BitAnd = 38;
	public static readonly BitXOr = 39;
	public static readonly BitOr = 40;
	public static readonly And = 41;
	public static readonly Or = 42;
	public static readonly MultiplyAssign = 43;
	public static readonly DivideAssign = 44;
	public static readonly ModulusAssign = 45;
	public static readonly PlusAssign = 46;
	public static readonly MinusAssign = 47;
	public static readonly LeftShiftArithmeticAssign = 48;
	public static readonly RightShiftArithmeticAssign = 49;
	public static readonly RightShiftLogicalAssign = 50;
	public static readonly BitAndAssign = 51;
	public static readonly BitXorAssign = 52;
	public static readonly BitOrAssign = 53;
	public static readonly ARROW = 54;
	public static readonly NullLiteral = 55;
	public static readonly BooleanLiteral = 56;
	public static readonly DecimalLiteral = 57;
	public static readonly HexIntegerLiteral = 58;
	public static readonly OctalIntegerLiteral = 59;
	public static readonly OctalIntegerLiteral2 = 60;
	public static readonly BinaryIntegerLiteral = 61;
	public static readonly Break = 62;
	public static readonly Do = 63;
	public static readonly Instanceof = 64;
	public static readonly Typeof = 65;
	public static readonly Case = 66;
	public static readonly Else = 67;
	public static readonly New = 68;
	public static readonly Var = 69;
	public static readonly Catch = 70;
	public static readonly Finally = 71;
	public static readonly Return = 72;
	public static readonly Void = 73;
	public static readonly Continue = 74;
	public static readonly For = 75;
	public static readonly Switch = 76;
	public static readonly While = 77;
	public static readonly Debugger = 78;
	public static readonly Function_ = 79;
	public static readonly This = 80;
	public static readonly With = 81;
	public static readonly Default = 82;
	public static readonly If = 83;
	public static readonly Throw = 84;
	public static readonly Delete = 85;
	public static readonly In = 86;
	public static readonly Try = 87;
	public static readonly As = 88;
	public static readonly From = 89;
	public static readonly ReadOnly = 90;
	public static readonly Async = 91;
	public static readonly Class = 92;
	public static readonly Enum = 93;
	public static readonly Extends = 94;
	public static readonly Super = 95;
	public static readonly Const = 96;
	public static readonly Export = 97;
	public static readonly Import = 98;
	public static readonly Implements = 99;
	public static readonly Let = 100;
	public static readonly Private = 101;
	public static readonly Public = 102;
	public static readonly Interface = 103;
	public static readonly Package = 104;
	public static readonly Protected = 105;
	public static readonly Static = 106;
	public static readonly Yield = 107;
	public static readonly Any = 108;
	public static readonly Number = 109;
	public static readonly Boolean = 110;
	public static readonly String = 111;
	public static readonly Symbol = 112;
	public static readonly TypeAlias = 113;
	public static readonly Get = 114;
	public static readonly Set = 115;
	public static readonly Constructor = 116;
	public static readonly Namespace = 117;
	public static readonly Require = 118;
	public static readonly Module = 119;
	public static readonly Declare = 120;
	public static readonly Abstract = 121;
	public static readonly Is = 122;
	public static readonly At = 123;
	public static readonly Identifier = 124;
	public static readonly StringLiteral = 125;
	public static readonly BackTick = 126;
	public static readonly WhiteSpaces = 127;
	public static readonly LineTerminator = 128;
	public static readonly HtmlComment = 129;
	public static readonly CDataComment = 130;
	public static readonly UnexpectedCharacter = 131;
	public static readonly TemplateStringStartExpression = 132;
	public static readonly TemplateStringAtom = 133;
	public static readonly RULE_initializer = 0;
	public static readonly RULE_bindingPattern = 1;
	public static readonly RULE_typeParameters = 2;
	public static readonly RULE_typeParameterList = 3;
	public static readonly RULE_typeParameter = 4;
	public static readonly RULE_constraint = 5;
	public static readonly RULE_typeArguments = 6;
	public static readonly RULE_typeArgumentList = 7;
	public static readonly RULE_typeArgument = 8;
	public static readonly RULE_type_ = 9;
	public static readonly RULE_unionOrIntersectionOrPrimaryType = 10;
	public static readonly RULE_primaryType = 11;
	public static readonly RULE_predefinedType = 12;
	public static readonly RULE_typeReference = 13;
	public static readonly RULE_nestedTypeGeneric = 14;
	public static readonly RULE_typeGeneric = 15;
	public static readonly RULE_typeIncludeGeneric = 16;
	public static readonly RULE_typeName = 17;
	public static readonly RULE_objectType = 18;
	public static readonly RULE_typeBody = 19;
	public static readonly RULE_typeMemberList = 20;
	public static readonly RULE_typeMember = 21;
	public static readonly RULE_arrayType = 22;
	public static readonly RULE_tupleType = 23;
	public static readonly RULE_tupleElementTypes = 24;
	public static readonly RULE_functionType = 25;
	public static readonly RULE_constructorType = 26;
	public static readonly RULE_typeQuery = 27;
	public static readonly RULE_typeQueryExpression = 28;
	public static readonly RULE_propertySignatur = 29;
	public static readonly RULE_typeAnnotation = 30;
	public static readonly RULE_callSignature = 31;
	public static readonly RULE_parameterList = 32;
	public static readonly RULE_requiredParameterList = 33;
	public static readonly RULE_parameter = 34;
	public static readonly RULE_optionalParameter = 35;
	public static readonly RULE_restParameter = 36;
	public static readonly RULE_requiredParameter = 37;
	public static readonly RULE_accessibilityModifier = 38;
	public static readonly RULE_identifierOrPattern = 39;
	public static readonly RULE_constructSignature = 40;
	public static readonly RULE_indexSignature = 41;
	public static readonly RULE_methodSignature = 42;
	public static readonly RULE_typeAliasDeclaration = 43;
	public static readonly RULE_constructorDeclaration = 44;
	public static readonly RULE_interfaceDeclaration = 45;
	public static readonly RULE_interfaceExtendsClause = 46;
	public static readonly RULE_classOrInterfaceTypeList = 47;
	public static readonly RULE_enumDeclaration = 48;
	public static readonly RULE_enumBody = 49;
	public static readonly RULE_enumMemberList = 50;
	public static readonly RULE_enumMember = 51;
	public static readonly RULE_namespaceDeclaration = 52;
	public static readonly RULE_namespaceName = 53;
	public static readonly RULE_importAliasDeclaration = 54;
	public static readonly RULE_decoratorList = 55;
	public static readonly RULE_decorator = 56;
	public static readonly RULE_decoratorMemberExpression = 57;
	public static readonly RULE_decoratorCallExpression = 58;
	public static readonly RULE_program = 59;
	public static readonly RULE_sourceElement = 60;
	public static readonly RULE_statement = 61;
	public static readonly RULE_block = 62;
	public static readonly RULE_statementList = 63;
	public static readonly RULE_abstractDeclaration = 64;
	public static readonly RULE_importStatement = 65;
	public static readonly RULE_fromBlock = 66;
	public static readonly RULE_multipleImportStatement = 67;
	public static readonly RULE_exportStatement = 68;
	public static readonly RULE_variableStatement = 69;
	public static readonly RULE_variableDeclarationList = 70;
	public static readonly RULE_variableDeclaration = 71;
	public static readonly RULE_emptyStatement_ = 72;
	public static readonly RULE_expressionStatement = 73;
	public static readonly RULE_ifStatement = 74;
	public static readonly RULE_iterationStatement = 75;
	public static readonly RULE_varModifier = 76;
	public static readonly RULE_continueStatement = 77;
	public static readonly RULE_breakStatement = 78;
	public static readonly RULE_returnStatement = 79;
	public static readonly RULE_yieldStatement = 80;
	public static readonly RULE_withStatement = 81;
	public static readonly RULE_switchStatement = 82;
	public static readonly RULE_caseBlock = 83;
	public static readonly RULE_caseClauses = 84;
	public static readonly RULE_caseClause = 85;
	public static readonly RULE_defaultClause = 86;
	public static readonly RULE_labelledStatement = 87;
	public static readonly RULE_throwStatement = 88;
	public static readonly RULE_tryStatement = 89;
	public static readonly RULE_catchProduction = 90;
	public static readonly RULE_finallyProduction = 91;
	public static readonly RULE_debuggerStatement = 92;
	public static readonly RULE_functionDeclaration = 93;
	public static readonly RULE_classDeclaration = 94;
	public static readonly RULE_classHeritage = 95;
	public static readonly RULE_classTail = 96;
	public static readonly RULE_classExtendsClause = 97;
	public static readonly RULE_implementsClause = 98;
	public static readonly RULE_classElement = 99;
	public static readonly RULE_propertyMemberDeclaration = 100;
	public static readonly RULE_propertyMemberBase = 101;
	public static readonly RULE_indexMemberDeclaration = 102;
	public static readonly RULE_generatorMethod = 103;
	public static readonly RULE_generatorFunctionDeclaration = 104;
	public static readonly RULE_generatorBlock = 105;
	public static readonly RULE_generatorDefinition = 106;
	public static readonly RULE_iteratorBlock = 107;
	public static readonly RULE_iteratorDefinition = 108;
	public static readonly RULE_formalParameterList = 109;
	public static readonly RULE_formalParameterArg = 110;
	public static readonly RULE_lastFormalParameterArg = 111;
	public static readonly RULE_functionBody = 112;
	public static readonly RULE_sourceElements = 113;
	public static readonly RULE_arrayLiteral = 114;
	public static readonly RULE_elementList = 115;
	public static readonly RULE_arrayElement = 116;
	public static readonly RULE_objectLiteral = 117;
	public static readonly RULE_propertyAssignment = 118;
	public static readonly RULE_getAccessor = 119;
	public static readonly RULE_setAccessor = 120;
	public static readonly RULE_propertyName = 121;
	public static readonly RULE_arguments = 122;
	public static readonly RULE_argumentList = 123;
	public static readonly RULE_argument = 124;
	public static readonly RULE_expressionSequence = 125;
	public static readonly RULE_functionExpressionDeclaration = 126;
	public static readonly RULE_singleExpression = 127;
	public static readonly RULE_asExpression = 128;
	public static readonly RULE_arrowFunctionDeclaration = 129;
	public static readonly RULE_arrowFunctionParameters = 130;
	public static readonly RULE_arrowFunctionBody = 131;
	public static readonly RULE_assignmentOperator = 132;
	public static readonly RULE_literal = 133;
	public static readonly RULE_templateStringLiteral = 134;
	public static readonly RULE_templateStringAtom = 135;
	public static readonly RULE_numericLiteral = 136;
	public static readonly RULE_identifierName = 137;
	public static readonly RULE_identifierOrKeyWord = 138;
	public static readonly RULE_reservedWord = 139;
	public static readonly RULE_keyword = 140;
	public static readonly RULE_getter = 141;
	public static readonly RULE_setter = 142;
	public static readonly RULE_eos = 143;
	// tslint:disable:no-trailing-whitespace
	public static readonly ruleNames: string[] = [
		"initializer", "bindingPattern", "typeParameters", "typeParameterList", 
		"typeParameter", "constraint", "typeArguments", "typeArgumentList", "typeArgument", 
		"type_", "unionOrIntersectionOrPrimaryType", "primaryType", "predefinedType", 
		"typeReference", "nestedTypeGeneric", "typeGeneric", "typeIncludeGeneric", 
		"typeName", "objectType", "typeBody", "typeMemberList", "typeMember", 
		"arrayType", "tupleType", "tupleElementTypes", "functionType", "constructorType", 
		"typeQuery", "typeQueryExpression", "propertySignatur", "typeAnnotation", 
		"callSignature", "parameterList", "requiredParameterList", "parameter", 
		"optionalParameter", "restParameter", "requiredParameter", "accessibilityModifier", 
		"identifierOrPattern", "constructSignature", "indexSignature", "methodSignature", 
		"typeAliasDeclaration", "constructorDeclaration", "interfaceDeclaration", 
		"interfaceExtendsClause", "classOrInterfaceTypeList", "enumDeclaration", 
		"enumBody", "enumMemberList", "enumMember", "namespaceDeclaration", "namespaceName", 
		"importAliasDeclaration", "decoratorList", "decorator", "decoratorMemberExpression", 
		"decoratorCallExpression", "program", "sourceElement", "statement", "block", 
		"statementList", "abstractDeclaration", "importStatement", "fromBlock", 
		"multipleImportStatement", "exportStatement", "variableStatement", "variableDeclarationList", 
		"variableDeclaration", "emptyStatement_", "expressionStatement", "ifStatement", 
		"iterationStatement", "varModifier", "continueStatement", "breakStatement", 
		"returnStatement", "yieldStatement", "withStatement", "switchStatement", 
		"caseBlock", "caseClauses", "caseClause", "defaultClause", "labelledStatement", 
		"throwStatement", "tryStatement", "catchProduction", "finallyProduction", 
		"debuggerStatement", "functionDeclaration", "classDeclaration", "classHeritage", 
		"classTail", "classExtendsClause", "implementsClause", "classElement", 
		"propertyMemberDeclaration", "propertyMemberBase", "indexMemberDeclaration", 
		"generatorMethod", "generatorFunctionDeclaration", "generatorBlock", "generatorDefinition", 
		"iteratorBlock", "iteratorDefinition", "formalParameterList", "formalParameterArg", 
		"lastFormalParameterArg", "functionBody", "sourceElements", "arrayLiteral", 
		"elementList", "arrayElement", "objectLiteral", "propertyAssignment", 
		"getAccessor", "setAccessor", "propertyName", "arguments", "argumentList", 
		"argument", "expressionSequence", "functionExpressionDeclaration", "singleExpression", 
		"asExpression", "arrowFunctionDeclaration", "arrowFunctionParameters", 
		"arrowFunctionBody", "assignmentOperator", "literal", "templateStringLiteral", 
		"templateStringAtom", "numericLiteral", "identifierName", "identifierOrKeyWord", 
		"reservedWord", "keyword", "getter", "setter", "eos",
	];

	private static readonly _LITERAL_NAMES: Array<string | undefined> = [
		undefined, undefined, undefined, undefined, "'['", "']'", "'('", "')'", 
		"'{'", undefined, "'}'", "';'", "','", "'='", "'?'", "':'", "'...'", "'.'", 
		"'++'", "'--'", "'+'", "'-'", "'~'", "'!'", "'*'", "'/'", "'%'", "'>>'", 
		"'<<'", "'>>>'", "'<'", "'>'", "'<='", "'>='", "'=='", "'!='", "'==='", 
		"'!=='", "'&'", "'^'", "'|'", "'&&'", "'||'", "'*='", "'/='", "'%='", 
		"'+='", "'-='", "'<<='", "'>>='", "'>>>='", "'&='", "'^='", "'|='", "'=>'", 
		"'null'", undefined, undefined, undefined, undefined, undefined, undefined, 
		"'break'", "'do'", "'instanceof'", "'typeof'", "'case'", "'else'", "'new'", 
		"'var'", "'catch'", "'finally'", "'return'", "'void'", "'continue'", "'for'", 
		"'switch'", "'while'", "'debugger'", "'function'", "'this'", "'with'", 
		"'default'", "'if'", "'throw'", "'delete'", "'in'", "'try'", "'as'", "'from'", 
		"'readonly'", "'async'", "'class'", "'enum'", "'extends'", "'super'", 
		"'const'", "'export'", "'import'", "'implements'", "'let'", "'private'", 
		"'public'", "'interface'", "'package'", "'protected'", "'static'", "'yield'", 
		"'any'", "'number'", "'boolean'", "'string'", "'symbol'", "'type'", "'get'", 
		"'set'", "'constructor'", "'namespace'", "'require'", "'module'", "'declare'", 
		"'abstract'", "'is'", "'@'", undefined, undefined, undefined, undefined, 
		undefined, undefined, undefined, undefined, "'${'",
	];
	private static readonly _SYMBOLIC_NAMES: Array<string | undefined> = [
		undefined, "MultiLineComment", "SingleLineComment", "RegularExpressionLiteral", 
		"OpenBracket", "CloseBracket", "OpenParen", "CloseParen", "OpenBrace", 
		"TemplateCloseBrace", "CloseBrace", "SemiColon", "Comma", "Assign", "QuestionMark", 
		"Colon", "Ellipsis", "Dot", "PlusPlus", "MinusMinus", "Plus", "Minus", 
		"BitNot", "Not", "Multiply", "Divide", "Modulus", "RightShiftArithmetic", 
		"LeftShiftArithmetic", "RightShiftLogical", "LessThan", "MoreThan", "LessThanEquals", 
		"GreaterThanEquals", "Equals_", "NotEquals", "IdentityEquals", "IdentityNotEquals", 
		"BitAnd", "BitXOr", "BitOr", "And", "Or", "MultiplyAssign", "DivideAssign", 
		"ModulusAssign", "PlusAssign", "MinusAssign", "LeftShiftArithmeticAssign", 
		"RightShiftArithmeticAssign", "RightShiftLogicalAssign", "BitAndAssign", 
		"BitXorAssign", "BitOrAssign", "ARROW", "NullLiteral", "BooleanLiteral", 
		"DecimalLiteral", "HexIntegerLiteral", "OctalIntegerLiteral", "OctalIntegerLiteral2", 
		"BinaryIntegerLiteral", "Break", "Do", "Instanceof", "Typeof", "Case", 
		"Else", "New", "Var", "Catch", "Finally", "Return", "Void", "Continue", 
		"For", "Switch", "While", "Debugger", "Function_", "This", "With", "Default", 
		"If", "Throw", "Delete", "In", "Try", "As", "From", "ReadOnly", "Async", 
		"Class", "Enum", "Extends", "Super", "Const", "Export", "Import", "Implements", 
		"Let", "Private", "Public", "Interface", "Package", "Protected", "Static", 
		"Yield", "Any", "Number", "Boolean", "String", "Symbol", "TypeAlias", 
		"Get", "Set", "Constructor", "Namespace", "Require", "Module", "Declare", 
		"Abstract", "Is", "At", "Identifier", "StringLiteral", "BackTick", "WhiteSpaces", 
		"LineTerminator", "HtmlComment", "CDataComment", "UnexpectedCharacter", 
		"TemplateStringStartExpression", "TemplateStringAtom",
	];
	public static readonly VOCABULARY: Vocabulary = new VocabularyImpl(TypeScriptParser._LITERAL_NAMES, TypeScriptParser._SYMBOLIC_NAMES, []);

	// @Override
	// @NotNull
	public get vocabulary(): Vocabulary {
		return TypeScriptParser.VOCABULARY;
	}
	// tslint:enable:no-trailing-whitespace

	// @Override
	public get grammarFileName(): string { return "TypeScriptParser.g4"; }

	// @Override
	public get ruleNames(): string[] { return TypeScriptParser.ruleNames; }

	// @Override
	public get serializedATN(): string { return TypeScriptParser._serializedATN; }

	protected createFailedPredicateException(predicate?: string, message?: string): FailedPredicateException {
		return new FailedPredicateException(this, predicate, message);
	}

	constructor(input: TokenStream) {
		super(input);
		this._interp = new ParserATNSimulator(TypeScriptParser._ATN, this);
	}
	// @RuleVersion(0)
	public initializer(): InitializerContext {
		let _localctx: InitializerContext = new InitializerContext(this._ctx, this.state);
		this.enterRule(_localctx, 0, TypeScriptParser.RULE_initializer);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 288;
			this.match(TypeScriptParser.Assign);
			this.state = 289;
			this.singleExpression(0);
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
	public bindingPattern(): BindingPatternContext {
		let _localctx: BindingPatternContext = new BindingPatternContext(this._ctx, this.state);
		this.enterRule(_localctx, 2, TypeScriptParser.RULE_bindingPattern);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 293;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case TypeScriptParser.OpenBracket:
				{
				this.state = 291;
				this.arrayLiteral();
				}
				break;
			case TypeScriptParser.OpenBrace:
				{
				this.state = 292;
				this.objectLiteral();
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
	public typeParameters(): TypeParametersContext {
		let _localctx: TypeParametersContext = new TypeParametersContext(this._ctx, this.state);
		this.enterRule(_localctx, 4, TypeScriptParser.RULE_typeParameters);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 295;
			this.match(TypeScriptParser.LessThan);
			this.state = 297;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === TypeScriptParser.LessThan || _la === TypeScriptParser.Identifier) {
				{
				this.state = 296;
				this.typeParameterList();
				}
			}

			this.state = 299;
			this.match(TypeScriptParser.MoreThan);
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
	public typeParameterList(): TypeParameterListContext {
		let _localctx: TypeParameterListContext = new TypeParameterListContext(this._ctx, this.state);
		this.enterRule(_localctx, 6, TypeScriptParser.RULE_typeParameterList);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 301;
			this.typeParameter();
			this.state = 306;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === TypeScriptParser.Comma) {
				{
				{
				this.state = 302;
				this.match(TypeScriptParser.Comma);
				this.state = 303;
				this.typeParameter();
				}
				}
				this.state = 308;
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
	public typeParameter(): TypeParameterContext {
		let _localctx: TypeParameterContext = new TypeParameterContext(this._ctx, this.state);
		this.enterRule(_localctx, 8, TypeScriptParser.RULE_typeParameter);
		let _la: number;
		try {
			this.state = 314;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case TypeScriptParser.Identifier:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 309;
				this.match(TypeScriptParser.Identifier);
				this.state = 311;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === TypeScriptParser.Extends) {
					{
					this.state = 310;
					this.constraint();
					}
				}

				}
				break;
			case TypeScriptParser.LessThan:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 313;
				this.typeParameters();
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
	public constraint(): ConstraintContext {
		let _localctx: ConstraintContext = new ConstraintContext(this._ctx, this.state);
		this.enterRule(_localctx, 10, TypeScriptParser.RULE_constraint);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 316;
			this.match(TypeScriptParser.Extends);
			this.state = 317;
			this.type_();
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
	public typeArguments(): TypeArgumentsContext {
		let _localctx: TypeArgumentsContext = new TypeArgumentsContext(this._ctx, this.state);
		this.enterRule(_localctx, 12, TypeScriptParser.RULE_typeArguments);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 319;
			this.match(TypeScriptParser.LessThan);
			this.state = 321;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << TypeScriptParser.OpenBracket) | (1 << TypeScriptParser.OpenParen) | (1 << TypeScriptParser.OpenBrace) | (1 << TypeScriptParser.LessThan))) !== 0) || ((((_la - 65)) & ~0x1F) === 0 && ((1 << (_la - 65)) & ((1 << (TypeScriptParser.Typeof - 65)) | (1 << (TypeScriptParser.New - 65)) | (1 << (TypeScriptParser.Void - 65)) | (1 << (TypeScriptParser.This - 65)))) !== 0) || ((((_la - 108)) & ~0x1F) === 0 && ((1 << (_la - 108)) & ((1 << (TypeScriptParser.Any - 108)) | (1 << (TypeScriptParser.Number - 108)) | (1 << (TypeScriptParser.Boolean - 108)) | (1 << (TypeScriptParser.String - 108)) | (1 << (TypeScriptParser.Symbol - 108)) | (1 << (TypeScriptParser.Identifier - 108)) | (1 << (TypeScriptParser.StringLiteral - 108)))) !== 0)) {
				{
				this.state = 320;
				this.typeArgumentList();
				}
			}

			this.state = 323;
			this.match(TypeScriptParser.MoreThan);
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
	public typeArgumentList(): TypeArgumentListContext {
		let _localctx: TypeArgumentListContext = new TypeArgumentListContext(this._ctx, this.state);
		this.enterRule(_localctx, 14, TypeScriptParser.RULE_typeArgumentList);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 325;
			this.typeArgument();
			this.state = 330;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === TypeScriptParser.Comma) {
				{
				{
				this.state = 326;
				this.match(TypeScriptParser.Comma);
				this.state = 327;
				this.typeArgument();
				}
				}
				this.state = 332;
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
	public typeArgument(): TypeArgumentContext {
		let _localctx: TypeArgumentContext = new TypeArgumentContext(this._ctx, this.state);
		this.enterRule(_localctx, 16, TypeScriptParser.RULE_typeArgument);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 333;
			this.type_();
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
	public type_(): Type_Context {
		let _localctx: Type_Context = new Type_Context(this._ctx, this.state);
		this.enterRule(_localctx, 18, TypeScriptParser.RULE_type_);
		try {
			this.state = 340;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 7, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 335;
				this.unionOrIntersectionOrPrimaryType(0);
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 336;
				this.functionType();
				}
				break;

			case 3:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 337;
				this.constructorType();
				}
				break;

			case 4:
				this.enterOuterAlt(_localctx, 4);
				{
				this.state = 338;
				this.typeGeneric();
				}
				break;

			case 5:
				this.enterOuterAlt(_localctx, 5);
				{
				this.state = 339;
				this.match(TypeScriptParser.StringLiteral);
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

	public unionOrIntersectionOrPrimaryType(): UnionOrIntersectionOrPrimaryTypeContext;
	public unionOrIntersectionOrPrimaryType(_p: number): UnionOrIntersectionOrPrimaryTypeContext;
	// @RuleVersion(0)
	public unionOrIntersectionOrPrimaryType(_p?: number): UnionOrIntersectionOrPrimaryTypeContext {
		if (_p === undefined) {
			_p = 0;
		}

		let _parentctx: ParserRuleContext = this._ctx;
		let _parentState: number = this.state;
		let _localctx: UnionOrIntersectionOrPrimaryTypeContext = new UnionOrIntersectionOrPrimaryTypeContext(this._ctx, _parentState);
		let _prevctx: UnionOrIntersectionOrPrimaryTypeContext = _localctx;
		let _startState: number = 20;
		this.enterRecursionRule(_localctx, 20, TypeScriptParser.RULE_unionOrIntersectionOrPrimaryType, _p);
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			{
			_localctx = new PrimaryContext(_localctx);
			this._ctx = _localctx;
			_prevctx = _localctx;

			this.state = 343;
			this.primaryType(0);
			}
			this._ctx._stop = this._input.tryLT(-1);
			this.state = 353;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 9, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					if (this._parseListeners != null) {
						this.triggerExitRuleEvent();
					}
					_prevctx = _localctx;
					{
					this.state = 351;
					this._errHandler.sync(this);
					switch ( this.interpreter.adaptivePredict(this._input, 8, this._ctx) ) {
					case 1:
						{
						_localctx = new UnionContext(new UnionOrIntersectionOrPrimaryTypeContext(_parentctx, _parentState));
						this.pushNewRecursionContext(_localctx, _startState, TypeScriptParser.RULE_unionOrIntersectionOrPrimaryType);
						this.state = 345;
						if (!(this.precpred(this._ctx, 3))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 3)");
						}
						this.state = 346;
						this.match(TypeScriptParser.BitOr);
						this.state = 347;
						this.unionOrIntersectionOrPrimaryType(4);
						}
						break;

					case 2:
						{
						_localctx = new IntersectionContext(new UnionOrIntersectionOrPrimaryTypeContext(_parentctx, _parentState));
						this.pushNewRecursionContext(_localctx, _startState, TypeScriptParser.RULE_unionOrIntersectionOrPrimaryType);
						this.state = 348;
						if (!(this.precpred(this._ctx, 2))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 2)");
						}
						this.state = 349;
						this.match(TypeScriptParser.BitAnd);
						this.state = 350;
						this.unionOrIntersectionOrPrimaryType(3);
						}
						break;
					}
					}
				}
				this.state = 355;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 9, this._ctx);
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

	public primaryType(): PrimaryTypeContext;
	public primaryType(_p: number): PrimaryTypeContext;
	// @RuleVersion(0)
	public primaryType(_p?: number): PrimaryTypeContext {
		if (_p === undefined) {
			_p = 0;
		}

		let _parentctx: ParserRuleContext = this._ctx;
		let _parentState: number = this.state;
		let _localctx: PrimaryTypeContext = new PrimaryTypeContext(this._ctx, _parentState);
		let _prevctx: PrimaryTypeContext = _localctx;
		let _startState: number = 22;
		this.enterRecursionRule(_localctx, 22, TypeScriptParser.RULE_primaryType, _p);
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 374;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 10, this._ctx) ) {
			case 1:
				{
				_localctx = new ParenthesizedPrimTypeContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;

				this.state = 357;
				this.match(TypeScriptParser.OpenParen);
				this.state = 358;
				this.type_();
				this.state = 359;
				this.match(TypeScriptParser.CloseParen);
				}
				break;

			case 2:
				{
				_localctx = new PredefinedPrimTypeContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 361;
				this.predefinedType();
				}
				break;

			case 3:
				{
				_localctx = new ReferencePrimTypeContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 362;
				this.typeReference();
				}
				break;

			case 4:
				{
				_localctx = new ObjectPrimTypeContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 363;
				this.objectType();
				}
				break;

			case 5:
				{
				_localctx = new TuplePrimTypeContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 364;
				this.match(TypeScriptParser.OpenBracket);
				this.state = 365;
				this.tupleElementTypes();
				this.state = 366;
				this.match(TypeScriptParser.CloseBracket);
				}
				break;

			case 6:
				{
				_localctx = new QueryPrimTypeContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 368;
				this.typeQuery();
				}
				break;

			case 7:
				{
				_localctx = new ThisPrimTypeContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 369;
				this.match(TypeScriptParser.This);
				}
				break;

			case 8:
				{
				_localctx = new RedefinitionOfTypeContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 370;
				this.typeReference();
				this.state = 371;
				this.match(TypeScriptParser.Is);
				this.state = 372;
				this.primaryType(1);
				}
				break;
			}
			this._ctx._stop = this._input.tryLT(-1);
			this.state = 382;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 11, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					if (this._parseListeners != null) {
						this.triggerExitRuleEvent();
					}
					_prevctx = _localctx;
					{
					{
					_localctx = new ArrayPrimTypeContext(new PrimaryTypeContext(_parentctx, _parentState));
					this.pushNewRecursionContext(_localctx, _startState, TypeScriptParser.RULE_primaryType);
					this.state = 376;
					if (!(this.precpred(this._ctx, 5))) {
						throw this.createFailedPredicateException("this.precpred(this._ctx, 5)");
					}
					this.state = 377;
					if (!(this.notLineTerminator())) {
						throw this.createFailedPredicateException("notLineTerminator()");
					}
					this.state = 378;
					this.match(TypeScriptParser.OpenBracket);
					this.state = 379;
					this.match(TypeScriptParser.CloseBracket);
					}
					}
				}
				this.state = 384;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 11, this._ctx);
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
	public predefinedType(): PredefinedTypeContext {
		let _localctx: PredefinedTypeContext = new PredefinedTypeContext(this._ctx, this.state);
		this.enterRule(_localctx, 24, TypeScriptParser.RULE_predefinedType);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 385;
			_la = this._input.LA(1);
			if (!(_la === TypeScriptParser.Void || ((((_la - 108)) & ~0x1F) === 0 && ((1 << (_la - 108)) & ((1 << (TypeScriptParser.Any - 108)) | (1 << (TypeScriptParser.Number - 108)) | (1 << (TypeScriptParser.Boolean - 108)) | (1 << (TypeScriptParser.String - 108)) | (1 << (TypeScriptParser.Symbol - 108)))) !== 0))) {
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
	public typeReference(): TypeReferenceContext {
		let _localctx: TypeReferenceContext = new TypeReferenceContext(this._ctx, this.state);
		this.enterRule(_localctx, 26, TypeScriptParser.RULE_typeReference);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 387;
			this.typeName();
			this.state = 389;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 12, this._ctx) ) {
			case 1:
				{
				this.state = 388;
				this.nestedTypeGeneric();
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
	public nestedTypeGeneric(): NestedTypeGenericContext {
		let _localctx: NestedTypeGenericContext = new NestedTypeGenericContext(this._ctx, this.state);
		this.enterRule(_localctx, 28, TypeScriptParser.RULE_nestedTypeGeneric);
		try {
			this.state = 393;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 13, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 391;
				this.typeIncludeGeneric();
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 392;
				this.typeGeneric();
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
	public typeGeneric(): TypeGenericContext {
		let _localctx: TypeGenericContext = new TypeGenericContext(this._ctx, this.state);
		this.enterRule(_localctx, 30, TypeScriptParser.RULE_typeGeneric);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 395;
			this.match(TypeScriptParser.LessThan);
			this.state = 396;
			this.typeArgumentList();
			this.state = 397;
			this.match(TypeScriptParser.MoreThan);
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
	public typeIncludeGeneric(): TypeIncludeGenericContext {
		let _localctx: TypeIncludeGenericContext = new TypeIncludeGenericContext(this._ctx, this.state);
		this.enterRule(_localctx, 32, TypeScriptParser.RULE_typeIncludeGeneric);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 399;
			this.match(TypeScriptParser.LessThan);
			this.state = 400;
			this.typeArgumentList();
			this.state = 401;
			this.match(TypeScriptParser.LessThan);
			this.state = 402;
			this.typeArgumentList();
			this.state = 408;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case TypeScriptParser.MoreThan:
				{
				this.state = 403;
				this.match(TypeScriptParser.MoreThan);
				this.state = 404;
				this.bindingPattern();
				this.state = 405;
				this.match(TypeScriptParser.MoreThan);
				}
				break;
			case TypeScriptParser.RightShiftArithmetic:
				{
				this.state = 407;
				this.match(TypeScriptParser.RightShiftArithmetic);
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
	public typeName(): TypeNameContext {
		let _localctx: TypeNameContext = new TypeNameContext(this._ctx, this.state);
		this.enterRule(_localctx, 34, TypeScriptParser.RULE_typeName);
		try {
			this.state = 412;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 15, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 410;
				this.match(TypeScriptParser.Identifier);
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 411;
				this.namespaceName();
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
	public objectType(): ObjectTypeContext {
		let _localctx: ObjectTypeContext = new ObjectTypeContext(this._ctx, this.state);
		this.enterRule(_localctx, 36, TypeScriptParser.RULE_objectType);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 414;
			this.match(TypeScriptParser.OpenBrace);
			this.state = 416;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << TypeScriptParser.OpenBracket) | (1 << TypeScriptParser.OpenParen) | (1 << TypeScriptParser.LessThan))) !== 0) || ((((_la - 55)) & ~0x1F) === 0 && ((1 << (_la - 55)) & ((1 << (TypeScriptParser.NullLiteral - 55)) | (1 << (TypeScriptParser.BooleanLiteral - 55)) | (1 << (TypeScriptParser.DecimalLiteral - 55)) | (1 << (TypeScriptParser.HexIntegerLiteral - 55)) | (1 << (TypeScriptParser.OctalIntegerLiteral - 55)) | (1 << (TypeScriptParser.OctalIntegerLiteral2 - 55)) | (1 << (TypeScriptParser.BinaryIntegerLiteral - 55)) | (1 << (TypeScriptParser.Break - 55)) | (1 << (TypeScriptParser.Do - 55)) | (1 << (TypeScriptParser.Instanceof - 55)) | (1 << (TypeScriptParser.Typeof - 55)) | (1 << (TypeScriptParser.Case - 55)) | (1 << (TypeScriptParser.Else - 55)) | (1 << (TypeScriptParser.New - 55)) | (1 << (TypeScriptParser.Var - 55)) | (1 << (TypeScriptParser.Catch - 55)) | (1 << (TypeScriptParser.Finally - 55)) | (1 << (TypeScriptParser.Return - 55)) | (1 << (TypeScriptParser.Void - 55)) | (1 << (TypeScriptParser.Continue - 55)) | (1 << (TypeScriptParser.For - 55)) | (1 << (TypeScriptParser.Switch - 55)) | (1 << (TypeScriptParser.While - 55)) | (1 << (TypeScriptParser.Debugger - 55)) | (1 << (TypeScriptParser.Function_ - 55)) | (1 << (TypeScriptParser.This - 55)) | (1 << (TypeScriptParser.With - 55)) | (1 << (TypeScriptParser.Default - 55)) | (1 << (TypeScriptParser.If - 55)) | (1 << (TypeScriptParser.Throw - 55)) | (1 << (TypeScriptParser.Delete - 55)) | (1 << (TypeScriptParser.In - 55)))) !== 0) || ((((_la - 87)) & ~0x1F) === 0 && ((1 << (_la - 87)) & ((1 << (TypeScriptParser.Try - 87)) | (1 << (TypeScriptParser.From - 87)) | (1 << (TypeScriptParser.ReadOnly - 87)) | (1 << (TypeScriptParser.Async - 87)) | (1 << (TypeScriptParser.Class - 87)) | (1 << (TypeScriptParser.Enum - 87)) | (1 << (TypeScriptParser.Extends - 87)) | (1 << (TypeScriptParser.Super - 87)) | (1 << (TypeScriptParser.Const - 87)) | (1 << (TypeScriptParser.Export - 87)) | (1 << (TypeScriptParser.Import - 87)) | (1 << (TypeScriptParser.Implements - 87)) | (1 << (TypeScriptParser.Let - 87)) | (1 << (TypeScriptParser.Private - 87)) | (1 << (TypeScriptParser.Public - 87)) | (1 << (TypeScriptParser.Interface - 87)) | (1 << (TypeScriptParser.Package - 87)) | (1 << (TypeScriptParser.Protected - 87)) | (1 << (TypeScriptParser.Static - 87)) | (1 << (TypeScriptParser.Yield - 87)) | (1 << (TypeScriptParser.String - 87)) | (1 << (TypeScriptParser.TypeAlias - 87)) | (1 << (TypeScriptParser.Get - 87)) | (1 << (TypeScriptParser.Set - 87)) | (1 << (TypeScriptParser.Require - 87)))) !== 0) || _la === TypeScriptParser.Identifier || _la === TypeScriptParser.StringLiteral) {
				{
				this.state = 415;
				this.typeBody();
				}
			}

			this.state = 418;
			this.match(TypeScriptParser.CloseBrace);
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
	public typeBody(): TypeBodyContext {
		let _localctx: TypeBodyContext = new TypeBodyContext(this._ctx, this.state);
		this.enterRule(_localctx, 38, TypeScriptParser.RULE_typeBody);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 420;
			this.typeMemberList();
			this.state = 422;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === TypeScriptParser.SemiColon || _la === TypeScriptParser.Comma) {
				{
				this.state = 421;
				_la = this._input.LA(1);
				if (!(_la === TypeScriptParser.SemiColon || _la === TypeScriptParser.Comma)) {
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
	public typeMemberList(): TypeMemberListContext {
		let _localctx: TypeMemberListContext = new TypeMemberListContext(this._ctx, this.state);
		this.enterRule(_localctx, 40, TypeScriptParser.RULE_typeMemberList);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 424;
			this.typeMember();
			this.state = 429;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 18, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 425;
					_la = this._input.LA(1);
					if (!(_la === TypeScriptParser.SemiColon || _la === TypeScriptParser.Comma)) {
					this._errHandler.recoverInline(this);
					} else {
						if (this._input.LA(1) === Token.EOF) {
							this.matchedEOF = true;
						}

						this._errHandler.reportMatch(this);
						this.consume();
					}
					this.state = 426;
					this.typeMember();
					}
					}
				}
				this.state = 431;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 18, this._ctx);
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
	public typeMember(): TypeMemberContext {
		let _localctx: TypeMemberContext = new TypeMemberContext(this._ctx, this.state);
		this.enterRule(_localctx, 42, TypeScriptParser.RULE_typeMember);
		let _la: number;
		try {
			this.state = 441;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 20, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 432;
				this.propertySignatur();
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 433;
				this.callSignature();
				}
				break;

			case 3:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 434;
				this.constructSignature();
				}
				break;

			case 4:
				this.enterOuterAlt(_localctx, 4);
				{
				this.state = 435;
				this.indexSignature();
				}
				break;

			case 5:
				this.enterOuterAlt(_localctx, 5);
				{
				this.state = 436;
				this.methodSignature();
				this.state = 439;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === TypeScriptParser.ARROW) {
					{
					this.state = 437;
					this.match(TypeScriptParser.ARROW);
					this.state = 438;
					this.type_();
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
	public arrayType(): ArrayTypeContext {
		let _localctx: ArrayTypeContext = new ArrayTypeContext(this._ctx, this.state);
		this.enterRule(_localctx, 44, TypeScriptParser.RULE_arrayType);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 443;
			this.primaryType(0);
			this.state = 444;
			if (!(this.notLineTerminator())) {
				throw this.createFailedPredicateException("notLineTerminator()");
			}
			this.state = 445;
			this.match(TypeScriptParser.OpenBracket);
			this.state = 446;
			this.match(TypeScriptParser.CloseBracket);
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
	public tupleType(): TupleTypeContext {
		let _localctx: TupleTypeContext = new TupleTypeContext(this._ctx, this.state);
		this.enterRule(_localctx, 46, TypeScriptParser.RULE_tupleType);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 448;
			this.match(TypeScriptParser.OpenBracket);
			this.state = 449;
			this.tupleElementTypes();
			this.state = 450;
			this.match(TypeScriptParser.CloseBracket);
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
	public tupleElementTypes(): TupleElementTypesContext {
		let _localctx: TupleElementTypesContext = new TupleElementTypesContext(this._ctx, this.state);
		this.enterRule(_localctx, 48, TypeScriptParser.RULE_tupleElementTypes);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 452;
			this.type_();
			this.state = 457;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === TypeScriptParser.Comma) {
				{
				{
				this.state = 453;
				this.match(TypeScriptParser.Comma);
				this.state = 454;
				this.type_();
				}
				}
				this.state = 459;
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
	public functionType(): FunctionTypeContext {
		let _localctx: FunctionTypeContext = new FunctionTypeContext(this._ctx, this.state);
		this.enterRule(_localctx, 50, TypeScriptParser.RULE_functionType);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 461;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === TypeScriptParser.LessThan) {
				{
				this.state = 460;
				this.typeParameters();
				}
			}

			this.state = 463;
			this.match(TypeScriptParser.OpenParen);
			this.state = 465;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << TypeScriptParser.OpenBracket) | (1 << TypeScriptParser.OpenBrace) | (1 << TypeScriptParser.Ellipsis))) !== 0) || ((((_la - 55)) & ~0x1F) === 0 && ((1 << (_la - 55)) & ((1 << (TypeScriptParser.NullLiteral - 55)) | (1 << (TypeScriptParser.BooleanLiteral - 55)) | (1 << (TypeScriptParser.Break - 55)) | (1 << (TypeScriptParser.Do - 55)) | (1 << (TypeScriptParser.Instanceof - 55)) | (1 << (TypeScriptParser.Typeof - 55)) | (1 << (TypeScriptParser.Case - 55)) | (1 << (TypeScriptParser.Else - 55)) | (1 << (TypeScriptParser.New - 55)) | (1 << (TypeScriptParser.Var - 55)) | (1 << (TypeScriptParser.Catch - 55)) | (1 << (TypeScriptParser.Finally - 55)) | (1 << (TypeScriptParser.Return - 55)) | (1 << (TypeScriptParser.Void - 55)) | (1 << (TypeScriptParser.Continue - 55)) | (1 << (TypeScriptParser.For - 55)) | (1 << (TypeScriptParser.Switch - 55)) | (1 << (TypeScriptParser.While - 55)) | (1 << (TypeScriptParser.Debugger - 55)) | (1 << (TypeScriptParser.Function_ - 55)) | (1 << (TypeScriptParser.This - 55)) | (1 << (TypeScriptParser.With - 55)) | (1 << (TypeScriptParser.Default - 55)) | (1 << (TypeScriptParser.If - 55)) | (1 << (TypeScriptParser.Throw - 55)) | (1 << (TypeScriptParser.Delete - 55)) | (1 << (TypeScriptParser.In - 55)))) !== 0) || ((((_la - 87)) & ~0x1F) === 0 && ((1 << (_la - 87)) & ((1 << (TypeScriptParser.Try - 87)) | (1 << (TypeScriptParser.From - 87)) | (1 << (TypeScriptParser.ReadOnly - 87)) | (1 << (TypeScriptParser.Async - 87)) | (1 << (TypeScriptParser.Class - 87)) | (1 << (TypeScriptParser.Enum - 87)) | (1 << (TypeScriptParser.Extends - 87)) | (1 << (TypeScriptParser.Super - 87)) | (1 << (TypeScriptParser.Const - 87)) | (1 << (TypeScriptParser.Export - 87)) | (1 << (TypeScriptParser.Import - 87)) | (1 << (TypeScriptParser.Implements - 87)) | (1 << (TypeScriptParser.Let - 87)) | (1 << (TypeScriptParser.Private - 87)) | (1 << (TypeScriptParser.Public - 87)) | (1 << (TypeScriptParser.Interface - 87)) | (1 << (TypeScriptParser.Package - 87)) | (1 << (TypeScriptParser.Protected - 87)) | (1 << (TypeScriptParser.Static - 87)) | (1 << (TypeScriptParser.Yield - 87)) | (1 << (TypeScriptParser.String - 87)) | (1 << (TypeScriptParser.TypeAlias - 87)) | (1 << (TypeScriptParser.Get - 87)) | (1 << (TypeScriptParser.Set - 87)) | (1 << (TypeScriptParser.Require - 87)))) !== 0) || _la === TypeScriptParser.At || _la === TypeScriptParser.Identifier) {
				{
				this.state = 464;
				this.parameterList();
				}
			}

			this.state = 467;
			this.match(TypeScriptParser.CloseParen);
			this.state = 468;
			this.match(TypeScriptParser.ARROW);
			this.state = 469;
			this.type_();
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
	public constructorType(): ConstructorTypeContext {
		let _localctx: ConstructorTypeContext = new ConstructorTypeContext(this._ctx, this.state);
		this.enterRule(_localctx, 52, TypeScriptParser.RULE_constructorType);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 471;
			this.match(TypeScriptParser.New);
			this.state = 473;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === TypeScriptParser.LessThan) {
				{
				this.state = 472;
				this.typeParameters();
				}
			}

			this.state = 475;
			this.match(TypeScriptParser.OpenParen);
			this.state = 477;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << TypeScriptParser.OpenBracket) | (1 << TypeScriptParser.OpenBrace) | (1 << TypeScriptParser.Ellipsis))) !== 0) || ((((_la - 55)) & ~0x1F) === 0 && ((1 << (_la - 55)) & ((1 << (TypeScriptParser.NullLiteral - 55)) | (1 << (TypeScriptParser.BooleanLiteral - 55)) | (1 << (TypeScriptParser.Break - 55)) | (1 << (TypeScriptParser.Do - 55)) | (1 << (TypeScriptParser.Instanceof - 55)) | (1 << (TypeScriptParser.Typeof - 55)) | (1 << (TypeScriptParser.Case - 55)) | (1 << (TypeScriptParser.Else - 55)) | (1 << (TypeScriptParser.New - 55)) | (1 << (TypeScriptParser.Var - 55)) | (1 << (TypeScriptParser.Catch - 55)) | (1 << (TypeScriptParser.Finally - 55)) | (1 << (TypeScriptParser.Return - 55)) | (1 << (TypeScriptParser.Void - 55)) | (1 << (TypeScriptParser.Continue - 55)) | (1 << (TypeScriptParser.For - 55)) | (1 << (TypeScriptParser.Switch - 55)) | (1 << (TypeScriptParser.While - 55)) | (1 << (TypeScriptParser.Debugger - 55)) | (1 << (TypeScriptParser.Function_ - 55)) | (1 << (TypeScriptParser.This - 55)) | (1 << (TypeScriptParser.With - 55)) | (1 << (TypeScriptParser.Default - 55)) | (1 << (TypeScriptParser.If - 55)) | (1 << (TypeScriptParser.Throw - 55)) | (1 << (TypeScriptParser.Delete - 55)) | (1 << (TypeScriptParser.In - 55)))) !== 0) || ((((_la - 87)) & ~0x1F) === 0 && ((1 << (_la - 87)) & ((1 << (TypeScriptParser.Try - 87)) | (1 << (TypeScriptParser.From - 87)) | (1 << (TypeScriptParser.ReadOnly - 87)) | (1 << (TypeScriptParser.Async - 87)) | (1 << (TypeScriptParser.Class - 87)) | (1 << (TypeScriptParser.Enum - 87)) | (1 << (TypeScriptParser.Extends - 87)) | (1 << (TypeScriptParser.Super - 87)) | (1 << (TypeScriptParser.Const - 87)) | (1 << (TypeScriptParser.Export - 87)) | (1 << (TypeScriptParser.Import - 87)) | (1 << (TypeScriptParser.Implements - 87)) | (1 << (TypeScriptParser.Let - 87)) | (1 << (TypeScriptParser.Private - 87)) | (1 << (TypeScriptParser.Public - 87)) | (1 << (TypeScriptParser.Interface - 87)) | (1 << (TypeScriptParser.Package - 87)) | (1 << (TypeScriptParser.Protected - 87)) | (1 << (TypeScriptParser.Static - 87)) | (1 << (TypeScriptParser.Yield - 87)) | (1 << (TypeScriptParser.String - 87)) | (1 << (TypeScriptParser.TypeAlias - 87)) | (1 << (TypeScriptParser.Get - 87)) | (1 << (TypeScriptParser.Set - 87)) | (1 << (TypeScriptParser.Require - 87)))) !== 0) || _la === TypeScriptParser.At || _la === TypeScriptParser.Identifier) {
				{
				this.state = 476;
				this.parameterList();
				}
			}

			this.state = 479;
			this.match(TypeScriptParser.CloseParen);
			this.state = 480;
			this.match(TypeScriptParser.ARROW);
			this.state = 481;
			this.type_();
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
	public typeQuery(): TypeQueryContext {
		let _localctx: TypeQueryContext = new TypeQueryContext(this._ctx, this.state);
		this.enterRule(_localctx, 54, TypeScriptParser.RULE_typeQuery);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 483;
			this.match(TypeScriptParser.Typeof);
			this.state = 484;
			this.typeQueryExpression();
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
	public typeQueryExpression(): TypeQueryExpressionContext {
		let _localctx: TypeQueryExpressionContext = new TypeQueryExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 56, TypeScriptParser.RULE_typeQueryExpression);
		try {
			let _alt: number;
			this.state = 496;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 27, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 486;
				this.match(TypeScriptParser.Identifier);
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 490;
				this._errHandler.sync(this);
				_alt = 1;
				do {
					switch (_alt) {
					case 1:
						{
						{
						this.state = 487;
						this.identifierName();
						this.state = 488;
						this.match(TypeScriptParser.Dot);
						}
						}
						break;
					default:
						throw new NoViableAltException(this);
					}
					this.state = 492;
					this._errHandler.sync(this);
					_alt = this.interpreter.adaptivePredict(this._input, 26, this._ctx);
				} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
				this.state = 494;
				this.identifierName();
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
	public propertySignatur(): PropertySignaturContext {
		let _localctx: PropertySignaturContext = new PropertySignaturContext(this._ctx, this.state);
		this.enterRule(_localctx, 58, TypeScriptParser.RULE_propertySignatur);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 499;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 28, this._ctx) ) {
			case 1:
				{
				this.state = 498;
				this.match(TypeScriptParser.ReadOnly);
				}
				break;
			}
			this.state = 501;
			this.propertyName();
			this.state = 503;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === TypeScriptParser.QuestionMark) {
				{
				this.state = 502;
				this.match(TypeScriptParser.QuestionMark);
				}
			}

			this.state = 506;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === TypeScriptParser.Colon) {
				{
				this.state = 505;
				this.typeAnnotation();
				}
			}

			this.state = 510;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === TypeScriptParser.ARROW) {
				{
				this.state = 508;
				this.match(TypeScriptParser.ARROW);
				this.state = 509;
				this.type_();
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
	public typeAnnotation(): TypeAnnotationContext {
		let _localctx: TypeAnnotationContext = new TypeAnnotationContext(this._ctx, this.state);
		this.enterRule(_localctx, 60, TypeScriptParser.RULE_typeAnnotation);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 512;
			this.match(TypeScriptParser.Colon);
			this.state = 513;
			this.type_();
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
	public callSignature(): CallSignatureContext {
		let _localctx: CallSignatureContext = new CallSignatureContext(this._ctx, this.state);
		this.enterRule(_localctx, 62, TypeScriptParser.RULE_callSignature);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 516;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === TypeScriptParser.LessThan) {
				{
				this.state = 515;
				this.typeParameters();
				}
			}

			this.state = 518;
			this.match(TypeScriptParser.OpenParen);
			this.state = 520;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << TypeScriptParser.OpenBracket) | (1 << TypeScriptParser.OpenBrace) | (1 << TypeScriptParser.Ellipsis))) !== 0) || ((((_la - 55)) & ~0x1F) === 0 && ((1 << (_la - 55)) & ((1 << (TypeScriptParser.NullLiteral - 55)) | (1 << (TypeScriptParser.BooleanLiteral - 55)) | (1 << (TypeScriptParser.Break - 55)) | (1 << (TypeScriptParser.Do - 55)) | (1 << (TypeScriptParser.Instanceof - 55)) | (1 << (TypeScriptParser.Typeof - 55)) | (1 << (TypeScriptParser.Case - 55)) | (1 << (TypeScriptParser.Else - 55)) | (1 << (TypeScriptParser.New - 55)) | (1 << (TypeScriptParser.Var - 55)) | (1 << (TypeScriptParser.Catch - 55)) | (1 << (TypeScriptParser.Finally - 55)) | (1 << (TypeScriptParser.Return - 55)) | (1 << (TypeScriptParser.Void - 55)) | (1 << (TypeScriptParser.Continue - 55)) | (1 << (TypeScriptParser.For - 55)) | (1 << (TypeScriptParser.Switch - 55)) | (1 << (TypeScriptParser.While - 55)) | (1 << (TypeScriptParser.Debugger - 55)) | (1 << (TypeScriptParser.Function_ - 55)) | (1 << (TypeScriptParser.This - 55)) | (1 << (TypeScriptParser.With - 55)) | (1 << (TypeScriptParser.Default - 55)) | (1 << (TypeScriptParser.If - 55)) | (1 << (TypeScriptParser.Throw - 55)) | (1 << (TypeScriptParser.Delete - 55)) | (1 << (TypeScriptParser.In - 55)))) !== 0) || ((((_la - 87)) & ~0x1F) === 0 && ((1 << (_la - 87)) & ((1 << (TypeScriptParser.Try - 87)) | (1 << (TypeScriptParser.From - 87)) | (1 << (TypeScriptParser.ReadOnly - 87)) | (1 << (TypeScriptParser.Async - 87)) | (1 << (TypeScriptParser.Class - 87)) | (1 << (TypeScriptParser.Enum - 87)) | (1 << (TypeScriptParser.Extends - 87)) | (1 << (TypeScriptParser.Super - 87)) | (1 << (TypeScriptParser.Const - 87)) | (1 << (TypeScriptParser.Export - 87)) | (1 << (TypeScriptParser.Import - 87)) | (1 << (TypeScriptParser.Implements - 87)) | (1 << (TypeScriptParser.Let - 87)) | (1 << (TypeScriptParser.Private - 87)) | (1 << (TypeScriptParser.Public - 87)) | (1 << (TypeScriptParser.Interface - 87)) | (1 << (TypeScriptParser.Package - 87)) | (1 << (TypeScriptParser.Protected - 87)) | (1 << (TypeScriptParser.Static - 87)) | (1 << (TypeScriptParser.Yield - 87)) | (1 << (TypeScriptParser.String - 87)) | (1 << (TypeScriptParser.TypeAlias - 87)) | (1 << (TypeScriptParser.Get - 87)) | (1 << (TypeScriptParser.Set - 87)) | (1 << (TypeScriptParser.Require - 87)))) !== 0) || _la === TypeScriptParser.At || _la === TypeScriptParser.Identifier) {
				{
				this.state = 519;
				this.parameterList();
				}
			}

			this.state = 522;
			this.match(TypeScriptParser.CloseParen);
			this.state = 524;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 34, this._ctx) ) {
			case 1:
				{
				this.state = 523;
				this.typeAnnotation();
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
	public parameterList(): ParameterListContext {
		let _localctx: ParameterListContext = new ParameterListContext(this._ctx, this.state);
		this.enterRule(_localctx, 64, TypeScriptParser.RULE_parameterList);
		let _la: number;
		try {
			let _alt: number;
			this.state = 539;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case TypeScriptParser.Ellipsis:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 526;
				this.restParameter();
				}
				break;
			case TypeScriptParser.OpenBracket:
			case TypeScriptParser.OpenBrace:
			case TypeScriptParser.NullLiteral:
			case TypeScriptParser.BooleanLiteral:
			case TypeScriptParser.Break:
			case TypeScriptParser.Do:
			case TypeScriptParser.Instanceof:
			case TypeScriptParser.Typeof:
			case TypeScriptParser.Case:
			case TypeScriptParser.Else:
			case TypeScriptParser.New:
			case TypeScriptParser.Var:
			case TypeScriptParser.Catch:
			case TypeScriptParser.Finally:
			case TypeScriptParser.Return:
			case TypeScriptParser.Void:
			case TypeScriptParser.Continue:
			case TypeScriptParser.For:
			case TypeScriptParser.Switch:
			case TypeScriptParser.While:
			case TypeScriptParser.Debugger:
			case TypeScriptParser.Function_:
			case TypeScriptParser.This:
			case TypeScriptParser.With:
			case TypeScriptParser.Default:
			case TypeScriptParser.If:
			case TypeScriptParser.Throw:
			case TypeScriptParser.Delete:
			case TypeScriptParser.In:
			case TypeScriptParser.Try:
			case TypeScriptParser.From:
			case TypeScriptParser.ReadOnly:
			case TypeScriptParser.Async:
			case TypeScriptParser.Class:
			case TypeScriptParser.Enum:
			case TypeScriptParser.Extends:
			case TypeScriptParser.Super:
			case TypeScriptParser.Const:
			case TypeScriptParser.Export:
			case TypeScriptParser.Import:
			case TypeScriptParser.Implements:
			case TypeScriptParser.Let:
			case TypeScriptParser.Private:
			case TypeScriptParser.Public:
			case TypeScriptParser.Interface:
			case TypeScriptParser.Package:
			case TypeScriptParser.Protected:
			case TypeScriptParser.Static:
			case TypeScriptParser.Yield:
			case TypeScriptParser.String:
			case TypeScriptParser.TypeAlias:
			case TypeScriptParser.Get:
			case TypeScriptParser.Set:
			case TypeScriptParser.Require:
			case TypeScriptParser.At:
			case TypeScriptParser.Identifier:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 527;
				this.parameter();
				this.state = 532;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 35, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 528;
						this.match(TypeScriptParser.Comma);
						this.state = 529;
						this.parameter();
						}
						}
					}
					this.state = 534;
					this._errHandler.sync(this);
					_alt = this.interpreter.adaptivePredict(this._input, 35, this._ctx);
				}
				this.state = 537;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === TypeScriptParser.Comma) {
					{
					this.state = 535;
					this.match(TypeScriptParser.Comma);
					this.state = 536;
					this.restParameter();
					}
				}

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
	public requiredParameterList(): RequiredParameterListContext {
		let _localctx: RequiredParameterListContext = new RequiredParameterListContext(this._ctx, this.state);
		this.enterRule(_localctx, 66, TypeScriptParser.RULE_requiredParameterList);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 541;
			this.requiredParameter();
			this.state = 546;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === TypeScriptParser.Comma) {
				{
				{
				this.state = 542;
				this.match(TypeScriptParser.Comma);
				this.state = 543;
				this.requiredParameter();
				}
				}
				this.state = 548;
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
	public parameter(): ParameterContext {
		let _localctx: ParameterContext = new ParameterContext(this._ctx, this.state);
		this.enterRule(_localctx, 68, TypeScriptParser.RULE_parameter);
		try {
			this.state = 551;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 39, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 549;
				this.requiredParameter();
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 550;
				this.optionalParameter();
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
	public optionalParameter(): OptionalParameterContext {
		let _localctx: OptionalParameterContext = new OptionalParameterContext(this._ctx, this.state);
		this.enterRule(_localctx, 70, TypeScriptParser.RULE_optionalParameter);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 554;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === TypeScriptParser.At) {
				{
				this.state = 553;
				this.decoratorList();
				}
			}

			{
			this.state = 557;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 41, this._ctx) ) {
			case 1:
				{
				this.state = 556;
				this.accessibilityModifier();
				}
				break;
			}
			this.state = 559;
			this.identifierOrPattern();
			this.state = 568;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case TypeScriptParser.QuestionMark:
				{
				this.state = 560;
				this.match(TypeScriptParser.QuestionMark);
				this.state = 562;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === TypeScriptParser.Colon) {
					{
					this.state = 561;
					this.typeAnnotation();
					}
				}

				}
				break;
			case TypeScriptParser.Assign:
			case TypeScriptParser.Colon:
				{
				this.state = 565;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === TypeScriptParser.Colon) {
					{
					this.state = 564;
					this.typeAnnotation();
					}
				}

				this.state = 567;
				this.initializer();
				}
				break;
			default:
				throw new NoViableAltException(this);
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
	public restParameter(): RestParameterContext {
		let _localctx: RestParameterContext = new RestParameterContext(this._ctx, this.state);
		this.enterRule(_localctx, 72, TypeScriptParser.RULE_restParameter);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 570;
			this.match(TypeScriptParser.Ellipsis);
			this.state = 571;
			this.singleExpression(0);
			this.state = 573;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === TypeScriptParser.Colon) {
				{
				this.state = 572;
				this.typeAnnotation();
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
	public requiredParameter(): RequiredParameterContext {
		let _localctx: RequiredParameterContext = new RequiredParameterContext(this._ctx, this.state);
		this.enterRule(_localctx, 74, TypeScriptParser.RULE_requiredParameter);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 576;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === TypeScriptParser.At) {
				{
				this.state = 575;
				this.decoratorList();
				}
			}

			this.state = 579;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 47, this._ctx) ) {
			case 1:
				{
				this.state = 578;
				this.accessibilityModifier();
				}
				break;
			}
			this.state = 581;
			this.identifierOrPattern();
			this.state = 583;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === TypeScriptParser.Colon) {
				{
				this.state = 582;
				this.typeAnnotation();
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
	public accessibilityModifier(): AccessibilityModifierContext {
		let _localctx: AccessibilityModifierContext = new AccessibilityModifierContext(this._ctx, this.state);
		this.enterRule(_localctx, 76, TypeScriptParser.RULE_accessibilityModifier);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 585;
			_la = this._input.LA(1);
			if (!(((((_la - 101)) & ~0x1F) === 0 && ((1 << (_la - 101)) & ((1 << (TypeScriptParser.Private - 101)) | (1 << (TypeScriptParser.Public - 101)) | (1 << (TypeScriptParser.Protected - 101)))) !== 0))) {
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
	public identifierOrPattern(): IdentifierOrPatternContext {
		let _localctx: IdentifierOrPatternContext = new IdentifierOrPatternContext(this._ctx, this.state);
		this.enterRule(_localctx, 78, TypeScriptParser.RULE_identifierOrPattern);
		try {
			this.state = 589;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case TypeScriptParser.NullLiteral:
			case TypeScriptParser.BooleanLiteral:
			case TypeScriptParser.Break:
			case TypeScriptParser.Do:
			case TypeScriptParser.Instanceof:
			case TypeScriptParser.Typeof:
			case TypeScriptParser.Case:
			case TypeScriptParser.Else:
			case TypeScriptParser.New:
			case TypeScriptParser.Var:
			case TypeScriptParser.Catch:
			case TypeScriptParser.Finally:
			case TypeScriptParser.Return:
			case TypeScriptParser.Void:
			case TypeScriptParser.Continue:
			case TypeScriptParser.For:
			case TypeScriptParser.Switch:
			case TypeScriptParser.While:
			case TypeScriptParser.Debugger:
			case TypeScriptParser.Function_:
			case TypeScriptParser.This:
			case TypeScriptParser.With:
			case TypeScriptParser.Default:
			case TypeScriptParser.If:
			case TypeScriptParser.Throw:
			case TypeScriptParser.Delete:
			case TypeScriptParser.In:
			case TypeScriptParser.Try:
			case TypeScriptParser.From:
			case TypeScriptParser.ReadOnly:
			case TypeScriptParser.Async:
			case TypeScriptParser.Class:
			case TypeScriptParser.Enum:
			case TypeScriptParser.Extends:
			case TypeScriptParser.Super:
			case TypeScriptParser.Const:
			case TypeScriptParser.Export:
			case TypeScriptParser.Import:
			case TypeScriptParser.Implements:
			case TypeScriptParser.Let:
			case TypeScriptParser.Private:
			case TypeScriptParser.Public:
			case TypeScriptParser.Interface:
			case TypeScriptParser.Package:
			case TypeScriptParser.Protected:
			case TypeScriptParser.Static:
			case TypeScriptParser.Yield:
			case TypeScriptParser.String:
			case TypeScriptParser.TypeAlias:
			case TypeScriptParser.Get:
			case TypeScriptParser.Set:
			case TypeScriptParser.Require:
			case TypeScriptParser.Identifier:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 587;
				this.identifierName();
				}
				break;
			case TypeScriptParser.OpenBracket:
			case TypeScriptParser.OpenBrace:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 588;
				this.bindingPattern();
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
	public constructSignature(): ConstructSignatureContext {
		let _localctx: ConstructSignatureContext = new ConstructSignatureContext(this._ctx, this.state);
		this.enterRule(_localctx, 80, TypeScriptParser.RULE_constructSignature);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 591;
			this.match(TypeScriptParser.New);
			this.state = 593;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === TypeScriptParser.LessThan) {
				{
				this.state = 592;
				this.typeParameters();
				}
			}

			this.state = 595;
			this.match(TypeScriptParser.OpenParen);
			this.state = 597;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << TypeScriptParser.OpenBracket) | (1 << TypeScriptParser.OpenBrace) | (1 << TypeScriptParser.Ellipsis))) !== 0) || ((((_la - 55)) & ~0x1F) === 0 && ((1 << (_la - 55)) & ((1 << (TypeScriptParser.NullLiteral - 55)) | (1 << (TypeScriptParser.BooleanLiteral - 55)) | (1 << (TypeScriptParser.Break - 55)) | (1 << (TypeScriptParser.Do - 55)) | (1 << (TypeScriptParser.Instanceof - 55)) | (1 << (TypeScriptParser.Typeof - 55)) | (1 << (TypeScriptParser.Case - 55)) | (1 << (TypeScriptParser.Else - 55)) | (1 << (TypeScriptParser.New - 55)) | (1 << (TypeScriptParser.Var - 55)) | (1 << (TypeScriptParser.Catch - 55)) | (1 << (TypeScriptParser.Finally - 55)) | (1 << (TypeScriptParser.Return - 55)) | (1 << (TypeScriptParser.Void - 55)) | (1 << (TypeScriptParser.Continue - 55)) | (1 << (TypeScriptParser.For - 55)) | (1 << (TypeScriptParser.Switch - 55)) | (1 << (TypeScriptParser.While - 55)) | (1 << (TypeScriptParser.Debugger - 55)) | (1 << (TypeScriptParser.Function_ - 55)) | (1 << (TypeScriptParser.This - 55)) | (1 << (TypeScriptParser.With - 55)) | (1 << (TypeScriptParser.Default - 55)) | (1 << (TypeScriptParser.If - 55)) | (1 << (TypeScriptParser.Throw - 55)) | (1 << (TypeScriptParser.Delete - 55)) | (1 << (TypeScriptParser.In - 55)))) !== 0) || ((((_la - 87)) & ~0x1F) === 0 && ((1 << (_la - 87)) & ((1 << (TypeScriptParser.Try - 87)) | (1 << (TypeScriptParser.From - 87)) | (1 << (TypeScriptParser.ReadOnly - 87)) | (1 << (TypeScriptParser.Async - 87)) | (1 << (TypeScriptParser.Class - 87)) | (1 << (TypeScriptParser.Enum - 87)) | (1 << (TypeScriptParser.Extends - 87)) | (1 << (TypeScriptParser.Super - 87)) | (1 << (TypeScriptParser.Const - 87)) | (1 << (TypeScriptParser.Export - 87)) | (1 << (TypeScriptParser.Import - 87)) | (1 << (TypeScriptParser.Implements - 87)) | (1 << (TypeScriptParser.Let - 87)) | (1 << (TypeScriptParser.Private - 87)) | (1 << (TypeScriptParser.Public - 87)) | (1 << (TypeScriptParser.Interface - 87)) | (1 << (TypeScriptParser.Package - 87)) | (1 << (TypeScriptParser.Protected - 87)) | (1 << (TypeScriptParser.Static - 87)) | (1 << (TypeScriptParser.Yield - 87)) | (1 << (TypeScriptParser.String - 87)) | (1 << (TypeScriptParser.TypeAlias - 87)) | (1 << (TypeScriptParser.Get - 87)) | (1 << (TypeScriptParser.Set - 87)) | (1 << (TypeScriptParser.Require - 87)))) !== 0) || _la === TypeScriptParser.At || _la === TypeScriptParser.Identifier) {
				{
				this.state = 596;
				this.parameterList();
				}
			}

			this.state = 599;
			this.match(TypeScriptParser.CloseParen);
			this.state = 601;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === TypeScriptParser.Colon) {
				{
				this.state = 600;
				this.typeAnnotation();
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
	public indexSignature(): IndexSignatureContext {
		let _localctx: IndexSignatureContext = new IndexSignatureContext(this._ctx, this.state);
		this.enterRule(_localctx, 82, TypeScriptParser.RULE_indexSignature);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 603;
			this.match(TypeScriptParser.OpenBracket);
			this.state = 604;
			this.match(TypeScriptParser.Identifier);
			this.state = 605;
			this.match(TypeScriptParser.Colon);
			this.state = 606;
			_la = this._input.LA(1);
			if (!(_la === TypeScriptParser.Number || _la === TypeScriptParser.String)) {
			this._errHandler.recoverInline(this);
			} else {
				if (this._input.LA(1) === Token.EOF) {
					this.matchedEOF = true;
				}

				this._errHandler.reportMatch(this);
				this.consume();
			}
			this.state = 607;
			this.match(TypeScriptParser.CloseBracket);
			this.state = 608;
			this.typeAnnotation();
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
	public methodSignature(): MethodSignatureContext {
		let _localctx: MethodSignatureContext = new MethodSignatureContext(this._ctx, this.state);
		this.enterRule(_localctx, 84, TypeScriptParser.RULE_methodSignature);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 610;
			this.propertyName();
			this.state = 612;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === TypeScriptParser.QuestionMark) {
				{
				this.state = 611;
				this.match(TypeScriptParser.QuestionMark);
				}
			}

			this.state = 614;
			this.callSignature();
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
	public typeAliasDeclaration(): TypeAliasDeclarationContext {
		let _localctx: TypeAliasDeclarationContext = new TypeAliasDeclarationContext(this._ctx, this.state);
		this.enterRule(_localctx, 86, TypeScriptParser.RULE_typeAliasDeclaration);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 616;
			this.match(TypeScriptParser.TypeAlias);
			this.state = 617;
			this.match(TypeScriptParser.Identifier);
			this.state = 619;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === TypeScriptParser.LessThan) {
				{
				this.state = 618;
				this.typeParameters();
				}
			}

			this.state = 621;
			this.match(TypeScriptParser.Assign);
			this.state = 622;
			this.type_();
			this.state = 623;
			this.match(TypeScriptParser.SemiColon);
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
	public constructorDeclaration(): ConstructorDeclarationContext {
		let _localctx: ConstructorDeclarationContext = new ConstructorDeclarationContext(this._ctx, this.state);
		this.enterRule(_localctx, 88, TypeScriptParser.RULE_constructorDeclaration);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 626;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 101)) & ~0x1F) === 0 && ((1 << (_la - 101)) & ((1 << (TypeScriptParser.Private - 101)) | (1 << (TypeScriptParser.Public - 101)) | (1 << (TypeScriptParser.Protected - 101)))) !== 0)) {
				{
				this.state = 625;
				this.accessibilityModifier();
				}
			}

			this.state = 628;
			this.match(TypeScriptParser.Constructor);
			this.state = 629;
			this.match(TypeScriptParser.OpenParen);
			this.state = 631;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << TypeScriptParser.OpenBracket) | (1 << TypeScriptParser.OpenBrace) | (1 << TypeScriptParser.Ellipsis))) !== 0) || ((((_la - 101)) & ~0x1F) === 0 && ((1 << (_la - 101)) & ((1 << (TypeScriptParser.Private - 101)) | (1 << (TypeScriptParser.Public - 101)) | (1 << (TypeScriptParser.Protected - 101)) | (1 << (TypeScriptParser.TypeAlias - 101)) | (1 << (TypeScriptParser.Require - 101)) | (1 << (TypeScriptParser.At - 101)) | (1 << (TypeScriptParser.Identifier - 101)))) !== 0)) {
				{
				this.state = 630;
				this.formalParameterList();
				}
			}

			this.state = 633;
			this.match(TypeScriptParser.CloseParen);
			this.state = 639;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 57, this._ctx) ) {
			case 1:
				{
				{
				this.state = 634;
				this.match(TypeScriptParser.OpenBrace);
				this.state = 635;
				this.functionBody();
				this.state = 636;
				this.match(TypeScriptParser.CloseBrace);
				}
				}
				break;

			case 2:
				{
				this.state = 638;
				this.match(TypeScriptParser.SemiColon);
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
	public interfaceDeclaration(): InterfaceDeclarationContext {
		let _localctx: InterfaceDeclarationContext = new InterfaceDeclarationContext(this._ctx, this.state);
		this.enterRule(_localctx, 90, TypeScriptParser.RULE_interfaceDeclaration);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 642;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === TypeScriptParser.Export) {
				{
				this.state = 641;
				this.match(TypeScriptParser.Export);
				}
			}

			this.state = 645;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === TypeScriptParser.Declare) {
				{
				this.state = 644;
				this.match(TypeScriptParser.Declare);
				}
			}

			this.state = 647;
			this.match(TypeScriptParser.Interface);
			this.state = 648;
			this.match(TypeScriptParser.Identifier);
			this.state = 650;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === TypeScriptParser.LessThan) {
				{
				this.state = 649;
				this.typeParameters();
				}
			}

			this.state = 653;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === TypeScriptParser.Extends) {
				{
				this.state = 652;
				this.interfaceExtendsClause();
				}
			}

			this.state = 655;
			this.objectType();
			this.state = 657;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 62, this._ctx) ) {
			case 1:
				{
				this.state = 656;
				this.match(TypeScriptParser.SemiColon);
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
	public interfaceExtendsClause(): InterfaceExtendsClauseContext {
		let _localctx: InterfaceExtendsClauseContext = new InterfaceExtendsClauseContext(this._ctx, this.state);
		this.enterRule(_localctx, 92, TypeScriptParser.RULE_interfaceExtendsClause);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 659;
			this.match(TypeScriptParser.Extends);
			this.state = 660;
			this.classOrInterfaceTypeList();
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
	public classOrInterfaceTypeList(): ClassOrInterfaceTypeListContext {
		let _localctx: ClassOrInterfaceTypeListContext = new ClassOrInterfaceTypeListContext(this._ctx, this.state);
		this.enterRule(_localctx, 94, TypeScriptParser.RULE_classOrInterfaceTypeList);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 662;
			this.typeReference();
			this.state = 667;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === TypeScriptParser.Comma) {
				{
				{
				this.state = 663;
				this.match(TypeScriptParser.Comma);
				this.state = 664;
				this.typeReference();
				}
				}
				this.state = 669;
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
	public enumDeclaration(): EnumDeclarationContext {
		let _localctx: EnumDeclarationContext = new EnumDeclarationContext(this._ctx, this.state);
		this.enterRule(_localctx, 96, TypeScriptParser.RULE_enumDeclaration);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 671;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === TypeScriptParser.Const) {
				{
				this.state = 670;
				this.match(TypeScriptParser.Const);
				}
			}

			this.state = 673;
			this.match(TypeScriptParser.Enum);
			this.state = 674;
			this.match(TypeScriptParser.Identifier);
			this.state = 675;
			this.match(TypeScriptParser.OpenBrace);
			this.state = 677;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 55)) & ~0x1F) === 0 && ((1 << (_la - 55)) & ((1 << (TypeScriptParser.NullLiteral - 55)) | (1 << (TypeScriptParser.BooleanLiteral - 55)) | (1 << (TypeScriptParser.DecimalLiteral - 55)) | (1 << (TypeScriptParser.HexIntegerLiteral - 55)) | (1 << (TypeScriptParser.OctalIntegerLiteral - 55)) | (1 << (TypeScriptParser.OctalIntegerLiteral2 - 55)) | (1 << (TypeScriptParser.BinaryIntegerLiteral - 55)) | (1 << (TypeScriptParser.Break - 55)) | (1 << (TypeScriptParser.Do - 55)) | (1 << (TypeScriptParser.Instanceof - 55)) | (1 << (TypeScriptParser.Typeof - 55)) | (1 << (TypeScriptParser.Case - 55)) | (1 << (TypeScriptParser.Else - 55)) | (1 << (TypeScriptParser.New - 55)) | (1 << (TypeScriptParser.Var - 55)) | (1 << (TypeScriptParser.Catch - 55)) | (1 << (TypeScriptParser.Finally - 55)) | (1 << (TypeScriptParser.Return - 55)) | (1 << (TypeScriptParser.Void - 55)) | (1 << (TypeScriptParser.Continue - 55)) | (1 << (TypeScriptParser.For - 55)) | (1 << (TypeScriptParser.Switch - 55)) | (1 << (TypeScriptParser.While - 55)) | (1 << (TypeScriptParser.Debugger - 55)) | (1 << (TypeScriptParser.Function_ - 55)) | (1 << (TypeScriptParser.This - 55)) | (1 << (TypeScriptParser.With - 55)) | (1 << (TypeScriptParser.Default - 55)) | (1 << (TypeScriptParser.If - 55)) | (1 << (TypeScriptParser.Throw - 55)) | (1 << (TypeScriptParser.Delete - 55)) | (1 << (TypeScriptParser.In - 55)))) !== 0) || ((((_la - 87)) & ~0x1F) === 0 && ((1 << (_la - 87)) & ((1 << (TypeScriptParser.Try - 87)) | (1 << (TypeScriptParser.From - 87)) | (1 << (TypeScriptParser.ReadOnly - 87)) | (1 << (TypeScriptParser.Async - 87)) | (1 << (TypeScriptParser.Class - 87)) | (1 << (TypeScriptParser.Enum - 87)) | (1 << (TypeScriptParser.Extends - 87)) | (1 << (TypeScriptParser.Super - 87)) | (1 << (TypeScriptParser.Const - 87)) | (1 << (TypeScriptParser.Export - 87)) | (1 << (TypeScriptParser.Import - 87)) | (1 << (TypeScriptParser.Implements - 87)) | (1 << (TypeScriptParser.Let - 87)) | (1 << (TypeScriptParser.Private - 87)) | (1 << (TypeScriptParser.Public - 87)) | (1 << (TypeScriptParser.Interface - 87)) | (1 << (TypeScriptParser.Package - 87)) | (1 << (TypeScriptParser.Protected - 87)) | (1 << (TypeScriptParser.Static - 87)) | (1 << (TypeScriptParser.Yield - 87)) | (1 << (TypeScriptParser.String - 87)) | (1 << (TypeScriptParser.TypeAlias - 87)) | (1 << (TypeScriptParser.Get - 87)) | (1 << (TypeScriptParser.Set - 87)) | (1 << (TypeScriptParser.Require - 87)))) !== 0) || _la === TypeScriptParser.Identifier || _la === TypeScriptParser.StringLiteral) {
				{
				this.state = 676;
				this.enumBody();
				}
			}

			this.state = 679;
			this.match(TypeScriptParser.CloseBrace);
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
	public enumBody(): EnumBodyContext {
		let _localctx: EnumBodyContext = new EnumBodyContext(this._ctx, this.state);
		this.enterRule(_localctx, 98, TypeScriptParser.RULE_enumBody);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 681;
			this.enumMemberList();
			this.state = 683;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === TypeScriptParser.Comma) {
				{
				this.state = 682;
				this.match(TypeScriptParser.Comma);
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
	public enumMemberList(): EnumMemberListContext {
		let _localctx: EnumMemberListContext = new EnumMemberListContext(this._ctx, this.state);
		this.enterRule(_localctx, 100, TypeScriptParser.RULE_enumMemberList);
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 685;
			this.enumMember();
			this.state = 690;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 67, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 686;
					this.match(TypeScriptParser.Comma);
					this.state = 687;
					this.enumMember();
					}
					}
				}
				this.state = 692;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 67, this._ctx);
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
	public enumMember(): EnumMemberContext {
		let _localctx: EnumMemberContext = new EnumMemberContext(this._ctx, this.state);
		this.enterRule(_localctx, 102, TypeScriptParser.RULE_enumMember);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 693;
			this.propertyName();
			this.state = 696;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === TypeScriptParser.Assign) {
				{
				this.state = 694;
				this.match(TypeScriptParser.Assign);
				this.state = 695;
				this.singleExpression(0);
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
	public namespaceDeclaration(): NamespaceDeclarationContext {
		let _localctx: NamespaceDeclarationContext = new NamespaceDeclarationContext(this._ctx, this.state);
		this.enterRule(_localctx, 104, TypeScriptParser.RULE_namespaceDeclaration);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 698;
			this.match(TypeScriptParser.Namespace);
			this.state = 699;
			this.namespaceName();
			this.state = 700;
			this.match(TypeScriptParser.OpenBrace);
			this.state = 702;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 69, this._ctx) ) {
			case 1:
				{
				this.state = 701;
				this.statementList();
				}
				break;
			}
			this.state = 704;
			this.match(TypeScriptParser.CloseBrace);
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
	public namespaceName(): NamespaceNameContext {
		let _localctx: NamespaceNameContext = new NamespaceNameContext(this._ctx, this.state);
		this.enterRule(_localctx, 106, TypeScriptParser.RULE_namespaceName);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 706;
			this.match(TypeScriptParser.Identifier);
			this.state = 715;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 71, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 708;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
					do {
						{
						{
						this.state = 707;
						this.match(TypeScriptParser.Dot);
						}
						}
						this.state = 710;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
					} while (_la === TypeScriptParser.Dot);
					this.state = 712;
					this.match(TypeScriptParser.Identifier);
					}
					}
				}
				this.state = 717;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 71, this._ctx);
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
	public importAliasDeclaration(): ImportAliasDeclarationContext {
		let _localctx: ImportAliasDeclarationContext = new ImportAliasDeclarationContext(this._ctx, this.state);
		this.enterRule(_localctx, 108, TypeScriptParser.RULE_importAliasDeclaration);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 718;
			this.match(TypeScriptParser.Identifier);
			this.state = 719;
			this.match(TypeScriptParser.Assign);
			this.state = 720;
			this.namespaceName();
			this.state = 721;
			this.match(TypeScriptParser.SemiColon);
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
	public decoratorList(): DecoratorListContext {
		let _localctx: DecoratorListContext = new DecoratorListContext(this._ctx, this.state);
		this.enterRule(_localctx, 110, TypeScriptParser.RULE_decoratorList);
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 724;
			this._errHandler.sync(this);
			_alt = 1;
			do {
				switch (_alt) {
				case 1:
					{
					{
					this.state = 723;
					this.decorator();
					}
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				this.state = 726;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 72, this._ctx);
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
	public decorator(): DecoratorContext {
		let _localctx: DecoratorContext = new DecoratorContext(this._ctx, this.state);
		this.enterRule(_localctx, 112, TypeScriptParser.RULE_decorator);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 728;
			this.match(TypeScriptParser.At);
			this.state = 731;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 73, this._ctx) ) {
			case 1:
				{
				this.state = 729;
				this.decoratorMemberExpression(0);
				}
				break;

			case 2:
				{
				this.state = 730;
				this.decoratorCallExpression();
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

	public decoratorMemberExpression(): DecoratorMemberExpressionContext;
	public decoratorMemberExpression(_p: number): DecoratorMemberExpressionContext;
	// @RuleVersion(0)
	public decoratorMemberExpression(_p?: number): DecoratorMemberExpressionContext {
		if (_p === undefined) {
			_p = 0;
		}

		let _parentctx: ParserRuleContext = this._ctx;
		let _parentState: number = this.state;
		let _localctx: DecoratorMemberExpressionContext = new DecoratorMemberExpressionContext(this._ctx, _parentState);
		let _prevctx: DecoratorMemberExpressionContext = _localctx;
		let _startState: number = 114;
		this.enterRecursionRule(_localctx, 114, TypeScriptParser.RULE_decoratorMemberExpression, _p);
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 739;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case TypeScriptParser.Identifier:
				{
				this.state = 734;
				this.match(TypeScriptParser.Identifier);
				}
				break;
			case TypeScriptParser.OpenParen:
				{
				this.state = 735;
				this.match(TypeScriptParser.OpenParen);
				this.state = 736;
				this.singleExpression(0);
				this.state = 737;
				this.match(TypeScriptParser.CloseParen);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			this._ctx._stop = this._input.tryLT(-1);
			this.state = 746;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 75, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					if (this._parseListeners != null) {
						this.triggerExitRuleEvent();
					}
					_prevctx = _localctx;
					{
					{
					_localctx = new DecoratorMemberExpressionContext(_parentctx, _parentState);
					this.pushNewRecursionContext(_localctx, _startState, TypeScriptParser.RULE_decoratorMemberExpression);
					this.state = 741;
					if (!(this.precpred(this._ctx, 2))) {
						throw this.createFailedPredicateException("this.precpred(this._ctx, 2)");
					}
					this.state = 742;
					this.match(TypeScriptParser.Dot);
					this.state = 743;
					this.identifierName();
					}
					}
				}
				this.state = 748;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 75, this._ctx);
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
	public decoratorCallExpression(): DecoratorCallExpressionContext {
		let _localctx: DecoratorCallExpressionContext = new DecoratorCallExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 116, TypeScriptParser.RULE_decoratorCallExpression);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 749;
			this.decoratorMemberExpression(0);
			this.state = 750;
			this.arguments();
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
	public program(): ProgramContext {
		let _localctx: ProgramContext = new ProgramContext(this._ctx, this.state);
		this.enterRule(_localctx, 118, TypeScriptParser.RULE_program);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 753;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 76, this._ctx) ) {
			case 1:
				{
				this.state = 752;
				this.sourceElements();
				}
				break;
			}
			this.state = 755;
			this.match(TypeScriptParser.EOF);
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
	public sourceElement(): SourceElementContext {
		let _localctx: SourceElementContext = new SourceElementContext(this._ctx, this.state);
		this.enterRule(_localctx, 120, TypeScriptParser.RULE_sourceElement);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 758;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 77, this._ctx) ) {
			case 1:
				{
				this.state = 757;
				this.match(TypeScriptParser.Export);
				}
				break;
			}
			this.state = 760;
			this.statement();
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
		this.enterRule(_localctx, 122, TypeScriptParser.RULE_statement);
		try {
			this.state = 792;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 78, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 762;
				this.block();
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 763;
				this.importStatement();
				}
				break;

			case 3:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 764;
				this.exportStatement();
				}
				break;

			case 4:
				this.enterOuterAlt(_localctx, 4);
				{
				this.state = 765;
				this.emptyStatement_();
				}
				break;

			case 5:
				this.enterOuterAlt(_localctx, 5);
				{
				this.state = 766;
				this.abstractDeclaration();
				}
				break;

			case 6:
				this.enterOuterAlt(_localctx, 6);
				{
				this.state = 767;
				this.decoratorList();
				}
				break;

			case 7:
				this.enterOuterAlt(_localctx, 7);
				{
				this.state = 768;
				this.classDeclaration();
				}
				break;

			case 8:
				this.enterOuterAlt(_localctx, 8);
				{
				this.state = 769;
				this.interfaceDeclaration();
				}
				break;

			case 9:
				this.enterOuterAlt(_localctx, 9);
				{
				this.state = 770;
				this.namespaceDeclaration();
				}
				break;

			case 10:
				this.enterOuterAlt(_localctx, 10);
				{
				this.state = 771;
				this.ifStatement();
				}
				break;

			case 11:
				this.enterOuterAlt(_localctx, 11);
				{
				this.state = 772;
				this.iterationStatement();
				}
				break;

			case 12:
				this.enterOuterAlt(_localctx, 12);
				{
				this.state = 773;
				this.continueStatement();
				}
				break;

			case 13:
				this.enterOuterAlt(_localctx, 13);
				{
				this.state = 774;
				this.breakStatement();
				}
				break;

			case 14:
				this.enterOuterAlt(_localctx, 14);
				{
				this.state = 775;
				this.returnStatement();
				}
				break;

			case 15:
				this.enterOuterAlt(_localctx, 15);
				{
				this.state = 776;
				this.yieldStatement();
				}
				break;

			case 16:
				this.enterOuterAlt(_localctx, 16);
				{
				this.state = 777;
				this.withStatement();
				}
				break;

			case 17:
				this.enterOuterAlt(_localctx, 17);
				{
				this.state = 778;
				this.labelledStatement();
				}
				break;

			case 18:
				this.enterOuterAlt(_localctx, 18);
				{
				this.state = 779;
				this.switchStatement();
				}
				break;

			case 19:
				this.enterOuterAlt(_localctx, 19);
				{
				this.state = 780;
				this.throwStatement();
				}
				break;

			case 20:
				this.enterOuterAlt(_localctx, 20);
				{
				this.state = 781;
				this.tryStatement();
				}
				break;

			case 21:
				this.enterOuterAlt(_localctx, 21);
				{
				this.state = 782;
				this.debuggerStatement();
				}
				break;

			case 22:
				this.enterOuterAlt(_localctx, 22);
				{
				this.state = 783;
				this.functionDeclaration();
				}
				break;

			case 23:
				this.enterOuterAlt(_localctx, 23);
				{
				this.state = 784;
				this.arrowFunctionDeclaration();
				}
				break;

			case 24:
				this.enterOuterAlt(_localctx, 24);
				{
				this.state = 785;
				this.generatorFunctionDeclaration();
				}
				break;

			case 25:
				this.enterOuterAlt(_localctx, 25);
				{
				this.state = 786;
				this.variableStatement();
				}
				break;

			case 26:
				this.enterOuterAlt(_localctx, 26);
				{
				this.state = 787;
				this.typeAliasDeclaration();
				}
				break;

			case 27:
				this.enterOuterAlt(_localctx, 27);
				{
				this.state = 788;
				this.enumDeclaration();
				}
				break;

			case 28:
				this.enterOuterAlt(_localctx, 28);
				{
				this.state = 789;
				this.expressionStatement();
				}
				break;

			case 29:
				this.enterOuterAlt(_localctx, 29);
				{
				this.state = 790;
				this.match(TypeScriptParser.Export);
				this.state = 791;
				this.statement();
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
	public block(): BlockContext {
		let _localctx: BlockContext = new BlockContext(this._ctx, this.state);
		this.enterRule(_localctx, 124, TypeScriptParser.RULE_block);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 794;
			this.match(TypeScriptParser.OpenBrace);
			this.state = 796;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 79, this._ctx) ) {
			case 1:
				{
				this.state = 795;
				this.statementList();
				}
				break;
			}
			this.state = 798;
			this.match(TypeScriptParser.CloseBrace);
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
	public statementList(): StatementListContext {
		let _localctx: StatementListContext = new StatementListContext(this._ctx, this.state);
		this.enterRule(_localctx, 126, TypeScriptParser.RULE_statementList);
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 801;
			this._errHandler.sync(this);
			_alt = 1;
			do {
				switch (_alt) {
				case 1:
					{
					{
					this.state = 800;
					this.statement();
					}
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				this.state = 803;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 80, this._ctx);
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
	public abstractDeclaration(): AbstractDeclarationContext {
		let _localctx: AbstractDeclarationContext = new AbstractDeclarationContext(this._ctx, this.state);
		this.enterRule(_localctx, 128, TypeScriptParser.RULE_abstractDeclaration);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 805;
			this.match(TypeScriptParser.Abstract);
			this.state = 809;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 81, this._ctx) ) {
			case 1:
				{
				this.state = 806;
				this.match(TypeScriptParser.Identifier);
				this.state = 807;
				this.callSignature();
				}
				break;

			case 2:
				{
				this.state = 808;
				this.variableStatement();
				}
				break;
			}
			this.state = 811;
			this.eos();
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
	public importStatement(): ImportStatementContext {
		let _localctx: ImportStatementContext = new ImportStatementContext(this._ctx, this.state);
		this.enterRule(_localctx, 130, TypeScriptParser.RULE_importStatement);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 813;
			this.match(TypeScriptParser.Import);
			this.state = 816;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 82, this._ctx) ) {
			case 1:
				{
				this.state = 814;
				this.fromBlock();
				}
				break;

			case 2:
				{
				this.state = 815;
				this.importAliasDeclaration();
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
	public fromBlock(): FromBlockContext {
		let _localctx: FromBlockContext = new FromBlockContext(this._ctx, this.state);
		this.enterRule(_localctx, 132, TypeScriptParser.RULE_fromBlock);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 820;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case TypeScriptParser.Multiply:
				{
				this.state = 818;
				this.match(TypeScriptParser.Multiply);
				}
				break;
			case TypeScriptParser.OpenBrace:
			case TypeScriptParser.NullLiteral:
			case TypeScriptParser.BooleanLiteral:
			case TypeScriptParser.Break:
			case TypeScriptParser.Do:
			case TypeScriptParser.Instanceof:
			case TypeScriptParser.Typeof:
			case TypeScriptParser.Case:
			case TypeScriptParser.Else:
			case TypeScriptParser.New:
			case TypeScriptParser.Var:
			case TypeScriptParser.Catch:
			case TypeScriptParser.Finally:
			case TypeScriptParser.Return:
			case TypeScriptParser.Void:
			case TypeScriptParser.Continue:
			case TypeScriptParser.For:
			case TypeScriptParser.Switch:
			case TypeScriptParser.While:
			case TypeScriptParser.Debugger:
			case TypeScriptParser.Function_:
			case TypeScriptParser.This:
			case TypeScriptParser.With:
			case TypeScriptParser.Default:
			case TypeScriptParser.If:
			case TypeScriptParser.Throw:
			case TypeScriptParser.Delete:
			case TypeScriptParser.In:
			case TypeScriptParser.Try:
			case TypeScriptParser.From:
			case TypeScriptParser.ReadOnly:
			case TypeScriptParser.Async:
			case TypeScriptParser.Class:
			case TypeScriptParser.Enum:
			case TypeScriptParser.Extends:
			case TypeScriptParser.Super:
			case TypeScriptParser.Const:
			case TypeScriptParser.Export:
			case TypeScriptParser.Import:
			case TypeScriptParser.Implements:
			case TypeScriptParser.Let:
			case TypeScriptParser.Private:
			case TypeScriptParser.Public:
			case TypeScriptParser.Interface:
			case TypeScriptParser.Package:
			case TypeScriptParser.Protected:
			case TypeScriptParser.Static:
			case TypeScriptParser.Yield:
			case TypeScriptParser.String:
			case TypeScriptParser.TypeAlias:
			case TypeScriptParser.Get:
			case TypeScriptParser.Set:
			case TypeScriptParser.Require:
			case TypeScriptParser.Identifier:
				{
				this.state = 819;
				this.multipleImportStatement();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			this.state = 824;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === TypeScriptParser.As) {
				{
				this.state = 822;
				this.match(TypeScriptParser.As);
				this.state = 823;
				this.identifierName();
				}
			}

			this.state = 826;
			this.match(TypeScriptParser.From);
			this.state = 827;
			this.match(TypeScriptParser.StringLiteral);
			this.state = 828;
			this.eos();
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
	public multipleImportStatement(): MultipleImportStatementContext {
		let _localctx: MultipleImportStatementContext = new MultipleImportStatementContext(this._ctx, this.state);
		this.enterRule(_localctx, 134, TypeScriptParser.RULE_multipleImportStatement);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 833;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 55)) & ~0x1F) === 0 && ((1 << (_la - 55)) & ((1 << (TypeScriptParser.NullLiteral - 55)) | (1 << (TypeScriptParser.BooleanLiteral - 55)) | (1 << (TypeScriptParser.Break - 55)) | (1 << (TypeScriptParser.Do - 55)) | (1 << (TypeScriptParser.Instanceof - 55)) | (1 << (TypeScriptParser.Typeof - 55)) | (1 << (TypeScriptParser.Case - 55)) | (1 << (TypeScriptParser.Else - 55)) | (1 << (TypeScriptParser.New - 55)) | (1 << (TypeScriptParser.Var - 55)) | (1 << (TypeScriptParser.Catch - 55)) | (1 << (TypeScriptParser.Finally - 55)) | (1 << (TypeScriptParser.Return - 55)) | (1 << (TypeScriptParser.Void - 55)) | (1 << (TypeScriptParser.Continue - 55)) | (1 << (TypeScriptParser.For - 55)) | (1 << (TypeScriptParser.Switch - 55)) | (1 << (TypeScriptParser.While - 55)) | (1 << (TypeScriptParser.Debugger - 55)) | (1 << (TypeScriptParser.Function_ - 55)) | (1 << (TypeScriptParser.This - 55)) | (1 << (TypeScriptParser.With - 55)) | (1 << (TypeScriptParser.Default - 55)) | (1 << (TypeScriptParser.If - 55)) | (1 << (TypeScriptParser.Throw - 55)) | (1 << (TypeScriptParser.Delete - 55)) | (1 << (TypeScriptParser.In - 55)))) !== 0) || ((((_la - 87)) & ~0x1F) === 0 && ((1 << (_la - 87)) & ((1 << (TypeScriptParser.Try - 87)) | (1 << (TypeScriptParser.From - 87)) | (1 << (TypeScriptParser.ReadOnly - 87)) | (1 << (TypeScriptParser.Async - 87)) | (1 << (TypeScriptParser.Class - 87)) | (1 << (TypeScriptParser.Enum - 87)) | (1 << (TypeScriptParser.Extends - 87)) | (1 << (TypeScriptParser.Super - 87)) | (1 << (TypeScriptParser.Const - 87)) | (1 << (TypeScriptParser.Export - 87)) | (1 << (TypeScriptParser.Import - 87)) | (1 << (TypeScriptParser.Implements - 87)) | (1 << (TypeScriptParser.Let - 87)) | (1 << (TypeScriptParser.Private - 87)) | (1 << (TypeScriptParser.Public - 87)) | (1 << (TypeScriptParser.Interface - 87)) | (1 << (TypeScriptParser.Package - 87)) | (1 << (TypeScriptParser.Protected - 87)) | (1 << (TypeScriptParser.Static - 87)) | (1 << (TypeScriptParser.Yield - 87)) | (1 << (TypeScriptParser.String - 87)) | (1 << (TypeScriptParser.TypeAlias - 87)) | (1 << (TypeScriptParser.Get - 87)) | (1 << (TypeScriptParser.Set - 87)) | (1 << (TypeScriptParser.Require - 87)))) !== 0) || _la === TypeScriptParser.Identifier) {
				{
				this.state = 830;
				this.identifierName();
				this.state = 831;
				this.match(TypeScriptParser.Comma);
				}
			}

			this.state = 835;
			this.match(TypeScriptParser.OpenBrace);
			this.state = 836;
			this.identifierName();
			this.state = 841;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === TypeScriptParser.Comma) {
				{
				{
				this.state = 837;
				this.match(TypeScriptParser.Comma);
				this.state = 838;
				this.identifierName();
				}
				}
				this.state = 843;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 844;
			this.match(TypeScriptParser.CloseBrace);
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
	public exportStatement(): ExportStatementContext {
		let _localctx: ExportStatementContext = new ExportStatementContext(this._ctx, this.state);
		this.enterRule(_localctx, 136, TypeScriptParser.RULE_exportStatement);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 846;
			this.match(TypeScriptParser.Export);
			this.state = 848;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 87, this._ctx) ) {
			case 1:
				{
				this.state = 847;
				this.match(TypeScriptParser.Default);
				}
				break;
			}
			this.state = 852;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 88, this._ctx) ) {
			case 1:
				{
				this.state = 850;
				this.fromBlock();
				}
				break;

			case 2:
				{
				this.state = 851;
				this.statement();
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
	public variableStatement(): VariableStatementContext {
		let _localctx: VariableStatementContext = new VariableStatementContext(this._ctx, this.state);
		this.enterRule(_localctx, 138, TypeScriptParser.RULE_variableStatement);
		let _la: number;
		try {
			this.state = 883;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 97, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 854;
				this.bindingPattern();
				this.state = 856;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === TypeScriptParser.Colon) {
					{
					this.state = 855;
					this.typeAnnotation();
					}
				}

				this.state = 858;
				this.initializer();
				this.state = 860;
				this._errHandler.sync(this);
				switch ( this.interpreter.adaptivePredict(this._input, 90, this._ctx) ) {
				case 1:
					{
					this.state = 859;
					this.match(TypeScriptParser.SemiColon);
					}
					break;
				}
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 863;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (((((_la - 101)) & ~0x1F) === 0 && ((1 << (_la - 101)) & ((1 << (TypeScriptParser.Private - 101)) | (1 << (TypeScriptParser.Public - 101)) | (1 << (TypeScriptParser.Protected - 101)))) !== 0)) {
					{
					this.state = 862;
					this.accessibilityModifier();
					}
				}

				this.state = 866;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (((((_la - 69)) & ~0x1F) === 0 && ((1 << (_la - 69)) & ((1 << (TypeScriptParser.Var - 69)) | (1 << (TypeScriptParser.Const - 69)) | (1 << (TypeScriptParser.Let - 69)))) !== 0)) {
					{
					this.state = 865;
					this.varModifier();
					}
				}

				this.state = 869;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === TypeScriptParser.ReadOnly) {
					{
					this.state = 868;
					this.match(TypeScriptParser.ReadOnly);
					}
				}

				this.state = 871;
				this.variableDeclarationList();
				this.state = 873;
				this._errHandler.sync(this);
				switch ( this.interpreter.adaptivePredict(this._input, 94, this._ctx) ) {
				case 1:
					{
					this.state = 872;
					this.match(TypeScriptParser.SemiColon);
					}
					break;
				}
				}
				break;

			case 3:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 875;
				this.match(TypeScriptParser.Declare);
				this.state = 877;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (((((_la - 69)) & ~0x1F) === 0 && ((1 << (_la - 69)) & ((1 << (TypeScriptParser.Var - 69)) | (1 << (TypeScriptParser.Const - 69)) | (1 << (TypeScriptParser.Let - 69)))) !== 0)) {
					{
					this.state = 876;
					this.varModifier();
					}
				}

				this.state = 879;
				this.variableDeclarationList();
				this.state = 881;
				this._errHandler.sync(this);
				switch ( this.interpreter.adaptivePredict(this._input, 96, this._ctx) ) {
				case 1:
					{
					this.state = 880;
					this.match(TypeScriptParser.SemiColon);
					}
					break;
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
	public variableDeclarationList(): VariableDeclarationListContext {
		let _localctx: VariableDeclarationListContext = new VariableDeclarationListContext(this._ctx, this.state);
		this.enterRule(_localctx, 140, TypeScriptParser.RULE_variableDeclarationList);
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 885;
			this.variableDeclaration();
			this.state = 890;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 98, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 886;
					this.match(TypeScriptParser.Comma);
					this.state = 887;
					this.variableDeclaration();
					}
					}
				}
				this.state = 892;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 98, this._ctx);
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
	public variableDeclaration(): VariableDeclarationContext {
		let _localctx: VariableDeclarationContext = new VariableDeclarationContext(this._ctx, this.state);
		this.enterRule(_localctx, 142, TypeScriptParser.RULE_variableDeclaration);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 896;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case TypeScriptParser.TypeAlias:
			case TypeScriptParser.Require:
			case TypeScriptParser.Identifier:
				{
				this.state = 893;
				this.identifierOrKeyWord();
				}
				break;
			case TypeScriptParser.OpenBracket:
				{
				this.state = 894;
				this.arrayLiteral();
				}
				break;
			case TypeScriptParser.OpenBrace:
				{
				this.state = 895;
				this.objectLiteral();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			this.state = 899;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 100, this._ctx) ) {
			case 1:
				{
				this.state = 898;
				this.typeAnnotation();
				}
				break;
			}
			this.state = 902;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 101, this._ctx) ) {
			case 1:
				{
				this.state = 901;
				this.singleExpression(0);
				}
				break;
			}
			this.state = 909;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 103, this._ctx) ) {
			case 1:
				{
				this.state = 904;
				this.match(TypeScriptParser.Assign);
				this.state = 906;
				this._errHandler.sync(this);
				switch ( this.interpreter.adaptivePredict(this._input, 102, this._ctx) ) {
				case 1:
					{
					this.state = 905;
					this.typeParameters();
					}
					break;
				}
				this.state = 908;
				this.singleExpression(0);
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
	public emptyStatement_(): EmptyStatement_Context {
		let _localctx: EmptyStatement_Context = new EmptyStatement_Context(this._ctx, this.state);
		this.enterRule(_localctx, 144, TypeScriptParser.RULE_emptyStatement_);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 911;
			this.match(TypeScriptParser.SemiColon);
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
		this.enterRule(_localctx, 146, TypeScriptParser.RULE_expressionStatement);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 913;
			if (!(this.notOpenBraceAndNotFunction())) {
				throw this.createFailedPredicateException("this.notOpenBraceAndNotFunction()");
			}
			this.state = 914;
			this.expressionSequence();
			this.state = 916;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 104, this._ctx) ) {
			case 1:
				{
				this.state = 915;
				this.match(TypeScriptParser.SemiColon);
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
	public ifStatement(): IfStatementContext {
		let _localctx: IfStatementContext = new IfStatementContext(this._ctx, this.state);
		this.enterRule(_localctx, 148, TypeScriptParser.RULE_ifStatement);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 918;
			this.match(TypeScriptParser.If);
			this.state = 919;
			this.match(TypeScriptParser.OpenParen);
			this.state = 920;
			this.expressionSequence();
			this.state = 921;
			this.match(TypeScriptParser.CloseParen);
			this.state = 922;
			this.statement();
			this.state = 925;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 105, this._ctx) ) {
			case 1:
				{
				this.state = 923;
				this.match(TypeScriptParser.Else);
				this.state = 924;
				this.statement();
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
	public iterationStatement(): IterationStatementContext {
		let _localctx: IterationStatementContext = new IterationStatementContext(this._ctx, this.state);
		this.enterRule(_localctx, 150, TypeScriptParser.RULE_iterationStatement);
		let _la: number;
		try {
			this.state = 996;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 113, this._ctx) ) {
			case 1:
				_localctx = new DoStatementContext(_localctx);
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 927;
				this.match(TypeScriptParser.Do);
				this.state = 928;
				this.statement();
				this.state = 929;
				this.match(TypeScriptParser.While);
				this.state = 930;
				this.match(TypeScriptParser.OpenParen);
				this.state = 931;
				this.expressionSequence();
				this.state = 932;
				this.match(TypeScriptParser.CloseParen);
				this.state = 933;
				this.eos();
				}
				break;

			case 2:
				_localctx = new WhileStatementContext(_localctx);
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 935;
				this.match(TypeScriptParser.While);
				this.state = 936;
				this.match(TypeScriptParser.OpenParen);
				this.state = 937;
				this.expressionSequence();
				this.state = 938;
				this.match(TypeScriptParser.CloseParen);
				this.state = 939;
				this.statement();
				}
				break;

			case 3:
				_localctx = new ForStatementContext(_localctx);
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 941;
				this.match(TypeScriptParser.For);
				this.state = 942;
				this.match(TypeScriptParser.OpenParen);
				this.state = 944;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << TypeScriptParser.RegularExpressionLiteral) | (1 << TypeScriptParser.OpenBracket) | (1 << TypeScriptParser.OpenParen) | (1 << TypeScriptParser.OpenBrace) | (1 << TypeScriptParser.PlusPlus) | (1 << TypeScriptParser.MinusMinus) | (1 << TypeScriptParser.Plus) | (1 << TypeScriptParser.Minus) | (1 << TypeScriptParser.BitNot) | (1 << TypeScriptParser.Not) | (1 << TypeScriptParser.LessThan))) !== 0) || ((((_la - 55)) & ~0x1F) === 0 && ((1 << (_la - 55)) & ((1 << (TypeScriptParser.NullLiteral - 55)) | (1 << (TypeScriptParser.BooleanLiteral - 55)) | (1 << (TypeScriptParser.DecimalLiteral - 55)) | (1 << (TypeScriptParser.HexIntegerLiteral - 55)) | (1 << (TypeScriptParser.OctalIntegerLiteral - 55)) | (1 << (TypeScriptParser.OctalIntegerLiteral2 - 55)) | (1 << (TypeScriptParser.BinaryIntegerLiteral - 55)) | (1 << (TypeScriptParser.Break - 55)) | (1 << (TypeScriptParser.Do - 55)) | (1 << (TypeScriptParser.Instanceof - 55)) | (1 << (TypeScriptParser.Typeof - 55)) | (1 << (TypeScriptParser.Case - 55)) | (1 << (TypeScriptParser.Else - 55)) | (1 << (TypeScriptParser.New - 55)) | (1 << (TypeScriptParser.Var - 55)) | (1 << (TypeScriptParser.Catch - 55)) | (1 << (TypeScriptParser.Finally - 55)) | (1 << (TypeScriptParser.Return - 55)) | (1 << (TypeScriptParser.Void - 55)) | (1 << (TypeScriptParser.Continue - 55)) | (1 << (TypeScriptParser.For - 55)) | (1 << (TypeScriptParser.Switch - 55)) | (1 << (TypeScriptParser.While - 55)) | (1 << (TypeScriptParser.Debugger - 55)) | (1 << (TypeScriptParser.Function_ - 55)) | (1 << (TypeScriptParser.This - 55)) | (1 << (TypeScriptParser.With - 55)) | (1 << (TypeScriptParser.Default - 55)) | (1 << (TypeScriptParser.If - 55)) | (1 << (TypeScriptParser.Throw - 55)) | (1 << (TypeScriptParser.Delete - 55)) | (1 << (TypeScriptParser.In - 55)))) !== 0) || ((((_la - 87)) & ~0x1F) === 0 && ((1 << (_la - 87)) & ((1 << (TypeScriptParser.Try - 87)) | (1 << (TypeScriptParser.From - 87)) | (1 << (TypeScriptParser.ReadOnly - 87)) | (1 << (TypeScriptParser.Async - 87)) | (1 << (TypeScriptParser.Class - 87)) | (1 << (TypeScriptParser.Enum - 87)) | (1 << (TypeScriptParser.Extends - 87)) | (1 << (TypeScriptParser.Super - 87)) | (1 << (TypeScriptParser.Const - 87)) | (1 << (TypeScriptParser.Export - 87)) | (1 << (TypeScriptParser.Import - 87)) | (1 << (TypeScriptParser.Implements - 87)) | (1 << (TypeScriptParser.Let - 87)) | (1 << (TypeScriptParser.Private - 87)) | (1 << (TypeScriptParser.Public - 87)) | (1 << (TypeScriptParser.Interface - 87)) | (1 << (TypeScriptParser.Package - 87)) | (1 << (TypeScriptParser.Protected - 87)) | (1 << (TypeScriptParser.Static - 87)) | (1 << (TypeScriptParser.Yield - 87)) | (1 << (TypeScriptParser.String - 87)) | (1 << (TypeScriptParser.TypeAlias - 87)) | (1 << (TypeScriptParser.Get - 87)) | (1 << (TypeScriptParser.Set - 87)) | (1 << (TypeScriptParser.Require - 87)))) !== 0) || ((((_la - 124)) & ~0x1F) === 0 && ((1 << (_la - 124)) & ((1 << (TypeScriptParser.Identifier - 124)) | (1 << (TypeScriptParser.StringLiteral - 124)) | (1 << (TypeScriptParser.BackTick - 124)))) !== 0)) {
					{
					this.state = 943;
					this.expressionSequence();
					}
				}

				this.state = 946;
				this.match(TypeScriptParser.SemiColon);
				this.state = 948;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << TypeScriptParser.RegularExpressionLiteral) | (1 << TypeScriptParser.OpenBracket) | (1 << TypeScriptParser.OpenParen) | (1 << TypeScriptParser.OpenBrace) | (1 << TypeScriptParser.PlusPlus) | (1 << TypeScriptParser.MinusMinus) | (1 << TypeScriptParser.Plus) | (1 << TypeScriptParser.Minus) | (1 << TypeScriptParser.BitNot) | (1 << TypeScriptParser.Not) | (1 << TypeScriptParser.LessThan))) !== 0) || ((((_la - 55)) & ~0x1F) === 0 && ((1 << (_la - 55)) & ((1 << (TypeScriptParser.NullLiteral - 55)) | (1 << (TypeScriptParser.BooleanLiteral - 55)) | (1 << (TypeScriptParser.DecimalLiteral - 55)) | (1 << (TypeScriptParser.HexIntegerLiteral - 55)) | (1 << (TypeScriptParser.OctalIntegerLiteral - 55)) | (1 << (TypeScriptParser.OctalIntegerLiteral2 - 55)) | (1 << (TypeScriptParser.BinaryIntegerLiteral - 55)) | (1 << (TypeScriptParser.Break - 55)) | (1 << (TypeScriptParser.Do - 55)) | (1 << (TypeScriptParser.Instanceof - 55)) | (1 << (TypeScriptParser.Typeof - 55)) | (1 << (TypeScriptParser.Case - 55)) | (1 << (TypeScriptParser.Else - 55)) | (1 << (TypeScriptParser.New - 55)) | (1 << (TypeScriptParser.Var - 55)) | (1 << (TypeScriptParser.Catch - 55)) | (1 << (TypeScriptParser.Finally - 55)) | (1 << (TypeScriptParser.Return - 55)) | (1 << (TypeScriptParser.Void - 55)) | (1 << (TypeScriptParser.Continue - 55)) | (1 << (TypeScriptParser.For - 55)) | (1 << (TypeScriptParser.Switch - 55)) | (1 << (TypeScriptParser.While - 55)) | (1 << (TypeScriptParser.Debugger - 55)) | (1 << (TypeScriptParser.Function_ - 55)) | (1 << (TypeScriptParser.This - 55)) | (1 << (TypeScriptParser.With - 55)) | (1 << (TypeScriptParser.Default - 55)) | (1 << (TypeScriptParser.If - 55)) | (1 << (TypeScriptParser.Throw - 55)) | (1 << (TypeScriptParser.Delete - 55)) | (1 << (TypeScriptParser.In - 55)))) !== 0) || ((((_la - 87)) & ~0x1F) === 0 && ((1 << (_la - 87)) & ((1 << (TypeScriptParser.Try - 87)) | (1 << (TypeScriptParser.From - 87)) | (1 << (TypeScriptParser.ReadOnly - 87)) | (1 << (TypeScriptParser.Async - 87)) | (1 << (TypeScriptParser.Class - 87)) | (1 << (TypeScriptParser.Enum - 87)) | (1 << (TypeScriptParser.Extends - 87)) | (1 << (TypeScriptParser.Super - 87)) | (1 << (TypeScriptParser.Const - 87)) | (1 << (TypeScriptParser.Export - 87)) | (1 << (TypeScriptParser.Import - 87)) | (1 << (TypeScriptParser.Implements - 87)) | (1 << (TypeScriptParser.Let - 87)) | (1 << (TypeScriptParser.Private - 87)) | (1 << (TypeScriptParser.Public - 87)) | (1 << (TypeScriptParser.Interface - 87)) | (1 << (TypeScriptParser.Package - 87)) | (1 << (TypeScriptParser.Protected - 87)) | (1 << (TypeScriptParser.Static - 87)) | (1 << (TypeScriptParser.Yield - 87)) | (1 << (TypeScriptParser.String - 87)) | (1 << (TypeScriptParser.TypeAlias - 87)) | (1 << (TypeScriptParser.Get - 87)) | (1 << (TypeScriptParser.Set - 87)) | (1 << (TypeScriptParser.Require - 87)))) !== 0) || ((((_la - 124)) & ~0x1F) === 0 && ((1 << (_la - 124)) & ((1 << (TypeScriptParser.Identifier - 124)) | (1 << (TypeScriptParser.StringLiteral - 124)) | (1 << (TypeScriptParser.BackTick - 124)))) !== 0)) {
					{
					this.state = 947;
					this.expressionSequence();
					}
				}

				this.state = 950;
				this.match(TypeScriptParser.SemiColon);
				this.state = 952;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << TypeScriptParser.RegularExpressionLiteral) | (1 << TypeScriptParser.OpenBracket) | (1 << TypeScriptParser.OpenParen) | (1 << TypeScriptParser.OpenBrace) | (1 << TypeScriptParser.PlusPlus) | (1 << TypeScriptParser.MinusMinus) | (1 << TypeScriptParser.Plus) | (1 << TypeScriptParser.Minus) | (1 << TypeScriptParser.BitNot) | (1 << TypeScriptParser.Not) | (1 << TypeScriptParser.LessThan))) !== 0) || ((((_la - 55)) & ~0x1F) === 0 && ((1 << (_la - 55)) & ((1 << (TypeScriptParser.NullLiteral - 55)) | (1 << (TypeScriptParser.BooleanLiteral - 55)) | (1 << (TypeScriptParser.DecimalLiteral - 55)) | (1 << (TypeScriptParser.HexIntegerLiteral - 55)) | (1 << (TypeScriptParser.OctalIntegerLiteral - 55)) | (1 << (TypeScriptParser.OctalIntegerLiteral2 - 55)) | (1 << (TypeScriptParser.BinaryIntegerLiteral - 55)) | (1 << (TypeScriptParser.Break - 55)) | (1 << (TypeScriptParser.Do - 55)) | (1 << (TypeScriptParser.Instanceof - 55)) | (1 << (TypeScriptParser.Typeof - 55)) | (1 << (TypeScriptParser.Case - 55)) | (1 << (TypeScriptParser.Else - 55)) | (1 << (TypeScriptParser.New - 55)) | (1 << (TypeScriptParser.Var - 55)) | (1 << (TypeScriptParser.Catch - 55)) | (1 << (TypeScriptParser.Finally - 55)) | (1 << (TypeScriptParser.Return - 55)) | (1 << (TypeScriptParser.Void - 55)) | (1 << (TypeScriptParser.Continue - 55)) | (1 << (TypeScriptParser.For - 55)) | (1 << (TypeScriptParser.Switch - 55)) | (1 << (TypeScriptParser.While - 55)) | (1 << (TypeScriptParser.Debugger - 55)) | (1 << (TypeScriptParser.Function_ - 55)) | (1 << (TypeScriptParser.This - 55)) | (1 << (TypeScriptParser.With - 55)) | (1 << (TypeScriptParser.Default - 55)) | (1 << (TypeScriptParser.If - 55)) | (1 << (TypeScriptParser.Throw - 55)) | (1 << (TypeScriptParser.Delete - 55)) | (1 << (TypeScriptParser.In - 55)))) !== 0) || ((((_la - 87)) & ~0x1F) === 0 && ((1 << (_la - 87)) & ((1 << (TypeScriptParser.Try - 87)) | (1 << (TypeScriptParser.From - 87)) | (1 << (TypeScriptParser.ReadOnly - 87)) | (1 << (TypeScriptParser.Async - 87)) | (1 << (TypeScriptParser.Class - 87)) | (1 << (TypeScriptParser.Enum - 87)) | (1 << (TypeScriptParser.Extends - 87)) | (1 << (TypeScriptParser.Super - 87)) | (1 << (TypeScriptParser.Const - 87)) | (1 << (TypeScriptParser.Export - 87)) | (1 << (TypeScriptParser.Import - 87)) | (1 << (TypeScriptParser.Implements - 87)) | (1 << (TypeScriptParser.Let - 87)) | (1 << (TypeScriptParser.Private - 87)) | (1 << (TypeScriptParser.Public - 87)) | (1 << (TypeScriptParser.Interface - 87)) | (1 << (TypeScriptParser.Package - 87)) | (1 << (TypeScriptParser.Protected - 87)) | (1 << (TypeScriptParser.Static - 87)) | (1 << (TypeScriptParser.Yield - 87)) | (1 << (TypeScriptParser.String - 87)) | (1 << (TypeScriptParser.TypeAlias - 87)) | (1 << (TypeScriptParser.Get - 87)) | (1 << (TypeScriptParser.Set - 87)) | (1 << (TypeScriptParser.Require - 87)))) !== 0) || ((((_la - 124)) & ~0x1F) === 0 && ((1 << (_la - 124)) & ((1 << (TypeScriptParser.Identifier - 124)) | (1 << (TypeScriptParser.StringLiteral - 124)) | (1 << (TypeScriptParser.BackTick - 124)))) !== 0)) {
					{
					this.state = 951;
					this.expressionSequence();
					}
				}

				this.state = 954;
				this.match(TypeScriptParser.CloseParen);
				this.state = 955;
				this.statement();
				}
				break;

			case 4:
				_localctx = new ForVarStatementContext(_localctx);
				this.enterOuterAlt(_localctx, 4);
				{
				this.state = 956;
				this.match(TypeScriptParser.For);
				this.state = 957;
				this.match(TypeScriptParser.OpenParen);
				this.state = 958;
				this.varModifier();
				this.state = 959;
				this.variableDeclarationList();
				this.state = 960;
				this.match(TypeScriptParser.SemiColon);
				this.state = 962;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << TypeScriptParser.RegularExpressionLiteral) | (1 << TypeScriptParser.OpenBracket) | (1 << TypeScriptParser.OpenParen) | (1 << TypeScriptParser.OpenBrace) | (1 << TypeScriptParser.PlusPlus) | (1 << TypeScriptParser.MinusMinus) | (1 << TypeScriptParser.Plus) | (1 << TypeScriptParser.Minus) | (1 << TypeScriptParser.BitNot) | (1 << TypeScriptParser.Not) | (1 << TypeScriptParser.LessThan))) !== 0) || ((((_la - 55)) & ~0x1F) === 0 && ((1 << (_la - 55)) & ((1 << (TypeScriptParser.NullLiteral - 55)) | (1 << (TypeScriptParser.BooleanLiteral - 55)) | (1 << (TypeScriptParser.DecimalLiteral - 55)) | (1 << (TypeScriptParser.HexIntegerLiteral - 55)) | (1 << (TypeScriptParser.OctalIntegerLiteral - 55)) | (1 << (TypeScriptParser.OctalIntegerLiteral2 - 55)) | (1 << (TypeScriptParser.BinaryIntegerLiteral - 55)) | (1 << (TypeScriptParser.Break - 55)) | (1 << (TypeScriptParser.Do - 55)) | (1 << (TypeScriptParser.Instanceof - 55)) | (1 << (TypeScriptParser.Typeof - 55)) | (1 << (TypeScriptParser.Case - 55)) | (1 << (TypeScriptParser.Else - 55)) | (1 << (TypeScriptParser.New - 55)) | (1 << (TypeScriptParser.Var - 55)) | (1 << (TypeScriptParser.Catch - 55)) | (1 << (TypeScriptParser.Finally - 55)) | (1 << (TypeScriptParser.Return - 55)) | (1 << (TypeScriptParser.Void - 55)) | (1 << (TypeScriptParser.Continue - 55)) | (1 << (TypeScriptParser.For - 55)) | (1 << (TypeScriptParser.Switch - 55)) | (1 << (TypeScriptParser.While - 55)) | (1 << (TypeScriptParser.Debugger - 55)) | (1 << (TypeScriptParser.Function_ - 55)) | (1 << (TypeScriptParser.This - 55)) | (1 << (TypeScriptParser.With - 55)) | (1 << (TypeScriptParser.Default - 55)) | (1 << (TypeScriptParser.If - 55)) | (1 << (TypeScriptParser.Throw - 55)) | (1 << (TypeScriptParser.Delete - 55)) | (1 << (TypeScriptParser.In - 55)))) !== 0) || ((((_la - 87)) & ~0x1F) === 0 && ((1 << (_la - 87)) & ((1 << (TypeScriptParser.Try - 87)) | (1 << (TypeScriptParser.From - 87)) | (1 << (TypeScriptParser.ReadOnly - 87)) | (1 << (TypeScriptParser.Async - 87)) | (1 << (TypeScriptParser.Class - 87)) | (1 << (TypeScriptParser.Enum - 87)) | (1 << (TypeScriptParser.Extends - 87)) | (1 << (TypeScriptParser.Super - 87)) | (1 << (TypeScriptParser.Const - 87)) | (1 << (TypeScriptParser.Export - 87)) | (1 << (TypeScriptParser.Import - 87)) | (1 << (TypeScriptParser.Implements - 87)) | (1 << (TypeScriptParser.Let - 87)) | (1 << (TypeScriptParser.Private - 87)) | (1 << (TypeScriptParser.Public - 87)) | (1 << (TypeScriptParser.Interface - 87)) | (1 << (TypeScriptParser.Package - 87)) | (1 << (TypeScriptParser.Protected - 87)) | (1 << (TypeScriptParser.Static - 87)) | (1 << (TypeScriptParser.Yield - 87)) | (1 << (TypeScriptParser.String - 87)) | (1 << (TypeScriptParser.TypeAlias - 87)) | (1 << (TypeScriptParser.Get - 87)) | (1 << (TypeScriptParser.Set - 87)) | (1 << (TypeScriptParser.Require - 87)))) !== 0) || ((((_la - 124)) & ~0x1F) === 0 && ((1 << (_la - 124)) & ((1 << (TypeScriptParser.Identifier - 124)) | (1 << (TypeScriptParser.StringLiteral - 124)) | (1 << (TypeScriptParser.BackTick - 124)))) !== 0)) {
					{
					this.state = 961;
					this.expressionSequence();
					}
				}

				this.state = 964;
				this.match(TypeScriptParser.SemiColon);
				this.state = 966;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << TypeScriptParser.RegularExpressionLiteral) | (1 << TypeScriptParser.OpenBracket) | (1 << TypeScriptParser.OpenParen) | (1 << TypeScriptParser.OpenBrace) | (1 << TypeScriptParser.PlusPlus) | (1 << TypeScriptParser.MinusMinus) | (1 << TypeScriptParser.Plus) | (1 << TypeScriptParser.Minus) | (1 << TypeScriptParser.BitNot) | (1 << TypeScriptParser.Not) | (1 << TypeScriptParser.LessThan))) !== 0) || ((((_la - 55)) & ~0x1F) === 0 && ((1 << (_la - 55)) & ((1 << (TypeScriptParser.NullLiteral - 55)) | (1 << (TypeScriptParser.BooleanLiteral - 55)) | (1 << (TypeScriptParser.DecimalLiteral - 55)) | (1 << (TypeScriptParser.HexIntegerLiteral - 55)) | (1 << (TypeScriptParser.OctalIntegerLiteral - 55)) | (1 << (TypeScriptParser.OctalIntegerLiteral2 - 55)) | (1 << (TypeScriptParser.BinaryIntegerLiteral - 55)) | (1 << (TypeScriptParser.Break - 55)) | (1 << (TypeScriptParser.Do - 55)) | (1 << (TypeScriptParser.Instanceof - 55)) | (1 << (TypeScriptParser.Typeof - 55)) | (1 << (TypeScriptParser.Case - 55)) | (1 << (TypeScriptParser.Else - 55)) | (1 << (TypeScriptParser.New - 55)) | (1 << (TypeScriptParser.Var - 55)) | (1 << (TypeScriptParser.Catch - 55)) | (1 << (TypeScriptParser.Finally - 55)) | (1 << (TypeScriptParser.Return - 55)) | (1 << (TypeScriptParser.Void - 55)) | (1 << (TypeScriptParser.Continue - 55)) | (1 << (TypeScriptParser.For - 55)) | (1 << (TypeScriptParser.Switch - 55)) | (1 << (TypeScriptParser.While - 55)) | (1 << (TypeScriptParser.Debugger - 55)) | (1 << (TypeScriptParser.Function_ - 55)) | (1 << (TypeScriptParser.This - 55)) | (1 << (TypeScriptParser.With - 55)) | (1 << (TypeScriptParser.Default - 55)) | (1 << (TypeScriptParser.If - 55)) | (1 << (TypeScriptParser.Throw - 55)) | (1 << (TypeScriptParser.Delete - 55)) | (1 << (TypeScriptParser.In - 55)))) !== 0) || ((((_la - 87)) & ~0x1F) === 0 && ((1 << (_la - 87)) & ((1 << (TypeScriptParser.Try - 87)) | (1 << (TypeScriptParser.From - 87)) | (1 << (TypeScriptParser.ReadOnly - 87)) | (1 << (TypeScriptParser.Async - 87)) | (1 << (TypeScriptParser.Class - 87)) | (1 << (TypeScriptParser.Enum - 87)) | (1 << (TypeScriptParser.Extends - 87)) | (1 << (TypeScriptParser.Super - 87)) | (1 << (TypeScriptParser.Const - 87)) | (1 << (TypeScriptParser.Export - 87)) | (1 << (TypeScriptParser.Import - 87)) | (1 << (TypeScriptParser.Implements - 87)) | (1 << (TypeScriptParser.Let - 87)) | (1 << (TypeScriptParser.Private - 87)) | (1 << (TypeScriptParser.Public - 87)) | (1 << (TypeScriptParser.Interface - 87)) | (1 << (TypeScriptParser.Package - 87)) | (1 << (TypeScriptParser.Protected - 87)) | (1 << (TypeScriptParser.Static - 87)) | (1 << (TypeScriptParser.Yield - 87)) | (1 << (TypeScriptParser.String - 87)) | (1 << (TypeScriptParser.TypeAlias - 87)) | (1 << (TypeScriptParser.Get - 87)) | (1 << (TypeScriptParser.Set - 87)) | (1 << (TypeScriptParser.Require - 87)))) !== 0) || ((((_la - 124)) & ~0x1F) === 0 && ((1 << (_la - 124)) & ((1 << (TypeScriptParser.Identifier - 124)) | (1 << (TypeScriptParser.StringLiteral - 124)) | (1 << (TypeScriptParser.BackTick - 124)))) !== 0)) {
					{
					this.state = 965;
					this.expressionSequence();
					}
				}

				this.state = 968;
				this.match(TypeScriptParser.CloseParen);
				this.state = 969;
				this.statement();
				}
				break;

			case 5:
				_localctx = new ForInStatementContext(_localctx);
				this.enterOuterAlt(_localctx, 5);
				{
				this.state = 971;
				this.match(TypeScriptParser.For);
				this.state = 972;
				this.match(TypeScriptParser.OpenParen);
				this.state = 973;
				this.singleExpression(0);
				this.state = 977;
				this._errHandler.sync(this);
				switch (this._input.LA(1)) {
				case TypeScriptParser.In:
					{
					this.state = 974;
					this.match(TypeScriptParser.In);
					}
					break;
				case TypeScriptParser.Identifier:
					{
					this.state = 975;
					this.match(TypeScriptParser.Identifier);
					this.state = 976;
					if (!(this.p("of"))) {
						throw this.createFailedPredicateException("this.p(\"of\")");
					}
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				this.state = 979;
				this.expressionSequence();
				this.state = 980;
				this.match(TypeScriptParser.CloseParen);
				this.state = 981;
				this.statement();
				}
				break;

			case 6:
				_localctx = new ForVarInStatementContext(_localctx);
				this.enterOuterAlt(_localctx, 6);
				{
				this.state = 983;
				this.match(TypeScriptParser.For);
				this.state = 984;
				this.match(TypeScriptParser.OpenParen);
				this.state = 985;
				this.varModifier();
				this.state = 986;
				this.variableDeclaration();
				this.state = 990;
				this._errHandler.sync(this);
				switch (this._input.LA(1)) {
				case TypeScriptParser.In:
					{
					this.state = 987;
					this.match(TypeScriptParser.In);
					}
					break;
				case TypeScriptParser.Identifier:
					{
					this.state = 988;
					this.match(TypeScriptParser.Identifier);
					this.state = 989;
					if (!(this.p("of"))) {
						throw this.createFailedPredicateException("this.p(\"of\")");
					}
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				this.state = 992;
				this.expressionSequence();
				this.state = 993;
				this.match(TypeScriptParser.CloseParen);
				this.state = 994;
				this.statement();
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
	public varModifier(): VarModifierContext {
		let _localctx: VarModifierContext = new VarModifierContext(this._ctx, this.state);
		this.enterRule(_localctx, 152, TypeScriptParser.RULE_varModifier);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 998;
			_la = this._input.LA(1);
			if (!(((((_la - 69)) & ~0x1F) === 0 && ((1 << (_la - 69)) & ((1 << (TypeScriptParser.Var - 69)) | (1 << (TypeScriptParser.Const - 69)) | (1 << (TypeScriptParser.Let - 69)))) !== 0))) {
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
	public continueStatement(): ContinueStatementContext {
		let _localctx: ContinueStatementContext = new ContinueStatementContext(this._ctx, this.state);
		this.enterRule(_localctx, 154, TypeScriptParser.RULE_continueStatement);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1000;
			this.match(TypeScriptParser.Continue);
			this.state = 1003;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 114, this._ctx) ) {
			case 1:
				{
				this.state = 1001;
				if (!(this.notLineTerminator())) {
					throw this.createFailedPredicateException("this.notLineTerminator()");
				}
				this.state = 1002;
				this.match(TypeScriptParser.Identifier);
				}
				break;
			}
			this.state = 1005;
			this.eos();
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
	public breakStatement(): BreakStatementContext {
		let _localctx: BreakStatementContext = new BreakStatementContext(this._ctx, this.state);
		this.enterRule(_localctx, 156, TypeScriptParser.RULE_breakStatement);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1007;
			this.match(TypeScriptParser.Break);
			this.state = 1010;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 115, this._ctx) ) {
			case 1:
				{
				this.state = 1008;
				if (!(this.notLineTerminator())) {
					throw this.createFailedPredicateException("this.notLineTerminator()");
				}
				this.state = 1009;
				this.match(TypeScriptParser.Identifier);
				}
				break;
			}
			this.state = 1012;
			this.eos();
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
	public returnStatement(): ReturnStatementContext {
		let _localctx: ReturnStatementContext = new ReturnStatementContext(this._ctx, this.state);
		this.enterRule(_localctx, 158, TypeScriptParser.RULE_returnStatement);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1014;
			this.match(TypeScriptParser.Return);
			this.state = 1017;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 116, this._ctx) ) {
			case 1:
				{
				this.state = 1015;
				if (!(this.notLineTerminator())) {
					throw this.createFailedPredicateException("this.notLineTerminator()");
				}
				this.state = 1016;
				this.expressionSequence();
				}
				break;
			}
			this.state = 1019;
			this.eos();
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
	public yieldStatement(): YieldStatementContext {
		let _localctx: YieldStatementContext = new YieldStatementContext(this._ctx, this.state);
		this.enterRule(_localctx, 160, TypeScriptParser.RULE_yieldStatement);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1021;
			this.match(TypeScriptParser.Yield);
			this.state = 1024;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 117, this._ctx) ) {
			case 1:
				{
				this.state = 1022;
				if (!(this.notLineTerminator())) {
					throw this.createFailedPredicateException("this.notLineTerminator()");
				}
				this.state = 1023;
				this.expressionSequence();
				}
				break;
			}
			this.state = 1026;
			this.eos();
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
	public withStatement(): WithStatementContext {
		let _localctx: WithStatementContext = new WithStatementContext(this._ctx, this.state);
		this.enterRule(_localctx, 162, TypeScriptParser.RULE_withStatement);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1028;
			this.match(TypeScriptParser.With);
			this.state = 1029;
			this.match(TypeScriptParser.OpenParen);
			this.state = 1030;
			this.expressionSequence();
			this.state = 1031;
			this.match(TypeScriptParser.CloseParen);
			this.state = 1032;
			this.statement();
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
	public switchStatement(): SwitchStatementContext {
		let _localctx: SwitchStatementContext = new SwitchStatementContext(this._ctx, this.state);
		this.enterRule(_localctx, 164, TypeScriptParser.RULE_switchStatement);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1034;
			this.match(TypeScriptParser.Switch);
			this.state = 1035;
			this.match(TypeScriptParser.OpenParen);
			this.state = 1036;
			this.expressionSequence();
			this.state = 1037;
			this.match(TypeScriptParser.CloseParen);
			this.state = 1038;
			this.caseBlock();
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
	public caseBlock(): CaseBlockContext {
		let _localctx: CaseBlockContext = new CaseBlockContext(this._ctx, this.state);
		this.enterRule(_localctx, 166, TypeScriptParser.RULE_caseBlock);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1040;
			this.match(TypeScriptParser.OpenBrace);
			this.state = 1042;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === TypeScriptParser.Case) {
				{
				this.state = 1041;
				this.caseClauses();
				}
			}

			this.state = 1048;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === TypeScriptParser.Default) {
				{
				this.state = 1044;
				this.defaultClause();
				this.state = 1046;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === TypeScriptParser.Case) {
					{
					this.state = 1045;
					this.caseClauses();
					}
				}

				}
			}

			this.state = 1050;
			this.match(TypeScriptParser.CloseBrace);
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
	public caseClauses(): CaseClausesContext {
		let _localctx: CaseClausesContext = new CaseClausesContext(this._ctx, this.state);
		this.enterRule(_localctx, 168, TypeScriptParser.RULE_caseClauses);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1053;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			do {
				{
				{
				this.state = 1052;
				this.caseClause();
				}
				}
				this.state = 1055;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			} while (_la === TypeScriptParser.Case);
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
	public caseClause(): CaseClauseContext {
		let _localctx: CaseClauseContext = new CaseClauseContext(this._ctx, this.state);
		this.enterRule(_localctx, 170, TypeScriptParser.RULE_caseClause);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1057;
			this.match(TypeScriptParser.Case);
			this.state = 1058;
			this.expressionSequence();
			this.state = 1059;
			this.match(TypeScriptParser.Colon);
			this.state = 1061;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 122, this._ctx) ) {
			case 1:
				{
				this.state = 1060;
				this.statementList();
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
	public defaultClause(): DefaultClauseContext {
		let _localctx: DefaultClauseContext = new DefaultClauseContext(this._ctx, this.state);
		this.enterRule(_localctx, 172, TypeScriptParser.RULE_defaultClause);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1063;
			this.match(TypeScriptParser.Default);
			this.state = 1064;
			this.match(TypeScriptParser.Colon);
			this.state = 1066;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 123, this._ctx) ) {
			case 1:
				{
				this.state = 1065;
				this.statementList();
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
	public labelledStatement(): LabelledStatementContext {
		let _localctx: LabelledStatementContext = new LabelledStatementContext(this._ctx, this.state);
		this.enterRule(_localctx, 174, TypeScriptParser.RULE_labelledStatement);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1068;
			this.match(TypeScriptParser.Identifier);
			this.state = 1069;
			this.match(TypeScriptParser.Colon);
			this.state = 1070;
			this.statement();
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
	public throwStatement(): ThrowStatementContext {
		let _localctx: ThrowStatementContext = new ThrowStatementContext(this._ctx, this.state);
		this.enterRule(_localctx, 176, TypeScriptParser.RULE_throwStatement);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1072;
			this.match(TypeScriptParser.Throw);
			this.state = 1073;
			if (!(this.notLineTerminator())) {
				throw this.createFailedPredicateException("this.notLineTerminator()");
			}
			this.state = 1074;
			this.expressionSequence();
			this.state = 1075;
			this.eos();
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
	public tryStatement(): TryStatementContext {
		let _localctx: TryStatementContext = new TryStatementContext(this._ctx, this.state);
		this.enterRule(_localctx, 178, TypeScriptParser.RULE_tryStatement);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1077;
			this.match(TypeScriptParser.Try);
			this.state = 1078;
			this.block();
			this.state = 1084;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case TypeScriptParser.Catch:
				{
				this.state = 1079;
				this.catchProduction();
				this.state = 1081;
				this._errHandler.sync(this);
				switch ( this.interpreter.adaptivePredict(this._input, 124, this._ctx) ) {
				case 1:
					{
					this.state = 1080;
					this.finallyProduction();
					}
					break;
				}
				}
				break;
			case TypeScriptParser.Finally:
				{
				this.state = 1083;
				this.finallyProduction();
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
	public catchProduction(): CatchProductionContext {
		let _localctx: CatchProductionContext = new CatchProductionContext(this._ctx, this.state);
		this.enterRule(_localctx, 180, TypeScriptParser.RULE_catchProduction);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1086;
			this.match(TypeScriptParser.Catch);
			this.state = 1087;
			this.match(TypeScriptParser.OpenParen);
			this.state = 1088;
			this.match(TypeScriptParser.Identifier);
			this.state = 1089;
			this.match(TypeScriptParser.CloseParen);
			this.state = 1090;
			this.block();
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
	public finallyProduction(): FinallyProductionContext {
		let _localctx: FinallyProductionContext = new FinallyProductionContext(this._ctx, this.state);
		this.enterRule(_localctx, 182, TypeScriptParser.RULE_finallyProduction);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1092;
			this.match(TypeScriptParser.Finally);
			this.state = 1093;
			this.block();
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
	public debuggerStatement(): DebuggerStatementContext {
		let _localctx: DebuggerStatementContext = new DebuggerStatementContext(this._ctx, this.state);
		this.enterRule(_localctx, 184, TypeScriptParser.RULE_debuggerStatement);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1095;
			this.match(TypeScriptParser.Debugger);
			this.state = 1096;
			this.eos();
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
	public functionDeclaration(): FunctionDeclarationContext {
		let _localctx: FunctionDeclarationContext = new FunctionDeclarationContext(this._ctx, this.state);
		this.enterRule(_localctx, 186, TypeScriptParser.RULE_functionDeclaration);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1098;
			this.match(TypeScriptParser.Function_);
			this.state = 1099;
			this.match(TypeScriptParser.Identifier);
			this.state = 1100;
			this.callSignature();
			this.state = 1106;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case TypeScriptParser.OpenBrace:
				{
				{
				this.state = 1101;
				this.match(TypeScriptParser.OpenBrace);
				this.state = 1102;
				this.functionBody();
				this.state = 1103;
				this.match(TypeScriptParser.CloseBrace);
				}
				}
				break;
			case TypeScriptParser.SemiColon:
				{
				this.state = 1105;
				this.match(TypeScriptParser.SemiColon);
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
	public classDeclaration(): ClassDeclarationContext {
		let _localctx: ClassDeclarationContext = new ClassDeclarationContext(this._ctx, this.state);
		this.enterRule(_localctx, 188, TypeScriptParser.RULE_classDeclaration);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1109;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === TypeScriptParser.Abstract) {
				{
				this.state = 1108;
				this.match(TypeScriptParser.Abstract);
				}
			}

			this.state = 1111;
			this.match(TypeScriptParser.Class);
			this.state = 1112;
			this.match(TypeScriptParser.Identifier);
			this.state = 1114;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === TypeScriptParser.LessThan) {
				{
				this.state = 1113;
				this.typeParameters();
				}
			}

			this.state = 1116;
			this.classHeritage();
			this.state = 1117;
			this.classTail();
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
	public classHeritage(): ClassHeritageContext {
		let _localctx: ClassHeritageContext = new ClassHeritageContext(this._ctx, this.state);
		this.enterRule(_localctx, 190, TypeScriptParser.RULE_classHeritage);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1120;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === TypeScriptParser.Extends) {
				{
				this.state = 1119;
				this.classExtendsClause();
				}
			}

			this.state = 1123;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === TypeScriptParser.Implements) {
				{
				this.state = 1122;
				this.implementsClause();
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
	public classTail(): ClassTailContext {
		let _localctx: ClassTailContext = new ClassTailContext(this._ctx, this.state);
		this.enterRule(_localctx, 192, TypeScriptParser.RULE_classTail);
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1125;
			this.match(TypeScriptParser.OpenBrace);
			this.state = 1129;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 131, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 1126;
					this.classElement();
					}
					}
				}
				this.state = 1131;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 131, this._ctx);
			}
			this.state = 1132;
			this.match(TypeScriptParser.CloseBrace);
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
	public classExtendsClause(): ClassExtendsClauseContext {
		let _localctx: ClassExtendsClauseContext = new ClassExtendsClauseContext(this._ctx, this.state);
		this.enterRule(_localctx, 194, TypeScriptParser.RULE_classExtendsClause);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1134;
			this.match(TypeScriptParser.Extends);
			this.state = 1135;
			this.typeReference();
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
	public implementsClause(): ImplementsClauseContext {
		let _localctx: ImplementsClauseContext = new ImplementsClauseContext(this._ctx, this.state);
		this.enterRule(_localctx, 196, TypeScriptParser.RULE_implementsClause);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1137;
			this.match(TypeScriptParser.Implements);
			this.state = 1138;
			this.classOrInterfaceTypeList();
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
	public classElement(): ClassElementContext {
		let _localctx: ClassElementContext = new ClassElementContext(this._ctx, this.state);
		this.enterRule(_localctx, 198, TypeScriptParser.RULE_classElement);
		let _la: number;
		try {
			this.state = 1147;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 133, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 1140;
				this.constructorDeclaration();
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 1142;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === TypeScriptParser.At) {
					{
					this.state = 1141;
					this.decoratorList();
					}
				}

				this.state = 1144;
				this.propertyMemberDeclaration();
				}
				break;

			case 3:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 1145;
				this.indexMemberDeclaration();
				}
				break;

			case 4:
				this.enterOuterAlt(_localctx, 4);
				{
				this.state = 1146;
				this.statement();
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
	public propertyMemberDeclaration(): PropertyMemberDeclarationContext {
		let _localctx: PropertyMemberDeclarationContext = new PropertyMemberDeclarationContext(this._ctx, this.state);
		this.enterRule(_localctx, 200, TypeScriptParser.RULE_propertyMemberDeclaration);
		let _la: number;
		try {
			this.state = 1178;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 139, this._ctx) ) {
			case 1:
				_localctx = new PropertyDeclarationExpressionContext(_localctx);
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 1149;
				this.propertyMemberBase();
				this.state = 1150;
				this.propertyName();
				this.state = 1152;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === TypeScriptParser.QuestionMark) {
					{
					this.state = 1151;
					this.match(TypeScriptParser.QuestionMark);
					}
				}

				this.state = 1155;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === TypeScriptParser.Colon) {
					{
					this.state = 1154;
					this.typeAnnotation();
					}
				}

				this.state = 1158;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === TypeScriptParser.Assign) {
					{
					this.state = 1157;
					this.initializer();
					}
				}

				this.state = 1160;
				this.match(TypeScriptParser.SemiColon);
				}
				break;

			case 2:
				_localctx = new MethodDeclarationExpressionContext(_localctx);
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 1162;
				this.propertyMemberBase();
				this.state = 1163;
				this.propertyName();
				this.state = 1164;
				this.callSignature();
				this.state = 1170;
				this._errHandler.sync(this);
				switch (this._input.LA(1)) {
				case TypeScriptParser.OpenBrace:
					{
					{
					this.state = 1165;
					this.match(TypeScriptParser.OpenBrace);
					this.state = 1166;
					this.functionBody();
					this.state = 1167;
					this.match(TypeScriptParser.CloseBrace);
					}
					}
					break;
				case TypeScriptParser.SemiColon:
					{
					this.state = 1169;
					this.match(TypeScriptParser.SemiColon);
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				}
				break;

			case 3:
				_localctx = new GetterSetterDeclarationExpressionContext(_localctx);
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 1172;
				this.propertyMemberBase();
				this.state = 1175;
				this._errHandler.sync(this);
				switch (this._input.LA(1)) {
				case TypeScriptParser.Get:
					{
					this.state = 1173;
					this.getAccessor();
					}
					break;
				case TypeScriptParser.Set:
					{
					this.state = 1174;
					this.setAccessor();
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				}
				break;

			case 4:
				_localctx = new AbstractMemberDeclarationContext(_localctx);
				this.enterOuterAlt(_localctx, 4);
				{
				this.state = 1177;
				this.abstractDeclaration();
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
	public propertyMemberBase(): PropertyMemberBaseContext {
		let _localctx: PropertyMemberBaseContext = new PropertyMemberBaseContext(this._ctx, this.state);
		this.enterRule(_localctx, 202, TypeScriptParser.RULE_propertyMemberBase);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1181;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 140, this._ctx) ) {
			case 1:
				{
				this.state = 1180;
				this.match(TypeScriptParser.Async);
				}
				break;
			}
			this.state = 1184;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 141, this._ctx) ) {
			case 1:
				{
				this.state = 1183;
				this.accessibilityModifier();
				}
				break;
			}
			this.state = 1187;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 142, this._ctx) ) {
			case 1:
				{
				this.state = 1186;
				this.match(TypeScriptParser.Static);
				}
				break;
			}
			this.state = 1190;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 143, this._ctx) ) {
			case 1:
				{
				this.state = 1189;
				this.match(TypeScriptParser.ReadOnly);
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
	public indexMemberDeclaration(): IndexMemberDeclarationContext {
		let _localctx: IndexMemberDeclarationContext = new IndexMemberDeclarationContext(this._ctx, this.state);
		this.enterRule(_localctx, 204, TypeScriptParser.RULE_indexMemberDeclaration);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1192;
			this.indexSignature();
			this.state = 1193;
			this.match(TypeScriptParser.SemiColon);
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
	public generatorMethod(): GeneratorMethodContext {
		let _localctx: GeneratorMethodContext = new GeneratorMethodContext(this._ctx, this.state);
		this.enterRule(_localctx, 206, TypeScriptParser.RULE_generatorMethod);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1196;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === TypeScriptParser.Multiply) {
				{
				this.state = 1195;
				this.match(TypeScriptParser.Multiply);
				}
			}

			this.state = 1198;
			this.match(TypeScriptParser.Identifier);
			this.state = 1199;
			this.match(TypeScriptParser.OpenParen);
			this.state = 1201;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << TypeScriptParser.OpenBracket) | (1 << TypeScriptParser.OpenBrace) | (1 << TypeScriptParser.Ellipsis))) !== 0) || ((((_la - 101)) & ~0x1F) === 0 && ((1 << (_la - 101)) & ((1 << (TypeScriptParser.Private - 101)) | (1 << (TypeScriptParser.Public - 101)) | (1 << (TypeScriptParser.Protected - 101)) | (1 << (TypeScriptParser.TypeAlias - 101)) | (1 << (TypeScriptParser.Require - 101)) | (1 << (TypeScriptParser.At - 101)) | (1 << (TypeScriptParser.Identifier - 101)))) !== 0)) {
				{
				this.state = 1200;
				this.formalParameterList();
				}
			}

			this.state = 1203;
			this.match(TypeScriptParser.CloseParen);
			this.state = 1204;
			this.match(TypeScriptParser.OpenBrace);
			this.state = 1205;
			this.functionBody();
			this.state = 1206;
			this.match(TypeScriptParser.CloseBrace);
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
	public generatorFunctionDeclaration(): GeneratorFunctionDeclarationContext {
		let _localctx: GeneratorFunctionDeclarationContext = new GeneratorFunctionDeclarationContext(this._ctx, this.state);
		this.enterRule(_localctx, 208, TypeScriptParser.RULE_generatorFunctionDeclaration);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1208;
			this.match(TypeScriptParser.Function_);
			this.state = 1209;
			this.match(TypeScriptParser.Multiply);
			this.state = 1211;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === TypeScriptParser.Identifier) {
				{
				this.state = 1210;
				this.match(TypeScriptParser.Identifier);
				}
			}

			this.state = 1213;
			this.match(TypeScriptParser.OpenParen);
			this.state = 1215;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << TypeScriptParser.OpenBracket) | (1 << TypeScriptParser.OpenBrace) | (1 << TypeScriptParser.Ellipsis))) !== 0) || ((((_la - 101)) & ~0x1F) === 0 && ((1 << (_la - 101)) & ((1 << (TypeScriptParser.Private - 101)) | (1 << (TypeScriptParser.Public - 101)) | (1 << (TypeScriptParser.Protected - 101)) | (1 << (TypeScriptParser.TypeAlias - 101)) | (1 << (TypeScriptParser.Require - 101)) | (1 << (TypeScriptParser.At - 101)) | (1 << (TypeScriptParser.Identifier - 101)))) !== 0)) {
				{
				this.state = 1214;
				this.formalParameterList();
				}
			}

			this.state = 1217;
			this.match(TypeScriptParser.CloseParen);
			this.state = 1218;
			this.match(TypeScriptParser.OpenBrace);
			this.state = 1219;
			this.functionBody();
			this.state = 1220;
			this.match(TypeScriptParser.CloseBrace);
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
	public generatorBlock(): GeneratorBlockContext {
		let _localctx: GeneratorBlockContext = new GeneratorBlockContext(this._ctx, this.state);
		this.enterRule(_localctx, 210, TypeScriptParser.RULE_generatorBlock);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1222;
			this.match(TypeScriptParser.OpenBrace);
			this.state = 1223;
			this.generatorDefinition();
			this.state = 1228;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 148, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 1224;
					this.match(TypeScriptParser.Comma);
					this.state = 1225;
					this.generatorDefinition();
					}
					}
				}
				this.state = 1230;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 148, this._ctx);
			}
			this.state = 1232;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === TypeScriptParser.Comma) {
				{
				this.state = 1231;
				this.match(TypeScriptParser.Comma);
				}
			}

			this.state = 1234;
			this.match(TypeScriptParser.CloseBrace);
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
	public generatorDefinition(): GeneratorDefinitionContext {
		let _localctx: GeneratorDefinitionContext = new GeneratorDefinitionContext(this._ctx, this.state);
		this.enterRule(_localctx, 212, TypeScriptParser.RULE_generatorDefinition);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1236;
			this.match(TypeScriptParser.Multiply);
			this.state = 1237;
			this.iteratorDefinition();
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
	public iteratorBlock(): IteratorBlockContext {
		let _localctx: IteratorBlockContext = new IteratorBlockContext(this._ctx, this.state);
		this.enterRule(_localctx, 214, TypeScriptParser.RULE_iteratorBlock);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1239;
			this.match(TypeScriptParser.OpenBrace);
			this.state = 1240;
			this.iteratorDefinition();
			this.state = 1245;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 150, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 1241;
					this.match(TypeScriptParser.Comma);
					this.state = 1242;
					this.iteratorDefinition();
					}
					}
				}
				this.state = 1247;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 150, this._ctx);
			}
			this.state = 1249;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === TypeScriptParser.Comma) {
				{
				this.state = 1248;
				this.match(TypeScriptParser.Comma);
				}
			}

			this.state = 1251;
			this.match(TypeScriptParser.CloseBrace);
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
	public iteratorDefinition(): IteratorDefinitionContext {
		let _localctx: IteratorDefinitionContext = new IteratorDefinitionContext(this._ctx, this.state);
		this.enterRule(_localctx, 216, TypeScriptParser.RULE_iteratorDefinition);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1253;
			this.match(TypeScriptParser.OpenBracket);
			this.state = 1254;
			this.singleExpression(0);
			this.state = 1255;
			this.match(TypeScriptParser.CloseBracket);
			this.state = 1256;
			this.match(TypeScriptParser.OpenParen);
			this.state = 1258;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << TypeScriptParser.OpenBracket) | (1 << TypeScriptParser.OpenBrace) | (1 << TypeScriptParser.Ellipsis))) !== 0) || ((((_la - 101)) & ~0x1F) === 0 && ((1 << (_la - 101)) & ((1 << (TypeScriptParser.Private - 101)) | (1 << (TypeScriptParser.Public - 101)) | (1 << (TypeScriptParser.Protected - 101)) | (1 << (TypeScriptParser.TypeAlias - 101)) | (1 << (TypeScriptParser.Require - 101)) | (1 << (TypeScriptParser.At - 101)) | (1 << (TypeScriptParser.Identifier - 101)))) !== 0)) {
				{
				this.state = 1257;
				this.formalParameterList();
				}
			}

			this.state = 1260;
			this.match(TypeScriptParser.CloseParen);
			this.state = 1261;
			this.match(TypeScriptParser.OpenBrace);
			this.state = 1262;
			this.functionBody();
			this.state = 1263;
			this.match(TypeScriptParser.CloseBrace);
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
	public formalParameterList(): FormalParameterListContext {
		let _localctx: FormalParameterListContext = new FormalParameterListContext(this._ctx, this.state);
		this.enterRule(_localctx, 218, TypeScriptParser.RULE_formalParameterList);
		let _la: number;
		try {
			let _alt: number;
			this.state = 1284;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case TypeScriptParser.Private:
			case TypeScriptParser.Public:
			case TypeScriptParser.Protected:
			case TypeScriptParser.TypeAlias:
			case TypeScriptParser.Require:
			case TypeScriptParser.At:
			case TypeScriptParser.Identifier:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 1265;
				this.formalParameterArg();
				this.state = 1270;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 153, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 1266;
						this.match(TypeScriptParser.Comma);
						this.state = 1267;
						this.formalParameterArg();
						}
						}
					}
					this.state = 1272;
					this._errHandler.sync(this);
					_alt = this.interpreter.adaptivePredict(this._input, 153, this._ctx);
				}
				this.state = 1275;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === TypeScriptParser.Comma) {
					{
					this.state = 1273;
					this.match(TypeScriptParser.Comma);
					this.state = 1274;
					this.lastFormalParameterArg();
					}
				}

				}
				break;
			case TypeScriptParser.Ellipsis:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 1277;
				this.lastFormalParameterArg();
				}
				break;
			case TypeScriptParser.OpenBracket:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 1278;
				this.arrayLiteral();
				}
				break;
			case TypeScriptParser.OpenBrace:
				this.enterOuterAlt(_localctx, 4);
				{
				this.state = 1279;
				this.objectLiteral();
				this.state = 1282;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === TypeScriptParser.Colon) {
					{
					this.state = 1280;
					this.match(TypeScriptParser.Colon);
					this.state = 1281;
					this.formalParameterList();
					}
				}

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
	public formalParameterArg(): FormalParameterArgContext {
		let _localctx: FormalParameterArgContext = new FormalParameterArgContext(this._ctx, this.state);
		this.enterRule(_localctx, 220, TypeScriptParser.RULE_formalParameterArg);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1287;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === TypeScriptParser.At) {
				{
				this.state = 1286;
				this.decorator();
				}
			}

			this.state = 1290;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 101)) & ~0x1F) === 0 && ((1 << (_la - 101)) & ((1 << (TypeScriptParser.Private - 101)) | (1 << (TypeScriptParser.Public - 101)) | (1 << (TypeScriptParser.Protected - 101)))) !== 0)) {
				{
				this.state = 1289;
				this.accessibilityModifier();
				}
			}

			this.state = 1292;
			this.identifierOrKeyWord();
			this.state = 1294;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === TypeScriptParser.QuestionMark) {
				{
				this.state = 1293;
				this.match(TypeScriptParser.QuestionMark);
				}
			}

			this.state = 1297;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === TypeScriptParser.Colon) {
				{
				this.state = 1296;
				this.typeAnnotation();
				}
			}

			this.state = 1301;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === TypeScriptParser.Assign) {
				{
				this.state = 1299;
				this.match(TypeScriptParser.Assign);
				this.state = 1300;
				this.singleExpression(0);
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
	public lastFormalParameterArg(): LastFormalParameterArgContext {
		let _localctx: LastFormalParameterArgContext = new LastFormalParameterArgContext(this._ctx, this.state);
		this.enterRule(_localctx, 222, TypeScriptParser.RULE_lastFormalParameterArg);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1303;
			this.match(TypeScriptParser.Ellipsis);
			this.state = 1304;
			this.match(TypeScriptParser.Identifier);
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
	public functionBody(): FunctionBodyContext {
		let _localctx: FunctionBodyContext = new FunctionBodyContext(this._ctx, this.state);
		this.enterRule(_localctx, 224, TypeScriptParser.RULE_functionBody);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1307;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 162, this._ctx) ) {
			case 1:
				{
				this.state = 1306;
				this.sourceElements();
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
	public sourceElements(): SourceElementsContext {
		let _localctx: SourceElementsContext = new SourceElementsContext(this._ctx, this.state);
		this.enterRule(_localctx, 226, TypeScriptParser.RULE_sourceElements);
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1310;
			this._errHandler.sync(this);
			_alt = 1;
			do {
				switch (_alt) {
				case 1:
					{
					{
					this.state = 1309;
					this.sourceElement();
					}
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				this.state = 1312;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 163, this._ctx);
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
	public arrayLiteral(): ArrayLiteralContext {
		let _localctx: ArrayLiteralContext = new ArrayLiteralContext(this._ctx, this.state);
		this.enterRule(_localctx, 228, TypeScriptParser.RULE_arrayLiteral);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			{
			this.state = 1314;
			this.match(TypeScriptParser.OpenBracket);
			this.state = 1316;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << TypeScriptParser.RegularExpressionLiteral) | (1 << TypeScriptParser.OpenBracket) | (1 << TypeScriptParser.OpenParen) | (1 << TypeScriptParser.OpenBrace) | (1 << TypeScriptParser.Ellipsis) | (1 << TypeScriptParser.PlusPlus) | (1 << TypeScriptParser.MinusMinus) | (1 << TypeScriptParser.Plus) | (1 << TypeScriptParser.Minus) | (1 << TypeScriptParser.BitNot) | (1 << TypeScriptParser.Not) | (1 << TypeScriptParser.LessThan))) !== 0) || ((((_la - 55)) & ~0x1F) === 0 && ((1 << (_la - 55)) & ((1 << (TypeScriptParser.NullLiteral - 55)) | (1 << (TypeScriptParser.BooleanLiteral - 55)) | (1 << (TypeScriptParser.DecimalLiteral - 55)) | (1 << (TypeScriptParser.HexIntegerLiteral - 55)) | (1 << (TypeScriptParser.OctalIntegerLiteral - 55)) | (1 << (TypeScriptParser.OctalIntegerLiteral2 - 55)) | (1 << (TypeScriptParser.BinaryIntegerLiteral - 55)) | (1 << (TypeScriptParser.Break - 55)) | (1 << (TypeScriptParser.Do - 55)) | (1 << (TypeScriptParser.Instanceof - 55)) | (1 << (TypeScriptParser.Typeof - 55)) | (1 << (TypeScriptParser.Case - 55)) | (1 << (TypeScriptParser.Else - 55)) | (1 << (TypeScriptParser.New - 55)) | (1 << (TypeScriptParser.Var - 55)) | (1 << (TypeScriptParser.Catch - 55)) | (1 << (TypeScriptParser.Finally - 55)) | (1 << (TypeScriptParser.Return - 55)) | (1 << (TypeScriptParser.Void - 55)) | (1 << (TypeScriptParser.Continue - 55)) | (1 << (TypeScriptParser.For - 55)) | (1 << (TypeScriptParser.Switch - 55)) | (1 << (TypeScriptParser.While - 55)) | (1 << (TypeScriptParser.Debugger - 55)) | (1 << (TypeScriptParser.Function_ - 55)) | (1 << (TypeScriptParser.This - 55)) | (1 << (TypeScriptParser.With - 55)) | (1 << (TypeScriptParser.Default - 55)) | (1 << (TypeScriptParser.If - 55)) | (1 << (TypeScriptParser.Throw - 55)) | (1 << (TypeScriptParser.Delete - 55)) | (1 << (TypeScriptParser.In - 55)))) !== 0) || ((((_la - 87)) & ~0x1F) === 0 && ((1 << (_la - 87)) & ((1 << (TypeScriptParser.Try - 87)) | (1 << (TypeScriptParser.From - 87)) | (1 << (TypeScriptParser.ReadOnly - 87)) | (1 << (TypeScriptParser.Async - 87)) | (1 << (TypeScriptParser.Class - 87)) | (1 << (TypeScriptParser.Enum - 87)) | (1 << (TypeScriptParser.Extends - 87)) | (1 << (TypeScriptParser.Super - 87)) | (1 << (TypeScriptParser.Const - 87)) | (1 << (TypeScriptParser.Export - 87)) | (1 << (TypeScriptParser.Import - 87)) | (1 << (TypeScriptParser.Implements - 87)) | (1 << (TypeScriptParser.Let - 87)) | (1 << (TypeScriptParser.Private - 87)) | (1 << (TypeScriptParser.Public - 87)) | (1 << (TypeScriptParser.Interface - 87)) | (1 << (TypeScriptParser.Package - 87)) | (1 << (TypeScriptParser.Protected - 87)) | (1 << (TypeScriptParser.Static - 87)) | (1 << (TypeScriptParser.Yield - 87)) | (1 << (TypeScriptParser.String - 87)) | (1 << (TypeScriptParser.TypeAlias - 87)) | (1 << (TypeScriptParser.Get - 87)) | (1 << (TypeScriptParser.Set - 87)) | (1 << (TypeScriptParser.Require - 87)))) !== 0) || ((((_la - 124)) & ~0x1F) === 0 && ((1 << (_la - 124)) & ((1 << (TypeScriptParser.Identifier - 124)) | (1 << (TypeScriptParser.StringLiteral - 124)) | (1 << (TypeScriptParser.BackTick - 124)))) !== 0)) {
				{
				this.state = 1315;
				this.elementList();
				}
			}

			this.state = 1318;
			this.match(TypeScriptParser.CloseBracket);
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
	public elementList(): ElementListContext {
		let _localctx: ElementListContext = new ElementListContext(this._ctx, this.state);
		this.enterRule(_localctx, 230, TypeScriptParser.RULE_elementList);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1320;
			this.arrayElement();
			this.state = 1329;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === TypeScriptParser.Comma) {
				{
				{
				this.state = 1322;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				do {
					{
					{
					this.state = 1321;
					this.match(TypeScriptParser.Comma);
					}
					}
					this.state = 1324;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				} while (_la === TypeScriptParser.Comma);
				this.state = 1326;
				this.arrayElement();
				}
				}
				this.state = 1331;
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
	public arrayElement(): ArrayElementContext {
		let _localctx: ArrayElementContext = new ArrayElementContext(this._ctx, this.state);
		this.enterRule(_localctx, 232, TypeScriptParser.RULE_arrayElement);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1333;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === TypeScriptParser.Ellipsis) {
				{
				this.state = 1332;
				this.match(TypeScriptParser.Ellipsis);
				}
			}

			this.state = 1337;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 168, this._ctx) ) {
			case 1:
				{
				this.state = 1335;
				this.singleExpression(0);
				}
				break;

			case 2:
				{
				this.state = 1336;
				this.match(TypeScriptParser.Identifier);
				}
				break;
			}
			this.state = 1340;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 169, this._ctx) ) {
			case 1:
				{
				this.state = 1339;
				this.match(TypeScriptParser.Comma);
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
	public objectLiteral(): ObjectLiteralContext {
		let _localctx: ObjectLiteralContext = new ObjectLiteralContext(this._ctx, this.state);
		this.enterRule(_localctx, 234, TypeScriptParser.RULE_objectLiteral);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1342;
			this.match(TypeScriptParser.OpenBrace);
			this.state = 1354;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << TypeScriptParser.OpenBracket) | (1 << TypeScriptParser.Ellipsis) | (1 << TypeScriptParser.Multiply))) !== 0) || ((((_la - 55)) & ~0x1F) === 0 && ((1 << (_la - 55)) & ((1 << (TypeScriptParser.NullLiteral - 55)) | (1 << (TypeScriptParser.BooleanLiteral - 55)) | (1 << (TypeScriptParser.DecimalLiteral - 55)) | (1 << (TypeScriptParser.HexIntegerLiteral - 55)) | (1 << (TypeScriptParser.OctalIntegerLiteral - 55)) | (1 << (TypeScriptParser.OctalIntegerLiteral2 - 55)) | (1 << (TypeScriptParser.BinaryIntegerLiteral - 55)) | (1 << (TypeScriptParser.Break - 55)) | (1 << (TypeScriptParser.Do - 55)) | (1 << (TypeScriptParser.Instanceof - 55)) | (1 << (TypeScriptParser.Typeof - 55)) | (1 << (TypeScriptParser.Case - 55)) | (1 << (TypeScriptParser.Else - 55)) | (1 << (TypeScriptParser.New - 55)) | (1 << (TypeScriptParser.Var - 55)) | (1 << (TypeScriptParser.Catch - 55)) | (1 << (TypeScriptParser.Finally - 55)) | (1 << (TypeScriptParser.Return - 55)) | (1 << (TypeScriptParser.Void - 55)) | (1 << (TypeScriptParser.Continue - 55)) | (1 << (TypeScriptParser.For - 55)) | (1 << (TypeScriptParser.Switch - 55)) | (1 << (TypeScriptParser.While - 55)) | (1 << (TypeScriptParser.Debugger - 55)) | (1 << (TypeScriptParser.Function_ - 55)) | (1 << (TypeScriptParser.This - 55)) | (1 << (TypeScriptParser.With - 55)) | (1 << (TypeScriptParser.Default - 55)) | (1 << (TypeScriptParser.If - 55)) | (1 << (TypeScriptParser.Throw - 55)) | (1 << (TypeScriptParser.Delete - 55)) | (1 << (TypeScriptParser.In - 55)))) !== 0) || ((((_la - 87)) & ~0x1F) === 0 && ((1 << (_la - 87)) & ((1 << (TypeScriptParser.Try - 87)) | (1 << (TypeScriptParser.From - 87)) | (1 << (TypeScriptParser.ReadOnly - 87)) | (1 << (TypeScriptParser.Async - 87)) | (1 << (TypeScriptParser.Class - 87)) | (1 << (TypeScriptParser.Enum - 87)) | (1 << (TypeScriptParser.Extends - 87)) | (1 << (TypeScriptParser.Super - 87)) | (1 << (TypeScriptParser.Const - 87)) | (1 << (TypeScriptParser.Export - 87)) | (1 << (TypeScriptParser.Import - 87)) | (1 << (TypeScriptParser.Implements - 87)) | (1 << (TypeScriptParser.Let - 87)) | (1 << (TypeScriptParser.Private - 87)) | (1 << (TypeScriptParser.Public - 87)) | (1 << (TypeScriptParser.Interface - 87)) | (1 << (TypeScriptParser.Package - 87)) | (1 << (TypeScriptParser.Protected - 87)) | (1 << (TypeScriptParser.Static - 87)) | (1 << (TypeScriptParser.Yield - 87)) | (1 << (TypeScriptParser.String - 87)) | (1 << (TypeScriptParser.TypeAlias - 87)) | (1 << (TypeScriptParser.Get - 87)) | (1 << (TypeScriptParser.Set - 87)) | (1 << (TypeScriptParser.Require - 87)))) !== 0) || _la === TypeScriptParser.Identifier || _la === TypeScriptParser.StringLiteral) {
				{
				this.state = 1343;
				this.propertyAssignment();
				this.state = 1348;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 170, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 1344;
						this.match(TypeScriptParser.Comma);
						this.state = 1345;
						this.propertyAssignment();
						}
						}
					}
					this.state = 1350;
					this._errHandler.sync(this);
					_alt = this.interpreter.adaptivePredict(this._input, 170, this._ctx);
				}
				this.state = 1352;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === TypeScriptParser.Comma) {
					{
					this.state = 1351;
					this.match(TypeScriptParser.Comma);
					}
				}

				}
			}

			this.state = 1356;
			this.match(TypeScriptParser.CloseBrace);
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
	public propertyAssignment(): PropertyAssignmentContext {
		let _localctx: PropertyAssignmentContext = new PropertyAssignmentContext(this._ctx, this.state);
		this.enterRule(_localctx, 236, TypeScriptParser.RULE_propertyAssignment);
		let _la: number;
		try {
			this.state = 1373;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 173, this._ctx) ) {
			case 1:
				_localctx = new PropertyExpressionAssignmentContext(_localctx);
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 1358;
				this.propertyName();
				this.state = 1359;
				_la = this._input.LA(1);
				if (!(_la === TypeScriptParser.Assign || _la === TypeScriptParser.Colon)) {
				this._errHandler.recoverInline(this);
				} else {
					if (this._input.LA(1) === Token.EOF) {
						this.matchedEOF = true;
					}

					this._errHandler.reportMatch(this);
					this.consume();
				}
				this.state = 1360;
				this.singleExpression(0);
				}
				break;

			case 2:
				_localctx = new ComputedPropertyExpressionAssignmentContext(_localctx);
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 1362;
				this.match(TypeScriptParser.OpenBracket);
				this.state = 1363;
				this.singleExpression(0);
				this.state = 1364;
				this.match(TypeScriptParser.CloseBracket);
				this.state = 1365;
				this.match(TypeScriptParser.Colon);
				this.state = 1366;
				this.singleExpression(0);
				}
				break;

			case 3:
				_localctx = new PropertyGetterContext(_localctx);
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 1368;
				this.getAccessor();
				}
				break;

			case 4:
				_localctx = new PropertySetterContext(_localctx);
				this.enterOuterAlt(_localctx, 4);
				{
				this.state = 1369;
				this.setAccessor();
				}
				break;

			case 5:
				_localctx = new MethodPropertyContext(_localctx);
				this.enterOuterAlt(_localctx, 5);
				{
				this.state = 1370;
				this.generatorMethod();
				}
				break;

			case 6:
				_localctx = new PropertyShorthandContext(_localctx);
				this.enterOuterAlt(_localctx, 6);
				{
				this.state = 1371;
				this.identifierOrKeyWord();
				}
				break;

			case 7:
				_localctx = new RestParameterInObjectContext(_localctx);
				this.enterOuterAlt(_localctx, 7);
				{
				this.state = 1372;
				this.restParameter();
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
	public getAccessor(): GetAccessorContext {
		let _localctx: GetAccessorContext = new GetAccessorContext(this._ctx, this.state);
		this.enterRule(_localctx, 238, TypeScriptParser.RULE_getAccessor);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1375;
			this.getter();
			this.state = 1376;
			this.match(TypeScriptParser.OpenParen);
			this.state = 1377;
			this.match(TypeScriptParser.CloseParen);
			this.state = 1379;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === TypeScriptParser.Colon) {
				{
				this.state = 1378;
				this.typeAnnotation();
				}
			}

			this.state = 1381;
			this.match(TypeScriptParser.OpenBrace);
			this.state = 1382;
			this.functionBody();
			this.state = 1383;
			this.match(TypeScriptParser.CloseBrace);
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
	public setAccessor(): SetAccessorContext {
		let _localctx: SetAccessorContext = new SetAccessorContext(this._ctx, this.state);
		this.enterRule(_localctx, 240, TypeScriptParser.RULE_setAccessor);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1385;
			this.setter();
			this.state = 1386;
			this.match(TypeScriptParser.OpenParen);
			this.state = 1389;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case TypeScriptParser.Identifier:
				{
				this.state = 1387;
				this.match(TypeScriptParser.Identifier);
				}
				break;
			case TypeScriptParser.OpenBracket:
			case TypeScriptParser.OpenBrace:
				{
				this.state = 1388;
				this.bindingPattern();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			this.state = 1392;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === TypeScriptParser.Colon) {
				{
				this.state = 1391;
				this.typeAnnotation();
				}
			}

			this.state = 1394;
			this.match(TypeScriptParser.CloseParen);
			this.state = 1395;
			this.match(TypeScriptParser.OpenBrace);
			this.state = 1396;
			this.functionBody();
			this.state = 1397;
			this.match(TypeScriptParser.CloseBrace);
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
	public propertyName(): PropertyNameContext {
		let _localctx: PropertyNameContext = new PropertyNameContext(this._ctx, this.state);
		this.enterRule(_localctx, 242, TypeScriptParser.RULE_propertyName);
		try {
			this.state = 1402;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case TypeScriptParser.NullLiteral:
			case TypeScriptParser.BooleanLiteral:
			case TypeScriptParser.Break:
			case TypeScriptParser.Do:
			case TypeScriptParser.Instanceof:
			case TypeScriptParser.Typeof:
			case TypeScriptParser.Case:
			case TypeScriptParser.Else:
			case TypeScriptParser.New:
			case TypeScriptParser.Var:
			case TypeScriptParser.Catch:
			case TypeScriptParser.Finally:
			case TypeScriptParser.Return:
			case TypeScriptParser.Void:
			case TypeScriptParser.Continue:
			case TypeScriptParser.For:
			case TypeScriptParser.Switch:
			case TypeScriptParser.While:
			case TypeScriptParser.Debugger:
			case TypeScriptParser.Function_:
			case TypeScriptParser.This:
			case TypeScriptParser.With:
			case TypeScriptParser.Default:
			case TypeScriptParser.If:
			case TypeScriptParser.Throw:
			case TypeScriptParser.Delete:
			case TypeScriptParser.In:
			case TypeScriptParser.Try:
			case TypeScriptParser.From:
			case TypeScriptParser.ReadOnly:
			case TypeScriptParser.Async:
			case TypeScriptParser.Class:
			case TypeScriptParser.Enum:
			case TypeScriptParser.Extends:
			case TypeScriptParser.Super:
			case TypeScriptParser.Const:
			case TypeScriptParser.Export:
			case TypeScriptParser.Import:
			case TypeScriptParser.Implements:
			case TypeScriptParser.Let:
			case TypeScriptParser.Private:
			case TypeScriptParser.Public:
			case TypeScriptParser.Interface:
			case TypeScriptParser.Package:
			case TypeScriptParser.Protected:
			case TypeScriptParser.Static:
			case TypeScriptParser.Yield:
			case TypeScriptParser.String:
			case TypeScriptParser.TypeAlias:
			case TypeScriptParser.Get:
			case TypeScriptParser.Set:
			case TypeScriptParser.Require:
			case TypeScriptParser.Identifier:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 1399;
				this.identifierName();
				}
				break;
			case TypeScriptParser.StringLiteral:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 1400;
				this.match(TypeScriptParser.StringLiteral);
				}
				break;
			case TypeScriptParser.DecimalLiteral:
			case TypeScriptParser.HexIntegerLiteral:
			case TypeScriptParser.OctalIntegerLiteral:
			case TypeScriptParser.OctalIntegerLiteral2:
			case TypeScriptParser.BinaryIntegerLiteral:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 1401;
				this.numericLiteral();
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
	public arguments(): ArgumentsContext {
		let _localctx: ArgumentsContext = new ArgumentsContext(this._ctx, this.state);
		this.enterRule(_localctx, 244, TypeScriptParser.RULE_arguments);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1404;
			this.match(TypeScriptParser.OpenParen);
			this.state = 1409;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << TypeScriptParser.RegularExpressionLiteral) | (1 << TypeScriptParser.OpenBracket) | (1 << TypeScriptParser.OpenParen) | (1 << TypeScriptParser.OpenBrace) | (1 << TypeScriptParser.Ellipsis) | (1 << TypeScriptParser.PlusPlus) | (1 << TypeScriptParser.MinusMinus) | (1 << TypeScriptParser.Plus) | (1 << TypeScriptParser.Minus) | (1 << TypeScriptParser.BitNot) | (1 << TypeScriptParser.Not) | (1 << TypeScriptParser.LessThan))) !== 0) || ((((_la - 55)) & ~0x1F) === 0 && ((1 << (_la - 55)) & ((1 << (TypeScriptParser.NullLiteral - 55)) | (1 << (TypeScriptParser.BooleanLiteral - 55)) | (1 << (TypeScriptParser.DecimalLiteral - 55)) | (1 << (TypeScriptParser.HexIntegerLiteral - 55)) | (1 << (TypeScriptParser.OctalIntegerLiteral - 55)) | (1 << (TypeScriptParser.OctalIntegerLiteral2 - 55)) | (1 << (TypeScriptParser.BinaryIntegerLiteral - 55)) | (1 << (TypeScriptParser.Break - 55)) | (1 << (TypeScriptParser.Do - 55)) | (1 << (TypeScriptParser.Instanceof - 55)) | (1 << (TypeScriptParser.Typeof - 55)) | (1 << (TypeScriptParser.Case - 55)) | (1 << (TypeScriptParser.Else - 55)) | (1 << (TypeScriptParser.New - 55)) | (1 << (TypeScriptParser.Var - 55)) | (1 << (TypeScriptParser.Catch - 55)) | (1 << (TypeScriptParser.Finally - 55)) | (1 << (TypeScriptParser.Return - 55)) | (1 << (TypeScriptParser.Void - 55)) | (1 << (TypeScriptParser.Continue - 55)) | (1 << (TypeScriptParser.For - 55)) | (1 << (TypeScriptParser.Switch - 55)) | (1 << (TypeScriptParser.While - 55)) | (1 << (TypeScriptParser.Debugger - 55)) | (1 << (TypeScriptParser.Function_ - 55)) | (1 << (TypeScriptParser.This - 55)) | (1 << (TypeScriptParser.With - 55)) | (1 << (TypeScriptParser.Default - 55)) | (1 << (TypeScriptParser.If - 55)) | (1 << (TypeScriptParser.Throw - 55)) | (1 << (TypeScriptParser.Delete - 55)) | (1 << (TypeScriptParser.In - 55)))) !== 0) || ((((_la - 87)) & ~0x1F) === 0 && ((1 << (_la - 87)) & ((1 << (TypeScriptParser.Try - 87)) | (1 << (TypeScriptParser.From - 87)) | (1 << (TypeScriptParser.ReadOnly - 87)) | (1 << (TypeScriptParser.Async - 87)) | (1 << (TypeScriptParser.Class - 87)) | (1 << (TypeScriptParser.Enum - 87)) | (1 << (TypeScriptParser.Extends - 87)) | (1 << (TypeScriptParser.Super - 87)) | (1 << (TypeScriptParser.Const - 87)) | (1 << (TypeScriptParser.Export - 87)) | (1 << (TypeScriptParser.Import - 87)) | (1 << (TypeScriptParser.Implements - 87)) | (1 << (TypeScriptParser.Let - 87)) | (1 << (TypeScriptParser.Private - 87)) | (1 << (TypeScriptParser.Public - 87)) | (1 << (TypeScriptParser.Interface - 87)) | (1 << (TypeScriptParser.Package - 87)) | (1 << (TypeScriptParser.Protected - 87)) | (1 << (TypeScriptParser.Static - 87)) | (1 << (TypeScriptParser.Yield - 87)) | (1 << (TypeScriptParser.String - 87)) | (1 << (TypeScriptParser.TypeAlias - 87)) | (1 << (TypeScriptParser.Get - 87)) | (1 << (TypeScriptParser.Set - 87)) | (1 << (TypeScriptParser.Require - 87)))) !== 0) || ((((_la - 124)) & ~0x1F) === 0 && ((1 << (_la - 124)) & ((1 << (TypeScriptParser.Identifier - 124)) | (1 << (TypeScriptParser.StringLiteral - 124)) | (1 << (TypeScriptParser.BackTick - 124)))) !== 0)) {
				{
				this.state = 1405;
				this.argumentList();
				this.state = 1407;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === TypeScriptParser.Comma) {
					{
					this.state = 1406;
					this.match(TypeScriptParser.Comma);
					}
				}

				}
			}

			this.state = 1411;
			this.match(TypeScriptParser.CloseParen);
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
	public argumentList(): ArgumentListContext {
		let _localctx: ArgumentListContext = new ArgumentListContext(this._ctx, this.state);
		this.enterRule(_localctx, 246, TypeScriptParser.RULE_argumentList);
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1413;
			this.argument();
			this.state = 1418;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 180, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 1414;
					this.match(TypeScriptParser.Comma);
					this.state = 1415;
					this.argument();
					}
					}
				}
				this.state = 1420;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 180, this._ctx);
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
	public argument(): ArgumentContext {
		let _localctx: ArgumentContext = new ArgumentContext(this._ctx, this.state);
		this.enterRule(_localctx, 248, TypeScriptParser.RULE_argument);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1422;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === TypeScriptParser.Ellipsis) {
				{
				this.state = 1421;
				this.match(TypeScriptParser.Ellipsis);
				}
			}

			this.state = 1426;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 182, this._ctx) ) {
			case 1:
				{
				this.state = 1424;
				this.singleExpression(0);
				}
				break;

			case 2:
				{
				this.state = 1425;
				this.match(TypeScriptParser.Identifier);
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
	public expressionSequence(): ExpressionSequenceContext {
		let _localctx: ExpressionSequenceContext = new ExpressionSequenceContext(this._ctx, this.state);
		this.enterRule(_localctx, 250, TypeScriptParser.RULE_expressionSequence);
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1428;
			this.singleExpression(0);
			this.state = 1433;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 183, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 1429;
					this.match(TypeScriptParser.Comma);
					this.state = 1430;
					this.singleExpression(0);
					}
					}
				}
				this.state = 1435;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 183, this._ctx);
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
	public functionExpressionDeclaration(): FunctionExpressionDeclarationContext {
		let _localctx: FunctionExpressionDeclarationContext = new FunctionExpressionDeclarationContext(this._ctx, this.state);
		this.enterRule(_localctx, 252, TypeScriptParser.RULE_functionExpressionDeclaration);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1436;
			this.match(TypeScriptParser.Function_);
			this.state = 1438;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === TypeScriptParser.Identifier) {
				{
				this.state = 1437;
				this.match(TypeScriptParser.Identifier);
				}
			}

			this.state = 1440;
			this.match(TypeScriptParser.OpenParen);
			this.state = 1442;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << TypeScriptParser.OpenBracket) | (1 << TypeScriptParser.OpenBrace) | (1 << TypeScriptParser.Ellipsis))) !== 0) || ((((_la - 101)) & ~0x1F) === 0 && ((1 << (_la - 101)) & ((1 << (TypeScriptParser.Private - 101)) | (1 << (TypeScriptParser.Public - 101)) | (1 << (TypeScriptParser.Protected - 101)) | (1 << (TypeScriptParser.TypeAlias - 101)) | (1 << (TypeScriptParser.Require - 101)) | (1 << (TypeScriptParser.At - 101)) | (1 << (TypeScriptParser.Identifier - 101)))) !== 0)) {
				{
				this.state = 1441;
				this.formalParameterList();
				}
			}

			this.state = 1444;
			this.match(TypeScriptParser.CloseParen);
			this.state = 1446;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === TypeScriptParser.Colon) {
				{
				this.state = 1445;
				this.typeAnnotation();
				}
			}

			this.state = 1448;
			this.match(TypeScriptParser.OpenBrace);
			this.state = 1449;
			this.functionBody();
			this.state = 1450;
			this.match(TypeScriptParser.CloseBrace);
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

	public singleExpression(): SingleExpressionContext;
	public singleExpression(_p: number): SingleExpressionContext;
	// @RuleVersion(0)
	public singleExpression(_p?: number): SingleExpressionContext {
		if (_p === undefined) {
			_p = 0;
		}

		let _parentctx: ParserRuleContext = this._ctx;
		let _parentState: number = this.state;
		let _localctx: SingleExpressionContext = new SingleExpressionContext(this._ctx, _parentState);
		let _prevctx: SingleExpressionContext = _localctx;
		let _startState: number = 254;
		this.enterRecursionRule(_localctx, 254, TypeScriptParser.RULE_singleExpression, _p);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1511;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 192, this._ctx) ) {
			case 1:
				{
				_localctx = new FunctionExpressionContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;

				this.state = 1453;
				this.functionExpressionDeclaration();
				}
				break;

			case 2:
				{
				_localctx = new ArrowFunctionExpressionContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 1454;
				this.arrowFunctionDeclaration();
				}
				break;

			case 3:
				{
				_localctx = new ClassExpressionContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 1455;
				this.match(TypeScriptParser.Class);
				this.state = 1457;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === TypeScriptParser.Identifier) {
					{
					this.state = 1456;
					this.match(TypeScriptParser.Identifier);
					}
				}

				this.state = 1459;
				this.classTail();
				}
				break;

			case 4:
				{
				_localctx = new NewExpressionContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 1460;
				this.match(TypeScriptParser.New);
				this.state = 1461;
				this.singleExpression(0);
				this.state = 1463;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === TypeScriptParser.LessThan) {
					{
					this.state = 1462;
					this.typeArguments();
					}
				}

				this.state = 1465;
				this.arguments();
				}
				break;

			case 5:
				{
				_localctx = new NewExpressionContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 1467;
				this.match(TypeScriptParser.New);
				this.state = 1468;
				this.singleExpression(0);
				this.state = 1470;
				this._errHandler.sync(this);
				switch ( this.interpreter.adaptivePredict(this._input, 189, this._ctx) ) {
				case 1:
					{
					this.state = 1469;
					this.typeArguments();
					}
					break;
				}
				}
				break;

			case 6:
				{
				_localctx = new DeleteExpressionContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 1472;
				this.match(TypeScriptParser.Delete);
				this.state = 1473;
				this.singleExpression(38);
				}
				break;

			case 7:
				{
				_localctx = new VoidExpressionContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 1474;
				this.match(TypeScriptParser.Void);
				this.state = 1475;
				this.singleExpression(37);
				}
				break;

			case 8:
				{
				_localctx = new TypeofExpressionContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 1476;
				this.match(TypeScriptParser.Typeof);
				this.state = 1477;
				this.singleExpression(36);
				}
				break;

			case 9:
				{
				_localctx = new PreIncrementExpressionContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 1478;
				this.match(TypeScriptParser.PlusPlus);
				this.state = 1479;
				this.singleExpression(35);
				}
				break;

			case 10:
				{
				_localctx = new PreDecreaseExpressionContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 1480;
				this.match(TypeScriptParser.MinusMinus);
				this.state = 1481;
				this.singleExpression(34);
				}
				break;

			case 11:
				{
				_localctx = new UnaryPlusExpressionContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 1482;
				this.match(TypeScriptParser.Plus);
				this.state = 1483;
				this.singleExpression(33);
				}
				break;

			case 12:
				{
				_localctx = new UnaryMinusExpressionContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 1484;
				this.match(TypeScriptParser.Minus);
				this.state = 1485;
				this.singleExpression(32);
				}
				break;

			case 13:
				{
				_localctx = new BitNotExpressionContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 1486;
				this.match(TypeScriptParser.BitNot);
				this.state = 1487;
				this.singleExpression(31);
				}
				break;

			case 14:
				{
				_localctx = new NotExpressionContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 1488;
				this.match(TypeScriptParser.Not);
				this.state = 1489;
				this.singleExpression(30);
				}
				break;

			case 15:
				{
				_localctx = new IteratorsExpressionContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 1490;
				this.iteratorBlock();
				}
				break;

			case 16:
				{
				_localctx = new GeneratorsExpressionContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 1491;
				this.generatorBlock();
				}
				break;

			case 17:
				{
				_localctx = new GeneratorsFunctionExpressionContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 1492;
				this.generatorFunctionDeclaration();
				}
				break;

			case 18:
				{
				_localctx = new YieldExpressionContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 1493;
				this.yieldStatement();
				}
				break;

			case 19:
				{
				_localctx = new ThisExpressionContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 1494;
				this.match(TypeScriptParser.This);
				}
				break;

			case 20:
				{
				_localctx = new IdentifierExpressionContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 1495;
				this.identifierName();
				this.state = 1497;
				this._errHandler.sync(this);
				switch ( this.interpreter.adaptivePredict(this._input, 190, this._ctx) ) {
				case 1:
					{
					this.state = 1496;
					this.singleExpression(0);
					}
					break;
				}
				}
				break;

			case 21:
				{
				_localctx = new SuperExpressionContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 1499;
				this.match(TypeScriptParser.Super);
				}
				break;

			case 22:
				{
				_localctx = new LiteralExpressionContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 1500;
				this.literal();
				}
				break;

			case 23:
				{
				_localctx = new ArrayLiteralExpressionContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 1501;
				this.arrayLiteral();
				}
				break;

			case 24:
				{
				_localctx = new ObjectLiteralExpressionContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 1502;
				this.objectLiteral();
				}
				break;

			case 25:
				{
				_localctx = new ParenthesizedExpressionContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 1503;
				this.match(TypeScriptParser.OpenParen);
				this.state = 1504;
				this.expressionSequence();
				this.state = 1505;
				this.match(TypeScriptParser.CloseParen);
				}
				break;

			case 26:
				{
				_localctx = new GenericTypesContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 1507;
				this.typeArguments();
				this.state = 1509;
				this._errHandler.sync(this);
				switch ( this.interpreter.adaptivePredict(this._input, 191, this._ctx) ) {
				case 1:
					{
					this.state = 1508;
					this.expressionSequence();
					}
					break;
				}
				}
				break;
			}
			this._ctx._stop = this._input.tryLT(-1);
			this.state = 1588;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 195, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					if (this._parseListeners != null) {
						this.triggerExitRuleEvent();
					}
					_prevctx = _localctx;
					{
					this.state = 1586;
					this._errHandler.sync(this);
					switch ( this.interpreter.adaptivePredict(this._input, 194, this._ctx) ) {
					case 1:
						{
						_localctx = new MultiplicativeExpressionContext(new SingleExpressionContext(_parentctx, _parentState));
						this.pushNewRecursionContext(_localctx, _startState, TypeScriptParser.RULE_singleExpression);
						this.state = 1513;
						if (!(this.precpred(this._ctx, 29))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 29)");
						}
						this.state = 1514;
						_la = this._input.LA(1);
						if (!((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << TypeScriptParser.Multiply) | (1 << TypeScriptParser.Divide) | (1 << TypeScriptParser.Modulus))) !== 0))) {
						this._errHandler.recoverInline(this);
						} else {
							if (this._input.LA(1) === Token.EOF) {
								this.matchedEOF = true;
							}

							this._errHandler.reportMatch(this);
							this.consume();
						}
						this.state = 1515;
						this.singleExpression(30);
						}
						break;

					case 2:
						{
						_localctx = new AdditiveExpressionContext(new SingleExpressionContext(_parentctx, _parentState));
						this.pushNewRecursionContext(_localctx, _startState, TypeScriptParser.RULE_singleExpression);
						this.state = 1516;
						if (!(this.precpred(this._ctx, 28))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 28)");
						}
						this.state = 1517;
						_la = this._input.LA(1);
						if (!(_la === TypeScriptParser.Plus || _la === TypeScriptParser.Minus)) {
						this._errHandler.recoverInline(this);
						} else {
							if (this._input.LA(1) === Token.EOF) {
								this.matchedEOF = true;
							}

							this._errHandler.reportMatch(this);
							this.consume();
						}
						this.state = 1518;
						this.singleExpression(29);
						}
						break;

					case 3:
						{
						_localctx = new BitShiftExpressionContext(new SingleExpressionContext(_parentctx, _parentState));
						this.pushNewRecursionContext(_localctx, _startState, TypeScriptParser.RULE_singleExpression);
						this.state = 1519;
						if (!(this.precpred(this._ctx, 27))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 27)");
						}
						this.state = 1520;
						_la = this._input.LA(1);
						if (!((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << TypeScriptParser.RightShiftArithmetic) | (1 << TypeScriptParser.LeftShiftArithmetic) | (1 << TypeScriptParser.RightShiftLogical))) !== 0))) {
						this._errHandler.recoverInline(this);
						} else {
							if (this._input.LA(1) === Token.EOF) {
								this.matchedEOF = true;
							}

							this._errHandler.reportMatch(this);
							this.consume();
						}
						this.state = 1521;
						this.singleExpression(28);
						}
						break;

					case 4:
						{
						_localctx = new RelationalExpressionContext(new SingleExpressionContext(_parentctx, _parentState));
						this.pushNewRecursionContext(_localctx, _startState, TypeScriptParser.RULE_singleExpression);
						this.state = 1522;
						if (!(this.precpred(this._ctx, 26))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 26)");
						}
						this.state = 1523;
						_la = this._input.LA(1);
						if (!(((((_la - 30)) & ~0x1F) === 0 && ((1 << (_la - 30)) & ((1 << (TypeScriptParser.LessThan - 30)) | (1 << (TypeScriptParser.MoreThan - 30)) | (1 << (TypeScriptParser.LessThanEquals - 30)) | (1 << (TypeScriptParser.GreaterThanEquals - 30)))) !== 0))) {
						this._errHandler.recoverInline(this);
						} else {
							if (this._input.LA(1) === Token.EOF) {
								this.matchedEOF = true;
							}

							this._errHandler.reportMatch(this);
							this.consume();
						}
						this.state = 1524;
						this.singleExpression(27);
						}
						break;

					case 5:
						{
						_localctx = new InstanceofExpressionContext(new SingleExpressionContext(_parentctx, _parentState));
						this.pushNewRecursionContext(_localctx, _startState, TypeScriptParser.RULE_singleExpression);
						this.state = 1525;
						if (!(this.precpred(this._ctx, 25))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 25)");
						}
						this.state = 1526;
						this.match(TypeScriptParser.Instanceof);
						this.state = 1527;
						this.singleExpression(26);
						}
						break;

					case 6:
						{
						_localctx = new InExpressionContext(new SingleExpressionContext(_parentctx, _parentState));
						this.pushNewRecursionContext(_localctx, _startState, TypeScriptParser.RULE_singleExpression);
						this.state = 1528;
						if (!(this.precpred(this._ctx, 24))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 24)");
						}
						this.state = 1529;
						this.match(TypeScriptParser.In);
						this.state = 1530;
						this.singleExpression(25);
						}
						break;

					case 7:
						{
						_localctx = new EqualityExpressionContext(new SingleExpressionContext(_parentctx, _parentState));
						this.pushNewRecursionContext(_localctx, _startState, TypeScriptParser.RULE_singleExpression);
						this.state = 1531;
						if (!(this.precpred(this._ctx, 23))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 23)");
						}
						this.state = 1532;
						_la = this._input.LA(1);
						if (!(((((_la - 34)) & ~0x1F) === 0 && ((1 << (_la - 34)) & ((1 << (TypeScriptParser.Equals_ - 34)) | (1 << (TypeScriptParser.NotEquals - 34)) | (1 << (TypeScriptParser.IdentityEquals - 34)) | (1 << (TypeScriptParser.IdentityNotEquals - 34)))) !== 0))) {
						this._errHandler.recoverInline(this);
						} else {
							if (this._input.LA(1) === Token.EOF) {
								this.matchedEOF = true;
							}

							this._errHandler.reportMatch(this);
							this.consume();
						}
						this.state = 1533;
						this.singleExpression(24);
						}
						break;

					case 8:
						{
						_localctx = new BitAndExpressionContext(new SingleExpressionContext(_parentctx, _parentState));
						this.pushNewRecursionContext(_localctx, _startState, TypeScriptParser.RULE_singleExpression);
						this.state = 1534;
						if (!(this.precpred(this._ctx, 22))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 22)");
						}
						this.state = 1535;
						this.match(TypeScriptParser.BitAnd);
						this.state = 1536;
						this.singleExpression(23);
						}
						break;

					case 9:
						{
						_localctx = new BitXOrExpressionContext(new SingleExpressionContext(_parentctx, _parentState));
						this.pushNewRecursionContext(_localctx, _startState, TypeScriptParser.RULE_singleExpression);
						this.state = 1537;
						if (!(this.precpred(this._ctx, 21))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 21)");
						}
						this.state = 1538;
						this.match(TypeScriptParser.BitXOr);
						this.state = 1539;
						this.singleExpression(22);
						}
						break;

					case 10:
						{
						_localctx = new BitOrExpressionContext(new SingleExpressionContext(_parentctx, _parentState));
						this.pushNewRecursionContext(_localctx, _startState, TypeScriptParser.RULE_singleExpression);
						this.state = 1540;
						if (!(this.precpred(this._ctx, 20))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 20)");
						}
						this.state = 1541;
						this.match(TypeScriptParser.BitOr);
						this.state = 1542;
						this.singleExpression(21);
						}
						break;

					case 11:
						{
						_localctx = new LogicalAndExpressionContext(new SingleExpressionContext(_parentctx, _parentState));
						this.pushNewRecursionContext(_localctx, _startState, TypeScriptParser.RULE_singleExpression);
						this.state = 1543;
						if (!(this.precpred(this._ctx, 19))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 19)");
						}
						this.state = 1544;
						this.match(TypeScriptParser.And);
						this.state = 1545;
						this.singleExpression(20);
						}
						break;

					case 12:
						{
						_localctx = new LogicalOrExpressionContext(new SingleExpressionContext(_parentctx, _parentState));
						this.pushNewRecursionContext(_localctx, _startState, TypeScriptParser.RULE_singleExpression);
						this.state = 1546;
						if (!(this.precpred(this._ctx, 18))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 18)");
						}
						this.state = 1547;
						this.match(TypeScriptParser.Or);
						this.state = 1548;
						this.singleExpression(19);
						}
						break;

					case 13:
						{
						_localctx = new TernaryExpressionContext(new SingleExpressionContext(_parentctx, _parentState));
						this.pushNewRecursionContext(_localctx, _startState, TypeScriptParser.RULE_singleExpression);
						this.state = 1549;
						if (!(this.precpred(this._ctx, 17))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 17)");
						}
						this.state = 1550;
						this.match(TypeScriptParser.QuestionMark);
						this.state = 1551;
						this.singleExpression(0);
						this.state = 1552;
						this.match(TypeScriptParser.Colon);
						this.state = 1553;
						this.singleExpression(18);
						}
						break;

					case 14:
						{
						_localctx = new AssignmentExpressionContext(new SingleExpressionContext(_parentctx, _parentState));
						this.pushNewRecursionContext(_localctx, _startState, TypeScriptParser.RULE_singleExpression);
						this.state = 1555;
						if (!(this.precpred(this._ctx, 16))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 16)");
						}
						this.state = 1556;
						this.match(TypeScriptParser.Assign);
						this.state = 1557;
						this.singleExpression(17);
						}
						break;

					case 15:
						{
						_localctx = new AssignmentOperatorExpressionContext(new SingleExpressionContext(_parentctx, _parentState));
						this.pushNewRecursionContext(_localctx, _startState, TypeScriptParser.RULE_singleExpression);
						this.state = 1558;
						if (!(this.precpred(this._ctx, 15))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 15)");
						}
						this.state = 1559;
						this.assignmentOperator();
						this.state = 1560;
						this.singleExpression(16);
						}
						break;

					case 16:
						{
						_localctx = new MemberIndexExpressionContext(new SingleExpressionContext(_parentctx, _parentState));
						this.pushNewRecursionContext(_localctx, _startState, TypeScriptParser.RULE_singleExpression);
						this.state = 1562;
						if (!(this.precpred(this._ctx, 45))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 45)");
						}
						this.state = 1563;
						this.match(TypeScriptParser.OpenBracket);
						this.state = 1564;
						this.expressionSequence();
						this.state = 1565;
						this.match(TypeScriptParser.CloseBracket);
						}
						break;

					case 17:
						{
						_localctx = new MemberDotExpressionContext(new SingleExpressionContext(_parentctx, _parentState));
						this.pushNewRecursionContext(_localctx, _startState, TypeScriptParser.RULE_singleExpression);
						this.state = 1567;
						if (!(this.precpred(this._ctx, 44))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 44)");
						}
						this.state = 1568;
						this.match(TypeScriptParser.Dot);
						this.state = 1569;
						this.identifierName();
						this.state = 1571;
						this._errHandler.sync(this);
						switch ( this.interpreter.adaptivePredict(this._input, 193, this._ctx) ) {
						case 1:
							{
							this.state = 1570;
							this.nestedTypeGeneric();
							}
							break;
						}
						}
						break;

					case 18:
						{
						_localctx = new ArgumentsExpressionContext(new SingleExpressionContext(_parentctx, _parentState));
						this.pushNewRecursionContext(_localctx, _startState, TypeScriptParser.RULE_singleExpression);
						this.state = 1573;
						if (!(this.precpred(this._ctx, 41))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 41)");
						}
						this.state = 1574;
						this.arguments();
						}
						break;

					case 19:
						{
						_localctx = new PostIncrementExpressionContext(new SingleExpressionContext(_parentctx, _parentState));
						this.pushNewRecursionContext(_localctx, _startState, TypeScriptParser.RULE_singleExpression);
						this.state = 1575;
						if (!(this.precpred(this._ctx, 40))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 40)");
						}
						this.state = 1576;
						if (!(this.notLineTerminator())) {
							throw this.createFailedPredicateException("this.notLineTerminator()");
						}
						this.state = 1577;
						this.match(TypeScriptParser.PlusPlus);
						}
						break;

					case 20:
						{
						_localctx = new PostDecreaseExpressionContext(new SingleExpressionContext(_parentctx, _parentState));
						this.pushNewRecursionContext(_localctx, _startState, TypeScriptParser.RULE_singleExpression);
						this.state = 1578;
						if (!(this.precpred(this._ctx, 39))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 39)");
						}
						this.state = 1579;
						if (!(this.notLineTerminator())) {
							throw this.createFailedPredicateException("this.notLineTerminator()");
						}
						this.state = 1580;
						this.match(TypeScriptParser.MinusMinus);
						}
						break;

					case 21:
						{
						_localctx = new TemplateStringExpressionContext(new SingleExpressionContext(_parentctx, _parentState));
						this.pushNewRecursionContext(_localctx, _startState, TypeScriptParser.RULE_singleExpression);
						this.state = 1581;
						if (!(this.precpred(this._ctx, 14))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 14)");
						}
						this.state = 1582;
						this.templateStringLiteral();
						}
						break;

					case 22:
						{
						_localctx = new CastAsExpressionContext(new SingleExpressionContext(_parentctx, _parentState));
						this.pushNewRecursionContext(_localctx, _startState, TypeScriptParser.RULE_singleExpression);
						this.state = 1583;
						if (!(this.precpred(this._ctx, 1))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 1)");
						}
						this.state = 1584;
						this.match(TypeScriptParser.As);
						this.state = 1585;
						this.asExpression();
						}
						break;
					}
					}
				}
				this.state = 1590;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 195, this._ctx);
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
	public asExpression(): AsExpressionContext {
		let _localctx: AsExpressionContext = new AsExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 256, TypeScriptParser.RULE_asExpression);
		try {
			this.state = 1597;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 197, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 1591;
				this.predefinedType();
				this.state = 1594;
				this._errHandler.sync(this);
				switch ( this.interpreter.adaptivePredict(this._input, 196, this._ctx) ) {
				case 1:
					{
					this.state = 1592;
					this.match(TypeScriptParser.OpenBracket);
					this.state = 1593;
					this.match(TypeScriptParser.CloseBracket);
					}
					break;
				}
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 1596;
				this.singleExpression(0);
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
	public arrowFunctionDeclaration(): ArrowFunctionDeclarationContext {
		let _localctx: ArrowFunctionDeclarationContext = new ArrowFunctionDeclarationContext(this._ctx, this.state);
		this.enterRule(_localctx, 258, TypeScriptParser.RULE_arrowFunctionDeclaration);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1600;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === TypeScriptParser.Async) {
				{
				this.state = 1599;
				this.match(TypeScriptParser.Async);
				}
			}

			this.state = 1602;
			this.arrowFunctionParameters();
			this.state = 1604;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === TypeScriptParser.Colon) {
				{
				this.state = 1603;
				this.typeAnnotation();
				}
			}

			this.state = 1606;
			this.match(TypeScriptParser.ARROW);
			this.state = 1607;
			this.arrowFunctionBody();
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
	public arrowFunctionParameters(): ArrowFunctionParametersContext {
		let _localctx: ArrowFunctionParametersContext = new ArrowFunctionParametersContext(this._ctx, this.state);
		this.enterRule(_localctx, 260, TypeScriptParser.RULE_arrowFunctionParameters);
		let _la: number;
		try {
			this.state = 1615;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case TypeScriptParser.Identifier:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 1609;
				this.match(TypeScriptParser.Identifier);
				}
				break;
			case TypeScriptParser.OpenParen:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 1610;
				this.match(TypeScriptParser.OpenParen);
				this.state = 1612;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << TypeScriptParser.OpenBracket) | (1 << TypeScriptParser.OpenBrace) | (1 << TypeScriptParser.Ellipsis))) !== 0) || ((((_la - 101)) & ~0x1F) === 0 && ((1 << (_la - 101)) & ((1 << (TypeScriptParser.Private - 101)) | (1 << (TypeScriptParser.Public - 101)) | (1 << (TypeScriptParser.Protected - 101)) | (1 << (TypeScriptParser.TypeAlias - 101)) | (1 << (TypeScriptParser.Require - 101)) | (1 << (TypeScriptParser.At - 101)) | (1 << (TypeScriptParser.Identifier - 101)))) !== 0)) {
					{
					this.state = 1611;
					this.formalParameterList();
					}
				}

				this.state = 1614;
				this.match(TypeScriptParser.CloseParen);
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
	public arrowFunctionBody(): ArrowFunctionBodyContext {
		let _localctx: ArrowFunctionBodyContext = new ArrowFunctionBodyContext(this._ctx, this.state);
		this.enterRule(_localctx, 262, TypeScriptParser.RULE_arrowFunctionBody);
		try {
			this.state = 1622;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 202, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 1617;
				this.singleExpression(0);
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 1618;
				this.match(TypeScriptParser.OpenBrace);
				this.state = 1619;
				this.functionBody();
				this.state = 1620;
				this.match(TypeScriptParser.CloseBrace);
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
		this.enterRule(_localctx, 264, TypeScriptParser.RULE_assignmentOperator);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1624;
			_la = this._input.LA(1);
			if (!(((((_la - 43)) & ~0x1F) === 0 && ((1 << (_la - 43)) & ((1 << (TypeScriptParser.MultiplyAssign - 43)) | (1 << (TypeScriptParser.DivideAssign - 43)) | (1 << (TypeScriptParser.ModulusAssign - 43)) | (1 << (TypeScriptParser.PlusAssign - 43)) | (1 << (TypeScriptParser.MinusAssign - 43)) | (1 << (TypeScriptParser.LeftShiftArithmeticAssign - 43)) | (1 << (TypeScriptParser.RightShiftArithmeticAssign - 43)) | (1 << (TypeScriptParser.RightShiftLogicalAssign - 43)) | (1 << (TypeScriptParser.BitAndAssign - 43)) | (1 << (TypeScriptParser.BitXorAssign - 43)) | (1 << (TypeScriptParser.BitOrAssign - 43)))) !== 0))) {
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
	public literal(): LiteralContext {
		let _localctx: LiteralContext = new LiteralContext(this._ctx, this.state);
		this.enterRule(_localctx, 266, TypeScriptParser.RULE_literal);
		try {
			this.state = 1632;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case TypeScriptParser.NullLiteral:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 1626;
				this.match(TypeScriptParser.NullLiteral);
				}
				break;
			case TypeScriptParser.BooleanLiteral:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 1627;
				this.match(TypeScriptParser.BooleanLiteral);
				}
				break;
			case TypeScriptParser.StringLiteral:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 1628;
				this.match(TypeScriptParser.StringLiteral);
				}
				break;
			case TypeScriptParser.BackTick:
				this.enterOuterAlt(_localctx, 4);
				{
				this.state = 1629;
				this.templateStringLiteral();
				}
				break;
			case TypeScriptParser.RegularExpressionLiteral:
				this.enterOuterAlt(_localctx, 5);
				{
				this.state = 1630;
				this.match(TypeScriptParser.RegularExpressionLiteral);
				}
				break;
			case TypeScriptParser.DecimalLiteral:
			case TypeScriptParser.HexIntegerLiteral:
			case TypeScriptParser.OctalIntegerLiteral:
			case TypeScriptParser.OctalIntegerLiteral2:
			case TypeScriptParser.BinaryIntegerLiteral:
				this.enterOuterAlt(_localctx, 6);
				{
				this.state = 1631;
				this.numericLiteral();
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
	public templateStringLiteral(): TemplateStringLiteralContext {
		let _localctx: TemplateStringLiteralContext = new TemplateStringLiteralContext(this._ctx, this.state);
		this.enterRule(_localctx, 268, TypeScriptParser.RULE_templateStringLiteral);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1634;
			this.match(TypeScriptParser.BackTick);
			this.state = 1638;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === TypeScriptParser.TemplateStringStartExpression || _la === TypeScriptParser.TemplateStringAtom) {
				{
				{
				this.state = 1635;
				this.templateStringAtom();
				}
				}
				this.state = 1640;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 1641;
			this.match(TypeScriptParser.BackTick);
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
	public templateStringAtom(): TemplateStringAtomContext {
		let _localctx: TemplateStringAtomContext = new TemplateStringAtomContext(this._ctx, this.state);
		this.enterRule(_localctx, 270, TypeScriptParser.RULE_templateStringAtom);
		try {
			this.state = 1648;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case TypeScriptParser.TemplateStringAtom:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 1643;
				this.match(TypeScriptParser.TemplateStringAtom);
				}
				break;
			case TypeScriptParser.TemplateStringStartExpression:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 1644;
				this.match(TypeScriptParser.TemplateStringStartExpression);
				this.state = 1645;
				this.singleExpression(0);
				this.state = 1646;
				this.match(TypeScriptParser.TemplateCloseBrace);
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
	public numericLiteral(): NumericLiteralContext {
		let _localctx: NumericLiteralContext = new NumericLiteralContext(this._ctx, this.state);
		this.enterRule(_localctx, 272, TypeScriptParser.RULE_numericLiteral);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1650;
			_la = this._input.LA(1);
			if (!(((((_la - 57)) & ~0x1F) === 0 && ((1 << (_la - 57)) & ((1 << (TypeScriptParser.DecimalLiteral - 57)) | (1 << (TypeScriptParser.HexIntegerLiteral - 57)) | (1 << (TypeScriptParser.OctalIntegerLiteral - 57)) | (1 << (TypeScriptParser.OctalIntegerLiteral2 - 57)) | (1 << (TypeScriptParser.BinaryIntegerLiteral - 57)))) !== 0))) {
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
	public identifierName(): IdentifierNameContext {
		let _localctx: IdentifierNameContext = new IdentifierNameContext(this._ctx, this.state);
		this.enterRule(_localctx, 274, TypeScriptParser.RULE_identifierName);
		try {
			this.state = 1654;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case TypeScriptParser.Identifier:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 1652;
				this.match(TypeScriptParser.Identifier);
				}
				break;
			case TypeScriptParser.NullLiteral:
			case TypeScriptParser.BooleanLiteral:
			case TypeScriptParser.Break:
			case TypeScriptParser.Do:
			case TypeScriptParser.Instanceof:
			case TypeScriptParser.Typeof:
			case TypeScriptParser.Case:
			case TypeScriptParser.Else:
			case TypeScriptParser.New:
			case TypeScriptParser.Var:
			case TypeScriptParser.Catch:
			case TypeScriptParser.Finally:
			case TypeScriptParser.Return:
			case TypeScriptParser.Void:
			case TypeScriptParser.Continue:
			case TypeScriptParser.For:
			case TypeScriptParser.Switch:
			case TypeScriptParser.While:
			case TypeScriptParser.Debugger:
			case TypeScriptParser.Function_:
			case TypeScriptParser.This:
			case TypeScriptParser.With:
			case TypeScriptParser.Default:
			case TypeScriptParser.If:
			case TypeScriptParser.Throw:
			case TypeScriptParser.Delete:
			case TypeScriptParser.In:
			case TypeScriptParser.Try:
			case TypeScriptParser.From:
			case TypeScriptParser.ReadOnly:
			case TypeScriptParser.Async:
			case TypeScriptParser.Class:
			case TypeScriptParser.Enum:
			case TypeScriptParser.Extends:
			case TypeScriptParser.Super:
			case TypeScriptParser.Const:
			case TypeScriptParser.Export:
			case TypeScriptParser.Import:
			case TypeScriptParser.Implements:
			case TypeScriptParser.Let:
			case TypeScriptParser.Private:
			case TypeScriptParser.Public:
			case TypeScriptParser.Interface:
			case TypeScriptParser.Package:
			case TypeScriptParser.Protected:
			case TypeScriptParser.Static:
			case TypeScriptParser.Yield:
			case TypeScriptParser.String:
			case TypeScriptParser.TypeAlias:
			case TypeScriptParser.Get:
			case TypeScriptParser.Set:
			case TypeScriptParser.Require:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 1653;
				this.reservedWord();
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
	public identifierOrKeyWord(): IdentifierOrKeyWordContext {
		let _localctx: IdentifierOrKeyWordContext = new IdentifierOrKeyWordContext(this._ctx, this.state);
		this.enterRule(_localctx, 276, TypeScriptParser.RULE_identifierOrKeyWord);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1656;
			_la = this._input.LA(1);
			if (!(((((_la - 113)) & ~0x1F) === 0 && ((1 << (_la - 113)) & ((1 << (TypeScriptParser.TypeAlias - 113)) | (1 << (TypeScriptParser.Require - 113)) | (1 << (TypeScriptParser.Identifier - 113)))) !== 0))) {
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
	public reservedWord(): ReservedWordContext {
		let _localctx: ReservedWordContext = new ReservedWordContext(this._ctx, this.state);
		this.enterRule(_localctx, 278, TypeScriptParser.RULE_reservedWord);
		try {
			this.state = 1661;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case TypeScriptParser.Break:
			case TypeScriptParser.Do:
			case TypeScriptParser.Instanceof:
			case TypeScriptParser.Typeof:
			case TypeScriptParser.Case:
			case TypeScriptParser.Else:
			case TypeScriptParser.New:
			case TypeScriptParser.Var:
			case TypeScriptParser.Catch:
			case TypeScriptParser.Finally:
			case TypeScriptParser.Return:
			case TypeScriptParser.Void:
			case TypeScriptParser.Continue:
			case TypeScriptParser.For:
			case TypeScriptParser.Switch:
			case TypeScriptParser.While:
			case TypeScriptParser.Debugger:
			case TypeScriptParser.Function_:
			case TypeScriptParser.This:
			case TypeScriptParser.With:
			case TypeScriptParser.Default:
			case TypeScriptParser.If:
			case TypeScriptParser.Throw:
			case TypeScriptParser.Delete:
			case TypeScriptParser.In:
			case TypeScriptParser.Try:
			case TypeScriptParser.From:
			case TypeScriptParser.ReadOnly:
			case TypeScriptParser.Async:
			case TypeScriptParser.Class:
			case TypeScriptParser.Enum:
			case TypeScriptParser.Extends:
			case TypeScriptParser.Super:
			case TypeScriptParser.Const:
			case TypeScriptParser.Export:
			case TypeScriptParser.Import:
			case TypeScriptParser.Implements:
			case TypeScriptParser.Let:
			case TypeScriptParser.Private:
			case TypeScriptParser.Public:
			case TypeScriptParser.Interface:
			case TypeScriptParser.Package:
			case TypeScriptParser.Protected:
			case TypeScriptParser.Static:
			case TypeScriptParser.Yield:
			case TypeScriptParser.String:
			case TypeScriptParser.TypeAlias:
			case TypeScriptParser.Get:
			case TypeScriptParser.Set:
			case TypeScriptParser.Require:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 1658;
				this.keyword();
				}
				break;
			case TypeScriptParser.NullLiteral:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 1659;
				this.match(TypeScriptParser.NullLiteral);
				}
				break;
			case TypeScriptParser.BooleanLiteral:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 1660;
				this.match(TypeScriptParser.BooleanLiteral);
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
	public keyword(): KeywordContext {
		let _localctx: KeywordContext = new KeywordContext(this._ctx, this.state);
		this.enterRule(_localctx, 280, TypeScriptParser.RULE_keyword);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1663;
			_la = this._input.LA(1);
			if (!(((((_la - 62)) & ~0x1F) === 0 && ((1 << (_la - 62)) & ((1 << (TypeScriptParser.Break - 62)) | (1 << (TypeScriptParser.Do - 62)) | (1 << (TypeScriptParser.Instanceof - 62)) | (1 << (TypeScriptParser.Typeof - 62)) | (1 << (TypeScriptParser.Case - 62)) | (1 << (TypeScriptParser.Else - 62)) | (1 << (TypeScriptParser.New - 62)) | (1 << (TypeScriptParser.Var - 62)) | (1 << (TypeScriptParser.Catch - 62)) | (1 << (TypeScriptParser.Finally - 62)) | (1 << (TypeScriptParser.Return - 62)) | (1 << (TypeScriptParser.Void - 62)) | (1 << (TypeScriptParser.Continue - 62)) | (1 << (TypeScriptParser.For - 62)) | (1 << (TypeScriptParser.Switch - 62)) | (1 << (TypeScriptParser.While - 62)) | (1 << (TypeScriptParser.Debugger - 62)) | (1 << (TypeScriptParser.Function_ - 62)) | (1 << (TypeScriptParser.This - 62)) | (1 << (TypeScriptParser.With - 62)) | (1 << (TypeScriptParser.Default - 62)) | (1 << (TypeScriptParser.If - 62)) | (1 << (TypeScriptParser.Throw - 62)) | (1 << (TypeScriptParser.Delete - 62)) | (1 << (TypeScriptParser.In - 62)) | (1 << (TypeScriptParser.Try - 62)) | (1 << (TypeScriptParser.From - 62)) | (1 << (TypeScriptParser.ReadOnly - 62)) | (1 << (TypeScriptParser.Async - 62)) | (1 << (TypeScriptParser.Class - 62)) | (1 << (TypeScriptParser.Enum - 62)))) !== 0) || ((((_la - 94)) & ~0x1F) === 0 && ((1 << (_la - 94)) & ((1 << (TypeScriptParser.Extends - 94)) | (1 << (TypeScriptParser.Super - 94)) | (1 << (TypeScriptParser.Const - 94)) | (1 << (TypeScriptParser.Export - 94)) | (1 << (TypeScriptParser.Import - 94)) | (1 << (TypeScriptParser.Implements - 94)) | (1 << (TypeScriptParser.Let - 94)) | (1 << (TypeScriptParser.Private - 94)) | (1 << (TypeScriptParser.Public - 94)) | (1 << (TypeScriptParser.Interface - 94)) | (1 << (TypeScriptParser.Package - 94)) | (1 << (TypeScriptParser.Protected - 94)) | (1 << (TypeScriptParser.Static - 94)) | (1 << (TypeScriptParser.Yield - 94)) | (1 << (TypeScriptParser.String - 94)) | (1 << (TypeScriptParser.TypeAlias - 94)) | (1 << (TypeScriptParser.Get - 94)) | (1 << (TypeScriptParser.Set - 94)) | (1 << (TypeScriptParser.Require - 94)))) !== 0))) {
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
	public getter(): GetterContext {
		let _localctx: GetterContext = new GetterContext(this._ctx, this.state);
		this.enterRule(_localctx, 282, TypeScriptParser.RULE_getter);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1665;
			this.match(TypeScriptParser.Get);
			this.state = 1666;
			this.propertyName();
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
	public setter(): SetterContext {
		let _localctx: SetterContext = new SetterContext(this._ctx, this.state);
		this.enterRule(_localctx, 284, TypeScriptParser.RULE_setter);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1668;
			this.match(TypeScriptParser.Set);
			this.state = 1669;
			this.propertyName();
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
	public eos(): EosContext {
		let _localctx: EosContext = new EosContext(this._ctx, this.state);
		this.enterRule(_localctx, 286, TypeScriptParser.RULE_eos);
		try {
			this.state = 1675;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 208, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 1671;
				this.match(TypeScriptParser.SemiColon);
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 1672;
				this.match(TypeScriptParser.EOF);
				}
				break;

			case 3:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 1673;
				if (!(this.lineTerminatorAhead())) {
					throw this.createFailedPredicateException("this.lineTerminatorAhead()");
				}
				}
				break;

			case 4:
				this.enterOuterAlt(_localctx, 4);
				{
				this.state = 1674;
				if (!(this.closeBrace())) {
					throw this.createFailedPredicateException("this.closeBrace()");
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

	public sempred(_localctx: RuleContext, ruleIndex: number, predIndex: number): boolean {
		switch (ruleIndex) {
		case 10:
			return this.unionOrIntersectionOrPrimaryType_sempred(_localctx as UnionOrIntersectionOrPrimaryTypeContext, predIndex);

		case 11:
			return this.primaryType_sempred(_localctx as PrimaryTypeContext, predIndex);

		case 22:
			return this.arrayType_sempred(_localctx as ArrayTypeContext, predIndex);

		case 57:
			return this.decoratorMemberExpression_sempred(_localctx as DecoratorMemberExpressionContext, predIndex);

		case 73:
			return this.expressionStatement_sempred(_localctx as ExpressionStatementContext, predIndex);

		case 75:
			return this.iterationStatement_sempred(_localctx as IterationStatementContext, predIndex);

		case 77:
			return this.continueStatement_sempred(_localctx as ContinueStatementContext, predIndex);

		case 78:
			return this.breakStatement_sempred(_localctx as BreakStatementContext, predIndex);

		case 79:
			return this.returnStatement_sempred(_localctx as ReturnStatementContext, predIndex);

		case 80:
			return this.yieldStatement_sempred(_localctx as YieldStatementContext, predIndex);

		case 88:
			return this.throwStatement_sempred(_localctx as ThrowStatementContext, predIndex);

		case 127:
			return this.singleExpression_sempred(_localctx as SingleExpressionContext, predIndex);

		case 143:
			return this.eos_sempred(_localctx as EosContext, predIndex);
		}
		return true;
	}
	private unionOrIntersectionOrPrimaryType_sempred(_localctx: UnionOrIntersectionOrPrimaryTypeContext, predIndex: number): boolean {
		switch (predIndex) {
		case 0:
			return this.precpred(this._ctx, 3);

		case 1:
			return this.precpred(this._ctx, 2);
		}
		return true;
	}
	private primaryType_sempred(_localctx: PrimaryTypeContext, predIndex: number): boolean {
		switch (predIndex) {
		case 2:
			return this.precpred(this._ctx, 5);

		case 3:
			return this.notLineTerminator();
		}
		return true;
	}
	private arrayType_sempred(_localctx: ArrayTypeContext, predIndex: number): boolean {
		switch (predIndex) {
		case 4:
			return this.notLineTerminator();
		}
		return true;
	}
	private decoratorMemberExpression_sempred(_localctx: DecoratorMemberExpressionContext, predIndex: number): boolean {
		switch (predIndex) {
		case 5:
			return this.precpred(this._ctx, 2);
		}
		return true;
	}
	private expressionStatement_sempred(_localctx: ExpressionStatementContext, predIndex: number): boolean {
		switch (predIndex) {
		case 6:
			return this.notOpenBraceAndNotFunction();
		}
		return true;
	}
	private iterationStatement_sempred(_localctx: IterationStatementContext, predIndex: number): boolean {
		switch (predIndex) {
		case 7:
			return this.p("of");

		case 8:
			return this.p("of");
		}
		return true;
	}
	private continueStatement_sempred(_localctx: ContinueStatementContext, predIndex: number): boolean {
		switch (predIndex) {
		case 9:
			return this.notLineTerminator();
		}
		return true;
	}
	private breakStatement_sempred(_localctx: BreakStatementContext, predIndex: number): boolean {
		switch (predIndex) {
		case 10:
			return this.notLineTerminator();
		}
		return true;
	}
	private returnStatement_sempred(_localctx: ReturnStatementContext, predIndex: number): boolean {
		switch (predIndex) {
		case 11:
			return this.notLineTerminator();
		}
		return true;
	}
	private yieldStatement_sempred(_localctx: YieldStatementContext, predIndex: number): boolean {
		switch (predIndex) {
		case 12:
			return this.notLineTerminator();
		}
		return true;
	}
	private throwStatement_sempred(_localctx: ThrowStatementContext, predIndex: number): boolean {
		switch (predIndex) {
		case 13:
			return this.notLineTerminator();
		}
		return true;
	}
	private singleExpression_sempred(_localctx: SingleExpressionContext, predIndex: number): boolean {
		switch (predIndex) {
		case 14:
			return this.precpred(this._ctx, 29);

		case 15:
			return this.precpred(this._ctx, 28);

		case 16:
			return this.precpred(this._ctx, 27);

		case 17:
			return this.precpred(this._ctx, 26);

		case 18:
			return this.precpred(this._ctx, 25);

		case 19:
			return this.precpred(this._ctx, 24);

		case 20:
			return this.precpred(this._ctx, 23);

		case 21:
			return this.precpred(this._ctx, 22);

		case 22:
			return this.precpred(this._ctx, 21);

		case 23:
			return this.precpred(this._ctx, 20);

		case 24:
			return this.precpred(this._ctx, 19);

		case 25:
			return this.precpred(this._ctx, 18);

		case 26:
			return this.precpred(this._ctx, 17);

		case 27:
			return this.precpred(this._ctx, 16);

		case 28:
			return this.precpred(this._ctx, 15);

		case 29:
			return this.precpred(this._ctx, 45);

		case 30:
			return this.precpred(this._ctx, 44);

		case 31:
			return this.precpred(this._ctx, 41);

		case 32:
			return this.precpred(this._ctx, 40);

		case 33:
			return this.notLineTerminator();

		case 34:
			return this.precpred(this._ctx, 39);

		case 35:
			return this.notLineTerminator();

		case 36:
			return this.precpred(this._ctx, 14);

		case 37:
			return this.precpred(this._ctx, 1);
		}
		return true;
	}
	private eos_sempred(_localctx: EosContext, predIndex: number): boolean {
		switch (predIndex) {
		case 38:
			return this.lineTerminatorAhead();

		case 39:
			return this.closeBrace();
		}
		return true;
	}

	private static readonly _serializedATNSegments: number = 4;
	private static readonly _serializedATNSegment0: string =
		"\x03\uC91D\uCABA\u058D\uAFBA\u4F53\u0607\uEA8B\uC241\x03\x87\u0690\x04" +
		"\x02\t\x02\x04\x03\t\x03\x04\x04\t\x04\x04\x05\t\x05\x04\x06\t\x06\x04" +
		"\x07\t\x07\x04\b\t\b\x04\t\t\t\x04\n\t\n\x04\v\t\v\x04\f\t\f\x04\r\t\r" +
		"\x04\x0E\t\x0E\x04\x0F\t\x0F\x04\x10\t\x10\x04\x11\t\x11\x04\x12\t\x12" +
		"\x04\x13\t\x13\x04\x14\t\x14\x04\x15\t\x15\x04\x16\t\x16\x04\x17\t\x17" +
		"\x04\x18\t\x18\x04\x19\t\x19\x04\x1A\t\x1A\x04\x1B\t\x1B\x04\x1C\t\x1C" +
		"\x04\x1D\t\x1D\x04\x1E\t\x1E\x04\x1F\t\x1F\x04 \t \x04!\t!\x04\"\t\"\x04" +
		"#\t#\x04$\t$\x04%\t%\x04&\t&\x04\'\t\'\x04(\t(\x04)\t)\x04*\t*\x04+\t" +
		"+\x04,\t,\x04-\t-\x04.\t.\x04/\t/\x040\t0\x041\t1\x042\t2\x043\t3\x04" +
		"4\t4\x045\t5\x046\t6\x047\t7\x048\t8\x049\t9\x04:\t:\x04;\t;\x04<\t<\x04" +
		"=\t=\x04>\t>\x04?\t?\x04@\t@\x04A\tA\x04B\tB\x04C\tC\x04D\tD\x04E\tE\x04" +
		"F\tF\x04G\tG\x04H\tH\x04I\tI\x04J\tJ\x04K\tK\x04L\tL\x04M\tM\x04N\tN\x04" +
		"O\tO\x04P\tP\x04Q\tQ\x04R\tR\x04S\tS\x04T\tT\x04U\tU\x04V\tV\x04W\tW\x04" +
		"X\tX\x04Y\tY\x04Z\tZ\x04[\t[\x04\\\t\\\x04]\t]\x04^\t^\x04_\t_\x04`\t" +
		"`\x04a\ta\x04b\tb\x04c\tc\x04d\td\x04e\te\x04f\tf\x04g\tg\x04h\th\x04" +
		"i\ti\x04j\tj\x04k\tk\x04l\tl\x04m\tm\x04n\tn\x04o\to\x04p\tp\x04q\tq\x04" +
		"r\tr\x04s\ts\x04t\tt\x04u\tu\x04v\tv\x04w\tw\x04x\tx\x04y\ty\x04z\tz\x04" +
		"{\t{\x04|\t|\x04}\t}\x04~\t~\x04\x7F\t\x7F\x04\x80\t\x80\x04\x81\t\x81" +
		"\x04\x82\t\x82\x04\x83\t\x83\x04\x84\t\x84\x04\x85\t\x85\x04\x86\t\x86" +
		"\x04\x87\t\x87\x04\x88\t\x88\x04\x89\t\x89\x04\x8A\t\x8A\x04\x8B\t\x8B" +
		"\x04\x8C\t\x8C\x04\x8D\t\x8D\x04\x8E\t\x8E\x04\x8F\t\x8F\x04\x90\t\x90" +
		"\x04\x91\t\x91\x03\x02\x03\x02\x03\x02\x03\x03\x03\x03\x05\x03\u0128\n" +
		"\x03\x03\x04\x03\x04\x05\x04\u012C\n\x04\x03\x04\x03\x04\x03\x05\x03\x05" +
		"\x03\x05\x07\x05\u0133\n\x05\f\x05\x0E\x05\u0136\v\x05\x03\x06\x03\x06" +
		"\x05\x06\u013A\n\x06\x03\x06\x05\x06\u013D\n\x06\x03\x07\x03\x07\x03\x07" +
		"\x03\b\x03\b\x05\b\u0144\n\b\x03\b\x03\b\x03\t\x03\t\x03\t\x07\t\u014B" +
		"\n\t\f\t\x0E\t\u014E\v\t\x03\n\x03\n\x03\v\x03\v\x03\v\x03\v\x03\v\x05" +
		"\v\u0157\n\v\x03\f\x03\f\x03\f\x03\f\x03\f\x03\f\x03\f\x03\f\x03\f\x07" +
		"\f\u0162\n\f\f\f\x0E\f\u0165\v\f\x03\r\x03\r\x03\r\x03\r\x03\r\x03\r\x03" +
		"\r\x03\r\x03\r\x03\r\x03\r\x03\r\x03\r\x03\r\x03\r\x03\r\x03\r\x03\r\x05" +
		"\r\u0179\n\r\x03\r\x03\r\x03\r\x03\r\x07\r\u017F\n\r\f\r\x0E\r\u0182\v" +
		"\r\x03\x0E\x03\x0E\x03\x0F\x03\x0F\x05\x0F\u0188\n\x0F\x03\x10\x03\x10" +
		"\x05\x10\u018C\n\x10\x03\x11\x03\x11\x03\x11\x03\x11\x03\x12\x03\x12\x03" +
		"\x12\x03\x12\x03\x12\x03\x12\x03\x12\x03\x12\x03\x12\x05\x12\u019B\n\x12" +
		"\x03\x13\x03\x13\x05\x13\u019F\n\x13\x03\x14\x03\x14\x05\x14\u01A3\n\x14" +
		"\x03\x14\x03\x14\x03\x15\x03\x15\x05\x15\u01A9\n\x15\x03\x16\x03\x16\x03" +
		"\x16\x07\x16\u01AE\n\x16\f\x16\x0E\x16\u01B1\v\x16\x03\x17\x03\x17\x03" +
		"\x17\x03\x17\x03\x17\x03\x17\x03\x17\x05\x17\u01BA\n\x17\x05\x17\u01BC" +
		"\n\x17\x03\x18\x03\x18\x03\x18\x03\x18\x03\x18\x03\x19\x03\x19\x03\x19" +
		"\x03\x19\x03\x1A\x03\x1A\x03\x1A\x07\x1A\u01CA\n\x1A\f\x1A\x0E\x1A\u01CD" +
		"\v\x1A\x03\x1B\x05\x1B\u01D0\n\x1B\x03\x1B\x03\x1B\x05\x1B\u01D4\n\x1B" +
		"\x03\x1B\x03\x1B\x03\x1B\x03\x1B\x03\x1C\x03\x1C\x05\x1C\u01DC\n\x1C\x03" +
		"\x1C\x03\x1C\x05\x1C\u01E0\n\x1C\x03\x1C\x03\x1C\x03\x1C\x03\x1C\x03\x1D" +
		"\x03\x1D\x03\x1D\x03\x1E\x03\x1E\x03\x1E\x03\x1E\x06\x1E\u01ED\n\x1E\r" +
		"\x1E\x0E\x1E\u01EE\x03\x1E\x03\x1E\x05\x1E\u01F3\n\x1E\x03\x1F\x05\x1F" +
		"\u01F6\n\x1F\x03\x1F\x03\x1F\x05\x1F\u01FA\n\x1F\x03\x1F\x05\x1F\u01FD" +
		"\n\x1F\x03\x1F\x03\x1F\x05\x1F\u0201\n\x1F\x03 \x03 \x03 \x03!\x05!\u0207" +
		"\n!\x03!\x03!\x05!\u020B\n!\x03!\x03!\x05!\u020F\n!\x03\"\x03\"\x03\"" +
		"\x03\"\x07\"\u0215\n\"\f\"\x0E\"\u0218\v\"\x03\"\x03\"\x05\"\u021C\n\"" +
		"\x05\"\u021E\n\"\x03#\x03#\x03#\x07#\u0223\n#\f#\x0E#\u0226\v#\x03$\x03" +
		"$\x05$\u022A\n$\x03%\x05%\u022D\n%\x03%\x05%\u0230\n%\x03%\x03%\x03%\x05" +
		"%\u0235\n%\x03%\x05%\u0238\n%\x03%\x05%\u023B\n%\x03&\x03&\x03&\x05&\u0240" +
		"\n&\x03\'\x05\'\u0243\n\'\x03\'\x05\'\u0246\n\'\x03\'\x03\'\x05\'\u024A" +
		"\n\'\x03(\x03(\x03)\x03)\x05)\u0250\n)\x03*\x03*\x05*\u0254\n*\x03*\x03" +
		"*\x05*\u0258\n*\x03*\x03*\x05*\u025C\n*\x03+\x03+\x03+\x03+\x03+\x03+" +
		"\x03+\x03,\x03,\x05,\u0267\n,\x03,\x03,\x03-\x03-\x03-\x05-\u026E\n-\x03" +
		"-\x03-\x03-\x03-\x03.\x05.\u0275\n.\x03.\x03.\x03.\x05.\u027A\n.\x03." +
		"\x03.\x03.\x03.\x03.\x03.\x05.\u0282\n.\x03/\x05/\u0285\n/\x03/\x05/\u0288" +
		"\n/\x03/\x03/\x03/\x05/\u028D\n/\x03/\x05/\u0290\n/\x03/\x03/\x05/\u0294" +
		"\n/\x030\x030\x030\x031\x031\x031\x071\u029C\n1\f1\x0E1\u029F\v1\x032" +
		"\x052\u02A2\n2\x032\x032\x032\x032\x052\u02A8\n2\x032\x032\x033\x033\x05" +
		"3\u02AE\n3\x034\x034\x034\x074\u02B3\n4\f4\x0E4\u02B6\v4\x035\x035\x03" +
		"5\x055\u02BB\n5\x036\x036\x036\x036\x056\u02C1\n6\x036\x036\x037\x037" +
		"\x067\u02C7\n7\r7\x0E7\u02C8\x037\x077\u02CC\n7\f7\x0E7\u02CF\v7\x038" +
		"\x038\x038\x038\x038\x039\x069\u02D7\n9\r9\x0E9\u02D8\x03:\x03:\x03:\x05" +
		":\u02DE\n:\x03;\x03;\x03;\x03;\x03;\x03;\x05;\u02E6\n;\x03;\x03;\x03;" +
		"\x07;\u02EB\n;\f;\x0E;\u02EE\v;\x03<\x03<\x03<\x03=\x05=\u02F4\n=\x03" +
		"=\x03=\x03>\x05>\u02F9\n>\x03>\x03>\x03?\x03?\x03?\x03?\x03?\x03?\x03" +
		"?\x03?\x03?\x03?\x03?\x03?\x03?\x03?\x03?\x03?\x03?\x03?\x03?\x03?\x03" +
		"?\x03?\x03?\x03?\x03?\x03?\x03?\x03?\x03?\x03?\x05?\u031B\n?\x03@\x03" +
		"@\x05@\u031F\n@\x03@\x03@\x03A\x06A\u0324\nA\rA\x0EA\u0325\x03B\x03B\x03" +
		"B\x03B\x05B\u032C\nB\x03B\x03B\x03C\x03C\x03C\x05C\u0333\nC\x03D\x03D" +
		"\x05D\u0337\nD\x03D\x03D\x05D\u033B\nD\x03D\x03D\x03D\x03D\x03E\x03E\x03" +
		"E\x05E\u0344\nE\x03E\x03E\x03E\x03E\x07E\u034A\nE\fE\x0EE\u034D\vE\x03" +
		"E\x03E\x03F\x03F\x05F\u0353\nF\x03F\x03F\x05F\u0357\nF\x03G\x03G\x05G" +
		"\u035B\nG\x03G\x03G\x05G\u035F\nG\x03G\x05G\u0362\nG\x03G\x05G\u0365\n" +
		"G\x03G\x05G\u0368\nG\x03G\x03G\x05G\u036C\nG\x03G\x03G\x05G\u0370\nG\x03" +
		"G\x03G\x05G\u0374\nG\x05G\u0376\nG\x03H\x03H\x03H\x07H\u037B\nH\fH\x0E" +
		"H\u037E\vH\x03I\x03I\x03I\x05I\u0383\nI\x03I\x05I\u0386\nI\x03I\x05I\u0389" +
		"\nI\x03I\x03I\x05I\u038D\nI\x03I\x05I\u0390\nI\x03J\x03J\x03K\x03K\x03" +
		"K\x05K\u0397\nK\x03L\x03L\x03L\x03L\x03L\x03L\x03L\x05L\u03A0\nL\x03M" +
		"\x03M\x03M\x03M\x03M\x03M\x03M\x03M\x03M\x03M\x03M\x03M\x03M\x03M\x03" +
		"M\x03M\x03M\x05M\u03B3\nM\x03M\x03M\x05M\u03B7\nM\x03M\x03M\x05M\u03BB" +
		"\nM\x03M\x03M\x03M\x03M\x03M\x03M\x03M\x03M\x05M\u03C5\nM\x03M\x03M\x05" +
		"M\u03C9\nM\x03M\x03M\x03M\x03M\x03M\x03M\x03M\x03M\x03M\x05M\u03D4\nM" +
		"\x03M\x03M\x03M\x03M\x03M\x03M\x03M\x03M\x03M\x03M\x03M\x05M\u03E1\nM" +
		"\x03M\x03M\x03M\x03M\x05M\u03E7\nM\x03N\x03N\x03O\x03O\x03O\x05O\u03EE" +
		"\nO\x03O\x03O\x03P\x03P\x03P\x05P\u03F5\nP\x03P\x03P\x03Q\x03Q\x03Q\x05" +
		"Q\u03FC\nQ\x03Q\x03Q\x03R\x03R\x03R\x05R\u0403\nR\x03R\x03R\x03S\x03S" +
		"\x03S\x03S\x03S\x03S\x03T\x03T\x03T\x03T\x03T\x03T\x03U\x03U\x05U\u0415" +
		"\nU\x03U\x03U\x05U\u0419\nU\x05U\u041B\nU\x03U\x03U\x03V\x06V\u0420\n" +
		"V\rV\x0EV\u0421\x03W\x03W\x03W\x03W\x05W\u0428\nW\x03X\x03X\x03X\x05X" +
		"\u042D\nX\x03Y\x03Y\x03Y\x03Y\x03Z\x03Z\x03Z\x03Z\x03Z\x03[\x03[\x03[" +
		"\x03[\x05[\u043C\n[\x03[\x05[\u043F\n[\x03\\\x03\\\x03\\\x03\\\x03\\\x03" +
		"\\\x03]\x03]\x03]\x03^\x03^\x03^\x03_\x03_\x03_\x03_\x03_\x03_\x03_\x03" +
		"_\x05_\u0455\n_\x03`\x05`\u0458\n`\x03`\x03`\x03`\x05`\u045D\n`\x03`\x03" +
		"`\x03`\x03a\x05a\u0463\na\x03a\x05a\u0466\na\x03b\x03b\x07b\u046A\nb\f" +
		"b\x0Eb\u046D\vb\x03b\x03b\x03c\x03c\x03c\x03d\x03d\x03d\x03e\x03e\x05" +
		"e\u0479\ne\x03e\x03e\x03e\x05e\u047E\ne\x03f\x03f\x03f\x05f\u0483\nf\x03" +
		"f\x05f\u0486\nf\x03f\x05f\u0489\nf\x03f\x03f\x03f\x03f\x03f\x03f\x03f" +
		"\x03f\x03f\x03f\x05f\u0495\nf\x03f\x03f\x03f\x05f\u049A\nf\x03f\x05f\u049D" +
		"\nf\x03g\x05g\u04A0\ng\x03g\x05g\u04A3\ng\x03g\x05g\u04A6\ng\x03g\x05" +
		"g\u04A9\ng\x03h\x03h\x03h\x03i\x05i\u04AF\ni\x03i\x03i\x03i\x05i\u04B4" +
		"\ni\x03i\x03i\x03i\x03i\x03i\x03j\x03j\x03j\x05j\u04BE\nj\x03j\x03j\x05" +
		"j\u04C2\nj\x03j\x03j\x03j\x03j\x03j\x03k\x03k\x03k\x03k\x07k\u04CD\nk" +
		"\fk\x0Ek\u04D0\vk\x03k\x05k\u04D3\nk\x03k\x03k\x03l\x03l\x03l\x03m\x03" +
		"m\x03m\x03m\x07m\u04DE\nm\fm\x0Em\u04E1\vm\x03m\x05m\u04E4\nm\x03m\x03" +
		"m\x03n\x03n\x03n\x03n\x03n\x05n\u04ED\nn\x03n\x03n\x03n\x03n\x03n\x03" +
		"o\x03o\x03o\x07o\u04F7\no\fo\x0Eo\u04FA\vo\x03o\x03o\x05o\u04FE\no\x03" +
		"o\x03o\x03o\x03o\x03o\x05o\u0505\no\x05o\u0507\no\x03p\x05p\u050A\np\x03" +
		"p\x05p\u050D\np\x03p\x03p\x05p\u0511\np\x03p\x05p\u0514\np\x03p\x03p\x05" +
		"p\u0518\np\x03q\x03q\x03q\x03r\x05r\u051E\nr\x03s\x06s\u0521\ns\rs\x0E" +
		"s\u0522\x03t\x03t\x05t\u0527\nt\x03t\x03t\x03u\x03u\x06u\u052D\nu\ru\x0E" +
		"u\u052E\x03u\x07u\u0532\nu\fu\x0Eu\u0535\vu\x03v\x05v\u0538\nv\x03v\x03" +
		"v\x05v\u053C\nv\x03v\x05v\u053F\nv\x03w\x03w\x03w\x03w\x07w\u0545\nw\f" +
		"w\x0Ew\u0548\vw\x03w\x05w\u054B\nw\x05w\u054D\nw\x03w\x03w\x03x\x03x\x03" +
		"x\x03x\x03x\x03x\x03x\x03x\x03x\x03x\x03x\x03x\x03x\x03x\x03x\x05x\u0560" +
		"\nx\x03y\x03y\x03y\x03y\x05y\u0566\ny\x03y\x03y\x03y\x03y\x03z\x03z\x03" +
		"z\x03z\x05z\u0570\nz\x03z\x05z\u0573\nz\x03z\x03z\x03z\x03z\x03z\x03{" +
		"\x03{\x03{\x05{\u057D\n{\x03|\x03|\x03|\x05|\u0582\n|\x05|\u0584\n|\x03" +
		"|\x03|\x03}\x03}\x03}\x07}\u058B\n}\f}\x0E}\u058E\v}\x03~\x05~\u0591\n" +
		"~\x03~\x03~\x05~\u0595\n~\x03\x7F\x03\x7F\x03\x7F\x07\x7F\u059A\n\x7F" +
		"\f\x7F\x0E\x7F\u059D\v\x7F\x03\x80\x03\x80\x05\x80\u05A1\n\x80\x03\x80" +
		"\x03\x80\x05\x80\u05A5\n\x80\x03\x80\x03\x80\x05\x80\u05A9\n\x80\x03\x80" +
		"\x03\x80\x03\x80\x03\x80\x03\x81\x03\x81\x03\x81\x03\x81\x03\x81\x05\x81" +
		"\u05B4\n\x81\x03\x81\x03\x81\x03\x81\x03\x81\x05\x81\u05BA\n\x81\x03\x81" +
		"\x03\x81\x03\x81\x03\x81\x03\x81\x05\x81\u05C1\n\x81\x03\x81\x03\x81\x03" +
		"\x81\x03\x81\x03\x81\x03\x81\x03\x81\x03\x81\x03\x81\x03\x81\x03\x81\x03" +
		"\x81\x03\x81\x03\x81\x03\x81\x03\x81\x03\x81\x03\x81\x03\x81\x03\x81\x03" +
		"\x81\x03\x81\x03\x81\x03\x81\x03\x81\x05\x81\u05DC\n\x81\x03\x81\x03\x81" +
		"\x03\x81\x03\x81\x03\x81\x03\x81\x03\x81\x03\x81\x03\x81\x03\x81\x05\x81" +
		"\u05E8\n\x81\x05\x81\u05EA\n\x81\x03\x81\x03\x81\x03\x81\x03\x81\x03\x81" +
		"\x03\x81\x03\x81\x03\x81\x03\x81\x03\x81\x03\x81\x03\x81\x03\x81\x03\x81" +
		"\x03\x81\x03\x81\x03\x81\x03\x81\x03\x81\x03\x81\x03\x81\x03\x81\x03\x81" +
		"\x03\x81\x03\x81\x03\x81\x03\x81\x03\x81\x03\x81\x03\x81\x03\x81\x03\x81" +
		"\x03\x81\x03\x81\x03\x81\x03\x81\x03\x81\x03\x81\x03\x81\x03\x81\x03\x81" +
		"\x03\x81\x03\x81\x03\x81\x03\x81\x03\x81\x03\x81\x03\x81\x03\x81\x03\x81" +
		"\x03\x81\x03\x81\x03\x81\x03\x81\x03\x81\x03\x81\x03\x81\x03\x81\x05\x81" +
		"\u0626\n\x81\x03\x81\x03\x81\x03\x81\x03\x81\x03\x81\x03\x81\x03\x81\x03" +
		"\x81\x03\x81\x03\x81\x03\x81\x03\x81\x03\x81\x07\x81\u0635\n\x81\f\x81" +
		"\x0E\x81\u0638\v\x81\x03\x82\x03\x82\x03\x82\x05\x82\u063D\n\x82\x03\x82" +
		"\x05\x82\u0640\n\x82\x03\x83\x05\x83\u0643\n\x83\x03\x83\x03\x83\x05\x83" +
		"\u0647\n\x83\x03\x83\x03\x83\x03\x83\x03\x84\x03\x84\x03\x84\x05\x84\u064F" +
		"\n\x84\x03\x84\x05\x84\u0652\n\x84\x03\x85\x03\x85\x03\x85\x03\x85\x03" +
		"\x85\x05\x85\u0659\n\x85\x03\x86\x03\x86\x03\x87\x03\x87\x03\x87\x03\x87" +
		"\x03\x87\x03\x87\x05\x87\u0663\n\x87\x03\x88\x03\x88\x07\x88\u0667\n\x88" +
		"\f\x88\x0E\x88\u066A\v\x88\x03\x88\x03\x88\x03\x89\x03\x89\x03\x89\x03" +
		"\x89\x03\x89\x05\x89\u0673\n\x89\x03\x8A\x03\x8A\x03\x8B\x03\x8B\x05\x8B" +
		"\u0679\n\x8B\x03\x8C\x03\x8C\x03\x8D\x03\x8D\x03\x8D\x05\x8D\u0680\n\x8D" +
		"\x03\x8E\x03\x8E\x03\x8F\x03\x8F\x03\x8F\x03\x90\x03\x90\x03\x90\x03\x91" +
		"\x03\x91\x03\x91\x03\x91\x05\x91\u068E\n\x91\x03\x91\x02\x02\x06\x16\x18" +
		"t\u0100\x92\x02\x02\x04\x02\x06\x02\b\x02\n\x02\f\x02\x0E\x02\x10\x02" +
		"\x12\x02\x14\x02\x16\x02\x18\x02\x1A\x02\x1C\x02\x1E\x02 \x02\"\x02$\x02" +
		"&\x02(\x02*\x02,\x02.\x020\x022\x024\x026\x028\x02:\x02<\x02>\x02@\x02" +
		"B\x02D\x02F\x02H\x02J\x02L\x02N\x02P\x02R\x02T\x02V\x02X\x02Z\x02\\\x02" +
		"^\x02`\x02b\x02d\x02f\x02h\x02j\x02l\x02n\x02p\x02r\x02t\x02v\x02x\x02" +
		"z\x02|\x02~\x02\x80\x02\x82\x02\x84\x02\x86\x02\x88\x02\x8A\x02\x8C\x02" +
		"\x8E\x02\x90\x02\x92\x02\x94\x02\x96\x02\x98\x02\x9A\x02\x9C\x02\x9E\x02" +
		"\xA0\x02\xA2\x02\xA4\x02\xA6\x02\xA8\x02\xAA\x02\xAC\x02\xAE\x02\xB0\x02" +
		"\xB2\x02\xB4\x02\xB6\x02\xB8\x02\xBA\x02\xBC\x02\xBE\x02\xC0\x02\xC2\x02" +
		"\xC4\x02\xC6\x02\xC8\x02\xCA\x02\xCC\x02\xCE\x02\xD0\x02\xD2\x02\xD4\x02" +
		"\xD6\x02\xD8\x02\xDA\x02\xDC\x02\xDE\x02\xE0\x02\xE2\x02\xE4\x02\xE6\x02" +
		"\xE8\x02\xEA\x02\xEC\x02\xEE\x02\xF0\x02\xF2\x02\xF4\x02\xF6\x02\xF8\x02" +
		"\xFA\x02\xFC\x02\xFE\x02\u0100\x02\u0102\x02\u0104\x02\u0106\x02\u0108" +
		"\x02\u010A\x02\u010C\x02\u010E\x02\u0110\x02\u0112\x02\u0114\x02\u0116" +
		"\x02\u0118\x02\u011A\x02\u011C\x02\u011E\x02\u0120\x02\x02\x11\x04\x02" +
		"KKnr\x03\x02\r\x0E\x04\x02ghkk\x04\x02ooqq\x05\x02GGbbff\x04\x02\x0F\x0F" +
		"\x11\x11\x03\x02\x1A\x1C\x03\x02\x16\x17\x03\x02\x1D\x1F\x03\x02 #\x03" +
		"\x02$\'\x03\x02-7\x03\x02;?\x05\x02ssxx~~\x07\x02@Y[mqqsuxx\x02\u073D" +
		"\x02\u0122\x03\x02\x02\x02\x04\u0127\x03\x02\x02\x02\x06\u0129\x03\x02" +
		"\x02\x02\b\u012F\x03\x02\x02\x02\n\u013C\x03\x02\x02\x02\f\u013E\x03\x02" +
		"\x02\x02\x0E\u0141\x03\x02\x02\x02\x10\u0147\x03\x02\x02\x02\x12\u014F" +
		"\x03\x02\x02\x02\x14\u0156\x03\x02\x02\x02\x16\u0158\x03\x02\x02\x02\x18" +
		"\u0178\x03\x02\x02\x02\x1A\u0183\x03\x02\x02\x02\x1C\u0185\x03\x02\x02" +
		"\x02\x1E\u018B\x03\x02\x02\x02 \u018D\x03\x02\x02\x02\"\u0191\x03\x02" +
		"\x02\x02$\u019E\x03\x02\x02\x02&\u01A0\x03\x02\x02\x02(\u01A6\x03\x02" +
		"\x02\x02*\u01AA\x03\x02\x02\x02,\u01BB\x03\x02\x02\x02.\u01BD\x03\x02" +
		"\x02\x020\u01C2\x03\x02\x02\x022\u01C6\x03\x02\x02\x024\u01CF\x03\x02" +
		"\x02\x026\u01D9\x03\x02\x02\x028\u01E5\x03\x02\x02\x02:\u01F2\x03\x02" +
		"\x02\x02<\u01F5\x03\x02\x02\x02>\u0202\x03\x02\x02\x02@\u0206\x03\x02" +
		"\x02\x02B\u021D\x03\x02\x02\x02D\u021F\x03\x02\x02\x02F\u0229\x03\x02" +
		"\x02\x02H\u022C\x03\x02\x02\x02J\u023C\x03\x02\x02\x02L\u0242\x03\x02" +
		"\x02\x02N\u024B\x03\x02\x02\x02P\u024F\x03\x02\x02\x02R\u0251\x03\x02" +
		"\x02\x02T\u025D\x03\x02\x02\x02V\u0264\x03\x02\x02\x02X\u026A\x03\x02" +
		"\x02\x02Z\u0274\x03\x02\x02\x02\\\u0284\x03\x02\x02\x02^\u0295\x03\x02" +
		"\x02\x02`\u0298\x03\x02\x02\x02b\u02A1\x03\x02\x02\x02d\u02AB\x03\x02" +
		"\x02\x02f\u02AF\x03\x02\x02\x02h\u02B7\x03\x02\x02\x02j\u02BC\x03\x02" +
		"\x02\x02l\u02C4\x03\x02\x02\x02n\u02D0\x03\x02\x02\x02p\u02D6\x03\x02" +
		"\x02\x02r\u02DA\x03\x02\x02\x02t\u02E5\x03\x02\x02\x02v\u02EF\x03\x02" +
		"\x02\x02x\u02F3\x03\x02\x02\x02z\u02F8\x03\x02\x02\x02|\u031A\x03\x02" +
		"\x02\x02~\u031C\x03\x02\x02\x02\x80\u0323\x03\x02\x02\x02\x82\u0327\x03" +
		"\x02\x02\x02\x84\u032F\x03\x02\x02\x02\x86\u0336\x03\x02\x02\x02\x88\u0343" +
		"\x03\x02\x02\x02\x8A\u0350\x03\x02\x02\x02\x8C\u0375\x03\x02\x02\x02\x8E" +
		"\u0377\x03\x02\x02\x02\x90\u0382\x03\x02\x02\x02\x92\u0391\x03\x02\x02" +
		"\x02\x94\u0393\x03\x02\x02\x02\x96\u0398\x03\x02\x02\x02\x98\u03E6\x03" +
		"\x02\x02\x02\x9A\u03E8\x03\x02\x02\x02\x9C\u03EA\x03\x02\x02\x02\x9E\u03F1" +
		"\x03\x02\x02\x02\xA0\u03F8\x03\x02\x02\x02\xA2\u03FF\x03\x02\x02\x02\xA4" +
		"\u0406\x03\x02\x02\x02\xA6\u040C\x03\x02\x02\x02\xA8\u0412\x03\x02\x02" +
		"\x02\xAA\u041F\x03\x02\x02\x02\xAC\u0423\x03\x02\x02\x02\xAE\u0429\x03" +
		"\x02\x02\x02\xB0\u042E\x03\x02\x02\x02\xB2\u0432\x03\x02\x02\x02\xB4\u0437" +
		"\x03\x02\x02\x02\xB6\u0440\x03\x02\x02\x02\xB8\u0446\x03\x02\x02\x02\xBA" +
		"\u0449\x03\x02\x02\x02\xBC\u044C\x03\x02\x02\x02\xBE\u0457\x03\x02\x02" +
		"\x02\xC0\u0462\x03\x02\x02\x02\xC2\u0467\x03\x02\x02\x02\xC4\u0470\x03" +
		"\x02\x02\x02\xC6\u0473\x03\x02\x02\x02\xC8\u047D\x03\x02\x02\x02\xCA\u049C" +
		"\x03\x02\x02\x02\xCC\u049F\x03\x02\x02\x02\xCE\u04AA\x03\x02\x02\x02\xD0" +
		"\u04AE\x03\x02\x02\x02\xD2\u04BA\x03\x02\x02\x02\xD4\u04C8\x03\x02\x02" +
		"\x02\xD6\u04D6\x03\x02\x02\x02\xD8\u04D9\x03\x02\x02\x02\xDA\u04E7\x03" +
		"\x02\x02\x02\xDC\u0506\x03\x02\x02\x02\xDE\u0509\x03\x02\x02\x02\xE0\u0519" +
		"\x03\x02\x02\x02\xE2\u051D\x03\x02\x02\x02\xE4\u0520\x03\x02\x02\x02\xE6" +
		"\u0524\x03\x02\x02\x02\xE8\u052A\x03\x02\x02\x02\xEA\u0537\x03\x02\x02" +
		"\x02\xEC\u0540\x03\x02\x02\x02\xEE\u055F\x03\x02\x02\x02\xF0\u0561\x03" +
		"\x02\x02\x02\xF2\u056B\x03\x02\x02\x02\xF4\u057C\x03\x02\x02\x02\xF6\u057E" +
		"\x03\x02\x02\x02\xF8\u0587\x03\x02\x02\x02\xFA\u0590\x03\x02\x02\x02\xFC" +
		"\u0596\x03\x02\x02\x02\xFE\u059E\x03\x02\x02\x02\u0100\u05E9\x03\x02\x02" +
		"\x02\u0102\u063F\x03\x02\x02\x02\u0104\u0642\x03\x02\x02\x02\u0106\u0651" +
		"\x03\x02\x02\x02\u0108\u0658\x03\x02\x02\x02\u010A\u065A\x03\x02\x02\x02" +
		"\u010C\u0662\x03\x02\x02\x02\u010E\u0664\x03\x02\x02\x02\u0110\u0672\x03" +
		"\x02\x02\x02\u0112\u0674\x03\x02\x02\x02\u0114\u0678\x03\x02\x02\x02\u0116" +
		"\u067A\x03\x02\x02\x02\u0118\u067F\x03\x02\x02\x02\u011A\u0681\x03\x02" +
		"\x02\x02\u011C\u0683\x03\x02\x02\x02\u011E\u0686\x03\x02\x02\x02\u0120" +
		"\u068D\x03\x02\x02\x02\u0122\u0123\x07\x0F\x02\x02\u0123\u0124\x05\u0100" +
		"\x81\x02\u0124\x03\x03\x02\x02\x02\u0125\u0128\x05\xE6t\x02\u0126\u0128" +
		"\x05\xECw\x02\u0127\u0125\x03\x02\x02\x02\u0127\u0126\x03\x02\x02\x02" +
		"\u0128\x05\x03\x02\x02\x02\u0129\u012B\x07 \x02\x02\u012A\u012C\x05\b" +
		"\x05\x02\u012B\u012A\x03\x02\x02\x02\u012B\u012C\x03\x02\x02\x02\u012C" +
		"\u012D\x03\x02\x02\x02\u012D\u012E\x07!\x02\x02\u012E\x07\x03\x02\x02" +
		"\x02\u012F\u0134\x05\n\x06\x02\u0130\u0131\x07\x0E\x02\x02\u0131\u0133" +
		"\x05\n\x06\x02\u0132\u0130\x03\x02\x02\x02\u0133\u0136\x03\x02\x02\x02" +
		"\u0134\u0132\x03\x02\x02\x02\u0134\u0135\x03\x02\x02\x02\u0135\t\x03\x02" +
		"\x02\x02\u0136\u0134\x03\x02\x02\x02\u0137\u0139";
	private static readonly _serializedATNSegment1: string =
		"\x07~\x02\x02\u0138\u013A\x05\f\x07\x02\u0139\u0138\x03\x02\x02\x02\u0139" +
		"\u013A\x03\x02\x02\x02\u013A\u013D\x03\x02\x02\x02\u013B\u013D\x05\x06" +
		"\x04\x02\u013C\u0137\x03\x02\x02\x02\u013C\u013B\x03\x02\x02\x02\u013D" +
		"\v\x03\x02\x02\x02\u013E\u013F\x07`\x02\x02\u013F\u0140\x05\x14\v\x02" +
		"\u0140\r\x03\x02\x02\x02\u0141\u0143\x07 \x02\x02\u0142\u0144\x05\x10" +
		"\t\x02\u0143\u0142\x03\x02\x02\x02\u0143\u0144\x03\x02\x02\x02\u0144\u0145" +
		"\x03\x02\x02\x02\u0145\u0146\x07!\x02\x02\u0146\x0F\x03\x02\x02\x02\u0147" +
		"\u014C\x05\x12\n\x02\u0148\u0149\x07\x0E\x02\x02\u0149\u014B\x05\x12\n" +
		"\x02\u014A\u0148\x03\x02\x02\x02\u014B\u014E\x03\x02\x02\x02\u014C\u014A" +
		"\x03\x02\x02\x02\u014C\u014D\x03\x02\x02\x02\u014D\x11\x03\x02\x02\x02" +
		"\u014E\u014C\x03\x02\x02\x02\u014F\u0150\x05\x14\v\x02\u0150\x13\x03\x02" +
		"\x02\x02\u0151\u0157\x05\x16\f\x02\u0152\u0157\x054\x1B\x02\u0153\u0157" +
		"\x056\x1C\x02\u0154\u0157\x05 \x11\x02\u0155\u0157\x07\x7F\x02\x02\u0156" +
		"\u0151\x03\x02\x02\x02\u0156\u0152\x03\x02\x02\x02\u0156\u0153\x03\x02" +
		"\x02\x02\u0156\u0154\x03\x02\x02\x02\u0156\u0155\x03\x02\x02\x02\u0157" +
		"\x15\x03\x02\x02\x02\u0158\u0159\b\f\x01\x02\u0159\u015A\x05\x18\r\x02" +
		"\u015A\u0163\x03\x02\x02\x02\u015B\u015C\f\x05\x02\x02\u015C\u015D\x07" +
		"*\x02\x02\u015D\u0162\x05\x16\f\x06\u015E\u015F\f\x04\x02\x02\u015F\u0160" +
		"\x07(\x02\x02\u0160\u0162\x05\x16\f\x05\u0161\u015B\x03\x02\x02\x02\u0161" +
		"\u015E\x03\x02\x02\x02\u0162\u0165\x03\x02\x02\x02\u0163\u0161\x03\x02" +
		"\x02\x02\u0163\u0164\x03\x02\x02\x02\u0164\x17\x03\x02\x02\x02\u0165\u0163" +
		"\x03\x02\x02\x02\u0166\u0167\b\r\x01\x02\u0167\u0168\x07\b\x02\x02\u0168" +
		"\u0169\x05\x14\v\x02\u0169\u016A\x07\t\x02\x02\u016A\u0179\x03\x02\x02" +
		"\x02\u016B\u0179\x05\x1A\x0E\x02\u016C\u0179\x05\x1C\x0F\x02\u016D\u0179" +
		"\x05&\x14\x02\u016E\u016F\x07\x06\x02\x02\u016F\u0170\x052\x1A\x02\u0170" +
		"\u0171\x07\x07\x02\x02\u0171\u0179\x03\x02\x02\x02\u0172\u0179\x058\x1D" +
		"\x02\u0173\u0179\x07R\x02\x02\u0174\u0175\x05\x1C\x0F\x02\u0175\u0176" +
		"\x07|\x02\x02\u0176\u0177\x05\x18\r\x03\u0177\u0179\x03\x02\x02\x02\u0178" +
		"\u0166\x03\x02\x02\x02\u0178\u016B\x03\x02\x02\x02\u0178\u016C\x03\x02" +
		"\x02\x02\u0178\u016D\x03\x02\x02\x02\u0178\u016E\x03\x02\x02\x02\u0178" +
		"\u0172\x03\x02\x02\x02\u0178\u0173\x03\x02\x02\x02\u0178\u0174\x03\x02" +
		"\x02\x02\u0179\u0180\x03\x02\x02\x02\u017A\u017B\f\x07\x02\x02\u017B\u017C" +
		"\x06\r\x05\x02\u017C\u017D\x07\x06\x02\x02\u017D\u017F\x07\x07\x02\x02" +
		"\u017E\u017A\x03\x02\x02\x02\u017F\u0182\x03\x02\x02\x02\u0180\u017E\x03" +
		"\x02\x02\x02\u0180\u0181\x03\x02\x02\x02\u0181\x19\x03\x02\x02\x02\u0182" +
		"\u0180\x03\x02\x02\x02\u0183\u0184\t\x02\x02\x02\u0184\x1B\x03\x02\x02" +
		"\x02\u0185\u0187\x05$\x13\x02\u0186\u0188\x05\x1E\x10\x02\u0187\u0186" +
		"\x03\x02\x02\x02\u0187\u0188\x03\x02\x02\x02\u0188\x1D\x03\x02\x02\x02" +
		"\u0189\u018C\x05\"\x12\x02\u018A\u018C\x05 \x11\x02\u018B\u0189\x03\x02" +
		"\x02\x02\u018B\u018A\x03\x02\x02\x02\u018C\x1F\x03\x02\x02\x02\u018D\u018E" +
		"\x07 \x02\x02\u018E\u018F\x05\x10\t\x02\u018F\u0190\x07!\x02\x02\u0190" +
		"!\x03\x02\x02\x02\u0191\u0192\x07 \x02\x02\u0192\u0193\x05\x10\t\x02\u0193" +
		"\u0194\x07 \x02\x02\u0194\u019A\x05\x10\t\x02\u0195\u0196\x07!\x02\x02" +
		"\u0196\u0197\x05\x04\x03\x02\u0197\u0198\x07!\x02\x02\u0198\u019B\x03" +
		"\x02\x02\x02\u0199\u019B\x07\x1D\x02\x02\u019A\u0195\x03\x02\x02\x02\u019A" +
		"\u0199\x03\x02\x02\x02\u019B#\x03\x02\x02\x02\u019C\u019F\x07~\x02\x02" +
		"\u019D\u019F\x05l7\x02\u019E\u019C\x03\x02\x02\x02\u019E\u019D\x03\x02" +
		"\x02\x02\u019F%\x03\x02\x02\x02\u01A0\u01A2\x07\n\x02\x02\u01A1\u01A3" +
		"\x05(\x15\x02\u01A2\u01A1\x03\x02\x02\x02\u01A2\u01A3\x03\x02\x02\x02" +
		"\u01A3\u01A4\x03\x02\x02\x02\u01A4\u01A5\x07\f\x02\x02\u01A5\'\x03\x02" +
		"\x02\x02\u01A6\u01A8\x05*\x16\x02\u01A7\u01A9\t\x03\x02\x02\u01A8\u01A7" +
		"\x03\x02\x02\x02\u01A8\u01A9\x03\x02\x02\x02\u01A9)\x03\x02\x02\x02\u01AA" +
		"\u01AF\x05,\x17\x02\u01AB\u01AC\t\x03\x02\x02\u01AC\u01AE\x05,\x17\x02" +
		"\u01AD\u01AB\x03\x02\x02\x02\u01AE\u01B1\x03\x02\x02\x02\u01AF\u01AD\x03" +
		"\x02\x02\x02\u01AF\u01B0\x03\x02\x02\x02\u01B0+\x03\x02\x02\x02\u01B1" +
		"\u01AF\x03\x02\x02\x02\u01B2\u01BC\x05<\x1F\x02\u01B3\u01BC\x05@!\x02" +
		"\u01B4\u01BC\x05R*\x02\u01B5\u01BC\x05T+\x02\u01B6\u01B9\x05V,\x02\u01B7" +
		"\u01B8\x078\x02\x02\u01B8\u01BA\x05\x14\v\x02\u01B9\u01B7\x03\x02\x02" +
		"\x02\u01B9\u01BA\x03\x02\x02\x02\u01BA\u01BC\x03\x02\x02\x02\u01BB\u01B2" +
		"\x03\x02\x02\x02\u01BB\u01B3\x03\x02\x02\x02\u01BB\u01B4\x03\x02\x02\x02" +
		"\u01BB\u01B5\x03\x02\x02\x02\u01BB\u01B6\x03\x02\x02\x02\u01BC-\x03\x02" +
		"\x02\x02\u01BD\u01BE\x05\x18\r\x02\u01BE\u01BF\x06\x18\x06\x02\u01BF\u01C0" +
		"\x07\x06\x02\x02\u01C0\u01C1\x07\x07\x02\x02\u01C1/\x03\x02\x02\x02\u01C2" +
		"\u01C3\x07\x06\x02\x02\u01C3\u01C4\x052\x1A\x02\u01C4\u01C5\x07\x07\x02" +
		"\x02\u01C51\x03\x02\x02\x02\u01C6\u01CB\x05\x14\v\x02\u01C7\u01C8\x07" +
		"\x0E\x02\x02\u01C8\u01CA\x05\x14\v\x02\u01C9\u01C7\x03\x02\x02\x02\u01CA" +
		"\u01CD\x03\x02\x02\x02\u01CB\u01C9\x03\x02\x02\x02\u01CB\u01CC\x03\x02" +
		"\x02\x02\u01CC3\x03\x02\x02\x02\u01CD\u01CB\x03\x02\x02\x02\u01CE\u01D0" +
		"\x05\x06\x04\x02\u01CF\u01CE\x03\x02\x02\x02\u01CF\u01D0\x03\x02\x02\x02" +
		"\u01D0\u01D1\x03\x02\x02\x02\u01D1\u01D3\x07\b\x02\x02\u01D2\u01D4\x05" +
		"B\"\x02\u01D3\u01D2\x03\x02\x02\x02\u01D3\u01D4\x03\x02\x02\x02\u01D4" +
		"\u01D5\x03\x02\x02\x02\u01D5\u01D6\x07\t\x02\x02\u01D6\u01D7\x078\x02" +
		"\x02\u01D7\u01D8\x05\x14\v\x02\u01D85\x03\x02\x02\x02\u01D9\u01DB\x07" +
		"F\x02\x02\u01DA\u01DC\x05\x06\x04\x02\u01DB\u01DA\x03\x02\x02\x02\u01DB" +
		"\u01DC\x03\x02\x02\x02\u01DC\u01DD\x03\x02\x02\x02\u01DD\u01DF\x07\b\x02" +
		"\x02\u01DE\u01E0\x05B\"\x02\u01DF\u01DE\x03\x02\x02\x02\u01DF\u01E0\x03" +
		"\x02\x02\x02\u01E0\u01E1\x03\x02\x02\x02\u01E1\u01E2\x07\t\x02\x02\u01E2" +
		"\u01E3\x078\x02\x02\u01E3\u01E4\x05\x14\v\x02\u01E47\x03\x02\x02\x02\u01E5" +
		"\u01E6\x07C\x02\x02\u01E6\u01E7\x05:\x1E\x02\u01E79\x03\x02\x02\x02\u01E8" +
		"\u01F3\x07~\x02\x02\u01E9\u01EA\x05\u0114\x8B\x02\u01EA\u01EB\x07\x13" +
		"\x02\x02\u01EB\u01ED\x03\x02\x02\x02\u01EC\u01E9\x03\x02\x02\x02\u01ED" +
		"\u01EE\x03\x02\x02\x02\u01EE\u01EC\x03\x02\x02\x02\u01EE\u01EF\x03\x02" +
		"\x02\x02\u01EF\u01F0\x03\x02\x02\x02\u01F0\u01F1\x05\u0114\x8B\x02\u01F1" +
		"\u01F3\x03\x02\x02\x02\u01F2\u01E8\x03\x02\x02\x02\u01F2\u01EC\x03\x02" +
		"\x02\x02\u01F3;\x03\x02\x02\x02\u01F4\u01F6\x07\\\x02\x02\u01F5\u01F4" +
		"\x03\x02\x02\x02\u01F5\u01F6\x03\x02\x02\x02\u01F6\u01F7\x03\x02\x02\x02" +
		"\u01F7\u01F9\x05\xF4{\x02\u01F8\u01FA\x07\x10\x02\x02\u01F9\u01F8\x03" +
		"\x02\x02\x02\u01F9\u01FA\x03\x02\x02\x02\u01FA\u01FC\x03\x02\x02\x02\u01FB" +
		"\u01FD\x05> \x02\u01FC\u01FB\x03\x02\x02\x02\u01FC\u01FD\x03\x02\x02\x02" +
		"\u01FD\u0200\x03\x02\x02\x02\u01FE\u01FF\x078\x02\x02\u01FF\u0201\x05" +
		"\x14\v\x02\u0200\u01FE\x03\x02\x02\x02\u0200\u0201\x03\x02\x02\x02\u0201" +
		"=\x03\x02\x02\x02\u0202\u0203\x07\x11\x02\x02\u0203\u0204\x05\x14\v\x02" +
		"\u0204?\x03\x02\x02\x02\u0205\u0207\x05\x06\x04\x02\u0206\u0205\x03\x02" +
		"\x02\x02\u0206\u0207\x03\x02\x02\x02\u0207\u0208\x03\x02\x02\x02\u0208" +
		"\u020A\x07\b\x02\x02\u0209\u020B\x05B\"\x02\u020A\u0209\x03\x02\x02\x02" +
		"\u020A\u020B\x03\x02\x02\x02\u020B\u020C\x03\x02\x02\x02\u020C\u020E\x07" +
		"\t\x02\x02\u020D\u020F\x05> \x02\u020E\u020D\x03\x02\x02\x02\u020E\u020F" +
		"\x03\x02\x02\x02\u020FA\x03\x02\x02\x02\u0210\u021E\x05J&\x02\u0211\u0216" +
		"\x05F$\x02\u0212\u0213\x07\x0E\x02\x02\u0213\u0215\x05F$\x02\u0214\u0212" +
		"\x03\x02\x02\x02\u0215\u0218\x03\x02\x02\x02\u0216\u0214\x03\x02\x02\x02" +
		"\u0216\u0217\x03\x02\x02\x02\u0217\u021B\x03\x02\x02\x02\u0218\u0216\x03" +
		"\x02\x02\x02\u0219\u021A\x07\x0E\x02\x02\u021A\u021C\x05J&\x02\u021B\u0219" +
		"\x03\x02\x02\x02\u021B\u021C\x03\x02\x02\x02\u021C\u021E\x03\x02\x02\x02" +
		"\u021D\u0210\x03\x02\x02\x02\u021D\u0211\x03\x02\x02\x02\u021EC\x03\x02" +
		"\x02\x02\u021F\u0224\x05L\'\x02\u0220\u0221\x07\x0E\x02\x02\u0221\u0223" +
		"\x05L\'\x02\u0222\u0220\x03\x02\x02\x02\u0223\u0226\x03\x02\x02\x02\u0224" +
		"\u0222\x03\x02\x02\x02\u0224\u0225\x03\x02\x02\x02\u0225E\x03\x02\x02" +
		"\x02\u0226\u0224\x03\x02\x02\x02\u0227\u022A\x05L\'\x02\u0228\u022A\x05" +
		"H%\x02\u0229\u0227\x03\x02\x02\x02\u0229\u0228\x03\x02\x02\x02\u022AG" +
		"\x03\x02\x02\x02\u022B\u022D\x05p9\x02\u022C\u022B\x03\x02\x02\x02\u022C" +
		"\u022D\x03\x02\x02\x02\u022D\u022F\x03\x02\x02\x02\u022E\u0230\x05N(\x02" +
		"\u022F\u022E\x03\x02\x02\x02\u022F\u0230\x03\x02\x02\x02\u0230\u0231\x03" +
		"\x02\x02\x02\u0231\u023A\x05P)\x02\u0232\u0234\x07\x10\x02\x02\u0233\u0235" +
		"\x05> \x02\u0234\u0233\x03\x02\x02\x02\u0234\u0235\x03\x02\x02\x02\u0235" +
		"\u023B\x03\x02\x02\x02\u0236\u0238\x05> \x02\u0237\u0236\x03\x02\x02\x02" +
		"\u0237\u0238\x03\x02\x02\x02\u0238\u0239\x03\x02\x02\x02\u0239\u023B\x05" +
		"\x02\x02\x02\u023A\u0232\x03\x02\x02\x02\u023A\u0237\x03\x02\x02\x02\u023B" +
		"I\x03\x02\x02\x02\u023C\u023D\x07\x12\x02\x02\u023D\u023F\x05\u0100\x81" +
		"\x02\u023E\u0240\x05> \x02\u023F\u023E\x03\x02\x02\x02\u023F\u0240\x03" +
		"\x02\x02\x02\u0240K\x03\x02\x02\x02\u0241\u0243\x05p9\x02\u0242\u0241" +
		"\x03\x02\x02\x02\u0242\u0243\x03\x02\x02\x02\u0243\u0245\x03\x02\x02\x02" +
		"\u0244\u0246\x05N(\x02\u0245\u0244\x03\x02\x02\x02\u0245\u0246\x03\x02" +
		"\x02\x02\u0246\u0247\x03\x02\x02\x02\u0247\u0249\x05P)\x02\u0248\u024A" +
		"\x05> \x02\u0249\u0248\x03\x02\x02\x02\u0249\u024A\x03\x02\x02\x02\u024A" +
		"M\x03\x02\x02\x02\u024B\u024C\t\x04\x02\x02\u024CO\x03\x02\x02\x02\u024D" +
		"\u0250\x05\u0114\x8B\x02\u024E\u0250\x05\x04\x03\x02\u024F\u024D\x03\x02" +
		"\x02\x02\u024F\u024E\x03\x02\x02\x02\u0250Q\x03\x02\x02\x02\u0251\u0253" +
		"\x07F\x02\x02\u0252\u0254\x05\x06\x04\x02\u0253\u0252\x03\x02\x02\x02" +
		"\u0253\u0254\x03\x02\x02\x02\u0254\u0255\x03\x02\x02\x02\u0255\u0257\x07" +
		"\b\x02\x02\u0256\u0258\x05B\"\x02\u0257\u0256\x03\x02\x02\x02\u0257\u0258" +
		"\x03\x02\x02\x02\u0258\u0259\x03\x02\x02\x02\u0259\u025B\x07\t\x02\x02" +
		"\u025A\u025C\x05> \x02\u025B\u025A\x03\x02\x02\x02\u025B\u025C\x03\x02" +
		"\x02\x02\u025CS\x03\x02\x02\x02\u025D\u025E\x07\x06\x02\x02\u025E\u025F" +
		"\x07~\x02\x02\u025F\u0260\x07\x11\x02\x02\u0260\u0261\t\x05\x02\x02\u0261" +
		"\u0262\x07\x07\x02\x02\u0262\u0263\x05> \x02\u0263U\x03\x02\x02\x02\u0264" +
		"\u0266\x05\xF4{\x02\u0265\u0267\x07\x10\x02\x02\u0266\u0265\x03\x02\x02" +
		"\x02\u0266\u0267\x03\x02\x02\x02\u0267\u0268\x03\x02\x02\x02\u0268\u0269" +
		"\x05@!\x02\u0269W\x03\x02\x02\x02\u026A\u026B\x07s\x02\x02\u026B\u026D" +
		"\x07~\x02\x02\u026C\u026E\x05\x06\x04\x02\u026D\u026C\x03\x02\x02\x02" +
		"\u026D\u026E\x03\x02\x02\x02\u026E\u026F\x03\x02\x02\x02\u026F\u0270\x07" +
		"\x0F\x02\x02\u0270\u0271\x05\x14\v\x02\u0271\u0272\x07\r\x02\x02\u0272" +
		"Y\x03\x02\x02\x02\u0273\u0275\x05N(\x02\u0274\u0273\x03\x02\x02\x02\u0274" +
		"\u0275\x03\x02\x02\x02\u0275\u0276\x03\x02\x02\x02\u0276\u0277\x07v\x02" +
		"\x02\u0277\u0279\x07\b\x02\x02\u0278\u027A\x05\xDCo\x02\u0279\u0278\x03" +
		"\x02\x02\x02\u0279\u027A\x03\x02\x02\x02\u027A\u027B\x03\x02\x02\x02\u027B" +
		"\u0281\x07\t\x02\x02\u027C\u027D\x07\n\x02\x02\u027D\u027E\x05\xE2r\x02" +
		"\u027E\u027F\x07\f\x02\x02\u027F\u0282\x03\x02\x02\x02\u0280\u0282\x07" +
		"\r\x02\x02\u0281\u027C\x03\x02\x02\x02\u0281\u0280\x03\x02\x02\x02\u0281" +
		"\u0282\x03\x02\x02\x02\u0282[\x03\x02\x02\x02\u0283\u0285\x07c\x02\x02" +
		"\u0284\u0283\x03\x02\x02\x02\u0284\u0285\x03\x02\x02\x02\u0285\u0287\x03" +
		"\x02\x02\x02\u0286\u0288\x07z\x02\x02\u0287\u0286\x03\x02\x02\x02\u0287" +
		"\u0288\x03\x02\x02\x02\u0288\u0289\x03\x02\x02\x02\u0289\u028A\x07i\x02" +
		"\x02\u028A\u028C\x07~\x02\x02\u028B\u028D\x05\x06\x04\x02\u028C\u028B" +
		"\x03\x02\x02\x02\u028C\u028D\x03\x02\x02\x02\u028D\u028F\x03\x02\x02\x02" +
		"\u028E\u0290\x05^0\x02\u028F\u028E\x03\x02\x02\x02\u028F\u0290\x03\x02" +
		"\x02\x02\u0290\u0291\x03\x02\x02\x02\u0291\u0293\x05&\x14\x02\u0292\u0294" +
		"\x07\r\x02\x02\u0293\u0292\x03\x02\x02\x02\u0293\u0294\x03\x02\x02\x02" +
		"\u0294]\x03\x02\x02\x02\u0295\u0296\x07`\x02\x02\u0296\u0297\x05`1\x02" +
		"\u0297_\x03\x02\x02\x02\u0298\u029D\x05\x1C\x0F\x02\u0299\u029A\x07\x0E" +
		"\x02\x02\u029A\u029C\x05\x1C\x0F\x02\u029B\u0299\x03\x02\x02\x02\u029C" +
		"\u029F\x03\x02\x02\x02\u029D\u029B\x03\x02\x02\x02\u029D\u029E\x03\x02" +
		"\x02\x02\u029Ea\x03\x02\x02\x02\u029F\u029D\x03\x02\x02\x02\u02A0\u02A2" +
		"\x07b\x02\x02\u02A1\u02A0\x03\x02\x02\x02\u02A1\u02A2\x03\x02\x02\x02" +
		"\u02A2\u02A3\x03\x02\x02\x02\u02A3\u02A4\x07_\x02\x02\u02A4\u02A5\x07" +
		"~\x02\x02\u02A5\u02A7\x07\n\x02\x02\u02A6\u02A8\x05d3\x02\u02A7\u02A6" +
		"\x03\x02\x02\x02\u02A7\u02A8\x03\x02\x02\x02\u02A8\u02A9\x03\x02\x02\x02" +
		"\u02A9\u02AA\x07\f\x02\x02\u02AAc\x03\x02\x02\x02\u02AB\u02AD\x05f4\x02" +
		"\u02AC\u02AE\x07\x0E\x02\x02\u02AD\u02AC\x03\x02\x02\x02\u02AD\u02AE\x03" +
		"\x02\x02\x02\u02AEe\x03\x02\x02\x02\u02AF\u02B4\x05h5\x02\u02B0\u02B1" +
		"\x07\x0E\x02\x02\u02B1\u02B3\x05h5\x02\u02B2\u02B0\x03\x02\x02\x02\u02B3" +
		"\u02B6\x03\x02\x02\x02\u02B4\u02B2\x03\x02\x02\x02\u02B4\u02B5\x03\x02" +
		"\x02\x02\u02B5g\x03\x02\x02\x02\u02B6\u02B4\x03\x02\x02\x02\u02B7\u02BA" +
		"\x05\xF4{\x02\u02B8\u02B9\x07\x0F\x02\x02\u02B9\u02BB\x05\u0100\x81\x02" +
		"\u02BA\u02B8\x03\x02\x02\x02\u02BA\u02BB\x03\x02\x02\x02\u02BBi\x03\x02" +
		"\x02\x02\u02BC\u02BD\x07w\x02\x02\u02BD\u02BE\x05l7\x02\u02BE\u02C0\x07" +
		"\n\x02\x02\u02BF\u02C1\x05\x80A\x02\u02C0\u02BF\x03\x02\x02\x02\u02C0" +
		"\u02C1\x03\x02\x02\x02\u02C1\u02C2\x03\x02\x02\x02\u02C2\u02C3\x07\f\x02" +
		"\x02\u02C3k\x03\x02\x02\x02\u02C4\u02CD\x07~\x02\x02\u02C5\u02C7\x07\x13" +
		"\x02\x02\u02C6\u02C5\x03\x02\x02\x02\u02C7\u02C8\x03\x02\x02\x02\u02C8" +
		"\u02C6\x03\x02\x02\x02\u02C8\u02C9\x03\x02\x02\x02\u02C9\u02CA\x03\x02" +
		"\x02\x02\u02CA\u02CC\x07~\x02\x02\u02CB\u02C6\x03\x02\x02\x02\u02CC\u02CF" +
		"\x03\x02\x02\x02\u02CD\u02CB\x03\x02\x02\x02\u02CD\u02CE\x03\x02\x02\x02" +
		"\u02CEm\x03\x02\x02\x02\u02CF\u02CD\x03\x02\x02\x02\u02D0\u02D1\x07~\x02" +
		"\x02\u02D1\u02D2\x07\x0F\x02\x02\u02D2\u02D3\x05l7\x02\u02D3\u02D4\x07" +
		"\r\x02\x02\u02D4o\x03\x02\x02\x02\u02D5\u02D7\x05r:\x02\u02D6\u02D5\x03" +
		"\x02\x02\x02\u02D7\u02D8\x03\x02\x02\x02\u02D8\u02D6\x03\x02\x02\x02\u02D8" +
		"\u02D9\x03\x02\x02\x02\u02D9q\x03\x02\x02\x02\u02DA\u02DD\x07}\x02\x02" +
		"\u02DB\u02DE\x05t;\x02\u02DC\u02DE\x05v<\x02\u02DD\u02DB\x03\x02\x02\x02" +
		"\u02DD\u02DC\x03\x02\x02\x02\u02DEs\x03\x02\x02\x02\u02DF\u02E0\b;\x01" +
		"\x02\u02E0\u02E6\x07~\x02\x02\u02E1\u02E2\x07\b\x02\x02\u02E2\u02E3\x05" +
		"\u0100\x81\x02\u02E3\u02E4\x07\t\x02\x02\u02E4\u02E6\x03\x02\x02\x02\u02E5" +
		"\u02DF\x03\x02\x02\x02\u02E5\u02E1\x03\x02\x02\x02\u02E6\u02EC\x03\x02" +
		"\x02\x02\u02E7\u02E8\f\x04\x02\x02\u02E8\u02E9\x07\x13\x02\x02\u02E9\u02EB" +
		"\x05\u0114\x8B\x02\u02EA\u02E7\x03\x02\x02\x02\u02EB\u02EE\x03\x02\x02" +
		"\x02\u02EC\u02EA\x03\x02\x02\x02\u02EC\u02ED\x03\x02\x02\x02\u02EDu\x03" +
		"\x02\x02\x02\u02EE\u02EC\x03\x02\x02\x02\u02EF\u02F0\x05t;\x02\u02F0\u02F1" +
		"\x05\xF6|\x02\u02F1w\x03\x02\x02\x02\u02F2\u02F4\x05\xE4s\x02\u02F3\u02F2" +
		"\x03\x02\x02\x02\u02F3\u02F4\x03\x02\x02\x02\u02F4\u02F5\x03\x02\x02\x02" +
		"\u02F5\u02F6\x07\x02\x02\x03\u02F6y\x03\x02\x02\x02\u02F7\u02F9\x07c\x02" +
		"\x02\u02F8\u02F7\x03\x02\x02\x02\u02F8\u02F9\x03\x02\x02\x02\u02F9\u02FA" +
		"\x03\x02\x02\x02\u02FA\u02FB\x05|?\x02\u02FB{\x03\x02\x02\x02\u02FC\u031B" +
		"\x05~@\x02\u02FD\u031B\x05\x84C\x02\u02FE\u031B\x05\x8AF\x02\u02FF\u031B" +
		"\x05\x92J\x02\u0300\u031B\x05\x82B\x02\u0301\u031B\x05p9\x02\u0302\u031B" +
		"\x05\xBE`\x02\u0303\u031B\x05\\/\x02\u0304\u031B\x05j6\x02\u0305\u031B" +
		"\x05\x96L\x02\u0306\u031B\x05\x98M\x02\u0307\u031B\x05\x9CO\x02\u0308" +
		"\u031B\x05\x9EP\x02\u0309\u031B\x05\xA0Q\x02\u030A\u031B\x05\xA2R\x02" +
		"\u030B\u031B\x05\xA4S\x02\u030C\u031B\x05\xB0Y\x02\u030D\u031B\x05\xA6" +
		"T\x02\u030E\u031B\x05\xB2Z\x02\u030F\u031B\x05\xB4[\x02\u0310\u031B\x05" +
		"\xBA^\x02\u0311\u031B\x05\xBC_\x02\u0312\u031B\x05\u0104\x83\x02\u0313" +
		"\u031B\x05\xD2j\x02\u0314\u031B\x05\x8CG\x02\u0315\u031B\x05X-\x02\u0316" +
		"\u031B\x05b2\x02\u0317\u031B\x05\x94K\x02\u0318\u0319\x07c\x02\x02\u0319" +
		"\u031B\x05|?\x02\u031A\u02FC\x03\x02\x02\x02\u031A\u02FD\x03\x02\x02\x02" +
		"\u031A\u02FE\x03\x02\x02\x02\u031A\u02FF\x03\x02\x02\x02\u031A\u0300\x03" +
		"\x02\x02\x02\u031A\u0301\x03\x02\x02\x02\u031A\u0302\x03\x02\x02\x02\u031A" +
		"\u0303\x03\x02\x02\x02\u031A\u0304\x03\x02\x02\x02\u031A\u0305\x03\x02" +
		"\x02\x02\u031A\u0306\x03\x02\x02\x02\u031A\u0307\x03\x02\x02\x02\u031A" +
		"\u0308\x03\x02\x02\x02\u031A\u0309\x03\x02\x02\x02\u031A\u030A\x03\x02" +
		"\x02\x02\u031A\u030B\x03\x02\x02\x02\u031A\u030C\x03\x02\x02\x02\u031A" +
		"\u030D\x03\x02\x02\x02\u031A\u030E\x03\x02\x02\x02\u031A\u030F\x03\x02" +
		"\x02\x02\u031A\u0310\x03\x02\x02\x02\u031A\u0311\x03\x02\x02\x02\u031A" +
		"\u0312\x03\x02\x02\x02\u031A\u0313\x03\x02\x02\x02\u031A\u0314\x03\x02" +
		"\x02\x02\u031A\u0315\x03\x02\x02\x02\u031A\u0316\x03\x02\x02\x02\u031A" +
		"\u0317\x03\x02\x02\x02\u031A\u0318\x03\x02\x02\x02\u031B}\x03\x02\x02" +
		"\x02\u031C\u031E\x07\n\x02\x02\u031D\u031F\x05\x80A\x02\u031E\u031D\x03" +
		"\x02\x02\x02\u031E\u031F\x03\x02\x02\x02\u031F\u0320\x03\x02\x02\x02\u0320" +
		"\u0321\x07\f\x02\x02\u0321\x7F\x03\x02\x02\x02\u0322\u0324\x05|?\x02\u0323" +
		"\u0322\x03\x02\x02\x02\u0324\u0325\x03\x02\x02\x02\u0325\u0323\x03\x02" +
		"\x02\x02\u0325\u0326\x03\x02\x02\x02\u0326\x81\x03\x02\x02\x02\u0327\u032B" +
		"\x07{\x02\x02\u0328\u0329\x07~\x02\x02\u0329\u032C\x05@!\x02\u032A\u032C" +
		"\x05\x8CG\x02\u032B\u0328\x03\x02\x02\x02\u032B\u032A\x03\x02\x02\x02" +
		"\u032C\u032D\x03\x02\x02\x02\u032D\u032E\x05\u0120\x91\x02\u032E\x83\x03" +
		"\x02\x02\x02\u032F\u0332\x07d\x02\x02\u0330\u0333\x05\x86D\x02\u0331\u0333" +
		"\x05n8\x02\u0332\u0330\x03\x02\x02\x02\u0332\u0331\x03\x02\x02\x02\u0333" +
		"\x85\x03\x02\x02\x02\u0334\u0337\x07\x1A\x02\x02\u0335\u0337\x05\x88E" +
		"\x02\u0336\u0334\x03\x02\x02\x02\u0336\u0335\x03\x02\x02\x02\u0337\u033A" +
		"\x03\x02\x02\x02\u0338\u0339\x07Z\x02\x02\u0339\u033B\x05\u0114\x8B\x02" +
		"\u033A\u0338\x03\x02\x02\x02\u033A\u033B\x03\x02\x02\x02\u033B\u033C\x03" +
		"\x02\x02\x02\u033C\u033D\x07[\x02\x02\u033D\u033E\x07\x7F\x02\x02\u033E" +
		"\u033F\x05\u0120\x91\x02\u033F\x87\x03\x02\x02\x02\u0340\u0341\x05\u0114" +
		"\x8B\x02\u0341\u0342\x07\x0E\x02\x02\u0342\u0344\x03\x02\x02\x02\u0343" +
		"\u0340\x03\x02\x02\x02\u0343\u0344\x03\x02\x02\x02\u0344\u0345\x03\x02" +
		"\x02\x02\u0345\u0346\x07\n\x02\x02\u0346\u034B\x05\u0114\x8B\x02\u0347" +
		"\u0348\x07\x0E\x02\x02\u0348\u034A\x05\u0114\x8B\x02\u0349\u0347\x03\x02" +
		"\x02\x02\u034A\u034D\x03\x02\x02\x02\u034B\u0349\x03\x02\x02\x02\u034B" +
		"\u034C\x03\x02\x02\x02\u034C\u034E\x03\x02\x02\x02\u034D\u034B\x03\x02" +
		"\x02\x02\u034E\u034F\x07\f\x02\x02\u034F\x89\x03\x02\x02\x02\u0350\u0352" +
		"\x07c\x02\x02\u0351\u0353\x07T\x02\x02\u0352\u0351\x03\x02\x02\x02\u0352" +
		"\u0353\x03\x02\x02\x02\u0353\u0356\x03\x02\x02\x02\u0354\u0357\x05\x86" +
		"D\x02\u0355\u0357\x05|?\x02\u0356\u0354\x03\x02\x02\x02\u0356\u0355\x03" +
		"\x02\x02\x02\u0357\x8B\x03\x02\x02\x02\u0358\u035A\x05\x04\x03\x02\u0359" +
		"\u035B\x05> \x02\u035A\u0359\x03\x02\x02\x02\u035A\u035B\x03\x02\x02\x02" +
		"\u035B\u035C\x03\x02\x02\x02\u035C\u035E\x05\x02\x02\x02\u035D\u035F\x07" +
		"\r\x02\x02\u035E\u035D\x03\x02\x02\x02\u035E\u035F\x03\x02\x02\x02\u035F" +
		"\u0376\x03\x02\x02\x02\u0360\u0362\x05N(\x02\u0361\u0360\x03\x02\x02\x02" +
		"\u0361\u0362\x03\x02\x02\x02\u0362\u0364\x03\x02\x02\x02\u0363\u0365\x05" +
		"\x9AN\x02\u0364\u0363\x03\x02\x02\x02\u0364\u0365\x03\x02\x02\x02\u0365" +
		"\u0367\x03\x02\x02\x02\u0366\u0368\x07\\\x02\x02\u0367\u0366\x03\x02\x02" +
		"\x02\u0367\u0368\x03\x02\x02\x02\u0368\u0369\x03\x02\x02\x02\u0369\u036B" +
		"\x05\x8EH\x02\u036A\u036C\x07\r\x02\x02\u036B\u036A\x03\x02\x02\x02\u036B" +
		"\u036C\x03\x02\x02\x02\u036C\u0376\x03\x02\x02\x02\u036D\u036F\x07z\x02" +
		"\x02\u036E\u0370\x05\x9AN\x02\u036F\u036E\x03\x02\x02\x02\u036F\u0370" +
		"\x03\x02\x02\x02\u0370\u0371\x03\x02\x02\x02\u0371\u0373\x05\x8EH\x02" +
		"\u0372\u0374\x07\r\x02\x02\u0373\u0372\x03\x02\x02\x02\u0373\u0374\x03" +
		"\x02\x02\x02\u0374\u0376\x03\x02\x02\x02\u0375\u0358\x03\x02\x02\x02\u0375" +
		"\u0361\x03\x02\x02\x02\u0375\u036D\x03\x02\x02\x02\u0376\x8D\x03\x02\x02" +
		"\x02\u0377\u037C\x05\x90I\x02\u0378\u0379\x07\x0E\x02\x02\u0379\u037B" +
		"\x05\x90I\x02\u037A\u0378\x03\x02\x02\x02\u037B\u037E\x03\x02\x02\x02" +
		"\u037C\u037A\x03\x02\x02\x02\u037C\u037D\x03\x02\x02\x02\u037D\x8F\x03" +
		"\x02\x02\x02\u037E\u037C\x03\x02\x02\x02\u037F\u0383\x05\u0116\x8C\x02" +
		"\u0380\u0383\x05\xE6t\x02\u0381\u0383\x05\xECw\x02\u0382\u037F\x03\x02" +
		"\x02\x02\u0382\u0380\x03\x02\x02\x02\u0382\u0381\x03\x02\x02\x02\u0383" +
		"\u0385\x03\x02\x02\x02\u0384\u0386\x05> \x02\u0385\u0384\x03\x02\x02\x02" +
		"\u0385\u0386\x03\x02\x02\x02\u0386\u0388\x03\x02\x02\x02\u0387\u0389\x05" +
		"\u0100\x81\x02\u0388\u0387\x03\x02\x02\x02\u0388\u0389\x03\x02\x02\x02" +
		"\u0389\u038F\x03\x02\x02\x02\u038A\u038C\x07\x0F\x02\x02\u038B\u038D\x05" +
		"\x06\x04\x02\u038C\u038B\x03\x02\x02\x02\u038C\u038D\x03\x02\x02\x02\u038D" +
		"\u038E\x03\x02\x02\x02\u038E\u0390\x05\u0100\x81\x02\u038F\u038A\x03\x02" +
		"\x02\x02\u038F\u0390\x03\x02\x02\x02\u0390\x91\x03\x02\x02\x02\u0391\u0392" +
		"\x07\r\x02\x02\u0392\x93\x03\x02\x02\x02\u0393\u0394\x06K\b\x02\u0394" +
		"\u0396\x05\xFC\x7F\x02\u0395\u0397\x07\r\x02\x02\u0396\u0395\x03\x02\x02" +
		"\x02\u0396\u0397\x03\x02\x02\x02\u0397\x95\x03\x02\x02\x02\u0398\u0399" +
		"\x07U\x02\x02\u0399\u039A\x07\b\x02\x02\u039A\u039B\x05\xFC\x7F\x02\u039B" +
		"\u039C\x07\t\x02\x02\u039C\u039F\x05|?\x02\u039D\u039E\x07E\x02\x02\u039E" +
		"\u03A0\x05|?\x02\u039F\u039D\x03\x02\x02\x02\u039F\u03A0\x03\x02\x02\x02" +
		"\u03A0\x97\x03\x02\x02\x02\u03A1\u03A2\x07A\x02\x02\u03A2\u03A3\x05|?" +
		"\x02\u03A3\u03A4\x07O\x02\x02\u03A4\u03A5\x07\b\x02\x02\u03A5\u03A6\x05" +
		"\xFC\x7F\x02\u03A6\u03A7\x07\t\x02\x02\u03A7\u03A8\x05\u0120\x91\x02\u03A8" +
		"\u03E7\x03\x02\x02\x02\u03A9\u03AA\x07O\x02\x02\u03AA\u03AB\x07\b\x02" +
		"\x02\u03AB\u03AC\x05\xFC\x7F\x02\u03AC\u03AD\x07\t\x02\x02\u03AD\u03AE" +
		"\x05|?\x02\u03AE\u03E7\x03\x02\x02\x02\u03AF\u03B0\x07M\x02\x02\u03B0" +
		"\u03B2\x07\b\x02\x02\u03B1\u03B3\x05\xFC\x7F\x02\u03B2\u03B1\x03\x02\x02" +
		"\x02\u03B2\u03B3\x03\x02\x02\x02\u03B3\u03B4\x03\x02\x02\x02\u03B4\u03B6" +
		"\x07\r\x02\x02\u03B5\u03B7\x05\xFC\x7F\x02\u03B6\u03B5\x03\x02\x02\x02" +
		"\u03B6\u03B7\x03\x02\x02\x02\u03B7\u03B8\x03\x02\x02\x02\u03B8\u03BA\x07" +
		"\r\x02\x02\u03B9\u03BB\x05\xFC\x7F\x02\u03BA\u03B9\x03\x02\x02\x02\u03BA" +
		"\u03BB\x03\x02\x02\x02\u03BB\u03BC\x03\x02\x02\x02\u03BC\u03BD\x07\t\x02" +
		"\x02\u03BD\u03E7\x05|?\x02\u03BE\u03BF\x07M\x02\x02\u03BF\u03C0\x07\b" +
		"\x02\x02\u03C0\u03C1\x05\x9AN\x02\u03C1\u03C2\x05\x8EH\x02\u03C2\u03C4" +
		"\x07\r\x02\x02\u03C3\u03C5\x05\xFC\x7F\x02\u03C4\u03C3\x03\x02\x02\x02" +
		"\u03C4\u03C5\x03\x02\x02\x02\u03C5\u03C6\x03\x02\x02\x02\u03C6\u03C8\x07" +
		"\r\x02\x02\u03C7\u03C9\x05\xFC\x7F\x02\u03C8\u03C7\x03\x02\x02\x02\u03C8" +
		"\u03C9\x03\x02\x02\x02\u03C9\u03CA\x03\x02\x02\x02\u03CA\u03CB\x07\t\x02" +
		"\x02\u03CB\u03CC\x05|?\x02\u03CC\u03E7\x03\x02\x02\x02\u03CD\u03CE\x07" +
		"M\x02\x02\u03CE\u03CF\x07\b\x02\x02\u03CF\u03D3\x05\u0100\x81\x02\u03D0" +
		"\u03D4\x07X\x02\x02\u03D1\u03D2\x07~\x02\x02\u03D2\u03D4\x06M\t\x02\u03D3" +
		"\u03D0\x03\x02\x02\x02\u03D3\u03D1\x03\x02\x02\x02\u03D4\u03D5\x03\x02" +
		"\x02\x02\u03D5\u03D6\x05\xFC\x7F\x02\u03D6\u03D7\x07\t\x02\x02\u03D7\u03D8" +
		"\x05|?\x02\u03D8\u03E7\x03\x02\x02\x02\u03D9\u03DA\x07M\x02\x02\u03DA" +
		"\u03DB\x07\b\x02\x02\u03DB\u03DC\x05\x9AN\x02\u03DC\u03E0\x05\x90I\x02" +
		"\u03DD\u03E1\x07X\x02\x02\u03DE\u03DF\x07~\x02\x02\u03DF\u03E1\x06M\n" +
		"\x02\u03E0\u03DD\x03\x02\x02\x02\u03E0\u03DE\x03\x02";
	private static readonly _serializedATNSegment2: string =
		"\x02\x02\u03E1\u03E2\x03\x02\x02\x02\u03E2\u03E3\x05\xFC\x7F\x02\u03E3" +
		"\u03E4\x07\t\x02\x02\u03E4\u03E5\x05|?\x02\u03E5\u03E7\x03\x02\x02\x02" +
		"\u03E6\u03A1\x03\x02\x02\x02\u03E6\u03A9\x03\x02\x02\x02\u03E6\u03AF\x03" +
		"\x02\x02\x02\u03E6\u03BE\x03\x02\x02\x02\u03E6\u03CD\x03\x02\x02\x02\u03E6" +
		"\u03D9\x03\x02\x02\x02\u03E7\x99\x03\x02\x02\x02\u03E8\u03E9\t\x06\x02" +
		"\x02\u03E9\x9B\x03\x02\x02\x02\u03EA\u03ED\x07L\x02\x02\u03EB\u03EC\x06" +
		"O\v\x02\u03EC\u03EE\x07~\x02\x02\u03ED\u03EB\x03\x02\x02\x02\u03ED\u03EE" +
		"\x03\x02\x02\x02\u03EE\u03EF\x03\x02\x02\x02\u03EF\u03F0\x05\u0120\x91" +
		"\x02\u03F0\x9D\x03\x02\x02\x02\u03F1\u03F4\x07@\x02\x02\u03F2\u03F3\x06" +
		"P\f\x02\u03F3\u03F5\x07~\x02\x02\u03F4\u03F2\x03\x02\x02\x02\u03F4\u03F5" +
		"\x03\x02\x02\x02\u03F5\u03F6\x03\x02\x02\x02\u03F6\u03F7\x05\u0120\x91" +
		"\x02\u03F7\x9F\x03\x02\x02\x02\u03F8\u03FB\x07J\x02\x02\u03F9\u03FA\x06" +
		"Q\r\x02\u03FA\u03FC\x05\xFC\x7F\x02\u03FB\u03F9\x03\x02\x02\x02\u03FB" +
		"\u03FC\x03\x02\x02\x02\u03FC\u03FD\x03\x02\x02\x02\u03FD\u03FE\x05\u0120" +
		"\x91\x02\u03FE\xA1\x03\x02\x02\x02\u03FF\u0402\x07m\x02\x02\u0400\u0401" +
		"\x06R\x0E\x02\u0401\u0403\x05\xFC\x7F\x02\u0402\u0400\x03\x02\x02\x02" +
		"\u0402\u0403\x03\x02\x02\x02\u0403\u0404\x03\x02\x02\x02\u0404\u0405\x05" +
		"\u0120\x91\x02\u0405\xA3\x03\x02\x02\x02\u0406\u0407\x07S\x02\x02\u0407" +
		"\u0408\x07\b\x02\x02\u0408\u0409\x05\xFC\x7F\x02\u0409\u040A\x07\t\x02" +
		"\x02\u040A\u040B\x05|?\x02\u040B\xA5\x03\x02\x02\x02\u040C\u040D\x07N" +
		"\x02\x02\u040D\u040E\x07\b\x02\x02\u040E\u040F\x05\xFC\x7F\x02\u040F\u0410" +
		"\x07\t\x02\x02\u0410\u0411\x05\xA8U\x02\u0411\xA7\x03\x02\x02\x02\u0412" +
		"\u0414\x07\n\x02\x02\u0413\u0415\x05\xAAV\x02\u0414\u0413\x03\x02\x02" +
		"\x02\u0414\u0415\x03\x02\x02\x02\u0415\u041A\x03\x02\x02\x02\u0416\u0418" +
		"\x05\xAEX\x02\u0417\u0419\x05\xAAV\x02\u0418\u0417\x03\x02\x02\x02\u0418" +
		"\u0419\x03\x02\x02\x02\u0419\u041B\x03\x02\x02\x02\u041A\u0416\x03\x02" +
		"\x02\x02\u041A\u041B\x03\x02\x02\x02\u041B\u041C\x03\x02\x02\x02\u041C" +
		"\u041D\x07\f\x02\x02\u041D\xA9\x03\x02\x02\x02\u041E\u0420\x05\xACW\x02" +
		"\u041F\u041E\x03\x02\x02\x02\u0420\u0421\x03\x02\x02\x02\u0421\u041F\x03" +
		"\x02\x02\x02\u0421\u0422\x03\x02\x02\x02\u0422\xAB\x03\x02\x02\x02\u0423" +
		"\u0424\x07D\x02\x02\u0424\u0425\x05\xFC\x7F\x02\u0425\u0427\x07\x11\x02" +
		"\x02\u0426\u0428\x05\x80A\x02\u0427\u0426\x03\x02\x02\x02\u0427\u0428" +
		"\x03\x02\x02\x02\u0428\xAD\x03\x02\x02\x02\u0429\u042A\x07T\x02\x02\u042A" +
		"\u042C\x07\x11\x02\x02\u042B\u042D\x05\x80A\x02\u042C\u042B\x03\x02\x02" +
		"\x02\u042C\u042D\x03\x02\x02\x02\u042D\xAF\x03\x02\x02\x02\u042E\u042F" +
		"\x07~\x02\x02\u042F\u0430\x07\x11\x02\x02\u0430\u0431\x05|?\x02\u0431" +
		"\xB1\x03\x02\x02\x02\u0432\u0433\x07V\x02\x02\u0433\u0434\x06Z\x0F\x02" +
		"\u0434\u0435\x05\xFC\x7F\x02\u0435\u0436\x05\u0120\x91\x02\u0436\xB3\x03" +
		"\x02\x02\x02\u0437\u0438\x07Y\x02\x02\u0438\u043E\x05~@\x02\u0439\u043B" +
		"\x05\xB6\\\x02\u043A\u043C\x05\xB8]\x02\u043B\u043A\x03\x02\x02\x02\u043B" +
		"\u043C\x03\x02\x02\x02\u043C\u043F\x03\x02\x02\x02\u043D\u043F\x05\xB8" +
		"]\x02\u043E\u0439\x03\x02\x02\x02\u043E\u043D\x03\x02\x02\x02\u043F\xB5" +
		"\x03\x02\x02\x02\u0440\u0441\x07H\x02\x02\u0441\u0442\x07\b\x02\x02\u0442" +
		"\u0443\x07~\x02\x02\u0443\u0444\x07\t\x02\x02\u0444\u0445\x05~@\x02\u0445" +
		"\xB7\x03\x02\x02\x02\u0446\u0447\x07I\x02\x02\u0447\u0448\x05~@\x02\u0448" +
		"\xB9\x03\x02\x02\x02\u0449\u044A\x07P\x02\x02\u044A\u044B\x05\u0120\x91" +
		"\x02\u044B\xBB\x03\x02\x02\x02\u044C\u044D\x07Q\x02\x02\u044D\u044E\x07" +
		"~\x02\x02\u044E\u0454\x05@!\x02\u044F\u0450\x07\n\x02\x02\u0450\u0451" +
		"\x05\xE2r\x02\u0451\u0452\x07\f\x02\x02\u0452\u0455\x03\x02\x02\x02\u0453" +
		"\u0455\x07\r\x02\x02\u0454\u044F\x03\x02\x02\x02\u0454\u0453\x03\x02\x02" +
		"\x02\u0455\xBD\x03\x02\x02\x02\u0456\u0458\x07{\x02\x02\u0457\u0456\x03" +
		"\x02\x02\x02\u0457\u0458\x03\x02\x02\x02\u0458\u0459\x03\x02\x02\x02\u0459" +
		"\u045A\x07^\x02\x02\u045A\u045C\x07~\x02\x02\u045B\u045D\x05\x06\x04\x02" +
		"\u045C\u045B\x03\x02\x02\x02\u045C\u045D\x03\x02\x02\x02\u045D\u045E\x03" +
		"\x02\x02\x02\u045E\u045F\x05\xC0a\x02\u045F\u0460\x05\xC2b\x02\u0460\xBF" +
		"\x03\x02\x02\x02\u0461\u0463\x05\xC4c\x02\u0462\u0461\x03\x02\x02\x02" +
		"\u0462\u0463\x03\x02\x02\x02\u0463\u0465\x03\x02\x02\x02\u0464\u0466\x05" +
		"\xC6d\x02\u0465\u0464\x03\x02\x02\x02\u0465\u0466\x03\x02\x02\x02\u0466" +
		"\xC1\x03\x02\x02\x02\u0467\u046B\x07\n\x02\x02\u0468\u046A\x05\xC8e\x02" +
		"\u0469\u0468\x03\x02\x02\x02\u046A\u046D\x03\x02\x02\x02\u046B\u0469\x03" +
		"\x02\x02\x02\u046B\u046C\x03\x02\x02\x02\u046C\u046E\x03\x02\x02\x02\u046D" +
		"\u046B\x03\x02\x02\x02\u046E\u046F\x07\f\x02\x02\u046F\xC3\x03\x02\x02" +
		"\x02\u0470\u0471\x07`\x02\x02\u0471\u0472\x05\x1C\x0F\x02\u0472\xC5\x03" +
		"\x02\x02\x02\u0473\u0474\x07e\x02\x02\u0474\u0475\x05`1\x02\u0475\xC7" +
		"\x03\x02\x02\x02\u0476\u047E\x05Z.\x02\u0477\u0479\x05p9\x02\u0478\u0477" +
		"\x03\x02\x02\x02\u0478\u0479\x03\x02\x02\x02\u0479\u047A\x03\x02\x02\x02" +
		"\u047A\u047E\x05\xCAf\x02\u047B\u047E\x05\xCEh\x02\u047C\u047E\x05|?\x02" +
		"\u047D\u0476\x03\x02\x02\x02\u047D\u0478\x03\x02\x02\x02\u047D\u047B\x03" +
		"\x02\x02\x02\u047D\u047C\x03\x02\x02\x02\u047E\xC9\x03\x02\x02\x02\u047F" +
		"\u0480\x05\xCCg\x02\u0480\u0482\x05\xF4{\x02\u0481\u0483\x07\x10\x02\x02" +
		"\u0482\u0481\x03\x02\x02\x02\u0482\u0483\x03\x02\x02\x02\u0483\u0485\x03" +
		"\x02\x02\x02\u0484\u0486\x05> \x02\u0485\u0484\x03\x02\x02\x02\u0485\u0486" +
		"\x03\x02\x02\x02\u0486\u0488\x03\x02\x02\x02\u0487\u0489\x05\x02\x02\x02" +
		"\u0488\u0487\x03\x02\x02\x02\u0488\u0489\x03\x02\x02\x02\u0489\u048A\x03" +
		"\x02\x02\x02\u048A\u048B\x07\r\x02\x02\u048B\u049D\x03\x02\x02\x02\u048C" +
		"\u048D\x05\xCCg\x02\u048D\u048E\x05\xF4{\x02\u048E\u0494\x05@!\x02\u048F" +
		"\u0490\x07\n\x02\x02\u0490\u0491\x05\xE2r\x02\u0491\u0492\x07\f\x02\x02" +
		"\u0492\u0495\x03\x02\x02\x02\u0493\u0495\x07\r\x02\x02\u0494\u048F\x03" +
		"\x02\x02\x02\u0494\u0493\x03\x02\x02\x02\u0495\u049D\x03\x02\x02\x02\u0496" +
		"\u0499\x05\xCCg\x02\u0497\u049A\x05\xF0y\x02\u0498\u049A\x05\xF2z\x02" +
		"\u0499\u0497\x03\x02\x02\x02\u0499\u0498\x03\x02\x02\x02\u049A\u049D\x03" +
		"\x02\x02\x02\u049B\u049D\x05\x82B\x02\u049C\u047F\x03\x02\x02\x02\u049C" +
		"\u048C\x03\x02\x02\x02\u049C\u0496\x03\x02\x02\x02\u049C\u049B\x03\x02" +
		"\x02\x02\u049D\xCB\x03\x02\x02\x02\u049E\u04A0\x07]\x02\x02\u049F\u049E" +
		"\x03\x02\x02\x02\u049F\u04A0\x03\x02\x02\x02\u04A0\u04A2\x03\x02\x02\x02" +
		"\u04A1\u04A3\x05N(\x02\u04A2\u04A1\x03\x02\x02\x02\u04A2\u04A3\x03\x02" +
		"\x02\x02\u04A3\u04A5\x03\x02\x02\x02\u04A4\u04A6\x07l\x02\x02\u04A5\u04A4" +
		"\x03\x02\x02\x02\u04A5\u04A6\x03\x02\x02\x02\u04A6\u04A8\x03\x02\x02\x02" +
		"\u04A7\u04A9\x07\\\x02\x02\u04A8\u04A7\x03\x02\x02\x02\u04A8\u04A9\x03" +
		"\x02\x02\x02\u04A9\xCD\x03\x02\x02\x02\u04AA\u04AB\x05T+\x02\u04AB\u04AC" +
		"\x07\r\x02\x02\u04AC\xCF\x03\x02\x02\x02\u04AD\u04AF\x07\x1A\x02\x02\u04AE" +
		"\u04AD\x03\x02\x02\x02\u04AE\u04AF\x03\x02\x02\x02\u04AF\u04B0\x03\x02" +
		"\x02\x02\u04B0\u04B1\x07~\x02\x02\u04B1\u04B3\x07\b\x02\x02\u04B2\u04B4" +
		"\x05\xDCo\x02\u04B3\u04B2\x03\x02\x02\x02\u04B3\u04B4\x03\x02\x02\x02" +
		"\u04B4\u04B5\x03\x02\x02\x02\u04B5\u04B6\x07\t\x02\x02\u04B6\u04B7\x07" +
		"\n\x02\x02\u04B7\u04B8\x05\xE2r\x02\u04B8\u04B9\x07\f\x02\x02\u04B9\xD1" +
		"\x03\x02\x02\x02\u04BA\u04BB\x07Q\x02\x02\u04BB\u04BD\x07\x1A\x02\x02" +
		"\u04BC\u04BE\x07~\x02\x02\u04BD\u04BC\x03\x02\x02\x02\u04BD\u04BE\x03" +
		"\x02\x02\x02\u04BE\u04BF\x03\x02\x02\x02\u04BF\u04C1\x07\b\x02\x02\u04C0" +
		"\u04C2\x05\xDCo\x02\u04C1\u04C0\x03\x02\x02\x02\u04C1\u04C2\x03\x02\x02" +
		"\x02\u04C2\u04C3\x03\x02\x02\x02\u04C3\u04C4\x07\t\x02\x02\u04C4\u04C5" +
		"\x07\n\x02\x02\u04C5\u04C6\x05\xE2r\x02\u04C6\u04C7\x07\f\x02\x02\u04C7" +
		"\xD3\x03\x02\x02\x02\u04C8\u04C9\x07\n\x02\x02\u04C9\u04CE\x05\xD6l\x02" +
		"\u04CA\u04CB\x07\x0E\x02\x02\u04CB\u04CD\x05\xD6l\x02\u04CC\u04CA\x03" +
		"\x02\x02\x02\u04CD\u04D0\x03\x02\x02\x02\u04CE\u04CC\x03\x02\x02\x02\u04CE" +
		"\u04CF\x03\x02\x02\x02\u04CF\u04D2\x03\x02\x02\x02\u04D0\u04CE\x03\x02" +
		"\x02\x02\u04D1\u04D3\x07\x0E\x02\x02\u04D2\u04D1\x03\x02\x02\x02\u04D2" +
		"\u04D3\x03\x02\x02\x02\u04D3\u04D4\x03\x02\x02\x02\u04D4\u04D5\x07\f\x02" +
		"\x02\u04D5\xD5\x03\x02\x02\x02\u04D6\u04D7\x07\x1A\x02\x02\u04D7\u04D8" +
		"\x05\xDAn\x02\u04D8\xD7\x03\x02\x02\x02\u04D9\u04DA\x07\n\x02\x02\u04DA" +
		"\u04DF\x05\xDAn\x02\u04DB\u04DC\x07\x0E\x02\x02\u04DC\u04DE\x05\xDAn\x02" +
		"\u04DD\u04DB\x03\x02\x02\x02\u04DE\u04E1\x03\x02\x02\x02\u04DF\u04DD\x03" +
		"\x02\x02\x02\u04DF\u04E0\x03\x02\x02\x02\u04E0\u04E3\x03\x02\x02\x02\u04E1" +
		"\u04DF\x03\x02\x02\x02\u04E2\u04E4\x07\x0E\x02\x02\u04E3\u04E2\x03\x02" +
		"\x02\x02\u04E3\u04E4\x03\x02\x02\x02\u04E4\u04E5\x03\x02\x02\x02\u04E5" +
		"\u04E6\x07\f\x02\x02\u04E6\xD9\x03\x02\x02\x02\u04E7\u04E8\x07\x06\x02" +
		"\x02\u04E8\u04E9\x05\u0100\x81\x02\u04E9\u04EA\x07\x07\x02\x02\u04EA\u04EC" +
		"\x07\b\x02\x02\u04EB\u04ED\x05\xDCo\x02\u04EC\u04EB\x03\x02\x02\x02\u04EC" +
		"\u04ED\x03\x02\x02\x02\u04ED\u04EE\x03\x02\x02\x02\u04EE\u04EF\x07\t\x02" +
		"\x02\u04EF\u04F0\x07\n\x02\x02\u04F0\u04F1\x05\xE2r\x02\u04F1\u04F2\x07" +
		"\f\x02\x02\u04F2\xDB\x03\x02\x02\x02\u04F3\u04F8\x05\xDEp\x02\u04F4\u04F5" +
		"\x07\x0E\x02\x02\u04F5\u04F7\x05\xDEp\x02\u04F6\u04F4\x03\x02\x02\x02" +
		"\u04F7\u04FA\x03\x02\x02\x02\u04F8\u04F6\x03\x02\x02\x02\u04F8\u04F9\x03" +
		"\x02\x02\x02\u04F9\u04FD\x03\x02\x02\x02\u04FA\u04F8\x03\x02\x02\x02\u04FB" +
		"\u04FC\x07\x0E\x02\x02\u04FC\u04FE\x05\xE0q\x02\u04FD\u04FB\x03\x02\x02" +
		"\x02\u04FD\u04FE\x03\x02\x02\x02\u04FE\u0507\x03\x02\x02\x02\u04FF\u0507" +
		"\x05\xE0q\x02\u0500\u0507\x05\xE6t\x02\u0501\u0504\x05\xECw\x02\u0502" +
		"\u0503\x07\x11\x02\x02\u0503\u0505\x05\xDCo\x02\u0504\u0502\x03\x02\x02" +
		"\x02\u0504\u0505\x03\x02\x02\x02\u0505\u0507\x03\x02\x02\x02\u0506\u04F3" +
		"\x03\x02\x02\x02\u0506\u04FF\x03\x02\x02\x02\u0506\u0500\x03\x02\x02\x02" +
		"\u0506\u0501\x03\x02\x02\x02\u0507\xDD\x03\x02\x02\x02\u0508\u050A\x05" +
		"r:\x02\u0509\u0508\x03\x02\x02\x02\u0509\u050A\x03\x02\x02\x02\u050A\u050C" +
		"\x03\x02\x02\x02\u050B\u050D\x05N(\x02\u050C\u050B\x03\x02\x02\x02\u050C" +
		"\u050D\x03\x02\x02\x02\u050D\u050E\x03\x02\x02\x02\u050E\u0510\x05\u0116" +
		"\x8C\x02\u050F\u0511\x07\x10\x02\x02\u0510\u050F\x03\x02\x02\x02\u0510" +
		"\u0511\x03\x02\x02\x02\u0511\u0513\x03\x02\x02\x02\u0512\u0514\x05> \x02" +
		"\u0513\u0512\x03\x02\x02\x02\u0513\u0514\x03\x02\x02\x02\u0514\u0517\x03" +
		"\x02\x02\x02\u0515\u0516\x07\x0F\x02\x02\u0516\u0518\x05\u0100\x81\x02" +
		"\u0517\u0515\x03\x02\x02\x02\u0517\u0518\x03\x02\x02\x02\u0518\xDF\x03" +
		"\x02\x02\x02\u0519\u051A\x07\x12\x02\x02\u051A\u051B\x07~\x02\x02\u051B" +
		"\xE1\x03\x02\x02\x02\u051C\u051E\x05\xE4s\x02\u051D\u051C\x03\x02\x02" +
		"\x02\u051D\u051E\x03\x02\x02\x02\u051E\xE3\x03\x02\x02\x02\u051F\u0521" +
		"\x05z>\x02\u0520\u051F\x03\x02\x02\x02\u0521\u0522\x03\x02\x02\x02\u0522" +
		"\u0520\x03\x02\x02\x02\u0522\u0523\x03\x02\x02\x02\u0523\xE5\x03\x02\x02" +
		"\x02\u0524\u0526\x07\x06\x02\x02\u0525\u0527\x05\xE8u\x02\u0526\u0525" +
		"\x03\x02\x02\x02\u0526\u0527\x03\x02\x02\x02\u0527\u0528\x03\x02\x02\x02" +
		"\u0528\u0529\x07\x07\x02\x02\u0529\xE7\x03\x02\x02\x02\u052A\u0533\x05" +
		"\xEAv\x02\u052B\u052D\x07\x0E\x02\x02\u052C\u052B\x03\x02\x02\x02\u052D" +
		"\u052E\x03\x02\x02\x02\u052E\u052C\x03\x02\x02\x02\u052E\u052F\x03\x02" +
		"\x02\x02\u052F\u0530\x03\x02\x02\x02\u0530\u0532\x05\xEAv\x02\u0531\u052C" +
		"\x03\x02\x02\x02\u0532\u0535\x03\x02\x02\x02\u0533\u0531\x03\x02\x02\x02" +
		"\u0533\u0534\x03\x02\x02\x02\u0534\xE9\x03\x02\x02\x02\u0535\u0533\x03" +
		"\x02\x02\x02\u0536\u0538\x07\x12\x02\x02\u0537\u0536\x03\x02\x02\x02\u0537" +
		"\u0538\x03\x02\x02\x02\u0538\u053B\x03\x02\x02\x02\u0539\u053C\x05\u0100" +
		"\x81\x02\u053A\u053C\x07~\x02\x02\u053B\u0539\x03\x02\x02\x02\u053B\u053A" +
		"\x03\x02\x02\x02\u053C\u053E\x03\x02\x02\x02\u053D\u053F\x07\x0E\x02\x02" +
		"\u053E\u053D\x03\x02\x02\x02\u053E\u053F\x03\x02\x02\x02\u053F\xEB\x03" +
		"\x02\x02\x02\u0540\u054C\x07\n\x02\x02\u0541\u0546\x05\xEEx\x02\u0542" +
		"\u0543\x07\x0E\x02\x02\u0543\u0545\x05\xEEx\x02\u0544\u0542\x03\x02\x02" +
		"\x02\u0545\u0548\x03\x02\x02\x02\u0546\u0544\x03\x02\x02\x02\u0546\u0547" +
		"\x03\x02\x02\x02\u0547\u054A\x03\x02\x02\x02\u0548\u0546\x03\x02\x02\x02" +
		"\u0549\u054B\x07\x0E\x02\x02\u054A\u0549\x03\x02\x02\x02\u054A\u054B\x03" +
		"\x02\x02\x02\u054B\u054D\x03\x02\x02\x02\u054C\u0541\x03\x02\x02\x02\u054C" +
		"\u054D\x03\x02\x02\x02\u054D\u054E\x03\x02\x02\x02\u054E\u054F\x07\f\x02" +
		"\x02\u054F\xED\x03\x02\x02\x02\u0550\u0551\x05\xF4{\x02\u0551\u0552\t" +
		"\x07\x02\x02\u0552\u0553\x05\u0100\x81\x02\u0553\u0560\x03\x02\x02\x02" +
		"\u0554\u0555\x07\x06\x02\x02\u0555\u0556\x05\u0100\x81\x02\u0556\u0557" +
		"\x07\x07\x02\x02\u0557\u0558\x07\x11\x02\x02\u0558\u0559\x05\u0100\x81" +
		"\x02\u0559\u0560\x03\x02\x02\x02\u055A\u0560\x05\xF0y\x02\u055B\u0560" +
		"\x05\xF2z\x02\u055C\u0560\x05\xD0i\x02\u055D\u0560\x05\u0116\x8C\x02\u055E" +
		"\u0560\x05J&\x02\u055F\u0550\x03\x02\x02\x02\u055F\u0554\x03\x02\x02\x02" +
		"\u055F\u055A\x03\x02\x02\x02\u055F\u055B\x03\x02\x02\x02\u055F\u055C\x03" +
		"\x02\x02\x02\u055F\u055D\x03\x02\x02\x02\u055F\u055E\x03\x02\x02\x02\u0560" +
		"\xEF\x03\x02\x02\x02\u0561\u0562\x05\u011C\x8F\x02\u0562\u0563\x07\b\x02" +
		"\x02\u0563\u0565\x07\t\x02\x02\u0564\u0566\x05> \x02\u0565\u0564\x03\x02" +
		"\x02\x02\u0565\u0566\x03\x02\x02\x02\u0566\u0567\x03\x02\x02\x02\u0567" +
		"\u0568\x07\n\x02\x02\u0568\u0569\x05\xE2r\x02\u0569\u056A\x07\f\x02\x02" +
		"\u056A\xF1\x03\x02\x02\x02\u056B\u056C\x05\u011E\x90\x02\u056C\u056F\x07" +
		"\b\x02\x02\u056D\u0570\x07~\x02\x02\u056E\u0570\x05\x04\x03\x02\u056F" +
		"\u056D\x03\x02\x02\x02\u056F\u056E\x03\x02\x02\x02\u0570\u0572\x03\x02" +
		"\x02\x02\u0571\u0573\x05> \x02\u0572\u0571\x03\x02\x02\x02\u0572\u0573" +
		"\x03\x02\x02\x02\u0573\u0574\x03\x02\x02\x02\u0574\u0575\x07\t\x02\x02" +
		"\u0575\u0576\x07\n\x02\x02\u0576\u0577\x05\xE2r\x02\u0577\u0578\x07\f" +
		"\x02\x02\u0578\xF3\x03\x02\x02\x02\u0579\u057D\x05\u0114\x8B\x02\u057A" +
		"\u057D\x07\x7F\x02\x02\u057B\u057D\x05\u0112\x8A\x02\u057C\u0579\x03\x02" +
		"\x02\x02\u057C\u057A\x03\x02\x02\x02\u057C\u057B\x03\x02\x02\x02\u057D" +
		"\xF5\x03\x02\x02\x02\u057E\u0583\x07\b\x02\x02\u057F\u0581\x05\xF8}\x02" +
		"\u0580\u0582\x07\x0E\x02\x02\u0581\u0580\x03\x02\x02\x02\u0581\u0582\x03" +
		"\x02\x02\x02\u0582\u0584\x03\x02\x02\x02\u0583\u057F\x03\x02\x02\x02\u0583" +
		"\u0584\x03\x02\x02\x02\u0584\u0585\x03\x02\x02\x02\u0585\u0586\x07\t\x02" +
		"\x02\u0586\xF7\x03\x02\x02\x02\u0587\u058C\x05\xFA~\x02\u0588\u0589\x07" +
		"\x0E\x02\x02\u0589\u058B\x05\xFA~\x02\u058A\u0588\x03\x02\x02\x02\u058B" +
		"\u058E\x03\x02\x02\x02\u058C\u058A\x03\x02\x02\x02\u058C\u058D\x03\x02" +
		"\x02\x02\u058D\xF9\x03\x02\x02\x02\u058E\u058C\x03\x02\x02\x02\u058F\u0591" +
		"\x07\x12\x02\x02\u0590\u058F\x03\x02\x02\x02\u0590\u0591\x03\x02\x02\x02" +
		"\u0591\u0594\x03\x02\x02\x02\u0592\u0595\x05\u0100\x81\x02\u0593\u0595" +
		"\x07~\x02\x02\u0594\u0592\x03\x02\x02\x02\u0594\u0593\x03\x02\x02\x02" +
		"\u0595\xFB\x03\x02\x02\x02\u0596\u059B\x05\u0100\x81\x02\u0597\u0598\x07" +
		"\x0E\x02\x02\u0598\u059A\x05\u0100\x81\x02\u0599\u0597\x03\x02\x02\x02" +
		"\u059A\u059D\x03\x02\x02\x02\u059B\u0599\x03\x02\x02\x02\u059B\u059C\x03" +
		"\x02\x02\x02\u059C\xFD\x03\x02\x02\x02\u059D\u059B\x03\x02\x02\x02\u059E" +
		"\u05A0\x07Q\x02\x02\u059F\u05A1\x07~\x02\x02\u05A0\u059F\x03\x02\x02\x02" +
		"\u05A0\u05A1\x03\x02\x02\x02\u05A1\u05A2\x03\x02\x02\x02\u05A2\u05A4\x07" +
		"\b\x02\x02\u05A3\u05A5\x05\xDCo\x02\u05A4\u05A3\x03\x02\x02\x02\u05A4" +
		"\u05A5\x03\x02\x02\x02\u05A5\u05A6\x03\x02\x02\x02\u05A6\u05A8\x07\t\x02" +
		"\x02\u05A7\u05A9\x05> \x02\u05A8\u05A7\x03\x02\x02\x02\u05A8\u05A9\x03" +
		"\x02\x02\x02\u05A9\u05AA\x03\x02\x02\x02\u05AA\u05AB\x07\n\x02\x02\u05AB" +
		"\u05AC\x05\xE2r\x02\u05AC\u05AD\x07\f\x02\x02\u05AD\xFF\x03\x02\x02\x02" +
		"\u05AE\u05AF\b\x81\x01\x02\u05AF\u05EA\x05\xFE\x80\x02\u05B0\u05EA\x05" +
		"\u0104\x83\x02\u05B1\u05B3\x07^\x02\x02\u05B2\u05B4\x07~\x02\x02\u05B3" +
		"\u05B2\x03\x02\x02\x02\u05B3\u05B4\x03\x02\x02\x02\u05B4\u05B5\x03\x02" +
		"\x02\x02\u05B5\u05EA\x05\xC2b\x02\u05B6\u05B7\x07F\x02\x02\u05B7\u05B9" +
		"\x05\u0100\x81\x02\u05B8\u05BA\x05\x0E\b\x02\u05B9\u05B8\x03\x02\x02\x02" +
		"\u05B9\u05BA\x03\x02\x02\x02\u05BA\u05BB\x03\x02\x02\x02\u05BB\u05BC\x05" +
		"\xF6|\x02\u05BC\u05EA\x03\x02\x02\x02\u05BD\u05BE\x07F\x02\x02\u05BE\u05C0" +
		"\x05\u0100\x81\x02\u05BF\u05C1\x05\x0E\b\x02\u05C0\u05BF\x03\x02\x02\x02" +
		"\u05C0\u05C1\x03\x02\x02\x02\u05C1\u05EA\x03\x02\x02\x02\u05C2\u05C3\x07" +
		"W\x02\x02\u05C3\u05EA\x05\u0100\x81(\u05C4\u05C5\x07K\x02\x02\u05C5\u05EA" +
		"\x05\u0100\x81\'\u05C6\u05C7\x07C\x02\x02\u05C7\u05EA\x05\u0100\x81&\u05C8" +
		"\u05C9\x07\x14\x02\x02\u05C9\u05EA\x05\u0100\x81%\u05CA\u05CB\x07\x15" +
		"\x02\x02\u05CB\u05EA\x05\u0100\x81$\u05CC\u05CD\x07\x16\x02\x02\u05CD" +
		"\u05EA\x05\u0100\x81#\u05CE\u05CF\x07\x17\x02\x02\u05CF\u05EA\x05\u0100" +
		"\x81\"\u05D0\u05D1\x07\x18\x02\x02\u05D1\u05EA\x05\u0100\x81!\u05D2\u05D3" +
		"\x07\x19\x02\x02\u05D3\u05EA\x05\u0100\x81 \u05D4\u05EA\x05\xD8m\x02\u05D5" +
		"\u05EA\x05\xD4k\x02\u05D6\u05EA\x05\xD2j\x02\u05D7\u05EA\x05\xA2R\x02" +
		"\u05D8\u05EA\x07R\x02\x02\u05D9\u05DB\x05\u0114\x8B\x02\u05DA\u05DC\x05" +
		"\u0100\x81\x02\u05DB\u05DA\x03\x02\x02\x02\u05DB\u05DC\x03\x02\x02\x02" +
		"\u05DC\u05EA\x03\x02\x02\x02\u05DD\u05EA\x07a\x02\x02\u05DE\u05EA\x05" +
		"\u010C\x87\x02\u05DF\u05EA\x05\xE6t\x02\u05E0\u05EA\x05\xECw\x02\u05E1" +
		"\u05E2\x07\b\x02\x02\u05E2\u05E3\x05\xFC\x7F\x02\u05E3\u05E4\x07\t\x02" +
		"\x02\u05E4\u05EA\x03\x02\x02\x02\u05E5\u05E7\x05\x0E\b\x02\u05E6\u05E8" +
		"\x05\xFC\x7F\x02\u05E7\u05E6\x03\x02\x02\x02\u05E7\u05E8\x03\x02\x02\x02" +
		"\u05E8\u05EA\x03\x02\x02\x02\u05E9\u05AE\x03\x02\x02\x02\u05E9\u05B0\x03" +
		"\x02\x02\x02\u05E9\u05B1\x03\x02\x02\x02\u05E9\u05B6\x03\x02\x02\x02\u05E9" +
		"\u05BD\x03\x02\x02\x02\u05E9\u05C2\x03\x02\x02\x02\u05E9\u05C4\x03\x02" +
		"\x02\x02\u05E9\u05C6\x03\x02\x02\x02\u05E9\u05C8\x03\x02\x02\x02\u05E9" +
		"\u05CA\x03\x02\x02\x02\u05E9\u05CC\x03\x02\x02\x02\u05E9\u05CE\x03\x02" +
		"\x02\x02\u05E9\u05D0\x03\x02\x02\x02\u05E9\u05D2\x03\x02\x02\x02\u05E9" +
		"\u05D4\x03\x02\x02\x02\u05E9\u05D5\x03\x02\x02\x02\u05E9\u05D6\x03\x02" +
		"\x02\x02\u05E9\u05D7\x03\x02\x02\x02\u05E9\u05D8\x03\x02\x02\x02\u05E9" +
		"\u05D9\x03\x02\x02\x02\u05E9\u05DD\x03\x02\x02\x02\u05E9\u05DE\x03\x02" +
		"\x02\x02\u05E9\u05DF\x03\x02\x02\x02\u05E9\u05E0\x03\x02\x02\x02\u05E9" +
		"\u05E1\x03\x02\x02\x02\u05E9\u05E5\x03\x02\x02\x02\u05EA\u0636\x03\x02" +
		"\x02\x02\u05EB\u05EC\f\x1F\x02\x02\u05EC\u05ED\t\b\x02\x02\u05ED\u0635" +
		"\x05\u0100\x81 \u05EE\u05EF\f\x1E\x02\x02\u05EF\u05F0\t\t\x02\x02\u05F0" +
		"\u0635\x05\u0100\x81\x1F\u05F1\u05F2\f\x1D\x02\x02\u05F2\u05F3\t\n\x02" +
		"\x02\u05F3\u0635\x05\u0100\x81\x1E\u05F4\u05F5\f\x1C\x02\x02\u05F5\u05F6" +
		"\t\v\x02\x02\u05F6\u0635\x05\u0100\x81\x1D\u05F7\u05F8\f\x1B\x02\x02\u05F8" +
		"\u05F9\x07B\x02\x02\u05F9\u0635\x05\u0100\x81\x1C\u05FA\u05FB\f\x1A\x02" +
		"\x02\u05FB\u05FC\x07X\x02\x02\u05FC\u0635\x05\u0100\x81\x1B\u05FD\u05FE" +
		"\f\x19\x02\x02\u05FE\u05FF\t\f\x02\x02\u05FF\u0635\x05\u0100\x81\x1A\u0600" +
		"\u0601\f\x18\x02\x02\u0601\u0602\x07(\x02\x02\u0602\u0635\x05\u0100\x81" +
		"\x19\u0603\u0604\f\x17\x02\x02\u0604\u0605\x07)\x02\x02\u0605\u0635\x05" +
		"\u0100\x81\x18\u0606\u0607\f\x16\x02\x02\u0607\u0608\x07*\x02\x02\u0608" +
		"\u0635\x05\u0100\x81\x17\u0609\u060A\f\x15\x02\x02\u060A\u060B\x07+\x02" +
		"\x02\u060B\u0635\x05\u0100\x81\x16\u060C\u060D\f\x14\x02\x02\u060D\u060E" +
		"\x07,\x02\x02\u060E\u0635\x05\u0100\x81\x15\u060F\u0610\f\x13\x02\x02" +
		"\u0610\u0611\x07\x10\x02\x02\u0611\u0612\x05\u0100\x81\x02\u0612\u0613" +
		"\x07\x11\x02\x02\u0613\u0614\x05\u0100\x81\x14\u0614\u0635\x03\x02\x02" +
		"\x02\u0615\u0616\f\x12\x02\x02\u0616\u0617\x07\x0F\x02\x02\u0617\u0635" +
		"\x05\u0100\x81\x13\u0618\u0619\f\x11\x02\x02\u0619\u061A\x05\u010A\x86" +
		"\x02\u061A\u061B\x05\u0100\x81\x12\u061B\u0635\x03\x02\x02\x02\u061C\u061D" +
		"\f/\x02\x02\u061D\u061E\x07\x06\x02\x02\u061E\u061F\x05\xFC\x7F\x02\u061F" +
		"\u0620\x07\x07\x02\x02\u0620\u0635\x03\x02\x02\x02\u0621\u0622\f.\x02" +
		"\x02\u0622\u0623\x07\x13\x02\x02\u0623\u0625\x05\u0114\x8B\x02\u0624\u0626" +
		"\x05\x1E\x10\x02\u0625\u0624\x03\x02\x02\x02\u0625\u0626\x03\x02\x02\x02" +
		"\u0626\u0635\x03\x02\x02\x02\u0627\u0628\f+\x02\x02\u0628\u0635\x05\xF6" +
		"|\x02\u0629\u062A\f*\x02\x02\u062A\u062B\x06\x81#\x02\u062B\u0635\x07" +
		"\x14\x02\x02\u062C\u062D\f)\x02\x02\u062D\u062E\x06\x81%\x02\u062E\u0635" +
		"\x07\x15\x02\x02\u062F\u0630\f\x10\x02\x02\u0630\u0635\x05\u010E\x88\x02" +
		"\u0631\u0632\f\x03\x02\x02\u0632\u0633\x07Z\x02\x02\u0633\u0635\x05\u0102" +
		"\x82\x02\u0634\u05EB\x03\x02\x02\x02\u0634\u05EE\x03\x02\x02\x02\u0634" +
		"\u05F1\x03\x02\x02\x02\u0634\u05F4\x03\x02\x02\x02\u0634\u05F7\x03\x02" +
		"\x02\x02\u0634\u05FA\x03\x02\x02\x02\u0634\u05FD\x03\x02\x02\x02\u0634" +
		"\u0600\x03\x02\x02\x02\u0634\u0603\x03\x02\x02\x02\u0634\u0606\x03\x02" +
		"\x02\x02\u0634\u0609\x03\x02\x02\x02\u0634\u060C\x03\x02\x02\x02\u0634" +
		"\u060F\x03\x02\x02\x02\u0634\u0615\x03\x02\x02\x02\u0634\u0618\x03\x02" +
		"\x02\x02\u0634\u061C\x03\x02\x02\x02\u0634\u0621\x03\x02\x02\x02\u0634" +
		"\u0627\x03\x02\x02\x02\u0634\u0629\x03\x02\x02\x02\u0634\u062C\x03\x02" +
		"\x02\x02\u0634\u062F\x03\x02\x02\x02\u0634\u0631\x03\x02\x02\x02\u0635" +
		"\u0638\x03\x02\x02\x02\u0636\u0634\x03\x02\x02\x02\u0636\u0637\x03\x02" +
		"\x02\x02\u0637\u0101\x03\x02\x02\x02\u0638\u0636\x03\x02\x02\x02\u0639" +
		"\u063C\x05\x1A\x0E\x02\u063A\u063B\x07\x06\x02\x02\u063B\u063D\x07\x07" +
		"\x02\x02\u063C\u063A\x03\x02\x02\x02\u063C\u063D\x03\x02\x02\x02\u063D" +
		"\u0640\x03\x02\x02\x02\u063E\u0640\x05\u0100\x81\x02\u063F\u0639\x03\x02" +
		"\x02\x02\u063F\u063E\x03\x02\x02\x02\u0640\u0103\x03\x02\x02\x02\u0641" +
		"\u0643\x07]\x02\x02\u0642\u0641\x03\x02\x02\x02\u0642\u0643\x03\x02\x02" +
		"\x02\u0643\u0644\x03\x02\x02\x02\u0644\u0646\x05\u0106\x84\x02\u0645\u0647" +
		"\x05> \x02\u0646\u0645\x03\x02\x02\x02\u0646\u0647\x03\x02\x02\x02\u0647" +
		"\u0648\x03\x02\x02\x02\u0648\u0649\x078\x02\x02\u0649\u064A\x05\u0108" +
		"\x85\x02\u064A\u0105\x03\x02\x02\x02\u064B\u0652\x07~\x02\x02\u064C\u064E" +
		"\x07\b\x02\x02\u064D\u064F\x05\xDCo\x02\u064E\u064D\x03\x02\x02\x02\u064E" +
		"\u064F\x03\x02\x02\x02\u064F\u0650\x03\x02\x02\x02\u0650\u0652\x07\t\x02" +
		"\x02\u0651\u064B\x03\x02\x02\x02\u0651\u064C\x03\x02\x02\x02\u0652\u0107" +
		"\x03\x02\x02\x02\u0653\u0659\x05\u0100\x81\x02\u0654\u0655\x07\n\x02\x02" +
		"\u0655\u0656\x05\xE2r\x02\u0656\u0657\x07\f\x02\x02\u0657\u0659\x03\x02" +
		"\x02\x02\u0658\u0653\x03\x02\x02\x02\u0658\u0654\x03\x02\x02\x02\u0659" +
		"\u0109\x03\x02\x02\x02\u065A\u065B\t\r\x02\x02\u065B\u010B\x03\x02\x02" +
		"\x02\u065C\u0663\x079\x02\x02\u065D\u0663\x07:\x02\x02\u065E\u0663\x07" +
		"\x7F\x02\x02\u065F\u0663\x05\u010E\x88\x02\u0660\u0663\x07\x05\x02\x02" +
		"\u0661\u0663\x05\u0112\x8A\x02\u0662\u065C\x03\x02\x02\x02\u0662\u065D" +
		"\x03\x02\x02\x02\u0662\u065E\x03\x02\x02\x02\u0662\u065F\x03\x02\x02\x02" +
		"\u0662\u0660\x03\x02\x02\x02\u0662\u0661\x03\x02\x02\x02\u0663\u010D\x03" +
		"\x02\x02\x02\u0664\u0668\x07\x80\x02\x02\u0665\u0667\x05\u0110\x89\x02" +
		"\u0666\u0665\x03\x02\x02\x02\u0667\u066A\x03\x02\x02\x02\u0668\u0666\x03" +
		"\x02\x02\x02\u0668\u0669\x03\x02\x02\x02\u0669\u066B\x03\x02\x02\x02\u066A" +
		"\u0668\x03\x02\x02\x02\u066B\u066C\x07\x80\x02\x02\u066C\u010F\x03\x02" +
		"\x02\x02\u066D\u0673\x07\x87\x02\x02\u066E\u066F\x07\x86\x02\x02\u066F" +
		"\u0670\x05\u0100\x81\x02\u0670\u0671\x07\v\x02\x02\u0671\u0673\x03\x02" +
		"\x02\x02\u0672\u066D\x03\x02\x02\x02\u0672\u066E\x03\x02\x02\x02\u0673" +
		"\u0111\x03\x02\x02\x02\u0674\u0675\t\x0E\x02\x02\u0675\u0113\x03\x02\x02" +
		"\x02\u0676\u0679\x07~\x02\x02\u0677\u0679\x05\u0118\x8D\x02\u0678\u0676" +
		"\x03\x02\x02\x02\u0678\u0677\x03\x02\x02\x02\u0679\u0115\x03\x02\x02\x02" +
		"\u067A\u067B\t\x0F\x02\x02\u067B\u0117\x03\x02\x02\x02\u067C\u0680\x05" +
		"\u011A\x8E\x02\u067D\u0680\x079\x02\x02\u067E\u0680\x07:\x02\x02\u067F" +
		"\u067C\x03\x02\x02\x02\u067F\u067D\x03\x02\x02\x02\u067F\u067E\x03\x02" +
		"\x02\x02\u0680\u0119\x03\x02\x02\x02\u0681\u0682\t\x10\x02\x02";
	private static readonly _serializedATNSegment3: string =
		"\u0682\u011B\x03\x02\x02\x02\u0683\u0684\x07t\x02\x02\u0684\u0685\x05" +
		"\xF4{\x02\u0685\u011D\x03\x02\x02\x02\u0686\u0687\x07u\x02\x02\u0687\u0688" +
		"\x05\xF4{\x02\u0688\u011F\x03\x02\x02\x02\u0689\u068E\x07\r\x02\x02\u068A" +
		"\u068E\x07\x02\x02\x03\u068B\u068E\x06\x91(\x02\u068C\u068E\x06\x91)\x02" +
		"\u068D\u0689\x03\x02\x02\x02\u068D\u068A\x03\x02\x02\x02\u068D\u068B\x03" +
		"\x02\x02\x02\u068D\u068C\x03\x02\x02\x02\u068E\u0121\x03\x02\x02\x02\xD3" +
		"\u0127\u012B\u0134\u0139\u013C\u0143\u014C\u0156\u0161\u0163\u0178\u0180" +
		"\u0187\u018B\u019A\u019E\u01A2\u01A8\u01AF\u01B9\u01BB\u01CB\u01CF\u01D3" +
		"\u01DB\u01DF\u01EE\u01F2\u01F5\u01F9\u01FC\u0200\u0206\u020A\u020E\u0216" +
		"\u021B\u021D\u0224\u0229\u022C\u022F\u0234\u0237\u023A\u023F\u0242\u0245" +
		"\u0249\u024F\u0253\u0257\u025B\u0266\u026D\u0274\u0279\u0281\u0284\u0287" +
		"\u028C\u028F\u0293\u029D\u02A1\u02A7\u02AD\u02B4\u02BA\u02C0\u02C8\u02CD" +
		"\u02D8\u02DD\u02E5\u02EC\u02F3\u02F8\u031A\u031E\u0325\u032B\u0332\u0336" +
		"\u033A\u0343\u034B\u0352\u0356\u035A\u035E\u0361\u0364\u0367\u036B\u036F" +
		"\u0373\u0375\u037C\u0382\u0385\u0388\u038C\u038F\u0396\u039F\u03B2\u03B6" +
		"\u03BA\u03C4\u03C8\u03D3\u03E0\u03E6\u03ED\u03F4\u03FB\u0402\u0414\u0418" +
		"\u041A\u0421\u0427\u042C\u043B\u043E\u0454\u0457\u045C\u0462\u0465\u046B" +
		"\u0478\u047D\u0482\u0485\u0488\u0494\u0499\u049C\u049F\u04A2\u04A5\u04A8" +
		"\u04AE\u04B3\u04BD\u04C1\u04CE\u04D2\u04DF\u04E3\u04EC\u04F8\u04FD\u0504" +
		"\u0506\u0509\u050C\u0510\u0513\u0517\u051D\u0522\u0526\u052E\u0533\u0537" +
		"\u053B\u053E\u0546\u054A\u054C\u055F\u0565\u056F\u0572\u057C\u0581\u0583" +
		"\u058C\u0590\u0594\u059B\u05A0\u05A4\u05A8\u05B3\u05B9\u05C0\u05DB\u05E7" +
		"\u05E9\u0625\u0634\u0636\u063C\u063F\u0642\u0646\u064E\u0651\u0658\u0662" +
		"\u0668\u0672\u0678\u067F\u068D";
	public static readonly _serializedATN: string = Utils.join(
		[
			TypeScriptParser._serializedATNSegment0,
			TypeScriptParser._serializedATNSegment1,
			TypeScriptParser._serializedATNSegment2,
			TypeScriptParser._serializedATNSegment3,
		],
		"",
	);
	public static __ATN: ATN;
	public static get _ATN(): ATN {
		if (!TypeScriptParser.__ATN) {
			TypeScriptParser.__ATN = new ATNDeserializer().deserialize(Utils.toCharArray(TypeScriptParser._serializedATN));
		}

		return TypeScriptParser.__ATN;
	}

}

export class InitializerContext extends ParserRuleContext {
	public Assign(): TerminalNode { return this.getToken(TypeScriptParser.Assign, 0); }
	public singleExpression(): SingleExpressionContext {
		return this.getRuleContext(0, SingleExpressionContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_initializer; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterInitializer) {
			listener.enterInitializer(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitInitializer) {
			listener.exitInitializer(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitInitializer) {
			return visitor.visitInitializer(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class BindingPatternContext extends ParserRuleContext {
	public arrayLiteral(): ArrayLiteralContext | undefined {
		return this.tryGetRuleContext(0, ArrayLiteralContext);
	}
	public objectLiteral(): ObjectLiteralContext | undefined {
		return this.tryGetRuleContext(0, ObjectLiteralContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_bindingPattern; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterBindingPattern) {
			listener.enterBindingPattern(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitBindingPattern) {
			listener.exitBindingPattern(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitBindingPattern) {
			return visitor.visitBindingPattern(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TypeParametersContext extends ParserRuleContext {
	public LessThan(): TerminalNode { return this.getToken(TypeScriptParser.LessThan, 0); }
	public MoreThan(): TerminalNode { return this.getToken(TypeScriptParser.MoreThan, 0); }
	public typeParameterList(): TypeParameterListContext | undefined {
		return this.tryGetRuleContext(0, TypeParameterListContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_typeParameters; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterTypeParameters) {
			listener.enterTypeParameters(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitTypeParameters) {
			listener.exitTypeParameters(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitTypeParameters) {
			return visitor.visitTypeParameters(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TypeParameterListContext extends ParserRuleContext {
	public typeParameter(): TypeParameterContext[];
	public typeParameter(i: number): TypeParameterContext;
	public typeParameter(i?: number): TypeParameterContext | TypeParameterContext[] {
		if (i === undefined) {
			return this.getRuleContexts(TypeParameterContext);
		} else {
			return this.getRuleContext(i, TypeParameterContext);
		}
	}
	public Comma(): TerminalNode[];
	public Comma(i: number): TerminalNode;
	public Comma(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(TypeScriptParser.Comma);
		} else {
			return this.getToken(TypeScriptParser.Comma, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_typeParameterList; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterTypeParameterList) {
			listener.enterTypeParameterList(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitTypeParameterList) {
			listener.exitTypeParameterList(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitTypeParameterList) {
			return visitor.visitTypeParameterList(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TypeParameterContext extends ParserRuleContext {
	public Identifier(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Identifier, 0); }
	public constraint(): ConstraintContext | undefined {
		return this.tryGetRuleContext(0, ConstraintContext);
	}
	public typeParameters(): TypeParametersContext | undefined {
		return this.tryGetRuleContext(0, TypeParametersContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_typeParameter; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterTypeParameter) {
			listener.enterTypeParameter(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitTypeParameter) {
			listener.exitTypeParameter(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitTypeParameter) {
			return visitor.visitTypeParameter(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ConstraintContext extends ParserRuleContext {
	public Extends(): TerminalNode { return this.getToken(TypeScriptParser.Extends, 0); }
	public type_(): Type_Context {
		return this.getRuleContext(0, Type_Context);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_constraint; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterConstraint) {
			listener.enterConstraint(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitConstraint) {
			listener.exitConstraint(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitConstraint) {
			return visitor.visitConstraint(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TypeArgumentsContext extends ParserRuleContext {
	public LessThan(): TerminalNode { return this.getToken(TypeScriptParser.LessThan, 0); }
	public MoreThan(): TerminalNode { return this.getToken(TypeScriptParser.MoreThan, 0); }
	public typeArgumentList(): TypeArgumentListContext | undefined {
		return this.tryGetRuleContext(0, TypeArgumentListContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_typeArguments; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterTypeArguments) {
			listener.enterTypeArguments(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitTypeArguments) {
			listener.exitTypeArguments(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitTypeArguments) {
			return visitor.visitTypeArguments(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TypeArgumentListContext extends ParserRuleContext {
	public typeArgument(): TypeArgumentContext[];
	public typeArgument(i: number): TypeArgumentContext;
	public typeArgument(i?: number): TypeArgumentContext | TypeArgumentContext[] {
		if (i === undefined) {
			return this.getRuleContexts(TypeArgumentContext);
		} else {
			return this.getRuleContext(i, TypeArgumentContext);
		}
	}
	public Comma(): TerminalNode[];
	public Comma(i: number): TerminalNode;
	public Comma(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(TypeScriptParser.Comma);
		} else {
			return this.getToken(TypeScriptParser.Comma, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_typeArgumentList; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterTypeArgumentList) {
			listener.enterTypeArgumentList(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitTypeArgumentList) {
			listener.exitTypeArgumentList(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitTypeArgumentList) {
			return visitor.visitTypeArgumentList(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TypeArgumentContext extends ParserRuleContext {
	public type_(): Type_Context {
		return this.getRuleContext(0, Type_Context);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_typeArgument; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterTypeArgument) {
			listener.enterTypeArgument(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitTypeArgument) {
			listener.exitTypeArgument(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitTypeArgument) {
			return visitor.visitTypeArgument(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class Type_Context extends ParserRuleContext {
	public unionOrIntersectionOrPrimaryType(): UnionOrIntersectionOrPrimaryTypeContext | undefined {
		return this.tryGetRuleContext(0, UnionOrIntersectionOrPrimaryTypeContext);
	}
	public functionType(): FunctionTypeContext | undefined {
		return this.tryGetRuleContext(0, FunctionTypeContext);
	}
	public constructorType(): ConstructorTypeContext | undefined {
		return this.tryGetRuleContext(0, ConstructorTypeContext);
	}
	public typeGeneric(): TypeGenericContext | undefined {
		return this.tryGetRuleContext(0, TypeGenericContext);
	}
	public StringLiteral(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.StringLiteral, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_type_; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterType_) {
			listener.enterType_(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitType_) {
			listener.exitType_(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitType_) {
			return visitor.visitType_(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class UnionOrIntersectionOrPrimaryTypeContext extends ParserRuleContext {
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_unionOrIntersectionOrPrimaryType; }
	public copyFrom(ctx: UnionOrIntersectionOrPrimaryTypeContext): void {
		super.copyFrom(ctx);
	}
}
export class UnionContext extends UnionOrIntersectionOrPrimaryTypeContext {
	public unionOrIntersectionOrPrimaryType(): UnionOrIntersectionOrPrimaryTypeContext[];
	public unionOrIntersectionOrPrimaryType(i: number): UnionOrIntersectionOrPrimaryTypeContext;
	public unionOrIntersectionOrPrimaryType(i?: number): UnionOrIntersectionOrPrimaryTypeContext | UnionOrIntersectionOrPrimaryTypeContext[] {
		if (i === undefined) {
			return this.getRuleContexts(UnionOrIntersectionOrPrimaryTypeContext);
		} else {
			return this.getRuleContext(i, UnionOrIntersectionOrPrimaryTypeContext);
		}
	}
	public BitOr(): TerminalNode { return this.getToken(TypeScriptParser.BitOr, 0); }
	constructor(ctx: UnionOrIntersectionOrPrimaryTypeContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterUnion) {
			listener.enterUnion(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitUnion) {
			listener.exitUnion(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitUnion) {
			return visitor.visitUnion(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class IntersectionContext extends UnionOrIntersectionOrPrimaryTypeContext {
	public unionOrIntersectionOrPrimaryType(): UnionOrIntersectionOrPrimaryTypeContext[];
	public unionOrIntersectionOrPrimaryType(i: number): UnionOrIntersectionOrPrimaryTypeContext;
	public unionOrIntersectionOrPrimaryType(i?: number): UnionOrIntersectionOrPrimaryTypeContext | UnionOrIntersectionOrPrimaryTypeContext[] {
		if (i === undefined) {
			return this.getRuleContexts(UnionOrIntersectionOrPrimaryTypeContext);
		} else {
			return this.getRuleContext(i, UnionOrIntersectionOrPrimaryTypeContext);
		}
	}
	public BitAnd(): TerminalNode { return this.getToken(TypeScriptParser.BitAnd, 0); }
	constructor(ctx: UnionOrIntersectionOrPrimaryTypeContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterIntersection) {
			listener.enterIntersection(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitIntersection) {
			listener.exitIntersection(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitIntersection) {
			return visitor.visitIntersection(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class PrimaryContext extends UnionOrIntersectionOrPrimaryTypeContext {
	public primaryType(): PrimaryTypeContext {
		return this.getRuleContext(0, PrimaryTypeContext);
	}
	constructor(ctx: UnionOrIntersectionOrPrimaryTypeContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterPrimary) {
			listener.enterPrimary(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitPrimary) {
			listener.exitPrimary(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitPrimary) {
			return visitor.visitPrimary(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class PrimaryTypeContext extends ParserRuleContext {
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_primaryType; }
	public copyFrom(ctx: PrimaryTypeContext): void {
		super.copyFrom(ctx);
	}
}
export class ParenthesizedPrimTypeContext extends PrimaryTypeContext {
	public OpenParen(): TerminalNode { return this.getToken(TypeScriptParser.OpenParen, 0); }
	public type_(): Type_Context {
		return this.getRuleContext(0, Type_Context);
	}
	public CloseParen(): TerminalNode { return this.getToken(TypeScriptParser.CloseParen, 0); }
	constructor(ctx: PrimaryTypeContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterParenthesizedPrimType) {
			listener.enterParenthesizedPrimType(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitParenthesizedPrimType) {
			listener.exitParenthesizedPrimType(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitParenthesizedPrimType) {
			return visitor.visitParenthesizedPrimType(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class PredefinedPrimTypeContext extends PrimaryTypeContext {
	public predefinedType(): PredefinedTypeContext {
		return this.getRuleContext(0, PredefinedTypeContext);
	}
	constructor(ctx: PrimaryTypeContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterPredefinedPrimType) {
			listener.enterPredefinedPrimType(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitPredefinedPrimType) {
			listener.exitPredefinedPrimType(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitPredefinedPrimType) {
			return visitor.visitPredefinedPrimType(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class ReferencePrimTypeContext extends PrimaryTypeContext {
	public typeReference(): TypeReferenceContext {
		return this.getRuleContext(0, TypeReferenceContext);
	}
	constructor(ctx: PrimaryTypeContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterReferencePrimType) {
			listener.enterReferencePrimType(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitReferencePrimType) {
			listener.exitReferencePrimType(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitReferencePrimType) {
			return visitor.visitReferencePrimType(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class ObjectPrimTypeContext extends PrimaryTypeContext {
	public objectType(): ObjectTypeContext {
		return this.getRuleContext(0, ObjectTypeContext);
	}
	constructor(ctx: PrimaryTypeContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterObjectPrimType) {
			listener.enterObjectPrimType(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitObjectPrimType) {
			listener.exitObjectPrimType(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitObjectPrimType) {
			return visitor.visitObjectPrimType(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class ArrayPrimTypeContext extends PrimaryTypeContext {
	public primaryType(): PrimaryTypeContext {
		return this.getRuleContext(0, PrimaryTypeContext);
	}
	public OpenBracket(): TerminalNode { return this.getToken(TypeScriptParser.OpenBracket, 0); }
	public CloseBracket(): TerminalNode { return this.getToken(TypeScriptParser.CloseBracket, 0); }
	constructor(ctx: PrimaryTypeContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterArrayPrimType) {
			listener.enterArrayPrimType(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitArrayPrimType) {
			listener.exitArrayPrimType(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitArrayPrimType) {
			return visitor.visitArrayPrimType(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class TuplePrimTypeContext extends PrimaryTypeContext {
	public OpenBracket(): TerminalNode { return this.getToken(TypeScriptParser.OpenBracket, 0); }
	public tupleElementTypes(): TupleElementTypesContext {
		return this.getRuleContext(0, TupleElementTypesContext);
	}
	public CloseBracket(): TerminalNode { return this.getToken(TypeScriptParser.CloseBracket, 0); }
	constructor(ctx: PrimaryTypeContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterTuplePrimType) {
			listener.enterTuplePrimType(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitTuplePrimType) {
			listener.exitTuplePrimType(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitTuplePrimType) {
			return visitor.visitTuplePrimType(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class QueryPrimTypeContext extends PrimaryTypeContext {
	public typeQuery(): TypeQueryContext {
		return this.getRuleContext(0, TypeQueryContext);
	}
	constructor(ctx: PrimaryTypeContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterQueryPrimType) {
			listener.enterQueryPrimType(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitQueryPrimType) {
			listener.exitQueryPrimType(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitQueryPrimType) {
			return visitor.visitQueryPrimType(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class ThisPrimTypeContext extends PrimaryTypeContext {
	public This(): TerminalNode { return this.getToken(TypeScriptParser.This, 0); }
	constructor(ctx: PrimaryTypeContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterThisPrimType) {
			listener.enterThisPrimType(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitThisPrimType) {
			listener.exitThisPrimType(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitThisPrimType) {
			return visitor.visitThisPrimType(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class RedefinitionOfTypeContext extends PrimaryTypeContext {
	public typeReference(): TypeReferenceContext {
		return this.getRuleContext(0, TypeReferenceContext);
	}
	public Is(): TerminalNode { return this.getToken(TypeScriptParser.Is, 0); }
	public primaryType(): PrimaryTypeContext {
		return this.getRuleContext(0, PrimaryTypeContext);
	}
	constructor(ctx: PrimaryTypeContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterRedefinitionOfType) {
			listener.enterRedefinitionOfType(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitRedefinitionOfType) {
			listener.exitRedefinitionOfType(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitRedefinitionOfType) {
			return visitor.visitRedefinitionOfType(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class PredefinedTypeContext extends ParserRuleContext {
	public Any(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Any, 0); }
	public Number(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Number, 0); }
	public Boolean(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Boolean, 0); }
	public String(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.String, 0); }
	public Symbol(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Symbol, 0); }
	public Void(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Void, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_predefinedType; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterPredefinedType) {
			listener.enterPredefinedType(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitPredefinedType) {
			listener.exitPredefinedType(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitPredefinedType) {
			return visitor.visitPredefinedType(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TypeReferenceContext extends ParserRuleContext {
	public typeName(): TypeNameContext {
		return this.getRuleContext(0, TypeNameContext);
	}
	public nestedTypeGeneric(): NestedTypeGenericContext | undefined {
		return this.tryGetRuleContext(0, NestedTypeGenericContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_typeReference; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterTypeReference) {
			listener.enterTypeReference(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitTypeReference) {
			listener.exitTypeReference(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitTypeReference) {
			return visitor.visitTypeReference(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class NestedTypeGenericContext extends ParserRuleContext {
	public typeIncludeGeneric(): TypeIncludeGenericContext | undefined {
		return this.tryGetRuleContext(0, TypeIncludeGenericContext);
	}
	public typeGeneric(): TypeGenericContext | undefined {
		return this.tryGetRuleContext(0, TypeGenericContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_nestedTypeGeneric; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterNestedTypeGeneric) {
			listener.enterNestedTypeGeneric(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitNestedTypeGeneric) {
			listener.exitNestedTypeGeneric(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitNestedTypeGeneric) {
			return visitor.visitNestedTypeGeneric(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TypeGenericContext extends ParserRuleContext {
	public LessThan(): TerminalNode { return this.getToken(TypeScriptParser.LessThan, 0); }
	public typeArgumentList(): TypeArgumentListContext {
		return this.getRuleContext(0, TypeArgumentListContext);
	}
	public MoreThan(): TerminalNode { return this.getToken(TypeScriptParser.MoreThan, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_typeGeneric; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterTypeGeneric) {
			listener.enterTypeGeneric(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitTypeGeneric) {
			listener.exitTypeGeneric(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitTypeGeneric) {
			return visitor.visitTypeGeneric(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TypeIncludeGenericContext extends ParserRuleContext {
	public LessThan(): TerminalNode[];
	public LessThan(i: number): TerminalNode;
	public LessThan(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(TypeScriptParser.LessThan);
		} else {
			return this.getToken(TypeScriptParser.LessThan, i);
		}
	}
	public typeArgumentList(): TypeArgumentListContext[];
	public typeArgumentList(i: number): TypeArgumentListContext;
	public typeArgumentList(i?: number): TypeArgumentListContext | TypeArgumentListContext[] {
		if (i === undefined) {
			return this.getRuleContexts(TypeArgumentListContext);
		} else {
			return this.getRuleContext(i, TypeArgumentListContext);
		}
	}
	public MoreThan(): TerminalNode[];
	public MoreThan(i: number): TerminalNode;
	public MoreThan(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(TypeScriptParser.MoreThan);
		} else {
			return this.getToken(TypeScriptParser.MoreThan, i);
		}
	}
	public bindingPattern(): BindingPatternContext | undefined {
		return this.tryGetRuleContext(0, BindingPatternContext);
	}
	public RightShiftArithmetic(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.RightShiftArithmetic, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_typeIncludeGeneric; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterTypeIncludeGeneric) {
			listener.enterTypeIncludeGeneric(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitTypeIncludeGeneric) {
			listener.exitTypeIncludeGeneric(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitTypeIncludeGeneric) {
			return visitor.visitTypeIncludeGeneric(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TypeNameContext extends ParserRuleContext {
	public Identifier(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Identifier, 0); }
	public namespaceName(): NamespaceNameContext | undefined {
		return this.tryGetRuleContext(0, NamespaceNameContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_typeName; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterTypeName) {
			listener.enterTypeName(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitTypeName) {
			listener.exitTypeName(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitTypeName) {
			return visitor.visitTypeName(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ObjectTypeContext extends ParserRuleContext {
	public OpenBrace(): TerminalNode { return this.getToken(TypeScriptParser.OpenBrace, 0); }
	public CloseBrace(): TerminalNode { return this.getToken(TypeScriptParser.CloseBrace, 0); }
	public typeBody(): TypeBodyContext | undefined {
		return this.tryGetRuleContext(0, TypeBodyContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_objectType; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterObjectType) {
			listener.enterObjectType(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitObjectType) {
			listener.exitObjectType(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitObjectType) {
			return visitor.visitObjectType(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TypeBodyContext extends ParserRuleContext {
	public typeMemberList(): TypeMemberListContext {
		return this.getRuleContext(0, TypeMemberListContext);
	}
	public SemiColon(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.SemiColon, 0); }
	public Comma(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Comma, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_typeBody; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterTypeBody) {
			listener.enterTypeBody(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitTypeBody) {
			listener.exitTypeBody(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitTypeBody) {
			return visitor.visitTypeBody(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TypeMemberListContext extends ParserRuleContext {
	public typeMember(): TypeMemberContext[];
	public typeMember(i: number): TypeMemberContext;
	public typeMember(i?: number): TypeMemberContext | TypeMemberContext[] {
		if (i === undefined) {
			return this.getRuleContexts(TypeMemberContext);
		} else {
			return this.getRuleContext(i, TypeMemberContext);
		}
	}
	public SemiColon(): TerminalNode[];
	public SemiColon(i: number): TerminalNode;
	public SemiColon(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(TypeScriptParser.SemiColon);
		} else {
			return this.getToken(TypeScriptParser.SemiColon, i);
		}
	}
	public Comma(): TerminalNode[];
	public Comma(i: number): TerminalNode;
	public Comma(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(TypeScriptParser.Comma);
		} else {
			return this.getToken(TypeScriptParser.Comma, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_typeMemberList; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterTypeMemberList) {
			listener.enterTypeMemberList(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitTypeMemberList) {
			listener.exitTypeMemberList(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitTypeMemberList) {
			return visitor.visitTypeMemberList(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TypeMemberContext extends ParserRuleContext {
	public propertySignatur(): PropertySignaturContext | undefined {
		return this.tryGetRuleContext(0, PropertySignaturContext);
	}
	public callSignature(): CallSignatureContext | undefined {
		return this.tryGetRuleContext(0, CallSignatureContext);
	}
	public constructSignature(): ConstructSignatureContext | undefined {
		return this.tryGetRuleContext(0, ConstructSignatureContext);
	}
	public indexSignature(): IndexSignatureContext | undefined {
		return this.tryGetRuleContext(0, IndexSignatureContext);
	}
	public methodSignature(): MethodSignatureContext | undefined {
		return this.tryGetRuleContext(0, MethodSignatureContext);
	}
	public ARROW(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.ARROW, 0); }
	public type_(): Type_Context | undefined {
		return this.tryGetRuleContext(0, Type_Context);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_typeMember; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterTypeMember) {
			listener.enterTypeMember(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitTypeMember) {
			listener.exitTypeMember(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitTypeMember) {
			return visitor.visitTypeMember(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ArrayTypeContext extends ParserRuleContext {
	public primaryType(): PrimaryTypeContext {
		return this.getRuleContext(0, PrimaryTypeContext);
	}
	public OpenBracket(): TerminalNode { return this.getToken(TypeScriptParser.OpenBracket, 0); }
	public CloseBracket(): TerminalNode { return this.getToken(TypeScriptParser.CloseBracket, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_arrayType; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterArrayType) {
			listener.enterArrayType(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitArrayType) {
			listener.exitArrayType(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitArrayType) {
			return visitor.visitArrayType(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TupleTypeContext extends ParserRuleContext {
	public OpenBracket(): TerminalNode { return this.getToken(TypeScriptParser.OpenBracket, 0); }
	public tupleElementTypes(): TupleElementTypesContext {
		return this.getRuleContext(0, TupleElementTypesContext);
	}
	public CloseBracket(): TerminalNode { return this.getToken(TypeScriptParser.CloseBracket, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_tupleType; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterTupleType) {
			listener.enterTupleType(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitTupleType) {
			listener.exitTupleType(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitTupleType) {
			return visitor.visitTupleType(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TupleElementTypesContext extends ParserRuleContext {
	public type_(): Type_Context[];
	public type_(i: number): Type_Context;
	public type_(i?: number): Type_Context | Type_Context[] {
		if (i === undefined) {
			return this.getRuleContexts(Type_Context);
		} else {
			return this.getRuleContext(i, Type_Context);
		}
	}
	public Comma(): TerminalNode[];
	public Comma(i: number): TerminalNode;
	public Comma(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(TypeScriptParser.Comma);
		} else {
			return this.getToken(TypeScriptParser.Comma, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_tupleElementTypes; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterTupleElementTypes) {
			listener.enterTupleElementTypes(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitTupleElementTypes) {
			listener.exitTupleElementTypes(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitTupleElementTypes) {
			return visitor.visitTupleElementTypes(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class FunctionTypeContext extends ParserRuleContext {
	public OpenParen(): TerminalNode { return this.getToken(TypeScriptParser.OpenParen, 0); }
	public CloseParen(): TerminalNode { return this.getToken(TypeScriptParser.CloseParen, 0); }
	public ARROW(): TerminalNode { return this.getToken(TypeScriptParser.ARROW, 0); }
	public type_(): Type_Context {
		return this.getRuleContext(0, Type_Context);
	}
	public typeParameters(): TypeParametersContext | undefined {
		return this.tryGetRuleContext(0, TypeParametersContext);
	}
	public parameterList(): ParameterListContext | undefined {
		return this.tryGetRuleContext(0, ParameterListContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_functionType; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterFunctionType) {
			listener.enterFunctionType(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitFunctionType) {
			listener.exitFunctionType(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitFunctionType) {
			return visitor.visitFunctionType(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ConstructorTypeContext extends ParserRuleContext {
	public New(): TerminalNode { return this.getToken(TypeScriptParser.New, 0); }
	public OpenParen(): TerminalNode { return this.getToken(TypeScriptParser.OpenParen, 0); }
	public CloseParen(): TerminalNode { return this.getToken(TypeScriptParser.CloseParen, 0); }
	public ARROW(): TerminalNode { return this.getToken(TypeScriptParser.ARROW, 0); }
	public type_(): Type_Context {
		return this.getRuleContext(0, Type_Context);
	}
	public typeParameters(): TypeParametersContext | undefined {
		return this.tryGetRuleContext(0, TypeParametersContext);
	}
	public parameterList(): ParameterListContext | undefined {
		return this.tryGetRuleContext(0, ParameterListContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_constructorType; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterConstructorType) {
			listener.enterConstructorType(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitConstructorType) {
			listener.exitConstructorType(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitConstructorType) {
			return visitor.visitConstructorType(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TypeQueryContext extends ParserRuleContext {
	public Typeof(): TerminalNode { return this.getToken(TypeScriptParser.Typeof, 0); }
	public typeQueryExpression(): TypeQueryExpressionContext {
		return this.getRuleContext(0, TypeQueryExpressionContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_typeQuery; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterTypeQuery) {
			listener.enterTypeQuery(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitTypeQuery) {
			listener.exitTypeQuery(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitTypeQuery) {
			return visitor.visitTypeQuery(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TypeQueryExpressionContext extends ParserRuleContext {
	public Identifier(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Identifier, 0); }
	public identifierName(): IdentifierNameContext[];
	public identifierName(i: number): IdentifierNameContext;
	public identifierName(i?: number): IdentifierNameContext | IdentifierNameContext[] {
		if (i === undefined) {
			return this.getRuleContexts(IdentifierNameContext);
		} else {
			return this.getRuleContext(i, IdentifierNameContext);
		}
	}
	public Dot(): TerminalNode[];
	public Dot(i: number): TerminalNode;
	public Dot(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(TypeScriptParser.Dot);
		} else {
			return this.getToken(TypeScriptParser.Dot, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_typeQueryExpression; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterTypeQueryExpression) {
			listener.enterTypeQueryExpression(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitTypeQueryExpression) {
			listener.exitTypeQueryExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitTypeQueryExpression) {
			return visitor.visitTypeQueryExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class PropertySignaturContext extends ParserRuleContext {
	public propertyName(): PropertyNameContext {
		return this.getRuleContext(0, PropertyNameContext);
	}
	public ReadOnly(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.ReadOnly, 0); }
	public QuestionMark(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.QuestionMark, 0); }
	public typeAnnotation(): TypeAnnotationContext | undefined {
		return this.tryGetRuleContext(0, TypeAnnotationContext);
	}
	public ARROW(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.ARROW, 0); }
	public type_(): Type_Context | undefined {
		return this.tryGetRuleContext(0, Type_Context);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_propertySignatur; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterPropertySignatur) {
			listener.enterPropertySignatur(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitPropertySignatur) {
			listener.exitPropertySignatur(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitPropertySignatur) {
			return visitor.visitPropertySignatur(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TypeAnnotationContext extends ParserRuleContext {
	public Colon(): TerminalNode { return this.getToken(TypeScriptParser.Colon, 0); }
	public type_(): Type_Context {
		return this.getRuleContext(0, Type_Context);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_typeAnnotation; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterTypeAnnotation) {
			listener.enterTypeAnnotation(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitTypeAnnotation) {
			listener.exitTypeAnnotation(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitTypeAnnotation) {
			return visitor.visitTypeAnnotation(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class CallSignatureContext extends ParserRuleContext {
	public OpenParen(): TerminalNode { return this.getToken(TypeScriptParser.OpenParen, 0); }
	public CloseParen(): TerminalNode { return this.getToken(TypeScriptParser.CloseParen, 0); }
	public typeParameters(): TypeParametersContext | undefined {
		return this.tryGetRuleContext(0, TypeParametersContext);
	}
	public parameterList(): ParameterListContext | undefined {
		return this.tryGetRuleContext(0, ParameterListContext);
	}
	public typeAnnotation(): TypeAnnotationContext | undefined {
		return this.tryGetRuleContext(0, TypeAnnotationContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_callSignature; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterCallSignature) {
			listener.enterCallSignature(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitCallSignature) {
			listener.exitCallSignature(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitCallSignature) {
			return visitor.visitCallSignature(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ParameterListContext extends ParserRuleContext {
	public restParameter(): RestParameterContext | undefined {
		return this.tryGetRuleContext(0, RestParameterContext);
	}
	public parameter(): ParameterContext[];
	public parameter(i: number): ParameterContext;
	public parameter(i?: number): ParameterContext | ParameterContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ParameterContext);
		} else {
			return this.getRuleContext(i, ParameterContext);
		}
	}
	public Comma(): TerminalNode[];
	public Comma(i: number): TerminalNode;
	public Comma(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(TypeScriptParser.Comma);
		} else {
			return this.getToken(TypeScriptParser.Comma, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_parameterList; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterParameterList) {
			listener.enterParameterList(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitParameterList) {
			listener.exitParameterList(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitParameterList) {
			return visitor.visitParameterList(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class RequiredParameterListContext extends ParserRuleContext {
	public requiredParameter(): RequiredParameterContext[];
	public requiredParameter(i: number): RequiredParameterContext;
	public requiredParameter(i?: number): RequiredParameterContext | RequiredParameterContext[] {
		if (i === undefined) {
			return this.getRuleContexts(RequiredParameterContext);
		} else {
			return this.getRuleContext(i, RequiredParameterContext);
		}
	}
	public Comma(): TerminalNode[];
	public Comma(i: number): TerminalNode;
	public Comma(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(TypeScriptParser.Comma);
		} else {
			return this.getToken(TypeScriptParser.Comma, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_requiredParameterList; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterRequiredParameterList) {
			listener.enterRequiredParameterList(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitRequiredParameterList) {
			listener.exitRequiredParameterList(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitRequiredParameterList) {
			return visitor.visitRequiredParameterList(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ParameterContext extends ParserRuleContext {
	public requiredParameter(): RequiredParameterContext | undefined {
		return this.tryGetRuleContext(0, RequiredParameterContext);
	}
	public optionalParameter(): OptionalParameterContext | undefined {
		return this.tryGetRuleContext(0, OptionalParameterContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_parameter; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterParameter) {
			listener.enterParameter(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitParameter) {
			listener.exitParameter(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitParameter) {
			return visitor.visitParameter(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class OptionalParameterContext extends ParserRuleContext {
	public identifierOrPattern(): IdentifierOrPatternContext | undefined {
		return this.tryGetRuleContext(0, IdentifierOrPatternContext);
	}
	public decoratorList(): DecoratorListContext | undefined {
		return this.tryGetRuleContext(0, DecoratorListContext);
	}
	public QuestionMark(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.QuestionMark, 0); }
	public initializer(): InitializerContext | undefined {
		return this.tryGetRuleContext(0, InitializerContext);
	}
	public accessibilityModifier(): AccessibilityModifierContext | undefined {
		return this.tryGetRuleContext(0, AccessibilityModifierContext);
	}
	public typeAnnotation(): TypeAnnotationContext | undefined {
		return this.tryGetRuleContext(0, TypeAnnotationContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_optionalParameter; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterOptionalParameter) {
			listener.enterOptionalParameter(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitOptionalParameter) {
			listener.exitOptionalParameter(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitOptionalParameter) {
			return visitor.visitOptionalParameter(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class RestParameterContext extends ParserRuleContext {
	public Ellipsis(): TerminalNode { return this.getToken(TypeScriptParser.Ellipsis, 0); }
	public singleExpression(): SingleExpressionContext {
		return this.getRuleContext(0, SingleExpressionContext);
	}
	public typeAnnotation(): TypeAnnotationContext | undefined {
		return this.tryGetRuleContext(0, TypeAnnotationContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_restParameter; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterRestParameter) {
			listener.enterRestParameter(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitRestParameter) {
			listener.exitRestParameter(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitRestParameter) {
			return visitor.visitRestParameter(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class RequiredParameterContext extends ParserRuleContext {
	public identifierOrPattern(): IdentifierOrPatternContext {
		return this.getRuleContext(0, IdentifierOrPatternContext);
	}
	public decoratorList(): DecoratorListContext | undefined {
		return this.tryGetRuleContext(0, DecoratorListContext);
	}
	public accessibilityModifier(): AccessibilityModifierContext | undefined {
		return this.tryGetRuleContext(0, AccessibilityModifierContext);
	}
	public typeAnnotation(): TypeAnnotationContext | undefined {
		return this.tryGetRuleContext(0, TypeAnnotationContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_requiredParameter; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterRequiredParameter) {
			listener.enterRequiredParameter(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitRequiredParameter) {
			listener.exitRequiredParameter(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitRequiredParameter) {
			return visitor.visitRequiredParameter(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class AccessibilityModifierContext extends ParserRuleContext {
	public Public(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Public, 0); }
	public Private(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Private, 0); }
	public Protected(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Protected, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_accessibilityModifier; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterAccessibilityModifier) {
			listener.enterAccessibilityModifier(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitAccessibilityModifier) {
			listener.exitAccessibilityModifier(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitAccessibilityModifier) {
			return visitor.visitAccessibilityModifier(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class IdentifierOrPatternContext extends ParserRuleContext {
	public identifierName(): IdentifierNameContext | undefined {
		return this.tryGetRuleContext(0, IdentifierNameContext);
	}
	public bindingPattern(): BindingPatternContext | undefined {
		return this.tryGetRuleContext(0, BindingPatternContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_identifierOrPattern; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterIdentifierOrPattern) {
			listener.enterIdentifierOrPattern(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitIdentifierOrPattern) {
			listener.exitIdentifierOrPattern(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitIdentifierOrPattern) {
			return visitor.visitIdentifierOrPattern(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ConstructSignatureContext extends ParserRuleContext {
	public New(): TerminalNode { return this.getToken(TypeScriptParser.New, 0); }
	public OpenParen(): TerminalNode { return this.getToken(TypeScriptParser.OpenParen, 0); }
	public CloseParen(): TerminalNode { return this.getToken(TypeScriptParser.CloseParen, 0); }
	public typeParameters(): TypeParametersContext | undefined {
		return this.tryGetRuleContext(0, TypeParametersContext);
	}
	public parameterList(): ParameterListContext | undefined {
		return this.tryGetRuleContext(0, ParameterListContext);
	}
	public typeAnnotation(): TypeAnnotationContext | undefined {
		return this.tryGetRuleContext(0, TypeAnnotationContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_constructSignature; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterConstructSignature) {
			listener.enterConstructSignature(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitConstructSignature) {
			listener.exitConstructSignature(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitConstructSignature) {
			return visitor.visitConstructSignature(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class IndexSignatureContext extends ParserRuleContext {
	public OpenBracket(): TerminalNode { return this.getToken(TypeScriptParser.OpenBracket, 0); }
	public Identifier(): TerminalNode { return this.getToken(TypeScriptParser.Identifier, 0); }
	public Colon(): TerminalNode { return this.getToken(TypeScriptParser.Colon, 0); }
	public CloseBracket(): TerminalNode { return this.getToken(TypeScriptParser.CloseBracket, 0); }
	public typeAnnotation(): TypeAnnotationContext {
		return this.getRuleContext(0, TypeAnnotationContext);
	}
	public Number(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Number, 0); }
	public String(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.String, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_indexSignature; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterIndexSignature) {
			listener.enterIndexSignature(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitIndexSignature) {
			listener.exitIndexSignature(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitIndexSignature) {
			return visitor.visitIndexSignature(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class MethodSignatureContext extends ParserRuleContext {
	public propertyName(): PropertyNameContext {
		return this.getRuleContext(0, PropertyNameContext);
	}
	public callSignature(): CallSignatureContext {
		return this.getRuleContext(0, CallSignatureContext);
	}
	public QuestionMark(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.QuestionMark, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_methodSignature; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterMethodSignature) {
			listener.enterMethodSignature(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitMethodSignature) {
			listener.exitMethodSignature(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitMethodSignature) {
			return visitor.visitMethodSignature(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TypeAliasDeclarationContext extends ParserRuleContext {
	public TypeAlias(): TerminalNode { return this.getToken(TypeScriptParser.TypeAlias, 0); }
	public Identifier(): TerminalNode { return this.getToken(TypeScriptParser.Identifier, 0); }
	public Assign(): TerminalNode { return this.getToken(TypeScriptParser.Assign, 0); }
	public type_(): Type_Context {
		return this.getRuleContext(0, Type_Context);
	}
	public SemiColon(): TerminalNode { return this.getToken(TypeScriptParser.SemiColon, 0); }
	public typeParameters(): TypeParametersContext | undefined {
		return this.tryGetRuleContext(0, TypeParametersContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_typeAliasDeclaration; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterTypeAliasDeclaration) {
			listener.enterTypeAliasDeclaration(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitTypeAliasDeclaration) {
			listener.exitTypeAliasDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitTypeAliasDeclaration) {
			return visitor.visitTypeAliasDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ConstructorDeclarationContext extends ParserRuleContext {
	public Constructor(): TerminalNode { return this.getToken(TypeScriptParser.Constructor, 0); }
	public OpenParen(): TerminalNode { return this.getToken(TypeScriptParser.OpenParen, 0); }
	public CloseParen(): TerminalNode { return this.getToken(TypeScriptParser.CloseParen, 0); }
	public accessibilityModifier(): AccessibilityModifierContext | undefined {
		return this.tryGetRuleContext(0, AccessibilityModifierContext);
	}
	public formalParameterList(): FormalParameterListContext | undefined {
		return this.tryGetRuleContext(0, FormalParameterListContext);
	}
	public SemiColon(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.SemiColon, 0); }
	public OpenBrace(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.OpenBrace, 0); }
	public functionBody(): FunctionBodyContext | undefined {
		return this.tryGetRuleContext(0, FunctionBodyContext);
	}
	public CloseBrace(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.CloseBrace, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_constructorDeclaration; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterConstructorDeclaration) {
			listener.enterConstructorDeclaration(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitConstructorDeclaration) {
			listener.exitConstructorDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitConstructorDeclaration) {
			return visitor.visitConstructorDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class InterfaceDeclarationContext extends ParserRuleContext {
	public Interface(): TerminalNode { return this.getToken(TypeScriptParser.Interface, 0); }
	public Identifier(): TerminalNode { return this.getToken(TypeScriptParser.Identifier, 0); }
	public objectType(): ObjectTypeContext {
		return this.getRuleContext(0, ObjectTypeContext);
	}
	public Export(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Export, 0); }
	public Declare(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Declare, 0); }
	public typeParameters(): TypeParametersContext | undefined {
		return this.tryGetRuleContext(0, TypeParametersContext);
	}
	public interfaceExtendsClause(): InterfaceExtendsClauseContext | undefined {
		return this.tryGetRuleContext(0, InterfaceExtendsClauseContext);
	}
	public SemiColon(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.SemiColon, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_interfaceDeclaration; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterInterfaceDeclaration) {
			listener.enterInterfaceDeclaration(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitInterfaceDeclaration) {
			listener.exitInterfaceDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitInterfaceDeclaration) {
			return visitor.visitInterfaceDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class InterfaceExtendsClauseContext extends ParserRuleContext {
	public Extends(): TerminalNode { return this.getToken(TypeScriptParser.Extends, 0); }
	public classOrInterfaceTypeList(): ClassOrInterfaceTypeListContext {
		return this.getRuleContext(0, ClassOrInterfaceTypeListContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_interfaceExtendsClause; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterInterfaceExtendsClause) {
			listener.enterInterfaceExtendsClause(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitInterfaceExtendsClause) {
			listener.exitInterfaceExtendsClause(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitInterfaceExtendsClause) {
			return visitor.visitInterfaceExtendsClause(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ClassOrInterfaceTypeListContext extends ParserRuleContext {
	public typeReference(): TypeReferenceContext[];
	public typeReference(i: number): TypeReferenceContext;
	public typeReference(i?: number): TypeReferenceContext | TypeReferenceContext[] {
		if (i === undefined) {
			return this.getRuleContexts(TypeReferenceContext);
		} else {
			return this.getRuleContext(i, TypeReferenceContext);
		}
	}
	public Comma(): TerminalNode[];
	public Comma(i: number): TerminalNode;
	public Comma(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(TypeScriptParser.Comma);
		} else {
			return this.getToken(TypeScriptParser.Comma, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_classOrInterfaceTypeList; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterClassOrInterfaceTypeList) {
			listener.enterClassOrInterfaceTypeList(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitClassOrInterfaceTypeList) {
			listener.exitClassOrInterfaceTypeList(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitClassOrInterfaceTypeList) {
			return visitor.visitClassOrInterfaceTypeList(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class EnumDeclarationContext extends ParserRuleContext {
	public Enum(): TerminalNode { return this.getToken(TypeScriptParser.Enum, 0); }
	public Identifier(): TerminalNode { return this.getToken(TypeScriptParser.Identifier, 0); }
	public OpenBrace(): TerminalNode { return this.getToken(TypeScriptParser.OpenBrace, 0); }
	public CloseBrace(): TerminalNode { return this.getToken(TypeScriptParser.CloseBrace, 0); }
	public Const(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Const, 0); }
	public enumBody(): EnumBodyContext | undefined {
		return this.tryGetRuleContext(0, EnumBodyContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_enumDeclaration; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterEnumDeclaration) {
			listener.enterEnumDeclaration(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitEnumDeclaration) {
			listener.exitEnumDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitEnumDeclaration) {
			return visitor.visitEnumDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class EnumBodyContext extends ParserRuleContext {
	public enumMemberList(): EnumMemberListContext {
		return this.getRuleContext(0, EnumMemberListContext);
	}
	public Comma(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Comma, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_enumBody; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterEnumBody) {
			listener.enterEnumBody(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitEnumBody) {
			listener.exitEnumBody(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitEnumBody) {
			return visitor.visitEnumBody(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class EnumMemberListContext extends ParserRuleContext {
	public enumMember(): EnumMemberContext[];
	public enumMember(i: number): EnumMemberContext;
	public enumMember(i?: number): EnumMemberContext | EnumMemberContext[] {
		if (i === undefined) {
			return this.getRuleContexts(EnumMemberContext);
		} else {
			return this.getRuleContext(i, EnumMemberContext);
		}
	}
	public Comma(): TerminalNode[];
	public Comma(i: number): TerminalNode;
	public Comma(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(TypeScriptParser.Comma);
		} else {
			return this.getToken(TypeScriptParser.Comma, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_enumMemberList; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterEnumMemberList) {
			listener.enterEnumMemberList(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitEnumMemberList) {
			listener.exitEnumMemberList(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitEnumMemberList) {
			return visitor.visitEnumMemberList(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class EnumMemberContext extends ParserRuleContext {
	public propertyName(): PropertyNameContext {
		return this.getRuleContext(0, PropertyNameContext);
	}
	public Assign(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Assign, 0); }
	public singleExpression(): SingleExpressionContext | undefined {
		return this.tryGetRuleContext(0, SingleExpressionContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_enumMember; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterEnumMember) {
			listener.enterEnumMember(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitEnumMember) {
			listener.exitEnumMember(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitEnumMember) {
			return visitor.visitEnumMember(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class NamespaceDeclarationContext extends ParserRuleContext {
	public Namespace(): TerminalNode { return this.getToken(TypeScriptParser.Namespace, 0); }
	public namespaceName(): NamespaceNameContext {
		return this.getRuleContext(0, NamespaceNameContext);
	}
	public OpenBrace(): TerminalNode { return this.getToken(TypeScriptParser.OpenBrace, 0); }
	public CloseBrace(): TerminalNode { return this.getToken(TypeScriptParser.CloseBrace, 0); }
	public statementList(): StatementListContext | undefined {
		return this.tryGetRuleContext(0, StatementListContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_namespaceDeclaration; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterNamespaceDeclaration) {
			listener.enterNamespaceDeclaration(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitNamespaceDeclaration) {
			listener.exitNamespaceDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitNamespaceDeclaration) {
			return visitor.visitNamespaceDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class NamespaceNameContext extends ParserRuleContext {
	public Identifier(): TerminalNode[];
	public Identifier(i: number): TerminalNode;
	public Identifier(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(TypeScriptParser.Identifier);
		} else {
			return this.getToken(TypeScriptParser.Identifier, i);
		}
	}
	public Dot(): TerminalNode[];
	public Dot(i: number): TerminalNode;
	public Dot(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(TypeScriptParser.Dot);
		} else {
			return this.getToken(TypeScriptParser.Dot, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_namespaceName; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterNamespaceName) {
			listener.enterNamespaceName(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitNamespaceName) {
			listener.exitNamespaceName(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitNamespaceName) {
			return visitor.visitNamespaceName(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ImportAliasDeclarationContext extends ParserRuleContext {
	public Identifier(): TerminalNode { return this.getToken(TypeScriptParser.Identifier, 0); }
	public Assign(): TerminalNode { return this.getToken(TypeScriptParser.Assign, 0); }
	public namespaceName(): NamespaceNameContext {
		return this.getRuleContext(0, NamespaceNameContext);
	}
	public SemiColon(): TerminalNode { return this.getToken(TypeScriptParser.SemiColon, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_importAliasDeclaration; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterImportAliasDeclaration) {
			listener.enterImportAliasDeclaration(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitImportAliasDeclaration) {
			listener.exitImportAliasDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitImportAliasDeclaration) {
			return visitor.visitImportAliasDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class DecoratorListContext extends ParserRuleContext {
	public decorator(): DecoratorContext[];
	public decorator(i: number): DecoratorContext;
	public decorator(i?: number): DecoratorContext | DecoratorContext[] {
		if (i === undefined) {
			return this.getRuleContexts(DecoratorContext);
		} else {
			return this.getRuleContext(i, DecoratorContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_decoratorList; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterDecoratorList) {
			listener.enterDecoratorList(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitDecoratorList) {
			listener.exitDecoratorList(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitDecoratorList) {
			return visitor.visitDecoratorList(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class DecoratorContext extends ParserRuleContext {
	public At(): TerminalNode { return this.getToken(TypeScriptParser.At, 0); }
	public decoratorMemberExpression(): DecoratorMemberExpressionContext | undefined {
		return this.tryGetRuleContext(0, DecoratorMemberExpressionContext);
	}
	public decoratorCallExpression(): DecoratorCallExpressionContext | undefined {
		return this.tryGetRuleContext(0, DecoratorCallExpressionContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_decorator; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterDecorator) {
			listener.enterDecorator(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitDecorator) {
			listener.exitDecorator(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitDecorator) {
			return visitor.visitDecorator(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class DecoratorMemberExpressionContext extends ParserRuleContext {
	public Identifier(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Identifier, 0); }
	public decoratorMemberExpression(): DecoratorMemberExpressionContext | undefined {
		return this.tryGetRuleContext(0, DecoratorMemberExpressionContext);
	}
	public Dot(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Dot, 0); }
	public identifierName(): IdentifierNameContext | undefined {
		return this.tryGetRuleContext(0, IdentifierNameContext);
	}
	public OpenParen(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.OpenParen, 0); }
	public singleExpression(): SingleExpressionContext | undefined {
		return this.tryGetRuleContext(0, SingleExpressionContext);
	}
	public CloseParen(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.CloseParen, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_decoratorMemberExpression; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterDecoratorMemberExpression) {
			listener.enterDecoratorMemberExpression(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitDecoratorMemberExpression) {
			listener.exitDecoratorMemberExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitDecoratorMemberExpression) {
			return visitor.visitDecoratorMemberExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class DecoratorCallExpressionContext extends ParserRuleContext {
	public decoratorMemberExpression(): DecoratorMemberExpressionContext {
		return this.getRuleContext(0, DecoratorMemberExpressionContext);
	}
	public arguments(): ArgumentsContext {
		return this.getRuleContext(0, ArgumentsContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_decoratorCallExpression; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterDecoratorCallExpression) {
			listener.enterDecoratorCallExpression(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitDecoratorCallExpression) {
			listener.exitDecoratorCallExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitDecoratorCallExpression) {
			return visitor.visitDecoratorCallExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ProgramContext extends ParserRuleContext {
	public EOF(): TerminalNode { return this.getToken(TypeScriptParser.EOF, 0); }
	public sourceElements(): SourceElementsContext | undefined {
		return this.tryGetRuleContext(0, SourceElementsContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_program; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterProgram) {
			listener.enterProgram(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitProgram) {
			listener.exitProgram(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitProgram) {
			return visitor.visitProgram(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class SourceElementContext extends ParserRuleContext {
	public statement(): StatementContext {
		return this.getRuleContext(0, StatementContext);
	}
	public Export(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Export, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_sourceElement; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterSourceElement) {
			listener.enterSourceElement(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitSourceElement) {
			listener.exitSourceElement(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitSourceElement) {
			return visitor.visitSourceElement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class StatementContext extends ParserRuleContext {
	public block(): BlockContext | undefined {
		return this.tryGetRuleContext(0, BlockContext);
	}
	public importStatement(): ImportStatementContext | undefined {
		return this.tryGetRuleContext(0, ImportStatementContext);
	}
	public exportStatement(): ExportStatementContext | undefined {
		return this.tryGetRuleContext(0, ExportStatementContext);
	}
	public emptyStatement_(): EmptyStatement_Context | undefined {
		return this.tryGetRuleContext(0, EmptyStatement_Context);
	}
	public abstractDeclaration(): AbstractDeclarationContext | undefined {
		return this.tryGetRuleContext(0, AbstractDeclarationContext);
	}
	public decoratorList(): DecoratorListContext | undefined {
		return this.tryGetRuleContext(0, DecoratorListContext);
	}
	public classDeclaration(): ClassDeclarationContext | undefined {
		return this.tryGetRuleContext(0, ClassDeclarationContext);
	}
	public interfaceDeclaration(): InterfaceDeclarationContext | undefined {
		return this.tryGetRuleContext(0, InterfaceDeclarationContext);
	}
	public namespaceDeclaration(): NamespaceDeclarationContext | undefined {
		return this.tryGetRuleContext(0, NamespaceDeclarationContext);
	}
	public ifStatement(): IfStatementContext | undefined {
		return this.tryGetRuleContext(0, IfStatementContext);
	}
	public iterationStatement(): IterationStatementContext | undefined {
		return this.tryGetRuleContext(0, IterationStatementContext);
	}
	public continueStatement(): ContinueStatementContext | undefined {
		return this.tryGetRuleContext(0, ContinueStatementContext);
	}
	public breakStatement(): BreakStatementContext | undefined {
		return this.tryGetRuleContext(0, BreakStatementContext);
	}
	public returnStatement(): ReturnStatementContext | undefined {
		return this.tryGetRuleContext(0, ReturnStatementContext);
	}
	public yieldStatement(): YieldStatementContext | undefined {
		return this.tryGetRuleContext(0, YieldStatementContext);
	}
	public withStatement(): WithStatementContext | undefined {
		return this.tryGetRuleContext(0, WithStatementContext);
	}
	public labelledStatement(): LabelledStatementContext | undefined {
		return this.tryGetRuleContext(0, LabelledStatementContext);
	}
	public switchStatement(): SwitchStatementContext | undefined {
		return this.tryGetRuleContext(0, SwitchStatementContext);
	}
	public throwStatement(): ThrowStatementContext | undefined {
		return this.tryGetRuleContext(0, ThrowStatementContext);
	}
	public tryStatement(): TryStatementContext | undefined {
		return this.tryGetRuleContext(0, TryStatementContext);
	}
	public debuggerStatement(): DebuggerStatementContext | undefined {
		return this.tryGetRuleContext(0, DebuggerStatementContext);
	}
	public functionDeclaration(): FunctionDeclarationContext | undefined {
		return this.tryGetRuleContext(0, FunctionDeclarationContext);
	}
	public arrowFunctionDeclaration(): ArrowFunctionDeclarationContext | undefined {
		return this.tryGetRuleContext(0, ArrowFunctionDeclarationContext);
	}
	public generatorFunctionDeclaration(): GeneratorFunctionDeclarationContext | undefined {
		return this.tryGetRuleContext(0, GeneratorFunctionDeclarationContext);
	}
	public variableStatement(): VariableStatementContext | undefined {
		return this.tryGetRuleContext(0, VariableStatementContext);
	}
	public typeAliasDeclaration(): TypeAliasDeclarationContext | undefined {
		return this.tryGetRuleContext(0, TypeAliasDeclarationContext);
	}
	public enumDeclaration(): EnumDeclarationContext | undefined {
		return this.tryGetRuleContext(0, EnumDeclarationContext);
	}
	public expressionStatement(): ExpressionStatementContext | undefined {
		return this.tryGetRuleContext(0, ExpressionStatementContext);
	}
	public Export(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Export, 0); }
	public statement(): StatementContext | undefined {
		return this.tryGetRuleContext(0, StatementContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_statement; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterStatement) {
			listener.enterStatement(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitStatement) {
			listener.exitStatement(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitStatement) {
			return visitor.visitStatement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class BlockContext extends ParserRuleContext {
	public OpenBrace(): TerminalNode { return this.getToken(TypeScriptParser.OpenBrace, 0); }
	public CloseBrace(): TerminalNode { return this.getToken(TypeScriptParser.CloseBrace, 0); }
	public statementList(): StatementListContext | undefined {
		return this.tryGetRuleContext(0, StatementListContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_block; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterBlock) {
			listener.enterBlock(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitBlock) {
			listener.exitBlock(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitBlock) {
			return visitor.visitBlock(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class StatementListContext extends ParserRuleContext {
	public statement(): StatementContext[];
	public statement(i: number): StatementContext;
	public statement(i?: number): StatementContext | StatementContext[] {
		if (i === undefined) {
			return this.getRuleContexts(StatementContext);
		} else {
			return this.getRuleContext(i, StatementContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_statementList; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterStatementList) {
			listener.enterStatementList(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitStatementList) {
			listener.exitStatementList(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitStatementList) {
			return visitor.visitStatementList(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class AbstractDeclarationContext extends ParserRuleContext {
	public Abstract(): TerminalNode { return this.getToken(TypeScriptParser.Abstract, 0); }
	public eos(): EosContext {
		return this.getRuleContext(0, EosContext);
	}
	public Identifier(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Identifier, 0); }
	public callSignature(): CallSignatureContext | undefined {
		return this.tryGetRuleContext(0, CallSignatureContext);
	}
	public variableStatement(): VariableStatementContext | undefined {
		return this.tryGetRuleContext(0, VariableStatementContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_abstractDeclaration; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterAbstractDeclaration) {
			listener.enterAbstractDeclaration(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitAbstractDeclaration) {
			listener.exitAbstractDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitAbstractDeclaration) {
			return visitor.visitAbstractDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ImportStatementContext extends ParserRuleContext {
	public Import(): TerminalNode { return this.getToken(TypeScriptParser.Import, 0); }
	public fromBlock(): FromBlockContext | undefined {
		return this.tryGetRuleContext(0, FromBlockContext);
	}
	public importAliasDeclaration(): ImportAliasDeclarationContext | undefined {
		return this.tryGetRuleContext(0, ImportAliasDeclarationContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_importStatement; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterImportStatement) {
			listener.enterImportStatement(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitImportStatement) {
			listener.exitImportStatement(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitImportStatement) {
			return visitor.visitImportStatement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class FromBlockContext extends ParserRuleContext {
	public From(): TerminalNode { return this.getToken(TypeScriptParser.From, 0); }
	public StringLiteral(): TerminalNode { return this.getToken(TypeScriptParser.StringLiteral, 0); }
	public eos(): EosContext {
		return this.getRuleContext(0, EosContext);
	}
	public Multiply(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Multiply, 0); }
	public multipleImportStatement(): MultipleImportStatementContext | undefined {
		return this.tryGetRuleContext(0, MultipleImportStatementContext);
	}
	public As(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.As, 0); }
	public identifierName(): IdentifierNameContext | undefined {
		return this.tryGetRuleContext(0, IdentifierNameContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_fromBlock; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterFromBlock) {
			listener.enterFromBlock(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitFromBlock) {
			listener.exitFromBlock(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitFromBlock) {
			return visitor.visitFromBlock(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class MultipleImportStatementContext extends ParserRuleContext {
	public OpenBrace(): TerminalNode { return this.getToken(TypeScriptParser.OpenBrace, 0); }
	public identifierName(): IdentifierNameContext[];
	public identifierName(i: number): IdentifierNameContext;
	public identifierName(i?: number): IdentifierNameContext | IdentifierNameContext[] {
		if (i === undefined) {
			return this.getRuleContexts(IdentifierNameContext);
		} else {
			return this.getRuleContext(i, IdentifierNameContext);
		}
	}
	public CloseBrace(): TerminalNode { return this.getToken(TypeScriptParser.CloseBrace, 0); }
	public Comma(): TerminalNode[];
	public Comma(i: number): TerminalNode;
	public Comma(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(TypeScriptParser.Comma);
		} else {
			return this.getToken(TypeScriptParser.Comma, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_multipleImportStatement; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterMultipleImportStatement) {
			listener.enterMultipleImportStatement(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitMultipleImportStatement) {
			listener.exitMultipleImportStatement(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitMultipleImportStatement) {
			return visitor.visitMultipleImportStatement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ExportStatementContext extends ParserRuleContext {
	public Export(): TerminalNode { return this.getToken(TypeScriptParser.Export, 0); }
	public fromBlock(): FromBlockContext | undefined {
		return this.tryGetRuleContext(0, FromBlockContext);
	}
	public statement(): StatementContext | undefined {
		return this.tryGetRuleContext(0, StatementContext);
	}
	public Default(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Default, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_exportStatement; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterExportStatement) {
			listener.enterExportStatement(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitExportStatement) {
			listener.exitExportStatement(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitExportStatement) {
			return visitor.visitExportStatement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class VariableStatementContext extends ParserRuleContext {
	public bindingPattern(): BindingPatternContext | undefined {
		return this.tryGetRuleContext(0, BindingPatternContext);
	}
	public initializer(): InitializerContext | undefined {
		return this.tryGetRuleContext(0, InitializerContext);
	}
	public typeAnnotation(): TypeAnnotationContext | undefined {
		return this.tryGetRuleContext(0, TypeAnnotationContext);
	}
	public SemiColon(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.SemiColon, 0); }
	public variableDeclarationList(): VariableDeclarationListContext | undefined {
		return this.tryGetRuleContext(0, VariableDeclarationListContext);
	}
	public accessibilityModifier(): AccessibilityModifierContext | undefined {
		return this.tryGetRuleContext(0, AccessibilityModifierContext);
	}
	public varModifier(): VarModifierContext | undefined {
		return this.tryGetRuleContext(0, VarModifierContext);
	}
	public ReadOnly(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.ReadOnly, 0); }
	public Declare(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Declare, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_variableStatement; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterVariableStatement) {
			listener.enterVariableStatement(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitVariableStatement) {
			listener.exitVariableStatement(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitVariableStatement) {
			return visitor.visitVariableStatement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class VariableDeclarationListContext extends ParserRuleContext {
	public variableDeclaration(): VariableDeclarationContext[];
	public variableDeclaration(i: number): VariableDeclarationContext;
	public variableDeclaration(i?: number): VariableDeclarationContext | VariableDeclarationContext[] {
		if (i === undefined) {
			return this.getRuleContexts(VariableDeclarationContext);
		} else {
			return this.getRuleContext(i, VariableDeclarationContext);
		}
	}
	public Comma(): TerminalNode[];
	public Comma(i: number): TerminalNode;
	public Comma(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(TypeScriptParser.Comma);
		} else {
			return this.getToken(TypeScriptParser.Comma, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_variableDeclarationList; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterVariableDeclarationList) {
			listener.enterVariableDeclarationList(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitVariableDeclarationList) {
			listener.exitVariableDeclarationList(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitVariableDeclarationList) {
			return visitor.visitVariableDeclarationList(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class VariableDeclarationContext extends ParserRuleContext {
	public identifierOrKeyWord(): IdentifierOrKeyWordContext | undefined {
		return this.tryGetRuleContext(0, IdentifierOrKeyWordContext);
	}
	public arrayLiteral(): ArrayLiteralContext | undefined {
		return this.tryGetRuleContext(0, ArrayLiteralContext);
	}
	public objectLiteral(): ObjectLiteralContext | undefined {
		return this.tryGetRuleContext(0, ObjectLiteralContext);
	}
	public typeAnnotation(): TypeAnnotationContext | undefined {
		return this.tryGetRuleContext(0, TypeAnnotationContext);
	}
	public singleExpression(): SingleExpressionContext[];
	public singleExpression(i: number): SingleExpressionContext;
	public singleExpression(i?: number): SingleExpressionContext | SingleExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(SingleExpressionContext);
		} else {
			return this.getRuleContext(i, SingleExpressionContext);
		}
	}
	public Assign(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Assign, 0); }
	public typeParameters(): TypeParametersContext | undefined {
		return this.tryGetRuleContext(0, TypeParametersContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_variableDeclaration; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterVariableDeclaration) {
			listener.enterVariableDeclaration(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitVariableDeclaration) {
			listener.exitVariableDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitVariableDeclaration) {
			return visitor.visitVariableDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class EmptyStatement_Context extends ParserRuleContext {
	public SemiColon(): TerminalNode { return this.getToken(TypeScriptParser.SemiColon, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_emptyStatement_; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterEmptyStatement_) {
			listener.enterEmptyStatement_(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitEmptyStatement_) {
			listener.exitEmptyStatement_(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitEmptyStatement_) {
			return visitor.visitEmptyStatement_(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ExpressionStatementContext extends ParserRuleContext {
	public expressionSequence(): ExpressionSequenceContext {
		return this.getRuleContext(0, ExpressionSequenceContext);
	}
	public SemiColon(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.SemiColon, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_expressionStatement; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterExpressionStatement) {
			listener.enterExpressionStatement(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitExpressionStatement) {
			listener.exitExpressionStatement(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitExpressionStatement) {
			return visitor.visitExpressionStatement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class IfStatementContext extends ParserRuleContext {
	public If(): TerminalNode { return this.getToken(TypeScriptParser.If, 0); }
	public OpenParen(): TerminalNode { return this.getToken(TypeScriptParser.OpenParen, 0); }
	public expressionSequence(): ExpressionSequenceContext {
		return this.getRuleContext(0, ExpressionSequenceContext);
	}
	public CloseParen(): TerminalNode { return this.getToken(TypeScriptParser.CloseParen, 0); }
	public statement(): StatementContext[];
	public statement(i: number): StatementContext;
	public statement(i?: number): StatementContext | StatementContext[] {
		if (i === undefined) {
			return this.getRuleContexts(StatementContext);
		} else {
			return this.getRuleContext(i, StatementContext);
		}
	}
	public Else(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Else, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_ifStatement; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterIfStatement) {
			listener.enterIfStatement(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitIfStatement) {
			listener.exitIfStatement(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitIfStatement) {
			return visitor.visitIfStatement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class IterationStatementContext extends ParserRuleContext {
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_iterationStatement; }
	public copyFrom(ctx: IterationStatementContext): void {
		super.copyFrom(ctx);
	}
}
export class DoStatementContext extends IterationStatementContext {
	public Do(): TerminalNode { return this.getToken(TypeScriptParser.Do, 0); }
	public statement(): StatementContext {
		return this.getRuleContext(0, StatementContext);
	}
	public While(): TerminalNode { return this.getToken(TypeScriptParser.While, 0); }
	public OpenParen(): TerminalNode { return this.getToken(TypeScriptParser.OpenParen, 0); }
	public expressionSequence(): ExpressionSequenceContext {
		return this.getRuleContext(0, ExpressionSequenceContext);
	}
	public CloseParen(): TerminalNode { return this.getToken(TypeScriptParser.CloseParen, 0); }
	public eos(): EosContext {
		return this.getRuleContext(0, EosContext);
	}
	constructor(ctx: IterationStatementContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterDoStatement) {
			listener.enterDoStatement(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitDoStatement) {
			listener.exitDoStatement(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitDoStatement) {
			return visitor.visitDoStatement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class WhileStatementContext extends IterationStatementContext {
	public While(): TerminalNode { return this.getToken(TypeScriptParser.While, 0); }
	public OpenParen(): TerminalNode { return this.getToken(TypeScriptParser.OpenParen, 0); }
	public expressionSequence(): ExpressionSequenceContext {
		return this.getRuleContext(0, ExpressionSequenceContext);
	}
	public CloseParen(): TerminalNode { return this.getToken(TypeScriptParser.CloseParen, 0); }
	public statement(): StatementContext {
		return this.getRuleContext(0, StatementContext);
	}
	constructor(ctx: IterationStatementContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterWhileStatement) {
			listener.enterWhileStatement(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitWhileStatement) {
			listener.exitWhileStatement(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitWhileStatement) {
			return visitor.visitWhileStatement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class ForStatementContext extends IterationStatementContext {
	public For(): TerminalNode { return this.getToken(TypeScriptParser.For, 0); }
	public OpenParen(): TerminalNode { return this.getToken(TypeScriptParser.OpenParen, 0); }
	public SemiColon(): TerminalNode[];
	public SemiColon(i: number): TerminalNode;
	public SemiColon(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(TypeScriptParser.SemiColon);
		} else {
			return this.getToken(TypeScriptParser.SemiColon, i);
		}
	}
	public CloseParen(): TerminalNode { return this.getToken(TypeScriptParser.CloseParen, 0); }
	public statement(): StatementContext {
		return this.getRuleContext(0, StatementContext);
	}
	public expressionSequence(): ExpressionSequenceContext[];
	public expressionSequence(i: number): ExpressionSequenceContext;
	public expressionSequence(i?: number): ExpressionSequenceContext | ExpressionSequenceContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ExpressionSequenceContext);
		} else {
			return this.getRuleContext(i, ExpressionSequenceContext);
		}
	}
	constructor(ctx: IterationStatementContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterForStatement) {
			listener.enterForStatement(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitForStatement) {
			listener.exitForStatement(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitForStatement) {
			return visitor.visitForStatement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class ForVarStatementContext extends IterationStatementContext {
	public For(): TerminalNode { return this.getToken(TypeScriptParser.For, 0); }
	public OpenParen(): TerminalNode { return this.getToken(TypeScriptParser.OpenParen, 0); }
	public varModifier(): VarModifierContext {
		return this.getRuleContext(0, VarModifierContext);
	}
	public variableDeclarationList(): VariableDeclarationListContext {
		return this.getRuleContext(0, VariableDeclarationListContext);
	}
	public SemiColon(): TerminalNode[];
	public SemiColon(i: number): TerminalNode;
	public SemiColon(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(TypeScriptParser.SemiColon);
		} else {
			return this.getToken(TypeScriptParser.SemiColon, i);
		}
	}
	public CloseParen(): TerminalNode { return this.getToken(TypeScriptParser.CloseParen, 0); }
	public statement(): StatementContext {
		return this.getRuleContext(0, StatementContext);
	}
	public expressionSequence(): ExpressionSequenceContext[];
	public expressionSequence(i: number): ExpressionSequenceContext;
	public expressionSequence(i?: number): ExpressionSequenceContext | ExpressionSequenceContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ExpressionSequenceContext);
		} else {
			return this.getRuleContext(i, ExpressionSequenceContext);
		}
	}
	constructor(ctx: IterationStatementContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterForVarStatement) {
			listener.enterForVarStatement(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitForVarStatement) {
			listener.exitForVarStatement(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitForVarStatement) {
			return visitor.visitForVarStatement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class ForInStatementContext extends IterationStatementContext {
	public For(): TerminalNode { return this.getToken(TypeScriptParser.For, 0); }
	public OpenParen(): TerminalNode { return this.getToken(TypeScriptParser.OpenParen, 0); }
	public singleExpression(): SingleExpressionContext {
		return this.getRuleContext(0, SingleExpressionContext);
	}
	public expressionSequence(): ExpressionSequenceContext {
		return this.getRuleContext(0, ExpressionSequenceContext);
	}
	public CloseParen(): TerminalNode { return this.getToken(TypeScriptParser.CloseParen, 0); }
	public statement(): StatementContext {
		return this.getRuleContext(0, StatementContext);
	}
	public In(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.In, 0); }
	public Identifier(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Identifier, 0); }
	constructor(ctx: IterationStatementContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterForInStatement) {
			listener.enterForInStatement(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitForInStatement) {
			listener.exitForInStatement(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitForInStatement) {
			return visitor.visitForInStatement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class ForVarInStatementContext extends IterationStatementContext {
	public For(): TerminalNode { return this.getToken(TypeScriptParser.For, 0); }
	public OpenParen(): TerminalNode { return this.getToken(TypeScriptParser.OpenParen, 0); }
	public varModifier(): VarModifierContext {
		return this.getRuleContext(0, VarModifierContext);
	}
	public variableDeclaration(): VariableDeclarationContext {
		return this.getRuleContext(0, VariableDeclarationContext);
	}
	public expressionSequence(): ExpressionSequenceContext {
		return this.getRuleContext(0, ExpressionSequenceContext);
	}
	public CloseParen(): TerminalNode { return this.getToken(TypeScriptParser.CloseParen, 0); }
	public statement(): StatementContext {
		return this.getRuleContext(0, StatementContext);
	}
	public In(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.In, 0); }
	public Identifier(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Identifier, 0); }
	constructor(ctx: IterationStatementContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterForVarInStatement) {
			listener.enterForVarInStatement(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitForVarInStatement) {
			listener.exitForVarInStatement(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitForVarInStatement) {
			return visitor.visitForVarInStatement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class VarModifierContext extends ParserRuleContext {
	public Var(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Var, 0); }
	public Let(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Let, 0); }
	public Const(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Const, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_varModifier; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterVarModifier) {
			listener.enterVarModifier(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitVarModifier) {
			listener.exitVarModifier(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitVarModifier) {
			return visitor.visitVarModifier(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ContinueStatementContext extends ParserRuleContext {
	public Continue(): TerminalNode { return this.getToken(TypeScriptParser.Continue, 0); }
	public eos(): EosContext {
		return this.getRuleContext(0, EosContext);
	}
	public Identifier(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Identifier, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_continueStatement; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterContinueStatement) {
			listener.enterContinueStatement(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitContinueStatement) {
			listener.exitContinueStatement(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitContinueStatement) {
			return visitor.visitContinueStatement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class BreakStatementContext extends ParserRuleContext {
	public Break(): TerminalNode { return this.getToken(TypeScriptParser.Break, 0); }
	public eos(): EosContext {
		return this.getRuleContext(0, EosContext);
	}
	public Identifier(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Identifier, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_breakStatement; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterBreakStatement) {
			listener.enterBreakStatement(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitBreakStatement) {
			listener.exitBreakStatement(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitBreakStatement) {
			return visitor.visitBreakStatement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ReturnStatementContext extends ParserRuleContext {
	public Return(): TerminalNode { return this.getToken(TypeScriptParser.Return, 0); }
	public eos(): EosContext {
		return this.getRuleContext(0, EosContext);
	}
	public expressionSequence(): ExpressionSequenceContext | undefined {
		return this.tryGetRuleContext(0, ExpressionSequenceContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_returnStatement; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterReturnStatement) {
			listener.enterReturnStatement(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitReturnStatement) {
			listener.exitReturnStatement(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitReturnStatement) {
			return visitor.visitReturnStatement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class YieldStatementContext extends ParserRuleContext {
	public Yield(): TerminalNode { return this.getToken(TypeScriptParser.Yield, 0); }
	public eos(): EosContext {
		return this.getRuleContext(0, EosContext);
	}
	public expressionSequence(): ExpressionSequenceContext | undefined {
		return this.tryGetRuleContext(0, ExpressionSequenceContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_yieldStatement; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterYieldStatement) {
			listener.enterYieldStatement(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitYieldStatement) {
			listener.exitYieldStatement(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitYieldStatement) {
			return visitor.visitYieldStatement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class WithStatementContext extends ParserRuleContext {
	public With(): TerminalNode { return this.getToken(TypeScriptParser.With, 0); }
	public OpenParen(): TerminalNode { return this.getToken(TypeScriptParser.OpenParen, 0); }
	public expressionSequence(): ExpressionSequenceContext {
		return this.getRuleContext(0, ExpressionSequenceContext);
	}
	public CloseParen(): TerminalNode { return this.getToken(TypeScriptParser.CloseParen, 0); }
	public statement(): StatementContext {
		return this.getRuleContext(0, StatementContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_withStatement; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterWithStatement) {
			listener.enterWithStatement(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitWithStatement) {
			listener.exitWithStatement(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitWithStatement) {
			return visitor.visitWithStatement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class SwitchStatementContext extends ParserRuleContext {
	public Switch(): TerminalNode { return this.getToken(TypeScriptParser.Switch, 0); }
	public OpenParen(): TerminalNode { return this.getToken(TypeScriptParser.OpenParen, 0); }
	public expressionSequence(): ExpressionSequenceContext {
		return this.getRuleContext(0, ExpressionSequenceContext);
	}
	public CloseParen(): TerminalNode { return this.getToken(TypeScriptParser.CloseParen, 0); }
	public caseBlock(): CaseBlockContext {
		return this.getRuleContext(0, CaseBlockContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_switchStatement; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterSwitchStatement) {
			listener.enterSwitchStatement(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitSwitchStatement) {
			listener.exitSwitchStatement(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitSwitchStatement) {
			return visitor.visitSwitchStatement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class CaseBlockContext extends ParserRuleContext {
	public OpenBrace(): TerminalNode { return this.getToken(TypeScriptParser.OpenBrace, 0); }
	public CloseBrace(): TerminalNode { return this.getToken(TypeScriptParser.CloseBrace, 0); }
	public caseClauses(): CaseClausesContext[];
	public caseClauses(i: number): CaseClausesContext;
	public caseClauses(i?: number): CaseClausesContext | CaseClausesContext[] {
		if (i === undefined) {
			return this.getRuleContexts(CaseClausesContext);
		} else {
			return this.getRuleContext(i, CaseClausesContext);
		}
	}
	public defaultClause(): DefaultClauseContext | undefined {
		return this.tryGetRuleContext(0, DefaultClauseContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_caseBlock; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterCaseBlock) {
			listener.enterCaseBlock(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitCaseBlock) {
			listener.exitCaseBlock(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitCaseBlock) {
			return visitor.visitCaseBlock(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class CaseClausesContext extends ParserRuleContext {
	public caseClause(): CaseClauseContext[];
	public caseClause(i: number): CaseClauseContext;
	public caseClause(i?: number): CaseClauseContext | CaseClauseContext[] {
		if (i === undefined) {
			return this.getRuleContexts(CaseClauseContext);
		} else {
			return this.getRuleContext(i, CaseClauseContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_caseClauses; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterCaseClauses) {
			listener.enterCaseClauses(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitCaseClauses) {
			listener.exitCaseClauses(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitCaseClauses) {
			return visitor.visitCaseClauses(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class CaseClauseContext extends ParserRuleContext {
	public Case(): TerminalNode { return this.getToken(TypeScriptParser.Case, 0); }
	public expressionSequence(): ExpressionSequenceContext {
		return this.getRuleContext(0, ExpressionSequenceContext);
	}
	public Colon(): TerminalNode { return this.getToken(TypeScriptParser.Colon, 0); }
	public statementList(): StatementListContext | undefined {
		return this.tryGetRuleContext(0, StatementListContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_caseClause; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterCaseClause) {
			listener.enterCaseClause(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitCaseClause) {
			listener.exitCaseClause(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitCaseClause) {
			return visitor.visitCaseClause(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class DefaultClauseContext extends ParserRuleContext {
	public Default(): TerminalNode { return this.getToken(TypeScriptParser.Default, 0); }
	public Colon(): TerminalNode { return this.getToken(TypeScriptParser.Colon, 0); }
	public statementList(): StatementListContext | undefined {
		return this.tryGetRuleContext(0, StatementListContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_defaultClause; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterDefaultClause) {
			listener.enterDefaultClause(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitDefaultClause) {
			listener.exitDefaultClause(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitDefaultClause) {
			return visitor.visitDefaultClause(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class LabelledStatementContext extends ParserRuleContext {
	public Identifier(): TerminalNode { return this.getToken(TypeScriptParser.Identifier, 0); }
	public Colon(): TerminalNode { return this.getToken(TypeScriptParser.Colon, 0); }
	public statement(): StatementContext {
		return this.getRuleContext(0, StatementContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_labelledStatement; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterLabelledStatement) {
			listener.enterLabelledStatement(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitLabelledStatement) {
			listener.exitLabelledStatement(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitLabelledStatement) {
			return visitor.visitLabelledStatement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ThrowStatementContext extends ParserRuleContext {
	public Throw(): TerminalNode { return this.getToken(TypeScriptParser.Throw, 0); }
	public expressionSequence(): ExpressionSequenceContext {
		return this.getRuleContext(0, ExpressionSequenceContext);
	}
	public eos(): EosContext {
		return this.getRuleContext(0, EosContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_throwStatement; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterThrowStatement) {
			listener.enterThrowStatement(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitThrowStatement) {
			listener.exitThrowStatement(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitThrowStatement) {
			return visitor.visitThrowStatement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TryStatementContext extends ParserRuleContext {
	public Try(): TerminalNode { return this.getToken(TypeScriptParser.Try, 0); }
	public block(): BlockContext {
		return this.getRuleContext(0, BlockContext);
	}
	public catchProduction(): CatchProductionContext | undefined {
		return this.tryGetRuleContext(0, CatchProductionContext);
	}
	public finallyProduction(): FinallyProductionContext | undefined {
		return this.tryGetRuleContext(0, FinallyProductionContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_tryStatement; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterTryStatement) {
			listener.enterTryStatement(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitTryStatement) {
			listener.exitTryStatement(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitTryStatement) {
			return visitor.visitTryStatement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class CatchProductionContext extends ParserRuleContext {
	public Catch(): TerminalNode { return this.getToken(TypeScriptParser.Catch, 0); }
	public OpenParen(): TerminalNode { return this.getToken(TypeScriptParser.OpenParen, 0); }
	public Identifier(): TerminalNode { return this.getToken(TypeScriptParser.Identifier, 0); }
	public CloseParen(): TerminalNode { return this.getToken(TypeScriptParser.CloseParen, 0); }
	public block(): BlockContext {
		return this.getRuleContext(0, BlockContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_catchProduction; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterCatchProduction) {
			listener.enterCatchProduction(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitCatchProduction) {
			listener.exitCatchProduction(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitCatchProduction) {
			return visitor.visitCatchProduction(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class FinallyProductionContext extends ParserRuleContext {
	public Finally(): TerminalNode { return this.getToken(TypeScriptParser.Finally, 0); }
	public block(): BlockContext {
		return this.getRuleContext(0, BlockContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_finallyProduction; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterFinallyProduction) {
			listener.enterFinallyProduction(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitFinallyProduction) {
			listener.exitFinallyProduction(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitFinallyProduction) {
			return visitor.visitFinallyProduction(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class DebuggerStatementContext extends ParserRuleContext {
	public Debugger(): TerminalNode { return this.getToken(TypeScriptParser.Debugger, 0); }
	public eos(): EosContext {
		return this.getRuleContext(0, EosContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_debuggerStatement; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterDebuggerStatement) {
			listener.enterDebuggerStatement(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitDebuggerStatement) {
			listener.exitDebuggerStatement(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitDebuggerStatement) {
			return visitor.visitDebuggerStatement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class FunctionDeclarationContext extends ParserRuleContext {
	public Function_(): TerminalNode { return this.getToken(TypeScriptParser.Function_, 0); }
	public Identifier(): TerminalNode { return this.getToken(TypeScriptParser.Identifier, 0); }
	public callSignature(): CallSignatureContext {
		return this.getRuleContext(0, CallSignatureContext);
	}
	public SemiColon(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.SemiColon, 0); }
	public OpenBrace(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.OpenBrace, 0); }
	public functionBody(): FunctionBodyContext | undefined {
		return this.tryGetRuleContext(0, FunctionBodyContext);
	}
	public CloseBrace(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.CloseBrace, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_functionDeclaration; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterFunctionDeclaration) {
			listener.enterFunctionDeclaration(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitFunctionDeclaration) {
			listener.exitFunctionDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitFunctionDeclaration) {
			return visitor.visitFunctionDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ClassDeclarationContext extends ParserRuleContext {
	public Class(): TerminalNode { return this.getToken(TypeScriptParser.Class, 0); }
	public Identifier(): TerminalNode { return this.getToken(TypeScriptParser.Identifier, 0); }
	public classHeritage(): ClassHeritageContext {
		return this.getRuleContext(0, ClassHeritageContext);
	}
	public classTail(): ClassTailContext {
		return this.getRuleContext(0, ClassTailContext);
	}
	public Abstract(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Abstract, 0); }
	public typeParameters(): TypeParametersContext | undefined {
		return this.tryGetRuleContext(0, TypeParametersContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_classDeclaration; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterClassDeclaration) {
			listener.enterClassDeclaration(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitClassDeclaration) {
			listener.exitClassDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitClassDeclaration) {
			return visitor.visitClassDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ClassHeritageContext extends ParserRuleContext {
	public classExtendsClause(): ClassExtendsClauseContext | undefined {
		return this.tryGetRuleContext(0, ClassExtendsClauseContext);
	}
	public implementsClause(): ImplementsClauseContext | undefined {
		return this.tryGetRuleContext(0, ImplementsClauseContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_classHeritage; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterClassHeritage) {
			listener.enterClassHeritage(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitClassHeritage) {
			listener.exitClassHeritage(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitClassHeritage) {
			return visitor.visitClassHeritage(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ClassTailContext extends ParserRuleContext {
	public OpenBrace(): TerminalNode { return this.getToken(TypeScriptParser.OpenBrace, 0); }
	public CloseBrace(): TerminalNode { return this.getToken(TypeScriptParser.CloseBrace, 0); }
	public classElement(): ClassElementContext[];
	public classElement(i: number): ClassElementContext;
	public classElement(i?: number): ClassElementContext | ClassElementContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ClassElementContext);
		} else {
			return this.getRuleContext(i, ClassElementContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_classTail; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterClassTail) {
			listener.enterClassTail(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitClassTail) {
			listener.exitClassTail(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitClassTail) {
			return visitor.visitClassTail(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ClassExtendsClauseContext extends ParserRuleContext {
	public Extends(): TerminalNode { return this.getToken(TypeScriptParser.Extends, 0); }
	public typeReference(): TypeReferenceContext {
		return this.getRuleContext(0, TypeReferenceContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_classExtendsClause; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterClassExtendsClause) {
			listener.enterClassExtendsClause(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitClassExtendsClause) {
			listener.exitClassExtendsClause(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitClassExtendsClause) {
			return visitor.visitClassExtendsClause(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ImplementsClauseContext extends ParserRuleContext {
	public Implements(): TerminalNode { return this.getToken(TypeScriptParser.Implements, 0); }
	public classOrInterfaceTypeList(): ClassOrInterfaceTypeListContext {
		return this.getRuleContext(0, ClassOrInterfaceTypeListContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_implementsClause; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterImplementsClause) {
			listener.enterImplementsClause(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitImplementsClause) {
			listener.exitImplementsClause(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitImplementsClause) {
			return visitor.visitImplementsClause(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ClassElementContext extends ParserRuleContext {
	public constructorDeclaration(): ConstructorDeclarationContext | undefined {
		return this.tryGetRuleContext(0, ConstructorDeclarationContext);
	}
	public propertyMemberDeclaration(): PropertyMemberDeclarationContext | undefined {
		return this.tryGetRuleContext(0, PropertyMemberDeclarationContext);
	}
	public decoratorList(): DecoratorListContext | undefined {
		return this.tryGetRuleContext(0, DecoratorListContext);
	}
	public indexMemberDeclaration(): IndexMemberDeclarationContext | undefined {
		return this.tryGetRuleContext(0, IndexMemberDeclarationContext);
	}
	public statement(): StatementContext | undefined {
		return this.tryGetRuleContext(0, StatementContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_classElement; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterClassElement) {
			listener.enterClassElement(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitClassElement) {
			listener.exitClassElement(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitClassElement) {
			return visitor.visitClassElement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class PropertyMemberDeclarationContext extends ParserRuleContext {
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_propertyMemberDeclaration; }
	public copyFrom(ctx: PropertyMemberDeclarationContext): void {
		super.copyFrom(ctx);
	}
}
export class PropertyDeclarationExpressionContext extends PropertyMemberDeclarationContext {
	public propertyMemberBase(): PropertyMemberBaseContext {
		return this.getRuleContext(0, PropertyMemberBaseContext);
	}
	public propertyName(): PropertyNameContext {
		return this.getRuleContext(0, PropertyNameContext);
	}
	public SemiColon(): TerminalNode { return this.getToken(TypeScriptParser.SemiColon, 0); }
	public QuestionMark(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.QuestionMark, 0); }
	public typeAnnotation(): TypeAnnotationContext | undefined {
		return this.tryGetRuleContext(0, TypeAnnotationContext);
	}
	public initializer(): InitializerContext | undefined {
		return this.tryGetRuleContext(0, InitializerContext);
	}
	constructor(ctx: PropertyMemberDeclarationContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterPropertyDeclarationExpression) {
			listener.enterPropertyDeclarationExpression(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitPropertyDeclarationExpression) {
			listener.exitPropertyDeclarationExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitPropertyDeclarationExpression) {
			return visitor.visitPropertyDeclarationExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class MethodDeclarationExpressionContext extends PropertyMemberDeclarationContext {
	public propertyMemberBase(): PropertyMemberBaseContext {
		return this.getRuleContext(0, PropertyMemberBaseContext);
	}
	public propertyName(): PropertyNameContext {
		return this.getRuleContext(0, PropertyNameContext);
	}
	public callSignature(): CallSignatureContext {
		return this.getRuleContext(0, CallSignatureContext);
	}
	public SemiColon(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.SemiColon, 0); }
	public OpenBrace(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.OpenBrace, 0); }
	public functionBody(): FunctionBodyContext | undefined {
		return this.tryGetRuleContext(0, FunctionBodyContext);
	}
	public CloseBrace(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.CloseBrace, 0); }
	constructor(ctx: PropertyMemberDeclarationContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterMethodDeclarationExpression) {
			listener.enterMethodDeclarationExpression(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitMethodDeclarationExpression) {
			listener.exitMethodDeclarationExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitMethodDeclarationExpression) {
			return visitor.visitMethodDeclarationExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class GetterSetterDeclarationExpressionContext extends PropertyMemberDeclarationContext {
	public propertyMemberBase(): PropertyMemberBaseContext {
		return this.getRuleContext(0, PropertyMemberBaseContext);
	}
	public getAccessor(): GetAccessorContext | undefined {
		return this.tryGetRuleContext(0, GetAccessorContext);
	}
	public setAccessor(): SetAccessorContext | undefined {
		return this.tryGetRuleContext(0, SetAccessorContext);
	}
	constructor(ctx: PropertyMemberDeclarationContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterGetterSetterDeclarationExpression) {
			listener.enterGetterSetterDeclarationExpression(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitGetterSetterDeclarationExpression) {
			listener.exitGetterSetterDeclarationExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitGetterSetterDeclarationExpression) {
			return visitor.visitGetterSetterDeclarationExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class AbstractMemberDeclarationContext extends PropertyMemberDeclarationContext {
	public abstractDeclaration(): AbstractDeclarationContext {
		return this.getRuleContext(0, AbstractDeclarationContext);
	}
	constructor(ctx: PropertyMemberDeclarationContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterAbstractMemberDeclaration) {
			listener.enterAbstractMemberDeclaration(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitAbstractMemberDeclaration) {
			listener.exitAbstractMemberDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitAbstractMemberDeclaration) {
			return visitor.visitAbstractMemberDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class PropertyMemberBaseContext extends ParserRuleContext {
	public Async(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Async, 0); }
	public accessibilityModifier(): AccessibilityModifierContext | undefined {
		return this.tryGetRuleContext(0, AccessibilityModifierContext);
	}
	public Static(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Static, 0); }
	public ReadOnly(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.ReadOnly, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_propertyMemberBase; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterPropertyMemberBase) {
			listener.enterPropertyMemberBase(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitPropertyMemberBase) {
			listener.exitPropertyMemberBase(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitPropertyMemberBase) {
			return visitor.visitPropertyMemberBase(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class IndexMemberDeclarationContext extends ParserRuleContext {
	public indexSignature(): IndexSignatureContext {
		return this.getRuleContext(0, IndexSignatureContext);
	}
	public SemiColon(): TerminalNode { return this.getToken(TypeScriptParser.SemiColon, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_indexMemberDeclaration; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterIndexMemberDeclaration) {
			listener.enterIndexMemberDeclaration(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitIndexMemberDeclaration) {
			listener.exitIndexMemberDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitIndexMemberDeclaration) {
			return visitor.visitIndexMemberDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class GeneratorMethodContext extends ParserRuleContext {
	public Identifier(): TerminalNode { return this.getToken(TypeScriptParser.Identifier, 0); }
	public OpenParen(): TerminalNode { return this.getToken(TypeScriptParser.OpenParen, 0); }
	public CloseParen(): TerminalNode { return this.getToken(TypeScriptParser.CloseParen, 0); }
	public OpenBrace(): TerminalNode { return this.getToken(TypeScriptParser.OpenBrace, 0); }
	public functionBody(): FunctionBodyContext {
		return this.getRuleContext(0, FunctionBodyContext);
	}
	public CloseBrace(): TerminalNode { return this.getToken(TypeScriptParser.CloseBrace, 0); }
	public Multiply(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Multiply, 0); }
	public formalParameterList(): FormalParameterListContext | undefined {
		return this.tryGetRuleContext(0, FormalParameterListContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_generatorMethod; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterGeneratorMethod) {
			listener.enterGeneratorMethod(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitGeneratorMethod) {
			listener.exitGeneratorMethod(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitGeneratorMethod) {
			return visitor.visitGeneratorMethod(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class GeneratorFunctionDeclarationContext extends ParserRuleContext {
	public Function_(): TerminalNode { return this.getToken(TypeScriptParser.Function_, 0); }
	public Multiply(): TerminalNode { return this.getToken(TypeScriptParser.Multiply, 0); }
	public OpenParen(): TerminalNode { return this.getToken(TypeScriptParser.OpenParen, 0); }
	public CloseParen(): TerminalNode { return this.getToken(TypeScriptParser.CloseParen, 0); }
	public OpenBrace(): TerminalNode { return this.getToken(TypeScriptParser.OpenBrace, 0); }
	public functionBody(): FunctionBodyContext {
		return this.getRuleContext(0, FunctionBodyContext);
	}
	public CloseBrace(): TerminalNode { return this.getToken(TypeScriptParser.CloseBrace, 0); }
	public Identifier(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Identifier, 0); }
	public formalParameterList(): FormalParameterListContext | undefined {
		return this.tryGetRuleContext(0, FormalParameterListContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_generatorFunctionDeclaration; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterGeneratorFunctionDeclaration) {
			listener.enterGeneratorFunctionDeclaration(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitGeneratorFunctionDeclaration) {
			listener.exitGeneratorFunctionDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitGeneratorFunctionDeclaration) {
			return visitor.visitGeneratorFunctionDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class GeneratorBlockContext extends ParserRuleContext {
	public OpenBrace(): TerminalNode { return this.getToken(TypeScriptParser.OpenBrace, 0); }
	public generatorDefinition(): GeneratorDefinitionContext[];
	public generatorDefinition(i: number): GeneratorDefinitionContext;
	public generatorDefinition(i?: number): GeneratorDefinitionContext | GeneratorDefinitionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(GeneratorDefinitionContext);
		} else {
			return this.getRuleContext(i, GeneratorDefinitionContext);
		}
	}
	public CloseBrace(): TerminalNode { return this.getToken(TypeScriptParser.CloseBrace, 0); }
	public Comma(): TerminalNode[];
	public Comma(i: number): TerminalNode;
	public Comma(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(TypeScriptParser.Comma);
		} else {
			return this.getToken(TypeScriptParser.Comma, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_generatorBlock; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterGeneratorBlock) {
			listener.enterGeneratorBlock(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitGeneratorBlock) {
			listener.exitGeneratorBlock(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitGeneratorBlock) {
			return visitor.visitGeneratorBlock(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class GeneratorDefinitionContext extends ParserRuleContext {
	public Multiply(): TerminalNode { return this.getToken(TypeScriptParser.Multiply, 0); }
	public iteratorDefinition(): IteratorDefinitionContext {
		return this.getRuleContext(0, IteratorDefinitionContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_generatorDefinition; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterGeneratorDefinition) {
			listener.enterGeneratorDefinition(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitGeneratorDefinition) {
			listener.exitGeneratorDefinition(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitGeneratorDefinition) {
			return visitor.visitGeneratorDefinition(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class IteratorBlockContext extends ParserRuleContext {
	public OpenBrace(): TerminalNode { return this.getToken(TypeScriptParser.OpenBrace, 0); }
	public iteratorDefinition(): IteratorDefinitionContext[];
	public iteratorDefinition(i: number): IteratorDefinitionContext;
	public iteratorDefinition(i?: number): IteratorDefinitionContext | IteratorDefinitionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(IteratorDefinitionContext);
		} else {
			return this.getRuleContext(i, IteratorDefinitionContext);
		}
	}
	public CloseBrace(): TerminalNode { return this.getToken(TypeScriptParser.CloseBrace, 0); }
	public Comma(): TerminalNode[];
	public Comma(i: number): TerminalNode;
	public Comma(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(TypeScriptParser.Comma);
		} else {
			return this.getToken(TypeScriptParser.Comma, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_iteratorBlock; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterIteratorBlock) {
			listener.enterIteratorBlock(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitIteratorBlock) {
			listener.exitIteratorBlock(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitIteratorBlock) {
			return visitor.visitIteratorBlock(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class IteratorDefinitionContext extends ParserRuleContext {
	public OpenBracket(): TerminalNode { return this.getToken(TypeScriptParser.OpenBracket, 0); }
	public singleExpression(): SingleExpressionContext {
		return this.getRuleContext(0, SingleExpressionContext);
	}
	public CloseBracket(): TerminalNode { return this.getToken(TypeScriptParser.CloseBracket, 0); }
	public OpenParen(): TerminalNode { return this.getToken(TypeScriptParser.OpenParen, 0); }
	public CloseParen(): TerminalNode { return this.getToken(TypeScriptParser.CloseParen, 0); }
	public OpenBrace(): TerminalNode { return this.getToken(TypeScriptParser.OpenBrace, 0); }
	public functionBody(): FunctionBodyContext {
		return this.getRuleContext(0, FunctionBodyContext);
	}
	public CloseBrace(): TerminalNode { return this.getToken(TypeScriptParser.CloseBrace, 0); }
	public formalParameterList(): FormalParameterListContext | undefined {
		return this.tryGetRuleContext(0, FormalParameterListContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_iteratorDefinition; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterIteratorDefinition) {
			listener.enterIteratorDefinition(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitIteratorDefinition) {
			listener.exitIteratorDefinition(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitIteratorDefinition) {
			return visitor.visitIteratorDefinition(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class FormalParameterListContext extends ParserRuleContext {
	public formalParameterArg(): FormalParameterArgContext[];
	public formalParameterArg(i: number): FormalParameterArgContext;
	public formalParameterArg(i?: number): FormalParameterArgContext | FormalParameterArgContext[] {
		if (i === undefined) {
			return this.getRuleContexts(FormalParameterArgContext);
		} else {
			return this.getRuleContext(i, FormalParameterArgContext);
		}
	}
	public Comma(): TerminalNode[];
	public Comma(i: number): TerminalNode;
	public Comma(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(TypeScriptParser.Comma);
		} else {
			return this.getToken(TypeScriptParser.Comma, i);
		}
	}
	public lastFormalParameterArg(): LastFormalParameterArgContext | undefined {
		return this.tryGetRuleContext(0, LastFormalParameterArgContext);
	}
	public arrayLiteral(): ArrayLiteralContext | undefined {
		return this.tryGetRuleContext(0, ArrayLiteralContext);
	}
	public objectLiteral(): ObjectLiteralContext | undefined {
		return this.tryGetRuleContext(0, ObjectLiteralContext);
	}
	public Colon(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Colon, 0); }
	public formalParameterList(): FormalParameterListContext | undefined {
		return this.tryGetRuleContext(0, FormalParameterListContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_formalParameterList; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterFormalParameterList) {
			listener.enterFormalParameterList(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitFormalParameterList) {
			listener.exitFormalParameterList(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitFormalParameterList) {
			return visitor.visitFormalParameterList(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class FormalParameterArgContext extends ParserRuleContext {
	public identifierOrKeyWord(): IdentifierOrKeyWordContext {
		return this.getRuleContext(0, IdentifierOrKeyWordContext);
	}
	public decorator(): DecoratorContext | undefined {
		return this.tryGetRuleContext(0, DecoratorContext);
	}
	public accessibilityModifier(): AccessibilityModifierContext | undefined {
		return this.tryGetRuleContext(0, AccessibilityModifierContext);
	}
	public QuestionMark(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.QuestionMark, 0); }
	public typeAnnotation(): TypeAnnotationContext | undefined {
		return this.tryGetRuleContext(0, TypeAnnotationContext);
	}
	public Assign(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Assign, 0); }
	public singleExpression(): SingleExpressionContext | undefined {
		return this.tryGetRuleContext(0, SingleExpressionContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_formalParameterArg; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterFormalParameterArg) {
			listener.enterFormalParameterArg(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitFormalParameterArg) {
			listener.exitFormalParameterArg(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitFormalParameterArg) {
			return visitor.visitFormalParameterArg(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class LastFormalParameterArgContext extends ParserRuleContext {
	public Ellipsis(): TerminalNode { return this.getToken(TypeScriptParser.Ellipsis, 0); }
	public Identifier(): TerminalNode { return this.getToken(TypeScriptParser.Identifier, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_lastFormalParameterArg; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterLastFormalParameterArg) {
			listener.enterLastFormalParameterArg(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitLastFormalParameterArg) {
			listener.exitLastFormalParameterArg(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitLastFormalParameterArg) {
			return visitor.visitLastFormalParameterArg(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class FunctionBodyContext extends ParserRuleContext {
	public sourceElements(): SourceElementsContext | undefined {
		return this.tryGetRuleContext(0, SourceElementsContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_functionBody; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterFunctionBody) {
			listener.enterFunctionBody(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitFunctionBody) {
			listener.exitFunctionBody(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitFunctionBody) {
			return visitor.visitFunctionBody(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class SourceElementsContext extends ParserRuleContext {
	public sourceElement(): SourceElementContext[];
	public sourceElement(i: number): SourceElementContext;
	public sourceElement(i?: number): SourceElementContext | SourceElementContext[] {
		if (i === undefined) {
			return this.getRuleContexts(SourceElementContext);
		} else {
			return this.getRuleContext(i, SourceElementContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_sourceElements; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterSourceElements) {
			listener.enterSourceElements(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitSourceElements) {
			listener.exitSourceElements(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitSourceElements) {
			return visitor.visitSourceElements(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ArrayLiteralContext extends ParserRuleContext {
	public OpenBracket(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.OpenBracket, 0); }
	public CloseBracket(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.CloseBracket, 0); }
	public elementList(): ElementListContext | undefined {
		return this.tryGetRuleContext(0, ElementListContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_arrayLiteral; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterArrayLiteral) {
			listener.enterArrayLiteral(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitArrayLiteral) {
			listener.exitArrayLiteral(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitArrayLiteral) {
			return visitor.visitArrayLiteral(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ElementListContext extends ParserRuleContext {
	public arrayElement(): ArrayElementContext[];
	public arrayElement(i: number): ArrayElementContext;
	public arrayElement(i?: number): ArrayElementContext | ArrayElementContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ArrayElementContext);
		} else {
			return this.getRuleContext(i, ArrayElementContext);
		}
	}
	public Comma(): TerminalNode[];
	public Comma(i: number): TerminalNode;
	public Comma(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(TypeScriptParser.Comma);
		} else {
			return this.getToken(TypeScriptParser.Comma, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_elementList; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterElementList) {
			listener.enterElementList(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitElementList) {
			listener.exitElementList(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitElementList) {
			return visitor.visitElementList(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ArrayElementContext extends ParserRuleContext {
	public singleExpression(): SingleExpressionContext | undefined {
		return this.tryGetRuleContext(0, SingleExpressionContext);
	}
	public Identifier(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Identifier, 0); }
	public Ellipsis(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Ellipsis, 0); }
	public Comma(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Comma, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_arrayElement; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterArrayElement) {
			listener.enterArrayElement(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitArrayElement) {
			listener.exitArrayElement(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitArrayElement) {
			return visitor.visitArrayElement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ObjectLiteralContext extends ParserRuleContext {
	public OpenBrace(): TerminalNode { return this.getToken(TypeScriptParser.OpenBrace, 0); }
	public CloseBrace(): TerminalNode { return this.getToken(TypeScriptParser.CloseBrace, 0); }
	public propertyAssignment(): PropertyAssignmentContext[];
	public propertyAssignment(i: number): PropertyAssignmentContext;
	public propertyAssignment(i?: number): PropertyAssignmentContext | PropertyAssignmentContext[] {
		if (i === undefined) {
			return this.getRuleContexts(PropertyAssignmentContext);
		} else {
			return this.getRuleContext(i, PropertyAssignmentContext);
		}
	}
	public Comma(): TerminalNode[];
	public Comma(i: number): TerminalNode;
	public Comma(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(TypeScriptParser.Comma);
		} else {
			return this.getToken(TypeScriptParser.Comma, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_objectLiteral; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterObjectLiteral) {
			listener.enterObjectLiteral(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitObjectLiteral) {
			listener.exitObjectLiteral(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitObjectLiteral) {
			return visitor.visitObjectLiteral(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class PropertyAssignmentContext extends ParserRuleContext {
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_propertyAssignment; }
	public copyFrom(ctx: PropertyAssignmentContext): void {
		super.copyFrom(ctx);
	}
}
export class PropertyExpressionAssignmentContext extends PropertyAssignmentContext {
	public propertyName(): PropertyNameContext {
		return this.getRuleContext(0, PropertyNameContext);
	}
	public singleExpression(): SingleExpressionContext {
		return this.getRuleContext(0, SingleExpressionContext);
	}
	public Colon(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Colon, 0); }
	public Assign(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Assign, 0); }
	constructor(ctx: PropertyAssignmentContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterPropertyExpressionAssignment) {
			listener.enterPropertyExpressionAssignment(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitPropertyExpressionAssignment) {
			listener.exitPropertyExpressionAssignment(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitPropertyExpressionAssignment) {
			return visitor.visitPropertyExpressionAssignment(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class ComputedPropertyExpressionAssignmentContext extends PropertyAssignmentContext {
	public OpenBracket(): TerminalNode { return this.getToken(TypeScriptParser.OpenBracket, 0); }
	public singleExpression(): SingleExpressionContext[];
	public singleExpression(i: number): SingleExpressionContext;
	public singleExpression(i?: number): SingleExpressionContext | SingleExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(SingleExpressionContext);
		} else {
			return this.getRuleContext(i, SingleExpressionContext);
		}
	}
	public CloseBracket(): TerminalNode { return this.getToken(TypeScriptParser.CloseBracket, 0); }
	public Colon(): TerminalNode { return this.getToken(TypeScriptParser.Colon, 0); }
	constructor(ctx: PropertyAssignmentContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterComputedPropertyExpressionAssignment) {
			listener.enterComputedPropertyExpressionAssignment(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitComputedPropertyExpressionAssignment) {
			listener.exitComputedPropertyExpressionAssignment(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitComputedPropertyExpressionAssignment) {
			return visitor.visitComputedPropertyExpressionAssignment(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class PropertyGetterContext extends PropertyAssignmentContext {
	public getAccessor(): GetAccessorContext {
		return this.getRuleContext(0, GetAccessorContext);
	}
	constructor(ctx: PropertyAssignmentContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterPropertyGetter) {
			listener.enterPropertyGetter(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitPropertyGetter) {
			listener.exitPropertyGetter(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitPropertyGetter) {
			return visitor.visitPropertyGetter(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class PropertySetterContext extends PropertyAssignmentContext {
	public setAccessor(): SetAccessorContext {
		return this.getRuleContext(0, SetAccessorContext);
	}
	constructor(ctx: PropertyAssignmentContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterPropertySetter) {
			listener.enterPropertySetter(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitPropertySetter) {
			listener.exitPropertySetter(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitPropertySetter) {
			return visitor.visitPropertySetter(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class MethodPropertyContext extends PropertyAssignmentContext {
	public generatorMethod(): GeneratorMethodContext {
		return this.getRuleContext(0, GeneratorMethodContext);
	}
	constructor(ctx: PropertyAssignmentContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterMethodProperty) {
			listener.enterMethodProperty(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitMethodProperty) {
			listener.exitMethodProperty(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitMethodProperty) {
			return visitor.visitMethodProperty(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class PropertyShorthandContext extends PropertyAssignmentContext {
	public identifierOrKeyWord(): IdentifierOrKeyWordContext {
		return this.getRuleContext(0, IdentifierOrKeyWordContext);
	}
	constructor(ctx: PropertyAssignmentContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterPropertyShorthand) {
			listener.enterPropertyShorthand(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitPropertyShorthand) {
			listener.exitPropertyShorthand(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitPropertyShorthand) {
			return visitor.visitPropertyShorthand(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class RestParameterInObjectContext extends PropertyAssignmentContext {
	public restParameter(): RestParameterContext {
		return this.getRuleContext(0, RestParameterContext);
	}
	constructor(ctx: PropertyAssignmentContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterRestParameterInObject) {
			listener.enterRestParameterInObject(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitRestParameterInObject) {
			listener.exitRestParameterInObject(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitRestParameterInObject) {
			return visitor.visitRestParameterInObject(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class GetAccessorContext extends ParserRuleContext {
	public getter(): GetterContext {
		return this.getRuleContext(0, GetterContext);
	}
	public OpenParen(): TerminalNode { return this.getToken(TypeScriptParser.OpenParen, 0); }
	public CloseParen(): TerminalNode { return this.getToken(TypeScriptParser.CloseParen, 0); }
	public OpenBrace(): TerminalNode { return this.getToken(TypeScriptParser.OpenBrace, 0); }
	public functionBody(): FunctionBodyContext {
		return this.getRuleContext(0, FunctionBodyContext);
	}
	public CloseBrace(): TerminalNode { return this.getToken(TypeScriptParser.CloseBrace, 0); }
	public typeAnnotation(): TypeAnnotationContext | undefined {
		return this.tryGetRuleContext(0, TypeAnnotationContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_getAccessor; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterGetAccessor) {
			listener.enterGetAccessor(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitGetAccessor) {
			listener.exitGetAccessor(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitGetAccessor) {
			return visitor.visitGetAccessor(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class SetAccessorContext extends ParserRuleContext {
	public setter(): SetterContext {
		return this.getRuleContext(0, SetterContext);
	}
	public OpenParen(): TerminalNode { return this.getToken(TypeScriptParser.OpenParen, 0); }
	public CloseParen(): TerminalNode { return this.getToken(TypeScriptParser.CloseParen, 0); }
	public OpenBrace(): TerminalNode { return this.getToken(TypeScriptParser.OpenBrace, 0); }
	public functionBody(): FunctionBodyContext {
		return this.getRuleContext(0, FunctionBodyContext);
	}
	public CloseBrace(): TerminalNode { return this.getToken(TypeScriptParser.CloseBrace, 0); }
	public Identifier(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Identifier, 0); }
	public bindingPattern(): BindingPatternContext | undefined {
		return this.tryGetRuleContext(0, BindingPatternContext);
	}
	public typeAnnotation(): TypeAnnotationContext | undefined {
		return this.tryGetRuleContext(0, TypeAnnotationContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_setAccessor; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterSetAccessor) {
			listener.enterSetAccessor(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitSetAccessor) {
			listener.exitSetAccessor(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitSetAccessor) {
			return visitor.visitSetAccessor(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class PropertyNameContext extends ParserRuleContext {
	public identifierName(): IdentifierNameContext | undefined {
		return this.tryGetRuleContext(0, IdentifierNameContext);
	}
	public StringLiteral(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.StringLiteral, 0); }
	public numericLiteral(): NumericLiteralContext | undefined {
		return this.tryGetRuleContext(0, NumericLiteralContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_propertyName; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterPropertyName) {
			listener.enterPropertyName(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitPropertyName) {
			listener.exitPropertyName(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitPropertyName) {
			return visitor.visitPropertyName(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ArgumentsContext extends ParserRuleContext {
	public OpenParen(): TerminalNode { return this.getToken(TypeScriptParser.OpenParen, 0); }
	public CloseParen(): TerminalNode { return this.getToken(TypeScriptParser.CloseParen, 0); }
	public argumentList(): ArgumentListContext | undefined {
		return this.tryGetRuleContext(0, ArgumentListContext);
	}
	public Comma(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Comma, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_arguments; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterArguments) {
			listener.enterArguments(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitArguments) {
			listener.exitArguments(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitArguments) {
			return visitor.visitArguments(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ArgumentListContext extends ParserRuleContext {
	public argument(): ArgumentContext[];
	public argument(i: number): ArgumentContext;
	public argument(i?: number): ArgumentContext | ArgumentContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ArgumentContext);
		} else {
			return this.getRuleContext(i, ArgumentContext);
		}
	}
	public Comma(): TerminalNode[];
	public Comma(i: number): TerminalNode;
	public Comma(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(TypeScriptParser.Comma);
		} else {
			return this.getToken(TypeScriptParser.Comma, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_argumentList; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterArgumentList) {
			listener.enterArgumentList(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitArgumentList) {
			listener.exitArgumentList(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitArgumentList) {
			return visitor.visitArgumentList(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ArgumentContext extends ParserRuleContext {
	public singleExpression(): SingleExpressionContext | undefined {
		return this.tryGetRuleContext(0, SingleExpressionContext);
	}
	public Identifier(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Identifier, 0); }
	public Ellipsis(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Ellipsis, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_argument; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterArgument) {
			listener.enterArgument(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitArgument) {
			listener.exitArgument(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitArgument) {
			return visitor.visitArgument(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ExpressionSequenceContext extends ParserRuleContext {
	public singleExpression(): SingleExpressionContext[];
	public singleExpression(i: number): SingleExpressionContext;
	public singleExpression(i?: number): SingleExpressionContext | SingleExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(SingleExpressionContext);
		} else {
			return this.getRuleContext(i, SingleExpressionContext);
		}
	}
	public Comma(): TerminalNode[];
	public Comma(i: number): TerminalNode;
	public Comma(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(TypeScriptParser.Comma);
		} else {
			return this.getToken(TypeScriptParser.Comma, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_expressionSequence; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterExpressionSequence) {
			listener.enterExpressionSequence(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitExpressionSequence) {
			listener.exitExpressionSequence(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitExpressionSequence) {
			return visitor.visitExpressionSequence(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class FunctionExpressionDeclarationContext extends ParserRuleContext {
	public Function_(): TerminalNode { return this.getToken(TypeScriptParser.Function_, 0); }
	public OpenParen(): TerminalNode { return this.getToken(TypeScriptParser.OpenParen, 0); }
	public CloseParen(): TerminalNode { return this.getToken(TypeScriptParser.CloseParen, 0); }
	public OpenBrace(): TerminalNode { return this.getToken(TypeScriptParser.OpenBrace, 0); }
	public functionBody(): FunctionBodyContext {
		return this.getRuleContext(0, FunctionBodyContext);
	}
	public CloseBrace(): TerminalNode { return this.getToken(TypeScriptParser.CloseBrace, 0); }
	public Identifier(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Identifier, 0); }
	public formalParameterList(): FormalParameterListContext | undefined {
		return this.tryGetRuleContext(0, FormalParameterListContext);
	}
	public typeAnnotation(): TypeAnnotationContext | undefined {
		return this.tryGetRuleContext(0, TypeAnnotationContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_functionExpressionDeclaration; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterFunctionExpressionDeclaration) {
			listener.enterFunctionExpressionDeclaration(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitFunctionExpressionDeclaration) {
			listener.exitFunctionExpressionDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitFunctionExpressionDeclaration) {
			return visitor.visitFunctionExpressionDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class SingleExpressionContext extends ParserRuleContext {
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_singleExpression; }
	public copyFrom(ctx: SingleExpressionContext): void {
		super.copyFrom(ctx);
	}
}
export class FunctionExpressionContext extends SingleExpressionContext {
	public functionExpressionDeclaration(): FunctionExpressionDeclarationContext {
		return this.getRuleContext(0, FunctionExpressionDeclarationContext);
	}
	constructor(ctx: SingleExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterFunctionExpression) {
			listener.enterFunctionExpression(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitFunctionExpression) {
			listener.exitFunctionExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitFunctionExpression) {
			return visitor.visitFunctionExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class ArrowFunctionExpressionContext extends SingleExpressionContext {
	public arrowFunctionDeclaration(): ArrowFunctionDeclarationContext {
		return this.getRuleContext(0, ArrowFunctionDeclarationContext);
	}
	constructor(ctx: SingleExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterArrowFunctionExpression) {
			listener.enterArrowFunctionExpression(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitArrowFunctionExpression) {
			listener.exitArrowFunctionExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitArrowFunctionExpression) {
			return visitor.visitArrowFunctionExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class ClassExpressionContext extends SingleExpressionContext {
	public Class(): TerminalNode { return this.getToken(TypeScriptParser.Class, 0); }
	public classTail(): ClassTailContext {
		return this.getRuleContext(0, ClassTailContext);
	}
	public Identifier(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Identifier, 0); }
	constructor(ctx: SingleExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterClassExpression) {
			listener.enterClassExpression(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitClassExpression) {
			listener.exitClassExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitClassExpression) {
			return visitor.visitClassExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class MemberIndexExpressionContext extends SingleExpressionContext {
	public singleExpression(): SingleExpressionContext {
		return this.getRuleContext(0, SingleExpressionContext);
	}
	public OpenBracket(): TerminalNode { return this.getToken(TypeScriptParser.OpenBracket, 0); }
	public expressionSequence(): ExpressionSequenceContext {
		return this.getRuleContext(0, ExpressionSequenceContext);
	}
	public CloseBracket(): TerminalNode { return this.getToken(TypeScriptParser.CloseBracket, 0); }
	constructor(ctx: SingleExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterMemberIndexExpression) {
			listener.enterMemberIndexExpression(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitMemberIndexExpression) {
			listener.exitMemberIndexExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitMemberIndexExpression) {
			return visitor.visitMemberIndexExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class MemberDotExpressionContext extends SingleExpressionContext {
	public singleExpression(): SingleExpressionContext {
		return this.getRuleContext(0, SingleExpressionContext);
	}
	public Dot(): TerminalNode { return this.getToken(TypeScriptParser.Dot, 0); }
	public identifierName(): IdentifierNameContext {
		return this.getRuleContext(0, IdentifierNameContext);
	}
	public nestedTypeGeneric(): NestedTypeGenericContext | undefined {
		return this.tryGetRuleContext(0, NestedTypeGenericContext);
	}
	constructor(ctx: SingleExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterMemberDotExpression) {
			listener.enterMemberDotExpression(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitMemberDotExpression) {
			listener.exitMemberDotExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitMemberDotExpression) {
			return visitor.visitMemberDotExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class NewExpressionContext extends SingleExpressionContext {
	public New(): TerminalNode { return this.getToken(TypeScriptParser.New, 0); }
	public singleExpression(): SingleExpressionContext {
		return this.getRuleContext(0, SingleExpressionContext);
	}
	public arguments(): ArgumentsContext | undefined {
		return this.tryGetRuleContext(0, ArgumentsContext);
	}
	public typeArguments(): TypeArgumentsContext | undefined {
		return this.tryGetRuleContext(0, TypeArgumentsContext);
	}
	constructor(ctx: SingleExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterNewExpression) {
			listener.enterNewExpression(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitNewExpression) {
			listener.exitNewExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitNewExpression) {
			return visitor.visitNewExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class ArgumentsExpressionContext extends SingleExpressionContext {
	public singleExpression(): SingleExpressionContext {
		return this.getRuleContext(0, SingleExpressionContext);
	}
	public arguments(): ArgumentsContext {
		return this.getRuleContext(0, ArgumentsContext);
	}
	constructor(ctx: SingleExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterArgumentsExpression) {
			listener.enterArgumentsExpression(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitArgumentsExpression) {
			listener.exitArgumentsExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitArgumentsExpression) {
			return visitor.visitArgumentsExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class PostIncrementExpressionContext extends SingleExpressionContext {
	public singleExpression(): SingleExpressionContext {
		return this.getRuleContext(0, SingleExpressionContext);
	}
	public PlusPlus(): TerminalNode { return this.getToken(TypeScriptParser.PlusPlus, 0); }
	constructor(ctx: SingleExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterPostIncrementExpression) {
			listener.enterPostIncrementExpression(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitPostIncrementExpression) {
			listener.exitPostIncrementExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitPostIncrementExpression) {
			return visitor.visitPostIncrementExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class PostDecreaseExpressionContext extends SingleExpressionContext {
	public singleExpression(): SingleExpressionContext {
		return this.getRuleContext(0, SingleExpressionContext);
	}
	public MinusMinus(): TerminalNode { return this.getToken(TypeScriptParser.MinusMinus, 0); }
	constructor(ctx: SingleExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterPostDecreaseExpression) {
			listener.enterPostDecreaseExpression(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitPostDecreaseExpression) {
			listener.exitPostDecreaseExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitPostDecreaseExpression) {
			return visitor.visitPostDecreaseExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class DeleteExpressionContext extends SingleExpressionContext {
	public Delete(): TerminalNode { return this.getToken(TypeScriptParser.Delete, 0); }
	public singleExpression(): SingleExpressionContext {
		return this.getRuleContext(0, SingleExpressionContext);
	}
	constructor(ctx: SingleExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterDeleteExpression) {
			listener.enterDeleteExpression(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitDeleteExpression) {
			listener.exitDeleteExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitDeleteExpression) {
			return visitor.visitDeleteExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class VoidExpressionContext extends SingleExpressionContext {
	public Void(): TerminalNode { return this.getToken(TypeScriptParser.Void, 0); }
	public singleExpression(): SingleExpressionContext {
		return this.getRuleContext(0, SingleExpressionContext);
	}
	constructor(ctx: SingleExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterVoidExpression) {
			listener.enterVoidExpression(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitVoidExpression) {
			listener.exitVoidExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitVoidExpression) {
			return visitor.visitVoidExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class TypeofExpressionContext extends SingleExpressionContext {
	public Typeof(): TerminalNode { return this.getToken(TypeScriptParser.Typeof, 0); }
	public singleExpression(): SingleExpressionContext {
		return this.getRuleContext(0, SingleExpressionContext);
	}
	constructor(ctx: SingleExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterTypeofExpression) {
			listener.enterTypeofExpression(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitTypeofExpression) {
			listener.exitTypeofExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitTypeofExpression) {
			return visitor.visitTypeofExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class PreIncrementExpressionContext extends SingleExpressionContext {
	public PlusPlus(): TerminalNode { return this.getToken(TypeScriptParser.PlusPlus, 0); }
	public singleExpression(): SingleExpressionContext {
		return this.getRuleContext(0, SingleExpressionContext);
	}
	constructor(ctx: SingleExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterPreIncrementExpression) {
			listener.enterPreIncrementExpression(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitPreIncrementExpression) {
			listener.exitPreIncrementExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitPreIncrementExpression) {
			return visitor.visitPreIncrementExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class PreDecreaseExpressionContext extends SingleExpressionContext {
	public MinusMinus(): TerminalNode { return this.getToken(TypeScriptParser.MinusMinus, 0); }
	public singleExpression(): SingleExpressionContext {
		return this.getRuleContext(0, SingleExpressionContext);
	}
	constructor(ctx: SingleExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterPreDecreaseExpression) {
			listener.enterPreDecreaseExpression(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitPreDecreaseExpression) {
			listener.exitPreDecreaseExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitPreDecreaseExpression) {
			return visitor.visitPreDecreaseExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class UnaryPlusExpressionContext extends SingleExpressionContext {
	public Plus(): TerminalNode { return this.getToken(TypeScriptParser.Plus, 0); }
	public singleExpression(): SingleExpressionContext {
		return this.getRuleContext(0, SingleExpressionContext);
	}
	constructor(ctx: SingleExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterUnaryPlusExpression) {
			listener.enterUnaryPlusExpression(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitUnaryPlusExpression) {
			listener.exitUnaryPlusExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitUnaryPlusExpression) {
			return visitor.visitUnaryPlusExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class UnaryMinusExpressionContext extends SingleExpressionContext {
	public Minus(): TerminalNode { return this.getToken(TypeScriptParser.Minus, 0); }
	public singleExpression(): SingleExpressionContext {
		return this.getRuleContext(0, SingleExpressionContext);
	}
	constructor(ctx: SingleExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterUnaryMinusExpression) {
			listener.enterUnaryMinusExpression(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitUnaryMinusExpression) {
			listener.exitUnaryMinusExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitUnaryMinusExpression) {
			return visitor.visitUnaryMinusExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class BitNotExpressionContext extends SingleExpressionContext {
	public BitNot(): TerminalNode { return this.getToken(TypeScriptParser.BitNot, 0); }
	public singleExpression(): SingleExpressionContext {
		return this.getRuleContext(0, SingleExpressionContext);
	}
	constructor(ctx: SingleExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterBitNotExpression) {
			listener.enterBitNotExpression(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitBitNotExpression) {
			listener.exitBitNotExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitBitNotExpression) {
			return visitor.visitBitNotExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class NotExpressionContext extends SingleExpressionContext {
	public Not(): TerminalNode { return this.getToken(TypeScriptParser.Not, 0); }
	public singleExpression(): SingleExpressionContext {
		return this.getRuleContext(0, SingleExpressionContext);
	}
	constructor(ctx: SingleExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterNotExpression) {
			listener.enterNotExpression(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitNotExpression) {
			listener.exitNotExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitNotExpression) {
			return visitor.visitNotExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class MultiplicativeExpressionContext extends SingleExpressionContext {
	public singleExpression(): SingleExpressionContext[];
	public singleExpression(i: number): SingleExpressionContext;
	public singleExpression(i?: number): SingleExpressionContext | SingleExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(SingleExpressionContext);
		} else {
			return this.getRuleContext(i, SingleExpressionContext);
		}
	}
	public Multiply(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Multiply, 0); }
	public Divide(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Divide, 0); }
	public Modulus(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Modulus, 0); }
	constructor(ctx: SingleExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterMultiplicativeExpression) {
			listener.enterMultiplicativeExpression(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitMultiplicativeExpression) {
			listener.exitMultiplicativeExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitMultiplicativeExpression) {
			return visitor.visitMultiplicativeExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class AdditiveExpressionContext extends SingleExpressionContext {
	public singleExpression(): SingleExpressionContext[];
	public singleExpression(i: number): SingleExpressionContext;
	public singleExpression(i?: number): SingleExpressionContext | SingleExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(SingleExpressionContext);
		} else {
			return this.getRuleContext(i, SingleExpressionContext);
		}
	}
	public Plus(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Plus, 0); }
	public Minus(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Minus, 0); }
	constructor(ctx: SingleExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterAdditiveExpression) {
			listener.enterAdditiveExpression(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitAdditiveExpression) {
			listener.exitAdditiveExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitAdditiveExpression) {
			return visitor.visitAdditiveExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class BitShiftExpressionContext extends SingleExpressionContext {
	public singleExpression(): SingleExpressionContext[];
	public singleExpression(i: number): SingleExpressionContext;
	public singleExpression(i?: number): SingleExpressionContext | SingleExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(SingleExpressionContext);
		} else {
			return this.getRuleContext(i, SingleExpressionContext);
		}
	}
	public LeftShiftArithmetic(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.LeftShiftArithmetic, 0); }
	public RightShiftArithmetic(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.RightShiftArithmetic, 0); }
	public RightShiftLogical(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.RightShiftLogical, 0); }
	constructor(ctx: SingleExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterBitShiftExpression) {
			listener.enterBitShiftExpression(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitBitShiftExpression) {
			listener.exitBitShiftExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitBitShiftExpression) {
			return visitor.visitBitShiftExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class RelationalExpressionContext extends SingleExpressionContext {
	public singleExpression(): SingleExpressionContext[];
	public singleExpression(i: number): SingleExpressionContext;
	public singleExpression(i?: number): SingleExpressionContext | SingleExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(SingleExpressionContext);
		} else {
			return this.getRuleContext(i, SingleExpressionContext);
		}
	}
	public LessThan(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.LessThan, 0); }
	public MoreThan(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.MoreThan, 0); }
	public LessThanEquals(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.LessThanEquals, 0); }
	public GreaterThanEquals(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.GreaterThanEquals, 0); }
	constructor(ctx: SingleExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterRelationalExpression) {
			listener.enterRelationalExpression(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitRelationalExpression) {
			listener.exitRelationalExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitRelationalExpression) {
			return visitor.visitRelationalExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class InstanceofExpressionContext extends SingleExpressionContext {
	public singleExpression(): SingleExpressionContext[];
	public singleExpression(i: number): SingleExpressionContext;
	public singleExpression(i?: number): SingleExpressionContext | SingleExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(SingleExpressionContext);
		} else {
			return this.getRuleContext(i, SingleExpressionContext);
		}
	}
	public Instanceof(): TerminalNode { return this.getToken(TypeScriptParser.Instanceof, 0); }
	constructor(ctx: SingleExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterInstanceofExpression) {
			listener.enterInstanceofExpression(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitInstanceofExpression) {
			listener.exitInstanceofExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitInstanceofExpression) {
			return visitor.visitInstanceofExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class InExpressionContext extends SingleExpressionContext {
	public singleExpression(): SingleExpressionContext[];
	public singleExpression(i: number): SingleExpressionContext;
	public singleExpression(i?: number): SingleExpressionContext | SingleExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(SingleExpressionContext);
		} else {
			return this.getRuleContext(i, SingleExpressionContext);
		}
	}
	public In(): TerminalNode { return this.getToken(TypeScriptParser.In, 0); }
	constructor(ctx: SingleExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterInExpression) {
			listener.enterInExpression(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitInExpression) {
			listener.exitInExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitInExpression) {
			return visitor.visitInExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class EqualityExpressionContext extends SingleExpressionContext {
	public singleExpression(): SingleExpressionContext[];
	public singleExpression(i: number): SingleExpressionContext;
	public singleExpression(i?: number): SingleExpressionContext | SingleExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(SingleExpressionContext);
		} else {
			return this.getRuleContext(i, SingleExpressionContext);
		}
	}
	public Equals_(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Equals_, 0); }
	public NotEquals(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.NotEquals, 0); }
	public IdentityEquals(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.IdentityEquals, 0); }
	public IdentityNotEquals(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.IdentityNotEquals, 0); }
	constructor(ctx: SingleExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterEqualityExpression) {
			listener.enterEqualityExpression(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitEqualityExpression) {
			listener.exitEqualityExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitEqualityExpression) {
			return visitor.visitEqualityExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class BitAndExpressionContext extends SingleExpressionContext {
	public singleExpression(): SingleExpressionContext[];
	public singleExpression(i: number): SingleExpressionContext;
	public singleExpression(i?: number): SingleExpressionContext | SingleExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(SingleExpressionContext);
		} else {
			return this.getRuleContext(i, SingleExpressionContext);
		}
	}
	public BitAnd(): TerminalNode { return this.getToken(TypeScriptParser.BitAnd, 0); }
	constructor(ctx: SingleExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterBitAndExpression) {
			listener.enterBitAndExpression(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitBitAndExpression) {
			listener.exitBitAndExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitBitAndExpression) {
			return visitor.visitBitAndExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class BitXOrExpressionContext extends SingleExpressionContext {
	public singleExpression(): SingleExpressionContext[];
	public singleExpression(i: number): SingleExpressionContext;
	public singleExpression(i?: number): SingleExpressionContext | SingleExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(SingleExpressionContext);
		} else {
			return this.getRuleContext(i, SingleExpressionContext);
		}
	}
	public BitXOr(): TerminalNode { return this.getToken(TypeScriptParser.BitXOr, 0); }
	constructor(ctx: SingleExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterBitXOrExpression) {
			listener.enterBitXOrExpression(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitBitXOrExpression) {
			listener.exitBitXOrExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitBitXOrExpression) {
			return visitor.visitBitXOrExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class BitOrExpressionContext extends SingleExpressionContext {
	public singleExpression(): SingleExpressionContext[];
	public singleExpression(i: number): SingleExpressionContext;
	public singleExpression(i?: number): SingleExpressionContext | SingleExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(SingleExpressionContext);
		} else {
			return this.getRuleContext(i, SingleExpressionContext);
		}
	}
	public BitOr(): TerminalNode { return this.getToken(TypeScriptParser.BitOr, 0); }
	constructor(ctx: SingleExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterBitOrExpression) {
			listener.enterBitOrExpression(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitBitOrExpression) {
			listener.exitBitOrExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitBitOrExpression) {
			return visitor.visitBitOrExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class LogicalAndExpressionContext extends SingleExpressionContext {
	public singleExpression(): SingleExpressionContext[];
	public singleExpression(i: number): SingleExpressionContext;
	public singleExpression(i?: number): SingleExpressionContext | SingleExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(SingleExpressionContext);
		} else {
			return this.getRuleContext(i, SingleExpressionContext);
		}
	}
	public And(): TerminalNode { return this.getToken(TypeScriptParser.And, 0); }
	constructor(ctx: SingleExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterLogicalAndExpression) {
			listener.enterLogicalAndExpression(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitLogicalAndExpression) {
			listener.exitLogicalAndExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitLogicalAndExpression) {
			return visitor.visitLogicalAndExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class LogicalOrExpressionContext extends SingleExpressionContext {
	public singleExpression(): SingleExpressionContext[];
	public singleExpression(i: number): SingleExpressionContext;
	public singleExpression(i?: number): SingleExpressionContext | SingleExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(SingleExpressionContext);
		} else {
			return this.getRuleContext(i, SingleExpressionContext);
		}
	}
	public Or(): TerminalNode { return this.getToken(TypeScriptParser.Or, 0); }
	constructor(ctx: SingleExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterLogicalOrExpression) {
			listener.enterLogicalOrExpression(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitLogicalOrExpression) {
			listener.exitLogicalOrExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitLogicalOrExpression) {
			return visitor.visitLogicalOrExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class TernaryExpressionContext extends SingleExpressionContext {
	public singleExpression(): SingleExpressionContext[];
	public singleExpression(i: number): SingleExpressionContext;
	public singleExpression(i?: number): SingleExpressionContext | SingleExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(SingleExpressionContext);
		} else {
			return this.getRuleContext(i, SingleExpressionContext);
		}
	}
	public QuestionMark(): TerminalNode { return this.getToken(TypeScriptParser.QuestionMark, 0); }
	public Colon(): TerminalNode { return this.getToken(TypeScriptParser.Colon, 0); }
	constructor(ctx: SingleExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterTernaryExpression) {
			listener.enterTernaryExpression(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitTernaryExpression) {
			listener.exitTernaryExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitTernaryExpression) {
			return visitor.visitTernaryExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class AssignmentExpressionContext extends SingleExpressionContext {
	public singleExpression(): SingleExpressionContext[];
	public singleExpression(i: number): SingleExpressionContext;
	public singleExpression(i?: number): SingleExpressionContext | SingleExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(SingleExpressionContext);
		} else {
			return this.getRuleContext(i, SingleExpressionContext);
		}
	}
	public Assign(): TerminalNode { return this.getToken(TypeScriptParser.Assign, 0); }
	constructor(ctx: SingleExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterAssignmentExpression) {
			listener.enterAssignmentExpression(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitAssignmentExpression) {
			listener.exitAssignmentExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitAssignmentExpression) {
			return visitor.visitAssignmentExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class AssignmentOperatorExpressionContext extends SingleExpressionContext {
	public singleExpression(): SingleExpressionContext[];
	public singleExpression(i: number): SingleExpressionContext;
	public singleExpression(i?: number): SingleExpressionContext | SingleExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(SingleExpressionContext);
		} else {
			return this.getRuleContext(i, SingleExpressionContext);
		}
	}
	public assignmentOperator(): AssignmentOperatorContext {
		return this.getRuleContext(0, AssignmentOperatorContext);
	}
	constructor(ctx: SingleExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterAssignmentOperatorExpression) {
			listener.enterAssignmentOperatorExpression(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitAssignmentOperatorExpression) {
			listener.exitAssignmentOperatorExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitAssignmentOperatorExpression) {
			return visitor.visitAssignmentOperatorExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class TemplateStringExpressionContext extends SingleExpressionContext {
	public singleExpression(): SingleExpressionContext {
		return this.getRuleContext(0, SingleExpressionContext);
	}
	public templateStringLiteral(): TemplateStringLiteralContext {
		return this.getRuleContext(0, TemplateStringLiteralContext);
	}
	constructor(ctx: SingleExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterTemplateStringExpression) {
			listener.enterTemplateStringExpression(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitTemplateStringExpression) {
			listener.exitTemplateStringExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitTemplateStringExpression) {
			return visitor.visitTemplateStringExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class IteratorsExpressionContext extends SingleExpressionContext {
	public iteratorBlock(): IteratorBlockContext {
		return this.getRuleContext(0, IteratorBlockContext);
	}
	constructor(ctx: SingleExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterIteratorsExpression) {
			listener.enterIteratorsExpression(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitIteratorsExpression) {
			listener.exitIteratorsExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitIteratorsExpression) {
			return visitor.visitIteratorsExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class GeneratorsExpressionContext extends SingleExpressionContext {
	public generatorBlock(): GeneratorBlockContext {
		return this.getRuleContext(0, GeneratorBlockContext);
	}
	constructor(ctx: SingleExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterGeneratorsExpression) {
			listener.enterGeneratorsExpression(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitGeneratorsExpression) {
			listener.exitGeneratorsExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitGeneratorsExpression) {
			return visitor.visitGeneratorsExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class GeneratorsFunctionExpressionContext extends SingleExpressionContext {
	public generatorFunctionDeclaration(): GeneratorFunctionDeclarationContext {
		return this.getRuleContext(0, GeneratorFunctionDeclarationContext);
	}
	constructor(ctx: SingleExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterGeneratorsFunctionExpression) {
			listener.enterGeneratorsFunctionExpression(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitGeneratorsFunctionExpression) {
			listener.exitGeneratorsFunctionExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitGeneratorsFunctionExpression) {
			return visitor.visitGeneratorsFunctionExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class YieldExpressionContext extends SingleExpressionContext {
	public yieldStatement(): YieldStatementContext {
		return this.getRuleContext(0, YieldStatementContext);
	}
	constructor(ctx: SingleExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterYieldExpression) {
			listener.enterYieldExpression(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitYieldExpression) {
			listener.exitYieldExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitYieldExpression) {
			return visitor.visitYieldExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class ThisExpressionContext extends SingleExpressionContext {
	public This(): TerminalNode { return this.getToken(TypeScriptParser.This, 0); }
	constructor(ctx: SingleExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterThisExpression) {
			listener.enterThisExpression(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitThisExpression) {
			listener.exitThisExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitThisExpression) {
			return visitor.visitThisExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class IdentifierExpressionContext extends SingleExpressionContext {
	public identifierName(): IdentifierNameContext {
		return this.getRuleContext(0, IdentifierNameContext);
	}
	public singleExpression(): SingleExpressionContext | undefined {
		return this.tryGetRuleContext(0, SingleExpressionContext);
	}
	constructor(ctx: SingleExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterIdentifierExpression) {
			listener.enterIdentifierExpression(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitIdentifierExpression) {
			listener.exitIdentifierExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitIdentifierExpression) {
			return visitor.visitIdentifierExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class SuperExpressionContext extends SingleExpressionContext {
	public Super(): TerminalNode { return this.getToken(TypeScriptParser.Super, 0); }
	constructor(ctx: SingleExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterSuperExpression) {
			listener.enterSuperExpression(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitSuperExpression) {
			listener.exitSuperExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitSuperExpression) {
			return visitor.visitSuperExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class LiteralExpressionContext extends SingleExpressionContext {
	public literal(): LiteralContext {
		return this.getRuleContext(0, LiteralContext);
	}
	constructor(ctx: SingleExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterLiteralExpression) {
			listener.enterLiteralExpression(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitLiteralExpression) {
			listener.exitLiteralExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitLiteralExpression) {
			return visitor.visitLiteralExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class ArrayLiteralExpressionContext extends SingleExpressionContext {
	public arrayLiteral(): ArrayLiteralContext {
		return this.getRuleContext(0, ArrayLiteralContext);
	}
	constructor(ctx: SingleExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterArrayLiteralExpression) {
			listener.enterArrayLiteralExpression(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitArrayLiteralExpression) {
			listener.exitArrayLiteralExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitArrayLiteralExpression) {
			return visitor.visitArrayLiteralExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class ObjectLiteralExpressionContext extends SingleExpressionContext {
	public objectLiteral(): ObjectLiteralContext {
		return this.getRuleContext(0, ObjectLiteralContext);
	}
	constructor(ctx: SingleExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterObjectLiteralExpression) {
			listener.enterObjectLiteralExpression(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitObjectLiteralExpression) {
			listener.exitObjectLiteralExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitObjectLiteralExpression) {
			return visitor.visitObjectLiteralExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class ParenthesizedExpressionContext extends SingleExpressionContext {
	public OpenParen(): TerminalNode { return this.getToken(TypeScriptParser.OpenParen, 0); }
	public expressionSequence(): ExpressionSequenceContext {
		return this.getRuleContext(0, ExpressionSequenceContext);
	}
	public CloseParen(): TerminalNode { return this.getToken(TypeScriptParser.CloseParen, 0); }
	constructor(ctx: SingleExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterParenthesizedExpression) {
			listener.enterParenthesizedExpression(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitParenthesizedExpression) {
			listener.exitParenthesizedExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitParenthesizedExpression) {
			return visitor.visitParenthesizedExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class GenericTypesContext extends SingleExpressionContext {
	public typeArguments(): TypeArgumentsContext {
		return this.getRuleContext(0, TypeArgumentsContext);
	}
	public expressionSequence(): ExpressionSequenceContext | undefined {
		return this.tryGetRuleContext(0, ExpressionSequenceContext);
	}
	constructor(ctx: SingleExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterGenericTypes) {
			listener.enterGenericTypes(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitGenericTypes) {
			listener.exitGenericTypes(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitGenericTypes) {
			return visitor.visitGenericTypes(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class CastAsExpressionContext extends SingleExpressionContext {
	public singleExpression(): SingleExpressionContext {
		return this.getRuleContext(0, SingleExpressionContext);
	}
	public As(): TerminalNode { return this.getToken(TypeScriptParser.As, 0); }
	public asExpression(): AsExpressionContext {
		return this.getRuleContext(0, AsExpressionContext);
	}
	constructor(ctx: SingleExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterCastAsExpression) {
			listener.enterCastAsExpression(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitCastAsExpression) {
			listener.exitCastAsExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitCastAsExpression) {
			return visitor.visitCastAsExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class AsExpressionContext extends ParserRuleContext {
	public predefinedType(): PredefinedTypeContext | undefined {
		return this.tryGetRuleContext(0, PredefinedTypeContext);
	}
	public OpenBracket(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.OpenBracket, 0); }
	public CloseBracket(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.CloseBracket, 0); }
	public singleExpression(): SingleExpressionContext | undefined {
		return this.tryGetRuleContext(0, SingleExpressionContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_asExpression; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterAsExpression) {
			listener.enterAsExpression(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitAsExpression) {
			listener.exitAsExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitAsExpression) {
			return visitor.visitAsExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ArrowFunctionDeclarationContext extends ParserRuleContext {
	public arrowFunctionParameters(): ArrowFunctionParametersContext {
		return this.getRuleContext(0, ArrowFunctionParametersContext);
	}
	public ARROW(): TerminalNode { return this.getToken(TypeScriptParser.ARROW, 0); }
	public arrowFunctionBody(): ArrowFunctionBodyContext {
		return this.getRuleContext(0, ArrowFunctionBodyContext);
	}
	public Async(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Async, 0); }
	public typeAnnotation(): TypeAnnotationContext | undefined {
		return this.tryGetRuleContext(0, TypeAnnotationContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_arrowFunctionDeclaration; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterArrowFunctionDeclaration) {
			listener.enterArrowFunctionDeclaration(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitArrowFunctionDeclaration) {
			listener.exitArrowFunctionDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitArrowFunctionDeclaration) {
			return visitor.visitArrowFunctionDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ArrowFunctionParametersContext extends ParserRuleContext {
	public Identifier(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Identifier, 0); }
	public OpenParen(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.OpenParen, 0); }
	public CloseParen(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.CloseParen, 0); }
	public formalParameterList(): FormalParameterListContext | undefined {
		return this.tryGetRuleContext(0, FormalParameterListContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_arrowFunctionParameters; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterArrowFunctionParameters) {
			listener.enterArrowFunctionParameters(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitArrowFunctionParameters) {
			listener.exitArrowFunctionParameters(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitArrowFunctionParameters) {
			return visitor.visitArrowFunctionParameters(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ArrowFunctionBodyContext extends ParserRuleContext {
	public singleExpression(): SingleExpressionContext | undefined {
		return this.tryGetRuleContext(0, SingleExpressionContext);
	}
	public OpenBrace(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.OpenBrace, 0); }
	public functionBody(): FunctionBodyContext | undefined {
		return this.tryGetRuleContext(0, FunctionBodyContext);
	}
	public CloseBrace(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.CloseBrace, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_arrowFunctionBody; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterArrowFunctionBody) {
			listener.enterArrowFunctionBody(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitArrowFunctionBody) {
			listener.exitArrowFunctionBody(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitArrowFunctionBody) {
			return visitor.visitArrowFunctionBody(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class AssignmentOperatorContext extends ParserRuleContext {
	public MultiplyAssign(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.MultiplyAssign, 0); }
	public DivideAssign(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.DivideAssign, 0); }
	public ModulusAssign(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.ModulusAssign, 0); }
	public PlusAssign(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.PlusAssign, 0); }
	public MinusAssign(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.MinusAssign, 0); }
	public LeftShiftArithmeticAssign(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.LeftShiftArithmeticAssign, 0); }
	public RightShiftArithmeticAssign(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.RightShiftArithmeticAssign, 0); }
	public RightShiftLogicalAssign(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.RightShiftLogicalAssign, 0); }
	public BitAndAssign(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.BitAndAssign, 0); }
	public BitXorAssign(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.BitXorAssign, 0); }
	public BitOrAssign(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.BitOrAssign, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_assignmentOperator; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterAssignmentOperator) {
			listener.enterAssignmentOperator(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitAssignmentOperator) {
			listener.exitAssignmentOperator(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitAssignmentOperator) {
			return visitor.visitAssignmentOperator(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class LiteralContext extends ParserRuleContext {
	public NullLiteral(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.NullLiteral, 0); }
	public BooleanLiteral(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.BooleanLiteral, 0); }
	public StringLiteral(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.StringLiteral, 0); }
	public templateStringLiteral(): TemplateStringLiteralContext | undefined {
		return this.tryGetRuleContext(0, TemplateStringLiteralContext);
	}
	public RegularExpressionLiteral(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.RegularExpressionLiteral, 0); }
	public numericLiteral(): NumericLiteralContext | undefined {
		return this.tryGetRuleContext(0, NumericLiteralContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_literal; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterLiteral) {
			listener.enterLiteral(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitLiteral) {
			listener.exitLiteral(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitLiteral) {
			return visitor.visitLiteral(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TemplateStringLiteralContext extends ParserRuleContext {
	public BackTick(): TerminalNode[];
	public BackTick(i: number): TerminalNode;
	public BackTick(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(TypeScriptParser.BackTick);
		} else {
			return this.getToken(TypeScriptParser.BackTick, i);
		}
	}
	public templateStringAtom(): TemplateStringAtomContext[];
	public templateStringAtom(i: number): TemplateStringAtomContext;
	public templateStringAtom(i?: number): TemplateStringAtomContext | TemplateStringAtomContext[] {
		if (i === undefined) {
			return this.getRuleContexts(TemplateStringAtomContext);
		} else {
			return this.getRuleContext(i, TemplateStringAtomContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_templateStringLiteral; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterTemplateStringLiteral) {
			listener.enterTemplateStringLiteral(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitTemplateStringLiteral) {
			listener.exitTemplateStringLiteral(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitTemplateStringLiteral) {
			return visitor.visitTemplateStringLiteral(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TemplateStringAtomContext extends ParserRuleContext {
	public TemplateStringAtom(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.TemplateStringAtom, 0); }
	public TemplateStringStartExpression(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.TemplateStringStartExpression, 0); }
	public singleExpression(): SingleExpressionContext | undefined {
		return this.tryGetRuleContext(0, SingleExpressionContext);
	}
	public TemplateCloseBrace(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.TemplateCloseBrace, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_templateStringAtom; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterTemplateStringAtom) {
			listener.enterTemplateStringAtom(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitTemplateStringAtom) {
			listener.exitTemplateStringAtom(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitTemplateStringAtom) {
			return visitor.visitTemplateStringAtom(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class NumericLiteralContext extends ParserRuleContext {
	public DecimalLiteral(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.DecimalLiteral, 0); }
	public HexIntegerLiteral(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.HexIntegerLiteral, 0); }
	public OctalIntegerLiteral(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.OctalIntegerLiteral, 0); }
	public OctalIntegerLiteral2(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.OctalIntegerLiteral2, 0); }
	public BinaryIntegerLiteral(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.BinaryIntegerLiteral, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_numericLiteral; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterNumericLiteral) {
			listener.enterNumericLiteral(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitNumericLiteral) {
			listener.exitNumericLiteral(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitNumericLiteral) {
			return visitor.visitNumericLiteral(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class IdentifierNameContext extends ParserRuleContext {
	public Identifier(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Identifier, 0); }
	public reservedWord(): ReservedWordContext | undefined {
		return this.tryGetRuleContext(0, ReservedWordContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_identifierName; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterIdentifierName) {
			listener.enterIdentifierName(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitIdentifierName) {
			listener.exitIdentifierName(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitIdentifierName) {
			return visitor.visitIdentifierName(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class IdentifierOrKeyWordContext extends ParserRuleContext {
	public Identifier(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Identifier, 0); }
	public TypeAlias(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.TypeAlias, 0); }
	public Require(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Require, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_identifierOrKeyWord; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterIdentifierOrKeyWord) {
			listener.enterIdentifierOrKeyWord(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitIdentifierOrKeyWord) {
			listener.exitIdentifierOrKeyWord(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitIdentifierOrKeyWord) {
			return visitor.visitIdentifierOrKeyWord(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ReservedWordContext extends ParserRuleContext {
	public keyword(): KeywordContext | undefined {
		return this.tryGetRuleContext(0, KeywordContext);
	}
	public NullLiteral(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.NullLiteral, 0); }
	public BooleanLiteral(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.BooleanLiteral, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_reservedWord; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterReservedWord) {
			listener.enterReservedWord(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitReservedWord) {
			listener.exitReservedWord(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitReservedWord) {
			return visitor.visitReservedWord(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class KeywordContext extends ParserRuleContext {
	public Break(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Break, 0); }
	public Do(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Do, 0); }
	public Instanceof(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Instanceof, 0); }
	public Typeof(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Typeof, 0); }
	public Case(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Case, 0); }
	public Else(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Else, 0); }
	public New(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.New, 0); }
	public Var(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Var, 0); }
	public Catch(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Catch, 0); }
	public Finally(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Finally, 0); }
	public Return(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Return, 0); }
	public Void(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Void, 0); }
	public Continue(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Continue, 0); }
	public For(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.For, 0); }
	public Switch(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Switch, 0); }
	public While(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.While, 0); }
	public Debugger(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Debugger, 0); }
	public Function_(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Function_, 0); }
	public This(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.This, 0); }
	public With(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.With, 0); }
	public Default(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Default, 0); }
	public If(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.If, 0); }
	public Throw(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Throw, 0); }
	public Delete(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Delete, 0); }
	public In(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.In, 0); }
	public Try(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Try, 0); }
	public ReadOnly(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.ReadOnly, 0); }
	public Async(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Async, 0); }
	public From(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.From, 0); }
	public Class(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Class, 0); }
	public Enum(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Enum, 0); }
	public Extends(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Extends, 0); }
	public Super(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Super, 0); }
	public Const(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Const, 0); }
	public Export(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Export, 0); }
	public Import(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Import, 0); }
	public Implements(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Implements, 0); }
	public Let(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Let, 0); }
	public Private(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Private, 0); }
	public Public(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Public, 0); }
	public Interface(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Interface, 0); }
	public Package(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Package, 0); }
	public Protected(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Protected, 0); }
	public Static(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Static, 0); }
	public Yield(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Yield, 0); }
	public Get(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Get, 0); }
	public Set(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Set, 0); }
	public Require(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.Require, 0); }
	public TypeAlias(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.TypeAlias, 0); }
	public String(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.String, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_keyword; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterKeyword) {
			listener.enterKeyword(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitKeyword) {
			listener.exitKeyword(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitKeyword) {
			return visitor.visitKeyword(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class GetterContext extends ParserRuleContext {
	public Get(): TerminalNode { return this.getToken(TypeScriptParser.Get, 0); }
	public propertyName(): PropertyNameContext {
		return this.getRuleContext(0, PropertyNameContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_getter; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterGetter) {
			listener.enterGetter(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitGetter) {
			listener.exitGetter(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitGetter) {
			return visitor.visitGetter(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class SetterContext extends ParserRuleContext {
	public Set(): TerminalNode { return this.getToken(TypeScriptParser.Set, 0); }
	public propertyName(): PropertyNameContext {
		return this.getRuleContext(0, PropertyNameContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_setter; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterSetter) {
			listener.enterSetter(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitSetter) {
			listener.exitSetter(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitSetter) {
			return visitor.visitSetter(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class EosContext extends ParserRuleContext {
	public SemiColon(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.SemiColon, 0); }
	public EOF(): TerminalNode | undefined { return this.tryGetToken(TypeScriptParser.EOF, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TypeScriptParser.RULE_eos; }
	// @Override
	public enterRule(listener: TypeScriptParserListener): void {
		if (listener.enterEos) {
			listener.enterEos(this);
		}
	}
	// @Override
	public exitRule(listener: TypeScriptParserListener): void {
		if (listener.exitEos) {
			listener.exitEos(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TypeScriptParserVisitor<Result>): Result {
		if (visitor.visitEos) {
			return visitor.visitEos(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


