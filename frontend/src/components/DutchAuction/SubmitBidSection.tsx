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
  grid-template-columns: 350px 350px;
  grid-gap: 50px;
  place-self: center;
  align-items: center;
`;

const StyledButton = styled.button`
  width: 150px;
  height: 2rem;
  border-radius: 1rem;
  border-color: blue;
  cursor: pointer;
`;

export function SubmitBidSection({setGreeterContractAddr, signer, contractAddr }: {
    signer: any,
    setGreeterContractAddr: any,
    contractAddr: string
}): ReactElement {

    const context = useWeb3React<Provider>();
    const { active } = context;

    const [contract, setContract] = useState<Contract>();

    const [price, setPrice] = useState<string>('');
    const [winnerAddress, setWinnerAddress] = useState<string>('');
    const [addressInput, setAddressInput] = useState<string>('');

    useEffect(() => {

        if(!active || !contractAddr) {
            console.log("Not Active Yet");
            return;
        }
        
        console.log("now Active")
        const cntr = new ethers.Contract(contractAddr, DutchAuctionArtifact.abi, signer)
        setContract(cntr);
 
    }, [active, contractAddr])

    useEffect(() => {
      getParams();
    }, [contract])

    async function submitBit() {
        try {
          await contract?.bid({value: price});
          setWinnerAddress("Accepted");
          window.alert("Dutch Auction completed!")
          console.log("Bid Complete")  
        } catch(e) {
          setWinnerAddress("Rejected");
        }
    }

    async function getParams(){
      const winner = await contract?.winnerAddress();

      setWinnerAddress(winner === "0x0000000000000000000000000000000000000000" ? "Available" : "Accepted");
    }

    function viewContract() {
      if(ethers.utils.isAddress(addressInput)) {
        setGreeterContractAddr(addressInput);
      } else window.alert("Invalid Address")
    }


    return (
                  

        <StyledGreetingDiv>

        <StyledInput
        id="priceInput"
        type="text"
        value={addressInput}
        onChange={(e) => setAddressInput(e.target.value)}
      ></StyledInput>
      <StyledButton
        onClick={viewContract}
      >
       Enter address: 
      </StyledButton>

        <StyledLabel htmlFor="priceInput">Bid</StyledLabel>
        <StyledInput
          id="priceInput"
          type="text"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        ></StyledInput>
        <StyledButton
          onClick={submitBit}
        >
          Bid
        </StyledButton>
        <StyledLabel htmlFor="winnerAddress">Status {winnerAddress.toString()}</StyledLabel>
        </StyledGreetingDiv>
    )
}