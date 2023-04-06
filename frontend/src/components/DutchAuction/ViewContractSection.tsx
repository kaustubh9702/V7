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


export function ViewContractSection({ setGreeterContractAddr, signer, contractAddr }: {
    signer: any,
    setGreeterContractAddr: any,
    contractAddr: string
}): ReactElement {

    const context = useWeb3React<Provider>();
    const { active } = context;

    const [contract, setContract] = useState<Contract>();

    const [reservePrice, setReservePrice] = useState<string>('');
    const [offerPriceDecrement, setPriceDecrement] = useState<string>('');
    const [blocksOpen, setBlocksOpen] = useState<string>('');
    const [initialPrice, setIntitalPrice] = useState<string>('');
    const [winnerAddress, setWinnerAddress] = useState<string>('');
    const [sellerAddress , setSellerAddress] = useState<string>('');
    const [addressInput, setAddressInput] = useState<string>('');

    // uint256 public auctionOpenedOn;
    // uint256 public initialPrice;    
    // address public sellerAddress;
    // address public winnerAddress;
    // bool public auctionOpen;
    // bool public amountSent;

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
      
        if(!contract) {
           return;
        }
       async function getParams() {
        
           setReservePrice(await contract?.reservePrice());
           setPriceDecrement(await contract?.offerPriceDecrement());
           setIntitalPrice(await contract?.initialPrice() );
           setBlocksOpen(await contract?.numBlocksAuctionOpen());
           setWinnerAddress(await contract?.winnerAddress());
           setSellerAddress(await contract?.sellerAddress());

           console.log(await contract?.reservePrice())

           setTimeout(getParams, 5000);
       }

       setTimeout(getParams, 5000);


        getParams()
    }, [contract])

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
          Show info
        </StyledButton>

            <StyledLabel htmlFor="reservePrice">Initial Price: {reservePrice.toString()} </StyledLabel> 
            <StyledLabel htmlFor="priceDecrement">Price Decrement: {offerPriceDecrement.toString()}</StyledLabel>
            <StyledLabel htmlFor="initialPrice">Current Price: {initialPrice.toString()}</StyledLabel>
            <StyledLabel htmlFor="blocksOpen">No of Rounds: {blocksOpen.toString()}</StyledLabel>
            <StyledLabel htmlFor="winnerAddress">Wiiner Address: {winnerAddress.toString()}</StyledLabel>
            <StyledLabel htmlFor="sellerAddress">Seller Address: {sellerAddress.toString()}</StyledLabel>


        {/* <StyledLabel htmlFor="priceInput">Bid</StyledLabel>
        <StyledInput
          id="priceInput"
          type="text"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        ></StyledInput>
        <StyledButton
          onClick={submitBit}
        >
          Submit
        </StyledButton> */}
        </StyledGreetingDiv>
    )
}