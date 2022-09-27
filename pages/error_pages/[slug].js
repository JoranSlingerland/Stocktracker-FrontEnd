import { useRouter } from 'next/router';
import { Divider } from 'antd';

export default function DynamicPage(props) {
  return (
    <div className="flex items-center justify-center w-full h-screen">
      <h1>{errortext()}</h1>
    </div>
  );
}

function errortext() {
  const router = useRouter();
  const { slug } = router.query;

  if (slug === '401') {
    return (
      <div>
        <div className="text-center text-9xl">401</div>
        <Divider />
        <div className="text-2xl align-middle">
          You are not authorized to view this page
        </div>
      </div>
    );
  }
  if (slug === '403') {
    return (
      <div>
        <div className="text-center text-9xl">403</div>
        <Divider />
        <div className="text-2xl align-middle">
          You do not have permissions to view this page
        </div>
      </div>
    );
  }
  if (slug === '404') {
    return (
      <div>
        <div className="text-center text-9xl">404</div>
        <Divider />
        <div className="text-2xl align-middle">
          The page you are looking for does not exist
        </div>
      </div>
    );
  }
  if (slug === '500') {
    return (
      <div>
        <div className="text-center text-9xl">500</div>
        <Divider />
        <div className="text-2xl align-middle">Internal server error</div>
      </div>
    );
  }
}
