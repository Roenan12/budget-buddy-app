import { Button } from "@/components/ui/button";
import { signInAction } from "@/lib/actions";

function SignInButton() {
  return (
    <form action={signInAction}>
      <Button variant="outline" size="lg" className="w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://authjs.dev/img/providers/google.svg"
          alt="Google logo"
          height="24"
          width="24"
        />
        Google
      </Button>
    </form>
  );
}

export default SignInButton;
