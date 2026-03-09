import { useReadContract, useWriteContract, useAccount } from 'wagmi'
import { CONTRACTS } from '@/lib/contractAddresses'
import LenderRegistryAbi from '@/lib/abis/LenderRegistry.json'

/**
 * Custom React Hook for LenderRegistry Interactions
 * Provides read status and admin write methods for managing approved lenders.
 */
export function useLenderRegistry() {
  const { address } = useAccount()
  const contractAddress = CONTRACTS.LENDER_REGISTRY

  const { writeContractAsync } = useWriteContract()

  // READ: Check if a specific address is an approved lender
  const useIsApprovedLender = (lenderAddress: `0x${string}` | undefined) => {
    return useReadContract({
      address: contractAddress,
      abi: LenderRegistryAbi as any,
      functionName: 'isApprovedLender',
      args: lenderAddress ? [lenderAddress] : undefined,
      query: {
        enabled: !!lenderAddress,
      }
    })
  }

  // WRITE: Approve a single lender (Requires REGISTRY_ADMIN_ROLE)
  const approveLender = async (lenderAddress: `0x${string}`) => {
    // @ts-expect-error Wagmi v2 strict ABI typing from JSON imports
    return await writeContractAsync({
      address: contractAddress,
      abi: LenderRegistryAbi as any,
      functionName: 'approveLender',
      args: [lenderAddress],
    })
  }

  // WRITE: Revoke a single lender (Requires REGISTRY_ADMIN_ROLE)
  const revokeLender = async (lenderAddress: `0x${string}`) => {
    // @ts-expect-error Wagmi v2 strict ABI typing from JSON imports
    return await writeContractAsync({
      address: contractAddress,
      abi: LenderRegistryAbi as any,
      functionName: 'revokeLender',
      args: [lenderAddress],
    })
  }

  // WRITE: Batch approve lenders (Requires REGISTRY_ADMIN_ROLE)
  const batchApproveLenders = async (lenderAddresses: `0x${string}`[]) => {
    // @ts-expect-error Wagmi v2 strict ABI typing from JSON imports
    return await writeContractAsync({
      address: contractAddress,
      abi: LenderRegistryAbi as any,
      functionName: 'batchApproveLenders',
      args: [lenderAddresses],
    })
  }

  // WRITE: Batch revoke lenders (Requires REGISTRY_ADMIN_ROLE)
  const batchRevokeLenders = async (lenderAddresses: `0x${string}`[]) => {
    // @ts-expect-error Wagmi v2 strict ABI typing from JSON imports
    return await writeContractAsync({
      address: contractAddress,
      abi: LenderRegistryAbi as any,
      functionName: 'batchRevokeLenders',
      args: [lenderAddresses],
    })
  }

  return {
    contractAddress,
    useIsApprovedLender,
    approveLender,
    revokeLender,
    batchApproveLenders,
    batchRevokeLenders,
  }
}
