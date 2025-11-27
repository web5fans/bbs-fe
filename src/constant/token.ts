import { withNetwork } from "./Network";
import { HashType, CellDepInfoLike } from "@ckb-ccc/core";

export type TokenConfig = {
  codeHash: `0x${string}`
  hashType: HashType
  cellDeps: (CellDepInfoLike | CellDepInfoLike[])
}


export const tokenConfig: TokenConfig = {
  ...(withNetwork({
    testnet: {
      codeHash:
        '0x510150477b10d6ab551a509b71265f3164e9fd4137fcb5a4322f49f03092c7c5',
      hashType: 'type',
      cellDeps: [
        {
          cellDep: {
            outPoint: {
              txHash:
                '0x1ecbf88d692a14d7cbc0bfd1a3d5019e4b613247ae438bad52f94148c6009559',
              index: 0,
            },
            depType: 'code',
          },
          type: {
            codeHash:
              '0x00000000000000000000000000000000000000000000000000545950455f4944',
            hashType: 'type',
            args: '0x3c27695173b888ed44ddf36f901789014384ad6c05a9137f3db9a0779c141c35',
          },
        },
      ],
    },
    mainnet: {
      codeHash:
        '0x4a06164dc34dccade5afe3e847a97b6db743e79f5477fa3295acf02849c5984a',
      hashType: 'type',
      cellDeps: [
        {
          cellDep: {
            outPoint: {
              txHash:
                '0xe2f74c56cdc610d2b9fe898a96a80118845f5278605d7f9ad535dad69ae015bf',
              index: 0,
            },
            depType: 'code',
          },
          type: {
            codeHash:
              '0x00000000000000000000000000000000000000000000000000545950455f4944',
            hashType: 'type',
            args: '0x55573ef6d78e3ca75170ff476176732309a8b31efe94320a954ded3d75c2cb18',
          },
        },
      ],
    }
  }))
}