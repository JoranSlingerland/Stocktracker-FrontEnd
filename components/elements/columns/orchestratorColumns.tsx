import type { ColumnsType } from 'antd/es/table';
import { Typography, Button, Popconfirm, Tag } from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { terminateOrchestrator } from '../../services/orchestrator/terminate';
import { purgeOrchestrator } from '../../services/orchestrator/purge';

const { Text } = Typography;

export const orchestratorColumns: ColumnsType = [
  {
    title: 'Status',
    dataIndex: 'runtimeStatus',
    key: 'runtimeStatus',
    render: (text: string) => {
      if (text === 'Completed') {
        return (
          <Tag icon={<CheckCircleOutlined />} color="success">
            {text}
          </Tag>
        );
      } else if (text === 'Failed') {
        return (
          <Tag icon={<CloseCircleOutlined />} color="error">
            {text}
          </Tag>
        );
      } else if (text === 'Suspended' || text === 'Terminated') {
        return (
          <Tag icon={<ExclamationCircleOutlined />} color="warning">
            {text}
          </Tag>
        );
      } else if (text === 'Running' || text === 'Pending') {
        return (
          <Tag icon={<SyncOutlined spin />} color="processing">
            {text}
          </Tag>
        );
      } else {
        return <Tag color="default">{text}</Tag>;
      }
    },
  },
  {
    title: 'Created Time',
    dataIndex: 'createdTime',
    key: 'createdTime',
  },
  {
    title: 'Last Updated Time',
    dataIndex: 'lastUpdatedTime',
    key: 'lastUpdatedTime',
  },
  {
    title: 'Instance ID',
    dataIndex: 'instanceId',
    key: 'instanceId',
    render: (text: string) => <Text copyable>{text}</Text>,
  },
  {
    title: 'Actions',
    dataIndex: 'actions',
    key: 'actions',
    render: (text, record: any) => (
      <>
        <Popconfirm
          title="Are you sure you want to terminate this orchestrator?"
          onConfirm={() => {
            terminateOrchestrator({
              query: {
                instanceId: record.instanceId,
              },
            });
          }}
          okText="Yes"
          cancelText="No"
          arrow={false}
          icon={false}
        >
          <Button
            danger
            disabled={
              record.runtimeStatus === 'Running' ||
              record.runtimeStatus === 'Pending'
                ? false
                : true
            }
            className="mb-1 mr-1"
            size="small"
          >
            Terminate
          </Button>
        </Popconfirm>
        <Popconfirm
          title="Are you sure you want to purge this orchestrator?"
          onConfirm={() => {
            purgeOrchestrator({
              query: {
                instanceId: record.instanceId,
              },
            });
          }}
          okText="Yes"
          cancelText="No"
          arrow={false}
          icon={false}
        >
          <Button size="small" danger>
            Purge
          </Button>
        </Popconfirm>
      </>
    ),
  },
];
