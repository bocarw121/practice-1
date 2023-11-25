// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
import 'hardhat/console.sol';

interface ITheClub {
    function signUp() external;

    function payDeposit() external payable;
}

// TODO add ban function
// TODO add interact function
// TODO Seperate logic out
// TODO Add more tests

// THere will be one owner
// You can sign up but you will have 24 hours to minutes to make the deposit
// If you dont make the deposit on time you will be marked as Expired for life -  I know harsh but thats The Club policies
contract TheClub is ITheClub {
    uint public constant entryFee = 0.2 ether;
    uint time = block.timestamp;
    address public owner;

    enum Status {
        Pending,
        Paid,
        Expired,
        Banned
    }

    struct Member {
        address member;
        Status status;
        uint deposit;
    }

    mapping(address => bool) signedUp;
    address[] signUpExpired;
    Member[] public members;

    constructor() {
        owner = msg.sender;
    }

    modifier notOwner() {
        require(
            msg.sender != owner,
            "Dude you're already the owner of the club"
        );
        _;
    }

    modifier statusChecks() {
        (bool isPending, bool isBanned, bool isPaid, ) = memberStatus();
        require(
            !isPending,
            'You already signed up make sure to pay within the 24 hour period'
        );

        require(!isPaid, "You're already an active member");

        require(!isBanned, 'You can no longer be apart of this club');
        _;
    }

    event Paid(address indexed sender, bool paid);

    function payDeposit() external payable override notOwner {
        bool isOnTime = block.timestamp - time < 24 hours;

        if (!isOnTime) {
            members.push(
                Member({
                    member: msg.sender,
                    status: Status.Expired,
                    deposit: uint(0)
                })
            );

            require(
                !isOnTime,
                'You missed the 24 hour period you can no longer join the club, sorry!'
            );
        }

        require(isOnTime, 'Your time to sign up has expired');

        require(
            msg.value == entryFee,
            'You must pay .2 ether to join this club'
        );

        for (uint i = 0; i < members.length; i++) {
            if (members[i].member == msg.sender) {
                Member storage member = members[i];
                // update member status
                member.status = Status.Paid;
            }
        }

        emit Paid(msg.sender, true);
    }

    event Timer(address indexed from, uint _time);

    function signUp() external override notOwner statusChecks {
        members.push(
            Member({
                member: msg.sender,
                status: Status.Pending,
                deposit: uint(0)
            })
        );

        emit Timer(msg.sender, 24 hours);
    }

    function memberStatus()
        internal
        view
        returns (bool isPending, bool isBanned, bool isPaid, bool isExpired)
    {
        bool _isPending;
        bool _isBanned;
        bool _isPaid;
        bool _isExpired;

        for (uint256 i = 0; i < members.length; i++) {
            if (members[i].status == Status.Pending) {
                _isPending = true;
            }
            if (members[i].status == Status.Banned) {
                _isBanned = true;
            }
            if (members[i].status == Status.Paid) {
                _isPaid = true;
            }
            if (members[i].status == Status.Expired) {
                _isExpired = true;
            }
        }

        return (_isPending, _isBanned, _isPaid, _isExpired);
    }
}
