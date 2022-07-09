// Generated from /gppd/intuita/intuita-vscode-extension/src/antlrC/C.g4 by ANTLR 4.9.0-SNAPSHOT


import { ParseTreeVisitor } from "antlr4ts/tree/ParseTreeVisitor";

import { PrimaryExpressionContext } from "./CParser";
import { GenericSelectionContext } from "./CParser";
import { GenericAssocListContext } from "./CParser";
import { GenericAssociationContext } from "./CParser";
import { PostfixExpressionContext } from "./CParser";
import { ArgumentExpressionListContext } from "./CParser";
import { UnaryExpressionContext } from "./CParser";
import { UnaryOperatorContext } from "./CParser";
import { CastExpressionContext } from "./CParser";
import { MultiplicativeExpressionContext } from "./CParser";
import { AdditiveExpressionContext } from "./CParser";
import { ShiftExpressionContext } from "./CParser";
import { RelationalExpressionContext } from "./CParser";
import { EqualityExpressionContext } from "./CParser";
import { AndExpressionContext } from "./CParser";
import { ExclusiveOrExpressionContext } from "./CParser";
import { InclusiveOrExpressionContext } from "./CParser";
import { LogicalAndExpressionContext } from "./CParser";
import { LogicalOrExpressionContext } from "./CParser";
import { ConditionalExpressionContext } from "./CParser";
import { AssignmentExpressionContext } from "./CParser";
import { AssignmentOperatorContext } from "./CParser";
import { ExpressionContext } from "./CParser";
import { ConstantExpressionContext } from "./CParser";
import { DeclarationContext } from "./CParser";
import { DeclarationSpecifiersContext } from "./CParser";
import { DeclarationSpecifiers2Context } from "./CParser";
import { DeclarationSpecifierContext } from "./CParser";
import { InitDeclaratorListContext } from "./CParser";
import { InitDeclaratorContext } from "./CParser";
import { StorageClassSpecifierContext } from "./CParser";
import { TypeSpecifierContext } from "./CParser";
import { StructOrUnionSpecifierContext } from "./CParser";
import { StructOrUnionContext } from "./CParser";
import { StructDeclarationListContext } from "./CParser";
import { StructDeclarationContext } from "./CParser";
import { SpecifierQualifierListContext } from "./CParser";
import { StructDeclaratorListContext } from "./CParser";
import { StructDeclaratorContext } from "./CParser";
import { EnumSpecifierContext } from "./CParser";
import { EnumeratorListContext } from "./CParser";
import { EnumeratorContext } from "./CParser";
import { EnumerationConstantContext } from "./CParser";
import { AtomicTypeSpecifierContext } from "./CParser";
import { TypeQualifierContext } from "./CParser";
import { FunctionSpecifierContext } from "./CParser";
import { AlignmentSpecifierContext } from "./CParser";
import { DeclaratorContext } from "./CParser";
import { DirectDeclaratorContext } from "./CParser";
import { VcSpecificModiferContext } from "./CParser";
import { GccDeclaratorExtensionContext } from "./CParser";
import { GccAttributeSpecifierContext } from "./CParser";
import { GccAttributeListContext } from "./CParser";
import { GccAttributeContext } from "./CParser";
import { NestedParenthesesBlockContext } from "./CParser";
import { PointerContext } from "./CParser";
import { TypeQualifierListContext } from "./CParser";
import { ParameterTypeListContext } from "./CParser";
import { ParameterListContext } from "./CParser";
import { ParameterDeclarationContext } from "./CParser";
import { IdentifierListContext } from "./CParser";
import { TypeNameContext } from "./CParser";
import { AbstractDeclaratorContext } from "./CParser";
import { DirectAbstractDeclaratorContext } from "./CParser";
import { TypedefNameContext } from "./CParser";
import { InitializerContext } from "./CParser";
import { InitializerListContext } from "./CParser";
import { DesignationContext } from "./CParser";
import { DesignatorListContext } from "./CParser";
import { DesignatorContext } from "./CParser";
import { StaticAssertDeclarationContext } from "./CParser";
import { StatementContext } from "./CParser";
import { LabeledStatementContext } from "./CParser";
import { CompoundStatementContext } from "./CParser";
import { BlockItemListContext } from "./CParser";
import { BlockItemContext } from "./CParser";
import { ExpressionStatementContext } from "./CParser";
import { SelectionStatementContext } from "./CParser";
import { IterationStatementContext } from "./CParser";
import { ForConditionContext } from "./CParser";
import { ForDeclarationContext } from "./CParser";
import { ForExpressionContext } from "./CParser";
import { JumpStatementContext } from "./CParser";
import { CompilationUnitContext } from "./CParser";
import { TranslationUnitContext } from "./CParser";
import { ExternalDeclarationContext } from "./CParser";
import { FunctionDefinitionContext } from "./CParser";
import { DeclarationListContext } from "./CParser";


