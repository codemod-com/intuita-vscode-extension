// Generated from /gppd/intuita/intuita-vscode-extension/src/antlrC/C.g4 by ANTLR 4.9.0-SNAPSHOT


import { ParseTreeListener } from "antlr4ts/tree/ParseTreeListener";

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
 * This interface defines a complete listener for a parse tree produced by
 * `CParser`.
 */
export interface CListener extends ParseTreeListener {
	/**
	 * Enter a parse tree produced by `CParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	enterPrimaryExpression?: (ctx: PrimaryExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `CParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	exitPrimaryExpression?: (ctx: PrimaryExpressionContext) => void;

	/**
	 * Enter a parse tree produced by `CParser.genericSelection`.
	 * @param ctx the parse tree
	 */
	enterGenericSelection?: (ctx: GenericSelectionContext) => void;
	/**
	 * Exit a parse tree produced by `CParser.genericSelection`.
	 * @param ctx the parse tree
	 */
	exitGenericSelection?: (ctx: GenericSelectionContext) => void;

	/**
	 * Enter a parse tree produced by `CParser.genericAssocList`.
	 * @param ctx the parse tree
	 */
	enterGenericAssocList?: (ctx: GenericAssocListContext) => void;
	/**
	 * Exit a parse tree produced by `CParser.genericAssocList`.
	 * @param ctx the parse tree
	 */
	exitGenericAssocList?: (ctx: GenericAssocListContext) => void;

	/**
	 * Enter a parse tree produced by `CParser.genericAssociation`.
	 * @param ctx the parse tree
	 */
	enterGenericAssociation?: (ctx: GenericAssociationContext) => void;
	/**
	 * Exit a parse tree produced by `CParser.genericAssociation`.
	 * @param ctx the parse tree
	 */
	exitGenericAssociation?: (ctx: GenericAssociationContext) => void;

