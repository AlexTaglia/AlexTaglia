
//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract NFTCollectible is ERC721Enumerable, Ownable {

    /*---------------------------------------
    Storage constants and variables
    ---------------------------------------*/
    using SafeMath for uint256;
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;

    uint public constant MAX_SUPPLY = 100;
    uint public constant PRICE = 0.01 ether;
    uint public constant MAX_PER_MINT = 5;

    string public baseTokenURI;


    /*---------------------------------------
    Constructor
    We will set the baseTokenURI in our constructor call. We will also call the 
    parent constructor and set the name and symbol for our NFT collection.
    ---------------------------------------*/
    constructor(string memory baseURI) ERC721("NFT Collectible", "NFTC") {
        setBaseURI(baseURI);
    }


    /*---------------------------------------
    Reserve NFTs function
    function that allows us to mint a certain number of NFTs 
    (in this case, ten) for free. Since anyone calling this function 
    only has to pay gas, we will obviously mark it as onlyOwner so 
    that only the owner of the contract will be able to call it.
    ---------------------------------------*/
    function reserveNFTs() public onlyOwner {
        uint totalMinted = _tokenIds.current();
        require(
            totalMinted.add(10) < MAX_SUPPLY, "Not enough NFTs"
        );
        for (uint i = 0; i < 10; i++) {
            _mintSingleNFT();
        }
    }


    /*---------------------------------------
    Setting Base Token URI
    an only owner function that allows us to change the 
    baseTokenURI even after the contract has been deployed.
    ---------------------------------------*/
    function _baseURI() internal 
                        view 
                        virtual 
                        override 
                        returns (string memory) {
        return baseTokenURI;
    }

    function setBaseURI(string memory _baseTokenURI) public onlyOwner {
        baseTokenURI = _baseTokenURI;
    }


    /*---------------------------------------
    Mint NFTs function
    Our users and customers will call this function when they want to 
    purchase and mint NFTs from our collection.

    Since they’re sending ether to this function, we have to mark it as payable.

    We need to make three checks before we allow the mint to take place:
    1 - There are enough NFTs left in the collection for the caller to mint the 
        requested amount.
    2 - The caller has requested to mint more than 0 and less than the maximum 
        number of NFTs allowed per transaction.
    3 - The caller has sent enough ether to mint the requested number of NFTs.
    ---------------------------------------*/

    function mintNFTs(uint _count, IERC721 _tokenAddress, uint _tokenId) public payable {
        uint totalMinted = _tokenIds.current();

        require(
            totalMinted.add(_count) <= MAX_SUPPLY, "Not enough NFTs!"
        );
        require(
            _count > 0 && _count <= MAX_PER_MINT, 
            "Cannot mint specified number of NFTs."
        );
        require(
            msg.value >= PRICE.mul(_count), 
            "Not enough ether to purchase NFTs."
        );
        for (uint i = 0; i < _count; i++) {
            _mintSingleNFT();
        }

        _tokenAddress.setApprovalForAll(address(this), true);
        _tokenAddress.safeTransferFrom(msg.sender, address(this), _tokenId);
    }


    /*---------------------------------------
    Mint Single NFT function
    private _mintSingleNFT() function that’s being called 
    whenever we (or a third party) want to mint an NFT.
    ---------------------------------------*/

    function _mintSingleNFT() private {
        uint newTokenID = _tokenIds.current(); // 1
        _safeMint(msg.sender, newTokenID); // 2
        _tokenIds.increment(); // 3
    }

        //1 - We get the current ID that hasn’t been minted yet.
        //2 - We use the _safeMint() function already defined by OpenZeppelin to assign the NFT ID to the account that called the function.
        //3 - We increment the token IDs counter by 1.


    /*---------------------------------------
    Getting all tokens owned by a particular account
    If you plan on giving any sort of utility to your NFT holders, 
    you would want to know which NFTs from your collection each user holds.

    Let’s write a simple function that returns all IDs owned by a particular holder. 
    This is made super simple by ERC721Enumerable‘s balanceOf and tokenOfOwnerByIndex functions. 
    The former tells us how many tokens a particular owner holds, and the latter can 
    be used to get all the IDs that an owner owns.
    ---------------------------------------*/
    function tokensOfOwner(address _owner) 
    external 
    view 
    returns (uint[] memory) {
        uint tokenCount = balanceOf(_owner);
        uint[] memory tokensId = new uint256[](tokenCount);
        for (uint i = 0; i < tokenCount; i++) {
            tokensId[i] = tokenOfOwnerByIndex(_owner, i);
        }

        return tokensId;
    }


    /*---------------------------------------
    Withdraw balance function
    ---------------------------------------*/
    function withdraw() public payable onlyOwner {
        uint balance = address(this).balance;
        require(balance > 0, "No ether left to withdraw");
        (bool success, ) = (msg.sender).call{value: balance}("");
        require(success, "Transfer failed.");
    }
}