/**
 * This interface defines a complete generic visitor for a parse tree produced
 * by `CParser`.
 *
 * @param <Result> The return type of the visit operation. Use `void` for
 * operations with no return type.
 */
export interface CVisitor<Result> extends ParseTreeVisitor<Result> {
	/**
	 * Visit a parse tree produced by `CParser.primaryExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPrimaryExpression?: (ctx: PrimaryExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by `CParser.genericSelection`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitGenericSelection?: (ctx: GenericSelectionContext) => Result;

	/**
	 * Visit a parse tree produced by `CParser.genericAssocList`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitGenericAssocList?: (ctx: GenericAssocListContext) => Result;

	/**
	 * Visit a parse tree produced by `CParser.genericAssociation`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitGenericAssociation?: (ctx: GenericAssociationContext) => Result;

	/**
	 * Visit a parse tree produced by `CParser.postfixExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPostfixExpression?: (ctx: PostfixExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by `CParser.argumentExpressionList`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitArgumentExpressionList?: (ctx: ArgumentExpressionListContext) => Result;

	/**
	 * Visit a parse tree produced by `CParser.unaryExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitUnaryExpression?: (ctx: UnaryExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by `CParser.unaryOperator`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitUnaryOperator?: (ctx: UnaryOperatorContext) => Result;

	/**
	 * Visit a parse tree produced by `CParser.castExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCastExpression?: (ctx: CastExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by `CParser.multiplicativeExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitMultiplicativeExpression?: (ctx: MultiplicativeExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by `CParser.additiveExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAdditiveExpression?: (ctx: AdditiveExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by `CParser.shiftExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitShiftExpression?: (ctx: ShiftExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by `CParser.relationalExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitRelationalExpression?: (ctx: RelationalExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by `CParser.equalityExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitEqualityExpression?: (ctx: EqualityExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by `CParser.andExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAndExpression?: (ctx: AndExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by `CParser.exclusiveOrExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitExclusiveOrExpression?: (ctx: ExclusiveOrExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by `CParser.inclusiveOrExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitInclusiveOrExpression?: (ctx: InclusiveOrExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by `CParser.logicalAndExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitLogicalAndExpression?: (ctx: LogicalAndExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by `CParser.logicalOrExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitLogicalOrExpression?: (ctx: LogicalOrExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by `CParser.conditionalExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitConditionalExpression?: (ctx: ConditionalExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by `CParser.assignmentExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAssignmentExpression?: (ctx: AssignmentExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by `CParser.assignmentOperator`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAssignmentOperator?: (ctx: AssignmentOperatorContext) => Result;

	/**
	 * Visit a parse tree produced by `CParser.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitExpression?: (ctx: ExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by `CParser.constantExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitConstantExpression?: (ctx: ConstantExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by `CParser.declaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDeclaration?: (ctx: DeclarationContext) => Result;

	/**
	 * Visit a parse tree produced by `CParser.declarationSpecifiers`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDeclarationSpecifiers?: (ctx: DeclarationSpecifiersContext) => Result;

	/**
	 * Visit a parse tree produced by `CParser.declarationSpecifiers2`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDeclarationSpecifiers2?: (ctx: DeclarationSpecifiers2Context) => Result;

	/**
	 * Visit a parse tree produced by `CParser.declarationSpecifier`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDeclarationSpecifier?: (ctx: DeclarationSpecifierContext) => Result;

	/**
	 * Visit a parse tree produced by `CParser.initDeclaratorList`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitInitDeclaratorList?: (ctx: InitDeclaratorListContext) => Result;

	/**
	 * Visit a parse tree produced by `CParser.initDeclarator`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitInitDeclarator?: (ctx: InitDeclaratorContext) => Result;

	/**
	 * Visit a parse tree produced by `CParser.storageClassSpecifier`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitStorageClassSpecifier?: (ctx: StorageClassSpecifierContext) => Result;

	/**
	 * Visit a parse tree produced by `CParser.typeSpecifier`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTypeSpecifier?: (ctx: TypeSpecifierContext) => Result;

	/**
	 * Visit a parse tree produced by `CParser.structOrUnionSpecifier`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitStructOrUnionSpecifier?: (ctx: StructOrUnionSpecifierContext) => Result;

	/**
	 * Visit a parse tree produced by `CParser.structOrUnion`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitStructOrUnion?: (ctx: StructOrUnionContext) => Result;

	/**
	 * Visit a parse tree produced by `CParser.structDeclarationList`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitStructDeclarationList?: (ctx: StructDeclarationListContext) => Result;

	/**
	 * Visit a parse tree produced by `CParser.structDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitStructDeclaration?: (ctx: StructDeclarationContext) => Result;

	/**
	 * Visit a parse tree produced by `CParser.specifierQualifierList`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitSpecifierQualifierList?: (ctx: SpecifierQualifierListContext) => Result;

	/**
	 * Visit a parse tree produced by `CParser.structDeclaratorList`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitStructDeclaratorList?: (ctx: StructDeclaratorListContext) => Result;

	/**
	 * Visit a parse tree produced by `CParser.structDeclarator`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitStructDeclarator?: (ctx: StructDeclaratorContext) => Result;

	/**
	 * Visit a parse tree produced by `CParser.enumSpecifier`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitEnumSpecifier?: (ctx: EnumSpecifierContext) => Result;

	/**
	 * Visit a parse tree produced by `CParser.enumeratorList`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitEnumeratorList?: (ctx: EnumeratorListContext) => Result;

	/**
	 * Visit a parse tree produced by `CParser.enumerator`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitEnumerator?: (ctx: EnumeratorContext) => Result;

	/**
	 * Visit a parse tree produced by `CParser.enumerationConstant`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitEnumerationConstant?: (ctx: EnumerationConstantContext) => Result;

	/**
	 * Visit a parse tree produced by `CParser.atomicTypeSpecifier`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAtomicTypeSpecifier?: (ctx: AtomicTypeSpecifierContext) => Result;

	/**
	 * Visit a parse tree produced by `CParser.typeQualifier`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTypeQualifier?: (ctx: TypeQualifierContext) => Result;

	/**
	 * Visit a parse tree produced by `CParser.functionSpecifier`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFunctionSpecifier?: (ctx: FunctionSpecifierContext) => Result;

	/**
	 * Visit a parse tree produced by `CParser.alignmentSpecifier`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAlignmentSpecifier?: (ctx: AlignmentSpecifierContext) => Result;

	/**
	 * Visit a parse tree produced by `CParser.declarator`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDeclarator?: (ctx: DeclaratorContext) => Result;

	/**
	 * Visit a parse tree produced by `CParser.directDeclarator`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDirectDeclarator?: (ctx: DirectDeclaratorContext) => Result;

	/**
	 * Visit a parse tree produced by `CParser.vcSpecificModifer`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitVcSpecificModifer?: (ctx: VcSpecificModiferContext) => Result;

	/**
	 * Visit a parse tree produced by `CParser.gccDeclaratorExtension`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitGccDeclaratorExtension?: (ctx: GccDeclaratorExtensionContext) => Result;

	/**
	 * Visit a parse tree produced by `CParser.gccAttributeSpecifier`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitGccAttributeSpecifier?: (ctx: GccAttributeSpecifierContext) => Result;

	/**
	 * Visit a parse tree produced by `CParser.gccAttributeList`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitGccAttributeList?: (ctx: GccAttributeListContext) => Result;

	/**
	 * Visit a parse tree produced by `CParser.gccAttribute`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitGccAttribute?: (ctx: GccAttributeContext) => Result;

	/**
	 * Visit a parse tree produced by `CParser.nestedParenthesesBlock`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitNestedParenthesesBlock?: (ctx: NestedParenthesesBlockContext) => Result;

	/**
	 * Visit a parse tree produced by `CParser.pointer`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPointer?: (ctx: PointerContext) => Result;

	/**
	 * Visit a parse tree produced by `CParser.typeQualifierList`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTypeQualifierList?: (ctx: TypeQualifierListContext) => Result;

	/**
	 * Visit a parse tree produced by `CParser.parameterTypeList`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitParameterTypeList?: (ctx: ParameterTypeListContext) => Result;

	/**
	 * Visit a parse tree produced by `CParser.parameterList`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitParameterList?: (ctx: ParameterListContext) => Result;

	/**
	 * Visit a parse tree produced by `CParser.parameterDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitParameterDeclaration?: (ctx: ParameterDeclarationContext) => Result;

	/**
	 * Visit a parse tree produced by `CParser.identifierList`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitIdentifierList?: (ctx: IdentifierListContext) => Result;

	/**
	 * Visit a parse tree produced by `CParser.typeName`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTypeName?: (ctx: TypeNameContext) => Result;

	/**
	 * Visit a parse tree produced by `CParser.abstractDeclarator`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAbstractDeclarator?: (ctx: AbstractDeclaratorContext) => Result;

	/**
	 * Visit a parse tree produced by `CParser.directAbstractDeclarator`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDirectAbstractDeclarator?: (ctx: DirectAbstractDeclaratorContext) => Result;

	/**
	 * Visit a parse tree produced by `CParser.typedefName`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTypedefName?: (ctx: TypedefNameContext) => Result;

	/**
	 * Visit a parse tree produced by `CParser.initializer`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitInitializer?: (ctx: InitializerContext) => Result;

	/**
	 * Visit a parse tree produced by `CParser.initializerList`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitInitializerList?: (ctx: InitializerListContext) => Result;

	/**
	 * Visit a parse tree produced by `CParser.designation`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDesignation?: (ctx: DesignationContext) => Result;

	/**
	 * Visit a parse tree produced by `CParser.designatorList`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDesignatorList?: (ctx: DesignatorListContext) => Result;

	/**
	 * Visit a parse tree produced by `CParser.designator`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDesignator?: (ctx: DesignatorContext) => Result;

	/**
	 * Visit a parse tree produced by `CParser.staticAssertDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitStaticAssertDeclaration?: (ctx: StaticAssertDeclarationContext) => Result;

	/**
	 * Visit a parse tree produced by `CParser.statement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitStatement?: (ctx: StatementContext) => Result;

	/**
	 * Visit a parse tree produced by `CParser.labeledStatement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitLabeledStatement?: (ctx: LabeledStatementContext) => Result;

	/**
	 * Visit a parse tree produced by `CParser.compoundStatement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCompoundStatement?: (ctx: CompoundStatementContext) => Result;

	/**
	 * Visit a parse tree produced by `CParser.blockItemList`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitBlockItemList?: (ctx: BlockItemListContext) => Result;

	/**
	 * Visit a parse tree produced by `CParser.blockItem`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitBlockItem?: (ctx: BlockItemContext) => Result;

	/**
	 * Visit a parse tree produced by `CParser.expressionStatement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitExpressionStatement?: (ctx: ExpressionStatementContext) => Result;

	/**
	 * Visit a parse tree produced by `CParser.selectionStatement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitSelectionStatement?: (ctx: SelectionStatementContext) => Result;

	/**
	 * Visit a parse tree produced by `CParser.iterationStatement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitIterationStatement?: (ctx: IterationStatementContext) => Result;

	/**
	 * Visit a parse tree produced by `CParser.forCondition`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitForCondition?: (ctx: ForConditionContext) => Result;

	/**
	 * Visit a parse tree produced by `CParser.forDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitForDeclaration?: (ctx: ForDeclarationContext) => Result;

	/**
	 * Visit a parse tree produced by `CParser.forExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitForExpression?: (ctx: ForExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by `CParser.jumpStatement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitJumpStatement?: (ctx: JumpStatementContext) => Result;

	/**
	 * Visit a parse tree produced by `CParser.compilationUnit`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCompilationUnit?: (ctx: CompilationUnitContext) => Result;

	/**
	 * Visit a parse tree produced by `CParser.translationUnit`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTranslationUnit?: (ctx: TranslationUnitContext) => Result;

	/**
	 * Visit a parse tree produced by `CParser.externalDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitExternalDeclaration?: (ctx: ExternalDeclarationContext) => Result;

	/**
	 * Visit a parse tree produced by `CParser.functionDefinition`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFunctionDefinition?: (ctx: FunctionDefinitionContext) => Result;

	/**
	 * Visit a parse tree produced by `CParser.declarationList`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDeclarationList?: (ctx: DeclarationListContext) => Result;
}

