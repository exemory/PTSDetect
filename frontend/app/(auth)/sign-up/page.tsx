import { Metadata } from 'next';
import Link from 'next/link';
import SignUpForm from '@/components/auth/sign-up-form';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Sign in - PTSDetect',
  description: '',
};

export default function Page() {
  return (
    <>
      <div className="absolute right-4 top-4 flex items-center gap-4 md:right-8 md:top-8 ">
        <p className="text-sm text-muted-foreground">
          Already have an account?
        </p>
        <Link
          href="/sign-in"
          className={cn(buttonVariants({ variant: 'outline' }))}
        >
          Sign in
        </Link>
      </div>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[500px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Create an account
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your information below to create your account
          </p>
        </div>

        <SignUpForm />
      </div>
    </>
  );
}
