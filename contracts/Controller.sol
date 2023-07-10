// SPDX-License-Identifier: MIT

pragma solidity 0.8.15;

import "./interface/IController.sol";

contract Controller is IController {
    address public override governance;
    address public pendingGovernance;

    address public veXeno;
    address public voter;

    event SetGovernance(address value);
    event SetVeXeno(address value);
    event SetVoter(address value);

    constructor() {
        governance = msg.sender;
    }

    modifier onlyGov() {
        require(msg.sender == governance, "Not gov");
        _;
    }

    function setGovernance(address _value) external onlyGov {
        pendingGovernance = _value;
        emit SetGovernance(_value);
    }

    function acceptGovernance() external {
        require(msg.sender == pendingGovernance, "Not pending gov");
        governance = pendingGovernance;
    }

    function setVeXeno(address _value) external onlyGov {
        veXeno = _value;
        emit SetVeXeno(_value);
    }

    function setVoter(address _value) external onlyGov {
        voter = _value;
        emit SetVoter(_value);
    }
}
