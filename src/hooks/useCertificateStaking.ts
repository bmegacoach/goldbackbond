import { useReadContract, useWriteContract, useAccount } from 'wagmi'
import { CONTRACTS } from '@/lib/contractAddresses'
import CertificateStakingAbi from '@/lib/abis/CertificateStaking.json'

/**
 * Custom React Hook for Certificate Staking Interactions
 * Covers Borrower Stake Lifecycles + Admin/Lender Lien Mechanics
 */
export function useCertificateStaking() {
  const { address } = useAccount()
  const contractAddress = CONTRACTS.CERTIFICATE_STAKING

  const { writeContractAsync } = useWriteContract()

  // ---------------------------------------------------------
  // READ CALLS
  // ---------------------------------------------------------

  // Get specific user's stake info including lien statuses
  const useUserStakes = (userAddress: `0x${string}` | undefined) => {
    return useReadContract({
      address: contractAddress,
      abi: CertificateStakingAbi,
      functionName: 'userStakes',
      args: userAddress ? [userAddress] : undefined,
      query: {
        enabled: !!userAddress,
      }
    })
  }

  // Get dynamic leverage multipliers based on tiers
  const useLeverageEligibility = (userAddress: `0x${string}` | undefined) => {
    return useReadContract({
      address: contractAddress,
      abi: CertificateStakingAbi,
      functionName: 'getLeverageEligibility',
      args: userAddress ? [userAddress] : undefined,
      query: {
        enabled: !!userAddress,
      }
    })
  }

  // ---------------------------------------------------------
  // BORROWER WRITE CALLS
  // ---------------------------------------------------------

  // Stake pristine USDGB for collateralization
  const stakeForCertificate = async (amountUsdgb: bigint) => {
    // @ts-expect-error Wagmi v2 strict ABI typing from JSON imports
    return await writeContractAsync({
      address: contractAddress,
      abi: CertificateStakingAbi,
      functionName: 'stakeForCertificate',
      args: [amountUsdgb],
    })
  }

  // Upgrade the lockup term years programmatically
  const extendStakeTerm = async (newTermYears: number) => {
    // @ts-expect-error Wagmi v2 strict ABI typing from JSON imports
    return await writeContractAsync({
      address: contractAddress,
      abi: CertificateStakingAbi,
      functionName: 'extendStakeTerm',
      args: [newTermYears],
    })
  }

  // Full native withdrawal once unlockTime is met and lien == false
  const withdrawStake = async () => {
    // @ts-expect-error Wagmi v2 strict ABI typing from JSON imports
    return await writeContractAsync({
      address: contractAddress,
      abi: CertificateStakingAbi,
      functionName: 'withdraw',
    })
  }

  // ---------------------------------------------------------
  // LENDER & ADMIN LIFECYCLE WRITES
  // ---------------------------------------------------------

  // Place Lien (GUARDIAN_ROLE only post loan-origination docs)
  const placeLien = async (borrowerAddress: `0x${string}`, lenderAddress: `0x${string}`) => {
    // @ts-expect-error Wagmi v2 strict ABI typing from JSON imports
    return await writeContractAsync({
      address: contractAddress,
      abi: CertificateStakingAbi,
      functionName: 'placeLien',
      args: [borrowerAddress, lenderAddress],
    })
  }

  // Mark missed payment timer (Lender ONLY)
  const recordMissedPayment = async (borrowerAddress: `0x${string}`) => {
    // @ts-expect-error Wagmi v2 strict ABI typing from JSON imports
    return await writeContractAsync({
      address: contractAddress,
      abi: CertificateStakingAbi,
      functionName: 'recordMissedPayment',
      args: [borrowerAddress],
    })
  }

  // Reassign stake strictly after 30-day continuous default (GUARDIAN_ROLE)
  const guardianReassignStake = async (borrowerAddress: `0x${string}`) => {
    // @ts-expect-error Wagmi v2 strict ABI typing from JSON imports
    return await writeContractAsync({
      address: contractAddress,
      abi: CertificateStakingAbi,
      functionName: 'guardianReassignStake',
      args: [borrowerAddress],
    })
  }

  // Release Lien allowing withdrawal (Lender or Guardian)
  const releaseLien = async (borrowerAddress: `0x${string}`) => {
    // @ts-expect-error Wagmi v2 strict ABI typing from JSON imports
    return await writeContractAsync({
      address: contractAddress,
      abi: CertificateStakingAbi,
      functionName: 'releaseLien',
      args: [borrowerAddress],
    })
  }

  return {
    contractAddress,
    useUserStakes,
    useLeverageEligibility,
    stakeForCertificate,
    extendStakeTerm,
    withdrawStake,
    placeLien,
    recordMissedPayment,
    guardianReassignStake,
    releaseLien,
  }
}
