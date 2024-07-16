import { queryAvailItemList } from '@/services/common';
import { transformToTreeData } from '@/utils/shared';
import {
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  ExclamationCircleFilled,
  HomeOutlined,
  MoreOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import {
  Button,
  Card,
  Descriptions,
  Divider,
  Dropdown,
  Empty,
  List,
  message,
  Modal,
  Space,
  Tag,
  Tree,
  Typography,
} from 'antd';
import { useEffect, useState } from 'react';
import AreaEdit from './components/areaEdit';
import CubicleEdit from './components/cubicleEdit';
import GateEdit from './components/gateEdit';
import RoomDrawer from './components/roomDrawer';
import RoomEdit from './components/roomEdit';
import styles from './index.less';
import {
  delAreaById,
  delRoom,
  getAreaById,
  getRoomInfoById,
  listCubicles,
  listGates,
  listRooms,
  queryAreaTree,
  updateArea,
} from './services';

const Organization = () => {
  const [selectArea, setSelectArea] = useState(null);
  const [areaModalVisible, setAreaModalVisible] = useState(false);
  const [areaModalType, setAreaModalType] = useState(0);
  const [roomModalVisible, setRoomModalVisible] = useState(false);
  const [roomModalType, setRoomModalType] = useState(0); // 0新增 1修改
  const [cibicleModalVisible, setCibicleModalVisibile] = useState(false);
  const [gateModalVisible, setGateModalVisible] = useState(false);
  const [roomData, setRoomData] = useState(null);
  const [cubicleData, setCubicleData] = useState([]);
  const [treeData, setTreeData] = useState([]);
  const [areaData, setAreaData] = useState(null);
  const [areaGateData, setAreaGateData] = useState([]);
  const [roomGateData, setRoomGateData] = useState([]);
  const [areaTypeDict, setAreaTypeDict] = useState([]);
  const [roomTypeDict, setRoomTypeDict] = useState([]);
  const [cubicleTypeDict, setCubicleTypeDict] = useState([]);
  const [roomList, setRoomList] = useState([]);
  const [roomDrawerVisible, setRoomDrawerVisible] = useState(false);
  const [belongTo, setBelongTo] = useState('');
  const [belongToType, setBelongToType] = useState(0); // 0 area 1 room
  const [expanded, setExpanded] = useState(false);

  const fetchRoomDetail = async (roomId) => {
    const roomRes = await getRoomInfoById({ roomId });
    setRoomData(roomRes);
    const cubuicleRes = await listCubicles({ roomId });
    setCubicleData(cubuicleRes);
    const gateRes = await listGates({ belongTo: roomId });
    setRoomGateData(gateRes);
  };

  const fetchAreaDetail = async (areaId) => {
    const res = await getAreaById({ areaId });
    setAreaData(res);
    const gateRes = await listGates({ belongTo: areaId });
    setAreaGateData(gateRes);
  };

  // 分区类型
  const getDict = async () => {
    const areaTypeRes = await queryAvailItemList({ dictCode: 'area_type' });
    setAreaTypeDict(areaTypeRes);
    const roomTypeRes = await queryAvailItemList({ dictCode: 'room_type' });
    setRoomTypeDict(roomTypeRes);
    const cubicleTypeRes = await queryAvailItemList({ dictCode: 'cubicle_type' });
    setCubicleTypeDict(cubicleTypeRes);
  };

  const fetchTree = async () => {
    const res = await queryAreaTree();
    setTreeData(transformToTreeData(res, 'areaId', 'areaName'));
  };

  const fetchListRooms = async (areaId) => {
    const res = await listRooms({ areaId });
    setRoomList(res);
  };

  useEffect(() => {
    getDict();
    fetchTree();
  }, []);

  useEffect(() => {
    if (selectArea?.areaId) {
      fetchAreaDetail(selectArea.areaId);
      fetchListRooms(selectArea.areaId);
    }
  }, [selectArea]);

  // 房间下拉菜单
  const roomMenuItems = [
    {
      label: '查看',
      key: 'query',
    },
    {
      label: '编辑',
      key: 'update',
    },
    {
      label: '工位设置',
      key: 'cubicle',
    },
    {
      label: '出入口管理',
      key: 'gate',
    },
    {
      label: '删除',
      key: 'del',
      danger: true,
    },
  ];

  const handleRoomDetail = (item) => {
    fetchRoomDetail(item.roomId);
    setRoomDrawerVisible(true);
  };

  const handleCubiCle = async (item) => {
    await fetchRoomDetail(item.roomId);
    setCibicleModalVisibile(true);
  };

  const handleGate = async (type, item) => {
    if (type) {
      await fetchRoomDetail(item.roomId);
      setBelongTo(item.roomId);
    } else {
      setBelongTo(item.areaId);
    }
    setBelongToType(type);
    setGateModalVisible(true);
  };

  const handleRoomMenuClick = (item, { key, domEvent }) => {
    domEvent.stopPropagation();
    switch (key) {
      case 'query':
        handleRoomDetail(item);
        break;
      case 'update':
        handleEditRoom(1);
        break;
      case 'cubicle':
        handleCubiCle(item);
        break;
      case 'gate':
        handleGate(1, item);
        break;
      case 'del':
        handleDelRoom(item);
        break;
      default:
        break;
    }
  };

  const onSelect = (selectedKeys, { node }) => {
    setSelectArea(node);
  };

  const onDrop = async (info) => {
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

    const loop = (data, key, callback) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].key === key) {
          return callback(data[i], i, data);
        }
        if (data[i].children) {
          loop(data[i].children, key, callback);
        }
      }
    };

    const data = [...treeData];

    let dragObj;
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    if (!info.dropToGap) {
      loop(data, dropKey, (item) => {
        item.children = item.children || [];
        item.children.unshift(dragObj);
      });
    } else {
      let ar;
      let i;
      loop(data, dropKey, (item, index, arr) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        ar.splice(i, 0, dragObj);
      } else {
        ar.splice(i + 1, 0, dragObj);
      }
    }

    let newParentId;
    if (info.dropToGap) {
      newParentId = info.node.parentId;
    } else {
      newParentId = info.node.key;
    }

    if (newParentId === undefined || newParentId === null || newParentId === '-1') {
      newParentId = '-1';
    }

    dragObj.parentId = newParentId;

    const updateSortNoAndAPI = async (nodes, parentId) => {
      let sortNo = 1;
      for (const node of nodes) {
        if (node.parentId === parentId) {
          if (node.sortNo !== sortNo) {
            node.sortNo = sortNo++;
            const updatedArea = {
              areaId: node.areaId,
              parentId: node.parentId,
              areaName: node.areaName,
              siteCode: node.siteCode,
              areaType: node.areaType,
              sortNo: node.sortNo,
              remarks: node.remarks,
            };

            try {
              const response = await updateArea(updatedArea);
              if (!response) {
                throw new Error('更新失败');
              }
            } catch (error) {
              message.error('区域信息更新失败');
              return;
            }
          } else {
            sortNo++;
          }
        }
        if (node.children && node.children.length > 0) {
          await updateSortNoAndAPI(node.children, node.key);
        }
      }
    };

    const getParentNodeAndChildren = (nodes, parentId) => {
      let parentNode = null;
      const children = [];
      const loop = (data, key) => {
        for (let i = 0; i < data.length; i++) {
          if (data[i].key === key) {
            parentNode = data[i];
            if (data[i].children) {
              children.push(...data[i].children);
            }
          }
          if (data[i].children) {
            loop(data[i].children, key);
          }
        }
      };
      loop(nodes, parentId);
      return { parentNode, children };
    };

    const { parentNode, children } = getParentNodeAndChildren(data, newParentId);
    if (parentNode) {
      await updateSortNoAndAPI(children, newParentId);
    } else {
      await updateSortNoAndAPI(data, '-1');
    }

    setTreeData(data);
    message.success('区域信息更新成功');
  };

  const handleEditArea = (type) => {
    setAreaModalType(type);
    setAreaModalVisible(true);
  };

  const renderAreaType = (val) =>
    areaTypeDict.find((item) => item.itemValue === val)?.itemDesc ?? '-';

  const handleAreaDel = () => {
    Modal.confirm({
      title: `确定要删除区域【${selectArea.areaName}】吗？`,
      icon: <ExclamationCircleFilled />,
      async onOk() {
        const res = await delAreaById(selectArea.areaId);
        if (res) {
          message.success('区域删除成功');
          setSelectArea(null);
          setAreaData(null);
          fetchTree();
        }
      },
      onCancel() {},
    });
  };

  const handleEditRoom = (type) => {
    setRoomModalType(type);
    setRoomModalVisible(true);
  };

  const handleDelRoom = async (room) => {
    const { roomName, roomId } = room;
    Modal.confirm({
      title: `确定要删除房间【${roomName}】吗？`,
      icon: <ExclamationCircleFilled />,
      async onOk() {
        const res = await delRoom(roomId);
        if (res) {
          message.success('房间删除成功');
          fetchListRooms(areaData.areaId);
        }
      },
      onCancel() {},
    });
  };

  const renderRoomType = (val) => {
    if (val) {
      const title = roomTypeDict.find((item) => item.itemValue === val)?.itemDesc;
      return title ? (
        <Tag color="geekblue" style={{ borderRadius: '14px' }}>
          {title}
        </Tag>
      ) : (
        ''
      );
    }
    return null;
  };

  const renderCubicleType = (val) => {
    if (val) {
      const title = cubicleTypeDict.find((item) => item.itemValue === val)?.itemDesc;
      return title || '';
    }
    return null;
  };

  return (
    <PageContainer title={false} className={styles.container}>
      <div className={styles.content}>
        <Card
          className={styles.aside}
          title={'区域'}
          extra={
            <Button type="text" onClick={() => handleEditArea(0)}>
              <PlusOutlined />
            </Button>
          }
        >
          {treeData.length ? (
            <Tree
              showLine
              switcherIcon={<DownOutlined />}
              defaultExpandAll
              treeData={treeData}
              blockNode
              onSelect={onSelect}
              draggable
              onDrop={onDrop}
            />
          ) : (
            <Empty description={'暂无区域'} />
          )}
        </Card>
        <div className={styles.detail}>
          {selectArea?.areaId ? (
            <>
              <Card title={false}>
                <Descriptions
                  title={`${areaData?.areaName} - 基本信息`}
                  extra={
                    <Space>
                      <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => handleEditArea(1)}
                      >
                        修改区域
                      </Button>
                      <Button danger icon={<DeleteOutlined />} onClick={() => handleAreaDel()}>
                        删除区域
                      </Button>
                    </Space>
                  }
                >
                  <Descriptions.Item label="区域类型">
                    {renderAreaType(areaData?.areaType)}
                  </Descriptions.Item>
                  <Descriptions.Item label="场所编码">{areaData?.siteCode}</Descriptions.Item>
                  <Descriptions.Item label="备注">
                    <div>
                      <Typography.Paragraph
                        ellipsis={{
                          rows: 1,
                          expandable: 'collapsible',
                          expanded,
                          onExpand: (_, info) => setExpanded(info.expanded),
                        }}
                      >
                        {areaData?.remarks}
                      </Typography.Paragraph>
                    </div>
                  </Descriptions.Item>
                  <Descriptions.Item label={`出入口（${areaGateData.length}）`}>
                    {areaGateData.length > 0 ? (
                      <>
                        {areaGateData.map((v, index) => (
                          <Tag bordered={false} key={index}>
                            {v.gateName}
                          </Tag>
                        ))}
                      </>
                    ) : (
                      <span>默认</span>
                    )}
                    <Button size="small" type="link" onClick={() => handleGate(0, areaData)}>
                      设置
                    </Button>
                  </Descriptions.Item>
                </Descriptions>
                <Divider />
                <Descriptions
                  title={'房间信息'}
                  extra={
                    <Space>
                      <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => handleEditRoom(0)}
                      >
                        新增房间
                      </Button>
                    </Space>
                  }
                ></Descriptions>
                <List
                  grid={{
                    gutter: 16,
                    xs: 1,
                    sm: 1,
                    md: 2,
                    lg: 2,
                    xl: 3,
                    xxl: 3,
                  }}
                  dataSource={roomList}
                  renderItem={(item) => (
                    <List.Item>
                      <Card
                        size="small"
                        hoverable
                        style={{ backgroundColor: '#E8F2FE' }}
                        title={
                          <Space>
                            <HomeOutlined />
                            {item.roomName}
                          </Space>
                        }
                        onClick={() => {
                          handleRoomDetail(item);
                        }}
                        extra={
                          <Space>
                            {renderRoomType(item.roomType)}
                            <Dropdown
                              menu={{
                                items: roomMenuItems,
                                onClick: (e) => handleRoomMenuClick(item, e),
                              }}
                            >
                              <MoreOutlined />
                            </Dropdown>
                          </Space>
                        }
                      >
                        <p>场所编码： {item.siteCode}</p>
                        <p>工位数量： {item.cubicleNum || 0}</p>
                      </Card>
                    </List.Item>
                  )}
                />
              </Card>
            </>
          ) : (
            <Empty
              style={{ padding: '20px 0', backgroundColor: 'white', height: '100%' }}
              description="请选择区域"
            />
          )}
        </div>
        {areaModalVisible && (
          <AreaEdit
            open={areaModalVisible}
            type={areaModalType}
            data={areaData}
            treeData={treeData}
            areaTypeDict={areaTypeDict}
            refresh={() => {
              fetchTree();
              if (areaData?.areaId) {
                fetchAreaDetail(areaData.areaId);
              }
            }}
            onCancel={() => setAreaModalVisible(false)}
          />
        )}
        {roomModalVisible && (
          <RoomEdit
            open={roomModalVisible}
            type={roomModalType}
            data={roomData}
            areaData={areaData}
            roomTypeDict={roomTypeDict}
            refresh={() => {
              fetchListRooms(areaData.areaId);
            }}
            onCancel={() => setRoomModalVisible(false)}
          />
        )}
        {cibicleModalVisible && (
          <CubicleEdit
            open={cibicleModalVisible}
            cubicleData={cubicleData}
            roomData={roomData}
            cubicleTypeDict={cubicleTypeDict}
            onCancel={() => {
              setCibicleModalVisibile(false);
            }}
            refresh={() => {
              fetchListRooms(areaData.areaId);
              fetchRoomDetail(roomData.roomId);
            }}
          />
        )}
        {gateModalVisible && (
          <GateEdit
            open={gateModalVisible}
            gateData={belongToType ? roomGateData : areaGateData}
            belongTo={belongTo}
            onCancel={() => {
              setGateModalVisible(false);
            }}
            refresh={() => {
              belongToType ? fetchRoomDetail(roomData.roomId) : fetchAreaDetail(areaData.areaId);
            }}
          />
        )}
        <RoomDrawer
          open={roomDrawerVisible}
          data={roomData}
          areaData={areaData}
          cubicleData={cubicleData}
          roomGateData={roomGateData}
          roomTypeDict={roomTypeDict}
          renderRoomType={renderRoomType}
          renderCubicleType={renderCubicleType}
          handleCubiCle={() => handleCubiCle(roomData)}
          handleGate={() => handleGate(1, roomData)}
          onClose={() => {
            setRoomDrawerVisible(false);
          }}
        />
      </div>
    </PageContainer>
  );
};

export default Organization;
