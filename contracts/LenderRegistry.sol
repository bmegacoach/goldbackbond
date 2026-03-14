// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title LenderRegistry
 * @notice Tracks approved lenders for the GoldBackBond ecosystem.
 * @dev ABI functions are fixed — 5 functions, no additions. Events added for indexing.
 */
contract LenderRegistry {
    address private _owner;
    mapping(address => bool) private _approvedLenders;

    event LenderApproved(address indexed lender);
    event LenderRevoked(address indexed lender);

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
        require(lender != address(0), "LenderRegistry: zero address");
        _approvedLenders[lender] = true;
        emit LenderApproved(lender);
    }

    function revokeLender(address lender) external onlyOwner {
        _approvedLenders[lender] = false;
        emit LenderRevoked(lender);
    }

    function batchApproveLenders(address[] calldata lenders) external onlyOwner {
        uint256 len = lenders.length;
        for (uint256 i = 0; i < len; i++) {
            require(lenders[i] != address(0), "LenderRegistry: zero address in batch");
            _approvedLenders[lenders[i]] = true;
            emit LenderApproved(lenders[i]);
        }
    }

    function batchRevokeLenders(address[] calldata lenders) external onlyOwner {
        uint256 len = lenders.length;
        for (uint256 i = 0; i < len; i++) {
            _approvedLenders[lenders[i]] = false;
            emit LenderRevoked(lenders[i]);
        }
    }
}
