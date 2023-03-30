import { useWeb3React } from '@web3-react/core';
import { Contract, ethers, Signer } from 'ethers';
import { Provider } from '../../utils/provider';
import {
    ChangeEvent,
    MouseEvent,
    ReactElement,
    useEffect,
    useState
} from 'react';
import styled from 'styled-components';
import DutchAuctionArtifact from '../../artifacts/contracts/DutchAuction.sol/DutchAuction.json';


const StyledDeployContractButton = styled.button`
  width: 180px;
  height: 2rem;
  border-radius: 1rem;
  border-color: blue;
  cursor: pointer;
  place-self: center;
`;


const StyledInput = styled.input`
  padding: 0.4rem 0.6rem;
  line-height: 2fr;
`;

const StyledLabel = styled.label`
  font-weight: bold;
`;


const StyledGreetingDiv = styled.div`
  display: grid;
  grid-template-rows: 1fr 1fr;
  grid-template-columns: 135px 145px;
  grid-gap: 10px;
  place-self: center;
  align-items: center;
`;


export function DeploySection({ setGreeterContractAddr, signer, contractAddr }: {
    signer: any,
    contractAddr : string,
    setGreeterContractAddr: any
}): ReactElement {

    const context = useWeb3React<Provider>();
    const { active } = context;
    const [contract, setContract] = useState<Contract>();
    const [reservePrice, setReservePrice] = useState<string>('');
    const [priceDecrement, setPriceDecrement] = useState<string>('');
    const [blocksOpen, setBlocksOpen] = useState<string>('');

    useEffect(() => {

        if(!active || !contractAddr) {
            console.log("Not Active Yet");
            return;
        }
        
        console.log("now Active")
        const cntr = new ethers.Contract(contractAddr, DutchAuctionArtifact.abi, signer)
        setContract(cntr);
 
    }, [active, contractAddr])

    function handleDeployContract(event: MouseEvent<HTMLButtonElement>) {
        event.preventDefault();

        // only deploy the Greeter contract one time, when a signer is defined
        if (!signer) {
            return;
        }


        async function deployDutchAction(signer: Signer): Promise<void> {
            const Greeter = new ethers.ContractFactory(
                DutchAuctionArtifact.abi,
                DutchAuctionArtifact.bytecode,
                signer
            );

            try {
                const greeterContract = await Greeter.deploy(reservePrice, blocksOpen, priceDecrement);
                await greeterContract.deployed();
                window.alert(`Dutch Action deployed to: ${greeterContract.address}`);
                setGreeterContractAddr(greeterContract.address);
            } catch (error: any) {
                window.alert(
                    'Error!' + (error && error.message ? `\n\n${error.message}` : '')
                );
            }
        }

        deployDutchAction(signer);
    }

    return (
        <StyledGreetingDiv>
            <StyledLabel htmlFor="reservePrice">Set new Reserve Price</StyledLabel>
            <StyledInput
                id="reservePrice"
                type="text"
                value={reservePrice}
                onChange={(e) => setReservePrice(e.target.value)}
            ></StyledInput>
            <StyledLabel htmlFor="priceDecrement">Price Decrement</StyledLabel>
            <StyledInput
                id="priceDecrement"
                type="text"
                value={priceDecrement}
                onChange={(e) => setPriceDecrement(e.target.value)}
            ></StyledInput>
            <StyledLabel htmlFor="blocksOpen">Set no of Rounds</StyledLabel>
            <StyledInput
                id="blocksOpen"
                type="text"
                value={blocksOpen}
                onChange={(e) => setBlocksOpen(e.target.value)}
            ></StyledInput>

            <StyledDeployContractButton
                style={{
                    cursor: !active  ? 'not-allowed' : 'pointer',
                    borderColor: !active ? 'unset' : 'blue'
                }}
                onClick={handleDeployContract}
            >
                Deploy Auction
            </StyledDeployContractButton>
            <br></br>
        <StyledLabel>Contract addr</StyledLabel>
        <div>
          {contractAddr ? (
            contractAddr
          ) : (
            <em>{`<Contract not yet deployed>`}</em>
          )}
        </div>

        </StyledGreetingDiv>

    )
}