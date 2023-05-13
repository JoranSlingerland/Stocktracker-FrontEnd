import { Card, Statistic, CardProps, StatisticProps } from 'antd';

interface StatCardProps extends CardProps {
  statisticProps: StatisticProps;
}

const StatCard: React.FC<StatCardProps> = ({
  statisticProps,
  ...cardProps
}) => {
  return (
    <Card {...cardProps}>
      <Statistic {...statisticProps} />
    </Card>
  );
};

export default StatCard;
