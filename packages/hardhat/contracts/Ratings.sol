// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Ratings is Ownable {
    using Counters for Counters.Counter;

    IERC20 public token; // ERC-20 token used for ratings
    uint256 public costPerRating; // Cost in ERC-20 tokens per rating
    Counters.Counter private ratingIdCounter;

    //mapping(address => mapping(uint256 => string)) private reviews;
    mapping(address => mapping(address => uint256)) private userRatings;

    event RatingSubmitted(address indexed reviewer, address indexed professional, uint256 ratingId);

    constructor(address _tokenAddress, uint256 _costPerRating) {
        token = IERC20(_tokenAddress);
        costPerRating = _costPerRating;
    }

    function setCostPerRating(uint256 _costPerRating) external onlyOwner {
        costPerRating = _costPerRating;
    }

    function submitRating(address professional, uint256 rating /*string memory reviewCID*/) external {
        require(rating >= 1 && rating <= 5, "Invalid rating");
        //require(bytes(reviews[professional][msg.sender]).length == 0, "Already reviewed");

        // Check if the user has enough tokens to cover the cost
        require(token.transferFrom(msg.sender, address(this), costPerRating), "Token transfer failed");

        // Store the review on IPFS and get the CID
        // In a real scenario, you would use an IPFS library or external service to interact with IPFS
        // Here, we simulate the storage by saving the CID directly
        //reviews[professional][msg.sender] = reviewCID;

        // Update user's total rating and increment the ratingIdCounter
        userRatings[professional][msg.sender] += rating;
        uint256 ratingId = ratingIdCounter.current();
        ratingIdCounter.increment();

        emit RatingSubmitted(msg.sender, professional, ratingId);
    }

    // function getReview(address professional, address reviewer) external view returns (string memory) {
    //     return reviews[professional][reviewer];
    // }

    function getUserTotalRating(address professional, address reviewer) external view returns (uint256) {
        return userRatings[professional][reviewer];
    }

    /**
	 * Function that allows the contract to receive ETH
	 */
	receive() external payable {}
}


