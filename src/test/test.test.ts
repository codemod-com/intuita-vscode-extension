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

describe.only('x', () => {
    it('y', () => {
        const astChanges = getAstChanges(
            oldSourceFileText,
            newSourceFileText,
        )

        const string = getAstChangedSourceFileText(
            astChanges,
            newSourceFileText,
        )

        console.log(string);
    })
})