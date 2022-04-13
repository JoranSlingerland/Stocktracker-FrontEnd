import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsal,
} from '@azure/msal-react';

function SignInButton() {
  // useMsal hook will return the PublicClientApplication instance you provided to MsalProvider
  const { instance } = useMsal();

  return <button onClick={() => instance.loginRedirect()}>Sign In</button>;
}
function WelcomeUser() {
  const { accounts } = useMsal();
  const username = accounts[0].username;

  return <p>Welcome, {username}</p>;
}

export default function Home() {
  return (
    <div className="flex flex=col items-center justify-center w-full h-screen text-center ">
      <div className="relative z-0 w-96 h-96 ">
        <h1 className="text-3xl"> Index{'\n'}</h1>
      </div>
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <AuthenticatedTemplate>
          <p>This will only render if a user is signed-in.</p>
          <WelcomeUser />
        </AuthenticatedTemplate>
        <UnauthenticatedTemplate>
          <p>This will only render if a user is not signed-in.</p>
          <SignInButton />
        </UnauthenticatedTemplate>
      </div>
    </div>
  );
}
