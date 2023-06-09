// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract DutchAuction {

    uint256 public reservePrice;
    uint256 public numBlocksAuctionOpen;
    uint256 public auctionOpenedOn;
    uint256 public offerPriceDecrement;
    uint256 public initialPrice;    
    address public sellerAddress;
    address public winnerAddress;
    bool public auctionOpen;
    bool public amountSent;

    constructor(uint256 _reservePrice, uint256 _numBlocksAuctionOpen, uint256 _offerPriceDecrement)  {
        
        require(_reservePrice > 0);
        reservePrice = _reservePrice;
        require(_numBlocksAuctionOpen > 0);
        numBlocksAuctionOpen = _numBlocksAuctionOpen; 
        auctionOpenedOn = block.number;
        require(_offerPriceDecrement > 0);
        offerPriceDecrement = _offerPriceDecrement;
        sellerAddress = msg.sender;

        initialPrice = reservePrice + numBlocksAuctionOpen * offerPriceDecrement;

        auctionOpen = true;
        amountSent = false;
    }

    function bid() public payable returns(address) {


        require(block.number < auctionOpenedOn + numBlocksAuctionOpen, "Auction not open");

        require(auctionOpen, "Auction not open");
        
        require(initialPrice - (block.number - auctionOpenedOn) * offerPriceDecrement <= msg.value, 
                "Offer less than currentPrice");

       
        require(msg.sender == tx.origin); // only allow EOA

        auctionOpen = false;
        amountSent = true;
        _transfer(sellerAddress, msg.value);
        winnerAddress = msg.sender;

        return msg.sender;
    }

    function _transfer(address  _to, uint256 amount) internal {
        (bool success, ) = _to.call{value:amount}("");
        require(success, "Transfer failed.");
    }
}
