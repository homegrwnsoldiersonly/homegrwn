import { Container, Eyebrow, Heading, Section } from "@/components/ui";

/**
 * Privacy policy stub shared by the agency and Ads Driver surfaces.
 *
 * TODO(counsel): this is a generic, honest placeholder describing what the
 * site actually does today (two forms, no analytics, no ad pixels, no
 * third-party CRM yet). It is NOT reviewed legal text. Replace with
 * counsel-approved policy before paid acquisition starts, and re-check the
 * "what we collect" list whenever a form, pixel, or CRM is wired in.
 */

export interface PrivacyPolicyProps {
  /** Product name used in the copy, e.g. "HOMEGRWN" or "Ads Driver". */
  product: string;
  /** Public host the policy covers, e.g. "homegrwndigital.com". */
  host: string;
  /** Forms on this surface, described in plain words. */
  forms: string[];
  contactEmail?: string;
}

const LAST_REVIEWED = "September 2026";

export function PrivacyPolicy({
  product,
  host,
  forms,
  contactEmail = "connect@homegrwndigital.com",
}: PrivacyPolicyProps) {
  return (
    <>
      <Section variant="grain" padding="lg" as="div">
        <Container size="md">
          <Eyebrow flag>Privacy</Eyebrow>
          <Heading as="h1" size="display-lg" className="mt-5">
            Privacy policy
          </Heading>
          <p className="mt-6 max-w-2xl text-md text-white/70">
            What {product} collects on {host}, why, and what we do with it.
            Plain words, no surprises.
          </p>
          <p
            role="note"
            className="mt-6 inline-flex flex-wrap items-center gap-2 rounded-full border border-dashed border-white/25 px-3 py-1.5 text-xs text-white/70"
          >
            <span aria-hidden className="inline-block size-1.5 rounded-full bg-lime-500" />
            Draft — pending review by counsel. Last reviewed {LAST_REVIEWED}.
          </p>
        </Container>
      </Section>

      <Section variant="light" as="div">
        <Container size="md" className="space-y-10 text-base text-charcoal-900">
          <Block title="What we collect">
            <p>
              Only what you type into a form on this site. Today that is:
            </p>
            <ul className="mt-3 list-disc space-y-1.5 pl-5">
              {forms.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <p className="mt-3">
              We do not run advertising pixels, session recording, or
              third-party analytics on this site. If that changes, this page
              changes first.
            </p>
          </Block>

          <Block title="Why we collect it">
            <p>
              To reply to you. A form submission is a request for a
              conversation, and we use the details in it to have that
              conversation — nothing else.
            </p>
          </Block>

          <Block title="Who sees it">
            <p>
              The HOMEGRWN team. We do not sell, rent, or trade your details.
              If we adopt a CRM or scheduling tool to manage replies, your
              submission will be stored there under our account, and we will
              name that provider here.
            </p>
          </Block>

          <Block title="How long we keep it">
            <p>
              For as long as we are in a conversation with you, or until you
              ask us to delete it. Email {contactEmail} and we will remove
              your submission.
            </p>
          </Block>

          <Block title="Cookies">
            <p>
              One functional cookie (<code className="numerals">hg_surface</code>)
              remembers which HOMEGRWN site you are viewing on shared preview
              hosts. It contains no personal data. There are no tracking
              cookies.
            </p>
          </Block>

          <Block title="Your rights">
            <p>
              You can ask what we hold about you, ask us to correct it, or ask
              us to delete it. Write to {contactEmail}. We reply to every
              request.
            </p>
          </Block>

          <Block title="Changes">
            <p>
              We update this page when what we collect changes. The date at the
              top is the last review.
            </p>
          </Block>
        </Container>
      </Section>
    </>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <Heading as="h2" size="title" tone="dark">
        {title}
      </Heading>
      <div className="mt-3 max-w-prose text-charcoal-700">{children}</div>
    </section>
  );
}
