// pages/login.js

import Link from 'next/link';
import Image from '../components/image';
import mypic from '../public/images/ms-symbollockup_signin_light.png';

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <div className="py-10 text-4xl">
        <h1>Welcome to the stocktracker web app</h1>
      </div>
      <div className="py-10">
        <Link
          href={
            '/.auth/login/aad?post_login_redirect_uri=/authenticated/portfolio/'
          }
        >
          <Image src={mypic} alt="mypic" />
        </Link>
      </div>
    </div>
  );
}
