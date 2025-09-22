import { parseUnits } from "ethers";
import hre from "hardhat";
import { Vault__factory } from "../../typechain-types";
import { addStrategy, ROLES, setDebt, setMaxDebt, setRole } from "../utils/helper";
import { addresses } from "../../utils/address";

async function main() {
  const { deployments, ethers } = hre;
  const { get } = deployments;
  const privateKey = process.env.TEST_DEPLOYER!;
  const wallet = new ethers.Wallet(privateKey, ethers.provider);
  let vault = Vault__factory.connect((await get("TestVault")).address, ethers.provider);
  await setRole(await vault.getAddress(), wallet.address, ROLES.ADD_STRATEGY_MANAGER, wallet);
  await addStrategy(await vault.getAddress(), addresses.base.offChainStrategy, wallet);
  await setRole(await vault.getAddress(), wallet.address, ROLES.DEBT_MANAGER, wallet);

  let data = [];

  let dataVault = await vault.vaultData();
  data.push({
    name: "UnAllocation",
    value: dataVault.totalIdle,
  });

  let dataWasabi = await vault.strategies(addresses.base.wasabiUSDCERC4626);
  data.push({
    name: "Wasabi",
    value: dataWasabi.currentDebt,
  });

  let dataOffChain = await vault.strategies(addresses.base.offChainStrategy);

  data.push({
    name: "OffChain",
    value: dataOffChain.currentDebt,
  });

  console.table(data);
  //await setDebt(await vault.getAddress(), addresses.base.offChainStrategy, parseUnits("4", 6), wallet);
}
main();
