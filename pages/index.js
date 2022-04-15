import Image from 'next/image';
import mypic from '../public/ms-symbollockup_signin_light.png'

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <Image src={mypic} width={215} height={41} alt="mslogo"></Image>
      <div className="py-10 text-4xl">
        {' '}
        <h1>Welcome to the stocktracker web app</h1>
      </div>

      <div className="py-10">02</div>
    </div>
  );
}
