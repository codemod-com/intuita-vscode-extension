// Generated from /gppd/intuita/intuita-vscode-extension/src/antlrTypeScript/lexer/TypeScriptParser.g4 by ANTLR 4.9.0-SNAPSHOT


import { ParseTreeListener } from "antlr4ts/tree/ParseTreeListener";

import { ParenthesizedPrimTypeContext } from "./TypeScriptParser";
import { PredefinedPrimTypeContext } from "./TypeScriptParser";
import { ReferencePrimTypeContext } from "./TypeScriptParser";
import { ObjectPrimTypeContext } from "./TypeScriptParser";
import { ArrayPrimTypeContext } from "./TypeScriptParser";
import { TuplePrimTypeContext } from "./TypeScriptParser";
import { QueryPrimTypeContext } from "./TypeScriptParser";
import { ThisPrimTypeContext } from "./TypeScriptParser";
import { RedefinitionOfTypeContext } from "./TypeScriptParser";
import { DoStatementContext } from "./TypeScriptParser";
import { WhileStatementContext } from "./TypeScriptParser";
import { ForStatementContext } from "./TypeScriptParser";
import { ForVarStatementContext } from "./TypeScriptParser";
import { ForInStatementContext } from "./TypeScriptParser";
import { ForVarInStatementContext } from "./TypeScriptParser";
import { FunctionExpressionContext } from "./TypeScriptParser";
import { ArrowFunctionExpressionContext } from "./TypeScriptParser";
import { ClassExpressionContext } from "./TypeScriptParser";
import { MemberIndexExpressionContext } from "./TypeScriptParser";
import { MemberDotExpressionContext } from "./TypeScriptParser";
import { NewExpressionContext } from "./TypeScriptParser";
import { ArgumentsExpressionContext } from "./TypeScriptParser";
import { PostIncrementExpressionContext } from "./TypeScriptParser";
import { PostDecreaseExpressionContext } from "./TypeScriptParser";
import { DeleteExpressionContext } from "./TypeScriptParser";
import { VoidExpressionContext } from "./TypeScriptParser";
import { TypeofExpressionContext } from "./TypeScriptParser";
import { PreIncrementExpressionContext } from "./TypeScriptParser";
import { PreDecreaseExpressionContext } from "./TypeScriptParser";
import { UnaryPlusExpressionContext } from "./TypeScriptParser";
import { UnaryMinusExpressionContext } from "./TypeScriptParser";
import { BitNotExpressionContext } from "./TypeScriptParser";
import { NotExpressionContext } from "./TypeScriptParser";
import { MultiplicativeExpressionContext } from "./TypeScriptParser";
import { AdditiveExpressionContext } from "./TypeScriptParser";
import { BitShiftExpressionContext } from "./TypeScriptParser";
import { RelationalExpressionContext } from "./TypeScriptParser";
import { InstanceofExpressionContext } from "./TypeScriptParser";
import { InExpressionContext } from "./TypeScriptParser";
import { EqualityExpressionContext } from "./TypeScriptParser";
import { BitAndExpressionContext } from "./TypeScriptParser";
import { BitXOrExpressionContext } from "./TypeScriptParser";
import { BitOrExpressionContext } from "./TypeScriptParser";
import { LogicalAndExpressionContext } from "./TypeScriptParser";
import { LogicalOrExpressionContext } from "./TypeScriptParser";
import { TernaryExpressionContext } from "./TypeScriptParser";
import { AssignmentExpressionContext } from "./TypeScriptParser";
import { AssignmentOperatorExpressionContext } from "./TypeScriptParser";
import { TemplateStringExpressionContext } from "./TypeScriptParser";
import { IteratorsExpressionContext } from "./TypeScriptParser";
import { GeneratorsExpressionContext } from "./TypeScriptParser";
import { GeneratorsFunctionExpressionContext } from "./TypeScriptParser";
import { YieldExpressionContext } from "./TypeScriptParser";
import { ThisExpressionContext } from "./TypeScriptParser";
import { IdentifierExpressionContext } from "./TypeScriptParser";
import { SuperExpressionContext } from "./TypeScriptParser";
import { LiteralExpressionContext } from "./TypeScriptParser";
import { ArrayLiteralExpressionContext } from "./TypeScriptParser";
import { ObjectLiteralExpressionContext } from "./TypeScriptParser";
import { ParenthesizedExpressionContext } from "./TypeScriptParser";
import { GenericTypesContext } from "./TypeScriptParser";
import { CastAsExpressionContext } from "./TypeScriptParser";
import { PropertyDeclarationExpressionContext } from "./TypeScriptParser";
import { MethodDeclarationExpressionContext } from "./TypeScriptParser";
import { GetterSetterDeclarationExpressionContext } from "./TypeScriptParser";
import { AbstractMemberDeclarationContext } from "./TypeScriptParser";
import { PropertyExpressionAssignmentContext } from "./TypeScriptParser";
import { ComputedPropertyExpressionAssignmentContext } from "./TypeScriptParser";
import { PropertyGetterContext } from "./TypeScriptParser";
import { PropertySetterContext } from "./TypeScriptParser";
import { MethodPropertyContext } from "./TypeScriptParser";
import { PropertyShorthandContext } from "./TypeScriptParser";
import { RestParameterInObjectContext } from "./TypeScriptParser";
import { UnionContext } from "./TypeScriptParser";
import { IntersectionContext } from "./TypeScriptParser";
import { PrimaryContext } from "./TypeScriptParser";
import { InitializerContext } from "./TypeScriptParser";
import { BindingPatternContext } from "./TypeScriptParser";
import { TypeParametersContext } from "./TypeScriptParser";
import { TypeParameterListContext } from "./TypeScriptParser";
import { TypeParameterContext } from "./TypeScriptParser";
import { ConstraintContext } from "./TypeScriptParser";
import { TypeArgumentsContext } from "./TypeScriptParser";
import { TypeArgumentListContext } from "./TypeScriptParser";
import { TypeArgumentContext } from "./TypeScriptParser";
import { Type_Context } from "./TypeScriptParser";
import { UnionOrIntersectionOrPrimaryTypeContext } from "./TypeScriptParser";
import { PrimaryTypeContext } from "./TypeScriptParser";
import { PredefinedTypeContext } from "./TypeScriptParser";
import { TypeReferenceContext } from "./TypeScriptParser";
import { NestedTypeGenericContext } from "./TypeScriptParser";
import { TypeGenericContext } from "./TypeScriptParser";
import { TypeIncludeGenericContext } from "./TypeScriptParser";
import { TypeNameContext } from "./TypeScriptParser";
import { ObjectTypeContext } from "./TypeScriptParser";
import { TypeBodyContext } from "./TypeScriptParser";
import { TypeMemberListContext } from "./TypeScriptParser";
import { TypeMemberContext } from "./TypeScriptParser";
import { ArrayTypeContext } from "./TypeScriptParser";
import { TupleTypeContext } from "./TypeScriptParser";
import { TupleElementTypesContext } from "./TypeScriptParser";
import { FunctionTypeContext } from "./TypeScriptParser";
import { ConstructorTypeContext } from "./TypeScriptParser";
import { TypeQueryContext } from "./TypeScriptParser";
import { TypeQueryExpressionContext } from "./TypeScriptParser";
import { PropertySignaturContext } from "./TypeScriptParser";
import { TypeAnnotationContext } from "./TypeScriptParser";
import { CallSignatureContext } from "./TypeScriptParser";
import { ParameterListContext } from "./TypeScriptParser";
import { RequiredParameterListContext } from "./TypeScriptParser";
import { ParameterContext } from "./TypeScriptParser";
import { OptionalParameterContext } from "./TypeScriptParser";
import { RestParameterContext } from "./TypeScriptParser";
import { RequiredParameterContext } from "./TypeScriptParser";
import { AccessibilityModifierContext } from "./TypeScriptParser";
import { IdentifierOrPatternContext } from "./TypeScriptParser";
import { ConstructSignatureContext } from "./TypeScriptParser";
import { IndexSignatureContext } from "./TypeScriptParser";
import { MethodSignatureContext } from "./TypeScriptParser";
import { TypeAliasDeclarationContext } from "./TypeScriptParser";
import { ConstructorDeclarationContext } from "./TypeScriptParser";
import { InterfaceDeclarationContext } from "./TypeScriptParser";
import { InterfaceExtendsClauseContext } from "./TypeScriptParser";
import { ClassOrInterfaceTypeListContext } from "./TypeScriptParser";
import { EnumDeclarationContext } from "./TypeScriptParser";
import { EnumBodyContext } from "./TypeScriptParser";
import { EnumMemberListContext } from "./TypeScriptParser";
import { EnumMemberContext } from "./TypeScriptParser";
import { NamespaceDeclarationContext } from "./TypeScriptParser";
import { NamespaceNameContext } from "./TypeScriptParser";
import { ImportAliasDeclarationContext } from "./TypeScriptParser";
import { DecoratorListContext } from "./TypeScriptParser";
import { DecoratorContext } from "./TypeScriptParser";
import { DecoratorMemberExpressionContext } from "./TypeScriptParser";
import { DecoratorCallExpressionContext } from "./TypeScriptParser";
import { ProgramContext } from "./TypeScriptParser";
import { SourceElementContext } from "./TypeScriptParser";
import { StatementContext } from "./TypeScriptParser";
import { BlockContext } from "./TypeScriptParser";
import { StatementListContext } from "./TypeScriptParser";
import { AbstractDeclarationContext } from "./TypeScriptParser";
import { ImportStatementContext } from "./TypeScriptParser";
import { FromBlockContext } from "./TypeScriptParser";
import { MultipleImportStatementContext } from "./TypeScriptParser";
import { ExportStatementContext } from "./TypeScriptParser";
import { VariableStatementContext } from "./TypeScriptParser";
import { VariableDeclarationListContext } from "./TypeScriptParser";
import { VariableDeclarationContext } from "./TypeScriptParser";
import { EmptyStatement_Context } from "./TypeScriptParser";
import { ExpressionStatementContext } from "./TypeScriptParser";
import { IfStatementContext } from "./TypeScriptParser";
import { IterationStatementContext } from "./TypeScriptParser";
import { VarModifierContext } from "./TypeScriptParser";
import { ContinueStatementContext } from "./TypeScriptParser";
import { BreakStatementContext } from "./TypeScriptParser";
import { ReturnStatementContext } from "./TypeScriptParser";
import { YieldStatementContext } from "./TypeScriptParser";
import { WithStatementContext } from "./TypeScriptParser";
import { SwitchStatementContext } from "./TypeScriptParser";
import { CaseBlockContext } from "./TypeScriptParser";
import { CaseClausesContext } from "./TypeScriptParser";
import { CaseClauseContext } from "./TypeScriptParser";
import { DefaultClauseContext } from "./TypeScriptParser";
import { LabelledStatementContext } from "./TypeScriptParser";
import { ThrowStatementContext } from "./TypeScriptParser";
import { TryStatementContext } from "./TypeScriptParser";
import { CatchProductionContext } from "./TypeScriptParser";
import { FinallyProductionContext } from "./TypeScriptParser";
import { DebuggerStatementContext } from "./TypeScriptParser";
import { FunctionDeclarationContext } from "./TypeScriptParser";
import { ClassDeclarationContext } from "./TypeScriptParser";
import { ClassHeritageContext } from "./TypeScriptParser";
import { ClassTailContext } from "./TypeScriptParser";
import { ClassExtendsClauseContext } from "./TypeScriptParser";
import { ImplementsClauseContext } from "./TypeScriptParser";
import { ClassElementContext } from "./TypeScriptParser";
import { PropertyMemberDeclarationContext } from "./TypeScriptParser";
import { PropertyMemberBaseContext } from "./TypeScriptParser";
import { IndexMemberDeclarationContext } from "./TypeScriptParser";
import { GeneratorMethodContext } from "./TypeScriptParser";
import { GeneratorFunctionDeclarationContext } from "./TypeScriptParser";
import { GeneratorBlockContext } from "./TypeScriptParser";
import { GeneratorDefinitionContext } from "./TypeScriptParser";
import { IteratorBlockContext } from "./TypeScriptParser";
import { IteratorDefinitionContext } from "./TypeScriptParser";
import { FormalParameterListContext } from "./TypeScriptParser";
import { FormalParameterArgContext } from "./TypeScriptParser";
import { LastFormalParameterArgContext } from "./TypeScriptParser";
import { FunctionBodyContext } from "./TypeScriptParser";
import { SourceElementsContext } from "./TypeScriptParser";
import { ArrayLiteralContext } from "./TypeScriptParser";
import { ElementListContext } from "./TypeScriptParser";
import { ArrayElementContext } from "./TypeScriptParser";
import { ObjectLiteralContext } from "./TypeScriptParser";
import { PropertyAssignmentContext } from "./TypeScriptParser";
import { GetAccessorContext } from "./TypeScriptParser";
import { SetAccessorContext } from "./TypeScriptParser";
import { PropertyNameContext } from "./TypeScriptParser";
import { ArgumentsContext } from "./TypeScriptParser";
import { ArgumentListContext } from "./TypeScriptParser";
import { ArgumentContext } from "./TypeScriptParser";
import { ExpressionSequenceContext } from "./TypeScriptParser";
import { FunctionExpressionDeclarationContext } from "./TypeScriptParser";
import { SingleExpressionContext } from "./TypeScriptParser";
import { AsExpressionContext } from "./TypeScriptParser";
import { ArrowFunctionDeclarationContext } from "./TypeScriptParser";
import { ArrowFunctionParametersContext } from "./TypeScriptParser";
import { ArrowFunctionBodyContext } from "./TypeScriptParser";
import { AssignmentOperatorContext } from "./TypeScriptParser";
import { LiteralContext } from "./TypeScriptParser";
import { TemplateStringLiteralContext } from "./TypeScriptParser";
import { TemplateStringAtomContext } from "./TypeScriptParser";
import { NumericLiteralContext } from "./TypeScriptParser";
import { IdentifierNameContext } from "./TypeScriptParser";
import { IdentifierOrKeyWordContext } from "./TypeScriptParser";
import { ReservedWordContext } from "./TypeScriptParser";
import { KeywordContext } from "./TypeScriptParser";
import { GetterContext } from "./TypeScriptParser";
import { SetterContext } from "./TypeScriptParser";
import { EosContext } from "./TypeScriptParser";


