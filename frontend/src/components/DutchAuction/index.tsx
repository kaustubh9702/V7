import { useWeb3React } from '@web3-react/core';
import { Contract, ethers, Signer } from 'ethers';
import {
  ChangeEvent,
  MouseEvent,
  ReactElement,
  useEffect,
  useState
} from 'react';
import styled from 'styled-components';
import DutchAuctionArtifact from '../../artifacts/contracts/DutchAuction.sol/DutchAuction.json';
import { Provider } from '../../utils/provider';
import { DeploySection } from './DeploySection';
import { SectionDivider } from '../SectionDivider';
import { ViewContractSection } from './ViewContractSection';
import { SubmitBidSection } from './SubmitBidSection';

const StyledGreetingDiv = styled.div`
  display: grid;
  grid-template-rows: 1fr 1fr 1fr;
  grid-template-columns: 135px 2.7fr 1fr;
  grid-gap: 10px;
  place-self: center;
  align-items: center;
`;

const StyledLabel = styled.label`
  font-weight: bold;
`;

const StyledInput = styled.input`
  padding: 0.4rem 0.6rem;
  line-height: 2fr;
`;



// Main interaction with Contract
export function DutchAuction(): ReactElement {
  const context = useWeb3React<Provider>();
  const { library, active } = context;

  const [signer, setSigner] = useState<Signer>();
  const [greeterContract, setGreeterContract] = useState<Contract>();
  const [greeterContractAddr, setGreeterContractAddr] = useState<string>('');
  const [greeting, setGreeting] = useState<string>('');
  const [greetingInput, setGreetingInput] = useState<string>('');

  useEffect((): void => {
    if (!library) {
      setSigner(undefined);
      return;
    }

    setSigner(library.getSigner());
  }, [library]);

  useEffect((): void => {
    if (!greeterContract) {
      return;
    }

    async function getGreeting(greeterContract: Contract): Promise<void> {
      const _greeting = await greeterContract.greet();

      if (_greeting !== greeting) {
        setGreeting(_greeting);
      }
    }

    getGreeting(greeterContract);
  }, [greeterContract, greeting]);


  function handleGreetingChange(event: ChangeEvent<HTMLInputElement>): void {
    event.preventDefault();
    setGreetingInput(event.target.value);
  }

  function handleGreetingSubmit(event: MouseEvent<HTMLButtonElement>): void {
    event.preventDefault();

    if (!greeterContract) {
      window.alert('Undefined greeterContract');
      return;
    }

    if (!greetingInput) {
      window.alert('Greeting cannot be empty');
      return;
    }

    async function submitGreeting(greeterContract: Contract): Promise<void> {
      try {
        const setGreetingTxn = await greeterContract.setGreeting(greetingInput);

        await setGreetingTxn.wait();

        const newGreeting = await greeterContract.greet();
        window.alert(`Success!\n\nGreeting is now: ${newGreeting}`);

        if (newGreeting !== greeting) {
          setGreeting(newGreeting);
        }
      } catch (error: any) {
        window.alert(
          'Error!' + (error && error.message ? `\n\n${error.message}` : '')
        );
      }
    }

    submitGreeting(greeterContract);
  }


  return (
    <>
      <DeploySection signer={signer} 
                     setGreeterContractAddr={setGreeterContractAddr} contractAddr={greeterContractAddr}  />

      <SectionDivider />
      <ViewContractSection signer={signer} contractAddr={greeterContractAddr} setGreeterContractAddr={setGreeterContractAddr} />
      <SectionDivider />
      <SubmitBidSection signer={signer} contractAddr={greeterContractAddr} setGreeterContractAddr={setGreeterContractAddr} />

    </>
  );
}
