# Yield Contracts

A sophisticated ERC4626-compliant yield optimization vault protocol forked from Yearn V3, designed for automated asset allocation across multiple strategies with advanced risk management and fee mechanisms.

## Overview

This protocol enables users to deposit assets into a vault that automatically allocates funds to various yield-generating strategies. The vault implements comprehensive debt management, profit unlocking mechanisms, and protection against unrealized losses.

## Architecture

### Core Components

- **Vault.sol**: Main vault contract implementing ERC4626 standard, managing deposits, withdrawals, and strategy allocations
- **BaseStrategy.sol**: Abstract base contract for strategies, also ERC4626-compliant
- **Accountant.sol**: Fee calculation and distribution module for performance and management fees
- **Modules**: Pluggable limit modules for deposit/withdraw restrictions

### Key Features

- **ERC4626 Compliance**: Full implementation of the ERC4626 tokenized vault standard
- **Strategy Queue System**: Priority-based allocation queue for automated fund distribution
- **Auto-Allocate Mechanism**: Automatic rebalancing of debt across strategies
- **Profit Unlocking**: Time-based vesting curve for realized profits
- **Unrealized Loss Protection**: Mechanisms to protect late withdrawers from early withdrawer losses
- **Dual Fee System**: Management fee (1% APY) and performance fee (10% on profits)
- **Modular Limits**: Configurable deposit/withdraw limits via pluggable modules
- **Role-Based Access Control**: Granular permission system for vault operations

## Technical Specifications

### Solidity Version

- `^0.8.24`

### Dependencies

- OpenZeppelin Contracts `^5.3.0` (upgradeable)
- Hardhat development environment

### Key Mechanisms

#### Strategy Management

- Strategy activation/deactivation with queue-based priority system
- Debt limits per strategy (`maxDebt`)
- Automatic allocation to strategies based on queue order

#### Profit & Loss Handling

- **Gains**: Locked shares with time-based unlocking via `profitMaxUnlockTime`
- **Losses**: Immediate impact reduction through locked profit absorption, then PPS adjustment

#### Fee Structure

- **Management Fee**: Accrued continuously, minted as shares between operations
- **Performance Fee**: Calculated on strategy reports, distributed via Accountant contract

#### Risk Management

- Minimum idle balance for liquidity
- Configurable deposit/withdraw limits
- Max loss tolerance for withdrawals
- Debt purchasing mechanism for emergency scenarios

## Installation

```bash
npm install
```

## Development

```bash
# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Run tests with gas reporting
REPORT_GAS=true npx hardhat test

# Deploy to local network
npx hardhat node
```

## Documentation

See [Technical Paper](./docs/Technical_Paper.md) for detailed mechanism explanations.

## Security

Audit reports available in [`docs/audits/`](./docs/audits/).

## License

AGPL-3.0
