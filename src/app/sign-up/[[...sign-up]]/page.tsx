import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen celestial-gradient flex items-center justify-center p-4">
      <div className="w-full max-w-md flex flex-col items-center justify-center">
        <div className="text-center mb-8 flex flex-col items-center justify-center">
          <h1 className="font-cormorant text-3xl font-bold text-[var(--primary)] mb-2 text-center">
            Begin Your Journey
          </h1>
          <p className="text-[var(--muted)] text-center">
            Create your account to discover your destiny
          </p>
        </div>
        <div className="w-full flex justify-center">
          <SignUp 
            fallbackRedirectUrl="/dashboard"
          appearance={{
            elements: {
              card: "bg-[#0B0C10]/80 backdrop-blur-lg border border-[var(--border)] text-center flex flex-col items-center",
              headerTitle: "text-[var(--foreground)] text-center",
              headerSubtitle: "text-[var(--muted)] text-center",
              socialButtonsBlockButton: "border border-[var(--border)] hover:bg-[var(--primary)]/10 text-center mx-auto",
              formFieldInput: "bg-transparent border-[var(--border)] text-[var(--foreground)] text-center mx-auto",
              formFieldLabel: "text-center",
              formFieldRow: "text-center flex flex-col items-center",
              formField: "text-center flex flex-col items-center",
              formButtonPrimary: "bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-black text-center w-full mx-auto",
              footerActionLink: "text-[var(--primary)] hover:text-[var(--primary)]/80 text-center",
              footerActionText: "text-center",
              identityPreviewText: "text-center",
              formHeaderTitle: "text-center",
              formHeaderSubtitle: "text-center",
              form: "text-center flex flex-col items-center",
              formButton: "text-center mx-auto",
              footer: "text-center flex flex-col items-center",
              footerAction: "text-center flex flex-col items-center",
              socialButtons: "text-center flex flex-col items-center",
              socialButtonsBlock: "text-center flex flex-col items-center",
              formFieldInputWrapper: "text-center flex flex-col items-center",
              formFieldLabelWrapper: "text-center flex flex-col items-center",
            },
          }}
          />
        </div>
      </div>
    </div>
  );
}