/**
 * This interface defines a complete listener for a parse tree produced by
 * `TypeScriptParser`.
 */
export interface TypeScriptParserListener extends ParseTreeListener {
	/**
	 * Enter a parse tree produced by the `ParenthesizedPrimType`
	 * labeled alternative in `TypeScriptParser.primaryType`.
	 * @param ctx the parse tree
	 */
	enterParenthesizedPrimType?: (ctx: ParenthesizedPrimTypeContext) => void;
	/**
	 * Exit a parse tree produced by the `ParenthesizedPrimType`
	 * labeled alternative in `TypeScriptParser.primaryType`.
	 * @param ctx the parse tree
	 */
	exitParenthesizedPrimType?: (ctx: ParenthesizedPrimTypeContext) => void;

	/**
	 * Enter a parse tree produced by the `PredefinedPrimType`
	 * labeled alternative in `TypeScriptParser.primaryType`.
	 * @param ctx the parse tree
	 */
	enterPredefinedPrimType?: (ctx: PredefinedPrimTypeContext) => void;
	/**
	 * Exit a parse tree produced by the `PredefinedPrimType`
	 * labeled alternative in `TypeScriptParser.primaryType`.
	 * @param ctx the parse tree
	 */
	exitPredefinedPrimType?: (ctx: PredefinedPrimTypeContext) => void;

	/**
	 * Enter a parse tree produced by the `ReferencePrimType`
	 * labeled alternative in `TypeScriptParser.primaryType`.
	 * @param ctx the parse tree
	 */
	enterReferencePrimType?: (ctx: ReferencePrimTypeContext) => void;
	/**
	 * Exit a parse tree produced by the `ReferencePrimType`
	 * labeled alternative in `TypeScriptParser.primaryType`.
	 * @param ctx the parse tree
	 */
	exitReferencePrimType?: (ctx: ReferencePrimTypeContext) => void;

	/**
	 * Enter a parse tree produced by the `ObjectPrimType`
	 * labeled alternative in `TypeScriptParser.primaryType`.
	 * @param ctx the parse tree
	 */
	enterObjectPrimType?: (ctx: ObjectPrimTypeContext) => void;
	/**
	 * Exit a parse tree produced by the `ObjectPrimType`
	 * labeled alternative in `TypeScriptParser.primaryType`.
	 * @param ctx the parse tree
	 */
	exitObjectPrimType?: (ctx: ObjectPrimTypeContext) => void;

	/**
	 * Enter a parse tree produced by the `ArrayPrimType`
	 * labeled alternative in `TypeScriptParser.primaryType`.
	 * @param ctx the parse tree
	 */
	enterArrayPrimType?: (ctx: ArrayPrimTypeContext) => void;
	/**
	 * Exit a parse tree produced by the `ArrayPrimType`
	 * labeled alternative in `TypeScriptParser.primaryType`.
	 * @param ctx the parse tree
	 */
	exitArrayPrimType?: (ctx: ArrayPrimTypeContext) => void;

	/**
	 * Enter a parse tree produced by the `TuplePrimType`
	 * labeled alternative in `TypeScriptParser.primaryType`.
	 * @param ctx the parse tree
	 */
	enterTuplePrimType?: (ctx: TuplePrimTypeContext) => void;
	/**
	 * Exit a parse tree produced by the `TuplePrimType`
	 * labeled alternative in `TypeScriptParser.primaryType`.
	 * @param ctx the parse tree
	 */
	exitTuplePrimType?: (ctx: TuplePrimTypeContext) => void;

	/**
	 * Enter a parse tree produced by the `QueryPrimType`
	 * labeled alternative in `TypeScriptParser.primaryType`.
	 * @param ctx the parse tree
	 */
	enterQueryPrimType?: (ctx: QueryPrimTypeContext) => void;
	/**
	 * Exit a parse tree produced by the `QueryPrimType`
	 * labeled alternative in `TypeScriptParser.primaryType`.
	 * @param ctx the parse tree
	 */
	exitQueryPrimType?: (ctx: QueryPrimTypeContext) => void;

	/**
	 * Enter a parse tree produced by the `ThisPrimType`
	 * labeled alternative in `TypeScriptParser.primaryType`.
	 * @param ctx the parse tree
	 */
	enterThisPrimType?: (ctx: ThisPrimTypeContext) => void;
	/**
	 * Exit a parse tree produced by the `ThisPrimType`
	 * labeled alternative in `TypeScriptParser.primaryType`.
	 * @param ctx the parse tree
	 */
	exitThisPrimType?: (ctx: ThisPrimTypeContext) => void;

	/**
	 * Enter a parse tree produced by the `RedefinitionOfType`
	 * labeled alternative in `TypeScriptParser.primaryType`.
	 * @param ctx the parse tree
	 */
	enterRedefinitionOfType?: (ctx: RedefinitionOfTypeContext) => void;
	/**
	 * Exit a parse tree produced by the `RedefinitionOfType`
	 * labeled alternative in `TypeScriptParser.primaryType`.
	 * @param ctx the parse tree
	 */
	exitRedefinitionOfType?: (ctx: RedefinitionOfTypeContext) => void;

	/**
	 * Enter a parse tree produced by the `DoStatement`
	 * labeled alternative in `TypeScriptParser.iterationStatement`.
	 * @param ctx the parse tree
	 */
	enterDoStatement?: (ctx: DoStatementContext) => void;
	/**
	 * Exit a parse tree produced by the `DoStatement`
	 * labeled alternative in `TypeScriptParser.iterationStatement`.
	 * @param ctx the parse tree
	 */
	exitDoStatement?: (ctx: DoStatementContext) => void;

	/**
	 * Enter a parse tree produced by the `WhileStatement`
	 * labeled alternative in `TypeScriptParser.iterationStatement`.
	 * @param ctx the parse tree
	 */
	enterWhileStatement?: (ctx: WhileStatementContext) => void;
	/**
	 * Exit a parse tree produced by the `WhileStatement`
	 * labeled alternative in `TypeScriptParser.iterationStatement`.
	 * @param ctx the parse tree
	 */
	exitWhileStatement?: (ctx: WhileStatementContext) => void;

	/**
	 * Enter a parse tree produced by the `ForStatement`
	 * labeled alternative in `TypeScriptParser.iterationStatement`.
	 * @param ctx the parse tree
	 */
	enterForStatement?: (ctx: ForStatementContext) => void;
	/**
	 * Exit a parse tree produced by the `ForStatement`
	 * labeled alternative in `TypeScriptParser.iterationStatement`.
	 * @param ctx the parse tree
	 */
	exitForStatement?: (ctx: ForStatementContext) => void;

