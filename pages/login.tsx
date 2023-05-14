import { Image, Typography } from 'antd';

const { Title, Link } = Typography;

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <Title className="py-10">Welcome to the stocktracker web app</Title>
      <Link
        href={
          '/.auth/login/aad?post_login_redirect_uri=/authenticated/portfolio/'
        }
        className="py-10"
      >
        <Image
          src="/images/ms-symbollockup_signin_light.png"
          alt="Microsoft"
          fallback="/images/fallback.png"
          preview={false}
          placeholder={false}
        />
      </Link>
    </div>
  );
}
