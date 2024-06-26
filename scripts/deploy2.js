// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.

const path = require("path");

async function main() {
  // This is just a convenience check
  if (network.name === "sepolia") {
    console.warn(
      "You are trying to deploy a contract to the Hardhat Network, which" +
        "gets automatically created and destroyed every time. Use the Hardhat" +
        " option '--network localhost'"
    );
  }

  // ethers is available in the global scope
  const [deployer] = await ethers.getSigners();
  console.log(
    "Deploying the contracts with the account:",
    await deployer.getAddress()
  );

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const SimpleStorage = await ethers.getContractFactory("SimpleStorage");
  const simpleStorage = await SimpleStorage.deploy();
  await simpleStorage.deployed();

  console.log("SimpleStorage address:", simpleStorage.address);

  // We also save the contract's artifacts and address in the frontend directory
  saveFrontendFiles(simpleStorage);
}

function saveFrontendFiles(simpleStorage) {
  const fs = require("fs");
  const contractsDir = path.join(__dirname, "..", "client", "src", "contracts");

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    path.join(contractsDir, "contract-address.json"),
    JSON.stringify({ SimpleStorage: simpleStorage.address }, undefined, 2)
  );

  const SimpleStorageArtifact = artifacts.readArtifactSync("SimpleStorage");

  fs.writeFileSync(
    path.join(contractsDir, "SimpleStorage.json"),
    JSON.stringify(SimpleStorageArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
