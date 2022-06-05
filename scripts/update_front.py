import yaml
import json

def main():

    with open("brownie-config.yaml","r") as brownie_config:
        print("hello there")
        config_dict = yaml.load(brownie_config,Loader=yaml.FullLoader)
        with open("./front_end/src/brownie-config.json","w") as brownie_json:
            json.dump(config_dict, brownie_json)