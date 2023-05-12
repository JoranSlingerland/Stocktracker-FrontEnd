import React, { memo } from 'react';
import { Divider, Typography } from 'antd';
import { GithubOutlined } from '@ant-design/icons';

const { Text, Link } = Typography;

function FooterLinks() {
  return (
    <>
      <Link
        target="_blank"
        href="https://github.com/JoranSlingerland/StockTracker/blob/main/LICENSE"
        type="secondary"
      >
        License
      </Link>
      <Divider type="vertical" />
      <Link
        target="_blank"
        href="https://github.com/users/JoranSlingerland/projects/1/"
        type="secondary"
      >
        Roadmap
      </Link>
      <Divider type="vertical" />
      <Link
        href="https://github.com/JoranSlingerland/StockTracker"
        target="_blank"
        type="secondary"
      >
        <GithubOutlined /> API
      </Link>
      <Divider type="vertical" />
      <Link
        href="https://github.com/JoranSlingerland/StockTracker-frontend"
        target="_blank"
        type="secondary"
      >
        <GithubOutlined /> Frontend
      </Link>
      <Divider type="vertical" />
      <Link
        href="https://github.com/JoranSlingerland/StockTrackerInfrastructure"
        target="_blank"
        type="secondary"
      >
        <GithubOutlined /> Infrastructure
      </Link>
    </>
  );
}

function Footer({}: {}): JSX.Element {
  return (
    <div className="mt-auto">
      <Divider />
      <div className="flex justify-center mb-4">
        <div className="w-full flex flex-col space-y-2 text-center justify-center max-w-7xl">
          <div>
            <Text type="secondary" className="w-1/3">
              Stocktracker by Joran Slingerland
            </Text>
          </div>
          <div>
            <FooterLinks />
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(Footer);
