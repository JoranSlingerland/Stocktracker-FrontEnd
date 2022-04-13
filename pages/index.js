export default function Home() {
  return (
    <div className="flex flex=col items-center justify-center w-full h-screen text-center ">
        <h1 className="text-3xl"> Index{'\n'}</h1>
        <a href="/.auth/login/aad?post_login_redirect_uri=/">Login</a>
    </div>
  );
}