	/**
	 * Enter a parse tree produced by `CParser.postfixExpression`.
	 * @param ctx the parse tree
	 */
	enterPostfixExpression?: (ctx: PostfixExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `CParser.postfixExpression`.
	 * @param ctx the parse tree
	 */
	exitPostfixExpression?: (ctx: PostfixExpressionContext) => void;

	/**
	 * Enter a parse tree produced by `CParser.argumentExpressionList`.
	 * @param ctx the parse tree
	 */
	enterArgumentExpressionList?: (ctx: ArgumentExpressionListContext) => void;
	/**
	 * Exit a parse tree produced by `CParser.argumentExpressionList`.
	 * @param ctx the parse tree
	 */
	exitArgumentExpressionList?: (ctx: ArgumentExpressionListContext) => void;

	/**
	 * Enter a parse tree produced by `CParser.unaryExpression`.
	 * @param ctx the parse tree
	 */
	enterUnaryExpression?: (ctx: UnaryExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `CParser.unaryExpression`.
	 * @param ctx the parse tree
	 */
	exitUnaryExpression?: (ctx: UnaryExpressionContext) => void;

	/**
	 * Enter a parse tree produced by `CParser.unaryOperator`.
	 * @param ctx the parse tree
	 */
	enterUnaryOperator?: (ctx: UnaryOperatorContext) => void;
	/**
	 * Exit a parse tree produced by `CParser.unaryOperator`.
	 * @param ctx the parse tree
	 */
	exitUnaryOperator?: (ctx: UnaryOperatorContext) => void;

	/**
	 * Enter a parse tree produced by `CParser.castExpression`.
	 * @param ctx the parse tree
	 */
	enterCastExpression?: (ctx: CastExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `CParser.castExpression`.
	 * @param ctx the parse tree
	 */
	exitCastExpression?: (ctx: CastExpressionContext) => void;

	/**
	 * Enter a parse tree produced by `CParser.multiplicativeExpression`.
	 * @param ctx the parse tree
	 */
	enterMultiplicativeExpression?: (ctx: MultiplicativeExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `CParser.multiplicativeExpression`.
	 * @param ctx the parse tree
	 */
	exitMultiplicativeExpression?: (ctx: MultiplicativeExpressionContext) => void;

	/**
	 * Enter a parse tree produced by `CParser.additiveExpression`.
	 * @param ctx the parse tree
	 */
	enterAdditiveExpression?: (ctx: AdditiveExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `CParser.additiveExpression`.
	 * @param ctx the parse tree
	 */
	exitAdditiveExpression?: (ctx: AdditiveExpressionContext) => void;

	/**
	 * Enter a parse tree produced by `CParser.shiftExpression`.
	 * @param ctx the parse tree
	 */
	enterShiftExpression?: (ctx: ShiftExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `CParser.shiftExpression`.
	 * @param ctx the parse tree
	 */
	exitShiftExpression?: (ctx: ShiftExpressionContext) => void;

	/**
	 * Enter a parse tree produced by `CParser.relationalExpression`.
	 * @param ctx the parse tree
	 */
	enterRelationalExpression?: (ctx: RelationalExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `CParser.relationalExpression`.
	 * @param ctx the parse tree
	 */
	exitRelationalExpression?: (ctx: RelationalExpressionContext) => void;

	/**
	 * Enter a parse tree produced by `CParser.equalityExpression`.
	 * @param ctx the parse tree
	 */
	enterEqualityExpression?: (ctx: EqualityExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `CParser.equalityExpression`.
	 * @param ctx the parse tree
	 */
	exitEqualityExpression?: (ctx: EqualityExpressionContext) => void;

	/**
	 * Enter a parse tree produced by `CParser.andExpression`.
	 * @param ctx the parse tree
	 */
	enterAndExpression?: (ctx: AndExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `CParser.andExpression`.
	 * @param ctx the parse tree
	 */
	exitAndExpression?: (ctx: AndExpressionContext) => void;

	/**
	 * Enter a parse tree produced by `CParser.exclusiveOrExpression`.
	 * @param ctx the parse tree
	 */
	enterExclusiveOrExpression?: (ctx: ExclusiveOrExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `CParser.exclusiveOrExpression`.
	 * @param ctx the parse tree
	 */
	exitExclusiveOrExpression?: (ctx: ExclusiveOrExpressionContext) => void;

	/**
	 * Enter a parse tree produced by `CParser.inclusiveOrExpression`.
	 * @param ctx the parse tree
	 */
	enterInclusiveOrExpression?: (ctx: InclusiveOrExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `CParser.inclusiveOrExpression`.
	 * @param ctx the parse tree
	 */
	exitInclusiveOrExpression?: (ctx: InclusiveOrExpressionContext) => void;

	/**
	 * Enter a parse tree produced by `CParser.logicalAndExpression`.
	 * @param ctx the parse tree
	 */
	enterLogicalAndExpression?: (ctx: LogicalAndExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `CParser.logicalAndExpression`.
	 * @param ctx the parse tree
	 */
	exitLogicalAndExpression?: (ctx: LogicalAndExpressionContext) => void;

	/**
	 * Enter a parse tree produced by `CParser.logicalOrExpression`.
	 * @param ctx the parse tree
	 */
	enterLogicalOrExpression?: (ctx: LogicalOrExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `CParser.logicalOrExpression`.
	 * @param ctx the parse tree
	 */
	exitLogicalOrExpression?: (ctx: LogicalOrExpressionContext) => void;

	/**
	 * Enter a parse tree produced by `CParser.conditionalExpression`.
	 * @param ctx the parse tree
	 */
	enterConditionalExpression?: (ctx: ConditionalExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `CParser.conditionalExpression`.
	 * @param ctx the parse tree
	 */
	exitConditionalExpression?: (ctx: ConditionalExpressionContext) => void;

	/**
	 * Enter a parse tree produced by `CParser.assignmentExpression`.
	 * @param ctx the parse tree
	 */
	enterAssignmentExpression?: (ctx: AssignmentExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `CParser.assignmentExpression`.
	 * @param ctx the parse tree
	 */
	exitAssignmentExpression?: (ctx: AssignmentExpressionContext) => void;

	/**
	 * Enter a parse tree produced by `CParser.assignmentOperator`.
	 * @param ctx the parse tree
	 */
	enterAssignmentOperator?: (ctx: AssignmentOperatorContext) => void;
	/**
	 * Exit a parse tree produced by `CParser.assignmentOperator`.
	 * @param ctx the parse tree
	 */
	exitAssignmentOperator?: (ctx: AssignmentOperatorContext) => void;

	/**
	 * Enter a parse tree produced by `CParser.expression`.
	 * @param ctx the parse tree
	 */
	enterExpression?: (ctx: ExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `CParser.expression`.
	 * @param ctx the parse tree
	 */
	exitExpression?: (ctx: ExpressionContext) => void;

	/**
	 * Enter a parse tree produced by `CParser.constantExpression`.
	 * @param ctx the parse tree
	 */
	enterConstantExpression?: (ctx: ConstantExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `CParser.constantExpression`.
	 * @param ctx the parse tree
	 */
	exitConstantExpression?: (ctx: ConstantExpressionContext) => void;

	/**
	 * Enter a parse tree produced by `CParser.declaration`.
	 * @param ctx the parse tree
	 */
	enterDeclaration?: (ctx: DeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `CParser.declaration`.
	 * @param ctx the parse tree
	 */
	exitDeclaration?: (ctx: DeclarationContext) => void;

	/**
	 * Enter a parse tree produced by `CParser.declarationSpecifiers`.
	 * @param ctx the parse tree
	 */
	enterDeclarationSpecifiers?: (ctx: DeclarationSpecifiersContext) => void;
	/**
	 * Exit a parse tree produced by `CParser.declarationSpecifiers`.
	 * @param ctx the parse tree
	 */
	exitDeclarationSpecifiers?: (ctx: DeclarationSpecifiersContext) => void;

	/**
	 * Enter a parse tree produced by `CParser.declarationSpecifiers2`.
	 * @param ctx the parse tree
	 */
	enterDeclarationSpecifiers2?: (ctx: DeclarationSpecifiers2Context) => void;
	/**
	 * Exit a parse tree produced by `CParser.declarationSpecifiers2`.
	 * @param ctx the parse tree
	 */
	exitDeclarationSpecifiers2?: (ctx: DeclarationSpecifiers2Context) => void;

	/**
	 * Enter a parse tree produced by `CParser.declarationSpecifier`.
	 * @param ctx the parse tree
	 */
	enterDeclarationSpecifier?: (ctx: DeclarationSpecifierContext) => void;
	/**
	 * Exit a parse tree produced by `CParser.declarationSpecifier`.
	 * @param ctx the parse tree
	 */
	exitDeclarationSpecifier?: (ctx: DeclarationSpecifierContext) => void;

	/**
	 * Enter a parse tree produced by `CParser.initDeclaratorList`.
	 * @param ctx the parse tree
	 */
	enterInitDeclaratorList?: (ctx: InitDeclaratorListContext) => void;
	/**
	 * Exit a parse tree produced by `CParser.initDeclaratorList`.
	 * @param ctx the parse tree
	 */
	exitInitDeclaratorList?: (ctx: InitDeclaratorListContext) => void;

	/**
	 * Enter a parse tree produced by `CParser.initDeclarator`.
	 * @param ctx the parse tree
	 */
	enterInitDeclarator?: (ctx: InitDeclaratorContext) => void;
	/**
	 * Exit a parse tree produced by `CParser.initDeclarator`.
	 * @param ctx the parse tree
	 */
	exitInitDeclarator?: (ctx: InitDeclaratorContext) => void;

	/**
	 * Enter a parse tree produced by `CParser.storageClassSpecifier`.
	 * @param ctx the parse tree
	 */
	enterStorageClassSpecifier?: (ctx: StorageClassSpecifierContext) => void;
	/**
	 * Exit a parse tree produced by `CParser.storageClassSpecifier`.
	 * @param ctx the parse tree
	 */
	exitStorageClassSpecifier?: (ctx: StorageClassSpecifierContext) => void;

	/**
	 * Enter a parse tree produced by `CParser.typeSpecifier`.
	 * @param ctx the parse tree
	 */
	enterTypeSpecifier?: (ctx: TypeSpecifierContext) => void;
	/**
	 * Exit a parse tree produced by `CParser.typeSpecifier`.
	 * @param ctx the parse tree
	 */
	exitTypeSpecifier?: (ctx: TypeSpecifierContext) => void;

	/**
	 * Enter a parse tree produced by `CParser.structOrUnionSpecifier`.
	 * @param ctx the parse tree
	 */
	enterStructOrUnionSpecifier?: (ctx: StructOrUnionSpecifierContext) => void;
	/**
	 * Exit a parse tree produced by `CParser.structOrUnionSpecifier`.
	 * @param ctx the parse tree
	 */
	exitStructOrUnionSpecifier?: (ctx: StructOrUnionSpecifierContext) => void;

	/**
	 * Enter a parse tree produced by `CParser.structOrUnion`.
	 * @param ctx the parse tree
	 */
	enterStructOrUnion?: (ctx: StructOrUnionContext) => void;
	/**
	 * Exit a parse tree produced by `CParser.structOrUnion`.
	 * @param ctx the parse tree
	 */
	exitStructOrUnion?: (ctx: StructOrUnionContext) => void;

	/**
	 * Enter a parse tree produced by `CParser.structDeclarationList`.
	 * @param ctx the parse tree
	 */
	enterStructDeclarationList?: (ctx: StructDeclarationListContext) => void;
	/**
	 * Exit a parse tree produced by `CParser.structDeclarationList`.
	 * @param ctx the parse tree
	 */
	exitStructDeclarationList?: (ctx: StructDeclarationListContext) => void;

	/**
	 * Enter a parse tree produced by `CParser.structDeclaration`.
	 * @param ctx the parse tree
	 */
	enterStructDeclaration?: (ctx: StructDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `CParser.structDeclaration`.
	 * @param ctx the parse tree
	 */
	exitStructDeclaration?: (ctx: StructDeclarationContext) => void;

	/**
	 * Enter a parse tree produced by `CParser.specifierQualifierList`.
	 * @param ctx the parse tree
	 */
	enterSpecifierQualifierList?: (ctx: SpecifierQualifierListContext) => void;
	/**
	 * Exit a parse tree produced by `CParser.specifierQualifierList`.
	 * @param ctx the parse tree
	 */
	exitSpecifierQualifierList?: (ctx: SpecifierQualifierListContext) => void;

	/**
	 * Enter a parse tree produced by `CParser.structDeclaratorList`.
	 * @param ctx the parse tree
	 */
	enterStructDeclaratorList?: (ctx: StructDeclaratorListContext) => void;
	/**
	 * Exit a parse tree produced by `CParser.structDeclaratorList`.
	 * @param ctx the parse tree
	 */
	exitStructDeclaratorList?: (ctx: StructDeclaratorListContext) => void;

	/**
	 * Enter a parse tree produced by `CParser.structDeclarator`.
	 * @param ctx the parse tree
	 */
	enterStructDeclarator?: (ctx: StructDeclaratorContext) => void;
	/**
	 * Exit a parse tree produced by `CParser.structDeclarator`.
	 * @param ctx the parse tree
	 */
	exitStructDeclarator?: (ctx: StructDeclaratorContext) => void;

	/**
	 * Enter a parse tree produced by `CParser.enumSpecifier`.
	 * @param ctx the parse tree
	 */
	enterEnumSpecifier?: (ctx: EnumSpecifierContext) => void;
	/**
	 * Exit a parse tree produced by `CParser.enumSpecifier`.
	 * @param ctx the parse tree
	 */
	exitEnumSpecifier?: (ctx: EnumSpecifierContext) => void;

	/**
	 * Enter a parse tree produced by `CParser.enumeratorList`.
	 * @param ctx the parse tree
	 */
	enterEnumeratorList?: (ctx: EnumeratorListContext) => void;
	/**
	 * Exit a parse tree produced by `CParser.enumeratorList`.
	 * @param ctx the parse tree
	 */
	exitEnumeratorList?: (ctx: EnumeratorListContext) => void;

	/**
	 * Enter a parse tree produced by `CParser.enumerator`.
	 * @param ctx the parse tree
	 */
	enterEnumerator?: (ctx: EnumeratorContext) => void;
	/**
	 * Exit a parse tree produced by `CParser.enumerator`.
	 * @param ctx the parse tree
	 */
	exitEnumerator?: (ctx: EnumeratorContext) => void;

	/**
	 * Enter a parse tree produced by `CParser.enumerationConstant`.
	 * @param ctx the parse tree
	 */
	enterEnumerationConstant?: (ctx: EnumerationConstantContext) => void;
	/**
	 * Exit a parse tree produced by `CParser.enumerationConstant`.
	 * @param ctx the parse tree
	 */
	exitEnumerationConstant?: (ctx: EnumerationConstantContext) => void;

	/**
	 * Enter a parse tree produced by `CParser.atomicTypeSpecifier`.
	 * @param ctx the parse tree
	 */
	enterAtomicTypeSpecifier?: (ctx: AtomicTypeSpecifierContext) => void;
	/**
	 * Exit a parse tree produced by `CParser.atomicTypeSpecifier`.
	 * @param ctx the parse tree
	 */
	exitAtomicTypeSpecifier?: (ctx: AtomicTypeSpecifierContext) => void;

	/**
	 * Enter a parse tree produced by `CParser.typeQualifier`.
	 * @param ctx the parse tree
	 */
	enterTypeQualifier?: (ctx: TypeQualifierContext) => void;
	/**
	 * Exit a parse tree produced by `CParser.typeQualifier`.
	 * @param ctx the parse tree
	 */
	exitTypeQualifier?: (ctx: TypeQualifierContext) => void;

	/**
	 * Enter a parse tree produced by `CParser.functionSpecifier`.
	 * @param ctx the parse tree
	 */
	enterFunctionSpecifier?: (ctx: FunctionSpecifierContext) => void;
	/**
	 * Exit a parse tree produced by `CParser.functionSpecifier`.
	 * @param ctx the parse tree
	 */
	exitFunctionSpecifier?: (ctx: FunctionSpecifierContext) => void;

	/**
	 * Enter a parse tree produced by `CParser.alignmentSpecifier`.
	 * @param ctx the parse tree
	 */
	enterAlignmentSpecifier?: (ctx: AlignmentSpecifierContext) => void;
	/**
	 * Exit a parse tree produced by `CParser.alignmentSpecifier`.
	 * @param ctx the parse tree
	 */
	exitAlignmentSpecifier?: (ctx: AlignmentSpecifierContext) => void;

	/**
	 * Enter a parse tree produced by `CParser.declarator`.
	 * @param ctx the parse tree
	 */
	enterDeclarator?: (ctx: DeclaratorContext) => void;
	/**
	 * Exit a parse tree produced by `CParser.declarator`.
	 * @param ctx the parse tree
	 */
	exitDeclarator?: (ctx: DeclaratorContext) => void;

	/**
	 * Enter a parse tree produced by `CParser.directDeclarator`.
	 * @param ctx the parse tree
	 */
	enterDirectDeclarator?: (ctx: DirectDeclaratorContext) => void;
	/**
	 * Exit a parse tree produced by `CParser.directDeclarator`.
	 * @param ctx the parse tree
	 */
	exitDirectDeclarator?: (ctx: DirectDeclaratorContext) => void;

	/**
	 * Enter a parse tree produced by `CParser.vcSpecificModifer`.
	 * @param ctx the parse tree
	 */
	enterVcSpecificModifer?: (ctx: VcSpecificModiferContext) => void;
	/**
	 * Exit a parse tree produced by `CParser.vcSpecificModifer`.
	 * @param ctx the parse tree
	 */
	exitVcSpecificModifer?: (ctx: VcSpecificModiferContext) => void;

	/**
	 * Enter a parse tree produced by `CParser.gccDeclaratorExtension`.
	 * @param ctx the parse tree
	 */
	enterGccDeclaratorExtension?: (ctx: GccDeclaratorExtensionContext) => void;
	/**
	 * Exit a parse tree produced by `CParser.gccDeclaratorExtension`.
	 * @param ctx the parse tree
	 */
	exitGccDeclaratorExtension?: (ctx: GccDeclaratorExtensionContext) => void;

	/**
	 * Enter a parse tree produced by `CParser.gccAttributeSpecifier`.
	 * @param ctx the parse tree
	 */
	enterGccAttributeSpecifier?: (ctx: GccAttributeSpecifierContext) => void;
	/**
	 * Exit a parse tree produced by `CParser.gccAttributeSpecifier`.
	 * @param ctx the parse tree
	 */
	exitGccAttributeSpecifier?: (ctx: GccAttributeSpecifierContext) => void;

	/**
	 * Enter a parse tree produced by `CParser.gccAttributeList`.
	 * @param ctx the parse tree
	 */
	enterGccAttributeList?: (ctx: GccAttributeListContext) => void;
	/**
	 * Exit a parse tree produced by `CParser.gccAttributeList`.
	 * @param ctx the parse tree
	 */
	exitGccAttributeList?: (ctx: GccAttributeListContext) => void;

	/**
	 * Enter a parse tree produced by `CParser.gccAttribute`.
	 * @param ctx the parse tree
	 */
	enterGccAttribute?: (ctx: GccAttributeContext) => void;
	/**
	 * Exit a parse tree produced by `CParser.gccAttribute`.
	 * @param ctx the parse tree
	 */
	exitGccAttribute?: (ctx: GccAttributeContext) => void;

	/**
	 * Enter a parse tree produced by `CParser.nestedParenthesesBlock`.
	 * @param ctx the parse tree
	 */
	enterNestedParenthesesBlock?: (ctx: NestedParenthesesBlockContext) => void;
	/**
	 * Exit a parse tree produced by `CParser.nestedParenthesesBlock`.
	 * @param ctx the parse tree
	 */
	exitNestedParenthesesBlock?: (ctx: NestedParenthesesBlockContext) => void;

	/**
	 * Enter a parse tree produced by `CParser.pointer`.
	 * @param ctx the parse tree
	 */
	enterPointer?: (ctx: PointerContext) => void;
	/**
	 * Exit a parse tree produced by `CParser.pointer`.
	 * @param ctx the parse tree
	 */
	exitPointer?: (ctx: PointerContext) => void;

	/**
	 * Enter a parse tree produced by `CParser.typeQualifierList`.
	 * @param ctx the parse tree
	 */
	enterTypeQualifierList?: (ctx: TypeQualifierListContext) => void;
	/**
	 * Exit a parse tree produced by `CParser.typeQualifierList`.
	 * @param ctx the parse tree
	 */
	exitTypeQualifierList?: (ctx: TypeQualifierListContext) => void;

	/**
	 * Enter a parse tree produced by `CParser.parameterTypeList`.
	 * @param ctx the parse tree
	 */
	enterParameterTypeList?: (ctx: ParameterTypeListContext) => void;
	/**
	 * Exit a parse tree produced by `CParser.parameterTypeList`.
	 * @param ctx the parse tree
	 */
	exitParameterTypeList?: (ctx: ParameterTypeListContext) => void;

	/**
	 * Enter a parse tree produced by `CParser.parameterList`.
	 * @param ctx the parse tree
	 */
	enterParameterList?: (ctx: ParameterListContext) => void;
	/**
	 * Exit a parse tree produced by `CParser.parameterList`.
	 * @param ctx the parse tree
	 */
	exitParameterList?: (ctx: ParameterListContext) => void;

	/**
	 * Enter a parse tree produced by `CParser.parameterDeclaration`.
	 * @param ctx the parse tree
	 */
	enterParameterDeclaration?: (ctx: ParameterDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `CParser.parameterDeclaration`.
	 * @param ctx the parse tree
	 */
	exitParameterDeclaration?: (ctx: ParameterDeclarationContext) => void;

	/**
	 * Enter a parse tree produced by `CParser.identifierList`.
	 * @param ctx the parse tree
	 */
	enterIdentifierList?: (ctx: IdentifierListContext) => void;
	/**
	 * Exit a parse tree produced by `CParser.identifierList`.
	 * @param ctx the parse tree
	 */
	exitIdentifierList?: (ctx: IdentifierListContext) => void;

	/**
	 * Enter a parse tree produced by `CParser.typeName`.
	 * @param ctx the parse tree
	 */
	enterTypeName?: (ctx: TypeNameContext) => void;
	/**
	 * Exit a parse tree produced by `CParser.typeName`.
	 * @param ctx the parse tree
	 */
	exitTypeName?: (ctx: TypeNameContext) => void;

	/**
	 * Enter a parse tree produced by `CParser.abstractDeclarator`.
	 * @param ctx the parse tree
	 */
	enterAbstractDeclarator?: (ctx: AbstractDeclaratorContext) => void;
	/**
	 * Exit a parse tree produced by `CParser.abstractDeclarator`.
	 * @param ctx the parse tree
	 */
	exitAbstractDeclarator?: (ctx: AbstractDeclaratorContext) => void;

	/**
	 * Enter a parse tree produced by `CParser.directAbstractDeclarator`.
	 * @param ctx the parse tree
	 */
	enterDirectAbstractDeclarator?: (ctx: DirectAbstractDeclaratorContext) => void;
	/**
	 * Exit a parse tree produced by `CParser.directAbstractDeclarator`.
	 * @param ctx the parse tree
	 */
	exitDirectAbstractDeclarator?: (ctx: DirectAbstractDeclaratorContext) => void;

	/**
	 * Enter a parse tree produced by `CParser.typedefName`.
	 * @param ctx the parse tree
	 */
	enterTypedefName?: (ctx: TypedefNameContext) => void;
	/**
	 * Exit a parse tree produced by `CParser.typedefName`.
	 * @param ctx the parse tree
	 */
	exitTypedefName?: (ctx: TypedefNameContext) => void;

	/**
	 * Enter a parse tree produced by `CParser.initializer`.
	 * @param ctx the parse tree
	 */
	enterInitializer?: (ctx: InitializerContext) => void;
	/**
	 * Exit a parse tree produced by `CParser.initializer`.
	 * @param ctx the parse tree
	 */
	exitInitializer?: (ctx: InitializerContext) => void;

	/**
	 * Enter a parse tree produced by `CParser.initializerList`.
	 * @param ctx the parse tree
	 */
	enterInitializerList?: (ctx: InitializerListContext) => void;
	/**
	 * Exit a parse tree produced by `CParser.initializerList`.
	 * @param ctx the parse tree
	 */
	exitInitializerList?: (ctx: InitializerListContext) => void;

	/**
	 * Enter a parse tree produced by `CParser.designation`.
	 * @param ctx the parse tree
	 */
	enterDesignation?: (ctx: DesignationContext) => void;
	/**
	 * Exit a parse tree produced by `CParser.designation`.
	 * @param ctx the parse tree
	 */
	exitDesignation?: (ctx: DesignationContext) => void;

	/**
	 * Enter a parse tree produced by `CParser.designatorList`.
	 * @param ctx the parse tree
	 */
	enterDesignatorList?: (ctx: DesignatorListContext) => void;
	/**
	 * Exit a parse tree produced by `CParser.designatorList`.
	 * @param ctx the parse tree
	 */
	exitDesignatorList?: (ctx: DesignatorListContext) => void;

	/**
	 * Enter a parse tree produced by `CParser.designator`.
	 * @param ctx the parse tree
	 */
	enterDesignator?: (ctx: DesignatorContext) => void;
	/**
	 * Exit a parse tree produced by `CParser.designator`.
	 * @param ctx the parse tree
	 */
	exitDesignator?: (ctx: DesignatorContext) => void;

	/**
	 * Enter a parse tree produced by `CParser.staticAssertDeclaration`.
	 * @param ctx the parse tree
	 */
	enterStaticAssertDeclaration?: (ctx: StaticAssertDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `CParser.staticAssertDeclaration`.
	 * @param ctx the parse tree
	 */
	exitStaticAssertDeclaration?: (ctx: StaticAssertDeclarationContext) => void;

	/**
	 * Enter a parse tree produced by `CParser.statement`.
	 * @param ctx the parse tree
	 */
	enterStatement?: (ctx: StatementContext) => void;
	/**
	 * Exit a parse tree produced by `CParser.statement`.
	 * @param ctx the parse tree
	 */
	exitStatement?: (ctx: StatementContext) => void;

	/**
	 * Enter a parse tree produced by `CParser.labeledStatement`.
	 * @param ctx the parse tree
	 */
	enterLabeledStatement?: (ctx: LabeledStatementContext) => void;
	/**
	 * Exit a parse tree produced by `CParser.labeledStatement`.
	 * @param ctx the parse tree
	 */
	exitLabeledStatement?: (ctx: LabeledStatementContext) => void;

	/**
	 * Enter a parse tree produced by `CParser.compoundStatement`.
	 * @param ctx the parse tree
	 */
	enterCompoundStatement?: (ctx: CompoundStatementContext) => void;
	/**
	 * Exit a parse tree produced by `CParser.compoundStatement`.
	 * @param ctx the parse tree
	 */
	exitCompoundStatement?: (ctx: CompoundStatementContext) => void;

	/**
	 * Enter a parse tree produced by `CParser.blockItemList`.
	 * @param ctx the parse tree
	 */
	enterBlockItemList?: (ctx: BlockItemListContext) => void;
	/**
	 * Exit a parse tree produced by `CParser.blockItemList`.
	 * @param ctx the parse tree
	 */
	exitBlockItemList?: (ctx: BlockItemListContext) => void;

	/**
	 * Enter a parse tree produced by `CParser.blockItem`.
	 * @param ctx the parse tree
	 */
	enterBlockItem?: (ctx: BlockItemContext) => void;
	/**
	 * Exit a parse tree produced by `CParser.blockItem`.
	 * @param ctx the parse tree
	 */
	exitBlockItem?: (ctx: BlockItemContext) => void;

	/**
	 * Enter a parse tree produced by `CParser.expressionStatement`.
	 * @param ctx the parse tree
	 */
	enterExpressionStatement?: (ctx: ExpressionStatementContext) => void;
	/**
	 * Exit a parse tree produced by `CParser.expressionStatement`.
	 * @param ctx the parse tree
	 */
	exitExpressionStatement?: (ctx: ExpressionStatementContext) => void;

	/**
	 * Enter a parse tree produced by `CParser.selectionStatement`.
	 * @param ctx the parse tree
	 */
	enterSelectionStatement?: (ctx: SelectionStatementContext) => void;
	/**
	 * Exit a parse tree produced by `CParser.selectionStatement`.
	 * @param ctx the parse tree
	 */
	exitSelectionStatement?: (ctx: SelectionStatementContext) => void;

	/**
	 * Enter a parse tree produced by `CParser.iterationStatement`.
	 * @param ctx the parse tree
	 */
	enterIterationStatement?: (ctx: IterationStatementContext) => void;
	/**
	 * Exit a parse tree produced by `CParser.iterationStatement`.
	 * @param ctx the parse tree
	 */
	exitIterationStatement?: (ctx: IterationStatementContext) => void;

	/**
	 * Enter a parse tree produced by `CParser.forCondition`.
	 * @param ctx the parse tree
	 */
	enterForCondition?: (ctx: ForConditionContext) => void;
	/**
	 * Exit a parse tree produced by `CParser.forCondition`.
	 * @param ctx the parse tree
	 */
	exitForCondition?: (ctx: ForConditionContext) => void;

	/**
	 * Enter a parse tree produced by `CParser.forDeclaration`.
	 * @param ctx the parse tree
	 */
	enterForDeclaration?: (ctx: ForDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `CParser.forDeclaration`.
	 * @param ctx the parse tree
	 */
	exitForDeclaration?: (ctx: ForDeclarationContext) => void;

	/**
	 * Enter a parse tree produced by `CParser.forExpression`.
	 * @param ctx the parse tree
	 */
	enterForExpression?: (ctx: ForExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `CParser.forExpression`.
	 * @param ctx the parse tree
	 */
	exitForExpression?: (ctx: ForExpressionContext) => void;

	/**
	 * Enter a parse tree produced by `CParser.jumpStatement`.
	 * @param ctx the parse tree
	 */
	enterJumpStatement?: (ctx: JumpStatementContext) => void;
	/**
	 * Exit a parse tree produced by `CParser.jumpStatement`.
	 * @param ctx the parse tree
	 */
	exitJumpStatement?: (ctx: JumpStatementContext) => void;

	/**
	 * Enter a parse tree produced by `CParser.compilationUnit`.
	 * @param ctx the parse tree
	 */
	enterCompilationUnit?: (ctx: CompilationUnitContext) => void;
	/**
	 * Exit a parse tree produced by `CParser.compilationUnit`.
	 * @param ctx the parse tree
	 */
	exitCompilationUnit?: (ctx: CompilationUnitContext) => void;

	/**
	 * Enter a parse tree produced by `CParser.translationUnit`.
	 * @param ctx the parse tree
	 */
	enterTranslationUnit?: (ctx: TranslationUnitContext) => void;
	/**
	 * Exit a parse tree produced by `CParser.translationUnit`.
	 * @param ctx the parse tree
	 */
	exitTranslationUnit?: (ctx: TranslationUnitContext) => void;

	/**
	 * Enter a parse tree produced by `CParser.externalDeclaration`.
	 * @param ctx the parse tree
	 */
	enterExternalDeclaration?: (ctx: ExternalDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `CParser.externalDeclaration`.
	 * @param ctx the parse tree
	 */
	exitExternalDeclaration?: (ctx: ExternalDeclarationContext) => void;

	/**
	 * Enter a parse tree produced by `CParser.functionDefinition`.
	 * @param ctx the parse tree
	 */
	enterFunctionDefinition?: (ctx: FunctionDefinitionContext) => void;
	/**
	 * Exit a parse tree produced by `CParser.functionDefinition`.
	 * @param ctx the parse tree
	 */
	exitFunctionDefinition?: (ctx: FunctionDefinitionContext) => void;

	/**
	 * Enter a parse tree produced by `CParser.declarationList`.
	 * @param ctx the parse tree
	 */
	enterDeclarationList?: (ctx: DeclarationListContext) => void;
	/**
	 * Exit a parse tree produced by `CParser.declarationList`.
	 * @param ctx the parse tree
	 */
	exitDeclarationList?: (ctx: DeclarationListContext) => void;
}

