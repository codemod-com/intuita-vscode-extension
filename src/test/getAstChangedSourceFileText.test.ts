import { assert } from "chai"
import { getAstChangedSourceFileText } from "../getAstChangedSourceFileText"
import { getAstChanges } from "../getAstChanges"

const oldSourceFileText = 
`
const x = (a: number, b: string, c: boolean) => {}

const y = () => {
    x(1, "2", false)
}
`

const newSourceFileText = 
`
const x = (a: number, c: boolean) => {}

const y = () => {
    x(1, "2", false)
}
`

const astChangedSourceFileText = `
const x = (a: number, c: boolean) => {}

const y = () => {
    x(1, false)
}
`

describe('getAstChangedSourceFileText', () => {
    it('should remove the second argument', () => {
        const astChanges = getAstChanges(
            oldSourceFileText,
            newSourceFileText,
        )

        const string = getAstChangedSourceFileText(
            astChanges,
            newSourceFileText,
        )

        assert.deepEqual(string, astChangedSourceFileText)
    })
})