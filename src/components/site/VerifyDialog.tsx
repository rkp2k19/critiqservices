import { useEffect, useState } from "react";
import { CheckCircle2, Mail, Smartphone } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import {
  canViewFullDetails,
  generateOtp,
  isValidEmail,
  isValidIndianMobile,
  normalizeIndianMobile,
  type VerifiedVisitor,
} from "@/lib/verification";

type Channel = "mobile" | "email";

type ChannelState = {
  value: string;
  sentCode: string | null;
  entered: string;
  verified: boolean;
  error: string | null;
};

const empty: ChannelState = { value: "", sentCode: null, entered: "", verified: false, error: null };

export function VerifyDialog({
  open,
  onOpenChange,
  onVerified,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVerified: (visitor: VerifiedVisitor) => void;
}) {
  const [mobile, setMobile] = useState<ChannelState>(empty);
  const [email, setEmail] = useState<ChannelState>(empty);

  const done = canViewFullDetails({ mobileVerified: mobile.verified, emailVerified: email.verified });

  useEffect(() => {
    if (done) {
      onVerified({ mobile: normalizeIndianMobile(mobile.value), email: email.value.trim() });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  const setters = { mobile: setMobile, email: setEmail };

  function sendCode(channel: Channel) {
    const state = channel === "mobile" ? mobile : email;
    const set = setters[channel];
    const valid = channel === "mobile" ? isValidIndianMobile(state.value) : isValidEmail(state.value);
    if (!valid) {
      set({
        ...state,
        error:
          channel === "mobile"
            ? "Enter a valid 10-digit Indian mobile number."
            : "Enter a valid email address.",
      });
      return;
    }
    const code = generateOtp();
    set({ ...state, sentCode: code, entered: "", error: null });
    const target = channel === "mobile" ? `+91 ${normalizeIndianMobile(state.value)}` : state.value.trim();
    toast.success(`OTP sent to ${target}`, {
      description: `Demo mode: your code is ${code}`,
      duration: 10000,
    });
  }

  function verifyCode(channel: Channel) {
    const state = channel === "mobile" ? mobile : email;
    const set = setters[channel];
    if (state.entered.length !== 6) {
      set({ ...state, error: "Enter the 6-digit code." });
      return;
    }
    if (state.entered !== state.sentCode) {
      set({ ...state, error: "That code is not correct. Please try again." });
      return;
    }
    set({ ...state, verified: true, error: null });
    toast.success(channel === "mobile" ? "Mobile number verified" : "Email verified");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Verify to see full details</DialogTitle>
          <DialogDescription>
            Confirm your mobile number and email with a one-time code. Once both are verified you
            can view the complete property details.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <ChannelBlock
            channel="mobile"
            icon={<Smartphone className="size-4" />}
            label="Mobile number"
            placeholder="10-digit mobile number"
            inputMode="tel"
            prefix="+91"
            state={mobile}
            onChange={(value) => setMobile({ ...empty, value })}
            onCodeChange={(entered) => setMobile({ ...mobile, entered, error: null })}
            onSend={() => sendCode("mobile")}
            onVerify={() => verifyCode("mobile")}
          />
          <ChannelBlock
            channel="email"
            icon={<Mail className="size-4" />}
            label="Email ID"
            placeholder="you@example.com"
            inputMode="email"
            state={email}
            onChange={(value) => setEmail({ ...empty, value })}
            onCodeChange={(entered) => setEmail({ ...email, entered, error: null })}
            onSend={() => sendCode("email")}
            onVerify={() => verifyCode("email")}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ChannelBlock({
  channel,
  icon,
  label,
  placeholder,
  inputMode,
  prefix,
  state,
  onChange,
  onCodeChange,
  onSend,
  onVerify,
}: {
  channel: Channel;
  icon: React.ReactNode;
  label: string;
  placeholder: string;
  inputMode: "tel" | "email";
  prefix?: string;
  state: ChannelState;
  onChange: (v: string) => void;
  onCodeChange: (v: string) => void;
  onSend: () => void;
  onVerify: () => void;
}) {
  const id = `verify-${channel}`;
  return (
    <section className="rounded-xl border border-border bg-muted/50 p-4">
      <div className="mb-2 flex items-center justify-between">
        <Label htmlFor={id} className="inline-flex items-center gap-2 font-semibold">
          {icon}
          {label}
        </Label>
        {state.verified && (
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-success">
            <CheckCircle2 className="size-4" /> Verified
          </span>
        )}
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          {prefix && (
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-muted-foreground">
              {prefix}
            </span>
          )}
          <Input
            id={id}
            type={inputMode === "email" ? "email" : "tel"}
            inputMode={inputMode}
            autoComplete={inputMode === "email" ? "email" : "tel-national"}
            placeholder={placeholder}
            value={state.value}
            maxLength={inputMode === "email" ? 255 : 14}
            disabled={state.verified}
            onChange={(e) => onChange(e.target.value)}
            className={`h-10 bg-card ${prefix ? "pl-11" : ""}`}
          />
        </div>
        {!state.verified && (
          <Button type="button" variant={state.sentCode ? "outline" : "default"} className="h-10" onClick={onSend}>
            {state.sentCode ? "Resend" : "Send OTP"}
          </Button>
        )}
      </div>

      {state.sentCode && !state.verified && (
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <InputOTP
            maxLength={6}
            value={state.entered}
            onChange={onCodeChange}
            aria-label={`${label} OTP`}
          >
            <InputOTPGroup>
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <InputOTPSlot key={i} index={i} className="h-10 w-10 bg-card text-base" />
              ))}
            </InputOTPGroup>
          </InputOTP>
          <Button type="button" variant="highlight" className="h-10" onClick={onVerify}>
            Verify
          </Button>
        </div>
      )}

      {state.error && <p className="mt-2 text-sm text-destructive">{state.error}</p>}
    </section>
  );
}
