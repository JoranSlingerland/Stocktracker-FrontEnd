export default function Home() {
  return (
    <div className="flex flex=col items-center justify-center w-full h-screen text-center ">
      <div className="relative z-0 w-96 h-96 ">
        <h1 className="text-3xl"> Index{'\n'}</h1>
      </div>
      <div className="absolute inset-0 z-10 flex items-center justify-center">
       <a href="/.auth/login/aad?post_login_redirect_uri=/">Login</a>
      </div>
    </div>
  );
}
