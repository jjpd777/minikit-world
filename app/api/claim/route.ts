
import { MiniKit } from '@worldcoin/minikit-js';
import { ethers } from 'ethers';

export async function POST(req: Request) {
  const { signature, message, address } = await req.json();
  
  // Verify the signature matches the claimed address
  const signerAddress = ethers.verifyMessage(message, signature);
  
  if (signerAddress.toLowerCase() !== address.toLowerCase()) {
    return new Response('Invalid signature', { status: 400 });
  }

  // Backend would now execute the transfer
  // This part would interact with your contract using a funded account
  
  return new Response('Claim verified', { status: 200 });
}
