pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract TokenFarm is Ownable{

    address[] public allowedTokens;
    address[] public stakers;
    IERC20 rewardToken;
    mapping(address => mapping(address => uint256)) public stakingBalance;
    mapping(address => uint256) public uniqueTokensStaked;
    mapping(address => address) public tokenPriceFeed;

    constructor(address _rewardToken) public{
        rewardToken = IERC20(_rewardToken);
    }

    function setPriceFeedContract(address _token, address _priceFeed) public onlyOwner{
        tokenPriceFeed[_token] = _priceFeed;
    }

    function issueToken() public onlyOwner{
        for(uint256 i = 0; i < stakers.length; i++){
            address user = stakers[i];
            uint256 userValue = getUserValue(user);
            rewardToken.transfer(user,userValue);
        }
    }

    function getUserValue(address user) public returns(uint256){
        require(uniqueTokensStaked[user]>0,"No tokens staked");
        uint256 totalValue = 0;
        for(uint256 i = 0; i < allowedTokens.length; i++){
            totalValue = totalValue + uint256(getSingleTotalValue(user, allowedTokens[i]));
        }
        return totalValue;
    }

    function getSingleTotalValue(address _user, address _token) public view returns(uint256){
        (uint256 price, uint256 decimals) = getTokenValue(_token);
       return stakingBalance[_token][_user] * price / 10**decimals;
    }

    function getTokenValue(address _token) public view returns (uint256, uint256){
        address priceFeedAddress = tokenPriceFeed[_token];
        AggregatorV3Interface priceFeed = AggregatorV3Interface(priceFeedAddress);
        (,int256 price,,,) = priceFeed.latestRoundData();
        uint256 decimals = priceFeed.decimals();
        return (uint256(price),decimals);
    }

    function stakeToken( uint256 _amount, address _token) public {
        require(_amount > 0, "Amount should be greater than 0");
        require(tokenIsAllowed(_token), "Token not allowed");
        IERC20(_token).transferFrom(msg.sender, address(this), _amount);
        updateUniqueTokenStaked(msg.sender,_token);
        stakingBalance[_token][msg.sender] = stakingBalance[_token][msg.sender] + _amount;
        if(uniqueTokensStaked[msg.sender] == 1){
            stakers.push(msg.sender);
        }
    }

    function unStakeToken(address _token) public {
        require(tokenIsAllowed(_token), "Token not allowed");
        require(stakingBalance[_token][msg.sender] > 0, "No stakes present");
        uint256 balance = stakingBalance[_token][msg.sender];
        IERC20(_token).transfer(msg.sender, balance);
        uniqueTokensStaked[msg.sender]--;
        stakingBalance[_token][msg.sender] = 0;
    }

    function updateUniqueTokenStaked(address _staker, address _token) internal {
        if(stakingBalance[_token][msg.sender]<=0){
            uniqueTokensStaked[_staker]++;
        }
    }

    function addAllowedToken(address _token) public onlyOwner{
        allowedTokens.push(_token);
    }

    function tokenIsAllowed(address _token) public returns(bool){
        for(uint256 i = 0; i<allowedTokens.length; i++)
            if(allowedTokens[i] == _token){
                return true;
            }
        return false;
    }
}
