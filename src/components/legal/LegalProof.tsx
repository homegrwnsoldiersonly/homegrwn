import { Container, ProofPlaceholder, Section } from "@/components/ui";
import { AttorneyAdvertisingNote } from "./AttorneyAdvertisingNote";

export interface LegalProofProps {
  name: string;
}

/**
 * Claims-gated proof section. Renders ONLY the labelled placeholder until
 * docs/content/claims.md marks legal results VERIFIED, plus the attorney
 * advertising note because this is where the page speaks about results.
 */
export function LegalProof({ name }: LegalProofProps) {
  return (
    <Section variant="dark" id="proof">
      <Container>
        <ProofPlaceholder
          title={`${name} case studies publish as firms go live.`}
          body="We report cost per signed case from account data, with the firm's permission and its bar rules respected. No invented percentages, no settlement figures, no stock-name testimonials. This section fills in as the first HOMEGRWN legal accounts report."
        />
        <AttorneyAdvertisingNote className="mt-6 max-w-3xl" />
      </Container>
    </Section>
  );
}
