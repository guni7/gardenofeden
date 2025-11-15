import { defineWorld } from "@latticexyz/world";

export default defineWorld({
  codegen: {
    generateSystemLibraries: true,
  },
  userTypes: {
    ObjectType: {
      filePath: "@dust/world/src/types/ObjectType.sol",
      type: "uint16",
    },
    EntityId: {
      filePath: "@dust/world/src/types/EntityId.sol",
      type: "bytes32",
    },
    ProgramId: {
      filePath: "@dust/world/src/types/ProgramId.sol",
      type: "bytes32",
    },
    ResourceId: {
      filePath: "@latticexyz/store/src/ResourceId.sol",
      type: "bytes32",
    },
  },
  // Replace this with a unique namespace
  namespace: "GardenOfEden",
  systems: {
    FFProgram: {
      openAccess: false,
      deploy: { registerWorldFunctions: false },
    },
    SpawnTileProgram: {
      openAccess: false,
      deploy: { registerWorldFunctions: false },
    },
    BedProgram: {
      openAccess: false,
      deploy: { registerWorldFunctions: false },
    },
    EdenTokenSystem: {
      openAccess: false,
      deploy: { registerWorldFunctions: false },
    },
    AdminSystem: {
      openAccess: true,
      deploy: { registerWorldFunctions: false },
    },
  },
  tables: {
    Admin: {
      schema: {
        admin: "address",
        isAdmin: "bool",
      },
      key: ["admin"],
    },
    SpawnCount: {
      schema: {
        player: "address",
        count: "uint32",
      },
      key: ["player"],
    },
    FruitOfEden: {
      schema: {
        player: "address",
        karma: "int256",
      },
      key: ["player"],
    },
  },
});
