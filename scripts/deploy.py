import json

from brownie import network,accounts,config
from web3 import Web3
from brownie import DappToken, TokenFarm, MockFAU,MockWETH, MockV3Aggregator, Contract, MockERC20
import yaml

contract_to_mock = {
    "eth_usd_price_feed": MockV3Aggregator,
    "dai_usd_price_feed":MockV3Aggregator,
    "weth_token":MockWETH,
    "fau_token":MockFAU
}

DECIMALS = 8
INITIAL_VALUE = 200000000000

def deploy_mocks():
    MockV3Aggregator.deploy(DECIMALS,INITIAL_VALUE,{"from":get_account()})
    MockFAU.deploy({"from":get_account()})
    MockWETH.deploy({"from":get_account()})
    MockERC20.deploy({"from":get_account()})

print("Mock done")

def get_contract(contract_name):
    contract_type = contract_to_mock[contract_name]
    if(network.show_active()=="development"):
        deploy_mocks()
        contract = contract_type[-1]
    else:
        contract_address = config["networks"][network.show_active()][contract_name]
        contract = Contract.from_abi("Contract",contract_address,contract_type.abi)

    return contract

def get_account(index = 0):
    if(network.show_active()=="development"):
        return accounts[index]
    else:
        return accounts.add(config["wallets"]["from_key"])

BALANCE =  Web3.toWei(100,"ether")

def deploy_token_farm_and_dapp_token(update=False):
    account = get_account(0)
    dappToken = DappToken.deploy(({"from":account}))
    tokenFarm = TokenFarm.deploy(dappToken.address,{"from":account})
    print(dappToken.totalSupply())
    tx = dappToken.transfer(tokenFarm.address, dappToken.totalSupply() - BALANCE, {"from":account})
    tx.wait(1)
    weth_token = get_contract("weth_token")
    fau_token = get_contract("fau_token")
    dict_allowed_tokens = {dappToken: get_contract("dai_usd_price_feed"),
                           weth_token: get_contract("eth_usd_price_feed"),
                           fau_token: get_contract("dai_usd_price_feed") }

    add_allowed_tokens(tokenFarm, dict_allowed_tokens, account)
    if update:
        update_front_end()
    return tokenFarm,dappToken


def add_allowed_tokens(tokenFarm, dict_of_tokens, account):
    for i in dict_of_tokens.keys():
        tokenFarm.addAllowedToken(i.address,{"from":account}).wait(1)
        tokenFarm.setPriceFeedContract(i.address,dict_of_tokens[i],{"from":account}).wait(1)

def test_stake_token():
    amount = Web3.toWei(100,"ether")
    if network.show_active() != "development":
        pass
    account  = get_account()
    tokenFarm, dappToken = deploy_token_farm_and_dapp_token(True)
    dappToken.approve(tokenFarm.address, amount, {"from":account})
    tokenFarm.stakeToken(amount, dappToken.address, {"from":account})

    print(tokenFarm.stakingBalance(dappToken.address, account.address))

def update_front_end():

    with open("brownie-config.yaml") as brownie_config:
        config_dict = yaml.load(brownie_config,Loader=yaml.FullLoader)
        with open("./front_end/src/brownie-config.json","w") as brownie_json:
            json.dump(config_dict, brownie_json)


def test_issue_tokens():
    pass


def main():
    deploy_token_farm_and_dapp_token()