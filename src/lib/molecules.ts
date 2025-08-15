import {
  mol,
  HexLike,
  hexFrom,
  NumLike,
  numFrom,
  Num,
} from "@ckb-ccc/core";

type Hex = `0x${string}`;

// table DidWeb5DataV1 {
//     document: Bytes,
//     localId: StringOpt,
// }
export type DidWeb5DataV1Like = {
  document: HexLike;
  localId?: HexLike | null;
};

@mol.codec(
  mol.table({
    document: mol.Bytes,
    localId: mol.BytesOpt,
  }),
)
export class DidWeb5DataV1 extends mol.Entity.Base<
  DidWeb5DataV1Like,
  DidWeb5DataV1
>() {
  constructor(
    public document: Hex,
    public localId?: Hex,
  ) {
    super();
  }

  static from(data: DidWeb5DataV1Like): DidWeb5DataV1 {
    if (data instanceof DidWeb5DataV1) {
      return data;
    }
    return new DidWeb5DataV1(
      hexFrom(data.document),
      data.localId ? hexFrom(data.localId) : undefined,
    );
  }
}

// union DidWeb5Data {
//   DidWeb5DataV1,
// }

export type DidWeb5DataLike = {
  value: DidWeb5DataV1Like;
};

@mol.codec(
  mol.union({
    DidWeb5DataV1,
  }),
)
export class DidWeb5Data extends mol.Entity.Base<
  DidWeb5DataLike,
  DidWeb5Data
>() {
  constructor(
    public type: "DidWeb5DataV1",
    public value: DidWeb5DataV1,
  ) {
    super();
  }

  static from(data: DidWeb5DataLike): DidWeb5Data {
    if (data instanceof DidWeb5Data) {
      return data;
    }
    return new DidWeb5Data("DidWeb5DataV1", DidWeb5DataV1.from(data.value));
  }
}

// table PlcAuthorization {
//     history: BytesVec,
//     sig: Bytes,
//     rotationKeyIndices: Uint8Vec,
// }
export type PlcAuthorizationLike = {
  history: HexLike[];
  sig: HexLike;
  rotationKeyIndices: NumLike[];
};

@mol.codec(
  mol.table({
    history: mol.BytesVec,
    sig: mol.Bytes,
    rotationKeyIndices: mol.Uint8Vec,
  }),
)
export class PlcAuthorization extends mol.Entity.Base<
  PlcAuthorizationLike,
  PlcAuthorization
>() {
  constructor(
    public history: Hex[],
    public sig: Hex,
    public rotationKeyIndices: Num[],
  ) {
    super();
  }

  static from(data: PlcAuthorizationLike): PlcAuthorization {
    if (data instanceof PlcAuthorization) {
      return data;
    }
    return new PlcAuthorization(
      data.history.map((h) => hexFrom(h)),
      hexFrom(data.sig),
      data.rotationKeyIndices.map((s) => numFrom(s)),
    );
  }
}

// table DidWeb5Witness {
//   localIdAuthorization: PlcAuthorization,
// }

export type DidWeb5WitnessLike = {
  localIdAuthorization: PlcAuthorizationLike;
};

@mol.codec(
  mol.table({
    localIdAuthorization: PlcAuthorization,
  }),
)
export class DidWeb5Witness extends mol.Entity.Base<
  DidWeb5WitnessLike,
  DidWeb5Witness
>() {
  constructor(public localIdAuthorization: PlcAuthorization) {
    super();
  }

  static from(data: DidWeb5WitnessLike): DidWeb5Witness {
    if (data instanceof DidWeb5Witness) {
      return data;
    }
    return new DidWeb5Witness(PlcAuthorization.from(data.localIdAuthorization));
  }
}

// a test molecule definition to test `compatible` flag
export type TestWitnessLike = {
  localIdAuthorization: PlcAuthorizationLike;
  padding: number;
};

@mol.codec(
  mol.table({
    localIdAuthorization: PlcAuthorization,
    padding: mol.Uint32,
  }),
)
export class TestWitness extends mol.Entity.Base<
  TestWitnessLike,
  TestWitness
>() {
  constructor(
    public localIdAuthorization: PlcAuthorization,
    public padding: number,
  ) {
    super();
  }

  static from(data: TestWitnessLike): TestWitness {
    if (data instanceof TestWitness) {
      return data;
    }
    return new TestWitness(PlcAuthorization.from(data.localIdAuthorization), 0);
  }
}