	/**
	 * Enter a parse tree produced by the `ForVarStatement`
	 * labeled alternative in `TypeScriptParser.iterationStatement`.
	 * @param ctx the parse tree
	 */
	enterForVarStatement?: (ctx: ForVarStatementContext) => void;
	/**
	 * Exit a parse tree produced by the `ForVarStatement`
	 * labeled alternative in `TypeScriptParser.iterationStatement`.
	 * @param ctx the parse tree
	 */
	exitForVarStatement?: (ctx: ForVarStatementContext) => void;

	/**
	 * Enter a parse tree produced by the `ForInStatement`
	 * labeled alternative in `TypeScriptParser.iterationStatement`.
	 * @param ctx the parse tree
	 */
	enterForInStatement?: (ctx: ForInStatementContext) => void;
	/**
	 * Exit a parse tree produced by the `ForInStatement`
	 * labeled alternative in `TypeScriptParser.iterationStatement`.
	 * @param ctx the parse tree
	 */
	exitForInStatement?: (ctx: ForInStatementContext) => void;

	/**
	 * Enter a parse tree produced by the `ForVarInStatement`
	 * labeled alternative in `TypeScriptParser.iterationStatement`.
	 * @param ctx the parse tree
	 */
	enterForVarInStatement?: (ctx: ForVarInStatementContext) => void;
	/**
	 * Exit a parse tree produced by the `ForVarInStatement`
	 * labeled alternative in `TypeScriptParser.iterationStatement`.
	 * @param ctx the parse tree
	 */
	exitForVarInStatement?: (ctx: ForVarInStatementContext) => void;

	/**
	 * Enter a parse tree produced by the `FunctionExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 */
	enterFunctionExpression?: (ctx: FunctionExpressionContext) => void;
	/**
	 * Exit a parse tree produced by the `FunctionExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 */
	exitFunctionExpression?: (ctx: FunctionExpressionContext) => void;

	/**
	 * Enter a parse tree produced by the `ArrowFunctionExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 */
	enterArrowFunctionExpression?: (ctx: ArrowFunctionExpressionContext) => void;
	/**
	 * Exit a parse tree produced by the `ArrowFunctionExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 */
	exitArrowFunctionExpression?: (ctx: ArrowFunctionExpressionContext) => void;

	/**
	 * Enter a parse tree produced by the `ClassExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 */
	enterClassExpression?: (ctx: ClassExpressionContext) => void;
	/**
	 * Exit a parse tree produced by the `ClassExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 */
	exitClassExpression?: (ctx: ClassExpressionContext) => void;

	/**
	 * Enter a parse tree produced by the `MemberIndexExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 */
	enterMemberIndexExpression?: (ctx: MemberIndexExpressionContext) => void;
	/**
	 * Exit a parse tree produced by the `MemberIndexExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 */
	exitMemberIndexExpression?: (ctx: MemberIndexExpressionContext) => void;

	/**
	 * Enter a parse tree produced by the `MemberDotExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 */
	enterMemberDotExpression?: (ctx: MemberDotExpressionContext) => void;
	/**
	 * Exit a parse tree produced by the `MemberDotExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 */
	exitMemberDotExpression?: (ctx: MemberDotExpressionContext) => void;

	/**
	 * Enter a parse tree produced by the `NewExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 */
	enterNewExpression?: (ctx: NewExpressionContext) => void;
	/**
	 * Exit a parse tree produced by the `NewExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 */
	exitNewExpression?: (ctx: NewExpressionContext) => void;

	/**
	 * Enter a parse tree produced by the `ArgumentsExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 */
	enterArgumentsExpression?: (ctx: ArgumentsExpressionContext) => void;
	/**
	 * Exit a parse tree produced by the `ArgumentsExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 */
	exitArgumentsExpression?: (ctx: ArgumentsExpressionContext) => void;

	/**
	 * Enter a parse tree produced by the `PostIncrementExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 */
	enterPostIncrementExpression?: (ctx: PostIncrementExpressionContext) => void;
	/**
	 * Exit a parse tree produced by the `PostIncrementExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 */
	exitPostIncrementExpression?: (ctx: PostIncrementExpressionContext) => void;

	/**
	 * Enter a parse tree produced by the `PostDecreaseExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 */
	enterPostDecreaseExpression?: (ctx: PostDecreaseExpressionContext) => void;
	/**
	 * Exit a parse tree produced by the `PostDecreaseExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 */
	exitPostDecreaseExpression?: (ctx: PostDecreaseExpressionContext) => void;

	/**
	 * Enter a parse tree produced by the `DeleteExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 */
	enterDeleteExpression?: (ctx: DeleteExpressionContext) => void;
	/**
	 * Exit a parse tree produced by the `DeleteExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 */
	exitDeleteExpression?: (ctx: DeleteExpressionContext) => void;

	/**
	 * Enter a parse tree produced by the `VoidExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 */
	enterVoidExpression?: (ctx: VoidExpressionContext) => void;
	/**
	 * Exit a parse tree produced by the `VoidExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 */
	exitVoidExpression?: (ctx: VoidExpressionContext) => void;

	/**
	 * Enter a parse tree produced by the `TypeofExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 */
	enterTypeofExpression?: (ctx: TypeofExpressionContext) => void;
	/**
	 * Exit a parse tree produced by the `TypeofExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 */
	exitTypeofExpression?: (ctx: TypeofExpressionContext) => void;

	/**
	 * Enter a parse tree produced by the `PreIncrementExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 */
	enterPreIncrementExpression?: (ctx: PreIncrementExpressionContext) => void;
	/**
	 * Exit a parse tree produced by the `PreIncrementExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 */
	exitPreIncrementExpression?: (ctx: PreIncrementExpressionContext) => void;

	/**
	 * Enter a parse tree produced by the `PreDecreaseExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 */
	enterPreDecreaseExpression?: (ctx: PreDecreaseExpressionContext) => void;
	/**
	 * Exit a parse tree produced by the `PreDecreaseExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 */
	exitPreDecreaseExpression?: (ctx: PreDecreaseExpressionContext) => void;

	/**
	 * Enter a parse tree produced by the `UnaryPlusExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 */
	enterUnaryPlusExpression?: (ctx: UnaryPlusExpressionContext) => void;
	/**
	 * Exit a parse tree produced by the `UnaryPlusExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 */
	exitUnaryPlusExpression?: (ctx: UnaryPlusExpressionContext) => void;

	/**
	 * Enter a parse tree produced by the `UnaryMinusExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 */
	enterUnaryMinusExpression?: (ctx: UnaryMinusExpressionContext) => void;
	/**
	 * Exit a parse tree produced by the `UnaryMinusExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 */
	exitUnaryMinusExpression?: (ctx: UnaryMinusExpressionContext) => void;

	/**
	 * Enter a parse tree produced by the `BitNotExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 */
	enterBitNotExpression?: (ctx: BitNotExpressionContext) => void;
	/**
	 * Exit a parse tree produced by the `BitNotExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 */
	exitBitNotExpression?: (ctx: BitNotExpressionContext) => void;

	/**
	 * Enter a parse tree produced by the `NotExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 */
	enterNotExpression?: (ctx: NotExpressionContext) => void;
	/**
	 * Exit a parse tree produced by the `NotExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 */
	exitNotExpression?: (ctx: NotExpressionContext) => void;

	/**
	 * Enter a parse tree produced by the `MultiplicativeExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 */
	enterMultiplicativeExpression?: (ctx: MultiplicativeExpressionContext) => void;
	/**
	 * Exit a parse tree produced by the `MultiplicativeExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 */
	exitMultiplicativeExpression?: (ctx: MultiplicativeExpressionContext) => void;

	/**
	 * Enter a parse tree produced by the `AdditiveExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 */
	enterAdditiveExpression?: (ctx: AdditiveExpressionContext) => void;
	/**
	 * Exit a parse tree produced by the `AdditiveExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 */
	exitAdditiveExpression?: (ctx: AdditiveExpressionContext) => void;

	/**
	 * Enter a parse tree produced by the `BitShiftExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 */
	enterBitShiftExpression?: (ctx: BitShiftExpressionContext) => void;
	/**
	 * Exit a parse tree produced by the `BitShiftExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 */
	exitBitShiftExpression?: (ctx: BitShiftExpressionContext) => void;

	/**
	 * Enter a parse tree produced by the `RelationalExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 */
	enterRelationalExpression?: (ctx: RelationalExpressionContext) => void;
	/**
	 * Exit a parse tree produced by the `RelationalExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 */
	exitRelationalExpression?: (ctx: RelationalExpressionContext) => void;

	/**
	 * Enter a parse tree produced by the `InstanceofExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 */
	enterInstanceofExpression?: (ctx: InstanceofExpressionContext) => void;
	/**
	 * Exit a parse tree produced by the `InstanceofExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 */
	exitInstanceofExpression?: (ctx: InstanceofExpressionContext) => void;

	/**
	 * Enter a parse tree produced by the `InExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 */
	enterInExpression?: (ctx: InExpressionContext) => void;
	/**
	 * Exit a parse tree produced by the `InExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 */
	exitInExpression?: (ctx: InExpressionContext) => void;

	/**
	 * Enter a parse tree produced by the `EqualityExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 */
	enterEqualityExpression?: (ctx: EqualityExpressionContext) => void;
	/**
	 * Exit a parse tree produced by the `EqualityExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 */
	exitEqualityExpression?: (ctx: EqualityExpressionContext) => void;

	/**
	 * Enter a parse tree produced by the `BitAndExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 */
	enterBitAndExpression?: (ctx: BitAndExpressionContext) => void;
	/**
	 * Exit a parse tree produced by the `BitAndExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 */
	exitBitAndExpression?: (ctx: BitAndExpressionContext) => void;

	/**
	 * Enter a parse tree produced by the `BitXOrExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 */
	enterBitXOrExpression?: (ctx: BitXOrExpressionContext) => void;
	/**
	 * Exit a parse tree produced by the `BitXOrExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 */
	exitBitXOrExpression?: (ctx: BitXOrExpressionContext) => void;

	/**
	 * Enter a parse tree produced by the `BitOrExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 */
	enterBitOrExpression?: (ctx: BitOrExpressionContext) => void;
	/**
	 * Exit a parse tree produced by the `BitOrExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 */
	exitBitOrExpression?: (ctx: BitOrExpressionContext) => void;

	/**
	 * Enter a parse tree produced by the `LogicalAndExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 */
	enterLogicalAndExpression?: (ctx: LogicalAndExpressionContext) => void;
	/**
	 * Exit a parse tree produced by the `LogicalAndExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 */
	exitLogicalAndExpression?: (ctx: LogicalAndExpressionContext) => void;

