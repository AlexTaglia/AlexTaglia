// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

import "@openzeppelin/contracts-upgradeable/utils/StringsUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/introspection/ERC165Upgradeable.sol";

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721ReceiverUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/IERC721MetadataUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";

contract alexTagliaNfts_V0 is Initializable, ERC721EnumerableUpgradeable, OwnableUpgradeable {
    using StringsUpgradeable for uint256;
    using CountersUpgradeable for CountersUpgradeable.Counter;

    CountersUpgradeable.Counter private _tokenIds;

    uint256 public cost;
    uint256 public maxSupply;
    uint256 public maxMintAmount;
    uint256 public nftPerAddressLimit;
    bool public paused;
    bool public onlyWhitelisted;
    address[] public whitelistedAddresses;
    mapping(address => uint256) public addressMintedBalance;
    mapping (uint256 => string) private _tokenURIs; 
    mapping (uint256 => address) creators; 


    function initialize(string memory _name, string memory _symbol) public initializer  {
        OwnableUpgradeable.__Ownable_init();
        __ERC721_init(_name, _symbol);
        cost = 0.0001 ether;
        maxSupply = 999;
        maxMintAmount = 1;
        nftPerAddressLimit = 100;
        paused = false;
        onlyWhitelisted = true;
    }

    function mint(uint256 _mintAmount, string memory tURI) public payable {
        require(!paused, "the contract is paused");
        uint totalMinted = _tokenIds.current();
        require(_mintAmount > 0, "need to mint at least 1 NFT");
        require(
            _mintAmount <= maxMintAmount,
            "max mint amount per session exceeded"
        );
        require(totalMinted + _mintAmount <= maxSupply, "max NFT limit exceeded");
        require(bytes(tURI).length > 0, "missing token uri");

        if (msg.sender != owner()) {
            if (onlyWhitelisted == true) {
                require(isWhitelisted(msg.sender), "user is not whitelisted");
                uint256 ownerMintedCount = addressMintedBalance[msg.sender];
                require(
                    ownerMintedCount + _mintAmount <= nftPerAddressLimit,
                    "max NFT per address exceeded"
                );
            }
            require(msg.value >= cost * _mintAmount, "insufficient funds");
        }

        for (uint256 i = 1; i <= _mintAmount; i++) {
            _mintSingleNFT(tURI);

        }
        

    }

    function _mintSingleNFT(string memory tURI) private {
        uint newTokenID = _tokenIds.current();
        _safeMint(msg.sender, newTokenID);
        _setTokenUri(newTokenID, tURI);
        _tokenIds.increment(); 
        if (msg.sender != owner()) {
            addressMintedBalance[msg.sender]++;
        }
        creators[newTokenID]=msg.sender;
    }

    function airdrop(address[] calldata users, uint256 numNFT, string memory tURI) external onlyOwner {
        require(!paused, "Minting is paused");
        uint totalMinted = _tokenIds.current();
        require(numNFT > 0, "Mint amount should be greater than 0");
        require(users.length > 0, "No address specified");
        require(totalMinted + (numNFT * users.length) <= maxSupply, "max NFT limit exceeded");

        for (uint256 i; i < users.length; i++) {
            for (uint256 j; j < numNFT; j++) {
                uint newTokenID = _tokenIds.current(); 
                _safeMint(users[i], newTokenID);
                _setTokenUri(newTokenID, tURI);
                _tokenIds.increment(); 
            }
        }
    }

    function _setTokenUri(uint256 tokenId, string memory tURI) private {
        _tokenURIs[tokenId] = tURI; 
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId),"ERC721Metadata: URI query for nonexistent token");
        
        return _tokenURIs[tokenId];
    }

    function getCreator(uint256 tokenId) public view returns (address) { 
        require(creators[tokenId]!= address(0),"tokenid without creator");
        return(creators[tokenId]);
    }

    function changeTokenUri(uint256 tokenId, string memory tURI) public onlyOwner{
      _tokenURIs[tokenId] = tURI; 
    }


    function isWhitelisted(address _user) public view returns (bool) {
        for (uint256 i = 0; i < whitelistedAddresses.length; i++) {
            if (whitelistedAddresses[i] == _user) {
                return true;
            }
        }
        return false;
    }

    function tokensOfOwner(address _owner) 
        external 
        view 
        returns (uint256[] memory) {
            uint256 tokenCount = balanceOf(_owner);
            uint256[] memory tokensId = new uint256[](tokenCount);
            for (uint256 i = 0; i < tokenCount; i++) {
                tokensId[i] = tokenOfOwnerByIndex(_owner, i);
            }
            return tokensId;
    }

    function setNftPerAddressLimit(uint256 _limit) public onlyOwner {
        nftPerAddressLimit = _limit;
    }

    function setCost(uint256 _newCost) public onlyOwner {
        cost = _newCost;
    }

    function setMaxSupply(uint256 _newmaxSupply) public onlyOwner {
        maxSupply = _newmaxSupply;
    }

    function setmaxMintAmount(uint256 _newmaxMintAmount) public onlyOwner {
        maxMintAmount = _newmaxMintAmount;
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

    function withdraw() public payable onlyOwner {
        uint balance = address(this).balance;
        require(balance > 0, "No ether left to withdraw");
        (bool success, ) = (msg.sender).call{value: balance}("");
        require(success, "Transfer failed.");
    }

    
}
