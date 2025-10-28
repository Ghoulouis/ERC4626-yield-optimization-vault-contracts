import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { addresses } from "../../utils/address";

const deploy: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, getChainId } = hre;
  const { deploy, get } = deployments;
  const { testDeployer, testAgent } = await getNamedAccounts();

  let usdc = addresses.base.usdc;
  let timeUnlock = 7 * 24 * 60 * 60;
  let ERC20LogicDeployment = await deploy("ERC20Logic", {
    from: testDeployer,
    log: true,
  });

  let ERC4626LogicDeployment = await deploy("ERC4626Logic", {
    from: testDeployer,
    log: true,
    libraries: {
      ERC20Logic: ERC20LogicDeployment.address,
    },
  });
  let WithdrawLogicDeployment = await deploy("WithdrawLogic", {
    from: testDeployer,
    log: true,
    libraries: {
      ERC20Logic: ERC20LogicDeployment.address,
      ERC4626Logic: ERC4626LogicDeployment.address,
    },
  });

  let UnlockSharesLogicDeployment = await deploy("UnlockSharesLogic", {
    from: testDeployer,
    log: true,
    libraries: {
      ERC20Logic: ERC20LogicDeployment.address,
    },
  });
  let InitializeLogicDeployment = await deploy("InitializeLogic", {
    from: testDeployer,
    log: true,
  });

  let ConfiguratorLogicDeployment = await deploy("ConfiguratorLogic", {
    from: testDeployer,
    log: true,
  });

  let DebtLogicDeployment = await deploy("DebtLogic", {
    from: testDeployer,
    log: true,
    libraries: {
      ERC20Logic: ERC20LogicDeployment.address,
      ERC4626Logic: ERC4626LogicDeployment.address,
      UnlockSharesLogic: UnlockSharesLogicDeployment.address,
    },
  });

  let DepositLogicDeployment = await deploy("DepositLogic", {
    from: testDeployer,
    log: true,
    libraries: {
      ERC20Logic: ERC20LogicDeployment.address,
      ERC4626Logic: ERC4626LogicDeployment.address,
      DebtLogic: DebtLogicDeployment.address,
    },
  });

  await deploy("TestVault", {
    contract: "Vault",
    from: testDeployer,
    proxy: {
      owner: testDeployer,
      execute: {
        init: {
          methodName: "initialize",
          args: [usdc, "Test Vault", "testUSDC", timeUnlock, testDeployer],
        },
      },
    },
    log: true,
    autoMine: true,
    libraries: {
      ERC20Logic: ERC20LogicDeployment.address,
      ERC4626Logic: ERC4626LogicDeployment.address,
      InitializeLogic: InitializeLogicDeployment.address,
      DepositLogic: DepositLogicDeployment.address,
      WithdrawLogic: WithdrawLogicDeployment.address,
      UnlockSharesLogic: UnlockSharesLogicDeployment.address,
      DebtLogic: DebtLogicDeployment.address,
      ConfiguratorLogic: ConfiguratorLogicDeployment.address,
    },
  });
};
deploy.tags = ["vault", "test"];

export default deploy;
