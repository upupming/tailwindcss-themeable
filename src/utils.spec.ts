import { hex2HSL, hsl2Hex } from './utils'

describe('utils', () => {
  it('should convert hex to hsl correctly', () => {
    expect(hex2HSL('#FF0000')).toMatchSnapshot();
    ([
      '#FFFFFF', '#EFFFF3',
      '#C7FDD5', '#9FFCB7',
      '#78FB99', '#50FA7B',
      '#19F852', '#06D43A',
      '#049D2B', '#03671C'
    ] as const).map(hex => expect(hex2HSL(hex)).toMatchSnapshot())
  })

  it('should convert hsl to hex correctly', () => {
    ([
      '#FFFFFF', '#EFFFF3',
      '#C7FDD5', '#9FFCB7',
      '#78FB99', '#50FA7B',
      '#19F852', '#06D43A',
      '#049D2B', '#03671C'
    ] as const).map(hex => expect(hex).toStrictEqual(
      hsl2Hex(hex2HSL(hex)).toUpperCase()
    ))
    expect(hsl2Hex(hex2HSL('#FFF')).toUpperCase()).toStrictEqual('#FFFFFF')
    expect(hsl2Hex(hex2HSL('#ABC')).toUpperCase()).toStrictEqual('#AABBCC')
  })
})
