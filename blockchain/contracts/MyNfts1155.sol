// SPDX-License-Identifier: MIT
// 0x052b589e63364c2D9851E3864a2e02304fd144AD Contract address

pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155SupplyUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";


contract MKT_1155_UPGR_V1 is Initializable,  OwnableUpgradeable, ERC1155Upgradeable, ERC1155SupplyUpgradeable {

    string public name;
    string public symbol;
    bool public paused;
    uint256 public cost;
    bool public onlyWhitelisted;
    address[] public whitelistedAddresses;
    uint256 public nftPerAddressLimit;


    uint256 public maxSupply;
    uint256 public maxCopies;



    mapping (uint256 => string) private _tokenURIs; 
    mapping (uint256 => address) creators; 
    mapping(address => uint256) public addressMintedBalance;

    using CountersUpgradeable for CountersUpgradeable.Counter;
    CountersUpgradeable.Counter private _tokenIds;
    
    function initialize() public initializer  {
        __Ownable_init();
        cost = 0.001 ether;
        paused = false;
        onlyWhitelisted = true;
        maxSupply = 999;
        maxCopies = 1000;
        nftPerAddressLimit = 10;

    }

    function mint(uint256 amount, string memory tokenURI) public payable {
        require(!paused, "the contract is paused");
        require(amount > 0, "Mint amount should be greater than 0");
        require(bytes(tokenURI).length > 0, "missing token uri");
        require(
            amount <= maxCopies,
            "max copies exceeded"
        );

        if (msg.sender != owner()) {
            if (onlyWhitelisted == true) {
                require(isWhitelisted(msg.sender), "user is not whitelisted");
                uint256 ownerMintedCount = addressMintedBalance[msg.sender];
                require(
                    ownerMintedCount + amount <= nftPerAddressLimit,
                    "max NFT per address exceeded"
                );
            }
            require(msg.value >= cost * amount, "insufficient funds");
        }
        uint256 newItemId = _tokenIds.current();
            
        _mint(msg.sender, newItemId, amount, ""); 
        _setTokenUri(newItemId, tokenURI);
        _tokenIds.increment();
        creators[newItemId]=msg.sender;

        if (msg.sender != owner()) {
            addressMintedBalance[msg.sender]++;
        }
    }

    
    function getCreator(uint256 tokenId) public view returns (address) { 
        require(creators[tokenId]!= address(0),"tokenid without creator");
        return(creators[tokenId]);
    }
    
    function uri(uint256 tokenId) override public view returns (string memory) { 
        return(_tokenURIs[tokenId]);
    }
    
    function _setTokenUri(uint256 tokenId, string memory tokenURI) private {
        _tokenURIs[tokenId] = tokenURI; 
    }

    function isWhitelisted(address _user) public view returns (bool) {
        for (uint256 i = 0; i < whitelistedAddresses.length; i++) {
            if (whitelistedAddresses[i] == _user) {
                return true;
            }
        }
        return false;
    }

    function setMaxSupply(uint256 _newmaxSupply) public onlyOwner {
        maxSupply = _newmaxSupply;
    }

    function setMaxCopies(uint256 _newmaxCopies) public onlyOwner {
        maxCopies = _newmaxCopies;
    }

    function pause(bool _state) public onlyOwner {
        paused = _state;
    }

    function setOnlyWhitelisted(bool _state) public onlyOwner {
        onlyWhitelisted = _state;
    }


    function whitelistUsers(address[] calldata _users) public onlyOwner {
        delete whitelistedAddresses;
        whitelistedAddresses = _users;
    }

    function whitelistUser(address _users) public onlyOwner {
        whitelistedAddresses.push(_users);
    }

    function setName(string memory _name) public onlyOwner {
        name = _name;
    }

    function setSymbol(string memory _symbol) public onlyOwner {
        symbol = _symbol;
    }

    function changeTokenUri(uint256 tokenId, string memory tokenURI) public onlyOwner{
       _tokenURIs[tokenId] = tokenURI; 
    }

    function setCost(uint256 _newCost) public onlyOwner {
        cost = _newCost;
    }

    function _beforeTokenTransfer(address operator, address from, address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        internal
        override(ERC1155Upgradeable, ERC1155SupplyUpgradeable)
    {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }

}