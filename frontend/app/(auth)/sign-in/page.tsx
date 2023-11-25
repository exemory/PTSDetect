import { Metadata } from 'next';
import Link from 'next/link';
import SignInForm from '@/components/auth/sign-in-form';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Sign in - PTSDetect',
  description: 'sign in page',
};

export default function Page() {
  return (
    <>
      <div className="absolute right-4 top-4 flex items-center gap-4 md:right-8 md:top-8 ">
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?
        </p>
        <Link
          href="/sign-up"
          className={cn(buttonVariants({ variant: 'outline' }))}
        >
          Sign up
        </Link>
      </div>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Sign in to account
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email and password below to sign in
          </p>
        </div>

        <SignInForm />

        <p className="px-8 text-center text-sm text-muted-foreground">
          Forgot Password?{' '}
          <Link
            href="/reset-password"
            className="underline underline-offset-4 hover:text-primary"
          >
            Reset
          </Link>{' '}
        </p>
      </div>
    </>
  );
}