	/**
	 * Enter a parse tree produced by the `LogicalOrExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 */
	enterLogicalOrExpression?: (ctx: LogicalOrExpressionContext) => void;
	/**
	 * Exit a parse tree produced by the `LogicalOrExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 */
	exitLogicalOrExpression?: (ctx: LogicalOrExpressionContext) => void;

	/**
	 * Enter a parse tree produced by the `TernaryExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 */
	enterTernaryExpression?: (ctx: TernaryExpressionContext) => void;
	/**
	 * Exit a parse tree produced by the `TernaryExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 */
	exitTernaryExpression?: (ctx: TernaryExpressionContext) => void;

	/**
	 * Enter a parse tree produced by the `AssignmentExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 */
	enterAssignmentExpression?: (ctx: AssignmentExpressionContext) => void;
	/**
	 * Exit a parse tree produced by the `AssignmentExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 */
	exitAssignmentExpression?: (ctx: AssignmentExpressionContext) => void;

	/**
	 * Enter a parse tree produced by the `AssignmentOperatorExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 */
	enterAssignmentOperatorExpression?: (ctx: AssignmentOperatorExpressionContext) => void;
	/**
	 * Exit a parse tree produced by the `AssignmentOperatorExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 */
	exitAssignmentOperatorExpression?: (ctx: AssignmentOperatorExpressionContext) => void;

	/**
	 * Enter a parse tree produced by the `TemplateStringExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 */
	enterTemplateStringExpression?: (ctx: TemplateStringExpressionContext) => void;
	/**
	 * Exit a parse tree produced by the `TemplateStringExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 */
	exitTemplateStringExpression?: (ctx: TemplateStringExpressionContext) => void;

	/**
	 * Enter a parse tree produced by the `IteratorsExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 */
	enterIteratorsExpression?: (ctx: IteratorsExpressionContext) => void;
	/**
	 * Exit a parse tree produced by the `IteratorsExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 */
	exitIteratorsExpression?: (ctx: IteratorsExpressionContext) => void;

	/**
	 * Enter a parse tree produced by the `GeneratorsExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 */
	enterGeneratorsExpression?: (ctx: GeneratorsExpressionContext) => void;
	/**
	 * Exit a parse tree produced by the `GeneratorsExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 */
	exitGeneratorsExpression?: (ctx: GeneratorsExpressionContext) => void;

	/**
	 * Enter a parse tree produced by the `GeneratorsFunctionExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 */
	enterGeneratorsFunctionExpression?: (ctx: GeneratorsFunctionExpressionContext) => void;
	/**
	 * Exit a parse tree produced by the `GeneratorsFunctionExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 */
	exitGeneratorsFunctionExpression?: (ctx: GeneratorsFunctionExpressionContext) => void;

	/**
	 * Enter a parse tree produced by the `YieldExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 */
	enterYieldExpression?: (ctx: YieldExpressionContext) => void;
	/**
	 * Exit a parse tree produced by the `YieldExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 */
	exitYieldExpression?: (ctx: YieldExpressionContext) => void;

	/**
	 * Enter a parse tree produced by the `ThisExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 */
	enterThisExpression?: (ctx: ThisExpressionContext) => void;
	/**
	 * Exit a parse tree produced by the `ThisExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 */
	exitThisExpression?: (ctx: ThisExpressionContext) => void;

	/**
	 * Enter a parse tree produced by the `IdentifierExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 */
	enterIdentifierExpression?: (ctx: IdentifierExpressionContext) => void;
	/**
	 * Exit a parse tree produced by the `IdentifierExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 */
	exitIdentifierExpression?: (ctx: IdentifierExpressionContext) => void;

	/**
	 * Enter a parse tree produced by the `SuperExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 */
	enterSuperExpression?: (ctx: SuperExpressionContext) => void;
	/**
	 * Exit a parse tree produced by the `SuperExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 */
	exitSuperExpression?: (ctx: SuperExpressionContext) => void;

	/**
	 * Enter a parse tree produced by the `LiteralExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 */
	enterLiteralExpression?: (ctx: LiteralExpressionContext) => void;
	/**
	 * Exit a parse tree produced by the `LiteralExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 */
	exitLiteralExpression?: (ctx: LiteralExpressionContext) => void;

	/**
	 * Enter a parse tree produced by the `ArrayLiteralExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 */
	enterArrayLiteralExpression?: (ctx: ArrayLiteralExpressionContext) => void;
	/**
	 * Exit a parse tree produced by the `ArrayLiteralExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 */
	exitArrayLiteralExpression?: (ctx: ArrayLiteralExpressionContext) => void;

	/**
	 * Enter a parse tree produced by the `ObjectLiteralExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 */
	enterObjectLiteralExpression?: (ctx: ObjectLiteralExpressionContext) => void;
	/**
	 * Exit a parse tree produced by the `ObjectLiteralExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 */
	exitObjectLiteralExpression?: (ctx: ObjectLiteralExpressionContext) => void;

	/**
	 * Enter a parse tree produced by the `ParenthesizedExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 */
	enterParenthesizedExpression?: (ctx: ParenthesizedExpressionContext) => void;
	/**
	 * Exit a parse tree produced by the `ParenthesizedExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 */
	exitParenthesizedExpression?: (ctx: ParenthesizedExpressionContext) => void;

	/**
	 * Enter a parse tree produced by the `GenericTypes`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 */
	enterGenericTypes?: (ctx: GenericTypesContext) => void;
	/**
	 * Exit a parse tree produced by the `GenericTypes`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 */
	exitGenericTypes?: (ctx: GenericTypesContext) => void;

	/**
	 * Enter a parse tree produced by the `CastAsExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 */
	enterCastAsExpression?: (ctx: CastAsExpressionContext) => void;
	/**
	 * Exit a parse tree produced by the `CastAsExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 */
	exitCastAsExpression?: (ctx: CastAsExpressionContext) => void;

	/**
	 * Enter a parse tree produced by the `PropertyDeclarationExpression`
	 * labeled alternative in `TypeScriptParser.propertyMemberDeclaration`.
	 * @param ctx the parse tree
	 */
	enterPropertyDeclarationExpression?: (ctx: PropertyDeclarationExpressionContext) => void;
	/**
	 * Exit a parse tree produced by the `PropertyDeclarationExpression`
	 * labeled alternative in `TypeScriptParser.propertyMemberDeclaration`.
	 * @param ctx the parse tree
	 */
	exitPropertyDeclarationExpression?: (ctx: PropertyDeclarationExpressionContext) => void;

	/**
	 * Enter a parse tree produced by the `MethodDeclarationExpression`
	 * labeled alternative in `TypeScriptParser.propertyMemberDeclaration`.
	 * @param ctx the parse tree
	 */
	enterMethodDeclarationExpression?: (ctx: MethodDeclarationExpressionContext) => void;
	/**
	 * Exit a parse tree produced by the `MethodDeclarationExpression`
	 * labeled alternative in `TypeScriptParser.propertyMemberDeclaration`.
	 * @param ctx the parse tree
	 */
	exitMethodDeclarationExpression?: (ctx: MethodDeclarationExpressionContext) => void;

	/**
	 * Enter a parse tree produced by the `GetterSetterDeclarationExpression`
	 * labeled alternative in `TypeScriptParser.propertyMemberDeclaration`.
	 * @param ctx the parse tree
	 */
	enterGetterSetterDeclarationExpression?: (ctx: GetterSetterDeclarationExpressionContext) => void;
	/**
	 * Exit a parse tree produced by the `GetterSetterDeclarationExpression`
	 * labeled alternative in `TypeScriptParser.propertyMemberDeclaration`.
	 * @param ctx the parse tree
	 */
	exitGetterSetterDeclarationExpression?: (ctx: GetterSetterDeclarationExpressionContext) => void;

