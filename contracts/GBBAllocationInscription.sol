// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title GBBAllocationInscription
 * @dev A smart contract to issue Goldbackbond (GBB) token allocations to pre-sale buyers using structured Eth-Inscriptions.
 * Validates and records the Ethscription data URI on-chain for transparency and tracking.
 */
contract GBBAllocationInscription {
    address public owner;

    // Roles for access control
    mapping(address => bool) public isMinter;

    // Event representing the "Eth-Inscription" taking place through a smart contract
    event AllocationInscribed(
        address indexed buyer,
        uint256 amount,
        string dataURI
    );

    event MinterAdded(address indexed account);
    event MinterRemoved(address indexed account);

    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not the owner");
        _;
    }

    modifier onlyMinter() {
        require(msg.sender == owner || isMinter[msg.sender], "Caller is not a minter");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev Add a new minter (e.g., an automated agency backend wallet if desired).
     */
    function addMinter(address account) external onlyOwner {
        isMinter[account] = true;
        emit MinterAdded(account);
    }

    /**
     * @dev Remove a minter.
     */
    function removeMinter(address account) external onlyOwner {
        isMinter[account] = false;
        emit MinterRemoved(account);
    }

    /**
     * @dev Issues an allocation and generates the Ethscription calldata representation via an event.
     * @param buyer The address of the pre-sale buyer.
     * @param amount The allocated amount of tokens.
     * @param terms The terms of the sale.
     * @param agentInfo Information about the sales agent.
     * @param commissionInfo Details about the sales commission.
     * @param commissionInfo Details about the sales commission.
     * @param paymentType The type of payment (e.g., "FIAT" or "CRYPTO") for SLA tracking.
     * @param openSignDocumentId The verified OpenSign certificate ID representing the executed contract artifact.
     */
    function issueAllocation(
        address buyer,
        uint256 amount,
        string memory terms,
        string memory agentInfo,
        string memory commissionInfo,
        string memory paymentType,
        string memory openSignDocumentId
    ) external onlyMinter {
        require(buyer != address(0), "Invalid buyer address");
        require(amount > 0, "Amount must be greater than zero");

        // Construct the JSON structure for the Ethscription
        // e.g., data:application/json,{"p":"gbb-allocation","op":"mint","buyer":"0x...","amount":"100",...}
        string memory jsonPayload = string(
            abi.encodePacked(
                "data:application/json,{\"p\":\"Goldbackbond-USDGB-allocation\",\"op\":\"mint\",\"buyer\":\"",
                toAsciiString(buyer),
                "\",\"amount\":\"",
                uint2str(amount),
                "\",\"terms\":\"",
                terms,
                "\",\"agentInfo\":\"",
                agentInfo,
                "\",\"commissionInfo\":\"",
                commissionInfo,
                "\",\"paymentType\":\"",
                paymentType,
                "\",\"openSignDocumentId\":\"",
                openSignDocumentId,
                "\",\"legalDisclosure\":\"This token represents a contract right to inventory. This is not a security or derivative.\",",
                "\"}"
            )
        );

        // Emit the inscription event
        // This acts as the permanent record of the allocation and its associated metadata terms
        emit AllocationInscribed(buyer, amount, jsonPayload);
    }

    // --- Helper Functions ---

    /**
     * @dev Converts an address to its ASCII string representation.
     */
    function toAsciiString(address x) internal pure returns (string memory) {
        bytes memory s = new bytes(40);
        for (uint i = 0; i < 20; i++) {
            bytes1 b = bytes1(uint8(uint(uint160(x)) / (2**(8*(19 - i)))));
            bytes1 hi = bytes1(uint8(b) / 16);
            bytes1 lo = bytes1(uint8(b) - 16 * uint8(hi));
            s[2*i] = char(hi);
            s[2*i+1] = char(lo);
        }
        return string(abi.encodePacked("0x", s));
    }

    /**
     * @dev Converts a single byte representing a hex digit into its ASCII character.
     */
    function char(bytes1 b) internal pure returns (bytes1 c) {
        if (uint8(b) < 10) return bytes1(uint8(b) + 0x30);
        else return bytes1(uint8(b) + 0x57);
    }

    /**
     * @dev Converts a uint256 to a string.
     */
    function uint2str(uint256 _i) internal pure returns (string memory _uintAsString) {
        if (_i == 0) {
            return "0";
        }
        uint256 j = _i;
        uint256 len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint256 k = len;
        while (_i != 0) {
            k = k - 1;
            uint8 temp = (48 + uint8(_i - (_i / 10) * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }
}
