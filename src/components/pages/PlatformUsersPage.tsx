import React from 'react';
import DocsLayout from '../layouts/DocsLayout';
import { HeadingItem } from '../../types/docs';
import usersManualContent from '../../content/docs/platform-users-manual.md?raw';

const headings: HeadingItem[] = [
  { id: "1-what-usdgb-is-and-is-not", text: "1. What USDGB Is (and Is Not)", level: 2 },
  { id: "2-who-can-use-the-platform", text: "2. Who Can Use the Platform", level: 2 },
  { id: "3-getting-a-compatible-wallet", text: "3. Getting a Compatible Wallet", level: 2 },
  { id: "4-buying-usdgb", text: "4. Buying USDGB", level: 2 },
  { id: "5-launch-timeline-what-to-expect-when", text: "5. Launch Timeline (What to Expect When)", level: 2 },
  { id: "6-holding-usdgb", text: "6. Holding USDGB", level: 2 },
  { id: "7-staking-usdgb-for-certificates", text: "7. Staking USDGB for Certificates", level: 2 },
  { id: "8-borrowing-against-staking-certificates", text: "8. Borrowing Against Staking Certificates", level: 2 },
  { id: "9-exiting-your-position", text: "9. Exiting Your Position", level: 2 },
  { id: "10-security-and-best-practices", text: "10. Security and Best Practices", level: 2 },
  { id: "11-owner-mindset-without-legal-ownership", text: "11. Owner Mindset (Without Legal Ownership)", level: 2 }
];

export default function PlatformUsersPage() {
  return (
    <DocsLayout
      title="Platform Users Manual"
      version="1.0 – March 2026"
      headings={headings}
      markdownContent={usersManualContent}
    />
  );
}