	/**
	 * Enter a parse tree produced by the `AbstractMemberDeclaration`
	 * labeled alternative in `TypeScriptParser.propertyMemberDeclaration`.
	 * @param ctx the parse tree
	 */
	enterAbstractMemberDeclaration?: (ctx: AbstractMemberDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by the `AbstractMemberDeclaration`
	 * labeled alternative in `TypeScriptParser.propertyMemberDeclaration`.
	 * @param ctx the parse tree
	 */
	exitAbstractMemberDeclaration?: (ctx: AbstractMemberDeclarationContext) => void;

	/**
	 * Enter a parse tree produced by the `PropertyExpressionAssignment`
	 * labeled alternative in `TypeScriptParser.propertyAssignment`.
	 * @param ctx the parse tree
	 */
	enterPropertyExpressionAssignment?: (ctx: PropertyExpressionAssignmentContext) => void;
	/**
	 * Exit a parse tree produced by the `PropertyExpressionAssignment`
	 * labeled alternative in `TypeScriptParser.propertyAssignment`.
	 * @param ctx the parse tree
	 */
	exitPropertyExpressionAssignment?: (ctx: PropertyExpressionAssignmentContext) => void;

	/**
	 * Enter a parse tree produced by the `ComputedPropertyExpressionAssignment`
	 * labeled alternative in `TypeScriptParser.propertyAssignment`.
	 * @param ctx the parse tree
	 */
	enterComputedPropertyExpressionAssignment?: (ctx: ComputedPropertyExpressionAssignmentContext) => void;
	/**
	 * Exit a parse tree produced by the `ComputedPropertyExpressionAssignment`
	 * labeled alternative in `TypeScriptParser.propertyAssignment`.
	 * @param ctx the parse tree
	 */
	exitComputedPropertyExpressionAssignment?: (ctx: ComputedPropertyExpressionAssignmentContext) => void;

	/**
	 * Enter a parse tree produced by the `PropertyGetter`
	 * labeled alternative in `TypeScriptParser.propertyAssignment`.
	 * @param ctx the parse tree
	 */
	enterPropertyGetter?: (ctx: PropertyGetterContext) => void;
	/**
	 * Exit a parse tree produced by the `PropertyGetter`
	 * labeled alternative in `TypeScriptParser.propertyAssignment`.
	 * @param ctx the parse tree
	 */
	exitPropertyGetter?: (ctx: PropertyGetterContext) => void;

	/**
	 * Enter a parse tree produced by the `PropertySetter`
	 * labeled alternative in `TypeScriptParser.propertyAssignment`.
	 * @param ctx the parse tree
	 */
	enterPropertySetter?: (ctx: PropertySetterContext) => void;
	/**
	 * Exit a parse tree produced by the `PropertySetter`
	 * labeled alternative in `TypeScriptParser.propertyAssignment`.
	 * @param ctx the parse tree
	 */
	exitPropertySetter?: (ctx: PropertySetterContext) => void;

	/**
	 * Enter a parse tree produced by the `MethodProperty`
	 * labeled alternative in `TypeScriptParser.propertyAssignment`.
	 * @param ctx the parse tree
	 */
	enterMethodProperty?: (ctx: MethodPropertyContext) => void;
	/**
	 * Exit a parse tree produced by the `MethodProperty`
	 * labeled alternative in `TypeScriptParser.propertyAssignment`.
	 * @param ctx the parse tree
	 */
	exitMethodProperty?: (ctx: MethodPropertyContext) => void;

	/**
	 * Enter a parse tree produced by the `PropertyShorthand`
	 * labeled alternative in `TypeScriptParser.propertyAssignment`.
	 * @param ctx the parse tree
	 */
	enterPropertyShorthand?: (ctx: PropertyShorthandContext) => void;
	/**
	 * Exit a parse tree produced by the `PropertyShorthand`
	 * labeled alternative in `TypeScriptParser.propertyAssignment`.
	 * @param ctx the parse tree
	 */
	exitPropertyShorthand?: (ctx: PropertyShorthandContext) => void;

	/**
	 * Enter a parse tree produced by the `RestParameterInObject`
	 * labeled alternative in `TypeScriptParser.propertyAssignment`.
	 * @param ctx the parse tree
	 */
	enterRestParameterInObject?: (ctx: RestParameterInObjectContext) => void;
	/**
	 * Exit a parse tree produced by the `RestParameterInObject`
	 * labeled alternative in `TypeScriptParser.propertyAssignment`.
	 * @param ctx the parse tree
	 */
	exitRestParameterInObject?: (ctx: RestParameterInObjectContext) => void;

	/**
	 * Enter a parse tree produced by the `Union`
	 * labeled alternative in `TypeScriptParser.unionOrIntersectionOrPrimaryType`.
	 * @param ctx the parse tree
	 */
	enterUnion?: (ctx: UnionContext) => void;
	/**
	 * Exit a parse tree produced by the `Union`
	 * labeled alternative in `TypeScriptParser.unionOrIntersectionOrPrimaryType`.
	 * @param ctx the parse tree
	 */
	exitUnion?: (ctx: UnionContext) => void;

	/**
	 * Enter a parse tree produced by the `Intersection`
	 * labeled alternative in `TypeScriptParser.unionOrIntersectionOrPrimaryType`.
	 * @param ctx the parse tree
	 */
	enterIntersection?: (ctx: IntersectionContext) => void;
	/**
	 * Exit a parse tree produced by the `Intersection`
	 * labeled alternative in `TypeScriptParser.unionOrIntersectionOrPrimaryType`.
	 * @param ctx the parse tree
	 */
	exitIntersection?: (ctx: IntersectionContext) => void;

	/**
	 * Enter a parse tree produced by the `Primary`
	 * labeled alternative in `TypeScriptParser.unionOrIntersectionOrPrimaryType`.
	 * @param ctx the parse tree
	 */
	enterPrimary?: (ctx: PrimaryContext) => void;
	/**
	 * Exit a parse tree produced by the `Primary`
	 * labeled alternative in `TypeScriptParser.unionOrIntersectionOrPrimaryType`.
	 * @param ctx the parse tree
	 */
	exitPrimary?: (ctx: PrimaryContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.initializer`.
	 * @param ctx the parse tree
	 */
	enterInitializer?: (ctx: InitializerContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.initializer`.
	 * @param ctx the parse tree
	 */
	exitInitializer?: (ctx: InitializerContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.bindingPattern`.
	 * @param ctx the parse tree
	 */
	enterBindingPattern?: (ctx: BindingPatternContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.bindingPattern`.
	 * @param ctx the parse tree
	 */
	exitBindingPattern?: (ctx: BindingPatternContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.typeParameters`.
	 * @param ctx the parse tree
	 */
	enterTypeParameters?: (ctx: TypeParametersContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.typeParameters`.
	 * @param ctx the parse tree
	 */
	exitTypeParameters?: (ctx: TypeParametersContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.typeParameterList`.
	 * @param ctx the parse tree
	 */
	enterTypeParameterList?: (ctx: TypeParameterListContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.typeParameterList`.
	 * @param ctx the parse tree
	 */
	exitTypeParameterList?: (ctx: TypeParameterListContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.typeParameter`.
	 * @param ctx the parse tree
	 */
	enterTypeParameter?: (ctx: TypeParameterContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.typeParameter`.
	 * @param ctx the parse tree
	 */
	exitTypeParameter?: (ctx: TypeParameterContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.constraint`.
	 * @param ctx the parse tree
	 */
	enterConstraint?: (ctx: ConstraintContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.constraint`.
	 * @param ctx the parse tree
	 */
	exitConstraint?: (ctx: ConstraintContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.typeArguments`.
	 * @param ctx the parse tree
	 */
	enterTypeArguments?: (ctx: TypeArgumentsContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.typeArguments`.
	 * @param ctx the parse tree
	 */
	exitTypeArguments?: (ctx: TypeArgumentsContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.typeArgumentList`.
	 * @param ctx the parse tree
	 */
	enterTypeArgumentList?: (ctx: TypeArgumentListContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.typeArgumentList`.
	 * @param ctx the parse tree
	 */
	exitTypeArgumentList?: (ctx: TypeArgumentListContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.typeArgument`.
	 * @param ctx the parse tree
	 */
	enterTypeArgument?: (ctx: TypeArgumentContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.typeArgument`.
	 * @param ctx the parse tree
	 */
	exitTypeArgument?: (ctx: TypeArgumentContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.type_`.
	 * @param ctx the parse tree
	 */
	enterType_?: (ctx: Type_Context) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.type_`.
	 * @param ctx the parse tree
	 */
	exitType_?: (ctx: Type_Context) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.unionOrIntersectionOrPrimaryType`.
	 * @param ctx the parse tree
	 */
	enterUnionOrIntersectionOrPrimaryType?: (ctx: UnionOrIntersectionOrPrimaryTypeContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.unionOrIntersectionOrPrimaryType`.
	 * @param ctx the parse tree
	 */
	exitUnionOrIntersectionOrPrimaryType?: (ctx: UnionOrIntersectionOrPrimaryTypeContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.primaryType`.
	 * @param ctx the parse tree
	 */
	enterPrimaryType?: (ctx: PrimaryTypeContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.primaryType`.
	 * @param ctx the parse tree
	 */
	exitPrimaryType?: (ctx: PrimaryTypeContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.predefinedType`.
	 * @param ctx the parse tree
	 */
	enterPredefinedType?: (ctx: PredefinedTypeContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.predefinedType`.
	 * @param ctx the parse tree
	 */
	exitPredefinedType?: (ctx: PredefinedTypeContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.typeReference`.
	 * @param ctx the parse tree
	 */
	enterTypeReference?: (ctx: TypeReferenceContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.typeReference`.
	 * @param ctx the parse tree
	 */
	exitTypeReference?: (ctx: TypeReferenceContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.nestedTypeGeneric`.
	 * @param ctx the parse tree
	 */
	enterNestedTypeGeneric?: (ctx: NestedTypeGenericContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.nestedTypeGeneric`.
	 * @param ctx the parse tree
	 */
	exitNestedTypeGeneric?: (ctx: NestedTypeGenericContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.typeGeneric`.
	 * @param ctx the parse tree
	 */
	enterTypeGeneric?: (ctx: TypeGenericContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.typeGeneric`.
	 * @param ctx the parse tree
	 */
	exitTypeGeneric?: (ctx: TypeGenericContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.typeIncludeGeneric`.
	 * @param ctx the parse tree
	 */
	enterTypeIncludeGeneric?: (ctx: TypeIncludeGenericContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.typeIncludeGeneric`.
	 * @param ctx the parse tree
	 */
	exitTypeIncludeGeneric?: (ctx: TypeIncludeGenericContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.typeName`.
	 * @param ctx the parse tree
	 */
	enterTypeName?: (ctx: TypeNameContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.typeName`.
	 * @param ctx the parse tree
	 */
	exitTypeName?: (ctx: TypeNameContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.objectType`.
	 * @param ctx the parse tree
	 */
	enterObjectType?: (ctx: ObjectTypeContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.objectType`.
	 * @param ctx the parse tree
	 */
	exitObjectType?: (ctx: ObjectTypeContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.typeBody`.
	 * @param ctx the parse tree
	 */
	enterTypeBody?: (ctx: TypeBodyContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.typeBody`.
	 * @param ctx the parse tree
	 */
	exitTypeBody?: (ctx: TypeBodyContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.typeMemberList`.
	 * @param ctx the parse tree
	 */
	enterTypeMemberList?: (ctx: TypeMemberListContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.typeMemberList`.
	 * @param ctx the parse tree
	 */
	exitTypeMemberList?: (ctx: TypeMemberListContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.typeMember`.
	 * @param ctx the parse tree
	 */
	enterTypeMember?: (ctx: TypeMemberContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.typeMember`.
	 * @param ctx the parse tree
	 */
	exitTypeMember?: (ctx: TypeMemberContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.arrayType`.
	 * @param ctx the parse tree
	 */
	enterArrayType?: (ctx: ArrayTypeContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.arrayType`.
	 * @param ctx the parse tree
	 */
	exitArrayType?: (ctx: ArrayTypeContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.tupleType`.
	 * @param ctx the parse tree
	 */
	enterTupleType?: (ctx: TupleTypeContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.tupleType`.
	 * @param ctx the parse tree
	 */
	exitTupleType?: (ctx: TupleTypeContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.tupleElementTypes`.
	 * @param ctx the parse tree
	 */
	enterTupleElementTypes?: (ctx: TupleElementTypesContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.tupleElementTypes`.
	 * @param ctx the parse tree
	 */
	exitTupleElementTypes?: (ctx: TupleElementTypesContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.functionType`.
	 * @param ctx the parse tree
	 */
	enterFunctionType?: (ctx: FunctionTypeContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.functionType`.
	 * @param ctx the parse tree
	 */
	exitFunctionType?: (ctx: FunctionTypeContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.constructorType`.
	 * @param ctx the parse tree
	 */
	enterConstructorType?: (ctx: ConstructorTypeContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.constructorType`.
	 * @param ctx the parse tree
	 */
	exitConstructorType?: (ctx: ConstructorTypeContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.typeQuery`.
	 * @param ctx the parse tree
	 */
	enterTypeQuery?: (ctx: TypeQueryContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.typeQuery`.
	 * @param ctx the parse tree
	 */
	exitTypeQuery?: (ctx: TypeQueryContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.typeQueryExpression`.
	 * @param ctx the parse tree
	 */
	enterTypeQueryExpression?: (ctx: TypeQueryExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.typeQueryExpression`.
	 * @param ctx the parse tree
	 */
	exitTypeQueryExpression?: (ctx: TypeQueryExpressionContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.propertySignatur`.
	 * @param ctx the parse tree
	 */
	enterPropertySignatur?: (ctx: PropertySignaturContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.propertySignatur`.
	 * @param ctx the parse tree
	 */
	exitPropertySignatur?: (ctx: PropertySignaturContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.typeAnnotation`.
	 * @param ctx the parse tree
	 */
	enterTypeAnnotation?: (ctx: TypeAnnotationContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.typeAnnotation`.
	 * @param ctx the parse tree
	 */
	exitTypeAnnotation?: (ctx: TypeAnnotationContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.callSignature`.
	 * @param ctx the parse tree
	 */
	enterCallSignature?: (ctx: CallSignatureContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.callSignature`.
	 * @param ctx the parse tree
	 */
	exitCallSignature?: (ctx: CallSignatureContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.parameterList`.
	 * @param ctx the parse tree
	 */
	enterParameterList?: (ctx: ParameterListContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.parameterList`.
	 * @param ctx the parse tree
	 */
	exitParameterList?: (ctx: ParameterListContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.requiredParameterList`.
	 * @param ctx the parse tree
	 */
	enterRequiredParameterList?: (ctx: RequiredParameterListContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.requiredParameterList`.
	 * @param ctx the parse tree
	 */
	exitRequiredParameterList?: (ctx: RequiredParameterListContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.parameter`.
	 * @param ctx the parse tree
	 */
	enterParameter?: (ctx: ParameterContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.parameter`.
	 * @param ctx the parse tree
	 */
	exitParameter?: (ctx: ParameterContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.optionalParameter`.
	 * @param ctx the parse tree
	 */
	enterOptionalParameter?: (ctx: OptionalParameterContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.optionalParameter`.
	 * @param ctx the parse tree
	 */
	exitOptionalParameter?: (ctx: OptionalParameterContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.restParameter`.
	 * @param ctx the parse tree
	 */
	enterRestParameter?: (ctx: RestParameterContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.restParameter`.
	 * @param ctx the parse tree
	 */
	exitRestParameter?: (ctx: RestParameterContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.requiredParameter`.
	 * @param ctx the parse tree
	 */
	enterRequiredParameter?: (ctx: RequiredParameterContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.requiredParameter`.
	 * @param ctx the parse tree
	 */
	exitRequiredParameter?: (ctx: RequiredParameterContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.accessibilityModifier`.
	 * @param ctx the parse tree
	 */
	enterAccessibilityModifier?: (ctx: AccessibilityModifierContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.accessibilityModifier`.
	 * @param ctx the parse tree
	 */
	exitAccessibilityModifier?: (ctx: AccessibilityModifierContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.identifierOrPattern`.
	 * @param ctx the parse tree
	 */
	enterIdentifierOrPattern?: (ctx: IdentifierOrPatternContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.identifierOrPattern`.
	 * @param ctx the parse tree
	 */
	exitIdentifierOrPattern?: (ctx: IdentifierOrPatternContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.constructSignature`.
	 * @param ctx the parse tree
	 */
	enterConstructSignature?: (ctx: ConstructSignatureContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.constructSignature`.
	 * @param ctx the parse tree
	 */
	exitConstructSignature?: (ctx: ConstructSignatureContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.indexSignature`.
	 * @param ctx the parse tree
	 */
	enterIndexSignature?: (ctx: IndexSignatureContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.indexSignature`.
	 * @param ctx the parse tree
	 */
	exitIndexSignature?: (ctx: IndexSignatureContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.methodSignature`.
	 * @param ctx the parse tree
	 */
	enterMethodSignature?: (ctx: MethodSignatureContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.methodSignature`.
	 * @param ctx the parse tree
	 */
	exitMethodSignature?: (ctx: MethodSignatureContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.typeAliasDeclaration`.
	 * @param ctx the parse tree
	 */
	enterTypeAliasDeclaration?: (ctx: TypeAliasDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.typeAliasDeclaration`.
	 * @param ctx the parse tree
	 */
	exitTypeAliasDeclaration?: (ctx: TypeAliasDeclarationContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.constructorDeclaration`.
	 * @param ctx the parse tree
	 */
	enterConstructorDeclaration?: (ctx: ConstructorDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.constructorDeclaration`.
	 * @param ctx the parse tree
	 */
	exitConstructorDeclaration?: (ctx: ConstructorDeclarationContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.interfaceDeclaration`.
	 * @param ctx the parse tree
	 */
	enterInterfaceDeclaration?: (ctx: InterfaceDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.interfaceDeclaration`.
	 * @param ctx the parse tree
	 */
	exitInterfaceDeclaration?: (ctx: InterfaceDeclarationContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.interfaceExtendsClause`.
	 * @param ctx the parse tree
	 */
	enterInterfaceExtendsClause?: (ctx: InterfaceExtendsClauseContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.interfaceExtendsClause`.
	 * @param ctx the parse tree
	 */
	exitInterfaceExtendsClause?: (ctx: InterfaceExtendsClauseContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.classOrInterfaceTypeList`.
	 * @param ctx the parse tree
	 */
	enterClassOrInterfaceTypeList?: (ctx: ClassOrInterfaceTypeListContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.classOrInterfaceTypeList`.
	 * @param ctx the parse tree
	 */
	exitClassOrInterfaceTypeList?: (ctx: ClassOrInterfaceTypeListContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.enumDeclaration`.
	 * @param ctx the parse tree
	 */
	enterEnumDeclaration?: (ctx: EnumDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.enumDeclaration`.
	 * @param ctx the parse tree
	 */
	exitEnumDeclaration?: (ctx: EnumDeclarationContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.enumBody`.
	 * @param ctx the parse tree
	 */
	enterEnumBody?: (ctx: EnumBodyContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.enumBody`.
	 * @param ctx the parse tree
	 */
	exitEnumBody?: (ctx: EnumBodyContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.enumMemberList`.
	 * @param ctx the parse tree
	 */
	enterEnumMemberList?: (ctx: EnumMemberListContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.enumMemberList`.
	 * @param ctx the parse tree
	 */
	exitEnumMemberList?: (ctx: EnumMemberListContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.enumMember`.
	 * @param ctx the parse tree
	 */
	enterEnumMember?: (ctx: EnumMemberContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.enumMember`.
	 * @param ctx the parse tree
	 */
	exitEnumMember?: (ctx: EnumMemberContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.namespaceDeclaration`.
	 * @param ctx the parse tree
	 */
	enterNamespaceDeclaration?: (ctx: NamespaceDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.namespaceDeclaration`.
	 * @param ctx the parse tree
	 */
	exitNamespaceDeclaration?: (ctx: NamespaceDeclarationContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.namespaceName`.
	 * @param ctx the parse tree
	 */
	enterNamespaceName?: (ctx: NamespaceNameContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.namespaceName`.
	 * @param ctx the parse tree
	 */
	exitNamespaceName?: (ctx: NamespaceNameContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.importAliasDeclaration`.
	 * @param ctx the parse tree
	 */
	enterImportAliasDeclaration?: (ctx: ImportAliasDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.importAliasDeclaration`.
	 * @param ctx the parse tree
	 */
	exitImportAliasDeclaration?: (ctx: ImportAliasDeclarationContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.decoratorList`.
	 * @param ctx the parse tree
	 */
	enterDecoratorList?: (ctx: DecoratorListContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.decoratorList`.
	 * @param ctx the parse tree
	 */
	exitDecoratorList?: (ctx: DecoratorListContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.decorator`.
	 * @param ctx the parse tree
	 */
	enterDecorator?: (ctx: DecoratorContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.decorator`.
	 * @param ctx the parse tree
	 */
	exitDecorator?: (ctx: DecoratorContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.decoratorMemberExpression`.
	 * @param ctx the parse tree
	 */
	enterDecoratorMemberExpression?: (ctx: DecoratorMemberExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.decoratorMemberExpression`.
	 * @param ctx the parse tree
	 */
	exitDecoratorMemberExpression?: (ctx: DecoratorMemberExpressionContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.decoratorCallExpression`.
	 * @param ctx the parse tree
	 */
	enterDecoratorCallExpression?: (ctx: DecoratorCallExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.decoratorCallExpression`.
	 * @param ctx the parse tree
	 */
	exitDecoratorCallExpression?: (ctx: DecoratorCallExpressionContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.program`.
	 * @param ctx the parse tree
	 */
	enterProgram?: (ctx: ProgramContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.program`.
	 * @param ctx the parse tree
	 */
	exitProgram?: (ctx: ProgramContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.sourceElement`.
	 * @param ctx the parse tree
	 */
	enterSourceElement?: (ctx: SourceElementContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.sourceElement`.
	 * @param ctx the parse tree
	 */
	exitSourceElement?: (ctx: SourceElementContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.statement`.
	 * @param ctx the parse tree
	 */
	enterStatement?: (ctx: StatementContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.statement`.
	 * @param ctx the parse tree
	 */
	exitStatement?: (ctx: StatementContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.block`.
	 * @param ctx the parse tree
	 */
	enterBlock?: (ctx: BlockContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.block`.
	 * @param ctx the parse tree
	 */
	exitBlock?: (ctx: BlockContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.statementList`.
	 * @param ctx the parse tree
	 */
	enterStatementList?: (ctx: StatementListContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.statementList`.
	 * @param ctx the parse tree
	 */
	exitStatementList?: (ctx: StatementListContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.abstractDeclaration`.
	 * @param ctx the parse tree
	 */
	enterAbstractDeclaration?: (ctx: AbstractDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.abstractDeclaration`.
	 * @param ctx the parse tree
	 */
	exitAbstractDeclaration?: (ctx: AbstractDeclarationContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.importStatement`.
	 * @param ctx the parse tree
	 */
	enterImportStatement?: (ctx: ImportStatementContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.importStatement`.
	 * @param ctx the parse tree
	 */
	exitImportStatement?: (ctx: ImportStatementContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.fromBlock`.
	 * @param ctx the parse tree
	 */
	enterFromBlock?: (ctx: FromBlockContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.fromBlock`.
	 * @param ctx the parse tree
	 */
	exitFromBlock?: (ctx: FromBlockContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.multipleImportStatement`.
	 * @param ctx the parse tree
	 */
	enterMultipleImportStatement?: (ctx: MultipleImportStatementContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.multipleImportStatement`.
	 * @param ctx the parse tree
	 */
	exitMultipleImportStatement?: (ctx: MultipleImportStatementContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.exportStatement`.
	 * @param ctx the parse tree
	 */
	enterExportStatement?: (ctx: ExportStatementContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.exportStatement`.
	 * @param ctx the parse tree
	 */
	exitExportStatement?: (ctx: ExportStatementContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.variableStatement`.
	 * @param ctx the parse tree
	 */
	enterVariableStatement?: (ctx: VariableStatementContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.variableStatement`.
	 * @param ctx the parse tree
	 */
	exitVariableStatement?: (ctx: VariableStatementContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.variableDeclarationList`.
	 * @param ctx the parse tree
	 */
	enterVariableDeclarationList?: (ctx: VariableDeclarationListContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.variableDeclarationList`.
	 * @param ctx the parse tree
	 */
	exitVariableDeclarationList?: (ctx: VariableDeclarationListContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.variableDeclaration`.
	 * @param ctx the parse tree
	 */
	enterVariableDeclaration?: (ctx: VariableDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.variableDeclaration`.
	 * @param ctx the parse tree
	 */
	exitVariableDeclaration?: (ctx: VariableDeclarationContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.emptyStatement_`.
	 * @param ctx the parse tree
	 */
	enterEmptyStatement_?: (ctx: EmptyStatement_Context) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.emptyStatement_`.
	 * @param ctx the parse tree
	 */
	exitEmptyStatement_?: (ctx: EmptyStatement_Context) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.expressionStatement`.
	 * @param ctx the parse tree
	 */
	enterExpressionStatement?: (ctx: ExpressionStatementContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.expressionStatement`.
	 * @param ctx the parse tree
	 */
	exitExpressionStatement?: (ctx: ExpressionStatementContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.ifStatement`.
	 * @param ctx the parse tree
	 */
	enterIfStatement?: (ctx: IfStatementContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.ifStatement`.
	 * @param ctx the parse tree
	 */
	exitIfStatement?: (ctx: IfStatementContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.iterationStatement`.
	 * @param ctx the parse tree
	 */
	enterIterationStatement?: (ctx: IterationStatementContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.iterationStatement`.
	 * @param ctx the parse tree
	 */
	exitIterationStatement?: (ctx: IterationStatementContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.varModifier`.
	 * @param ctx the parse tree
	 */
	enterVarModifier?: (ctx: VarModifierContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.varModifier`.
	 * @param ctx the parse tree
	 */
	exitVarModifier?: (ctx: VarModifierContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.continueStatement`.
	 * @param ctx the parse tree
	 */
	enterContinueStatement?: (ctx: ContinueStatementContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.continueStatement`.
	 * @param ctx the parse tree
	 */
	exitContinueStatement?: (ctx: ContinueStatementContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.breakStatement`.
	 * @param ctx the parse tree
	 */
	enterBreakStatement?: (ctx: BreakStatementContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.breakStatement`.
	 * @param ctx the parse tree
	 */
	exitBreakStatement?: (ctx: BreakStatementContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.returnStatement`.
	 * @param ctx the parse tree
	 */
	enterReturnStatement?: (ctx: ReturnStatementContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.returnStatement`.
	 * @param ctx the parse tree
	 */
	exitReturnStatement?: (ctx: ReturnStatementContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.yieldStatement`.
	 * @param ctx the parse tree
	 */
	enterYieldStatement?: (ctx: YieldStatementContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.yieldStatement`.
	 * @param ctx the parse tree
	 */
	exitYieldStatement?: (ctx: YieldStatementContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.withStatement`.
	 * @param ctx the parse tree
	 */
	enterWithStatement?: (ctx: WithStatementContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.withStatement`.
	 * @param ctx the parse tree
	 */
	exitWithStatement?: (ctx: WithStatementContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.switchStatement`.
	 * @param ctx the parse tree
	 */
	enterSwitchStatement?: (ctx: SwitchStatementContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.switchStatement`.
	 * @param ctx the parse tree
	 */
	exitSwitchStatement?: (ctx: SwitchStatementContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.caseBlock`.
	 * @param ctx the parse tree
	 */
	enterCaseBlock?: (ctx: CaseBlockContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.caseBlock`.
	 * @param ctx the parse tree
	 */
	exitCaseBlock?: (ctx: CaseBlockContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.caseClauses`.
	 * @param ctx the parse tree
	 */
	enterCaseClauses?: (ctx: CaseClausesContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.caseClauses`.
	 * @param ctx the parse tree
	 */
	exitCaseClauses?: (ctx: CaseClausesContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.caseClause`.
	 * @param ctx the parse tree
	 */
	enterCaseClause?: (ctx: CaseClauseContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.caseClause`.
	 * @param ctx the parse tree
	 */
	exitCaseClause?: (ctx: CaseClauseContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.defaultClause`.
	 * @param ctx the parse tree
	 */
	enterDefaultClause?: (ctx: DefaultClauseContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.defaultClause`.
	 * @param ctx the parse tree
	 */
	exitDefaultClause?: (ctx: DefaultClauseContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.labelledStatement`.
	 * @param ctx the parse tree
	 */
	enterLabelledStatement?: (ctx: LabelledStatementContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.labelledStatement`.
	 * @param ctx the parse tree
	 */
	exitLabelledStatement?: (ctx: LabelledStatementContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.throwStatement`.
	 * @param ctx the parse tree
	 */
	enterThrowStatement?: (ctx: ThrowStatementContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.throwStatement`.
	 * @param ctx the parse tree
	 */
	exitThrowStatement?: (ctx: ThrowStatementContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.tryStatement`.
	 * @param ctx the parse tree
	 */
	enterTryStatement?: (ctx: TryStatementContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.tryStatement`.
	 * @param ctx the parse tree
	 */
	exitTryStatement?: (ctx: TryStatementContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.catchProduction`.
	 * @param ctx the parse tree
	 */
	enterCatchProduction?: (ctx: CatchProductionContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.catchProduction`.
	 * @param ctx the parse tree
	 */
	exitCatchProduction?: (ctx: CatchProductionContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.finallyProduction`.
	 * @param ctx the parse tree
	 */
	enterFinallyProduction?: (ctx: FinallyProductionContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.finallyProduction`.
	 * @param ctx the parse tree
	 */
	exitFinallyProduction?: (ctx: FinallyProductionContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.debuggerStatement`.
	 * @param ctx the parse tree
	 */
	enterDebuggerStatement?: (ctx: DebuggerStatementContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.debuggerStatement`.
	 * @param ctx the parse tree
	 */
	exitDebuggerStatement?: (ctx: DebuggerStatementContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.functionDeclaration`.
	 * @param ctx the parse tree
	 */
	enterFunctionDeclaration?: (ctx: FunctionDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.functionDeclaration`.
	 * @param ctx the parse tree
	 */
	exitFunctionDeclaration?: (ctx: FunctionDeclarationContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.classDeclaration`.
	 * @param ctx the parse tree
	 */
	enterClassDeclaration?: (ctx: ClassDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.classDeclaration`.
	 * @param ctx the parse tree
	 */
	exitClassDeclaration?: (ctx: ClassDeclarationContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.classHeritage`.
	 * @param ctx the parse tree
	 */
	enterClassHeritage?: (ctx: ClassHeritageContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.classHeritage`.
	 * @param ctx the parse tree
	 */
	exitClassHeritage?: (ctx: ClassHeritageContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.classTail`.
	 * @param ctx the parse tree
	 */
	enterClassTail?: (ctx: ClassTailContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.classTail`.
	 * @param ctx the parse tree
	 */
	exitClassTail?: (ctx: ClassTailContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.classExtendsClause`.
	 * @param ctx the parse tree
	 */
	enterClassExtendsClause?: (ctx: ClassExtendsClauseContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.classExtendsClause`.
	 * @param ctx the parse tree
	 */
	exitClassExtendsClause?: (ctx: ClassExtendsClauseContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.implementsClause`.
	 * @param ctx the parse tree
	 */
	enterImplementsClause?: (ctx: ImplementsClauseContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.implementsClause`.
	 * @param ctx the parse tree
	 */
	exitImplementsClause?: (ctx: ImplementsClauseContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.classElement`.
	 * @param ctx the parse tree
	 */
	enterClassElement?: (ctx: ClassElementContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.classElement`.
	 * @param ctx the parse tree
	 */
	exitClassElement?: (ctx: ClassElementContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.propertyMemberDeclaration`.
	 * @param ctx the parse tree
	 */
	enterPropertyMemberDeclaration?: (ctx: PropertyMemberDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.propertyMemberDeclaration`.
	 * @param ctx the parse tree
	 */
	exitPropertyMemberDeclaration?: (ctx: PropertyMemberDeclarationContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.propertyMemberBase`.
	 * @param ctx the parse tree
	 */
	enterPropertyMemberBase?: (ctx: PropertyMemberBaseContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.propertyMemberBase`.
	 * @param ctx the parse tree
	 */
	exitPropertyMemberBase?: (ctx: PropertyMemberBaseContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.indexMemberDeclaration`.
	 * @param ctx the parse tree
	 */
	enterIndexMemberDeclaration?: (ctx: IndexMemberDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.indexMemberDeclaration`.
	 * @param ctx the parse tree
	 */
	exitIndexMemberDeclaration?: (ctx: IndexMemberDeclarationContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.generatorMethod`.
	 * @param ctx the parse tree
	 */
	enterGeneratorMethod?: (ctx: GeneratorMethodContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.generatorMethod`.
	 * @param ctx the parse tree
	 */
	exitGeneratorMethod?: (ctx: GeneratorMethodContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.generatorFunctionDeclaration`.
	 * @param ctx the parse tree
	 */
	enterGeneratorFunctionDeclaration?: (ctx: GeneratorFunctionDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.generatorFunctionDeclaration`.
	 * @param ctx the parse tree
	 */
	exitGeneratorFunctionDeclaration?: (ctx: GeneratorFunctionDeclarationContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.generatorBlock`.
	 * @param ctx the parse tree
	 */
	enterGeneratorBlock?: (ctx: GeneratorBlockContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.generatorBlock`.
	 * @param ctx the parse tree
	 */
	exitGeneratorBlock?: (ctx: GeneratorBlockContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.generatorDefinition`.
	 * @param ctx the parse tree
	 */
	enterGeneratorDefinition?: (ctx: GeneratorDefinitionContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.generatorDefinition`.
	 * @param ctx the parse tree
	 */
	exitGeneratorDefinition?: (ctx: GeneratorDefinitionContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.iteratorBlock`.
	 * @param ctx the parse tree
	 */
	enterIteratorBlock?: (ctx: IteratorBlockContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.iteratorBlock`.
	 * @param ctx the parse tree
	 */
	exitIteratorBlock?: (ctx: IteratorBlockContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.iteratorDefinition`.
	 * @param ctx the parse tree
	 */
	enterIteratorDefinition?: (ctx: IteratorDefinitionContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.iteratorDefinition`.
	 * @param ctx the parse tree
	 */
	exitIteratorDefinition?: (ctx: IteratorDefinitionContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.formalParameterList`.
	 * @param ctx the parse tree
	 */
	enterFormalParameterList?: (ctx: FormalParameterListContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.formalParameterList`.
	 * @param ctx the parse tree
	 */
	exitFormalParameterList?: (ctx: FormalParameterListContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.formalParameterArg`.
	 * @param ctx the parse tree
	 */
	enterFormalParameterArg?: (ctx: FormalParameterArgContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.formalParameterArg`.
	 * @param ctx the parse tree
	 */
	exitFormalParameterArg?: (ctx: FormalParameterArgContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.lastFormalParameterArg`.
	 * @param ctx the parse tree
	 */
	enterLastFormalParameterArg?: (ctx: LastFormalParameterArgContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.lastFormalParameterArg`.
	 * @param ctx the parse tree
	 */
	exitLastFormalParameterArg?: (ctx: LastFormalParameterArgContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.functionBody`.
	 * @param ctx the parse tree
	 */
	enterFunctionBody?: (ctx: FunctionBodyContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.functionBody`.
	 * @param ctx the parse tree
	 */
	exitFunctionBody?: (ctx: FunctionBodyContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.sourceElements`.
	 * @param ctx the parse tree
	 */
	enterSourceElements?: (ctx: SourceElementsContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.sourceElements`.
	 * @param ctx the parse tree
	 */
	exitSourceElements?: (ctx: SourceElementsContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.arrayLiteral`.
	 * @param ctx the parse tree
	 */
	enterArrayLiteral?: (ctx: ArrayLiteralContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.arrayLiteral`.
	 * @param ctx the parse tree
	 */
	exitArrayLiteral?: (ctx: ArrayLiteralContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.elementList`.
	 * @param ctx the parse tree
	 */
	enterElementList?: (ctx: ElementListContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.elementList`.
	 * @param ctx the parse tree
	 */
	exitElementList?: (ctx: ElementListContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.arrayElement`.
	 * @param ctx the parse tree
	 */
	enterArrayElement?: (ctx: ArrayElementContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.arrayElement`.
	 * @param ctx the parse tree
	 */
	exitArrayElement?: (ctx: ArrayElementContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.objectLiteral`.
	 * @param ctx the parse tree
	 */
	enterObjectLiteral?: (ctx: ObjectLiteralContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.objectLiteral`.
	 * @param ctx the parse tree
	 */
	exitObjectLiteral?: (ctx: ObjectLiteralContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.propertyAssignment`.
	 * @param ctx the parse tree
	 */
	enterPropertyAssignment?: (ctx: PropertyAssignmentContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.propertyAssignment`.
	 * @param ctx the parse tree
	 */
	exitPropertyAssignment?: (ctx: PropertyAssignmentContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.getAccessor`.
	 * @param ctx the parse tree
	 */
	enterGetAccessor?: (ctx: GetAccessorContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.getAccessor`.
	 * @param ctx the parse tree
	 */
	exitGetAccessor?: (ctx: GetAccessorContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.setAccessor`.
	 * @param ctx the parse tree
	 */
	enterSetAccessor?: (ctx: SetAccessorContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.setAccessor`.
	 * @param ctx the parse tree
	 */
	exitSetAccessor?: (ctx: SetAccessorContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.propertyName`.
	 * @param ctx the parse tree
	 */
	enterPropertyName?: (ctx: PropertyNameContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.propertyName`.
	 * @param ctx the parse tree
	 */
	exitPropertyName?: (ctx: PropertyNameContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.arguments`.
	 * @param ctx the parse tree
	 */
	enterArguments?: (ctx: ArgumentsContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.arguments`.
	 * @param ctx the parse tree
	 */
	exitArguments?: (ctx: ArgumentsContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.argumentList`.
	 * @param ctx the parse tree
	 */
	enterArgumentList?: (ctx: ArgumentListContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.argumentList`.
	 * @param ctx the parse tree
	 */
	exitArgumentList?: (ctx: ArgumentListContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.argument`.
	 * @param ctx the parse tree
	 */
	enterArgument?: (ctx: ArgumentContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.argument`.
	 * @param ctx the parse tree
	 */
	exitArgument?: (ctx: ArgumentContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.expressionSequence`.
	 * @param ctx the parse tree
	 */
	enterExpressionSequence?: (ctx: ExpressionSequenceContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.expressionSequence`.
	 * @param ctx the parse tree
	 */
	exitExpressionSequence?: (ctx: ExpressionSequenceContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.functionExpressionDeclaration`.
	 * @param ctx the parse tree
	 */
	enterFunctionExpressionDeclaration?: (ctx: FunctionExpressionDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.functionExpressionDeclaration`.
	 * @param ctx the parse tree
	 */
	exitFunctionExpressionDeclaration?: (ctx: FunctionExpressionDeclarationContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 */
	enterSingleExpression?: (ctx: SingleExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 */
	exitSingleExpression?: (ctx: SingleExpressionContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.asExpression`.
	 * @param ctx the parse tree
	 */
	enterAsExpression?: (ctx: AsExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.asExpression`.
	 * @param ctx the parse tree
	 */
	exitAsExpression?: (ctx: AsExpressionContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.arrowFunctionDeclaration`.
	 * @param ctx the parse tree
	 */
	enterArrowFunctionDeclaration?: (ctx: ArrowFunctionDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.arrowFunctionDeclaration`.
	 * @param ctx the parse tree
	 */
	exitArrowFunctionDeclaration?: (ctx: ArrowFunctionDeclarationContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.arrowFunctionParameters`.
	 * @param ctx the parse tree
	 */
	enterArrowFunctionParameters?: (ctx: ArrowFunctionParametersContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.arrowFunctionParameters`.
	 * @param ctx the parse tree
	 */
	exitArrowFunctionParameters?: (ctx: ArrowFunctionParametersContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.arrowFunctionBody`.
	 * @param ctx the parse tree
	 */
	enterArrowFunctionBody?: (ctx: ArrowFunctionBodyContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.arrowFunctionBody`.
	 * @param ctx the parse tree
	 */
	exitArrowFunctionBody?: (ctx: ArrowFunctionBodyContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.assignmentOperator`.
	 * @param ctx the parse tree
	 */
	enterAssignmentOperator?: (ctx: AssignmentOperatorContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.assignmentOperator`.
	 * @param ctx the parse tree
	 */
	exitAssignmentOperator?: (ctx: AssignmentOperatorContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.literal`.
	 * @param ctx the parse tree
	 */
	enterLiteral?: (ctx: LiteralContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.literal`.
	 * @param ctx the parse tree
	 */
	exitLiteral?: (ctx: LiteralContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.templateStringLiteral`.
	 * @param ctx the parse tree
	 */
	enterTemplateStringLiteral?: (ctx: TemplateStringLiteralContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.templateStringLiteral`.
	 * @param ctx the parse tree
	 */
	exitTemplateStringLiteral?: (ctx: TemplateStringLiteralContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.templateStringAtom`.
	 * @param ctx the parse tree
	 */
	enterTemplateStringAtom?: (ctx: TemplateStringAtomContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.templateStringAtom`.
	 * @param ctx the parse tree
	 */
	exitTemplateStringAtom?: (ctx: TemplateStringAtomContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.numericLiteral`.
	 * @param ctx the parse tree
	 */
	enterNumericLiteral?: (ctx: NumericLiteralContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.numericLiteral`.
	 * @param ctx the parse tree
	 */
	exitNumericLiteral?: (ctx: NumericLiteralContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.identifierName`.
	 * @param ctx the parse tree
	 */
	enterIdentifierName?: (ctx: IdentifierNameContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.identifierName`.
	 * @param ctx the parse tree
	 */
	exitIdentifierName?: (ctx: IdentifierNameContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.identifierOrKeyWord`.
	 * @param ctx the parse tree
	 */
	enterIdentifierOrKeyWord?: (ctx: IdentifierOrKeyWordContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.identifierOrKeyWord`.
	 * @param ctx the parse tree
	 */
	exitIdentifierOrKeyWord?: (ctx: IdentifierOrKeyWordContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.reservedWord`.
	 * @param ctx the parse tree
	 */
	enterReservedWord?: (ctx: ReservedWordContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.reservedWord`.
	 * @param ctx the parse tree
	 */
	exitReservedWord?: (ctx: ReservedWordContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.keyword`.
	 * @param ctx the parse tree
	 */
	enterKeyword?: (ctx: KeywordContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.keyword`.
	 * @param ctx the parse tree
	 */
	exitKeyword?: (ctx: KeywordContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.getter`.
	 * @param ctx the parse tree
	 */
	enterGetter?: (ctx: GetterContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.getter`.
	 * @param ctx the parse tree
	 */
	exitGetter?: (ctx: GetterContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.setter`.
	 * @param ctx the parse tree
	 */
	enterSetter?: (ctx: SetterContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.setter`.
	 * @param ctx the parse tree
	 */
	exitSetter?: (ctx: SetterContext) => void;

	/**
	 * Enter a parse tree produced by `TypeScriptParser.eos`.
	 * @param ctx the parse tree
	 */
	enterEos?: (ctx: EosContext) => void;
	/**
	 * Exit a parse tree produced by `TypeScriptParser.eos`.
	 * @param ctx the parse tree
	 */
	exitEos?: (ctx: EosContext) => void;
}

