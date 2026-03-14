// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title LenderRegistry
 * @notice Tracks approved lenders for the GoldBackBond ecosystem.
 * @dev ABI is fixed at src/lib/abis/LenderRegistry.json — 5 functions, no additions.
 */
contract LenderRegistry {
    address private _owner;
    mapping(address => bool) private _approvedLenders;

    constructor() {
        _owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == _owner, "LenderRegistry: caller is not owner");
        _;
    }

    function isApprovedLender(address lender) external view returns (bool) {
        return _approvedLenders[lender];
    }

    function approveLender(address lender) external onlyOwner {
        _approvedLenders[lender] = true;
    }

    function revokeLender(address lender) external onlyOwner {
        _approvedLenders[lender] = false;
    }

    function batchApproveLenders(address[] calldata lenders) external onlyOwner {
        for (uint256 i = 0; i < lenders.length; i++) {
            _approvedLenders[lenders[i]] = true;
        }
    }

    function batchRevokeLenders(address[] calldata lenders) external onlyOwner {
        for (uint256 i = 0; i < lenders.length; i++) {
            _approvedLenders[lenders[i]] = false;
        }
    }
}
