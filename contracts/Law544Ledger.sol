// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title Law544Ledger
/// @notice Minimal local-chain anchor for Law 544/2001 audit events.
/// @dev The browser/backend computes canonical SHA-256 state hashes. This
/// contract only enforces append-only ordering and emits the minimum public
/// audit data; raw documents and PII stay off-chain.
contract Law544Ledger {
    struct TransitionInput {
        bytes32 requestIdHash;
        bytes32 payloadHash;
        bytes32 documentHash;
        bytes32 signerDidHash;
        bytes32 credentialHash;
        bytes32 previousStateHash;
        bytes32 stateHash;
        uint256 eventIndex;
        string action;
        string fromStatus;
        string toStatus;
        string signerRole;
        string occurredAt;
        string metadataUri;
    }

    uint256 public eventCount;
    bytes32 public headHash;

    event TransitionRecorded(
        uint256 indexed eventIndex,
        bytes32 indexed requestIdHash,
        bytes32 indexed stateHash,
        bytes32 previousStateHash,
        bytes32 payloadHash,
        bytes32 documentHash,
        bytes32 signerDidHash,
        bytes32 credentialHash,
        string action,
        string fromStatus,
        string toStatus,
        string signerRole,
        string occurredAt,
        string metadataUri
    );

    error UnexpectedEventIndex(uint256 expected, uint256 actual);
    error BrokenHashChain(bytes32 expectedPreviousStateHash, bytes32 actualPreviousStateHash);
    error EmptyStateHash();

    function appendTransition(TransitionInput calldata input) external {
        if (input.eventIndex != eventCount) {
            revert UnexpectedEventIndex(eventCount, input.eventIndex);
        }

        if (input.previousStateHash != headHash) {
            revert BrokenHashChain(headHash, input.previousStateHash);
        }

        if (input.stateHash == bytes32(0)) {
            revert EmptyStateHash();
        }

        eventCount += 1;
        headHash = input.stateHash;

        emit TransitionRecorded(
            input.eventIndex,
            input.requestIdHash,
            input.stateHash,
            input.previousStateHash,
            input.payloadHash,
            input.documentHash,
            input.signerDidHash,
            input.credentialHash,
            input.action,
            input.fromStatus,
            input.toStatus,
            input.signerRole,
            input.occurredAt,
            input.metadataUri
        );
    }
}
