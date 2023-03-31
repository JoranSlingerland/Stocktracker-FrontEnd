import { Divider } from 'antd';

export async function getStaticPaths() {
  return {
    paths: ['401', '403', '404'].map((errorcode) => ({
      params: { id: errorcode },
    })),
    fallback: false,
  };
}

export async function getStaticProps(context: { params: { id: string } }) {
  return {
    props: { errorcode: context.params.id },
  };
}

export default function DynamicPage(errorcode: { errorcode: string }) {
  return (
    <div className="flex items-center justify-center w-full h-screen">
      <h1>{errortext(errorcode)}</h1>
    </div>
  );
}

function errortext(errorcode: { errorcode: string }) {
  if (errorcode.errorcode === '401') {
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
  if (errorcode.errorcode === '403') {
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
  if (errorcode.errorcode === '404') {
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
}
