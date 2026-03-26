import { ccc } from "@ckb-ccc/ccc";
import { base32 } from "@scure/base";

export interface DidCkbCellInfo {
  txHash: string;
  index: number;
  args: string;
  capacity: string;
  did: string;
  didMetadata: string;
}

export async function fetchDidCkbCellsInfo(
  signer: ccc.Signer
): Promise<Array<DidCkbCellInfo>> {
  try {
    const didScriptInfo = await signer.client.getKnownScript(ccc.KnownScript.DidCkb);
    const didCodeHash = didScriptInfo?.codeHash;
    if (!didCodeHash) throw new Error('DidCkb script codeHash not found');
    
    const cells = await signer.findCells({
      script: {
        codeHash: didCodeHash,
        hashType: 'type',
        args: "0x",
      },
    }, true, 'desc', 10);
    
    const result: Array<DidCkbCellInfo> = [];
    for await (const cell of cells) {
      const txHash = cell.outPoint.txHash;
      const index = Number(cell.outPoint.index);
      try {
        const data = cell.outputData ?? '0x';
        const didData = ccc.didCkb.DidCkbData.decode(ccc.bytesFrom(data));
        const didDoc = didData.value.document;      
        const didMetadata = JSON.stringify(didDoc);
        if (!cell.cellOutput.type) throw new Error('cell.cellOutput.type is undefined');
        const args = ccc.bytesFrom(cell.cellOutput.type.args.slice(0, 42));
        const did = `did:ckb:${base32.encode(args).toLowerCase()}`;
        result.push({
          txHash,
          index,
          capacity: ccc.fixedPointToString(cell.cellOutput.capacity),
          args: cell.cellOutput.type.args,
          did,
          didMetadata,
        });
      } catch (error) {
        console.error(`Error processing cell ${txHash}:${index}:`, error);
      }
    }
    return result;
  } catch (error) {
    console.error('Error fetching DID cells:', error);
    return [];
  }
}

export async function getWalletAddress(signer: ccc.Signer): Promise<string> {
  return await signer.getRecommendedAddress();
}
