// Generated from /gppd/intuita/intuita-vscode-extension/src/antlrTypeScript/lexer/TypeScriptParser.g4 by ANTLR 4.9.0-SNAPSHOT


import { ParseTreeVisitor } from "antlr4ts/tree/ParseTreeVisitor";

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
 * This interface defines a complete generic visitor for a parse tree produced
 * by `TypeScriptParser`.
 *
 * @param <Result> The return type of the visit operation. Use `void` for
 * operations with no return type.
 */
export interface TypeScriptParserVisitor<Result> extends ParseTreeVisitor<Result> {
	/**
	 * Visit a parse tree produced by the `ParenthesizedPrimType`
	 * labeled alternative in `TypeScriptParser.primaryType`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitParenthesizedPrimType?: (ctx: ParenthesizedPrimTypeContext) => Result;

	/**
	 * Visit a parse tree produced by the `PredefinedPrimType`
	 * labeled alternative in `TypeScriptParser.primaryType`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPredefinedPrimType?: (ctx: PredefinedPrimTypeContext) => Result;

	/**
	 * Visit a parse tree produced by the `ReferencePrimType`
	 * labeled alternative in `TypeScriptParser.primaryType`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitReferencePrimType?: (ctx: ReferencePrimTypeContext) => Result;

	/**
	 * Visit a parse tree produced by the `ObjectPrimType`
	 * labeled alternative in `TypeScriptParser.primaryType`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitObjectPrimType?: (ctx: ObjectPrimTypeContext) => Result;

	/**
	 * Visit a parse tree produced by the `ArrayPrimType`
	 * labeled alternative in `TypeScriptParser.primaryType`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitArrayPrimType?: (ctx: ArrayPrimTypeContext) => Result;

	/**
	 * Visit a parse tree produced by the `TuplePrimType`
	 * labeled alternative in `TypeScriptParser.primaryType`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTuplePrimType?: (ctx: TuplePrimTypeContext) => Result;

	/**
	 * Visit a parse tree produced by the `QueryPrimType`
	 * labeled alternative in `TypeScriptParser.primaryType`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitQueryPrimType?: (ctx: QueryPrimTypeContext) => Result;

	/**
	 * Visit a parse tree produced by the `ThisPrimType`
	 * labeled alternative in `TypeScriptParser.primaryType`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitThisPrimType?: (ctx: ThisPrimTypeContext) => Result;

	/**
	 * Visit a parse tree produced by the `RedefinitionOfType`
	 * labeled alternative in `TypeScriptParser.primaryType`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitRedefinitionOfType?: (ctx: RedefinitionOfTypeContext) => Result;

	/**
	 * Visit a parse tree produced by the `DoStatement`
	 * labeled alternative in `TypeScriptParser.iterationStatement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDoStatement?: (ctx: DoStatementContext) => Result;

	/**
	 * Visit a parse tree produced by the `WhileStatement`
	 * labeled alternative in `TypeScriptParser.iterationStatement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitWhileStatement?: (ctx: WhileStatementContext) => Result;

	/**
	 * Visit a parse tree produced by the `ForStatement`
	 * labeled alternative in `TypeScriptParser.iterationStatement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitForStatement?: (ctx: ForStatementContext) => Result;

	/**
	 * Visit a parse tree produced by the `ForVarStatement`
	 * labeled alternative in `TypeScriptParser.iterationStatement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitForVarStatement?: (ctx: ForVarStatementContext) => Result;

	/**
	 * Visit a parse tree produced by the `ForInStatement`
	 * labeled alternative in `TypeScriptParser.iterationStatement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitForInStatement?: (ctx: ForInStatementContext) => Result;

	/**
	 * Visit a parse tree produced by the `ForVarInStatement`
	 * labeled alternative in `TypeScriptParser.iterationStatement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitForVarInStatement?: (ctx: ForVarInStatementContext) => Result;

	/**
	 * Visit a parse tree produced by the `FunctionExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFunctionExpression?: (ctx: FunctionExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by the `ArrowFunctionExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitArrowFunctionExpression?: (ctx: ArrowFunctionExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by the `ClassExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitClassExpression?: (ctx: ClassExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by the `MemberIndexExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitMemberIndexExpression?: (ctx: MemberIndexExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by the `MemberDotExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitMemberDotExpression?: (ctx: MemberDotExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by the `NewExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitNewExpression?: (ctx: NewExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by the `ArgumentsExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitArgumentsExpression?: (ctx: ArgumentsExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by the `PostIncrementExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPostIncrementExpression?: (ctx: PostIncrementExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by the `PostDecreaseExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPostDecreaseExpression?: (ctx: PostDecreaseExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by the `DeleteExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDeleteExpression?: (ctx: DeleteExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by the `VoidExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitVoidExpression?: (ctx: VoidExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by the `TypeofExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTypeofExpression?: (ctx: TypeofExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by the `PreIncrementExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPreIncrementExpression?: (ctx: PreIncrementExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by the `PreDecreaseExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPreDecreaseExpression?: (ctx: PreDecreaseExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by the `UnaryPlusExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitUnaryPlusExpression?: (ctx: UnaryPlusExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by the `UnaryMinusExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitUnaryMinusExpression?: (ctx: UnaryMinusExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by the `BitNotExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitBitNotExpression?: (ctx: BitNotExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by the `NotExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitNotExpression?: (ctx: NotExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by the `MultiplicativeExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitMultiplicativeExpression?: (ctx: MultiplicativeExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by the `AdditiveExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAdditiveExpression?: (ctx: AdditiveExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by the `BitShiftExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitBitShiftExpression?: (ctx: BitShiftExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by the `RelationalExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitRelationalExpression?: (ctx: RelationalExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by the `InstanceofExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitInstanceofExpression?: (ctx: InstanceofExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by the `InExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitInExpression?: (ctx: InExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by the `EqualityExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitEqualityExpression?: (ctx: EqualityExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by the `BitAndExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitBitAndExpression?: (ctx: BitAndExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by the `BitXOrExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitBitXOrExpression?: (ctx: BitXOrExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by the `BitOrExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitBitOrExpression?: (ctx: BitOrExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by the `LogicalAndExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitLogicalAndExpression?: (ctx: LogicalAndExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by the `LogicalOrExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitLogicalOrExpression?: (ctx: LogicalOrExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by the `TernaryExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTernaryExpression?: (ctx: TernaryExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by the `AssignmentExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAssignmentExpression?: (ctx: AssignmentExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by the `AssignmentOperatorExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAssignmentOperatorExpression?: (ctx: AssignmentOperatorExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by the `TemplateStringExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTemplateStringExpression?: (ctx: TemplateStringExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by the `IteratorsExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitIteratorsExpression?: (ctx: IteratorsExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by the `GeneratorsExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitGeneratorsExpression?: (ctx: GeneratorsExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by the `GeneratorsFunctionExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitGeneratorsFunctionExpression?: (ctx: GeneratorsFunctionExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by the `YieldExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitYieldExpression?: (ctx: YieldExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by the `ThisExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitThisExpression?: (ctx: ThisExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by the `IdentifierExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitIdentifierExpression?: (ctx: IdentifierExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by the `SuperExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitSuperExpression?: (ctx: SuperExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by the `LiteralExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitLiteralExpression?: (ctx: LiteralExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by the `ArrayLiteralExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitArrayLiteralExpression?: (ctx: ArrayLiteralExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by the `ObjectLiteralExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitObjectLiteralExpression?: (ctx: ObjectLiteralExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by the `ParenthesizedExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitParenthesizedExpression?: (ctx: ParenthesizedExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by the `GenericTypes`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitGenericTypes?: (ctx: GenericTypesContext) => Result;

	/**
	 * Visit a parse tree produced by the `CastAsExpression`
	 * labeled alternative in `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCastAsExpression?: (ctx: CastAsExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by the `PropertyDeclarationExpression`
	 * labeled alternative in `TypeScriptParser.propertyMemberDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPropertyDeclarationExpression?: (ctx: PropertyDeclarationExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by the `MethodDeclarationExpression`
	 * labeled alternative in `TypeScriptParser.propertyMemberDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitMethodDeclarationExpression?: (ctx: MethodDeclarationExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by the `GetterSetterDeclarationExpression`
	 * labeled alternative in `TypeScriptParser.propertyMemberDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitGetterSetterDeclarationExpression?: (ctx: GetterSetterDeclarationExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by the `AbstractMemberDeclaration`
	 * labeled alternative in `TypeScriptParser.propertyMemberDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAbstractMemberDeclaration?: (ctx: AbstractMemberDeclarationContext) => Result;

	/**
	 * Visit a parse tree produced by the `PropertyExpressionAssignment`
	 * labeled alternative in `TypeScriptParser.propertyAssignment`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPropertyExpressionAssignment?: (ctx: PropertyExpressionAssignmentContext) => Result;

	/**
	 * Visit a parse tree produced by the `ComputedPropertyExpressionAssignment`
	 * labeled alternative in `TypeScriptParser.propertyAssignment`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitComputedPropertyExpressionAssignment?: (ctx: ComputedPropertyExpressionAssignmentContext) => Result;

	/**
	 * Visit a parse tree produced by the `PropertyGetter`
	 * labeled alternative in `TypeScriptParser.propertyAssignment`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPropertyGetter?: (ctx: PropertyGetterContext) => Result;

	/**
	 * Visit a parse tree produced by the `PropertySetter`
	 * labeled alternative in `TypeScriptParser.propertyAssignment`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPropertySetter?: (ctx: PropertySetterContext) => Result;

	/**
	 * Visit a parse tree produced by the `MethodProperty`
	 * labeled alternative in `TypeScriptParser.propertyAssignment`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitMethodProperty?: (ctx: MethodPropertyContext) => Result;

	/**
	 * Visit a parse tree produced by the `PropertyShorthand`
	 * labeled alternative in `TypeScriptParser.propertyAssignment`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPropertyShorthand?: (ctx: PropertyShorthandContext) => Result;

	/**
	 * Visit a parse tree produced by the `RestParameterInObject`
	 * labeled alternative in `TypeScriptParser.propertyAssignment`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitRestParameterInObject?: (ctx: RestParameterInObjectContext) => Result;

	/**
	 * Visit a parse tree produced by the `Union`
	 * labeled alternative in `TypeScriptParser.unionOrIntersectionOrPrimaryType`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitUnion?: (ctx: UnionContext) => Result;

	/**
	 * Visit a parse tree produced by the `Intersection`
	 * labeled alternative in `TypeScriptParser.unionOrIntersectionOrPrimaryType`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitIntersection?: (ctx: IntersectionContext) => Result;

	/**
	 * Visit a parse tree produced by the `Primary`
	 * labeled alternative in `TypeScriptParser.unionOrIntersectionOrPrimaryType`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPrimary?: (ctx: PrimaryContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.initializer`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitInitializer?: (ctx: InitializerContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.bindingPattern`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitBindingPattern?: (ctx: BindingPatternContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.typeParameters`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTypeParameters?: (ctx: TypeParametersContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.typeParameterList`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTypeParameterList?: (ctx: TypeParameterListContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.typeParameter`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTypeParameter?: (ctx: TypeParameterContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.constraint`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitConstraint?: (ctx: ConstraintContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.typeArguments`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTypeArguments?: (ctx: TypeArgumentsContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.typeArgumentList`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTypeArgumentList?: (ctx: TypeArgumentListContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.typeArgument`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTypeArgument?: (ctx: TypeArgumentContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.type_`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitType_?: (ctx: Type_Context) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.unionOrIntersectionOrPrimaryType`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitUnionOrIntersectionOrPrimaryType?: (ctx: UnionOrIntersectionOrPrimaryTypeContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.primaryType`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPrimaryType?: (ctx: PrimaryTypeContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.predefinedType`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPredefinedType?: (ctx: PredefinedTypeContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.typeReference`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTypeReference?: (ctx: TypeReferenceContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.nestedTypeGeneric`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitNestedTypeGeneric?: (ctx: NestedTypeGenericContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.typeGeneric`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTypeGeneric?: (ctx: TypeGenericContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.typeIncludeGeneric`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTypeIncludeGeneric?: (ctx: TypeIncludeGenericContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.typeName`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTypeName?: (ctx: TypeNameContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.objectType`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitObjectType?: (ctx: ObjectTypeContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.typeBody`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTypeBody?: (ctx: TypeBodyContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.typeMemberList`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTypeMemberList?: (ctx: TypeMemberListContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.typeMember`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTypeMember?: (ctx: TypeMemberContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.arrayType`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitArrayType?: (ctx: ArrayTypeContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.tupleType`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTupleType?: (ctx: TupleTypeContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.tupleElementTypes`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTupleElementTypes?: (ctx: TupleElementTypesContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.functionType`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFunctionType?: (ctx: FunctionTypeContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.constructorType`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitConstructorType?: (ctx: ConstructorTypeContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.typeQuery`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTypeQuery?: (ctx: TypeQueryContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.typeQueryExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTypeQueryExpression?: (ctx: TypeQueryExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.propertySignatur`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPropertySignatur?: (ctx: PropertySignaturContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.typeAnnotation`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTypeAnnotation?: (ctx: TypeAnnotationContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.callSignature`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCallSignature?: (ctx: CallSignatureContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.parameterList`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitParameterList?: (ctx: ParameterListContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.requiredParameterList`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitRequiredParameterList?: (ctx: RequiredParameterListContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.parameter`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitParameter?: (ctx: ParameterContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.optionalParameter`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitOptionalParameter?: (ctx: OptionalParameterContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.restParameter`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitRestParameter?: (ctx: RestParameterContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.requiredParameter`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitRequiredParameter?: (ctx: RequiredParameterContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.accessibilityModifier`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAccessibilityModifier?: (ctx: AccessibilityModifierContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.identifierOrPattern`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitIdentifierOrPattern?: (ctx: IdentifierOrPatternContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.constructSignature`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitConstructSignature?: (ctx: ConstructSignatureContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.indexSignature`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitIndexSignature?: (ctx: IndexSignatureContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.methodSignature`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitMethodSignature?: (ctx: MethodSignatureContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.typeAliasDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTypeAliasDeclaration?: (ctx: TypeAliasDeclarationContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.constructorDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitConstructorDeclaration?: (ctx: ConstructorDeclarationContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.interfaceDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitInterfaceDeclaration?: (ctx: InterfaceDeclarationContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.interfaceExtendsClause`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitInterfaceExtendsClause?: (ctx: InterfaceExtendsClauseContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.classOrInterfaceTypeList`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitClassOrInterfaceTypeList?: (ctx: ClassOrInterfaceTypeListContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.enumDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitEnumDeclaration?: (ctx: EnumDeclarationContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.enumBody`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitEnumBody?: (ctx: EnumBodyContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.enumMemberList`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitEnumMemberList?: (ctx: EnumMemberListContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.enumMember`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitEnumMember?: (ctx: EnumMemberContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.namespaceDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitNamespaceDeclaration?: (ctx: NamespaceDeclarationContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.namespaceName`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitNamespaceName?: (ctx: NamespaceNameContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.importAliasDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitImportAliasDeclaration?: (ctx: ImportAliasDeclarationContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.decoratorList`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDecoratorList?: (ctx: DecoratorListContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.decorator`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDecorator?: (ctx: DecoratorContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.decoratorMemberExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDecoratorMemberExpression?: (ctx: DecoratorMemberExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.decoratorCallExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDecoratorCallExpression?: (ctx: DecoratorCallExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.program`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitProgram?: (ctx: ProgramContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.sourceElement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitSourceElement?: (ctx: SourceElementContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.statement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitStatement?: (ctx: StatementContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.block`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitBlock?: (ctx: BlockContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.statementList`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitStatementList?: (ctx: StatementListContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.abstractDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAbstractDeclaration?: (ctx: AbstractDeclarationContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.importStatement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitImportStatement?: (ctx: ImportStatementContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.fromBlock`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFromBlock?: (ctx: FromBlockContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.multipleImportStatement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitMultipleImportStatement?: (ctx: MultipleImportStatementContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.exportStatement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitExportStatement?: (ctx: ExportStatementContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.variableStatement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitVariableStatement?: (ctx: VariableStatementContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.variableDeclarationList`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitVariableDeclarationList?: (ctx: VariableDeclarationListContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.variableDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitVariableDeclaration?: (ctx: VariableDeclarationContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.emptyStatement_`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitEmptyStatement_?: (ctx: EmptyStatement_Context) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.expressionStatement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitExpressionStatement?: (ctx: ExpressionStatementContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.ifStatement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitIfStatement?: (ctx: IfStatementContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.iterationStatement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitIterationStatement?: (ctx: IterationStatementContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.varModifier`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitVarModifier?: (ctx: VarModifierContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.continueStatement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitContinueStatement?: (ctx: ContinueStatementContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.breakStatement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitBreakStatement?: (ctx: BreakStatementContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.returnStatement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitReturnStatement?: (ctx: ReturnStatementContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.yieldStatement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitYieldStatement?: (ctx: YieldStatementContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.withStatement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitWithStatement?: (ctx: WithStatementContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.switchStatement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitSwitchStatement?: (ctx: SwitchStatementContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.caseBlock`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCaseBlock?: (ctx: CaseBlockContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.caseClauses`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCaseClauses?: (ctx: CaseClausesContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.caseClause`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCaseClause?: (ctx: CaseClauseContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.defaultClause`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDefaultClause?: (ctx: DefaultClauseContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.labelledStatement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitLabelledStatement?: (ctx: LabelledStatementContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.throwStatement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitThrowStatement?: (ctx: ThrowStatementContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.tryStatement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTryStatement?: (ctx: TryStatementContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.catchProduction`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCatchProduction?: (ctx: CatchProductionContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.finallyProduction`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFinallyProduction?: (ctx: FinallyProductionContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.debuggerStatement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDebuggerStatement?: (ctx: DebuggerStatementContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.functionDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFunctionDeclaration?: (ctx: FunctionDeclarationContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.classDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitClassDeclaration?: (ctx: ClassDeclarationContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.classHeritage`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitClassHeritage?: (ctx: ClassHeritageContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.classTail`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitClassTail?: (ctx: ClassTailContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.classExtendsClause`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitClassExtendsClause?: (ctx: ClassExtendsClauseContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.implementsClause`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitImplementsClause?: (ctx: ImplementsClauseContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.classElement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitClassElement?: (ctx: ClassElementContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.propertyMemberDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPropertyMemberDeclaration?: (ctx: PropertyMemberDeclarationContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.propertyMemberBase`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPropertyMemberBase?: (ctx: PropertyMemberBaseContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.indexMemberDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitIndexMemberDeclaration?: (ctx: IndexMemberDeclarationContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.generatorMethod`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitGeneratorMethod?: (ctx: GeneratorMethodContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.generatorFunctionDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitGeneratorFunctionDeclaration?: (ctx: GeneratorFunctionDeclarationContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.generatorBlock`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitGeneratorBlock?: (ctx: GeneratorBlockContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.generatorDefinition`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitGeneratorDefinition?: (ctx: GeneratorDefinitionContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.iteratorBlock`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitIteratorBlock?: (ctx: IteratorBlockContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.iteratorDefinition`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitIteratorDefinition?: (ctx: IteratorDefinitionContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.formalParameterList`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFormalParameterList?: (ctx: FormalParameterListContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.formalParameterArg`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFormalParameterArg?: (ctx: FormalParameterArgContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.lastFormalParameterArg`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitLastFormalParameterArg?: (ctx: LastFormalParameterArgContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.functionBody`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFunctionBody?: (ctx: FunctionBodyContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.sourceElements`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitSourceElements?: (ctx: SourceElementsContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.arrayLiteral`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitArrayLiteral?: (ctx: ArrayLiteralContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.elementList`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitElementList?: (ctx: ElementListContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.arrayElement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitArrayElement?: (ctx: ArrayElementContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.objectLiteral`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitObjectLiteral?: (ctx: ObjectLiteralContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.propertyAssignment`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPropertyAssignment?: (ctx: PropertyAssignmentContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.getAccessor`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitGetAccessor?: (ctx: GetAccessorContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.setAccessor`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitSetAccessor?: (ctx: SetAccessorContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.propertyName`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPropertyName?: (ctx: PropertyNameContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.arguments`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitArguments?: (ctx: ArgumentsContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.argumentList`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitArgumentList?: (ctx: ArgumentListContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.argument`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitArgument?: (ctx: ArgumentContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.expressionSequence`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitExpressionSequence?: (ctx: ExpressionSequenceContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.functionExpressionDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFunctionExpressionDeclaration?: (ctx: FunctionExpressionDeclarationContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.singleExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitSingleExpression?: (ctx: SingleExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.asExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAsExpression?: (ctx: AsExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.arrowFunctionDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitArrowFunctionDeclaration?: (ctx: ArrowFunctionDeclarationContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.arrowFunctionParameters`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitArrowFunctionParameters?: (ctx: ArrowFunctionParametersContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.arrowFunctionBody`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitArrowFunctionBody?: (ctx: ArrowFunctionBodyContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.assignmentOperator`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAssignmentOperator?: (ctx: AssignmentOperatorContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.literal`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitLiteral?: (ctx: LiteralContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.templateStringLiteral`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTemplateStringLiteral?: (ctx: TemplateStringLiteralContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.templateStringAtom`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTemplateStringAtom?: (ctx: TemplateStringAtomContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.numericLiteral`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitNumericLiteral?: (ctx: NumericLiteralContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.identifierName`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitIdentifierName?: (ctx: IdentifierNameContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.identifierOrKeyWord`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitIdentifierOrKeyWord?: (ctx: IdentifierOrKeyWordContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.reservedWord`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitReservedWord?: (ctx: ReservedWordContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.keyword`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitKeyword?: (ctx: KeywordContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.getter`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitGetter?: (ctx: GetterContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.setter`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitSetter?: (ctx: SetterContext) => Result;

	/**
	 * Visit a parse tree produced by `TypeScriptParser.eos`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitEos?: (ctx: EosContext) => Result;
}

